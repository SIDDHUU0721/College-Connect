import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import PriorityBadge from '../../components/common/PriorityBadge';
import StatusBadge from '../../components/common/StatusBadge';
import { Sparkles, Clock, CheckCircle2, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadAnnouncements = async () => {
    try {
      let url = `/announcements?`;
      if (categoryFilter) url += `category=${categoryFilter}&`;
      if (priorityFilter) url += `priority=${priorityFilter}&`;
      if (search) url += `search=${encodeURIComponent(search)}&`;

      const res = await api.get(url);
      if (res.success) setAnnouncements(res.announcements || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, [categoryFilter, priorityFilter, search]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Official Broadcast Stream
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Announcements & Academic Notices
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Faculty circulars, exam schedule notifications, and placement registration drives verified by department heads.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[220px]">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search announcements by keywords..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none"
          >
            <option value="">All Categories</option>
            <option value="Assignment">Assignment</option>
            <option value="Exam">Exam</option>
            <option value="Placement">Placement</option>
            <option value="Event">Event / Hackathon</option>
            <option value="Faculty Instruction">Faculty Instruction</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none"
          >
            <option value="">All Priorities</option>
            <option value="High">🔴 High Priority</option>
            <option value="Medium">🟡 Medium Priority</option>
            <option value="Low">🟢 Low Priority</option>
          </select>
        </div>
      </div>

      {/* Announcements Feed */}
      <div className="space-y-4">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className="p-6 rounded-3xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 shadow-xl space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <PriorityBadge priority={ann.priority} />
                {ann.isNew && <StatusBadge type="new" />}
                {ann.isUpdated && <StatusBadge type="updated" />}
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-lg bg-slate-800 text-indigo-300 border border-slate-700">
                  {ann.category}
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {ann.updatedAt ? format(new Date(ann.updatedAt), 'MMM d, yyyy • h:mm a') : 'Recent'}
              </span>
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">{ann.title}</h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">{ann.content}</p>
            </div>

            {(ann.action || ann.deadline) && (
              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex flex-wrap items-center justify-between gap-2 text-xs">
                {ann.action && (
                  <div className="flex items-center gap-1.5 text-indigo-300 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    <span>Action: {ann.action}</span>
                  </div>
                )}
                {ann.deadline && (
                  <div className="flex items-center gap-1.5 text-amber-300 font-medium font-mono">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Deadline: {ann.deadline}</span>
                  </div>
                )}
              </div>
            )}

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Faculty: <strong className="text-slate-200">{ann.teacherName}</strong> ({ann.subjectName || 'Department General'})</span>
              <span className="text-[11px] text-slate-500">Last edited: {ann.lastEditedBy}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
