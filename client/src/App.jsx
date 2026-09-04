import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import AppLayout from './components/layout/AppLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import WhatDidIMissPage from './pages/student/WhatDidIMissPage';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import SubjectsPage from './pages/academic/SubjectsPage';
import SubjectDetailPage from './pages/academic/SubjectDetailPage';
import TeachersPage from './pages/academic/TeachersPage';
import TeacherDetailPage from './pages/academic/TeacherDetailPage';
import StudyMaterialsPage from './pages/academic/StudyMaterialsPage';
import AssignmentsPage from './pages/academic/AssignmentsPage';
import ExamsPage from './pages/academic/ExamsPage';
import TimetablePage from './pages/academic/TimetablePage';
import AnnouncementsPage from './pages/shared/AnnouncementsPage';
import ExperienceHubPage from './pages/community/ExperienceHubPage';
import StudentVoicePage from './pages/voice/StudentVoicePage';
import TeachingFeedbackPage from './pages/voice/TeachingFeedbackPage';
import AIAssistantPage from './pages/assistant/AIAssistantPage';
import AuditLogsPage from './pages/audit/AuditLogsPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

function RootRedirect() {
  const { user, isStudent, isTeacher, isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (isAdmin) return <Navigate to="/admin" replace />;
  if (isTeacher) return <Navigate to="/teacher-dashboard" replace />;
  return <Navigate to="/student-dashboard" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Main App Shell */}
      <Route path="/" element={<AppLayout />}>
        <Route index element={<RootRedirect />} />
        
        {/* Dashboards */}
        <Route path="student-dashboard" element={<StudentDashboard />} />
        <Route path="teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="teacher-studio" element={<TeacherDashboard />} />
        <Route path="admin" element={<AdminDashboard />} />

        {/* AI Features */}
        <Route path="what-did-i-miss" element={<WhatDidIMissPage />} />
        <Route path="assistant" element={<AIAssistantPage />} />

        {/* Dual Academic Navigation */}
        <Route path="subjects" element={<SubjectsPage />} />
        <Route path="subjects/:id" element={<SubjectDetailPage />} />
        <Route path="teachers" element={<TeachersPage />} />
        <Route path="teachers/:id" element={<TeacherDetailPage />} />

        {/* Academic Materials & Schedules */}
        <Route path="study-materials" element={<StudyMaterialsPage />} />
        <Route path="assignments" element={<AssignmentsPage />} />
        <Route path="exams" element={<ExamsPage />} />
        <Route path="timetable" element={<TimetablePage />} />
        <Route path="announcements" element={<AnnouncementsPage />} />

        {/* Community & Voice */}
        <Route path="experience-hub" element={<ExperienceHubPage />} />
        <Route path="student-voice" element={<StudentVoicePage />} />
        <Route path="teaching-feedback" element={<TeachingFeedbackPage />} />

        {/* Audit Logs */}
        <Route path="audit-logs" element={<AuditLogsPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
