import express from 'express';
import { db } from '../data/store.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET /api/academic/subjects
router.get('/subjects', (req, res) => {
  const subjects = db.getSubjects().map(sub => {
    const materials = db.getStudyMaterials().filter(m => m.subjectId === sub.id);
    const announcements = db.getAnnouncements().filter(a => a.subjectId === sub.id);
    return {
      ...sub,
      materialsCount: materials.length,
      announcementsCount: announcements.length
    };
  });
  res.json({ success: true, subjects });
});

// GET /api/academic/subjects/:id
router.get('/subjects/:id', (req, res) => {
  const sub = db.getSubjects().find(s => s.id === req.params.id);
  if (!sub) return res.status(404).json({ error: 'Subject not found' });

  const materials = db.getStudyMaterials().filter(m => m.subjectId === sub.id);
  const announcements = db.getAnnouncements().filter(a => a.subjectId === sub.id);
  const assignments = db.getAssignments().filter(a => a.subjectId === sub.id);
  const exams = db.getExams().filter(e => e.subjectId === sub.id);

  res.json({
    success: true,
    subject: sub,
    materials,
    announcements,
    assignments,
    exams
  });
});

// GET /api/academic/teachers
router.get('/teachers', (req, res) => {
  const teachers = db.getUsers().filter(u => u.role === 'teacher').map(t => {
    const assigned = db.getSubjects().filter(s => s.teachers.some(item => item.id === t.id));
    const materials = db.getStudyMaterials().filter(m => m.teacherId === t.id);
    return {
      id: t.id,
      name: t.name,
      email: t.email,
      department: t.department,
      designation: t.designation,
      facultyId: t.facultyId,
      bio: t.bio,
      avatar: t.avatar,
      subjects: assigned,
      materialsCount: materials.length
    };
  });
  res.json({ success: true, teachers });
});

// GET /api/academic/teachers/:id
router.get('/teachers/:id', (req, res) => {
  const teacher = db.getUsers().find(u => u.id === req.params.id && u.role === 'teacher');
  if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

  const assigned = db.getSubjects().filter(s => s.teachers.some(item => item.id === teacher.id));
  const materials = db.getStudyMaterials().filter(m => m.teacherId === teacher.id);
  const announcements = db.getAnnouncements().filter(a => a.teacherId === teacher.id);
  const assignments = db.getAssignments().filter(a => a.teacherId === teacher.id);
  const feedback = db.getTeachingFeedback().find(f => f.teacherId === teacher.id);

  res.json({
    success: true,
    teacher: {
      id: teacher.id,
      name: teacher.name,
      email: teacher.email,
      department: teacher.department,
      designation: teacher.designation,
      facultyId: teacher.facultyId,
      bio: teacher.bio,
      avatar: teacher.avatar,
      subjects: assigned
    },
    materials,
    announcements,
    assignments,
    feedback: feedback || null
  });
});

// GET /api/academic/materials
router.get('/materials', (req, res) => {
  const { subjectId, teacherId, type, unit, search } = req.query;
  let list = db.getStudyMaterials();

  if (subjectId) list = list.filter(m => m.subjectId === subjectId);
  if (teacherId) list = list.filter(m => m.teacherId === teacherId);
  if (type) list = list.filter(m => m.type.toLowerCase() === type.toLowerCase());
  if (unit) list = list.filter(m => m.unit.toLowerCase() === unit.toLowerCase());
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(m =>
      m.title.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.subjectName.toLowerCase().includes(q) ||
      m.teacherName.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, materials: list });
});

