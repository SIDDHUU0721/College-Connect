import React from 'react';

export default function PriorityBadge({ priority, size = 'md' }) {
  const p = (priority || 'Medium').toLowerCase();

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  };

  if (p === 'high') {
    return (
      <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full bg-red-500/10 text-red-400 border border-red-500/30 shadow-sm shadow-red-500/20 ${sizeClasses[size]}`}>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
        HIGH PRIORITY
      </span>
    );
  }

  if (p === 'low') {
    return (
      <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 ${sizeClasses[size]}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
        LOW PRIORITY
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 ${sizeClasses[size]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
      MEDIUM PRIORITY
    </span>
  );
}
