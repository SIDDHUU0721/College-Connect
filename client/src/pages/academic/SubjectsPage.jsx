import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/common/Button';
import { BookOpen, Users, FileText, ArrowRight, Sparkles, Brain, Database, Cpu, Network } from 'lucide-react';

const ICON_MAP = {
  Brain,
  Database,
  Cpu,
  Network
};

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadSubjects() {
      try {
        const res = await api.get('/academic/subjects');
        if (res.success) setSubjects(res.subjects || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSubjects();
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-bold mb-2">
            <BookOpen className="w-3.5 h-3.5" /> Subject → Teacher → Content Navigation
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Academic Courses & Subjects
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse through your enrolled curriculum. Select a course to see the assigned faculty, lecture notes, and solved PYQ question papers.
          </p>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map((sub) => {
          const IconComp = ICON_MAP[sub.icon] || BookOpen;
          return (
            <div
              key={sub.id}
              onClick={() => navigate(`/subjects/${sub.id}`)}
              className="p-6 rounded-3xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 shadow-xl cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-slate-800 text-indigo-300 border border-slate-700">
                      {sub.code}
                    </span>
                    <span className="text-xs text-slate-400">{sub.credits} Credits</span>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {sub.name}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {sub.description}
                  </p>
                </div>

                {/* Faculty Assigned */}
                <div className="pt-3 border-t border-slate-800/80">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Assigned Faculty:</p>
                  <div className="flex flex-wrap gap-2">
                    {sub.teachers?.map((t) => (
                      <span
                        key={t.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800/80 text-xs text-slate-200 border border-slate-700 font-medium"
                      >
                        <Users className="w-3.5 h-3.5 text-indigo-400" />
                        {t.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats Footer */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>{sub.materialsCount || 3} Study Materials & PYQs</span>
                <span className="text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Explore Course <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
