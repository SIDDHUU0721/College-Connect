import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Sparkles, BookOpen, Calendar, Award, FileText, ArrowRight } from 'lucide-react';
import api from '../../services/api';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get(`/nlp/smart-search?q=${encodeURIComponent(query)}`);
        if (res.success) setResults(res.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (link) => {
    onClose();
    navigate(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      <div className="fixed inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-[#0F172A] border border-indigo-500/30 rounded-2xl shadow-2xl shadow-indigo-500/10 overflow-hidden z-10 flex flex-col max-h-[80vh]">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-900/60">
          <Search className="w-5 h-5 text-indigo-400 mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes, PYQs, exams, announcements, hackathons..."
            className="w-full bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-white mr-2">
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">ESC</span>
        </div>

        {/* Results List */}
        <div className="p-2 overflow-y-auto divide-y divide-slate-800/60 max-h-96">
          {loading && (
            <div className="py-8 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin text-indigo-400" />
              Scanning academic repository...
            </div>
          )}

          {!loading && results.length === 0 && query && (
            <div className="py-8 text-center text-slate-400 text-sm">
              No direct matches found for "{query}". Try searching by subject, unit, or topic.
            </div>
          )}

          {!loading && results.length === 0 && !query && (
            <div className="p-4 text-xs text-slate-400 space-y-2">
              <p className="font-semibold text-slate-300">Quick Searches:</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {['NLP Unit 2', 'DBMS Assignment', 'Midterm Exam', 'Hackathon 2025', 'Dr. Priya Notes'].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => setQuery(chip)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-indigo-500/20 hover:text-indigo-300 border border-slate-700/60 text-slate-300 transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(item.link)}
              className="p-3 hover:bg-indigo-600/10 hover:border-l-4 hover:border-indigo-500 rounded-lg cursor-pointer flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-800 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                  {item.type === 'Material' && <BookOpen className="w-4 h-4" />}
                  {item.type === 'Exam' && <Calendar className="w-4 h-4" />}
                  {item.type === 'Assignment' && <FileText className="w-4 h-4" />}
                  {item.type === 'Experience' && <Award className="w-4 h-4" />}
                  {item.type === 'Announcement' && <Sparkles className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-100 group-hover:text-white">{item.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{item.subtitle}</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
