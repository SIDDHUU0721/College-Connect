import jwt from 'jsonwebtoken';
import { db } from '../data/store.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'collegeconnect_super_secret_jwt_key_2026';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.getUsers().find(u => u.id === decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Invalid user session or user deleted.' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access Denied: Only ${allowedRoles.join(' or ')} can perform this action.`
      });
    }
    next();
  };
}
