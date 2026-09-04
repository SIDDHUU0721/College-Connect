import express from 'express';
import { db } from '../data/store.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/notifications
router.get('/', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const list = db.getNotifications().filter(n => n.userId === userId || n.userId === 'all_students' || (req.user.role === 'teacher' && n.userId === 'all_teachers'));
  const unreadCount = list.filter(n => !n.read).length;
  res.json({ success: true, notifications: list, unreadCount });
});

// POST /api/notifications/:id/read
router.post('/:id/read', authenticateToken, (req, res) => {
  const notif = db.getNotifications().find(n => n.id === req.params.id);
  if (notif) {
    notif.read = true;
    db.save();
  }
  res.json({ success: true });
});

// POST /api/notifications/read-all
router.post('/read-all', authenticateToken, (req, res) => {
  const userId = req.user.id;
  db.getNotifications().forEach(n => {
    if (n.userId === userId || n.userId === 'all_students') {
      n.read = true;
    }
  });
  db.save();
  res.json({ success: true });
});

export default router;
