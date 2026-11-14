'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Brain, 
  Code2, 
  Flame, 
  LayoutDashboard, 
  MessageSquare, 
  Terminal, 
  Trophy, 
  User, 
  Users 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import AccountSwitcherModal from './AccountSwitcherModal';
import { LEAGUE_TIER_CONFIG } from '../lib/gamificationEngine';

export default function Navbar() {
  const pathname = usePathname();
  const { currentAccount, xp } = useApp();
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/problems', label: 'Problems', icon: Code2 },
    { href: '/daily-quiz', label: 'Daily Blitz', icon: Flame, badge: 'Quiz' },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy, badge: 'Top 10' },
    { href: '/lounge', label: 'Code Lounge', icon: MessageSquare, badge: 'Discord' },
    { href: '/sandbox', label: 'Sandbox', icon: Terminal },
  ];

  const tier = LEAGUE_TIER_CONFIG[currentAccount.league];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 p-0.5 shadow-sm group-hover:scale-105 transition-transform duration-300">
              <div className="h-full w-full bg-white rounded-[10px] flex items-center justify-center">
                <Brain className="h-5 w-5 text-indigo-600 group-hover:text-indigo-700 transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-slate-900">
                  CodeAdapt
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  AI
                </span>
              </div>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 relative ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                  {link.badge && !isActive && (
                    <span className="text-[9px] font-extrabold px-1 py-0.2 rounded-full bg-amber-100 text-amber-800 ml-0.5">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Status & Account Switcher */}
          <div className="flex items-center gap-3">
            {/* Streak & XP Badges */}
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/daily-quiz"
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold hover:bg-amber-100 transition-colors"
                title="Current Daily Streak"
              >
                <Flame className="h-3.5 w-3.5 fill-amber-500 text-amber-500 animate-pulse" />
                <span>{currentAccount.streak}d Streak</span>
              </Link>
              <Link
                href="/leaderboard"
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors"
                title="Total Experience Points"
              >
                <span>⚡ {xp} XP</span>
              </Link>
            </div>

            {/* Account Switcher Button */}
            <button
              onClick={() => setIsSwitcherOpen(true)}
              className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-2xl border border-slate-200 hover:border-indigo-400 bg-slate-50/80 hover:bg-indigo-50/30 transition-all text-left shadow-xs"
              title="Click to switch student accounts"
            >
              <div className="h-8 w-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {currentAccount.name.charAt(0)}
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-800 leading-tight">
                    {currentAccount.name.split(' ')[0]}
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold border ${tier.badgeColor}`}>
                    {tier.icon}
                  </span>
                </div>
                <span className="text-[10px] text-indigo-600 font-semibold block -mt-0.5">
                  Switch Account ▾
                </span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Account Switcher Modal */}
      <AccountSwitcherModal
        isOpen={isSwitcherOpen}
        onClose={() => setIsSwitcherOpen(false)}
      />
    </>
  );
}
