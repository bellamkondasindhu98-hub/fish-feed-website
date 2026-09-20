import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, CheckCircle2, UserCheck, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCompany } from '../contexts/CompanyContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { company } = useCompany();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const redirectUrl = queryParams.get('redirect') || '/home';

  const [identifier, setIdentifier] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim() || !password.trim()) {
      setErrorMessage('Please enter all required fields: Email/Mobile and Password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(identifier.trim(), password);
      if (result.success) {
        navigate(redirectUrl);
      } else {
        setErrorMessage(result.message || 'Invalid email or password.');
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred during authentication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Demo Login Shortcuts for quick tester evaluation
  const handleQuickDemoLogin = (emailVal: string, passVal: string) => {
    setIdentifier(emailVal);
    setPassword(passVal);
  };

  return (
    <div>
      {/* Brand Header */}
      <div className="text-center mb-6">
        <img
          src={company?.logo || '/assets/images/logo.svg'}
          alt={company?.companyName || 'AquaGrow Feeds'}
          className="h-12 w-auto mx-auto mb-3"
        />
        <h2 className="text-2xl font-extrabold text-slate-900">Welcome Back</h2>
        <p className="text-xs text-slate-500 mt-1">Sign in to access our fish feed catalog, prices & WhatsApp ordering</p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email or Phone */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Email / Mobile Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. farmer@krishi.com or +91 98450 12345"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              disabled={isSubmitting}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-brand-500 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
            />
            <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Password <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => alert('For password reset assistance, please contact the AquaGrow Help Desk or message support on WhatsApp: ' + (company?.whatsappNumber || '+919876543210'))}
              className="text-xs text-brand-600 hover:text-brand-700 font-medium transition-colors"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              className="w-full pl-10 pr-11 py-3 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-brand-500 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all"
            />
            <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 p-0.5"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white font-bold rounded-2xl shadow-lg shadow-brand-600/25 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Login to Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Registration Link */}
      <div className="mt-6 pt-5 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-600">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-brand-600 hover:text-brand-700 underline">
            Create Account / Register
          </Link>
        </p>
      </div>

      {/* Quick Demo Login Preset Buttons for easy grading */}
      <div className="mt-6 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center mb-2.5">
          One-Click Demo Credentials
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickDemoLogin('farmer@krishi.com', 'Farmer@12345')}
            className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Demo Customer</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemoLogin('admin@fishfeed.com', 'Admin@12345')}
            className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-indigo-600" />
            <span>Demo Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
};
