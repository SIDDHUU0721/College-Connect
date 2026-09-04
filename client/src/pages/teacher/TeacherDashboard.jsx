import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Button from '../../components/common/Button';
import PriorityBadge from '../../components/common/PriorityBadge';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import {
  Sparkles,
  PlusCircle,
  FileText,
  BookOpen,
  Calendar,
  Star,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  Brain,
  Trash2,
  Edit,
  ArrowRight
} from 'lucide-react';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Announcement NLP Live Creator state
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [nlpPreview, setNlpPreview] = useState(null);
  const [nlpLoading, setNlpLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);

  // Material Upload Modal state
  const [matModalOpen, setMatModalOpen] = useState(false);
  const [matTitle, setMatTitle] = useState('');
  const [matUnit, setMatUnit] = useState('Unit 1');
  const [matType, setMatType] = useState('pdf');
  const [matDesc, setMatDesc] = useState('');
  const [matSubjectId, setMatSubjectId] = useState('');

  // Live NLP trigger on announcement typing
  useEffect(() => {
    if (!annContent || annContent.length < 10) {
      setNlpPreview(null);
      return;
    }

    const timer = setTimeout(async () => {
      setNlpLoading(true);
      try {
        const res = await api.post('/nlp/analyze', { text: annContent });
        if (res.success) setNlpPreview(res);
      } catch (err) {
        console.error('Live NLP error:', err);
      } finally {
        setNlpLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [annContent]);

  const loadTeacherData = async () => {
    try {
      const [annRes, matRes, subRes, repRes] = await Promise.all([
        api.get('/announcements'),
        api.get('/academic/materials'),
        api.get('/academic/subjects'),
        api.get('/student-voice/reports')
      ]);

      if (annRes.success) setAnnouncements(annRes.announcements || []);
      if (matRes.success) {
        // Filter teacher's own materials or related
        setMaterials(matRes.materials.filter(m => m.teacherId === user?.id || user?.role === 'admin'));
      }
      if (subRes.success) {
        setSubjects(subRes.subjects || []);
        if (subRes.subjects.length > 0 && !selectedSubjectId) {
          setSelectedSubjectId(subRes.subjects[0].id);
          setMatSubjectId(subRes.subjects[0].id);
        }
      }
      if (repRes.success) {
        setReports(repRes.reports.filter(r => r.teacherId === user?.id || user?.role === 'admin'));
      }

      if (user?.id) {
        const fbRes = await api.get(`/feedback/teachers/${user.id}`);
        if (fbRes.success) setFeedback(fbRes.feedback);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeacherData();
  }, [user]);

  const handlePublishAnnouncement = async (e) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;
    setPublishing(true);

    try {
      const payload = {
        title: annTitle,
        content: annContent,
        subjectId: selectedSubjectId,
        category: nlpPreview?.category,
        priority: nlpPreview?.priority,
        deadline: nlpPreview?.deadline,
        action: nlpPreview?.action,
        department: nlpPreview?.department,
        targetYear: nlpPreview?.year
      };

      const res = await api.post('/announcements', payload);
      if (res.success) {
        setAnnTitle('');
        setAnnContent('');
        setNlpPreview(null);
        loadTeacherData();
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setPublishing(false);
    }
  };

  const handleCreateMaterial = async (e) => {
    e.preventDefault();
    if (!matTitle || !matSubjectId) return;

    try {
      const res = await api.post('/academic/materials', {
        title: matTitle,
        subjectId: matSubjectId,
        type: matType,
        unit: matUnit,
        description: matDesc,
        category: 'Lecture Notes'
      });

      if (res.success) {
        setMatModalOpen(false);
        setMatTitle('');
        setMatDesc('');
        loadTeacherData();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteMaterial = async (id) => {
    if (!window.confirm('Are you sure you want to delete this study material? This action will be logged in the official audit trail.')) return;
    try {
      await api.delete(`/academic/materials/${id}`);
      loadTeacherData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Teacher Profile Hero */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/30 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user?.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-500/40 shadow-lg"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 flex items-center justify-center font-black text-white text-xl border-2 border-purple-500/40 shadow-lg">
              {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'FC'}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">{user?.name}</h1>
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                Verified Faculty
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">{user?.designation || 'Associate Professor'} • {user?.department}</p>
            <p className="text-[11px] text-slate-400 font-mono mt-1">Faculty ID: {user?.facultyId || 'FAC-CSE-042'}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="primary"
            icon={Upload}
            onClick={() => setMatModalOpen(true)}
          >
            Upload Study Material / PYQ
          </Button>
        </div>
      </div>

      {/* Main Grid: Live NLP Announcement Studio & Material Management */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 7 Cols: Live NLP Announcement Creator */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white">AI-Powered Announcement Studio</h2>
            </div>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              NLP Auto-Classification
            </span>
          </div>

          <form onSubmit={handlePublishAnnouncement} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Announcement Title</label>
              <input
                type="text"
                required
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                placeholder="e.g., Mandatory DBMS Assignment 2 Submission & Lab Viva"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">Course / Subject</label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Announcement Message (Live NLP Analyzer extracts deadlines, actions & priorities)
              </label>
              <textarea
                rows={4}
                required
                value={annContent}
                onChange={(e) => setAnnContent(e.target.value)}
                placeholder="Type details... e.g. All third-year CSE students must submit the DBMS assignment by September 8 at 5 PM."
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Live NLP Extraction Preview Box */}
            {nlpLoading && (
              <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin text-indigo-400" />
                NLP parsing entities, deadlines & priority...
              </div>
            )}

            {nlpPreview && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/30 to-purple-950/20 border border-indigo-500/40 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-400" /> Auto-Extracted Meta
                  </span>
                  <PriorityBadge priority={nlpPreview.priority} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
                    <span className="text-[10px] text-slate-400 block font-mono">CATEGORY</span>
                    <strong className="text-white">{nlpPreview.category}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
                    <span className="text-[10px] text-slate-400 block font-mono">TARGET YEAR</span>
                    <strong className="text-white">{nlpPreview.year || 'All Years'}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
                    <span className="text-[10px] text-slate-400 block font-mono">DEADLINE</span>
                    <strong className="text-amber-300">{nlpPreview.deadline || 'None'}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
                    <span className="text-[10px] text-slate-400 block font-mono">DEPARTMENT</span>
                    <strong className="text-white truncate block">{nlpPreview.department}</strong>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/40 text-xs text-slate-300">
                  <strong>Extracted Action:</strong> {nlpPreview.action}
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              loading={publishing}
              size="lg"
              className="w-full"
            >
              Publish Official Announcement
            </Button>
          </form>
        </div>

        {/* Right 5 Cols: Feedback Ratings & Content Reports */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Teaching Feedback Aggregated Metrics */}
          {feedback && (
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">Teaching Feedback Metrics</h3>
                </div>
                <span className="text-xs font-bold text-amber-400 font-mono">
                  ⭐ 4.8 / 5.0
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                {Object.entries(feedback.ratings || {}).map(([key, val]) => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between text-slate-300 capitalize">
                      <span>{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="font-mono text-indigo-300 font-bold">{val} / 5.0</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                        style={{ width: `${(val / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Student Reports on Teacher Content */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-white">Student Academic Requests</h3>
              </div>
              <span className="text-xs text-slate-400">{reports.length} pending</span>
            </div>

            <div className="space-y-3">
              {reports.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No open student reports for your courses.</p>
              ) : (
                reports.map((r) => (
                  <div key={r.id} className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-100">{r.title}</h4>
                      <StatusBadge type={r.status === 'Resolved' ? 'resolved' : 'review'} />
                    </div>
                    <p className="text-[11px] text-slate-400">{r.description}</p>
                    <p className="text-[10px] text-indigo-300">From: {r.studentName} ({r.subjectName})</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Uploaded Materials & PYQs List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Your Uploaded Materials & Solved PYQs</h2>
          </div>
          <Button size="sm" variant="secondary" onClick={() => setMatModalOpen(true)}>
            + Add Material
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {materials.map((mat) => (
            <div
              key={mat.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {mat.type}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{mat.unit}</span>
                </div>
                <h3 className="text-sm font-bold text-white">{mat.title}</h3>
                <p className="text-xs text-slate-300 line-clamp-2">{mat.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Rating: ⭐ {mat.rating || '5.0'}</span>
                <button
                  onClick={() => handleDeleteMaterial(mat.id)}
                  className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Delete Material (Creates Audit Record)"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Study Material Modal */}
      <Modal
        isOpen={matModalOpen}
        onClose={() => setMatModalOpen(false)}
        title="Upload Verified Study Material / Solved PYQ"
        subtitle="This material will be indexed by NLP and made accessible to enrolled students."
      >
        <form onSubmit={handleCreateMaterial} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Material Title</label>
            <input
              type="text"
              required
              value={matTitle}
              onChange={(e) => setMatTitle(e.target.value)}
              placeholder="e.g., Unit 2: Syntactic Parsing & Dependency Graphs Master Notes"
              className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Subject</label>
              <select
                value={matSubjectId}
                onChange={(e) => setMatSubjectId(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Unit / Scope</label>
              <select
                value={matUnit}
                onChange={(e) => setMatUnit(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
              >
                <option value="Unit 1">Unit 1</option>
                <option value="Unit 2">Unit 2</option>
                <option value="Unit 3">Unit 3</option>
                <option value="Unit 4">Unit 4</option>
                <option value="Unit 5">Unit 5</option>
                <option value="All Units">All Units / Complete Question Bank</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Document Format</label>
              <select
                value={matType}
                onChange={(e) => setMatType(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
              >
                <option value="pdf">PDF Document</option>
                <option value="ppt">PowerPoint Presentation (PPT)</option>
                <option value="notes">Handwritten / Digital Notes</option>
                <option value="pyq">Solved Previous Year Questions (PYQ)</option>
                <option value="questions">Important Questions Bank</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Brief Description</label>
            <textarea
              rows={3}
              value={matDesc}
              onChange={(e) => setMatDesc(e.target.value)}
              placeholder="Explain key topics, derivations, model solutions or exam relevance..."
              className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setMatModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Publish Study Material</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
