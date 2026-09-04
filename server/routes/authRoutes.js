import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../data/store.js';
import { JWT_SECRET, authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Generate Token
function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// GET /api/auth/demo-users
router.get('/demo-users', (req, res) => {
  const users = db.getUsers().map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    department: u.department,
    designation: u.designation || null,
    avatar: u.avatar
  }));
  res.json({ success: true, users });
});

// POST /api/auth/switch-demo
router.post('/switch-demo', (req, res) => {
  const { userId } = req.body;
  const user = db.getUsers().find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'Demo user not found' });
  }
  const token = createToken(user);
  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      designation: user.designation,
      avatar: user.avatar,
      lastActive: user.lastActive
    }
  });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide both email and password.' });
  }

  const user = db.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ error: 'Invalid email address or user not found.' });
  }

  const isMatch = bcrypt.compareSync(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Incorrect password.' });
  }

  // Update last active
  user.lastActive = new Date().toISOString();
  db.save();

  const token = createToken(user);
  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      designation: user.designation,
      avatar: user.avatar,
      lastActive: user.lastActive
    }
  });
});

// POST /api/auth/register (With Teacher Role Protection & Faculty Invite Code Verification)
router.post('/register', (req, res) => {
  const { name, email, password, role, department, facultyInviteCode, facultyId, rollNo, year } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Name, email, password, and role are required.' });
  }

  // Check if user already exists
  const existing = db.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'An account with this email address already exists.' });
  }

  // TEACHER ROLE SECURITY & VERIFICATION
  if (role === 'teacher') {
    // 1. Email pattern validation
    if (!/@(?:faculty|college)\.edu$/i.test(email) && !/@(?:admin|univ)\.edu$/i.test(email)) {
      return res.status(403).json({
        error: 'Teacher registration requires an official faculty institutional email address (e.g. name@faculty.college.edu).'
      });
    }

    // 2. Faculty Invite Passcode check
    if (!facultyInviteCode) {
      return res.status(403).json({
        error: 'Teacher registration requires a Department Faculty Invite Token issued by the Admin/HOD.'
      });
    }

    const validCode = db.getFacultyInviteCodes().find(c => c.code === facultyInviteCode && c.valid);
    if (!validCode) {
      return res.status(403).json({
        error: 'Invalid or expired Faculty Invite Code. Please contact your Department Head or College Admin.'
      });
    }
  }

  // Create User
  const newUser = {
    id: `usr-${role}-${Date.now()}`,
    name,
    email: email.toLowerCase(),
    passwordHash: bcrypt.hashSync(password, 10),
    role,
    department: department || 'Computer Science & Engineering',
    year: role === 'student' ? (year || '1st Year') : undefined,
    rollNo: role === 'student' ? rollNo : undefined,
    facultyId: role === 'teacher' ? (facultyId || 'FAC-NEW') : undefined,
    verified: role === 'teacher' ? true : true,
    avatar: null,
    lastActive: new Date().toISOString()
  };

  db.getUsers().push(newUser);
  db.save();

  const token = createToken(newUser);
  res.status(201).json({
    success: true,
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department,
      avatar: newUser.avatar,
      lastActive: newUser.lastActive
    }
  });
});

// GET /api/auth/me
router.get('/me', authenticateToken, (req, res) => {
  const u = req.user;
  res.json({
    success: true,
    user: {
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      department: u.department,
      designation: u.designation,
      year: u.year,
      rollNo: u.rollNo,
      avatar: u.avatar,
      lastActive: u.lastActive
    }
  });
});

export default router;
