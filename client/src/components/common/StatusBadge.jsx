import React from 'react';
import { Sparkles, RefreshCw, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function StatusBadge({ type, text, size = 'sm' }) {
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  if (type === 'new') {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold rounded-md bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm ${sizeClass}`}>
        <Sparkles className="w-3 h-3 text-indigo-400" />
        {text || 'NEW'}
      </span>
    );
  }

  if (type === 'updated') {
    return (
      <span className={`inline-flex items-center gap-1 font-medium rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 ${sizeClass}`}>
        <RefreshCw className="w-3 h-3 text-cyan-400" />
        {text || 'UPDATED'}
      </span>
    );
  }

  if (type === 'resolved') {
    return (
      <span className={`inline-flex items-center gap-1 font-medium rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 ${sizeClass}`}>
        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
        {text || 'RESOLVED'}
      </span>
    );
  }

  if (type === 'review') {
    return (
      <span className={`inline-flex items-center gap-1 font-medium rounded-md bg-sky-500/10 text-sky-300 border border-sky-500/30 ${sizeClass}`}>
        <Clock className="w-3 h-3 text-sky-400" />
        {text || 'UNDER REVIEW'}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 font-medium rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 ${sizeClass}`}>
      <AlertCircle className="w-3 h-3 text-amber-400" />
      {text || 'SUBMITTED'}
    </span>
  );
}
