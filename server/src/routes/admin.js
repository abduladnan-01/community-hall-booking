import express from 'express';
import db from '../db.js';
import { verifyToken, requireAdmin } from '../authMiddleware.js';
import {
  sendBookingConfirmationEmail,
  sendBookingRejectionEmail,
  sendBookingCancellationEmail
} from '../emailService.js';

const router = express.Router();

// Apply strict authentication and administrator authorization
router.use(verifyToken, requireAdmin);

// 1. Dashboard Overview Stats
router.get('/overview', (req, res) => {
  try {
    const totalHalls = db.prepare('SELECT COUNT(*) as count FROM halls').get().count;
    const totalBookings = db.prepare('SELECT COUNT(*) as count FROM bookings').get().count;
    const pendingBookings = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = 'Pending'").get().count;
    const confirmedBookings = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE status = 'Confirmed'").get().count;
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;

    const revenueResult = db.prepare("SELECT SUM(total_amount) as total FROM bookings WHERE status = 'Confirmed'").get();
    const totalRevenue = revenueResult?.total || 0;

    // Monthly bookings distribution
    const recentBookings = db.prepare(`
      SELECT b.*, h.name as hall_name
      FROM bookings b
      JOIN halls h ON b.hall_id = h.id
      ORDER BY b.created_at DESC
      LIMIT 6
    `).all();

    // Hall popularity
    const hallStats = db.prepare(`
      SELECT h.name, COUNT(b.id) as booking_count, COALESCE(SUM(b.total_amount), 0) as hall_revenue
      FROM halls h
      LEFT JOIN bookings b ON h.id = b.hall_id AND b.status = 'Confirmed'
      GROUP BY h.id
    `).all();

    return res.json({
      metrics: {
        totalHalls,
        totalBookings,
        pendingBookings,
        confirmedBookings,
        totalUsers,
        totalRevenue
      },
      recentBookings,
      hallStats
    });
  } catch (err) {
    console.error('[Admin Overview Error]:', err);
    return res.status(500).json({ error: 'Failed to generate overview statistics.' });
  }
});

