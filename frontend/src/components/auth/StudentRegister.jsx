import React, { useState, useMemo } from 'react';
import {
  User,
  Hash,
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Building,
  Info
} from 'lucide-react';

/**
 * StudentRegister Component
 * 
 * @param {Object} props
 * @param {Function} props.onSuccess - Callback invoked on successful registration with new user data
 * @param {Function} props.onSwitchToLogin - Callback to switch view to Login
 * @param {string} [props.defaultCollegeDomain='pvpit.edu'] - College domain for validation
 */
export default function StudentRegister({
  onSuccess,
  onSwitchToLogin,
  defaultCollegeDomain = 'pvpit.edu'
}) {
  const [formData, setFormData] = useState({
    fullName: '',
    rollNo: '',
    yearOfStudy: '',
    department: 'Computer Engineering', // Helpful default campus department
    email: '',
    password: '',
    confirmPassword: '',
    agreeToCode: true,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [successNotice, setSuccessNotice] = useState(false);

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    const pwd = formData.password;
    if (!pwd) return { score: 0, label: '', color: 'bg-slate-200' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500', width: 'w-1/3' };
    if (score <= 3) return { score: 2, label: 'Fair', color: 'bg-amber-500', width: 'w-2/3' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500', width: 'w-full' };
  }, [formData.password]);

  // Validation logic
  const validate = (data = formData) => {
    const errs = {};

    // Full Name
    if (!data.fullName.trim()) {
      errs.fullName = 'Full name is required';
    } else if (data.fullName.trim().length < 3) {
      errs.fullName = 'Name must be at least 3 characters';
    }

    // Roll Number / Student ID
    if (!data.rollNo.trim()) {
      errs.rollNo = 'Roll number is required';
    } else if (data.rollNo.trim().length < 2) {
      errs.rollNo = 'Enter a valid student roll number';
    }

    // Year of Study
    if (!data.yearOfStudy) {
      errs.yearOfStudy = 'Please select your current year of study';
    }

    // Email
    if (!data.email.trim()) {
      errs.email = 'College email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email.trim())) {
        errs.email = 'Enter a valid email address';
      } else if (defaultCollegeDomain) {
        const lower = data.email.trim().toLowerCase();
        if (!lower.endsWith(`@${defaultCollegeDomain.toLowerCase()}`)) {
          errs.emailWarning = `Tip: Official campus domain is @${defaultCollegeDomain}`;
        }
      }
    }

    // Password
    if (!data.password) {
      errs.password = 'Password is required';
    } else if (data.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    // Confirm Password
    if (!data.confirmPassword) {
      errs.confirmPassword = 'Confirm your password';
    } else if (data.password !== data.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    // Terms
    if (!data.agreeToCode) {
      errs.agreeToCode = 'You must agree to genuine grievance reporting';
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
      setErrors((prev) => ({
        ...prev,
        [name]: fieldErrors[name] || '',
        emailWarning: fieldErrors.emailWarning || '',
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldErrors = validate(formData);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldErrors[name] || '',
      emailWarning: fieldErrors.emailWarning || '',
    }));
  };

  const handleAppendDomain = () => {
    if (!formData.email.includes('@')) {
      const updated = `${formData.email.trim()}@${defaultCollegeDomain}`;
      setFormData((prev) => ({ ...prev, email: updated }));
      setErrors((prev) => ({ ...prev, email: '', emailWarning: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      fullName: true,
      rollNo: true,
      yearOfStudy: true,
      email: true,
      password: true,
      confirmPassword: true,
      agreeToCode: true,
    });
    setServerError('');

    const validationErrors = validate(formData);
    const blockingKeys = Object.keys(validationErrors).filter((k) => k !== 'emailWarning');

    if (blockingKeys.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API registration latency
      await new Promise((resolve) => setTimeout(resolve, 950));

      const normalizedEmail = formData.email.trim().toLowerCase();

      // Retrieve existing users from localStorage
      const existingUsers = JSON.parse(localStorage.getItem('campusfix_users') || '[]');

      // Check if email or roll number already registered
      const emailExists = existingUsers.some(
        (u) => u.email.toLowerCase() === normalizedEmail
      );
      if (emailExists) {
        setServerError('A student with this college email is already registered. Please sign in instead.');
        setIsLoading(false);
        return;
      }

      const newStudent = {
        id: `stu-${Date.now().toString(36)}`,
        fullName: formData.fullName.trim(),
        rollNo: formData.rollNo.trim().toUpperCase(),
        yearOfStudy: formData.yearOfStudy,
        department: formData.department,
        email: normalizedEmail,
        password: formData.password, // In real app, hashed on backend
        role: 'student',
        verifiedStudent: normalizedEmail.endsWith(`@${defaultCollegeDomain.toLowerCase()}`),
        createdAt: new Date().toISOString(),
      };

      // Store in users registry
      existingUsers.push(newStudent);
      localStorage.setItem('campusfix_users', JSON.stringify(existingUsers));

      // Automatically sign in the student
      const authSession = {
        token: 'mock-jwt-token-' + Math.random().toString(36).substring(2),
        user: newStudent,
        loginAt: new Date().toISOString(),
      };
      localStorage.setItem('campusfix_auth', JSON.stringify(authSession));
      localStorage.setItem('campusfix_currentUser', JSON.stringify(newStudent));

      setSuccessNotice(true);

      // Brief delay so user sees registration confirmation before redirect
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(newStudent);
        }
      }, 700);
    } catch (err) {
      setServerError(err.message || 'Failed to register account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 mb-3 rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm ring-8 ring-indigo-50/50">
          <GraduationCap className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Create Student Account
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Join CampusFix to report and resolve hostel & campus issues
        </p>
      </div>

      {/* Success Notification */}
      {successNotice && (
        <div className="mb-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold">Account created successfully!</p>
            <p className="text-xs text-emerald-700 mt-0.5">
              Redirecting you to the Student Dashboard...
            </p>
          </div>
        </div>
      )}

      {/* Server Error Alert */}
      {serverError && (
        <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-sm text-red-700 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p>{serverError}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
        {/* Full Name */}
        <div>
          <label
            htmlFor="reg-fullName"
            className="text-xs font-semibold uppercase tracking-wider text-slate-700 block mb-1.5"
          >
            Full Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              id="reg-fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. Aarav Sharma"
              className={`w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-900 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 ${
                errors.fullName
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
          </div>
          {errors.fullName && (
            <p className="mt-1 flex items-center gap-1 text-xs text-red-600 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Roll Number & Year of Study Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Roll Number */}
          <div>
            <label
              htmlFor="reg-rollNo"
              className="text-xs font-semibold uppercase tracking-wider text-slate-700 block mb-1.5"
            >
              Roll No / PRN <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Hash className="w-4 h-4" />
              </div>
              <input
                id="reg-rollNo"
                name="rollNo"
                type="text"
                value={formData.rollNo}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. 21CS042"
                className={`w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-900 placeholder-slate-400 uppercase transition-colors focus:outline-none focus:ring-2 ${
                  errors.rollNo
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
                }`}
              />
            </div>
            {errors.rollNo && (
              <p className="mt-1 flex items-center gap-1 text-xs text-red-600 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.rollNo}
              </p>
            )}
          </div>

          {/* Year of Study */}
          <div>
            <label
              htmlFor="reg-yearOfStudy"
              className="text-xs font-semibold uppercase tracking-wider text-slate-700 block mb-1.5"
            >
              Year of Study <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <GraduationCap className="w-4 h-4" />
              </div>
              <select
                id="reg-yearOfStudy"
                name="yearOfStudy"
                value={formData.yearOfStudy}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full pl-10 pr-8 py-2.5 text-sm rounded-xl border bg-white text-slate-900 transition-colors focus:outline-none focus:ring-2 appearance-none cursor-pointer ${
                  errors.yearOfStudy
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
                } ${!formData.yearOfStudy ? 'text-slate-400' : 'text-slate-900'}`}
              >
                <option value="" disabled>Select Year</option>
                <option value="FE" className="text-slate-900">FE - First Year</option>
                <option value="SE" className="text-slate-900">SE - Second Year</option>
                <option value="TE" className="text-slate-900">TE - Third Year</option>
                <option value="BE" className="text-slate-900">BE - Final Year</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
            {errors.yearOfStudy && (
              <p className="mt-1 flex items-center gap-1 text-xs text-red-600 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.yearOfStudy}
              </p>
            )}
          </div>
        </div>

        {/* Department / Branch */}
        <div>
          <label
            htmlFor="reg-department"
            className="text-xs font-semibold uppercase tracking-wider text-slate-700 block mb-1.5"
          >
            Department / Branch
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Building className="w-4 h-4" />
            </div>
            <select
              id="reg-department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full pl-10 pr-8 py-2.5 text-sm rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 appearance-none cursor-pointer"
            >
              <option value="Computer Engineering">Computer Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics & Telecommunication">Electronics & Telecommunication (E&TC)</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Civil Engineering">Civil Engineering</option>
              <option value="AI & Data Science">AI & Data Science</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* College Email */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="reg-email"
              className="text-xs font-semibold uppercase tracking-wider text-slate-700"
            >
              College Email <span className="text-rose-500">*</span>
            </label>
            {formData.email && !formData.email.includes('@') && (
              <button
                type="button"
                onClick={handleAppendDomain}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
              >
                +@{defaultCollegeDomain}
              </button>
            )}
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="reg-email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={`student.name@${defaultCollegeDomain}`}
              className={`w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-900 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 ${
                errors.email
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
          </div>

          {errors.email && (
            <p className="mt-1 flex items-center gap-1 text-xs text-red-600 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.email}
            </p>
          )}

          {!errors.email && errors.emailWarning && (
            <p className="mt-1 text-xs text-amber-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              {errors.emailWarning}
            </p>
          )}
        </div>

        {/* Password & Confirm Password Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Password */}
          <div>
            <label
              htmlFor="reg-password"
              className="text-xs font-semibold uppercase tracking-wider text-slate-700 block mb-1.5"
            >
              Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="reg-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Min 6 chars"
                className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border bg-white text-slate-900 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 ${
                  errors.password
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 flex items-center gap-1 text-xs text-red-600 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="reg-confirmPassword"
              className="text-xs font-semibold uppercase tracking-wider text-slate-700 block mb-1.5"
            >
              Confirm Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="reg-confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Repeat password"
                className={`w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border bg-white text-slate-900 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 ${
                  errors.confirmPassword
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 flex items-center gap-1 text-xs text-red-600 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        {/* Password Strength Indicator */}
        {formData.password && (
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
            <div className="flex items-center justify-between mb-1.5 text-slate-500 font-medium">
              <span>Password Security</span>
              <span className="font-semibold text-slate-700">{passwordStrength.label}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${passwordStrength.color} ${passwordStrength.width} transition-all duration-300 rounded-full`}
              ></div>
            </div>
          </div>
        )}

        {/* Student Code of Conduct Agreement */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              name="agreeToCode"
              checked={formData.agreeToCode}
              onChange={handleChange}
              className="mt-0.5 w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
            />
            <span className="text-xs text-slate-600 leading-snug">
              I certify that I am a bonafide student of this institution and agree to report only genuine campus and hostel maintenance issues.
            </span>
          </label>
          {errors.agreeToCode && (
            <p className="mt-1 flex items-center gap-1 text-xs text-red-600 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.agreeToCode}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-3 py-3 px-4 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-65 disabled:cursor-not-allowed shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/35 transition-all flex items-center justify-center gap-2 cursor-pointer group"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Registering Student Account...</span>
            </>
          ) : (
            <>
              <span>Complete Student Registration</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="mt-5 pt-4 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-500">
          Already have a CampusFix student account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-semibold text-indigo-600 hover:text-indigo-700 underline underline-offset-2 ml-1 cursor-pointer transition-colors"
          >
            Sign In here
          </button>
        </p>
      </div>
    </div>
  );
}
