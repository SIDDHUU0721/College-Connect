import express from 'express';
import { db } from '../data/store.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/feedback/teachers (Aggregated feedback)
router.get('/teachers', (req, res) => {
  res.json({ success: true, feedback: db.getTeachingFeedback() });
});

// GET /api/feedback/teachers/:teacherId
router.get('/teachers/:teacherId', (req, res) => {
  const item = db.getTeachingFeedback().find(f => f.teacherId === req.params.teacherId);
  res.json({ success: true, feedback: item || null });
});

// POST /api/feedback/teachers/:teacherId (Anonymous structured student feedback)
router.post('/teachers/:teacherId', authenticateToken, (req, res) => {
  const { teacherId } = req.params;
  const { subjectId, ratings, comment } = req.body;

  const teacher = db.getUsers().find(u => u.id === teacherId);
  if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

  let entry = db.getTeachingFeedback().find(f => f.teacherId === teacherId);
  if (!entry) {
    entry = {
      id: `fb-${Date.now()}`,
      teacherId,
      teacherName: teacher.name,
      subjectId: subjectId || 'sub-general',
      subjectName: teacher.assignedSubjects ? teacher.assignedSubjects[0] : 'General',
      ratings: {
        teachingClarity: 5.0,
        explanation: 5.0,
        doubtClarification: 5.0,
        practicalExamples: 5.0,
        courseCoverage: 5.0,
        materialUsefulness: 5.0
      },
      anonymousComments: []
    };
    db.getTeachingFeedback().push(entry);
  }

  // Update rolling averages
  if (ratings) {
    for (const key of Object.keys(ratings)) {
      if (entry.ratings[key] !== undefined) {
        entry.ratings[key] = parseFloat(((entry.ratings[key] * 4 + ratings[key]) / 5).toFixed(1));
      }
    }
  }

  if (comment && comment.trim()) {
    entry.anonymousComments.unshift(comment.trim());
  }

  db.save();
  res.status(201).json({ success: true, feedback: entry });
});

// GET /api/feedback/materials/:materialId/reviews
router.get('/materials/:materialId/reviews', (req, res) => {
  const reviews = db.getMaterialReviews().filter(r => r.materialId === req.params.materialId);
  res.json({ success: true, reviews });
});

// POST /api/feedback/materials/:materialId/reviews (Review a specific note/PPT)
router.post('/materials/:materialId/reviews', authenticateToken, (req, res) => {
  const { materialId } = req.params;
  const { rating, clarity, completeness, usefulness, comment } = req.body;

  const mat = db.getStudyMaterials().find(m => m.id === materialId);
  if (!mat) return res.status(404).json({ error: 'Material not found' });

  const review = {
    id: `rev-${Date.now()}`,
    materialId,
    studentId: req.user.id,
    studentName: req.user.name,
    rating: rating || 5,
    clarity: clarity || 5,
    completeness: completeness || 5,
    usefulness: usefulness || 5,
    comment: comment || '',
    createdAt: new Date().toISOString()
  };

  db.getMaterialReviews().unshift(review);

  // Recalculate material rating
  const allReviews = db.getMaterialReviews().filter(r => r.materialId === materialId);
  const avg = (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1);
  mat.rating = parseFloat(avg);
  mat.reviewsCount = allReviews.length;
  db.save();

  res.status(201).json({ success: true, review, updatedRating: mat.rating });
});

export default router;
