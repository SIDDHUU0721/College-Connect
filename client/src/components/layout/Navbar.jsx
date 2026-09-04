import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  GraduationCap,
  Search,
  Bell,
  LogOut,
  User,
  Shield,
  Briefcase
} from 'lucide-react';

export default function Navbar({ onOpenSearch }) {
  const { user, logout, isStudent, isTeacher, isAdmin } = useAuth();
  const { unreadCount, setIsOpen: setOpenNotifs } = useNotifications();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0F19]/90 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  CollegeConnect
                </span>
                <span className={`px-1.5 py-0.2 text-[9px] font-extrabold uppercase tracking-wider rounded ${
                  isAdmin ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                  isTeacher ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                  'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                }`}>
                  {user?.role} portal
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">Academic & Knowledge Management</p>
            </div>
          </Link>
        </div>

        {/* Global Search Bar (Ctrl+K) */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-700/60 hover:border-indigo-500/40 text-slate-400 hover:text-slate-200 transition-all text-xs group shadow-inner"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span>Search subjects, exams, PYQs, hackathons...</span>
            </div>
            <kbd className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right Section: Notifications & User Profile Menu */}
        <div className="flex items-center gap-3">
          
          {/* Notifications Bell */}
          <button
            onClick={() => setOpenNotifs(true)}
            className="relative p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white ring-2 ring-[#0B0F19] animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Logged-In User Details Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-all"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user?.name}
                  className="w-8 h-8 rounded-xl object-cover border border-slate-600"
                />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs border border-purple-500/40">
                  {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
                </div>
              )}
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-white leading-tight">{user?.name}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{user?.role}</p>
              </div>
            </button>

            {showUserMenu && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0F172A] border border-slate-700 shadow-2xl py-2 z-50 divide-y divide-slate-800"
                onMouseLeave={() => setShowUserMenu(false)}
              >
                <div className="px-4 py-3">
                  <p className="text-xs font-bold text-white">{user?.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded ${
                      isAdmin ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      isTeacher ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                      'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    }`}>
                      {user?.role}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate">{user?.department}</span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Logout from Account
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
