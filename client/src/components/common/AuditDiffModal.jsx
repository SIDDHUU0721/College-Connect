import React from 'react';
import Modal from './Modal';
import { History, UserCheck, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';

export default function AuditDiffModal({ isOpen, onClose, log }) {
  if (!log) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Change Audit & Version Diff"
      subtitle={`Audit Record #${log.id} • ${log.entityType}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5">
        {/* Editor Meta Card */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">{log.userName}</h4>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  {log.userRole}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{log.subjectName || 'Department General'}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-300 font-mono">
              {log.timestamp ? format(new Date(log.timestamp), 'MMM d, yyyy • h:mm a') : 'Recent'}
            </div>
            <div className="inline-flex items-center gap-1 text-[11px] text-emerald-400 mt-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Immutable Log
            </div>
          </div>
        </div>

        {/* Change Summary */}
        <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Action Summary</p>
          <p className="text-sm text-slate-100 font-medium mt-1">{log.changeSummary}</p>
        </div>

        {/* Before vs After Side-by-Side Diff */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Old Value */}
          <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30">
            <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span> Previous Value (Old)
            </div>
            {log.oldValue ? (
              <pre className="text-xs font-mono text-slate-300 bg-black/40 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(log.oldValue, null, 2)}
              </pre>
            ) : (
              <p className="text-xs text-slate-500 italic py-4 text-center">Initial Creation (No prior state)</p>
            )}
          </div>

          {/* New Value */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Updated Value (New)
            </div>
            {log.newValue ? (
              <pre className="text-xs font-mono text-emerald-200 bg-black/40 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(log.newValue, null, 2)}
              </pre>
            ) : (
              <p className="text-xs text-rose-400 italic py-4 text-center">Deleted / Purged</p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
