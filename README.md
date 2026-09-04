# CollegeConnect — AI-Powered Academic & College Information Management Platform

CollegeConnect is an AI-powered role-based academic platform built with React 18, Vite, Tailwind CSS, Node.js/Express, and a dedicated Python FastAPI NLP service. It centralizes verified course materials, assignments, exam notices, change audit trails, community hackathon/internship experiences, and an interactive AI College Assistant to completely eliminate chaotic WhatsApp group communication.

---

## 🚀 Quick Start Guide

### 1. Start the Backend Server (Port 5000)
```powershell
cd server
node server.js
```

### 2. Start the Python FastAPI NLP Service (Port 8000)
```powershell
cd nlp_service
python run.py
```

### 3. Start the React Frontend (Port 5173)
```powershell
cd client
npm run dev
```

Visit **http://localhost:5173** in your browser.

---

## 👥 Instant Evaluation Demo Accounts

Switch between roles seamlessly using the **"Viewing as"** pill in the top navigation bar:

1. **Student**: `zayed@student.college.edu` / `password123` (Zayed — 3rd Year CSE)
2. **Teacher**: `prabhavathi@faculty.college.edu` / `password123` (Prof. Prabhavathi — NLP & AI Lead)
3. **Teacher**: `vidhya@faculty.college.edu` / `password123` (Prof. Vidhya — DBMS & DAA, HOD)
4. **Teacher**: `nirmala@faculty.college.edu` / `password123` (Dr. Nirmala — Cloud Computing)
5. **Admin**: `meena@college.edu` / `admin123` (Dr. Meena — Dean of Academic Affairs)

---

## 🛡️ Teacher Registration Protection

To prevent students from creating fake faculty profiles, teacher registration requires:
- An institutional faculty domain (e.g., `@faculty.college.edu`)
- A **Department Faculty Invite Passcode / Token** (e.g., `FAC-CSE-2026-X98`), generated and controlled exclusively by College Admins.

---

## 🧠 Key Features & Modules

- **AI-Powered "What Did I Miss?"**: Synthesizes all announcements, newly uploaded notes, solved PYQs, and exam schedule shifts added since the student's last login.
- **Dual Academic Navigation**:
  - `Subject → Teacher → Content`
  - `Teacher → Subject → Content`
- **Real-Time NLP Live Preview Studio**: As faculty types an announcement, the NLP engine extracts deadlines, targets, actions, and priority tags live.
- **Immutable Change Audit Trail**: Complete version history with before/after visual diffs for exam reschedules, assignment extensions, and note updates.
- **Experience Hub**: Community knowledge sharing for Hackathons, Internships, Research Papers, and Projects with upvotes and comments.
- **Student Voice & Grievance Lifecycle**: Issue tracking with `Submitted` 🟡 → `Under Review` 🔵 → `Resolved` 🟢 workflow.
- **AI College Assistant**: Conversational agent grounded in live campus data for instant answers about exams, assignments, materials, and timetable updates.
