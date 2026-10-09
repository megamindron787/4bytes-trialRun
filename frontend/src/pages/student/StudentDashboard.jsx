import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Wrench,
  GraduationCap,
  LogOut,
  PlusCircle,
  Clock,
  CheckCircle,
  Building,
  Hash,
  Mail,
  ShieldCheck,
  ChevronRight,
  Inbox
} from 'lucide-react';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Real issues list (empty until issues are created in database)
  const [issues] = useState([]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Dynamic statistics calculated from live issues
  const activeCount = issues.filter((i) => i.status !== 'Resolved' && i.status !== 'Rejected').length;
  const inProgressCount = issues.filter((i) => i.status === 'In Progress').length;
  const resolvedCount = issues.filter((i) => i.status === 'Resolved').length;

  const stats = [
    { label: 'Active Complaints', count: activeCount, icon: Clock, color: 'text-amber-700 bg-amber-50 border-amber-200' },
    { label: 'In Progress', count: inProgressCount, icon: Wrench, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
    { label: 'Resolved Issues', count: resolvedCount, icon: CheckCircle, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Campus<span className="text-indigo-600">Fix</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Student Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-bold text-slate-900">{user?.fullName || 'Student'}</span>
              <span className="text-xs text-slate-600 font-medium">
                Roll: {user?.rollNo || 'N/A'}{user?.yearOfStudy ? ` • ${user.yearOfStudy}` : ''}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 rounded-xl border border-slate-200 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/40 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Student Session</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Welcome back, <span className="text-indigo-600">{user?.fullName || 'Student'}</span>! 👋
              </h1>
              <p className="text-slate-600 text-sm max-w-xl font-normal leading-relaxed">
                Track your active campus reports, submit hostel utilities tickets, and follow real-time progress by maintenance staff.
              </p>
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-md shadow-indigo-600/25 hover:bg-indigo-700 transition-all cursor-pointer shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report New Issue</span>
            </button>
          </div>

          {/* Student Profile Metadata Pills */}
          <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
              <Hash className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Roll: <strong className="text-slate-900 font-bold">{user?.rollNo || 'N/A'}</strong></span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
              <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Year: <strong className="text-slate-900 font-bold">{user?.yearOfStudy || 'N/A'}</strong></span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
              <Building className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="truncate">Dept: <strong className="text-slate-900 font-bold">{user?.department || 'N/A'}</strong></span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
              <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="truncate">Email: <strong className="text-slate-900 font-bold">{user?.email || 'N/A'}</strong></span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{s.label}</p>
                  <p className="text-3xl font-extrabold text-slate-900 mt-1">{s.count}</p>
                </div>
                <div className={`p-3 rounded-xl border ${s.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Student Complaints */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Your Recent Issue Reports</h2>
              <p className="text-xs text-slate-500 mt-0.5">Complaints logged from your student account</p>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
              Live Tracker
            </span>
          </div>

          {issues.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-3.5 shadow-xs">
                <Inbox className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No issues reported yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1 mb-5">
                Have an issue with water, electricity, Wi-Fi, classroom equipment, or sanitation? Submit your first report to get it resolved.
              </p>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Report an Issue</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {issues.map((issue) => (
                <div key={issue.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {issue.id}
                      </span>
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-full border ${issue.statusColor}`}>
                        {issue.status}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">• {issue.date}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{issue.title}</h3>
                    <p className="text-xs text-slate-600 flex items-center gap-2 font-medium">
                      <span>📍 {issue.location}</span>
                      <span>• 🏷️ {issue.category}</span>
                    </p>
                  </div>

                  <button
                    type="button"
                    className="self-start sm:self-center text-xs font-bold text-indigo-700 hover:text-white bg-indigo-50 hover:bg-indigo-600 border border-indigo-200 px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
