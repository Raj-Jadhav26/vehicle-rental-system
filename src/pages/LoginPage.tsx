import React, { useState } from 'react';
import { authService } from '../services/api';
import { User } from '../types';
import { Car, Lock, Mail, AlertCircle, Eye, EyeOff, User as UserIcon, Shield } from 'lucide-react';

interface LoginPageProps {
  onSuccess: (user: User) => void;
  onGoToRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onGoToRegister }) => {
  const [loginType, setLoginType] = useState<'USER' | 'ADMIN'>('USER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await authService.login(email, password);

      // Verify role matches the selected login option
      if (loginType === 'ADMIN' && res.user.role !== 'ADMIN') {
        setError('This account does not have admin access. Please choose User Login.');
        authService.logout();
        return;
      }

      if (loginType === 'USER' && res.user.role === 'ADMIN') {
        setError('This is an admin account. Please click Admin Login above.');
        authService.logout();
        return;
      }

      onSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Could not log in. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
          <Car className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Log In to Rent&Ride</h1>
        <p className="text-xs text-slate-500">
          Choose your account type below to log in
        </p>
      </div>

      {/* User Login vs Admin Login Option */}
      <div className="bg-slate-200/70 p-1.5 rounded-2xl flex border border-slate-300/80">
        <button
          type="button"
          onClick={() => {
            setLoginType('USER');
            setError(null);
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            loginType === 'USER'
              ? 'bg-white text-blue-700 shadow-sm border border-slate-200/60'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserIcon className="w-4 h-4 text-blue-600" />
          <span>User Login</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setLoginType('ADMIN');
            setError(null);
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            loginType === 'ADMIN'
              ? 'bg-slate-900 text-amber-400 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Shield className="w-4 h-4 text-amber-400" />
          <span>Admin Login</span>
        </button>
      </div>

      {/* Main Login Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              {loginType === 'USER' ? 'User Login' : 'Admin Login'}
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {loginType === 'USER'
                ? 'Rent cars and bikes, and view your bookings'
                : 'Manage vehicles, bookings, and users'}
            </p>
          </div>
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
            loginType === 'USER' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
          }`}>
            {loginType === 'USER' ? 'User' : 'Admin'}
          </span>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={loginType === 'USER' ? 'name@example.com' : 'admin@example.com'}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 font-semibold"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white rounded-xl font-bold transition shadow-xs cursor-pointer ${
              loginType === 'USER'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-slate-900 hover:bg-slate-800 text-amber-300'
            }`}
          >
            {loading ? 'Logging In...' : loginType === 'USER' ? 'Log In as User' : 'Log In as Admin'}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
          {loginType === 'USER' ? (
            <>
              Don't have an account?{' '}
              <button
                onClick={onGoToRegister}
                className="font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Create an account
              </button>
            </>
          ) : (
            <span className="text-[11px] text-slate-400">
              Admin accounts can only be accessed through Admin Login.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
