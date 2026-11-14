'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Sparkles, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { INITIAL_DEMO_ACCOUNTS } from '../../context/AppContext';
import { LEAGUE_TIER_CONFIG } from '../../lib/gamificationEngine';

export default function LoginPage() {
  const router = useRouter();
  const { switchAccount, setUserName } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      const derivedName = email.split('@')[0];
      setUserName(derivedName.charAt(0).toUpperCase() + derivedName.slice(1));
    }
    router.push('/dashboard');
  };

  const handleQuickDemoLogin = (accountId: string) => {
    switchAccount(accountId);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <Link href="/" className="flex items-center gap-2 mb-8 group">
        <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
          <span className="font-mono font-bold text-sm tracking-tighter">&lt;/&gt;</span>
        </div>
        <span className="font-bold text-xl text-slate-900 tracking-tight">CodeAdapt AI</span>
      </Link>

      {/* Main Card */}
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome back!</h2>
          <p className="text-sm text-slate-500 mt-1">Login to continue your DSA journey.</p>
        </div>

        {/* 1-Click Multi-Account Quick Test Bar */}
        <div className="mb-6 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 mb-2.5">
            <Users className="h-4 w-4 text-indigo-600" />
            <span>1-Click Test Student Profiles:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {INITIAL_DEMO_ACCOUNTS.map((demo) => {
              const tier = LEAGUE_TIER_CONFIG[demo.league];
              return (
                <button
                  key={demo.id}
                  type="button"
                  onClick={() => handleQuickDemoLogin(demo.id)}
                  className="p-2.5 rounded-xl bg-white border border-indigo-200/80 hover:border-indigo-500 hover:shadow-xs text-left transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800 group-hover:text-indigo-600 truncate">
                      {demo.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px]">{tier.icon}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {demo.role} • {demo.xp} XP
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot password */}
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Remember me</span>
            </label>
            <a href="#" className="font-semibold text-indigo-600 hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01]"
          >
            Login to Account
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-semibold text-indigo-600 hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
