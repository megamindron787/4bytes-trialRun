import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck,
  Wrench,
  LogOut,
  AlertCircle,
  Clock,
  CheckCircle,
  Filter,
  UserCheck,
  Building2,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminStats = [
    { label: 'Pending Review', count: 8, icon: Clock, color: 'text-amber-700 bg-amber-50 border-amber-200' },
    { label: 'Assigned to Teams', count: 14, icon: Wrench, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
    { label: 'Resolved (This Month)', count: 42, icon: CheckCircle, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    { label: 'Avg Resolution Time', count: '4.2h', icon: TrendingUp, color: 'text-blue-700 bg-blue-50 border-blue-200' },
  ];

  const triageQueue = [
    {
      id: 'ISS-1042',
      title: 'Hostel B - 3rd Floor Water Dispenser Low Pressure',
      reportedBy: 'Siddhesh Deshmukh (21CS088)',
      category: 'Water & Plumbing',
      assignedTo: 'Plumbing Unit #2',
      priority: 'High',
      priorityColor: 'bg-rose-50 text-rose-700 border-rose-200',
      status: 'In Progress',
      time: '12m ago',
    },
    {
      id: 'ISS-1041',
      title: 'Room 204 Ceiling Fan Regulator Sparking',
      reportedBy: 'Aarav Sharma (22EE014)',
      category: 'Electrical & Power',
      assignedTo: 'Unassigned',
      priority: 'Urgent',
      priorityColor: 'bg-red-100 text-red-800 border-red-300',
      status: 'Under Review',
      time: '34m ago',
    },
    {
      id: 'ISS-1040',
      title: 'Lab 4 Wi-Fi Access Point Dropping Connections',
      reportedBy: 'Neha Patil (20IT051)',
      category: 'IT Infrastructure',
      assignedTo: 'Network Ops',
      priority: 'Medium',
      priorityColor: 'bg-amber-50 text-amber-700 border-amber-200',
      status: 'Assigned',
      time: '1h ago',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top Admin Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Campus<span className="text-indigo-600">Fix</span>
              </span>
              <span className="ml-2 text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Admin Console
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-bold text-slate-900">{user?.fullName || 'Campus Administrator'}</span>
              <span className="text-xs text-slate-600 font-medium">{user?.department || 'Administration'} • ID: {user?.employeeId || 'ADM-01'}</span>
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
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold shadow-xs">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Authorized Campus Maintenance Authority</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Welcome, {user?.fullName || 'Administrator'}! 🛠️
              </h1>
              <p className="text-slate-600 text-sm max-w-xl font-normal leading-relaxed">
                Triage incoming student complaints, assign tickets to maintenance crews, and monitor resolution turnaround times.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 hover:bg-slate-200 transition-all cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
                <span>Export Report</span>
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-600/25 hover:bg-indigo-700 transition-all cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Manage Dispatch</span>
              </button>
            </div>
          </div>
        </div>

        {/* Admin Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {adminStats.map((s, idx) => {
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

        {/* Triage Queue Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Live Campus Triage Queue</h2>
              <p className="text-xs text-slate-500 mt-0.5">Issues awaiting assignment and status escalation</p>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
              Real-time Feed
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {triageQueue.map((item) => (
              <div key={item.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {item.id}
                    </span>
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-bold ${item.priorityColor}`}>
                      {item.priority} Priority
                    </span>
                    <span className="text-xs text-slate-500 font-medium">• {item.time}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-600 flex flex-wrap items-center gap-2 font-medium">
                    <span>👤 {item.reportedBy}</span>
                    <span>• 🏷️ {item.category}</span>
                    <span>• 🛠️ Assigned: <strong className="text-slate-800">{item.assignedTo}</strong></span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="text-xs font-bold text-indigo-700 hover:text-white bg-indigo-50 hover:bg-indigo-600 border border-indigo-200 px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-xs"
                  >
                    Assign Team
                  </button>
                  <button
                    type="button"
                    className="text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    Update Status
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
