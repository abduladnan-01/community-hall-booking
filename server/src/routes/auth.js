import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.js';
import { signToken, verifyToken } from '../authMiddleware.js';

const router = express.Router();
const AUTHORIZED_ADMIN_EMAIL = 'abdulayman077@gmail.com';

// Register
router.post('/register', (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Check existing user
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists.' });
  }

  // Determine role: abdulayman077@gmail.com is granted admin; others are user
  const role = normalizedEmail === AUTHORIZED_ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user';

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);

  try {
    const result = db.prepare(`
      INSERT INTO users (name, email, password_hash, phone, role, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(name.trim(), normalizedEmail, passwordHash, phone ? phone.trim() : null, role, new Date().toISOString());

    const newUser = db.prepare('SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?').get(result.lastInsertRowid);
    const token = signToken(newUser);

    return res.status(201).json({
      message: 'Account created successfully.',
      user: newUser,
      token
    });
  } catch (err) {
    console.error('[Auth Register Error]:', err);
    return res.status(500).json({ error: 'Internal server error creating account.' });
  }
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const isMatch = bcrypt.compareSync(password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    created_at: user.created_at
  };

  const token = signToken(safeUser);
  return res.json({
    message: 'Login successful.',
    user: safeUser,
    token
  });
});

// Get Current User
router.get('/me', verifyToken, (req, res) => {
  return res.json({ user: req.user });
});

export default router;

