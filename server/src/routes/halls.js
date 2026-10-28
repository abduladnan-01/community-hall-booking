import express from 'express';
import db from '../db.js';

const router = express.Router();

function formatHall(hall) {
  if (!hall) return null;
  return {
    ...hall,
    facilities: typeof hall.facilities === 'string' ? JSON.parse(hall.facilities || '[]') : hall.facilities,
    gallery: typeof hall.gallery === 'string' ? JSON.parse(hall.gallery || '[]') : hall.gallery,
    available_sessions: typeof hall.available_sessions === 'string' ? JSON.parse(hall.available_sessions || '[]') : hall.available_sessions,
    is_active: Boolean(hall.is_active)
  };
}

// Get all active halls
router.get('/', (req, res) => {
  try {
    const halls = db.prepare('SELECT * FROM halls WHERE is_active = 1 ORDER BY id ASC').all();
    const formatted = halls.map(formatHall);
    return res.json({ halls: formatted });
  } catch (err) {
    console.error('[Halls GET Error]:', err);
    return res.status(500).json({ error: 'Failed to fetch halls.' });
  }
});

// Get hall by ID or Slug
router.get('/:idOrSlug', (req, res) => {
  const { idOrSlug } = req.params;
  try {
    let hall;
    if (/^\d+$/.test(idOrSlug)) {
      hall = db.prepare('SELECT * FROM halls WHERE id = ?').get(Number(idOrSlug));
    } else {
      hall = db.prepare('SELECT * FROM halls WHERE slug = ?').get(idOrSlug);
    }

    if (!hall) {
      return res.status(404).json({ error: 'Hall not found.' });
    }

    return res.json({ hall: formatHall(hall) });
  } catch (err) {
    console.error('[Hall Detail Error]:', err);
    return res.status(500).json({ error: 'Failed to retrieve hall details.' });
  }
});

// Check availability for a specific hall and date
router.get('/:id/availability', (req, res) => {
  const hallId = Number(req.params.id);
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: 'Date query parameter (YYYY-MM-DD) is required.' });
  }

  try {
    // Return all bookings on this date for this hall that are Confirmed or Pending
    const existing = db.prepare(`
      SELECT id, booking_id, start_time, end_time, status, event_type
      FROM bookings
      WHERE hall_id = ? AND booking_date = ? AND status IN ('Confirmed', 'Pending')
      ORDER BY start_time ASC
    `).all(hallId, date);

    return res.json({
      hall_id: hallId,
      date,
      booked_slots: existing
    });
  } catch (err) {
    console.error('[Hall Availability Error]:', err);
    return res.status(500).json({ error: 'Failed to fetch availability schedule.' });
  }
});

export default router;

