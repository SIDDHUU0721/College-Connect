import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import NotificationDrawer from './NotificationDrawer';
import SearchModal from '../common/SearchModal';
import { Bot, Sparkles } from 'lucide-react';

export default function AppLayout() {
  const { user, loading } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  // Global keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080C16] flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Verifying credentials...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#080C16] text-slate-100 flex flex-col font-sans">
      <Navbar onOpenSearch={() => setSearchOpen(true)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />
        
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Floating AI Assistant Trigger Orb (Available for Students and Faculty) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => navigate('/assistant')}
          className="relative group flex items-center gap-2.5 p-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-1 transition-all duration-300 border border-white/20"
          title="Open AI College Assistant"
        >
          <span className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 opacity-40 group-hover:opacity-75 blur-sm transition duration-300 animate-pulse-slow"></span>
          
          <div className="relative flex items-center gap-2">
            <Bot className="w-5 h-5 text-white animate-bounce" />
            <span className="text-xs font-bold tracking-tight hidden sm:inline">Ask AI Assistant</span>
            <Sparkles className="w-3.5 h-3.5 text-pink-300" />
          </div>
        </button>
      </div>

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Notification Drawer */}
      <NotificationDrawer />
    </div>
  );
}
