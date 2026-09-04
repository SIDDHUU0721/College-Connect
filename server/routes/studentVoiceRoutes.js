import express from 'express';
import { db } from '../data/store.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET /api/student-voice/reports
router.get('/reports', (req, res) => {
  const { status, category, teacherId, studentId } = req.query;
  let list = db.getStudentReports();

  if (status) list = list.filter(r => r.status.toLowerCase() === status.toLowerCase());
  if (category) list = list.filter(r => r.category.toLowerCase() === category.toLowerCase());
  if (teacherId) list = list.filter(r => r.teacherId === teacherId);
  if (studentId) list = list.filter(r => r.studentId === studentId);

  res.json({ success: true, reports: list });
});

// POST /api/student-voice/reports (Students can submit)
router.post('/reports', authenticateToken, (req, res) => {
  const { title, category, description, subjectId, teacherId } = req.body;

  if (!title || !category || !description) {
    return res.status(400).json({ error: 'Title, category, and description are required.' });
  }

  const subject = subjectId ? db.getSubjects().find(s => s.id === subjectId) : null;
  const teacher = teacherId ? db.getUsers().find(u => u.id === teacherId) : null;

  const newReport = {
    id: `rep-${Date.now()}`,
    title,
    category,
    description,
    subjectId: subjectId || null,
    subjectName: subject ? subject.name : 'General Academic / Campus',
    teacherId: teacherId || (subject && subject.teachers[0] ? subject.teachers[0].id : null),
    teacherName: teacher ? teacher.name : (subject && subject.teachers[0] ? subject.teachers[0].name : 'Department Coordinator'),
    studentId: req.user.id,
    studentName: req.user.name,
    status: 'Submitted', // 'Submitted' -> 'Under Review' -> 'Resolved'
    adminNote: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.getStudentReports().unshift(newReport);
  db.save();

  // Notify Teacher/Admin
  if (newReport.teacherId) {
    db.addNotification({
      userId: newReport.teacherId,
      title: `📬 New Student Voice Report: ${newReport.title}`,
      message: `${req.user.name} submitted a report regarding ${newReport.subjectName}.`,
      type: 'report',
      priority: 'Medium',
      link: '/reports'
    });
  }

  res.status(201).json({ success: true, report: newReport });
});

// PUT /api/student-voice/reports/:id/status (Teachers and Admins can update resolution status)
router.put('/reports/:id/status', authenticateToken, requireRole('teacher', 'admin'), (req, res) => {
  const report = db.getStudentReports().find(r => r.id === req.params.id);
  if (!report) return res.status(404).json({ error: 'Report not found' });

  const { status, adminNote } = req.body;
  if (status) report.status = status;
  if (adminNote !== undefined) report.adminNote = adminNote;

  report.updatedAt = new Date().toISOString();
  db.save();

  // Notify Student
  db.addNotification({
    userId: report.studentId,
    title: `✅ Status Update on Your Report`,
    message: `Your report "${report.title}" status changed to ${report.status}. Note: ${report.adminNote || 'Updated by faculty.'}`,
    type: 'report',
    priority: report.status === 'Resolved' ? 'Low' : 'Medium',
    link: '/reports'
  });

  res.json({ success: true, report });
});

export default router;
