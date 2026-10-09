import React, { useState, useMemo } from 'react';
import { registerAdmin } from '../../services/authService';
import {
  User,
  ShieldCheck,
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Key,
  Hash,
  ShieldAlert
} from 'lucide-react';

/**
 * AdminRegister Component
 * 
 * @param {Object} props
 * @param {Function} props.onSuccess - Callback on successful admin registration
 * @param {Function} props.onSwitchToLogin - Callback to switch to Admin Login
 * @param {string} [props.defaultCollegeDomain='pvpit.edu']
 */
export default function AdminRegister({
  onSuccess,
  onSwitchToLogin,
  defaultCollegeDomain = 'pvpit.edu'
}) {
  const [formData, setFormData] = useState({
    fullName: '',
    employeeId: '',
    department: 'Hostel Administration',
    designation: 'Hostel Warden / Block In-Charge',
    email: '',
    securityCode: '',
    password: '',
    confirmPassword: '',
    agreeToEthics: true,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successNotice, setSuccessNotice] = useState(false);

  // Live password strength calculation
  const passwordStrength = useMemo(() => {
    const pwd = formData.password;
    if (!pwd) return { score: 0, label: '', color: 'bg-slate-200' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { label: 'Weak', color: 'bg-rose-500', width: 'w-1/3' };
    if (score <= 3) return { label: 'Fair', color: 'bg-amber-500', width: 'w-2/3' };
    return { label: 'Strong', color: 'bg-emerald-500', width: 'w-full' };
  }, [formData.password]);

  const validate = (data = formData) => {
    const errs = {};

    if (!data.fullName.trim()) {
      errs.fullName = 'Staff member name is required';
    } else if (data.fullName.trim().length < 3) {
      errs.fullName = 'Name must be at least 3 characters';
    }

    if (!data.employeeId.trim()) {
      errs.employeeId = 'Staff / Employee ID is required';
    }

    if (!data.email.trim()) {
      errs.email = 'Official admin email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email.trim())) {
        errs.email = 'Enter a valid official email address';
      }
    }

    const validKey = import.meta.env.VITE_ADMIN_SECURITY_CODE;
    if (!data.securityCode.trim()) {
      errs.securityCode = 'Admin authorization key is required';
    } else if (validKey && data.securityCode.trim() !== validKey) {
      errs.securityCode = 'Invalid authorization key. Contact campus administration.';
    }

    if (!data.password) {
      errs.password = 'Password is required';
    } else if (data.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    if (!data.confirmPassword) {
      errs.confirmPassword = 'Confirm your password';
    } else if (data.password !== data.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    if (!data.agreeToEthics) {
      errs.agreeToEthics = 'You must accept campus administrator responsibilities';
    }

    return errs;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newVal = type === 'checkbox' ? checked : value;
    const updated = { ...formData, [name]: newVal };
    setFormData(updated);

    if (touched[name]) {
      const fieldErrors = validate(updated);
      setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] || '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldErrors = validate(formData);
    setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] || '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      fullName: true,
      employeeId: true,
      email: true,
      securityCode: true,
      password: true,
      confirmPassword: true,
      agreeToEthics: true,
    });

    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      const result = await registerAdmin({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        employeeId: formData.employeeId,
        department: formData.department,
        designation: formData.designation,
        securityCode: formData.securityCode,
      });

      setSuccessNotice(true);
      setTimeout(() => {
        if (onSuccess) onSuccess(result.user);
      }, 700);
    } catch (err) {
      setServerError(err.message || 'Failed to register admin account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 mb-3 rounded-2xl bg-indigo-50 text-indigo-700 shadow-sm ring-8 ring-indigo-50/50">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Admin / Staff Registration</h2>
        <p className="mt-1 text-sm text-slate-500">Register campus authorities & maintenance management profile</p>
      </div>

      {successNotice && (
        <div className="mb-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="font-bold">Admin account created! Redirecting to Console...</p>
        </div>
      )}

      {serverError && (
        <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-sm text-red-700">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p>{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
        {/* Full Name */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block mb-1.5">
            Full Name & Title <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. Prof. Suresh Patil"
              className={`w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${
                errors.fullName ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
          </div>
          {errors.fullName && <p className="mt-1 text-xs text-red-600 font-medium">{errors.fullName}</p>}
        </div>

        {/* Employee ID & Department */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block mb-1.5">
              Employee ID <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Hash className="w-4 h-4" />
              </div>
              <input
                name="employeeId"
                type="text"
                value={formData.employeeId}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. ADM-204"
                className={`w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border bg-white uppercase focus:outline-none focus:ring-2 ${
                  errors.employeeId ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                }`}
              />
            </div>
            {errors.employeeId && <p className="mt-1 text-xs text-red-600 font-medium">{errors.employeeId}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block mb-1.5">
              Department <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Building2 className="w-4 h-4" />
              </div>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full pl-10 pr-8 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
              >
                <option value="Hostel Administration">Hostel Administration</option>
                <option value="Estate & Maintenance">Estate & Maintenance</option>
                <option value="Electrical & Power">Electrical & Power</option>
                <option value="Plumbing & Water Supply">Plumbing & Water Supply</option>
                <option value="IT Infrastructure">IT Infrastructure</option>
                <option value="Campus Hygiene & Housekeeping">Campus Hygiene</option>
              </select>
            </div>
          </div>
        </div>

        {/* Official Email */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block mb-1.5">
            Official Email Address <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={`official.name@${defaultCollegeDomain}`}
              className={`w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 ${
                errors.email ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-red-600 font-medium">{errors.email}</p>}
        </div>

        {/* Security Passcode / Admin Authorization Key */}
        <div>
          <div className="mb-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Admin Authorization Key <span className="text-rose-500">*</span>
            </label>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Key className="w-4 h-4" />
            </div>
            <input
              name="securityCode"
              type="text"
              value={formData.securityCode}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter campus authorization key"
              className={`w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border bg-white font-mono uppercase focus:outline-none focus:ring-2 ${
                errors.securityCode ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
          </div>
          {errors.securityCode && <p className="mt-1 text-xs text-red-600 font-medium">{errors.securityCode}</p>}
        </div>

        {/* Password & Confirm Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block mb-1.5">
              Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Min 6 chars"
                className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 ${
                  errors.password ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-600 font-medium">{errors.password}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 block mb-1.5">
              Confirm Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Repeat password"
                className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 ${
                  errors.confirmPassword ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-600 font-medium">{errors.confirmPassword}</p>}
          </div>
        </div>

        {/* Strength Meter */}
        {formData.password && (
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
            <div className="flex justify-between mb-1 text-slate-500 font-medium">
              <span>Security</span>
              <span className="font-semibold text-slate-700">{passwordStrength.label}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className={`h-full ${passwordStrength.color} ${passwordStrength.width} transition-all duration-300 rounded-full`} />
            </div>
          </div>
        )}

        <label className="flex items-start gap-2.5 cursor-pointer pt-1">
          <input
            type="checkbox"
            name="agreeToEthics"
            checked={formData.agreeToEthics}
            onChange={handleChange}
            className="mt-0.5 w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
          />
          <span className="text-xs text-slate-600 leading-snug">
            I confirm I am an authorized staff/administrator and will handle campus grievance data in accordance with college privacy rules.
          </span>
        </label>
        {errors.agreeToEthics && <p className="text-xs text-red-600 font-medium">{errors.agreeToEthics}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-3 py-3 px-4 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-65 shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer group"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Registering Authority Profile...</span>
            </>
          ) : (
            <>
              <span>Complete Admin Registration</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-5 pt-4 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-500">
          Already have an Admin account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-semibold text-indigo-600 hover:text-indigo-700 underline ml-1 cursor-pointer"
          >
            Sign In here
          </button>
        </p>
      </div>
    </div>
  );
}
