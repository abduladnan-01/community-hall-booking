import jwt from 'jsonwebtoken';
import db from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'riverside_community_hall_secret_key_2026';
const AUTHORIZED_ADMIN_EMAIL = 'abdulayman077@gmail.com';

export function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Double check user still exists in DB
    const user = db.prepare('SELECT id, name, email, phone, role FROM users WHERE id = ?').get(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User no longer exists.' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  const normalizedEmail = req.user.email.trim().toLowerCase();
  if (req.user.role !== 'admin' || normalizedEmail !== AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
    return res.status(403).json({
      error: 'Access denied. Only the authorized administrator (abdulayman077@gmail.com) can access this resource.'
    });
  }

  next();
}

export function optionalToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = db.prepare('SELECT id, name, email, phone, role FROM users WHERE id = ?').get(decoded.id);
      if (user) {
        req.user = user;
      }
    } catch {
      // Ignore invalid token for optional auth
    }
  }
  next();
}

