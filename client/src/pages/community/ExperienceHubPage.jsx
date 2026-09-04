import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import CreateExperienceModal from './CreateExperienceModal';
import { useAuth } from '../../context/AuthContext';
import {
  Award,
  Heart,
  Bookmark,
  MessageCircle,
  Plus,
  Search,
  Filter,
  Code2,
  Calendar,
  Building,
  CheckCircle2,
  Sparkles,
  UserCheck,
  Send
} from 'lucide-react';
import { format } from 'date-fns';

export default function ExperienceHubPage() {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [search, setSearch] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);

  const loadExperiences = async () => {
    try {
      let url = `/experiences?`;
      if (categoryFilter) url += `category=${categoryFilter}&`;
      if (search) url += `search=${encodeURIComponent(search)}&`;

      const res = await api.get(url);
      if (res.success) setExperiences(res.experiences || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperiences();
  }, [categoryFilter, search]);

  const handleUpvote = async (id) => {
    try {
      const res = await api.post(`/experiences/${id}/upvote`);
      if (res.success) {
        setExperiences(prev => prev.map(e => e.id === id ? { ...e, upvotes: res.upvotes, hasUpvoted: res.hasUpvoted } : e));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (id) => {
    try {
      const res = await api.post(`/experiences/${id}/save`);
      if (res.success) {
        setExperiences(prev => prev.map(e => e.id === id ? { ...e, hasSaved: res.hasSaved } : e));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (postId) => {
    if (!commentText.trim()) return;
    try {
      const res = await api.post(`/experiences/${postId}/comments`, { content: commentText.trim() });
      if (res.success) {
        setCommentText('');
        setExperiences(prev => prev.map(e => e.id === postId ? { ...e, comments: res.comments } : e));
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/50 border border-amber-500/30 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
            <Award className="w-3.5 h-3.5" /> Peer & Faculty Knowledge Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Experience Hub
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Real hackathon victories, research roadmaps, and internship insights written by students & faculty across departments.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setCreateModalOpen(true)}
          size="lg"
        >
          Share Your Experience
        </Button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {['', 'Hackathon', 'Internship', 'Research', 'Project', 'Industry', 'Career Advice'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {cat || 'All Categories'}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search experiences & skills..."
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Experience Feed */}
      <div className="space-y-6">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/30 transition-all duration-300 shadow-xl space-y-4"
          >
            {/* Author Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {exp.authorName?.[0] || 'U'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{exp.authorName}</h3>
                    <span className={`px-2 py-0.5 text-[9px] uppercase font-bold rounded ${
                      exp.authorRole === 'Teacher'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    }`}>
                      {exp.authorRole}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{exp.organization} • {exp.date}</p>
                </div>
              </div>

              <span className="px-3 py-1 text-xs font-bold rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30">
                {exp.category}
              </span>
            </div>

            {/* Title & Body */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">{exp.title}</h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                {exp.description}
              </p>
            </div>

            {/* Key Challenge & Advice Highlight Callouts */}
            {(exp.challenges || exp.advice) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {exp.challenges && (
                  <div className="p-3.5 rounded-2xl bg-red-950/20 border border-red-500/30 text-xs space-y-1">
                    <span className="font-bold text-red-400 block text-[10px] uppercase tracking-wider">CHALLENGE TACKLED</span>
                    <p className="text-slate-300">{exp.challenges}</p>
                  </div>
                )}
                {exp.advice && (
                  <div className="p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 text-xs space-y-1">
                    <span className="font-bold text-indigo-400 block text-[10px] uppercase tracking-wider">PRO ADVICE FOR JUNIORS</span>
                    <p className="text-slate-300">{exp.advice}</p>
                  </div>
                )}
              </div>
            )}

            {/* Technologies Chips */}
            {exp.technologies?.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {exp.technologies.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-lg bg-slate-800 text-[11px] text-slate-300 border border-slate-700 font-mono"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* Social Engagement Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleUpvote(exp.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    exp.upvotedBy?.includes(user?.id) || exp.hasUpvoted
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${exp.upvotedBy?.includes(user?.id) || exp.hasUpvoted ? 'fill-rose-400' : ''}`} />
                  <span>{exp.upvotes || 0} Upvotes</span>
                </button>

                <button
                  onClick={() => setActiveCommentPostId(activeCommentPostId === exp.id ? null : exp.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{exp.comments?.length || 0} Comments</span>
                </button>
              </div>

              <button
                onClick={() => handleSave(exp.id)}
                className={`p-2 rounded-xl border transition-colors ${
                  exp.savedBy?.includes(user?.id) || exp.hasSaved
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400 border-slate-700'
                }`}
                title="Save bookmark"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>

            {/* Expandable Comments Drawer */}
            {activeCommentPostId === exp.id && (
              <div className="pt-4 border-t border-slate-800 space-y-3 animate-fade-in">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Community Discussion</h4>

                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {exp.comments?.length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-2">No comments yet. Start the discussion!</p>
                  ) : (
                    exp.comments?.map((c) => (
                      <div key={c.id} className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-indigo-300">{c.authorName} ({c.authorRole})</span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {c.createdAt ? format(new Date(c.createdAt), 'MMM d, h:mm a') : 'Recent'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-200">{c.content}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Comment Input */}
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write an encouraging question or remark..."
                    className="flex-1 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddComment(exp.id);
                    }}
                  />
                  <Button size="sm" variant="primary" onClick={() => handleAddComment(exp.id)} icon={Send}>
                    Post
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create Experience Modal */}
      <CreateExperienceModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={loadExperiences}
      />

    </div>
  );
}
