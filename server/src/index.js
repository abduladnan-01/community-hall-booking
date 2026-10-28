import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import db, { initDatabase } from './db.js';
import { initMailer } from './emailService.js';
import authRoutes from './routes/auth.js';
import hallsRoutes from './routes/halls.js';
import bookingsRoutes from './routes/bookings.js';
import adminRoutes from './routes/admin.js';
import settingsRoutes from './routes/settings.js';
import inquiriesRoutes from './routes/inquiries.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize DB schema & seed data
initDatabase();

// Initialize Nodemailer
initMailer().catch(err => console.error('[Mailer Init Error]:', err));

// Public route to inspect notifications for demo & testing
app.get('/api/notifications/recent', (req, res) => {
  const { email, booking_id } = req.query;
  try {
    let sql = 'SELECT * FROM email_notifications WHERE 1=1';
    const params = [];

    if (email) {
      sql += ' AND LOWER(recipient_email) = ?';
      params.push(email.toLowerCase().trim());
    }

    if (booking_id) {
      sql += ' AND booking_id = ?';
      params.push(booking_id.trim());
    }

    sql += ' ORDER BY sent_at DESC LIMIT 15';
    const logs = db.prepare(sql).all(...params);
    return res.json({ notifications: logs });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve notifications.' });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/halls', hallsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/inquiries', inquiriesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'Riverside Community Hall API',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend in production build if client/dist exists
const clientDistPath = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('Riverside Community Hall API Server is running. Client is in dev mode on port 5173.');
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`===================================================`);
  console.log(`🏛️ Riverside Community Hall Server running on port ${PORT}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  console.log(`👤 Admin: abdulayman077@gmail.com`);
  console.log(`===================================================`);
});

