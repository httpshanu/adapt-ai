'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Code2, 
  FileText, 
  LayoutDashboard, 
  Layers, 
  Settings, 
  User 
} from 'lucide-react';

export default function AppSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/catalog', label: 'Problem Catalog', icon: Layers },
    { href: '/submissions', label: 'My Submissions', icon: FileText },
    { href: '/profile', label: 'Profile & Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 min-h-screen flex flex-col shrink-0">
      {/* Brand Header */}
      <div className="h-20 px-6 flex items-center border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <span className="font-mono font-bold text-sm tracking-tighter">&lt;/&gt;</span>
          </div>
          <span className="font-bold text-lg text-slate-900 tracking-tight">CodeAdapt AI</span>
        </Link>
      </div>

      {/* Nav List */}
      <nav className="p-4 space-y-1.5 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href === '/catalog' && pathname.startsWith('/problems'));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-100">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-700">Adaptive Engine</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Calibrated to Python 3.11</p>
        </div>
      </div>
    </aside>
  );
}
