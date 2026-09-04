import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import AuditDiffModal from '../../components/common/AuditDiffModal';
import {
  ShieldAlert,
  Users,
  BookOpen,
  Key,
  Copy,
  Check,
  History,
  AlertCircle,
  BarChart3,
  TrendingUp,
  Award,
  Layers,
  Sparkles
} from 'lucide-react';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [inviteCodes, setInviteCodes] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [copiedCode, setCopiedCode] = useState('');
  const [selectedDept, setSelectedDept] = useState('Computer Science & Engineering');
  const [loading, setLoading] = useState(true);

  const loadAdminData = async () => {
    try {
      const [stRes, uRes, invRes, audRes, repRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/invite-codes'),
        api.get('/audit/logs'),
        api.get('/student-voice/reports')
      ]);

      if (stRes.success) setStats(stRes.stats);
      if (uRes.success) setUsers(uRes.users || []);
      if (invRes.success) setInviteCodes(invRes.inviteCodes || []);
      if (audRes.success) setAuditLogs(audRes.logs || []);
      if (repRes.success) setReports(repRes.reports || []);
    } catch (err) {
      console.error('Admin load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleGenerateInviteCode = async () => {
    try {
      const res = await api.post('/admin/invite-codes', { department: selectedDept });
      if (res.success) {
        setInviteCodes(prev => [res.inviteCode, ...prev]);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const handleResolveReport = async (id) => {
    try {
      await api.put(`/student-voice/reports/${id}/status`, {
        status: 'Resolved',
        adminNote: 'Resolved by Dean of Academic Affairs.'
      });
      loadAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Admin Hero Header */}
      <div className="rounded-3xl bg-gradient-to-r from-red-950/50 via-slate-900 to-indigo-950/50 border border-red-500/30 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-bold">
            <ShieldAlert className="w-3.5 h-3.5" /> High-Level Administration Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Institutional Oversight & Control
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Manage teacher invite security tokens, inspect immutable audit diffs, moderate community knowledge posts, and resolve campus academic reports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="primary" icon={Key} onClick={handleGenerateInviteCode}>
            Generate Faculty Passcode
          </Button>
        </div>
      </div>

      {/* Platform Key Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Verified Faculty</p>
              <h4 className="text-lg font-black text-white">{stats.totalTeachers} Teachers</h4>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Study Materials & Notes</p>
              <h4 className="text-lg font-black text-white">{stats.totalMaterials} Files</h4>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Pending Student Reports</p>
              <h4 className="text-lg font-black text-white">{stats.pendingReports} Active</h4>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm flex items-center gap-3">
            <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <History className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Audit Trail Events</p>
              <h4 className="text-lg font-black text-white">{stats.totalAuditEvents} Logged</h4>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Teacher Passcode Generator & Live Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 5 Cols: Faculty Invite Security Generator */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white">Faculty Registration Passcodes</h2>
            </div>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Anti-Impersonation
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              These cryptographic tokens prevent unauthorized students from self-registering as Faculty. Provide these codes directly to new professors.
            </p>

            <div className="flex gap-2">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none"
              >
                <option value="Computer Science & Engineering">Computer Science (CSE)</option>
                <option value="Artificial Intelligence & Data Science">AI & Data Science (AI-DS)</option>
                <option value="Electronics & Communication">Electronics (ECE)</option>
                <option value="Information Technology">Information Tech (IT)</option>
              </select>
              <Button size="sm" variant="primary" onClick={handleGenerateInviteCode}>
                Generate
              </Button>
            </div>

            {/* List of active invite tokens */}
            <div className="space-y-2 pt-2 divide-y divide-slate-800">
              {inviteCodes.map((inv, idx) => (
                <div key={idx} className="pt-2 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-indigo-300">{inv.code}</span>
                    <p className="text-[10px] text-slate-400">{inv.department}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(inv.code)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
                    title="Copy token"
                  >
                    {copiedCode === inv.code ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedCode === inv.code ? 'Copied' : 'Copy'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Student Voice Queue */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" /> Student Reports Requiring Admin Review
            </h3>
            <div className="space-y-3">
              {reports.filter(r => r.status !== 'Resolved').slice(0, 3).map((rep) => (
                <div key={rep.id} className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2 text-xs">
                  <div className="flex justify-between font-bold text-slate-100">
                    <span>{rep.title}</span>
                    <span className="text-amber-400">{rep.status}</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">{rep.description}</p>
                  <div className="flex justify-between items-center pt-1 border-t border-slate-700/40">
                    <span className="text-slate-400 text-[10px]">Student: {rep.studentName}</span>
                    <Button size="sm" variant="success" onClick={() => handleResolveReport(rep.id)}>
                      Mark Resolved
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Real-Time Audit Log & Change Diff Inspector */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-rose-400" />
              <h2 className="text-lg font-bold text-white">Immutable Academic Change History</h2>
            </div>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Audit Logs
            </span>
          </div>

          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 transition-all space-y-2.5 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
                      {log.action}
                    </span>
                    <span className="text-xs font-bold text-white">{log.userName}</span>
                    <span className="text-[10px] text-slate-400">({log.userRole})</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {log.timestamp ? format(new Date(log.timestamp), 'MMM d • h:mm a') : 'Recent'}
                  </span>
                </div>

                <p className="text-xs text-slate-200">{log.changeSummary}</p>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                  <span className="text-[11px] text-slate-400">Entity: {log.entityTitle} ({log.subjectName})</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedLog(log)}
                    className="text-xs text-indigo-400 hover:text-indigo-300"
                  >
                    Inspect Diff
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Visual Audit Diff Modal */}
      <AuditDiffModal
        isOpen={Boolean(selectedLog)}
        onClose={() => setSelectedLog(null)}
        log={selectedLog}
      />

    </div>
  );
}
