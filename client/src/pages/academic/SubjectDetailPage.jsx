import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/common/Button';
import PriorityBadge from '../../components/common/PriorityBadge';
import StatusBadge from '../../components/common/StatusBadge';
import {
  BookOpen,
  Users,
  FileText,
  Calendar,
  Clock,
  Download,
  Star,
  ChevronLeft,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { format } from 'date-fns';

export default function SubjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('materials'); // 'materials', 'pyqs', 'assignments', 'exams'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSubject() {
      try {
        const res = await api.get(`/academic/subjects/${id}`);
        if (res.success) setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSubject();
  }, [id]);

  if (loading) {
    return <div className="py-20 text-center text-slate-400">Loading course curriculum...</div>;
  }

  if (!data?.subject) {
    return <div className="py-20 text-center text-slate-400">Subject not found.</div>;
  }

  const { subject, materials, announcements, assignments, exams } = data;
  const pyqs = materials.filter(m => m.type === 'pyq');
  const lectureMaterials = materials.filter(m => m.type !== 'pyq');

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Back Button */}
      <button
        onClick={() => navigate('/subjects')}
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to All Subjects
      </button>

      {/* Hero Card */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-purple-950/70 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-mono font-bold">
            {subject.code} • {subject.semester}
          </span>
          <span className="text-xs text-slate-400">{subject.credits} Academic Credits</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white">{subject.name}</h1>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">{subject.description}</p>

        {/* Assigned Faculty Profiles */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Faculty:</span>
          {subject.teachers?.map((t) => (
            <div
              key={t.id}
              onClick={() => navigate(`/teachers/${t.id}`)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 cursor-pointer transition-colors group"
            >
              <Users className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300" />
              <span className="text-xs font-bold text-slate-200 group-hover:text-white">{t.name}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { key: 'materials', label: 'Lecture Notes & PPTs', count: lectureMaterials.length },
          { key: 'pyqs', label: 'Solved PYQs & Papers', count: pyqs.length },
          { key: 'assignments', label: 'Assignments', count: assignments.length },
          { key: 'exams', label: 'Exams & Schedule', count: exams.length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.key
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.5 text-[10px] rounded-full ${activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tab 1: Lecture Notes & PPTs */}
      {activeTab === 'materials' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lectureMaterials.map((mat) => (
            <div key={mat.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {mat.type}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{mat.unit}</span>
                </div>
                <h3 className="text-base font-bold text-white">{mat.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{mat.description}</p>
                <div className="text-[11px] text-slate-400">
                  Uploaded by: <strong className="text-slate-200">{mat.teacherName}</strong>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-amber-400 font-bold">⭐ {mat.rating || '4.9'} / 5.0</span>
                <a
                  href={mat.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Solved PYQs */}
      {activeTab === 'pyqs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pyqs.map((pyq) => (
            <div key={pyq.id} className="p-5 rounded-2xl bg-slate-900/80 border border-indigo-500/30 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Solved PYQ Paper
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{pyq.unit}</span>
                </div>
                <h3 className="text-base font-bold text-white">{pyq.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{pyq.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-emerald-400 font-mono font-bold">100% Verified Solutions</span>
                <a
                  href={pyq.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download PYQ
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Assignments */}
      {activeTab === 'assignments' && (
        <div className="space-y-3">
          {assignments.map((asg) => (
            <div key={asg.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">{asg.title}</h3>
                <PriorityBadge priority={asg.priority} />
              </div>
              <p className="text-xs text-slate-300">{asg.description}</p>
              <div className="pt-2 flex items-center justify-between text-xs text-amber-300 font-medium">
                <span>📅 Due Date: {asg.dueDate}</span>
                <span className="text-slate-400">Total Points: {asg.totalPoints}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Exams */}
      {activeTab === 'exams' && (
        <div className="space-y-3">
          {exams.map((ex) => (
            <div key={ex.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">{ex.title}</h3>
                <span className="text-xs text-indigo-300 font-mono font-bold">{ex.examDate} ({ex.time})</span>
              </div>
              <p className="text-xs text-slate-400">Venue: <strong className="text-slate-200">{ex.venue}</strong></p>
              <p className="text-xs text-slate-300 bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                <strong>Syllabus:</strong> {ex.syllabus}
              </p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
