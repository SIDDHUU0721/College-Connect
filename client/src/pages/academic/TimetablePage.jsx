import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Clock, Calendar, AlertCircle, MapPin, CheckCircle2 } from 'lucide-react';

export default function TimetablePage() {
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTimetables() {
      try {
        const res = await api.get('/academic/timetables');
        if (res.success) setTimetables(res.timetables || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadTimetables();
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-bold mb-2">
          <Clock className="w-3.5 h-3.5" /> Department Schedule & Room Slots
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Weekly Academic Timetable
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Real-time slot assignments, laboratory venues, and authorized classroom rescheduling notices.
        </p>
      </div>

      {/* Timetable Cards */}
      <div className="space-y-4">
        {timetables.map((slot) => (
          <div
            key={slot.id}
            className={`p-6 rounded-3xl border transition-all duration-300 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              slot.status === 'Rescheduled'
                ? 'bg-amber-950/20 border-amber-500/40'
                : 'bg-slate-900/80 border-slate-800'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 text-xs font-mono font-bold rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {slot.day} • {slot.timeSlot}
                </span>
                {slot.status === 'Rescheduled' ? (
                  <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Rescheduled
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Active Regular
                  </span>
                )}
              </div>

              <h2 className="text-lg font-bold text-white">{slot.subjectName}</h2>
              <p className="text-xs text-slate-300">Faculty: <strong className="text-white">{slot.teacherName}</strong></p>
            </div>

            <div className="space-y-1.5 md:text-right text-xs">
              <div className="flex md:justify-end items-center gap-1.5 text-slate-300 font-semibold">
                <MapPin className="w-4 h-4 text-indigo-400" />
                <span>Venue: {slot.room}</span>
              </div>
              <p className="text-slate-400 italic text-[11px]">{slot.note}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
