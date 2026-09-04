import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, MapPin, Edit3, Sparkles } from 'lucide-react';

export default function ExamsPage() {
  const { user, isTeacher, isAdmin } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit exam modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [examDate, setExamDate] = useState('');
  const [examTime, setExamTime] = useState('');
  const [examVenue, setExamVenue] = useState('');
  const [examSyllabus, setExamSyllabus] = useState('');

  const loadExams = async () => {
    try {
      const res = await api.get('/academic/exams');
      if (res.success) setExams(res.exams || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExams();
  }, []);

  const openEditModal = (ex) => {
    setSelectedExam(ex);
    setExamDate(ex.examDate);
    setExamTime(ex.time);
    setExamVenue(ex.venue);
    setExamSyllabus(ex.syllabus);
    setEditModalOpen(true);
  };

  const handleUpdateExam = async (e) => {
    e.preventDefault();
    if (!selectedExam) return;

    try {
      const res = await api.put(`/academic/exams/${selectedExam.id}`, {
        examDate,
        time: examTime,
        venue: examVenue,
        syllabus: examSyllabus
      });

      if (res.success) {
        setEditModalOpen(false);
        loadExams();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-bold mb-2">
          <Calendar className="w-3.5 h-3.5" /> Examination Schedules & Venues
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Exam Schedule & Assessments
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Official mid-term, model practical, and semester assessment timetables. Rescheduling actions are logged into the official audit trail.
        </p>
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exams.map((ex) => (
          <div
            key={ex.id}
            className="p-6 rounded-3xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 shadow-xl space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 text-xs font-mono font-bold rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {ex.subjectName}
                </span>
                <span className="text-xs text-slate-400 font-semibold">{ex.totalMarks} Marks</span>
              </div>

              <div>
                <h2 className="text-lg font-bold text-white">{ex.title}</h2>
                <div className="mt-2 space-y-1.5 text-xs text-slate-300">
                  <p className="flex items-center gap-2 text-indigo-300 font-semibold">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    {ex.examDate} • {ex.time}
                  </p>
                  <p className="flex items-center gap-2 text-slate-400">
                    <MapPin className="w-4 h-4 text-red-400" />
                    Venue: <strong className="text-slate-200">{ex.venue}</strong>
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">SYLLABUS & UNITS</span>
                <p className="text-xs text-slate-200 leading-relaxed">{ex.syllabus}</p>
              </div>
            </div>

            {(isTeacher || isAdmin) && (
              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <Button
                  size="sm"
                  variant="secondary"
                  icon={Edit3}
                  onClick={() => openEditModal(ex)}
                >
                  Reschedule / Edit Exam (Audited)
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Reschedule Exam: ${selectedExam?.title}`}
        subtitle="Modifications to exam schedules will generate an immutable audit record and trigger push notifications."
      >
        <form onSubmit={handleUpdateExam} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Exam Date</label>
              <input
                type="text"
                required
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                placeholder="e.g., September 12, 2026"
                className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Exam Time</label>
              <input
                type="text"
                required
                value={examTime}
                onChange={(e) => setExamTime(e.target.value)}
                placeholder="e.g., 10:00 AM - 11:30 AM"
                className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Venue / Examination Hall</label>
            <input
              type="text"
              required
              value={examVenue}
              onChange={(e) => setExamVenue(e.target.value)}
              placeholder="e.g., Main Examination Hall 302"
              className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Syllabus Breakdown</label>
            <textarea
              rows={3}
              value={examSyllabus}
              onChange={(e) => setExamSyllabus(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save & Broadcast Reschedule</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
