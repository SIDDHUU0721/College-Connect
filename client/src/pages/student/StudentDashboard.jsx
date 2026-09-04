import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import PriorityBadge from '../../components/common/PriorityBadge';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import {
  Sparkles,
  Calendar,
  Clock,
  BookOpen,
  ArrowRight,
  FileText,
  AlertCircle,
  Award,
  ChevronRight,
  Bot,
  UserCheck,
  CheckCircle2,
  TrendingUp,
  Download
} from 'lucide-react';
import { format } from 'date-fns';

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [exams, setExams] = useState([]);
  const [missedSummary, setMissedSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [annRes, matRes, asgRes, exRes, missRes] = await Promise.all([
          api.get('/announcements'),
          api.get('/academic/materials'),
          api.get('/academic/assignments'),
          api.get('/academic/exams'),
          api.get('/nlp/what-did-i-miss?timeframe=3d')
        ]);

        if (annRes.success) setAnnouncements(annRes.announcements || []);
        if (matRes.success) setMaterials(matRes.materials || []);
        if (asgRes.success) setAssignments(asgRes.assignments || []);
        if (exRes.success) setExams(exRes.exams || []);
        if (missRes.success) setMissedSummary(missRes);
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  return (
    <div className="space-y-8">
      
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 via-slate-900 to-purple-950/60 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
              Fall Academic Term 2026 • 6th Semester
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome back, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{user?.name}</span> 👋
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Your centralized academic command center. Verified lecture materials, upcoming exam dates, and zero chaotic WhatsApp noise.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="ai"
              icon={Sparkles}
              onClick={() => navigate('/what-did-i-miss')}
              size="lg"
            >
              What Did I Miss?
            </Button>
            <Button
              variant="secondary"
              icon={Bot}
              onClick={() => navigate('/assistant')}
              size="lg"
            >
              AI Assistant
            </Button>
          </div>
        </div>
      </div>

      {/* "What Did I Miss?" AI Quick Highlight Alert */}
      {missedSummary && missedSummary.totalMissedCount > 0 && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900 border border-indigo-500/40 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">AI Briefing: {missedSummary.totalMissedCount} Updates Since Last Visit</h3>
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-red-500/20 text-red-300 border border-red-500/30">
                  Action Required
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {missedSummary.important.length} critical deadlines & announcements, {missedSummary.upcomingExams.length} upcoming exams, and {missedSummary.newMaterials.length} newly uploaded lecture notes.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/what-did-i-miss')}
            icon={ArrowRight}
            iconPosition="right"
          >
            Inspect Summary
          </Button>
        </div>
      )}

      {/* Key Metric Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Enrolled Subjects</p>
            <h4 className="text-lg font-black text-white">4 Courses</h4>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Pending Assignments</p>
            <h4 className="text-lg font-black text-white">{assignments.length} Tasks</h4>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Upcoming Exams</p>
            <h4 className="text-lg font-black text-white">{exams.length} Scheduled</h4>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Verified PYQ Papers</p>
            <h4 className="text-lg font-black text-white">100% Solved</h4>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Announcements & Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Official Academic Announcements Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">Official Academic Feed</h2>
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Live & Verified
              </span>
            </div>
            <button
              onClick={() => navigate('/announcements')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {announcements.slice(0, 4).map((ann) => (
              <div
                key={ann.id}
                className="p-5 rounded-2xl bg-slate-900/70 hover:bg-slate-800/70 border border-slate-800 hover:border-indigo-500/30 transition-all duration-200 shadow-sm space-y-3 group"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={ann.priority} />
                    {ann.isNew && <StatusBadge type="new" />}
                    {ann.isUpdated && <StatusBadge type="updated" />}
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {ann.updatedAt ? format(new Date(ann.updatedAt), 'MMM d • h:mm a') : 'Recent'}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                    {ann.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {ann.content}
                  </p>
                </div>

                {/* NLP Extracted Action & Deadline Tag */}
                {(ann.action || ann.deadline) && (
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                    {ann.action && (
                      <div className="flex items-center gap-1.5 text-indigo-300 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                        <span>Action: {ann.action}</span>
                      </div>
                    )}
                    {ann.deadline && (
                      <div className="flex items-center gap-1.5 text-amber-300 font-medium">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Deadline: {ann.deadline}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Teacher Attribution */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/60">
                  <span className="font-medium text-slate-300">
                    Faculty: <strong className="text-white">{ann.teacherName}</strong> ({ann.subjectName || 'Department'})
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Last edited by: {ann.lastEditedBy}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Upcoming Deadlines, Exams & Solved PYQs */}
        <div className="space-y-6">
          
          {/* Upcoming Assignments Card */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-red-400" />
                <h3 className="text-sm font-bold text-white">Upcoming Assignments</h3>
              </div>
              <button
                onClick={() => navigate('/assignments')}
                className="text-xs text-indigo-400 hover:underline"
              >
                View all
              </button>
            </div>

            <div className="space-y-3">
              {assignments.map((asg) => (
                <div key={asg.id} className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-100">{asg.title}</h4>
                    <span className="px-2 py-0.5 text-[9px] uppercase font-bold rounded bg-red-500/20 text-red-300 border border-red-500/30">
                      {asg.priority}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{asg.subjectName}</p>
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-700/40 text-amber-300 font-medium">
                    <span>Due: {asg.dueDate}</span>
                    <span className="text-slate-400">{asg.totalPoints} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Exam Alert Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-indigo-950/40 to-slate-900 border border-indigo-500/30 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Exam Schedule</h3>
              </div>
              <button onClick={() => navigate('/exams')} className="text-xs text-indigo-400 hover:underline">
                View all
              </button>
            </div>

            <div className="space-y-3">
              {exams.map((ex) => (
                <div key={ex.id} className="p-3.5 rounded-xl bg-slate-800/60 border border-indigo-500/20 space-y-1.5">
                  <h4 className="text-xs font-bold text-indigo-200">{ex.subjectName}</h4>
                  <p className="text-xs text-slate-300">{ex.title}</p>
                  <div className="text-[11px] text-slate-400 font-mono">
                    📅 {ex.examDate} • {ex.time}
                  </div>
                  <p className="text-[10px] text-slate-400">Venue: {ex.venue}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Solved PYQs & Notes */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Study Materials & Notes</h3>
              </div>
              <button onClick={() => navigate('/study-materials')} className="text-xs text-indigo-400 hover:underline">
                Explore
              </button>
            </div>

            <div className="space-y-2.5">
              {materials.slice(0, 3).map((mat) => (
                <div
                  key={mat.id}
                  onClick={() => navigate('/study-materials')}
                  className="p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 cursor-pointer flex items-center justify-between group transition-colors"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-200 group-hover:text-indigo-300 truncate max-w-[180px]">
                      {mat.title}
                    </p>
                    <p className="text-[10px] text-slate-400">{mat.teacherName} • {mat.unit}</p>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {mat.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
