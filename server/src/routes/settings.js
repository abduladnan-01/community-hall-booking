import express from 'express';
import db from '../db.js';
import { verifyToken, requireAdmin } from '../authMiddleware.js';

const router = express.Router();

// Public: Get building details
router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT key, value FROM admin_settings').all();
    const settings = {};
    for (const r of rows) {
      if (r.key === 'building_facilities') {
        try {
          settings[r.key] = JSON.parse(r.value);
        } catch {
          settings[r.key] = [];
        }
      } else {
        settings[r.key] = r.value;
      }
    }

    return res.json({ settings });
  } catch (err) {
    console.error('[Settings GET Error]:', err);
    return res.status(500).json({ error: 'Failed to retrieve settings.' });
  }
});

// Admin: Update building details
router.put('/', verifyToken, requireAdmin, (req, res) => {
  const updates = req.body;

  try {
    const upsertStmt = db.prepare(`
      INSERT INTO admin_settings (key, value)
      VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `);

    for (const [key, value] of Object.entries(updates)) {
      upsertStmt.run(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
    }

    return res.json({ message: 'Building settings updated successfully.' });
  } catch (err) {
    console.error('[Settings PUT Error]:', err);
    return res.status(500).json({ error: 'Failed to update building settings.' });
  }
});

export default router;

