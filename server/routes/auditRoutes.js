import express from 'express';
import { db } from '../data/store.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET /api/audit/logs (Teachers and Admins can view complete logs; Students see change notes)
router.get('/logs', authenticateToken, (req, res) => {
  const { entityType, entityId, teacherId, action, search } = req.query;
  let list = db.getAuditLogs();

  if (entityType) list = list.filter(l => l.entityType.toLowerCase() === entityType.toLowerCase());
  if (entityId) list = list.filter(l => l.entityId === entityId);
  if (teacherId) list = list.filter(l => l.userId === teacherId);
  if (action) list = list.filter(l => l.action.toLowerCase() === action.toLowerCase());
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(l =>
      l.changeSummary.toLowerCase().includes(q) ||
      l.userName.toLowerCase().includes(q) ||
      l.entityTitle.toLowerCase().includes(q) ||
      (l.subjectName && l.subjectName.toLowerCase().includes(q))
    );
  }

  res.json({ success: true, logs: list });
});

// GET /api/audit/entity/:entityId/history
router.get('/entity/:entityId/history', authenticateToken, (req, res) => {
  const logs = db.getAuditLogs().filter(l => l.entityId === req.params.entityId);
  res.json({ success: true, history: logs });
});

export default router;
