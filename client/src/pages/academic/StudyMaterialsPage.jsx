import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import {
  FolderGit2,
  Search,
  Filter,
  Download,
  Star,
  BookOpen,
  Plus,
  Trash2,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';

export default function StudyMaterialsPage() {
  const { user, isTeacher, isAdmin } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [unitFilter, setUnitFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Review Modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedMat, setSelectedMat] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const loadMaterials = async () => {
    try {
      let url = `/academic/materials?`;
      if (typeFilter) url += `type=${typeFilter}&`;
      if (unitFilter) url += `unit=${unitFilter}&`;
      if (search) url += `search=${encodeURIComponent(search)}&`;

      const res = await api.get(url);
      if (res.success) setMaterials(res.materials || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, [typeFilter, unitFilter, search]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMat) return;

    try {
      const res = await api.post(`/feedback/materials/${selectedMat.id}/reviews`, {
        rating: Number(rating),
        clarity: Number(rating),
        completeness: Number(rating),
        usefulness: Number(rating),
        comment
      });

      if (res.success) {
        setReviewModalOpen(false);
        setComment('');
        loadMaterials();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold mb-2">
            <FolderGit2 className="w-3.5 h-3.5" /> Verified Academic Repository
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Study Materials & Solved PYQs
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Faculty-uploaded notes, PowerPoint slides, and solved university question papers with peer reviews.
          </p>
        </div>
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
              placeholder="Search notes by topic, professor, unit..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none"
          >
            <option value="">All Document Formats</option>
            <option value="pdf">PDF Documents</option>
            <option value="ppt">PPT Presentations</option>
            <option value="notes">Lecture Notes</option>
            <option value="pyq">Solved PYQ Papers</option>
          </select>

          <select
            value={unitFilter}
            onChange={(e) => setUnitFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none"
          >
            <option value="">All Units</option>
            <option value="Unit 1">Unit 1</option>
            <option value="Unit 2">Unit 2</option>
            <option value="Unit 3">Unit 3</option>
            <option value="All Units">All Units</option>
          </select>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {materials.map((mat) => (
          <div
            key={mat.id}
            className="p-6 rounded-3xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 shadow-xl flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded-lg border ${
                  mat.type === 'pyq'
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}>
                  {mat.type === 'pyq' ? 'Solved PYQ' : mat.type.toUpperCase()}
                </span>
                <span className="text-xs text-slate-400 font-mono font-bold">{mat.unit}</span>
              </div>

              <div>
                <h2 className="text-base font-bold text-white leading-snug">{mat.title}</h2>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed line-clamp-2">
                  {mat.description}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">FACULTY</span>
                  <strong className="text-slate-200">{mat.teacherName}</strong>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">SUBJECT</span>
                  <strong className="text-indigo-300">{mat.subjectName}</strong>
                </div>
              </div>
            </div>

            {/* Footer & Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400 font-mono flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {mat.rating || '4.9'}
                </span>
                <button
                  onClick={() => {
                    setSelectedMat(mat);
                    setReviewModalOpen(true);
                  }}
                  className="text-xs text-slate-400 hover:text-indigo-300 underline"
                >
                  ({mat.reviewsCount || 1} reviews)
                </button>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={mat.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md shadow-emerald-500/20 transition-all hover:-translate-y-0.5"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title={`Review Material: ${selectedMat?.title}`}
        subtitle="Help fellow students by rating clarity, completeness, and usefulness."
      >
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Overall Rating (1 - 5 Stars)</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className={`p-2 rounded-xl text-lg font-bold border transition-colors ${
                    rating >= star
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : 'bg-slate-800 text-slate-500 border-slate-700'
                  }`}
                >
                  ⭐ {star}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Feedback & Notes for Classmates</label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. Excellent solved PYQ derivations, very clear CYK parsing explanation..."
              className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setReviewModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Submit Review</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