// POST /api/academic/materials (Teacher/Admin only)
router.post('/materials', authenticateToken, requireRole('teacher', 'admin'), (req, res) => {
  const { title, subjectId, type, unit, category, description, fileName, fileSize, fileUrl } = req.body;
  if (!title || !subjectId) {
    return res.status(400).json({ error: 'Title and Subject are required.' });
  }

  const subject = db.getSubjects().find(s => s.id === subjectId);
  const subjectName = subject ? subject.name : 'Computer Science';

  const newMaterial = {
    id: `mat-${Date.now()}`,
    title,
    subjectId,
    subjectName,
    teacherId: req.user.id,
    teacherName: req.user.name,
    type: type || 'pdf',
    unit: unit || 'Unit 1',
    category: category || 'Lecture Notes',
    description: description || '',
    fileUrl: fileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: fileName || `${title.replace(/\s+/g, '_')}.${type || 'pdf'}`,
    fileSize: fileSize || '3.2 MB',
    rating: 5.0,
    reviewsCount: 1,
    isNew: true,
    isUpdated: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastEditedBy: req.user.name
  };

  db.getStudyMaterials().unshift(newMaterial);
  db.save();

  // Audit Log
  db.recordAudit({
    userId: req.user.id,
    userName: req.user.name,
    userRole: req.user.role,
    action: 'UPLOAD_STUDY_MATERIAL',
    entityType: 'StudyMaterial',
    entityId: newMaterial.id,
    entityTitle: newMaterial.title,
    subjectName,
    oldValue: null,
    newValue: { title, type: newMaterial.type, unit: newMaterial.unit, fileName: newMaterial.fileName },
    changeSummary: `Uploaded new study material [${newMaterial.type.toUpperCase()}] for ${subjectName} (${newMaterial.unit})`
  });

  // In-app Notification for Students
  db.addNotification({
    userId: 'all_students',
    title: `📚 New Study Material: ${newMaterial.title}`,
    message: `${req.user.name} uploaded new ${newMaterial.type.toUpperCase()} for ${subjectName}.`,
    type: 'material',
    priority: 'Medium',
    link: `/study-materials`
  });

  res.status(201).json({ success: true, material: newMaterial });
});

// PUT /api/academic/materials/:id
router.put('/materials/:id', authenticateToken, requireRole('teacher', 'admin'), (req, res) => {
  const mat = db.getStudyMaterials().find(m => m.id === req.params.id);
  if (!mat) return res.status(404).json({ error: 'Material not found' });

  // Ensure teacher owns this material unless admin
  if (req.user.role !== 'admin' && mat.teacherId !== req.user.id) {
    return res.status(403).json({ error: 'You can only edit study materials uploaded by yourself.' });
  }

  const oldState = { title: mat.title, unit: mat.unit, description: mat.description, type: mat.type };
  const { title, unit, description, type, category } = req.body;

  if (title) mat.title = title;
  if (unit) mat.unit = unit;
  if (description !== undefined) mat.description = description;
  if (type) mat.type = type;
  if (category) mat.category = category;

  mat.isUpdated = true;
  mat.updatedAt = new Date().toISOString();
  mat.lastEditedBy = req.user.name;
  db.save();

  // Audit Log
  db.recordAudit({
    userId: req.user.id,
    userName: req.user.name,
    userRole: req.user.role,
    action: 'UPDATE_STUDY_MATERIAL',
    entityType: 'StudyMaterial',
    entityId: mat.id,
    entityTitle: mat.title,
    subjectName: mat.subjectName,
    oldValue: oldState,
    newValue: { title: mat.title, unit: mat.unit, description: mat.description, type: mat.type },
    changeSummary: `Updated study material details for ${mat.title}`
  });

  res.json({ success: true, material: mat });
});

