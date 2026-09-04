import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import PriorityBadge from '../../components/common/PriorityBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import { FileText, Clock, CheckCircle2, AlertCircle, Plus, Users } from 'lucide-react';

export default function AssignmentsPage() {
  const { user, isTeacher, isAdmin } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('High');
  const [description, setDescription] = useState('');
  const [totalPoints, setTotalPoints] = useState(25);

  const loadData = async () => {
    try {
      const [asgRes, subRes] = await Promise.all([
        api.get('/academic/assignments'),
        api.get('/academic/subjects')
      ]);
      if (asgRes.success) setAssignments(asgRes.assignments || []);
      if (subRes.success) {
        setSubjects(subRes.subjects || []);
        if (subRes.subjects.length > 0 && !subjectId) setSubjectId(subRes.subjects[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/academic/assignments', {
        title,
        subjectId,
        dueDate,
        priority,
        description,
        totalPoints: Number(totalPoints)
      });
      if (res.success) {
        setCreateModalOpen(false);
        setTitle('');
        setDescription('');
        loadData();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-bold mb-2">
            <FileText className="w-3.5 h-3.5" /> Academic Tasks & Due Dates
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Assignments & Coursework
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track submission deadlines, rubric guidelines, and task instructions verified by faculty.
          </p>
        </div>

        {(isTeacher || isAdmin) && (
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setCreateModalOpen(true)}
          >
            Create Assignment
          </Button>
        )}
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {assignments.map((asg) => (
          <div
            key={asg.id}
            className="p-6 rounded-3xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 shadow-xl space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {asg.subjectName}
                </span>
                <PriorityBadge priority={asg.priority} />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-amber-300 font-mono font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                <Clock className="w-3.5 h-3.5" /> Due: {asg.dueDate}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">{asg.title}</h2>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{asg.description}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Users className="w-4 h-4 text-indigo-400" />
                <span>Faculty: <strong className="text-white">{asg.teacherName}</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-400">Submissions: <strong>{asg.submissionCount || 42} / {asg.totalStudents || 68}</strong></span>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-indigo-300 font-bold border border-slate-700">
                  {asg.totalPoints || 25} Points
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create Official Course Assignment"
        subtitle="This will notify all enrolled students and log an official audit event."
      >
        <form onSubmit={handleCreateAssignment} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Assignment Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., DBMS Assignment 2: Relational Calculus & Index Tuning"
              className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Subject</label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Due Date & Time</label>
              <input
                type="text"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="e.g., September 8, 2026 (5:00 PM)"
                className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
              >
                <option value="High">High (🔴 Urgent Action)</option>
                <option value="Medium">Medium (🟡 Regular)</option>
                <option value="Low">Low (🟢 Optional)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Total Marks / Points</label>
              <input
                type="number"
                value={totalPoints}
                onChange={(e) => setTotalPoints(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Detailed Instructions</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain submission format, test dataset, code repo requirements..."
              className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Create Assignment</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
