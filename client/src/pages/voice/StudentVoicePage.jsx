import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import {
  MessageSquareQuote,
  Plus,
  AlertCircle,
  CheckCircle2,
  Clock,
  Filter,
  UserCheck
} from 'lucide-react';
import { format } from 'date-fns';

export default function StudentVoicePage() {
  const { user, isTeacher, isAdmin } = useAuth();
  const [reports, setReports] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [resolutionStatus, setResolutionStatus] = useState('Resolved');
  const [resolutionNote, setResolutionNote] = useState('');

  // New report form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Missing study material');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState('');

  const loadReports = async () => {
    try {
      let url = `/student-voice/reports?`;
      if (statusFilter) url += `status=${statusFilter}&`;
      const [repRes, subRes] = await Promise.all([
        api.get(url),
        api.get('/academic/subjects')
      ]);

      if (repRes.success) setReports(repRes.reports || []);
      if (subRes.success) {
        setSubjects(subRes.subjects || []);
        if (subRes.subjects.length > 0 && !subjectId) setSubjectId(subRes.subjects[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadReports();
  }, [statusFilter]);

  const handleCreateReport = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/student-voice/reports', {
        title,
        category,
        description,
        subjectId
      });
      if (res.success) {
        setCreateModalOpen(false);
        setTitle('');
        setDescription('');
        loadReports();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedReport) return;
    try {
      const res = await api.put(`/student-voice/reports/${selectedReport.id}/status`, {
        status: resolutionStatus,
        adminNote: resolutionNote
      });
      if (res.success) {
        setResolveModalOpen(false);
        loadReports();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-sky-950/40 via-slate-900 to-indigo-950/50 border border-sky-500/30 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 text-xs font-bold">
            <MessageSquareQuote className="w-3.5 h-3.5" /> Direct Academic Redressal Channel
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Student Voice & Academic Needs
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Report missing study notes, clash in lab schedules, infrastructure issues or coursework queries directly to faculty and college administration.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setCreateModalOpen(true)}
          size="lg"
        >
          Submit Issue / Request
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 w-fit">
        {[
          { label: 'All Requests', value: '' },
          { label: 'Submitted', value: 'Submitted' },
          { label: 'Under Review', value: 'Under Review' },
          { label: 'Resolved', value: 'Resolved' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === tab.value
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reports Feed */}
      <div className="space-y-4">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="p-6 rounded-3xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 transition-all duration-300 shadow-xl space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-800 text-sky-300 border border-slate-700">
                    {rep.category}
                  </span>
                  <StatusBadge
                    type={rep.status === 'Resolved' ? 'resolved' : (rep.status === 'Under Review' ? 'review' : 'submitted')}
                    text={rep.status}
                  />
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {rep.createdAt ? format(new Date(rep.createdAt), 'MMM d, yyyy') : 'Recent'}
                </span>
              </div>

              <div>
                <h2 className="text-base font-bold text-white">{rep.title}</h2>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{rep.description}</p>
              </div>

              {/* Resolution Note if present */}
              {rep.adminNote && (
                <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-1">
                  <span className="font-bold text-emerald-400 block text-[10px] uppercase tracking-wider">
                    FACULTY / ADMIN RESOLUTION NOTE:
                  </span>
                  <p className="text-emerald-200">{rep.adminNote}</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Submitted by: <strong className="text-slate-200">{rep.studentName}</strong> • Assigned: <strong className="text-slate-200">{rep.teacherName}</strong></span>

              {(isTeacher || isAdmin) && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setSelectedReport(rep);
                    setResolutionStatus(rep.status === 'Submitted' ? 'Under Review' : 'Resolved');
                    setResolutionNote(rep.adminNote || '');
                    setResolveModalOpen(true);
                  }}
                >
                  Update Status & Reply
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Submit Issue Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Submit Academic Issue / Missing Material Request"
        subtitle="Your request will be routed directly to the course faculty and college administration."
      >
        <form onSubmit={handleCreateReport} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Issue Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Missing Unit 4 Practice Proofs for DBMS Concurrency Control"
              className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
              >
                <option value="Missing study material">Missing study material</option>
                <option value="Academic issue">Academic / Coursework issue</option>
                <option value="Exam issue">Exam / Assessment query</option>
                <option value="Timetable issue">Timetable clash / Room issue</option>
                <option value="Incorrect information">Incorrect information report</option>
                <option value="Infrastructure issue">Infrastructure / Lab equipment issue</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Related Course</label>
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
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Detailed Explanation</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain precisely what you need or what error was noticed..."
              className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Submit Request</Button>
          </div>
        </form>
      </Modal>

      {/* Status Update Modal */}
      <Modal
        isOpen={resolveModalOpen}
        onClose={() => setResolveModalOpen(false)}
        title={`Update Report: ${selectedReport?.title}`}
        subtitle="Change the lifecycle status and supply an official resolution comment for the student."
      >
        <form onSubmit={handleUpdateStatus} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Resolution Status</label>
            <select
              value={resolutionStatus}
              onChange={(e) => setResolutionStatus(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
            >
              <option value="Submitted">Submitted (Pending review)</option>
              <option value="Under Review">Under Review (Faculty in progress)</option>
              <option value="Resolved">Resolved (Action taken / material updated)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Resolution Explanation</label>
            <textarea
              rows={3}
              required
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              placeholder="e.g. Uploaded the complete Unit 4 concurrency notes with solved 2PL practice questions."
              className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setResolveModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Status & Notify Student</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
