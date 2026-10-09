import React, { useState } from 'react';
import { loginUser } from '../../services/authService';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  GraduationCap,
  KeyRound
} from 'lucide-react';

/**
 * StudentLogin Component
 * 
 * @param {Object} props
 * @param {Function} props.onSuccess - Callback invoked on successful authentication with user data
 * @param {Function} props.onSwitchToRegister - Callback to switch view to Register
 * @param {string} [props.defaultCollegeDomain='pvpit.edu'] - College domain for validation
 * @param {string} [props.prefillEmail=''] - Optional initial email (e.g. redirected from register)
 */
export default function StudentLogin({
  onSuccess,
  onSwitchToRegister,
  defaultCollegeDomain = 'pvpit.edu',
  prefillEmail = ''
}) {
  const [formData, setFormData] = useState({
    email: prefillEmail || '',
    password: '',
    rememberMe: true,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Validate individual field or all fields
  const validate = (data = formData) => {
    const errs = {};

    // Email validation
    if (!data.email.trim()) {
      errs.email = 'College email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email.trim())) {
        errs.email = 'Please enter a valid email address';
      } else if (defaultCollegeDomain) {
        const lowerEmail = data.email.trim().toLowerCase();
        // Soft recommendation or check
        if (!lowerEmail.endsWith(`@${defaultCollegeDomain.toLowerCase()}`)) {
          errs.emailWarning = `Tip: Official campus domain is @${defaultCollegeDomain}`;
        }
      }
    }

    // Password validation
    if (!data.password) {
      errs.password = 'Password is required';
    } else if (data.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    return errs;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newVal = type === 'checkbox' ? checked : value;
    const updatedForm = { ...formData, [name]: newVal };
    setFormData(updatedForm);

    // Clear field-specific error as user types if already touched
    if (touched[name]) {
      const fieldErrors = validate(updatedForm);
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

  // Quick helper to append college domain if user typed just their roll or username
  const handleAppendDomain = () => {
    if (!formData.email.includes('@')) {
      const updatedEmail = `${formData.email.trim()}@${defaultCollegeDomain}`;
      setFormData((prev) => ({ ...prev, email: updatedEmail }));
      setErrors((prev) => ({ ...prev, email: '', emailWarning: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setServerError('');

    const validationErrors = validate(formData);
    const hasBlockingErrors = validationErrors.email || validationErrors.password;

    if (hasBlockingErrors) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      const result = await loginUser({
        email: formData.email,
        password: formData.password,
        expectedRole: 'student',
      });

      if (onSuccess) {
        onSuccess(result.user);
      }
    } catch (err) {
      setServerError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) return;
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotSuccess(false);
      setShowForgotModal(false);
      setForgotEmail('');
    }, 2200);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 mb-3 rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm ring-8 ring-indigo-50/50">
          <GraduationCap className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Student Portal Login
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Access your campus grievance & utility tracking dashboard
        </p>
      </div>



      {/* Server / Global Error Banner */}
      {serverError && (
        <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-sm text-red-700 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p>{serverError}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Email Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="login-email"
              className="text-xs font-semibold uppercase tracking-wider text-slate-700"
            >
              College Email
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
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={`rollno@${defaultCollegeDomain}`}
              className={`w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border bg-white text-slate-900 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 ${
                errors.email
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
          </div>

          {/* Email Inline Error */}
          {errors.email && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.email}
            </p>
          )}

          {/* Domain Recommendation Hint */}
          {!errors.email && errors.emailWarning && (
            <p className="mt-1.5 text-xs text-amber-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              {errors.emailWarning}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="login-password"
              className="text-xs font-semibold uppercase tracking-wider text-slate-700"
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="login-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="••••••••"
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

          {/* Password Inline Error */}
          {errors.password && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.password}
            </p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-xs text-slate-600 font-medium">Keep me signed in</span>
          </label>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <KeyRound className="w-3 h-3" /> Secure SSL
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-65 disabled:cursor-not-allowed shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/35 transition-all flex items-center justify-center gap-2 cursor-pointer group"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying Credentials...</span>
            </>
          ) : (
            <>
              <span>Sign In to CampusFix</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Register */}
      <div className="mt-6 pt-5 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-500">
          New to CampusFix or haven't registered your roll number?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-semibold text-indigo-600 hover:text-indigo-700 underline underline-offset-2 ml-1 cursor-pointer transition-colors"
          >
            Create an Account
          </button>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Reset Student Password</h3>
                <p className="text-xs text-slate-500">
                  Password recovery for PVPIT Campus Portal
                </p>
              </div>
            </div>

            {forgotSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-semibold">Reset instructions dispatched!</p>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Check your student inbox at <strong>{forgotEmail}</strong>
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Enter your registered college email. If verified in the campus roster, an OTP and reset link will be sent.
                </p>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    College Email
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder={`e.g. 21cs088@${defaultCollegeDomain}`}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                  />
                </div>
                <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  💡 You can also contact the Campus IT Helpdesk at{' '}
                  <span className="font-mono text-slate-700">it-support@{defaultCollegeDomain}</span> or
                  visit Admin Block Room 104.
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