// DELETE /api/academic/materials/:id
router.delete('/materials/:id', authenticateToken, requireRole('teacher', 'admin'), (req, res) => {
  const idx = db.getStudyMaterials().findIndex(m => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Material not found' });

  const mat = db.getStudyMaterials()[idx];
  if (req.user.role !== 'admin' && mat.teacherId !== req.user.id) {
    return res.status(403).json({ error: 'You can only delete your own study materials.' });
  }

  db.getStudyMaterials().splice(idx, 1);
  db.save();

  // Audit Log
  db.recordAudit({
    userId: req.user.id,
    userName: req.user.name,
    userRole: req.user.role,
    action: 'DELETE_STUDY_MATERIAL',
    entityType: 'StudyMaterial',
    entityId: mat.id,
    entityTitle: mat.title,
    subjectName: mat.subjectName,
    oldValue: mat,
    newValue: null,
    changeSummary: `Deleted study material ${mat.title}`
  });

  res.json({ success: true, message: 'Material deleted successfully' });
});

// GET /api/academic/assignments
router.get('/assignments', (req, res) => {
  res.json({ success: true, assignments: db.getAssignments() });
});

// POST /api/academic/assignments (Teacher/Admin)
router.post('/assignments', authenticateToken, requireRole('teacher', 'admin'), (req, res) => {
  const { title, subjectId, dueDate, priority, description, totalPoints } = req.body;
  const subject = db.getSubjects().find(s => s.id === subjectId);
  const subjectName = subject ? subject.name : 'General CSE';

  const newAsg = {
    id: `asg-${Date.now()}`,
    title,
    subjectId,
    subjectName,
    teacherId: req.user.id,
    teacherName: req.user.name,
    dueDate: dueDate || 'Next Monday (5:00 PM)',
    priority: priority || 'Medium',
    description: description || '',
    totalPoints: totalPoints || 20,
    submissionCount: 0,
    totalStudents: 68,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.getAssignments().unshift(newAsg);
  db.save();

  // Audit
  db.recordAudit({
    userId: req.user.id,
    userName: req.user.name,
    userRole: req.user.role,
    action: 'CREATE_ASSIGNMENT',
    entityType: 'Assignment',
    entityId: newAsg.id,
    entityTitle: newAsg.title,
    subjectName,
    oldValue: null,
    newValue: { dueDate: newAsg.dueDate, points: newAsg.totalPoints, priority: newAsg.priority },
    changeSummary: `Created new assignment: ${newAsg.title} (Due: ${newAsg.dueDate})`
  });

  // Notify Students
  db.addNotification({
    userId: 'all_students',
    title: `📝 New Assignment: ${newAsg.title}`,
    message: `${req.user.name} posted a new assignment for ${subjectName}. Due: ${newAsg.dueDate}`,
    type: 'assignment',
    priority: newAsg.priority,
    link: `/assignments`
  });

  res.status(201).json({ success: true, assignment: newAsg });
});

// GET /api/academic/exams
router.get('/exams', (req, res) => {
  res.json({ success: true, exams: db.getExams() });
});

// PUT /api/academic/exams/:id (With Audit Log of Rescheduled Dates)
router.put('/exams/:id', authenticateToken, requireRole('teacher', 'admin'), (req, res) => {
  const exam = db.getExams().find(e => e.id === req.params.id);
  if (!exam) return res.status(404).json({ error: 'Exam not found' });

  const oldState = { examDate: exam.examDate, time: exam.time, venue: exam.venue, syllabus: exam.syllabus };
  const { examDate, time, venue, syllabus, title } = req.body;

  if (title) exam.title = title;
  if (examDate) exam.examDate = examDate;
  if (time) exam.time = time;
  if (venue) exam.venue = venue;
  if (syllabus) exam.syllabus = syllabus;

  exam.updatedAt = new Date().toISOString();
  db.save();

  // Record Audit Log with Before & After values
  db.recordAudit({
    userId: req.user.id,
    userName: req.user.name,
    userRole: req.user.role,
    action: 'UPDATE_EXAM_SCHEDULE',
    entityType: 'Exam',
    entityId: exam.id,
    entityTitle: exam.title,
    subjectName: exam.subjectName,
    oldValue: oldState,
    newValue: { examDate: exam.examDate, time: exam.time, venue: exam.venue, syllabus: exam.syllabus },
    changeSummary: `Exam rescheduled from ${oldState.examDate} to ${exam.examDate} (${exam.time})`
  });

  // Notification for Students
  db.addNotification({
    userId: 'all_students',
    title: `📅 Exam Rescheduled: ${exam.title}`,
    message: `Updated date: ${exam.examDate} at ${exam.time} (Venue: ${exam.venue})`,
    type: 'exam',
    priority: 'High',
    link: '/exams'
  });

  res.json({ success: true, exam });
});

// GET /api/academic/timetables
router.get('/timetables', (req, res) => {
  res.json({ success: true, timetables: db.getTimetables() });
});

export default router;
