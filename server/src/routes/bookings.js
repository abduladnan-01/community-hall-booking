import express from 'express';
import crypto from 'node:crypto';
import db from '../db.js';
import { optionalToken, verifyToken } from '../authMiddleware.js';
import {
  sendBookingPendingEmail,
  sendAdminBookingAlert,
  sendBookingCancellationEmail
} from '../emailService.js';

const router = express.Router();

// Helper to convert 'HH:MM' to minutes from midnight
function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

// Generate human-friendly unique booking reference e.g. RCH-2026-7842
function generateBookingId() {
  const year = new Date().getFullYear();
  const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `RCH-${year}-${randomPart}`;
}

// Overlap validation helper
function checkSlotConflict(hallId, date, startTime, endTime, excludeBookingId = null) {
  let query = `
    SELECT id, booking_id, start_time, end_time, status, event_type
    FROM bookings
    WHERE hall_id = ? 
      AND booking_date = ? 
      AND status IN ('Confirmed', 'Pending')
  `;
  const params = [hallId, date];

  if (excludeBookingId) {
    query += ` AND id != ?`;
    params.push(excludeBookingId);
  }

  const existingBookings = db.prepare(query).all(...params);

  const reqStart = timeToMinutes(startTime);
  const reqEnd = timeToMinutes(endTime);

  for (const b of existingBookings) {
    const existStart = timeToMinutes(b.start_time);
    const existEnd = timeToMinutes(b.end_time);

    // Overlap condition: reqStart < existEnd AND reqEnd > existStart
    if (reqStart < existEnd && reqEnd > existStart) {
      return {
        hasConflict: true,
        conflictingBooking: b
      };
    }
  }

  return { hasConflict: false };
}

// 1. Availability check endpoint
router.post('/check-availability', (req, res) => {
  const { hall_id, booking_date, start_time, end_time } = req.body;

  if (!hall_id || !booking_date || !start_time || !end_time) {
    return res.status(400).json({ error: 'Missing required parameters: hall_id, booking_date, start_time, end_time.' });
  }

  const startMin = timeToMinutes(start_time);
  const endMin = timeToMinutes(end_time);

  if (endMin <= startMin) {
    return res.status(400).json({ error: 'End time must be later than start time.' });
  }

  const conflict = checkSlotConflict(Number(hall_id), booking_date, start_time, end_time);
  if (conflict.hasConflict) {
    return res.json({
      available: false,
      message: `The selected time slot overlaps with an existing ${conflict.conflictingBooking.status.toLowerCase()} booking (${conflict.conflictingBooking.start_time} - ${conflict.conflictingBooking.end_time}).`,
      conflict: conflict.conflictingBooking
    });
  }

  return res.json({
    available: true,
    message: 'Selected time slot is available!'
  });
});

