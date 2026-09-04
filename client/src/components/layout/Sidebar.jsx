import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Sparkles,
  BookOpen,
  Users,
  FileText,
  Calendar,
  Clock,
  Award,
  MessageSquareQuote,
  Star,
  ShieldAlert,
  History,
  Bot,
  PlusCircle,
  FolderGit2
} from 'lucide-react';

export default function Sidebar() {
  const { user, isStudent, isTeacher, isAdmin } = useAuth();

  const getDashboardPath = () => {
    if (isAdmin) return '/admin';
    if (isTeacher) return '/teacher-dashboard';
    return '/student-dashboard';
  };

  const navGroups = [
    {
      title: 'Overview',
      items: [
        { name: 'Dashboard', path: getDashboardPath(), icon: LayoutDashboard },
        {
          name: 'What Did I Miss?',
          path: '/what-did-i-miss',
          icon: Sparkles,
          badge: 'AI Briefing',
          badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
        },
        { name: 'AI College Assistant', path: '/assistant', icon: Bot, badge: 'Agent', badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
      ]
    },
    {
      title: 'Academic Navigation',
      items: [
        { name: 'Subject Explorer', path: '/subjects', icon: BookOpen, desc: 'Subject → Teacher' },
        { name: 'Faculty Directory', path: '/teachers', icon: Users, desc: 'Teacher → Subject' },
        { name: 'Study Materials & PYQs', path: '/study-materials', icon: FolderGit2 },
        { name: 'Assignments', path: '/assignments', icon: FileText },
        { name: 'Exams & Schedules', path: '/exams', icon: Calendar },
        { name: 'Timetable', path: '/timetable', icon: Clock },
      ]
    },
    {
      title: 'Community & Voice',
      items: [
        {
          name: 'Experience Hub',
          path: '/experience-hub',
          icon: Award,
          badge: 'Community',
          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
        },
        { name: 'Student Voice & Issues', path: '/student-voice', icon: MessageSquareQuote },
        { name: 'Teaching Feedback', path: '/teaching-feedback', icon: Star },
      ]
    }
  ];

  if (isTeacher || isAdmin) {
    navGroups.push({
      title: 'Teacher Studio',
      items: [
        {
          name: 'Content & NLP Studio',
          path: '/teacher-studio',
          icon: PlusCircle,
          badge: 'Teacher',
          badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
        }
      ]
    });
  }

  if (isAdmin) {
    navGroups.push({
      title: 'Administration',
      items: [
        { name: 'Admin Console', path: '/admin', icon: ShieldAlert },
        {
          name: 'Change History & Audits',
          path: '/audit-logs',
          icon: History,
          badge: 'Immutable',
          badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
        }
      ]
    });
  }

  return (
    <aside className="w-64 shrink-0 hidden lg:block bg-[#090D18] border-r border-slate-800/80 min-h-[calc(100vh-4rem)] p-4 space-y-6">
      {navGroups.map((group, gIdx) => (
        <div key={gIdx} className="space-y-1.5">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {group.title}
          </p>
          <div className="space-y-1 pt-1">
            {group.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/20 text-white border border-indigo-500/40 shadow-sm shadow-indigo-500/10'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded border ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}
