import React from 'react';
import { Cpu } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-lg shadow-indigo-100">
          <Cpu className="w-7 h-7 animate-pulse" />
        </div>
        <div className="absolute inset-0 rounded-2xl border-2 border-indigo-400/30 animate-ping opacity-25 pointer-events-none" />
      </div>

      <div className="mt-5 flex flex-col items-center space-y-1.5">
        <span className="text-sm font-semibold text-slate-700">Loading CodeAdapt AI Workspace...</span>
        <div className="w-48 h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-600 rounded-full animate-indeterminate" />
        </div>
      </div>
    </div>
  );
}
