import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import AuditDiffModal from '../../components/common/AuditDiffModal';
import { History, ShieldCheck, Search, Filter, Calendar, UserCheck } from 'lucide-react';
import { format } from 'date-fns';

export default function AuditLogsPage() {
  const [logs, setAuditLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        const res = await api.get('/audit/logs');
        if (res.success) setAuditLogs(res.logs || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  const filtered = logs.filter(l =>
    l.changeSummary.toLowerCase().includes(search.toLowerCase()) ||
    l.userName.toLowerCase().includes(search.toLowerCase()) ||
    l.entityTitle.toLowerCase().includes(search.toLowerCase()) ||
    l.action.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Immutable Audit Ledger
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Academic Audit Logs & Change History
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Every modification to official exam dates, assignments, and study materials is permanently logged with before/after diffs and faculty attribution.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit trail by professor, action, or modified entity..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Audit Timeline */}
      <div className="space-y-3">
        {filtered.map((log) => (
          <div
            key={log.id}
            className="p-5 rounded-3xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-rose-500/30 transition-all duration-300 shadow-xl space-y-3 flex flex-col justify-between"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {log.action}
                </span>
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                  {log.userName}
                  <span className="text-[10px] text-slate-400 font-normal">({log.userRole})</span>
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {log.timestamp ? format(new Date(log.timestamp), 'MMM d, yyyy • h:mm a') : 'Recent'}
              </span>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-100">{log.changeSummary}</p>
              <p className="text-xs text-slate-400 mt-1">
                Affected Entity: <strong className="text-slate-300">{log.entityTitle}</strong> ({log.subjectName})
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono text-[10px]">Record ID: {log.id}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedLog(log)}
              >
                Inspect Before / After Diff
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Audit Diff Modal */}
      <AuditDiffModal
        isOpen={Boolean(selectedLog)}
        onClose={() => setSelectedLog(null)}
        log={selectedLog}
      />

    </div>
  );
}