// 2. Submit new booking request
router.post('/', optionalToken, async (req, res) => {
  const {
    hall_id,
    user_name,
    user_email,
    user_phone,
    event_type,
    booking_date,
    start_time,
    end_time,
    guest_count,
    additional_requirements
  } = req.body;

  // Validation
  if (!hall_id || !user_name || !user_email || !user_phone || !event_type || !booking_date || !start_time || !end_time) {
    return res.status(400).json({ error: 'Please provide all required fields.' });
  }

  const guests = Number(guest_count) || 1;
  const startMin = timeToMinutes(start_time);
  const endMin = timeToMinutes(end_time);

  if (endMin <= startMin) {
    return res.status(400).json({ error: 'End time must be after start time.' });
  }

  // Verify Hall
  const hall = db.prepare('SELECT * FROM halls WHERE id = ? AND is_active = 1').get(Number(hall_id));
  if (!hall) {
    return res.status(404).json({ error: 'Selected hall not found or is currently inactive.' });
  }

  // Capacity validation
  if (guests > hall.capacity) {
    return res.status(400).json({
      error: `Number of guests (${guests}) exceeds maximum capacity of ${hall.name} (${hall.capacity} guests).`
    });
  }

  // Date validation (must not be past date)
  const today = new Date().toISOString().split('T')[0];
  if (booking_date < today) {
    return res.status(400).json({ error: 'Booking date cannot be in the past.' });
  }

  // PREVENT DOUBLE BOOKING: Overlap Check
  const conflict = checkSlotConflict(hall.id, booking_date, start_time, end_time);
  if (conflict.hasConflict) {
    return res.status(409).json({
      error: `Double booking prevented: The requested time slot (${start_time} - ${end_time}) on ${booking_date} overlaps with an existing reservation. Please select another slot.`,
      conflict: conflict.conflictingBooking
    });
  }

  // Calculate pricing based on duration & hall rate
  const durationHours = (endMin - startMin) / 60;
  // A standard session covers up to 5 hours. Multi-session scales appropriately
  const sessionCount = Math.max(1, Math.ceil(durationHours / 5));
  const totalAmount = hall.price_per_session * sessionCount;

  const bookingId = generateBookingId();
  const userId = req.user ? req.user.id : null;
  const now = new Date().toISOString();

  try {
    const insertResult = db.prepare(`
      INSERT INTO bookings (
        booking_id, user_id, hall_id, user_name, user_email, user_phone,
        event_type, booking_date, start_time, end_time, guest_count,
        additional_requirements, total_amount, status, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?, ?)
    `).run(
      bookingId,
      userId,
      hall.id,
      user_name.trim(),
      user_email.trim().toLowerCase(),
      user_phone.trim(),
      event_type.trim(),
      booking_date,
      start_time,
      end_time,
      guests,
      additional_requirements ? additional_requirements.trim() : null,
      totalAmount,
      now,
      now
    );

    const savedBooking = db.prepare(`
      SELECT b.*, h.name as hall_name, h.slug as hall_slug
      FROM bookings b
      JOIN halls h ON b.hall_id = h.id
      WHERE b.id = ?
    `).get(insertResult.lastInsertRowid);

    // Send email notifications:
    // 1. Pending email to user
    // 2. Alert email to admin
    try {
      await Promise.allSettled([
        sendBookingPendingEmail(savedBooking, hall),
        sendAdminBookingAlert(savedBooking, hall)
      ]);
    } catch (e) {
      console.error('[Email Notification Error]:', e);
    }

    return res.status(201).json({
      message: 'Booking request submitted successfully! An email notification has been dispatched.',
      booking: savedBooking
    });
  } catch (err) {
    console.error('[Booking Insert Error]:', err);
    return res.status(500).json({ error: 'Failed to record booking request. Please try again.' });
  }
});

// 3. User lookup by booking ID or user email
router.get('/lookup', (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: 'Search query (Booking ID or Email) is required.' });
  }

  const cleanQuery = query.trim();
  try {
    let bookings;
    if (cleanQuery.toUpperCase().startsWith('RCH-')) {
      bookings = db.prepare(`
        SELECT b.*, h.name as hall_name, h.price_per_session
        FROM bookings b
        JOIN halls h ON b.hall_id = h.id
        WHERE b.booking_id = ?
      `).all(cleanQuery.toUpperCase());
    } else {
      bookings = db.prepare(`
        SELECT b.*, h.name as hall_name, h.price_per_session
        FROM bookings b
        JOIN halls h ON b.hall_id = h.id
        WHERE LOWER(b.user_email) = ?
        ORDER BY b.booking_date DESC
      `).all(cleanQuery.toLowerCase());
    }

    return res.json({ bookings });
  } catch (err) {
    console.error('[Booking Lookup Error]:', err);
    return res.status(500).json({ error: 'Failed to lookup booking.' });
  }
});

// 4. Cancel booking (by user with booking reference)
router.post('/:bookingId/cancel', async (req, res) => {
  const { bookingId } = req.params;
  const { email } = req.body;

  try {
    const booking = db.prepare(`
      SELECT b.*, h.name as hall_name
      FROM bookings b
      JOIN halls h ON b.hall_id = h.id
      WHERE b.booking_id = ?
    `).get(bookingId);

    if (!booking) {
      return res.status(404).json({ error: 'Booking reference not found.' });
    }

    // Optional email confirmation if not authenticated
    if (email && booking.user_email.toLowerCase() !== email.toLowerCase().trim()) {
      return res.status(403).json({ error: 'Provided email does not match the booking record.' });
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({ error: 'This booking is already cancelled.' });
    }

    const now = new Date().toISOString();
    db.prepare('UPDATE bookings SET status = ?, updated_at = ? WHERE id = ?').run('Cancelled', now, booking.id);

    const updated = { ...booking, status: 'Cancelled' };
    const hall = db.prepare('SELECT * FROM halls WHERE id = ?').get(booking.hall_id);

    // Send cancellation email notification
    sendBookingCancellationEmail(updated, hall).catch(err => console.error('[Cancel Email Error]:', err));

    return res.json({
      message: 'Booking cancelled successfully. A confirmation email has been sent.',
      booking: updated
    });
  } catch (err) {
    console.error('[Booking Cancel Error]:', err);
    return res.status(500).json({ error: 'Failed to cancel booking.' });
  }
});

export default router;
