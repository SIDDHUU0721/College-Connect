import express from 'express';
import { db } from '../data/store.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET /api/admin/stats (Platform Overview)
router.get('/stats', authenticateToken, requireRole('admin'), (req, res) => {
  const users = db.getUsers();
  const students = users.filter(u => u.role === 'student');
  const teachers = users.filter(u => u.role === 'teacher');
  const materials = db.getStudyMaterials();
  const announcements = db.getAnnouncements();
  const assignments = db.getAssignments();
  const reports = db.getStudentReports();
  const pendingReports = reports.filter(r => r.status === 'Submitted' || r.status === 'Under Review');
  const experiences = db.getExperiences();
  const auditLogs = db.getAuditLogs();

  res.json({
    success: true,
    stats: {
      totalStudents: students.length,
      totalTeachers: teachers.length,
      totalSubjects: db.getSubjects().length,
      totalMaterials: materials.length,
      totalAnnouncements: announcements.length,
      totalAssignments: assignments.length,
      totalExperiences: experiences.length,
      pendingReports: pendingReports.length,
      totalAuditEvents: auditLogs.length
    }
  });
});

// GET /api/admin/users
router.get('/users', authenticateToken, requireRole('admin'), (req, res) => {
  const users = db.getUsers().map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    department: u.department,
    designation: u.designation,
    year: u.year,
    rollNo: u.rollNo,
    facultyId: u.facultyId,
    verified: u.verified !== false,
    lastActive: u.lastActive
  }));
  res.json({ success: true, users });
});

// POST /api/admin/invite-codes (Generate Teacher Faculty Invite Token)
router.post('/invite-codes', authenticateToken, requireRole('admin'), (req, res) => {
  const { department, prefix } = req.body;
  const deptCode = prefix || (department ? department.split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase() : 'CSE');
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const newCode = `FAC-${deptCode}-2026-${randomSuffix}`;

  const inviteObj = {
    code: newCode,
    department: department || 'Computer Science & Engineering',
    valid: true,
    createdAt: new Date().toISOString()
  };

  db.getFacultyInviteCodes().unshift(inviteObj);
  db.save();

  // Audit
  db.recordAudit({
    userId: req.user.id,
    userName: req.user.name,
    userRole: req.user.role,
    action: 'GENERATE_FACULTY_INVITE_CODE',
    entityType: 'SecurityToken',
    entityId: newCode,
    entityTitle: `Faculty Invite Code: ${newCode}`,
    subjectName: 'Security & Access Control',
    oldValue: null,
    newValue: { code: newCode, department: inviteObj.department },
    changeSummary: `Admin generated secure Faculty Invite Token for ${inviteObj.department}`
  });

  res.status(201).json({ success: true, inviteCode: inviteObj });
});

// GET /api/admin/invite-codes
router.get('/invite-codes', authenticateToken, requireRole('admin'), (req, res) => {
  res.json({ success: true, inviteCodes: db.getFacultyInviteCodes() });
});

export default router;
