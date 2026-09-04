import express from 'express';
import axios from 'axios';
import { db } from '../data/store.js';
import { authenticateToken } from '../middleware/auth.js';
import { analyzeAnnouncement, synthesizeWhatDidIMiss, answerCollegeAssistantQuery } from '../utils/nlpEngine.js';

const router = express.Router();
const FASTAPI_NLP_URL = process.env.FASTAPI_NLP_URL || 'http://localhost:8000';

// POST /api/nlp/analyze (Text categorization, entity extraction, priority detection)
router.post('/analyze', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required for NLP analysis.' });

  try {
    // Attempt FastAPI Python NLP Service first
    const response = await axios.post(`${FASTAPI_NLP_URL}/nlp/analyze`, { text }, { timeout: 1200 });
    return res.json({ success: true, engine: 'fastapi_python', ...response.data });
  } catch (err) {
    // Fallback to high-accuracy Node.js built-in NLP engine
    const analysis = analyzeAnnouncement(text);
    return res.json({ success: true, engine: 'node_builtin_nlp', ...analysis });
  }
});

// GET /api/nlp/what-did-i-miss
router.get('/what-did-i-miss', authenticateToken, async (req, res) => {
  const { timeframe } = req.query; // '24h', '3d', '7d', 'all'
  let cutoffDate;

  if (timeframe === '24h') cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
  else if (timeframe === '7d') cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  else if (timeframe === '30d') cutoffDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  else if (req.user && req.user.lastActive) {
    cutoffDate = new Date(req.user.lastActive);
  } else {
    cutoffDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  }

  const allData = {
    announcements: db.getAnnouncements(),
    studyMaterials: db.getStudyMaterials(),
    assignments: db.getAssignments(),
    exams: db.getExams(),
    events: db.getAnnouncements().filter(a => a.category === 'Event' || a.category === 'Placement')
  };

  try {
    // Try FastAPI service
    const response = await axios.post(`${FASTAPI_NLP_URL}/nlp/what-did-i-miss`, {
      last_active: cutoffDate.toISOString(),
      data: allData
    }, { timeout: 1500 });
    return res.json({ success: true, engine: 'fastapi_python', ...response.data });
  } catch (err) {
    // Fallback synthesizer
    const summary = synthesizeWhatDidIMiss(cutoffDate, allData);
    return res.json({ success: true, engine: 'node_builtin_nlp', ...summary });
  }
});

// POST /api/nlp/assistant/chat (AI College Assistant)
router.post('/assistant/chat', authenticateToken, async (req, res) => {
  const { message, conversationHistory } = req.body;
  if (!message) return res.status(400).json({ error: 'Message cannot be empty.' });

  const knowledgeBase = {
    announcements: db.getAnnouncements(),
    studyMaterials: db.getStudyMaterials(),
    assignments: db.getAssignments(),
    exams: db.getExams(),
    timetables: db.getTimetables(),
    experiences: db.getExperiences(),
    subjects: db.getSubjects()
  };

  try {
    const response = await axios.post(`${FASTAPI_NLP_URL}/nlp/assistant`, {
      query: message,
      knowledge: knowledgeBase
    }, { timeout: 2000 });
    return res.json({ success: true, engine: 'fastapi_python', ...response.data });
  } catch (err) {
    const reply = answerCollegeAssistantQuery(message, knowledgeBase);
    return res.json({ success: true, engine: 'node_builtin_nlp', ...reply });
  }
});

// GET /api/nlp/smart-search
router.get('/smart-search', (req, res) => {
  const { q } = req.query;
  if (!q) return res.json({ success: true, results: [] });

  const query = q.toLowerCase();
  const results = [];

  // Search Announcements
  db.getAnnouncements().forEach(a => {
    if (a.title.toLowerCase().includes(query) || a.content.toLowerCase().includes(query) || (a.subjectName && a.subjectName.toLowerCase().includes(query))) {
      results.push({ type: 'Announcement', title: a.title, subtitle: `${a.subjectName || 'General'} (${a.priority} Priority)`, link: '/announcements', id: a.id });
    }
  });

  // Search Study Materials
  db.getStudyMaterials().forEach(m => {
    if (m.title.toLowerCase().includes(query) || m.description.toLowerCase().includes(query) || m.subjectName.toLowerCase().includes(query) || m.teacherName.toLowerCase().includes(query)) {
      results.push({ type: 'Material', title: m.title, subtitle: `${m.subjectName} by ${m.teacherName} [${m.type.toUpperCase()}]`, link: '/study-materials', id: m.id });
    }
  });

  // Search Assignments
  db.getAssignments().forEach(asg => {
    if (asg.title.toLowerCase().includes(query) || asg.subjectName.toLowerCase().includes(query)) {
      results.push({ type: 'Assignment', title: asg.title, subtitle: `Due: ${asg.dueDate} (${asg.subjectName})`, link: '/assignments', id: asg.id });
    }
  });

  // Search Exams
  db.getExams().forEach(ex => {
    if (ex.title.toLowerCase().includes(query) || ex.subjectName.toLowerCase().includes(query)) {
      results.push({ type: 'Exam', title: ex.title, subtitle: `Date: ${ex.examDate} (${ex.subjectName})`, link: '/exams', id: ex.id });
    }
  });

  // Search Experiences
  db.getExperiences().forEach(exp => {
    if (exp.title.toLowerCase().includes(query) || exp.description.toLowerCase().includes(query) || exp.tags.some(t => t.toLowerCase().includes(query))) {
      results.push({ type: 'Experience', title: exp.title, subtitle: `By ${exp.authorName} (${exp.category})`, link: '/experience-hub', id: exp.id });
    }
  });

  res.json({ success: true, results: results.slice(0, 15) });
});

export default router;
