'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, Code2, Compass, LayoutDashboard, Sparkles, Terminal } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const pathname = usePathname();
  const { userName } = useApp();

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/problems', label: 'Problems', icon: Code2 },
    { href: '/sandbox', label: 'Sandbox', icon: Terminal },
    { href: '/diagnostic', label: 'Diagnostic', icon: Compass },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-xl shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 p-0.5 shadow-sm group-hover:scale-105 transition-transform duration-300">
            <div className="h-full w-full bg-white rounded-[10px] flex items-center justify-center">
              <Brain className="h-5 w-5 text-indigo-600 group-hover:text-indigo-700 transition-colors" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-slate-900">
                CodeAdapt
              </span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-500 -mt-1 hidden sm:block">Adaptive DSA Mentorship</p>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Student Profile Pill */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-xs border border-slate-200 text-slate-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-500">Python 3.12</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-800 font-semibold">{userName}</span>
          </div>

          <Link
            href="/problems/p_two_sum"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-medium shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Practice</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
