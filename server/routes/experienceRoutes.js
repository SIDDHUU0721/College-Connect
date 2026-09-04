import express from 'express';
import { db } from '../data/store.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/experiences
router.get('/', (req, res) => {
  const { category, search, tag, authorRole } = req.query;
  let list = db.getExperiences();

  if (category) list = list.filter(e => e.category.toLowerCase() === category.toLowerCase());
  if (authorRole) list = list.filter(e => e.authorRole.toLowerCase() === authorRole.toLowerCase());
  if (tag) list = list.filter(e => e.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(e =>
      e.title.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.organization.toLowerCase().includes(q) ||
      e.technologies.some(t => t.toLowerCase().includes(q)) ||
      (e.advice && e.advice.toLowerCase().includes(q))
    );
  }

  res.json({ success: true, experiences: list });
});

// GET /api/experiences/:id
router.get('/:id', (req, res) => {
  const exp = db.getExperiences().find(e => e.id === req.params.id);
  if (!exp) return res.status(404).json({ error: 'Experience post not found' });
  res.json({ success: true, experience: exp });
});

// POST /api/experiences (Both Students and Teachers can post!)
router.post('/', authenticateToken, (req, res) => {
  const { title, category, organization, date, technologies, description, challenges, whatILearned, advice, tags } = req.body;

  if (!title || !description || !category) {
    return res.status(400).json({ error: 'Title, category, and description are required.' });
  }

  const techList = Array.isArray(technologies)
    ? technologies
    : (technologies ? technologies.split(',').map(t => t.trim()) : []);

  const tagList = Array.isArray(tags)
    ? tags
    : (tags ? tags.split(',').map(t => t.trim().replace(/^#/, '')) : [category]);

  const newPost = {
    id: `exp-${Date.now()}`,
    title,
    authorId: req.user.id,
    authorName: req.user.name,
    authorRole: req.user.role === 'teacher' ? 'Teacher' : 'Student',
    department: req.user.department || 'CSE',
    category,
    organization: organization || 'Open Source / Self Project',
    date: date || 'Recent',
    technologies: techList,
    description,
    challenges: challenges || '',
    whatILearned: whatILearned || '',
    advice: advice || '',
    upvotes: 0,
    upvotedBy: [],
    savedBy: [],
    tags: tagList,
    comments: [],
    createdAt: new Date().toISOString()
  };

  db.getExperiences().unshift(newPost);
  db.save();

  res.status(201).json({ success: true, experience: newPost });
});

// POST /api/experiences/:id/upvote
router.post('/:id/upvote', authenticateToken, (req, res) => {
  const exp = db.getExperiences().find(e => e.id === req.params.id);
  if (!exp) return res.status(404).json({ error: 'Experience post not found' });

  const userId = req.user.id;
  const idx = exp.upvotedBy.indexOf(userId);

  if (idx > -1) {
    exp.upvotedBy.splice(idx, 1);
    exp.upvotes = Math.max(0, exp.upvotes - 1);
  } else {
    exp.upvotedBy.push(userId);
    exp.upvotes += 1;
  }
  db.save();

  res.json({ success: true, upvotes: exp.upvotes, hasUpvoted: exp.upvotedBy.includes(userId) });
});

// POST /api/experiences/:id/save
router.post('/:id/save', authenticateToken, (req, res) => {
  const exp = db.getExperiences().find(e => e.id === req.params.id);
  if (!exp) return res.status(404).json({ error: 'Experience post not found' });

  const userId = req.user.id;
  const idx = (exp.savedBy || []).indexOf(userId);

  if (!exp.savedBy) exp.savedBy = [];

  if (idx > -1) {
    exp.savedBy.splice(idx, 1);
  } else {
    exp.savedBy.push(userId);
  }
  db.save();

  res.json({ success: true, hasSaved: exp.savedBy.includes(userId) });
});

// POST /api/experiences/:id/comments
router.post('/:id/comments', authenticateToken, (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Comment content cannot be empty.' });

  const exp = db.getExperiences().find(e => e.id === req.params.id);
  if (!exp) return res.status(404).json({ error: 'Experience post not found' });

  const comment = {
    id: `comm-${Date.now()}`,
    authorId: req.user.id,
    authorName: req.user.name,
    authorRole: req.user.role === 'teacher' ? 'Teacher' : (req.user.role === 'admin' ? 'Admin' : 'Student'),
    content,
    createdAt: new Date().toISOString()
  };

  if (!exp.comments) exp.comments = [];
  exp.comments.push(comment);
  db.save();

  res.status(201).json({ success: true, comment, comments: exp.comments });
});

export default router;
