import express from 'express';
import db from '../db.js';
import { verifyToken, requireAdmin } from '../authMiddleware.js';

const router = express.Router();

// Public: Submit contact inquiry
router.post('/', (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  try {
    const result = db.prepare(`
      INSERT INTO inquiries (name, email, subject, message, status, created_at)
      VALUES (?, ?, ?, ?, 'unread', ?)
    `).run(name.trim(), email.trim(), (subject || 'General Inquiry').trim(), message.trim(), new Date().toISOString());

    return res.status(201).json({
      message: 'Thank you for your message! Our administration will respond shortly.',
      inquiry_id: result.lastInsertRowid
    });
  } catch (err) {
    console.error('[Inquiries POST Error]:', err);
    return res.status(500).json({ error: 'Failed to submit contact inquiry.' });
  }
});

// Admin: Get all inquiries
router.get('/', verifyToken, requireAdmin, (req, res) => {
  try {
    const inquiries = db.prepare('SELECT * FROM inquiries ORDER BY created_at DESC').all();
    return res.json({ inquiries });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch inquiries.' });
  }
});

// Admin: Update inquiry status (read, resolved)
router.patch('/:id/status', verifyToken, requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;

  try {
    db.prepare('UPDATE inquiries SET status = ? WHERE id = ?').run(status, id);
    return res.json({ message: 'Inquiry updated.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update inquiry.' });
  }
});

export default router;

