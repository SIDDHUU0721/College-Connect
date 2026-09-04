import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import { GraduationCap, Lock, Mail, User, ShieldCheck, Key, AlertTriangle } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // 'student' or 'teacher'
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [year, setYear] = useState('3rd Year');
  const [rollNo, setRollNo] = useState('');
  const [facultyId, setFacultyId] = useState('');
  const [facultyInviteCode, setFacultyInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await register({
        name,
        email,
        password,
        role,
        department,
        year: role === 'student' ? year : undefined,
        rollNo: role === 'student' ? rollNo : undefined,
        facultyId: role === 'teacher' ? facultyId : undefined,
        facultyInviteCode: role === 'teacher' ? facultyInviteCode : undefined
      });

      if (user.role === 'teacher') navigate('/teacher-dashboard');
      else navigate('/student-dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-xl shadow-indigo-500/30 mx-auto">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Create an Account</h1>
          <p className="text-xs text-slate-400">Join the CollegeConnect Academic Ecosystem</p>
        </div>

        <form onSubmit={handleRegister} className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Role Selector Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Account Role</label>
            <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
              <button
                type="button"
                onClick={() => {
                  setRole('student');
                  setError('');
                }}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  role === 'student'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🎓 Student Account
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole('teacher');
                  setError('');
                }}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  role === 'teacher'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🛡️ Teacher / Faculty
              </button>
            </div>
          </div>

          {/* Teacher Security Notice */}
          {role === 'teacher' && (
            <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/40 text-xs text-purple-200 space-y-1">
              <span className="font-bold text-purple-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-400" /> Faculty Verification Gatekeeper
              </span>
              <p className="text-[11px] text-slate-300">
                To prevent student impersonation, Teacher registration requires an institutional faculty email and a department invite passcode (e.g. <strong className="text-white font-mono">FAC-CSE-2026-X98</strong>).
              </p>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Full Legal Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === 'teacher' ? 'e.g. Dr. Priya Sharma' : 'e.g. Alex Chen'}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              {role === 'teacher' ? 'Official Faculty Email' : 'Student Institutional Email'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'teacher' ? 'name@faculty.college.edu' : 'student_id@student.college.edu'}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Teacher-Specific Protected Fields */}
          {role === 'teacher' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-800/40 border border-purple-500/20">
              <div>
                <label className="block text-[11px] font-bold text-purple-300 uppercase tracking-wider mb-1">Department Passcode / Token</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-purple-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={facultyInviteCode}
                    onChange={(e) => setFacultyInviteCode(e.target.value)}
                    placeholder="FAC-CSE-2026-X98"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-purple-500/40 text-xs font-mono text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">Faculty Employee ID</label>
                <input
                  type="text"
                  required
                  value={facultyId}
                  onChange={(e) => setFacultyId(e.target.value)}
                  placeholder="FAC-CSE-042"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-white focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Student Fields */}
          {role === 'student' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Year of Study</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Roll / Reg Number</label>
                <input
                  type="text"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  placeholder="22CS104"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-white focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant={role === 'teacher' ? 'ai' : 'primary'}
            loading={loading}
            size="lg"
            className="w-full"
          >
            Create {role === 'teacher' ? 'Verified Faculty Profile' : 'Student Account'}
          </Button>

          <p className="text-center text-xs text-slate-400 pt-2">
            Already registered?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-bold">
              Sign In
            </Link>
          </p>
        </form>

      </div>
    </div>
  );
}
