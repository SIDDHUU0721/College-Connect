import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { Star, MessageSquare, ShieldCheck, HeartHandshake, Plus } from 'lucide-react';

export default function TeachingFeedbackPage() {
  const [teachers, setTeachers] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [ratings, setRatings] = useState({
    teachingClarity: 5,
    explanation: 5,
    doubtClarification: 5,
    practicalExamples: 5,
    courseCoverage: 5,
    materialUsefulness: 5
  });
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);

  const loadFeedback = async () => {
    try {
      const [tRes, fRes] = await Promise.all([
        api.get('/academic/teachers'),
        api.get('/feedback/teachers')
      ]);

      if (tRes.success) {
        setTeachers(tRes.teachers || []);
        if (tRes.teachers.length > 0 && !selectedTeacherId) {
          setSelectedTeacherId(tRes.teachers[0].id);
        }
      }
      if (fRes.success) setFeedbackList(fRes.feedback || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  const handleRatingChange = (key, val) => {
    setRatings(prev => ({ ...prev, [key]: Number(val) }));
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!selectedTeacherId) return;

    try {
      const res = await api.post(`/feedback/teachers/${selectedTeacherId}`, {
        ratings,
        comment
      });
      if (res.success) {
        setFeedbackModalOpen(false);
        setComment('');
        loadFeedback();
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
            <Star className="w-3.5 h-3.5 fill-amber-400" /> Anonymous & Aggregated Teaching Quality
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Teaching Evaluation & Feedback
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Constructive, structured feedback to help faculty calibrate course coverage, doubt clarification, and practical problem-solving sessions.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setFeedbackModalOpen(true)}
          size="lg"
        >
          Submit Teaching Feedback
        </Button>
      </div>

      {/* Feedback Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {feedbackList.map((fb) => (
          <div
            key={fb.id}
            className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">{fb.teacherName}</h2>
                  <p className="text-xs text-slate-400">{fb.subjectName}</p>
                </div>
                <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold font-mono">
                  ⭐ 4.8 / 5.0
                </span>
              </div>

              {/* Rating Bars */}
              <div className="space-y-2.5 text-xs">
                {Object.entries(fb.ratings || {}).map(([key, val]) => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between text-slate-300 capitalize font-medium">
                      <span>{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="font-mono text-indigo-300 font-bold">{val} / 5.0</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 via-indigo-500 to-purple-500 rounded-full"
                        style={{ width: `${(val / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Anonymous remarks */}
            {fb.anonymousComments?.length > 0 && (
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Classmates Remarks:</span>
                <p className="text-xs text-slate-300 italic bg-slate-800/40 p-3 rounded-xl border border-slate-700/40">
                  "{fb.anonymousComments[0]}"
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Feedback Submission Modal */}
      <Modal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        title="Submit Anonymous Teaching Feedback"
        subtitle="Your identity is strictly protected. Only aggregated rolling averages and anonymous remarks are recorded."
      >
        <form onSubmit={handleSubmitFeedback} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Select Professor</label>
            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
            >
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>{t.name} ({t.department})</option>
              ))}
            </select>
          </div>

          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Evaluation Dimensions (1 to 5 Stars)</label>
            {Object.keys(ratings).map((metric) => (
              <div key={metric} className="flex items-center justify-between gap-4 p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-xs">
                <span className="text-slate-200 capitalize font-medium">{metric.replace(/([A-Z])/g, ' $1')}</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => handleRatingChange(metric, star)}
                      className={`px-2 py-1 rounded-md text-xs font-bold transition-colors ${
                        ratings[metric] >= star
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}
                    >
                      {star}★
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Anonymous Comments / Constructive Feedback</label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What teaching style or practice materials worked best? What could be improved?"
              className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setFeedbackModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Submit Feedback</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
