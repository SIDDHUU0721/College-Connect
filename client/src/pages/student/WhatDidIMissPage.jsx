import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import PriorityBadge from '../../components/common/PriorityBadge';
import Button from '../../components/common/Button';
import {
  Sparkles,
  Calendar,
  Clock,
  BookOpen,
  ArrowRight,
  AlertTriangle,
  Award,
  CheckCircle2,
  RefreshCw,
  FolderGit2
} from 'lucide-react';
import { format } from 'date-fns';

export default function WhatDidIMissPage() {
  const [timeframe, setTimeframe] = useState('3d');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMissed = async (tf) => {
    setLoading(true);
    try {
      const res = await api.get(`/nlp/what-did-i-miss?timeframe=${tf}`);
      if (res.success) setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissed(timeframe);
  }, [timeframe]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/70 via-indigo-950/70 to-slate-900 border border-purple-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              AI-Powered Academic Synthesizer
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              What Did I Miss?
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Instant AI digest of all verified assignments, rescheduled exams, and newly uploaded lecture materials added while you were away.
            </p>
          </div>

          {/* Timeframe Filter Chips */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-inner">
            {[
              { label: '24 Hours', value: '24h' },
              { label: '3 Days', value: '3d' },
              { label: '1 Week', value: '7d' },
              { label: '30 Days', value: '30d' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setTimeframe(tab.value)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  timeframe === tab.value
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 space-y-3">
          <Sparkles className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
          <p className="text-sm font-semibold">Synthesizing recent college updates & timetable changes...</p>
        </div>
      ) : data ? (
        <div className="space-y-8">
          
          {/* Section 1: 🔴 High-Priority Deadlines & Action Items */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">🔴 Important Deadlines & Immediate Actions</h2>
                <p className="text-xs text-slate-400">High priority assignments and mandatory submissions requiring your attention</p>
              </div>
            </div>

            {data.important?.length === 0 ? (
              <p className="text-xs text-slate-400 italic p-4 rounded-xl bg-slate-900 border border-slate-800">
                No urgent deadlines recorded in this timeframe.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.important?.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-gradient-to-br from-red-950/20 via-slate-900 to-slate-900 border border-red-500/30 shadow-sm space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                          {item.type || 'Assignment'}
                        </span>
                        <span className="text-xs text-amber-300 font-mono flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Due: {item.deadline}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white">{item.title}</h3>
                      <p className="text-xs text-slate-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <strong>Action:</strong> {item.action}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Faculty: {item.teacher || 'Department Lead'}</span>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => navigate('/assignments')}
                        icon={ArrowRight}
                        iconPosition="right"
                      >
                        Go to Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: 📝 Scheduled & Rescheduled Exams */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">📝 Upcoming Exams & Internal Assessments</h2>
                <p className="text-xs text-slate-400">Official dates, venues, and syllabus boundaries</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.upcomingExams?.map((ex, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-900/80 border border-indigo-500/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {ex.subject}
                    </span>
                    <span className="text-xs text-indigo-300 font-mono font-bold">
                      {ex.date} ({ex.time})
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{ex.title}</h3>
                  <p className="text-xs text-slate-400">Venue: <strong className="text-slate-200">{ex.venue}</strong></p>
                  <p className="text-xs text-slate-300 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                    <strong>Syllabus:</strong> {ex.syllabus}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: 📚 New Study Materials & Solved PYQs */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">📚 New Study Materials & Solved PYQs</h2>
                <p className="text-xs text-slate-400">Lecture slides, handwritten notes, and university question banks</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.newMaterials?.map((mat, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {mat.type}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{mat.unit}</span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-100">{mat.title}</h3>
                    <p className="text-[11px] text-slate-400">{mat.subject} • {mat.teacher}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => navigate('/study-materials')}
                  >
                    View Material
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: 🎉 College Events & Placement Opportunities */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">🎉 College Events & Placement Opportunities</h2>
                <p className="text-xs text-slate-400">Hackathons, recruitment drives, and student symposiums</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.upcomingEvents?.map((ev, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {ev.type}
                    </span>
                    <span className="text-xs text-amber-300 font-mono">{ev.date}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{ev.title}</h3>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : null}

    </div>
  );
}
