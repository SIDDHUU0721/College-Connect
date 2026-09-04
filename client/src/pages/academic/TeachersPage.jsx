import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/common/Button';
import { Users, BookOpen, Star, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadTeachers() {
      try {
        const res = await api.get('/academic/teachers');
        if (res.success) setTeachers(res.teachers || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadTeachers();
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-bold mb-2">
          <Users className="w-3.5 h-3.5" /> Teacher → Subject → Content Navigation
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Faculty Directory & Portals
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Explore individual teacher dashboards, verified research backgrounds, and the specific subjects and notes they manage.
        </p>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teachers.map((teacher) => (
          <div
            key={teacher.id}
            onClick={() => navigate(`/teachers/${teacher.id}`)}
            className="p-6 rounded-3xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-purple-500/40 transition-all duration-300 shadow-xl cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                {teacher.avatar ? (
                  <img
                    src={teacher.avatar}
                    alt={teacher.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-500/30 group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center font-bold text-white text-lg border-2 border-purple-500/30 group-hover:scale-105 transition-transform shadow-lg">
                    {teacher.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                      {teacher.name}
                    </h2>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-xs text-slate-300 font-medium">{teacher.designation}</p>
                  <p className="text-[11px] text-slate-400">{teacher.department}</p>
                  <span className="inline-block mt-1 text-[10px] text-slate-400 font-mono">
                    ID: {teacher.facultyId}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                {teacher.bio}
              </p>

              {/* Taught Subjects */}
              <div className="pt-3 border-t border-slate-800">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Assigned Courses:</p>
                <div className="flex flex-wrap gap-1.5">
                  {teacher.subjects?.map((s) => (
                    <span
                      key={s.id}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs text-slate-200 border border-slate-700"
                    >
                      {s.name} ({s.code})
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>{teacher.materialsCount || 2} Uploaded Materials</span>
              <span className="text-purple-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                View Teacher Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
