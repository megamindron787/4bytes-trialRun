import React, { useState } from 'react';
import StudentLogin from './StudentLogin';
import StudentRegister from './StudentRegister';
import AdminLogin from './AdminLogin';
import AdminRegister from './AdminRegister';
import {
  Wrench,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Building2,
  Sparkles,
  GraduationCap,
  SlidersHorizontal,
  Clock,
  KeyRound,
  Database
} from 'lucide-react';
import { isSupabaseConfigured } from '../../services/supabaseClient';

/**
 * AuthContainer Component with Dual-Role Selection (Student & Admin)
 * 
 * @param {Object} props
 * @param {'login' | 'register'} [props.initialView='login'] - Default active form mode
 * @param {'student' | 'admin'} [props.initialRole='student'] - Default selected role
 * @param {Function} [props.onAuthSuccess] - Callback when authentication completes
 * @param {string} [props.collegeDomain='pvpit.edu'] - Default college domain
 */
export default function AuthContainer({
  initialView = 'login',
  initialRole = 'student',
  onAuthSuccess,
  collegeDomain = 'pvpit.edu'
}) {
  const [role, setRole] = useState(initialRole);
  const [activeView, setActiveView] = useState(initialView);
  const [prefillEmail, setPrefillEmail] = useState('');

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setPrefillEmail('');
  };

  const switchToRegister = () => {
    setActiveView('register');
  };

  const switchToLogin = (emailToPrefill = '') => {
    if (typeof emailToPrefill === 'string') {
      setPrefillEmail(emailToPrefill);
    }
    setActiveView('login');
  };

  const handleAuthComplete = (userData) => {
    if (onAuthSuccess) {
      onAuthSuccess(userData);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none opacity-80"></div>

      <div className="w-full max-w-5xl z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Branding / Context Column (Dynamically updates per Role) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between space-y-7 pr-4">
          <div>
            {/* Dynamic Campus Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-6 shadow-xs transition-all">
              {role === 'student' ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>CampusFix • PVPIT Student Portal</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>CampusFix • Authority Console</span>
                </>
              )}
            </div>

            {/* Brand Logo & Name */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 text-white">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                  Campus<span className="text-indigo-600">Fix</span>
                </h1>
                <p className="text-xs text-indigo-700 font-bold tracking-wider uppercase">
                  {role === 'student' ? 'Issue Reporting & Resolution Engine' : 'Campus Triage & Escalation System'}
                </p>
              </div>
            </div>

            {/* Dynamic Paragraph Description */}
            <p className="text-slate-700 text-sm leading-relaxed mt-4 font-normal">
              {role === 'student'
                ? 'A transparent, single-window system for hostel rooms, labs, Wi-Fi, electricity, and sanitation complaints. Track updates directly from maintenance authorities.'
                : 'Centralized administrator dashboard for verifying campus complaints, prioritizing urgencies, assigning maintenance crews, and supervising resolution SLAs.'}
            </p>
          </div>

          {/* Dynamic Value Highlights Cards */}
          <div className="space-y-3.5">
            {role === 'student' ? (
              <>
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-indigo-300 transition-all">
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 shrink-0 mt-0.5">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Fast Ticket Resolution</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-normal">
                      Direct routing to Plumbing, Electrical, and Campus IT departments.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-indigo-300 transition-all">
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Verified Student Body</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-normal">
                      Authenticated through official college roll numbers and <span className="font-mono text-indigo-700 font-semibold bg-indigo-50 px-1 py-0.5 rounded">@{collegeDomain}</span>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-indigo-300 transition-all">
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 shrink-0 mt-0.5">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Hostel & Academic Coverage</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-normal">
                      Track classroom utilities, hostel water, internet, and cleanliness in real time.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-indigo-300 transition-all">
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 shrink-0 mt-0.5">
                    <SlidersHorizontal className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Department Work Orders</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-normal">
                      Assign tasks instantly to plumbers, electricians, network engineers, and sanitizers.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-indigo-300 transition-all">
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">SLA & Turnaround Monitoring</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-normal">
                      Keep hostel and campus facilities operating with real-time audit timelines.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-indigo-300 transition-all">
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 shrink-0 mt-0.5">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Multi-Department Roster</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-normal">
                      Authorized staff roles across Estate, Hostel Wardens, and IT Infrastructure.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Social Proof / Footer Stat */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-slate-800 font-bold">98.4% Response Rate</span>
            </div>
            <span className="text-slate-500 font-mono font-semibold">
              {role === 'student' ? 'Student Portal' : 'Admin Authority'}
            </span>
          </div>
        </div>

        {/* Right Authentication Card Area */}
        <div className="lg:col-span-7 flex flex-col items-center">
          {/* 1. Dual-Role Segmented Selector (Above Card) */}
          <div className="w-full max-w-md mb-3.5">
            <div className="p-1 bg-white/95 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleRoleChange('student')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  role === 'student'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 ring-1 ring-indigo-600'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <GraduationCap className="w-4 h-4 shrink-0" />
                <span>Student</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  role === 'admin'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 ring-1 ring-indigo-600'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Admin / Staff</span>
              </button>
            </div>
          </div>

          {/* 2. Main Authentication Card */}
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/80 border border-slate-200/90 p-6 sm:p-8 relative">
            {/* Mobile Branding Bar */}
            <div className="lg:hidden flex items-center justify-between pb-5 mb-5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-extrabold text-slate-900 text-lg">
                    Campus<span className="text-indigo-600">Fix</span>
                  </span>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    {role === 'student' ? 'Student Portal' : 'Admin Console'}
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                {role === 'student' ? `@${collegeDomain}` : 'Staff Portal'}
              </span>
            </div>

            {/* 3. Authentication Modes Tabs: Sign In vs Create Account */}
            <div className="grid grid-cols-2 p-1 mb-6 bg-slate-100 rounded-2xl border border-slate-200/80">
              <button
                type="button"
                onClick={() => setActiveView('login')}
                className={`py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                  activeView === 'login'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setActiveView('register')}
                className={`py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                  activeView === 'register'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* 4. Dynamic Form Rendering based on Role & Auth Mode */}
            {role === 'student' ? (
              activeView === 'login' ? (
                <StudentLogin
                  onSuccess={handleAuthComplete}
                  onSwitchToRegister={switchToRegister}
                  defaultCollegeDomain={collegeDomain}
                  prefillEmail={prefillEmail}
                />
              ) : (
                <StudentRegister
                  onSuccess={handleAuthComplete}
                  onSwitchToLogin={switchToLogin}
                  defaultCollegeDomain={collegeDomain}
                />
              )
            ) : (
              activeView === 'login' ? (
                <AdminLogin
                  onSuccess={handleAuthComplete}
                  onSwitchToRegister={switchToRegister}
                  defaultCollegeDomain={collegeDomain}
                />
              ) : (
                <AdminRegister
                  onSuccess={handleAuthComplete}
                  onSwitchToLogin={switchToLogin}
                  defaultCollegeDomain={collegeDomain}
                />
              )
            )}
          </div>

          {/* Supabase Database Connection Badge */}
          <div className="mt-4 flex items-center justify-center">
            {isSupabaseConfigured ? (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <Database className="w-3.5 h-3.5" />
                <span>Supabase PostgreSQL Database Connected</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-medium">
                <Database className="w-3.5 h-3.5 text-indigo-500" />
                <span>Supabase Database Auth • Connect credentials in frontend/.env</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
