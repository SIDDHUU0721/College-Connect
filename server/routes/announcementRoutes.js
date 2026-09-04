import express from 'express';
import { db } from '../data/store.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { analyzeAnnouncement } from '../utils/nlpEngine.js';

const router = express.Router();

// GET /api/announcements
router.get('/', (req, res) => {
  const { category, priority, subjectId, search } = req.query;
  let list = db.getAnnouncements();

  if (category) list = list.filter(a => a.category.toLowerCase() === category.toLowerCase());
  if (priority) list = list.filter(a => a.priority.toLowerCase() === priority.toLowerCase());
  if (subjectId) list = list.filter(a => a.subjectId === subjectId);
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.content.toLowerCase().includes(q) ||
      (a.action && a.action.toLowerCase().includes(q)) ||
      (a.teacherName && a.teacherName.toLowerCase().includes(q))
    );
  }

  res.json({ success: true, announcements: list });
});

// GET /api/announcements/:id
router.get('/:id', (req, res) => {
  const item = db.getAnnouncements().find(a => a.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Announcement not found' });
  res.json({ success: true, announcement: item });
});

// POST /api/announcements (Teachers & Admins only, with automatic NLP analysis)
router.post('/', authenticateToken, requireRole('teacher', 'admin'), (req, res) => {
  const { title, content, subjectId, category, priority, deadline, action, department, targetYear } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }

  // Run NLP automatic analysis
  const nlpAnalysis = analyzeAnnouncement(content);

  const subject = subjectId ? db.getSubjects().find(s => s.id === subjectId) : null;
  const subjectName = subject ? subject.name : (nlpAnalysis.subject || 'General Academic');

  const newAnn = {
    id: `ann-${Date.now()}`,
    title,
    content,
    teacherId: req.user.id,
    teacherName: req.user.name,
    subjectId: subjectId || null,
    subjectName,
    category: category || nlpAnalysis.category || 'General',
    department: department || nlpAnalysis.department || req.user.department || 'All Departments',
    targetYear: targetYear || nlpAnalysis.year || 'All Years',
    priority: priority || nlpAnalysis.priority || 'Medium',
    deadline: deadline || nlpAnalysis.deadline || null,
    action: action || nlpAnalysis.action || 'Stay updated with official announcement',
    isNew: true,
    isUpdated: false,
    lastEditedBy: req.user.name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.getAnnouncements().unshift(newAnn);
  db.save();

  // Record Audit
  db.recordAudit({
    userId: req.user.id,
    userName: req.user.name,
    userRole: req.user.role,
    action: 'CREATE_ANNOUNCEMENT',
    entityType: 'Announcement',
    entityId: newAnn.id,
    entityTitle: newAnn.title,
    subjectName,
    oldValue: null,
    newValue: { title: newAnn.title, category: newAnn.category, priority: newAnn.priority, deadline: newAnn.deadline },
    changeSummary: `Published new [${newAnn.priority} Priority] announcement for ${subjectName}`
  });

  // Notify Students
  db.addNotification({
    userId: 'all_students',
    title: `${newAnn.priority === 'High' ? '🔴' : '📢'} New Announcement: ${newAnn.title}`,
    message: `${req.user.name}: ${newAnn.content.slice(0, 100)}...`,
    type: 'announcement',
    priority: newAnn.priority,
    link: `/announcements`
  });

  res.status(201).json({ success: true, announcement: newAnn, nlpExtracted: nlpAnalysis });
});

// PUT /api/announcements/:id (Teachers own or Admin)
router.put('/:id', authenticateToken, requireRole('teacher', 'admin'), (req, res) => {
  const ann = db.getAnnouncements().find(a => a.id === req.params.id);
  if (!ann) return res.status(404).json({ error: 'Announcement not found' });

  if (req.user.role !== 'admin' && ann.teacherId !== req.user.id) {
    return res.status(403).json({ error: 'You can only edit announcements created by yourself.' });
  }

  const oldState = { title: ann.title, content: ann.content, deadline: ann.deadline, priority: ann.priority, action: ann.action };
  const { title, content, priority, deadline, action, category } = req.body;

  if (title) ann.title = title;
  if (content) ann.content = content;
  if (priority) ann.priority = priority;
  if (deadline !== undefined) ann.deadline = deadline;
  if (action) ann.action = action;
  if (category) ann.category = category;

  ann.isUpdated = true;
  ann.updatedAt = new Date().toISOString();
  ann.lastEditedBy = req.user.name;
  db.save();

  // Record Audit Log with Change Diff
  db.recordAudit({
    userId: req.user.id,
    userName: req.user.name,
    userRole: req.user.role,
    action: 'UPDATE_ANNOUNCEMENT',
    entityType: 'Announcement',
    entityId: ann.id,
    entityTitle: ann.title,
    subjectName: ann.subjectName,
    oldValue: oldState,
    newValue: { title: ann.title, content: ann.content, deadline: ann.deadline, priority: ann.priority, action: ann.action },
    changeSummary: `Modified announcement details for ${ann.title}`
  });

  res.json({ success: true, announcement: ann });
});

// DELETE /api/announcements/:id
router.delete('/:id', authenticateToken, requireRole('teacher', 'admin'), (req, res) => {
  const idx = db.getAnnouncements().findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Announcement not found' });

  const ann = db.getAnnouncements()[idx];
  if (req.user.role !== 'admin' && ann.teacherId !== req.user.id) {
    return res.status(403).json({ error: 'You can only delete announcements created by yourself.' });
  }

  db.getAnnouncements().splice(idx, 1);
  db.save();

  // Audit
  db.recordAudit({
    userId: req.user.id,
    userName: req.user.name,
    userRole: req.user.role,
    action: 'DELETE_ANNOUNCEMENT',
    entityType: 'Announcement',
    entityId: ann.id,
    entityTitle: ann.title,
    subjectName: ann.subjectName,
    oldValue: ann,
    newValue: null,
    changeSummary: `Deleted announcement: ${ann.title}`
  });

  res.json({ success: true, message: 'Announcement deleted successfully' });
});

export default router;
