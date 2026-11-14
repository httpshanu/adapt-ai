import React from 'react';
import Link from 'next/link';
import { Compass, BookOpen, LayoutDashboard, Terminal } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center bg-white border border-slate-200 rounded-3xl p-8 shadow-xl shadow-slate-200/50 relative overflow-hidden">
        <div className="w-16 h-16 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>

        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">404</h1>
        <h2 className="text-lg font-semibold text-slate-800 mb-2">Algorithm or Page Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">
          The requested path doesn't exist in the CodeAdapt knowledge graph.
        </p>

        <div className="space-y-2.5">
          <Link
            href="/dashboard"
            className="flex items-center justify-center space-x-2 w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors shadow-md shadow-indigo-200"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Go to Dashboard</span>
          </Link>

          <Link
            href="/catalog"
            className="flex items-center justify-center space-x-2 w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm transition-colors border border-slate-200"
          >
            <BookOpen className="w-4 h-4" />
            <span>Browse DSA Catalog</span>
          </Link>

          <Link
            href="/sandbox"
            className="flex items-center justify-center space-x-2 w-full py-2 px-4 rounded-xl text-slate-500 hover:text-slate-800 font-medium text-xs transition-colors"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Open Multi-Lang Sandbox</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