// 2. Booking Management
// View all bookings with search and filters
router.get('/bookings', (req, res) => {
  const { search, date, hall_id, status } = req.query;

  try {
    let sql = `
      SELECT b.*, h.name as hall_name, h.price_per_session
      FROM bookings b
      JOIN halls h ON b.hall_id = h.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      sql += ` AND (b.booking_id LIKE ? OR b.user_name LIKE ? OR b.user_email LIKE ? OR b.event_type LIKE ?)`;
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term);
    }

    if (date) {
      sql += ` AND b.booking_date = ?`;
      params.push(date);
    }

    if (hall_id) {
      sql += ` AND b.hall_id = ?`;
      params.push(Number(hall_id));
    }

    if (status) {
      sql += ` AND b.status = ?`;
      params.push(status);
    }

    sql += ` ORDER BY b.booking_date DESC, b.start_time DESC`;

    const bookings = db.prepare(sql).all(...params);
    return res.json({ bookings });
  } catch (err) {
    console.error('[Admin Bookings GET Error]:', err);
    return res.status(500).json({ error: 'Failed to fetch bookings.' });
  }
});

// Approve a booking (Dispatches Confirmation Email)
router.post('/bookings/:id/approve', async (req, res) => {
  const id = Number(req.params.id);

  try {
    const booking = db.prepare(`
      SELECT b.*, h.name as hall_name
      FROM bookings b
      JOIN halls h ON b.hall_id = h.id
      WHERE b.id = ?
    `).get(id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    const now = new Date().toISOString();
    db.prepare('UPDATE bookings SET status = ?, updated_at = ? WHERE id = ?').run('Confirmed', now, id);

    const updatedBooking = { ...booking, status: 'Confirmed' };
    const hall = db.prepare('SELECT * FROM halls WHERE id = ?').get(booking.hall_id);

    // Trigger confirmation email
    try {
      await sendBookingConfirmationEmail(updatedBooking, hall);
    } catch (err) {
      console.error('[Approve Email Error]:', err);
    }

    return res.json({
      message: `Booking ${booking.booking_id} approved. Confirmation email dispatched to ${booking.user_email}.`,
      booking: updatedBooking
    });
  } catch (err) {
    console.error('[Admin Approve Error]:', err);
    return res.status(500).json({ error: 'Failed to approve booking.' });
  }
});

// Reject a booking (Dispatches Rejection Email with reason)
router.post('/bookings/:id/reject', async (req, res) => {
  const id = Number(req.params.id);
  const { reason } = req.body;

  try {
    const booking = db.prepare(`
      SELECT b.*, h.name as hall_name
      FROM bookings b
      JOIN halls h ON b.hall_id = h.id
      WHERE b.id = ?
    `).get(id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    const rejectionReason = reason || 'Venue unavailable or maintenance conflict.';
    const now = new Date().toISOString();

    db.prepare('UPDATE bookings SET status = ?, rejection_reason = ?, updated_at = ? WHERE id = ?').run(
      'Rejected',
      rejectionReason,
      now,
      id
    );

    const updatedBooking = { ...booking, status: 'Rejected', rejection_reason: rejectionReason };
    const hall = db.prepare('SELECT * FROM halls WHERE id = ?').get(booking.hall_id);

    // Trigger rejection email
    try {
      await sendBookingRejectionEmail(updatedBooking, hall, rejectionReason);
    } catch (err) {
      console.error('[Reject Email Error]:', err);
    }

    return res.json({
      message: `Booking ${booking.booking_id} rejected. Rejection notice dispatched to ${booking.user_email}.`,
      booking: updatedBooking
    });
  } catch (err) {
    console.error('[Admin Reject Error]:', err);
    return res.status(500).json({ error: 'Failed to reject booking.' });
  }
});

// Cancel a booking
router.post('/bookings/:id/cancel', async (req, res) => {
  const id = Number(req.params.id);

  try {
    const booking = db.prepare(`
      SELECT b.*, h.name as hall_name
      FROM bookings b
      JOIN halls h ON b.hall_id = h.id
      WHERE b.id = ?
    `).get(id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    const now = new Date().toISOString();
    db.prepare('UPDATE bookings SET status = ?, updated_at = ? WHERE id = ?').run('Cancelled', now, id);

    const updatedBooking = { ...booking, status: 'Cancelled' };
    const hall = db.prepare('SELECT * FROM halls WHERE id = ?').get(booking.hall_id);

    // Trigger cancellation email
    sendBookingCancellationEmail(updatedBooking, hall).catch(err =>
      console.error('[Cancel Email Error]:', err)
    );

    return res.json({
      message: `Booking ${booking.booking_id} marked as cancelled.`,
      booking: updatedBooking
    });
  } catch (err) {
    console.error('[Admin Cancel Error]:', err);
    return res.status(500).json({ error: 'Failed to cancel booking.' });
  }
});

// Update booking status directly
router.patch('/bookings/:id/status', (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;

  const validStatuses = ['Pending', 'Confirmed', 'Rejected', 'Cancelled', 'Completed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status provided.' });
  }

  try {
    const now = new Date().toISOString();
    db.prepare('UPDATE bookings SET status = ?, updated_at = ? WHERE id = ?').run(status, now, id);
    const updated = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);
    return res.json({ message: 'Booking status updated.', booking: updated });
  } catch (err) {
    console.error('[Admin Status Update Error]:', err);
    return res.status(500).json({ error: 'Failed to update status.' });
  }
});

// 3. Hall Management
// Create a new hall
router.post('/halls', (req, res) => {
  const {
    name,
    capacity,
    price_per_session,
    description,
    short_description,
    suitable_for,
    facilities,
    image_url,
    gallery,
    rules,
    cancellation_policy,
    available_sessions
  } = req.body;

  if (!name || !capacity || !price_per_session || !description) {
    return res.status(400).json({ error: 'Name, capacity, price_per_session, and description are required.' });
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);
  const now = new Date().toISOString();

  try {
    const result = db.prepare(`
      INSERT INTO halls (
        name, slug, capacity, price_per_session, description, short_description,
        suitable_for, facilities, image_url, gallery, rules, cancellation_policy,
        available_sessions, is_active, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
    `).run(
      name.trim(),
      slug,
      Number(capacity),
      Number(price_per_session),
      description.trim(),
      short_description ? short_description.trim() : null,
      suitable_for ? suitable_for.trim() : null,
      typeof facilities === 'string' ? facilities : JSON.stringify(facilities || []),
      image_url || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1400&q=80',
      typeof gallery === 'string' ? gallery : JSON.stringify(gallery || []),
      rules || 'Standard hall rules apply.',
      cancellation_policy || 'Standard cancellation policy applies.',
      typeof available_sessions === 'string' ? available_sessions : JSON.stringify(available_sessions || []),
      now
    );

    const newHall = db.prepare('SELECT * FROM halls WHERE id = ?').get(result.lastInsertRowid);
    return res.status(201).json({ message: 'Hall created successfully.', hall: newHall });
  } catch (err) {
    console.error('[Admin Hall Create Error]:', err);
    return res.status(500).json({ error: 'Failed to create hall.' });
  }
});

// Update hall details
router.put('/halls/:id', (req, res) => {
  const id = Number(req.params.id);
  const {
    name,
    capacity,
    price_per_session,
    description,
    short_description,
    suitable_for,
    facilities,
    image_url,
    gallery,
    rules,
    cancellation_policy,
    available_sessions,
    is_active
  } = req.body;

  try {
    const hall = db.prepare('SELECT * FROM halls WHERE id = ?').get(id);
    if (!hall) {
      return res.status(404).json({ error: 'Hall not found.' });
    }

    db.prepare(`
      UPDATE halls SET
        name = ?,
        capacity = ?,
        price_per_session = ?,
        description = ?,
        short_description = ?,
        suitable_for = ?,
        facilities = ?,
        image_url = ?,
        gallery = ?,
        rules = ?,
        cancellation_policy = ?,
        available_sessions = ?,
        is_active = ?
      WHERE id = ?
    `).run(
      name !== undefined ? name.trim() : hall.name,
      capacity !== undefined ? Number(capacity) : hall.capacity,
      price_per_session !== undefined ? Number(price_per_session) : hall.price_per_session,
      description !== undefined ? description.trim() : hall.description,
      short_description !== undefined ? short_description : hall.short_description,
      suitable_for !== undefined ? suitable_for : hall.suitable_for,
      facilities !== undefined ? (typeof facilities === 'string' ? facilities : JSON.stringify(facilities)) : hall.facilities,
      image_url !== undefined ? image_url : hall.image_url,
      gallery !== undefined ? (typeof gallery === 'string' ? gallery : JSON.stringify(gallery)) : hall.gallery,
      rules !== undefined ? rules : hall.rules,
      cancellation_policy !== undefined ? cancellation_policy : hall.cancellation_policy,
      available_sessions !== undefined ? (typeof available_sessions === 'string' ? available_sessions : JSON.stringify(available_sessions)) : hall.available_sessions,
      is_active !== undefined ? (is_active ? 1 : 0) : hall.is_active,
      id
    );

    const updated = db.prepare('SELECT * FROM halls WHERE id = ?').get(id);
    return res.json({ message: 'Hall updated successfully.', hall: updated });
  } catch (err) {
    console.error('[Admin Hall Update Error]:', err);
    return res.status(500).json({ error: 'Failed to update hall.' });
  }
});

// Delete hall
router.delete('/halls/:id', (req, res) => {
  const id = Number(req.params.id);

  try {
    const hall = db.prepare('SELECT id FROM halls WHERE id = ?').get(id);
    if (!hall) {
      return res.status(404).json({ error: 'Hall not found.' });
    }

    db.prepare('DELETE FROM halls WHERE id = ?').run(id);
    return res.json({ message: 'Hall deleted successfully.' });
  } catch (err) {
    console.error('[Admin Hall Delete Error]:', err);
    return res.status(500).json({ error: 'Failed to delete hall.' });
  }
});

// Toggle hall availability
router.patch('/halls/:id/toggle-active', (req, res) => {
  const id = Number(req.params.id);
  try {
    const hall = db.prepare('SELECT id, is_active FROM halls WHERE id = ?').get(id);
    if (!hall) return res.status(404).json({ error: 'Hall not found.' });

    const newStatus = hall.is_active ? 0 : 1;
    db.prepare('UPDATE halls SET is_active = ? WHERE id = ?').run(newStatus, id);

    return res.json({ message: 'Hall availability toggled.', is_active: Boolean(newStatus) });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to toggle hall availability.' });
  }
});

// 4. User Management
router.get('/users', (req, res) => {
  const { search } = req.query;

  try {
    let sql = 'SELECT id, name, email, phone, role, created_at FROM users WHERE 1=1';
    const params = [];

    if (search) {
      sql += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    sql += ' ORDER BY created_at DESC';
    const users = db.prepare(sql).all(...params);

    // Attach booking counts for each user
    const usersWithStats = users.map(u => {
      const bCount = db.prepare('SELECT COUNT(*) as count FROM bookings WHERE user_email = ?').get(u.email).count;
      return { ...u, booking_count: bCount };
    });

    return res.json({ users: usersWithStats });
  } catch (err) {
    console.error('[Admin Users GET Error]:', err);
    return res.status(500).json({ error: 'Failed to retrieve users.' });
  }
});

// 5. Admin Email Settings & Template Editor
router.get('/email-settings', (req, res) => {
  try {
    const rows = db.prepare('SELECT key, value FROM admin_settings').all();
    const settings = {};
    for (const r of rows) {
      settings[r.key] = r.value;
    }
    return res.json({ settings });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve email settings.' });
  }
});

router.put('/email-settings', (req, res) => {
  const updates = req.body; // key-value pairs

  try {
    const updateStmt = db.prepare(`
      INSERT INTO admin_settings (key, value)
      VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `);

    for (const [key, value] of Object.entries(updates)) {
      updateStmt.run(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
    }

    return res.json({ message: 'Settings updated successfully.' });
  } catch (err) {
    console.error('[Admin Settings Update Error]:', err);
    return res.status(500).json({ error: 'Failed to update settings.' });
  }
});

// View Email Delivery History
router.get('/email-logs', (req, res) => {
  try {
    const logs = db.prepare('SELECT * FROM email_notifications ORDER BY sent_at DESC LIMIT 50').all();
    return res.json({ logs });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve email logs.' });
  }
});

export default router;
