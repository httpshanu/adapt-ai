'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, Terminal } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log unexpected client exceptions
    console.error('Unhandled Next.js Application Error:', error);
  }, [error]);

  const handleResetSession = () => {
    try {
      // Clear dynamic cache that might be corrupted while keeping user profile
      localStorage.removeItem('codeadapt_dynamic_problems');
    } catch {
      // ignore
    }
    reset();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-red-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Something went wrong</h2>
            <p className="text-xs text-slate-500">CodeAdapt AI caught an unexpected runtime error</p>
          </div>
        </div>

        <div className="bg-red-50/50 border border-red-200/80 rounded-xl p-3 my-4 font-mono text-xs text-red-700 break-words max-h-32 overflow-y-auto">
          {error?.message || 'Unknown runtime error occurred.'}
        </div>

        <p className="text-sm text-slate-500 mb-6">
          Your workspace and streak progress are safe. You can retry the current action or reset the local session cache.
        </p>

        <div className="space-y-2.5">
          <button
            onClick={() => reset()}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors shadow-md shadow-indigo-200"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <button
            onClick={handleResetSession}
            className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors border border-slate-200"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Clear Corrupted Local Cache & Retry</span>
          </button>

          <Link
            href="/dashboard"
            className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-xl text-slate-500 hover:text-slate-800 font-medium text-xs transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
