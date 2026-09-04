import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { X, CheckCheck, Bell, Sparkles, FileText, Calendar, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import Button from '../common/Button';

export default function NotificationDrawer() {
  const { isOpen, setIsOpen, notifications, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleItemClick = (notif) => {
    markAsRead(notif.id);
    setIsOpen(false);
    if (notif.link) navigate(notif.link);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-[#0F172A] border-l border-slate-700/80 shadow-2xl h-full flex flex-col z-10 animate-slide-left">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Notifications</h3>
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                {notifications.filter(n => !n.read).length} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllAsRead}
              className="p-1.5 text-xs text-slate-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
              title="Mark all as read"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80 p-2">
          {notifications.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm">
              <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              No new notifications right now.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleItemClick(n)}
                className={`p-3.5 rounded-xl cursor-pointer transition-all ${
                  n.read
                    ? 'hover:bg-slate-800/50 opacity-70'
                    : 'bg-indigo-950/20 hover:bg-indigo-950/40 border border-indigo-500/20'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                    {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>}
                    {n.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                    {n.createdAt ? format(new Date(n.createdAt), 'h:mm a') : 'Recent'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">{n.message}</p>
                {n.priority && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${
                      n.priority === 'High' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {n.priority} Priority
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
