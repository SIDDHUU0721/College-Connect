import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/common/Button';
import PriorityBadge from '../../components/common/PriorityBadge';
import {
  Users,
  BookOpen,
  Star,
  Download,
  ChevronLeft,
  ShieldCheck,
  Calendar,
  FileText,
  Mail,
  ArrowRight
} from 'lucide-react';
import { format } from 'date-fns';

export default function TeacherDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('materials');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeacher() {
      try {
        const res = await api.get(`/academic/teachers/${id}`);
        if (res.success) setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadTeacher();
  }, [id]);

  if (loading) return <div className="py-20 text-center text-slate-400">Loading teacher dashboard...</div>;
  if (!data?.teacher) return <div className="py-20 text-center text-slate-400">Teacher not found.</div>;

  const { teacher, materials, announcements, assignments, feedback } = data;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      <button
        onClick={() => navigate('/teachers')}
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Faculty Directory
      </button>

      {/* Hero Profile Card */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 border border-purple-500/30 p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {teacher.avatar ? (
            <img
              src={teacher.avatar}
              alt={teacher.name}
              className="w-20 h-20 rounded-3xl object-cover border-2 border-purple-500/40 shadow-xl"
            />
          ) : (
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 flex items-center justify-center font-black text-white text-2xl border-2 border-purple-500/40 shadow-xl">
              {teacher.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
          )}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white">{teacher.name}</h1>
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-sm text-slate-200 font-medium">{teacher.designation} • {teacher.department}</p>
            <p className="text-xs text-slate-400 font-mono">Faculty ID: {teacher.facultyId} • {teacher.email}</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl pt-2">
          {teacher.bio}
        </p>

        {/* Assigned Courses Links */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Taught Courses:</span>
          {teacher.subjects?.map((s) => (
            <button
              key={s.id}
              onClick={() => navigate(`/subjects/${s.id}`)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              {s.name} ({s.code})
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { key: 'materials', label: 'Uploaded Materials & PYQs', count: materials.length },
          { key: 'announcements', label: 'Faculty Announcements', count: announcements.length },
          { key: 'feedback', label: 'Student Ratings & Reviews', count: feedback ? 1 : 0 },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.key
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
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

      {/* Tab 1: Materials */}
      {activeTab === 'materials' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {materials.map((mat) => (
            <div key={mat.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {mat.type}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{mat.unit}</span>
                </div>
                <h3 className="text-base font-bold text-white">{mat.title}</h3>
                <p className="text-xs text-slate-300">{mat.description}</p>
                <p className="text-[11px] text-slate-400">Course: <strong className="text-slate-200">{mat.subjectName}</strong></p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-amber-400 font-bold">⭐ {mat.rating || '4.9'} / 5.0</span>
                <a
                  href={mat.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Announcements */}
      {activeTab === 'announcements' && (
        <div className="space-y-3">
          {announcements.map((ann) => (
            <div key={ann.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">{ann.title}</h3>
                <PriorityBadge priority={ann.priority} />
              </div>
              <p className="text-xs text-slate-300">{ann.content}</p>
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>{ann.subjectName}</span>
                <span>{ann.updatedAt ? format(new Date(ann.updatedAt), 'MMM d, yyyy') : 'Recent'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Feedback */}
      {activeTab === 'feedback' && feedback && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Aggregated Student Evaluation</h3>
            <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-sm font-bold font-mono">
              ⭐ 4.8 / 5.0 Composite Rating
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(feedback.ratings || {}).map(([key, val]) => (
              <div key={key} className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1.5">
                <div className="flex justify-between text-xs text-slate-300 capitalize font-medium">
                  <span>{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="font-mono text-purple-300 font-bold">{val} / 5.0</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                    style={{ width: `${(val / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Anonymous Student Comments */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Anonymous Student Remarks:</h4>
            {feedback.anonymousComments?.map((comm, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40 text-xs text-slate-300 italic">
                "{comm}"
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
