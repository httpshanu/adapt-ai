'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Bug,
  Code2, 
  FileText, 
  Flame, 
  Layers, 
  LayoutDashboard, 
  MessageSquare, 
  Settings, 
  Swords,
  Trophy, 
  Users 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import AccountSwitcherModal from './AccountSwitcherModal';
import { LEAGUE_TIER_CONFIG } from '../lib/gamificationEngine';

export default function AppSidebar() {
  const pathname = usePathname();
  const { currentAccount, levelInfo, xp } = useApp();
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { 
      href: '/duel', 
      label: '1v1 Code Clash', 
      icon: Swords, 
      highlight: true,
      badge: 'PvP ⚔️' 
    },
    { 
      href: '/debugger', 
      label: 'Spot the Bug', 
      icon: Bug, 
      badge: '60s 🐛' 
    },
    { href: '/catalog', label: 'Problem Catalog', icon: Layers },
    { 
      href: '/daily-quiz', 
      label: 'Daily Blitz', 
      icon: Flame, 
      badge: 'Quiz 🔥' 
    },
    { 
      href: '/leaderboard', 
      label: 'Leaderboard', 
      icon: Trophy, 
      badge: 'Top 10' 
    },
    { 
      href: '/lounge', 
      label: 'Code Lounge', 
      icon: MessageSquare, 
      badge: 'Discord' 
    },
    { href: '/submissions', label: 'My Submissions', icon: FileText },
    { href: '/profile', label: 'Profile & Settings', icon: Settings },
  ];

  const tier = LEAGUE_TIER_CONFIG[currentAccount.league];

  return (
    <>
      <aside className="w-64 bg-white border-r border-slate-200/80 min-h-screen flex flex-col shrink-0">
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center border-b border-slate-100">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <span className="font-mono font-bold text-sm tracking-tighter">&lt;/&gt;</span>
            </div>
            <div>
              <span className="font-bold text-base text-slate-900 tracking-tight block">CodeAdapt AI</span>
              <span className="text-[10px] text-slate-400 font-medium block -mt-1">Adaptive DSA Platform</span>
            </div>
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
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      item.highlight
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-indigo-100 text-indigo-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Account Card & Switcher at Bottom */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {currentAccount.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 leading-tight truncate max-w-[100px]">
                    {currentAccount.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {levelInfo.title}
                  </div>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tier.badgeColor}`}>
                {tier.icon} {currentAccount.league}
              </span>
            </div>

            {/* Level & XP bar */}
            <div className="space-y-1 mb-2.5">
              <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                <span>Lvl {levelInfo.level}</span>
                <span>{xp} XP</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500" 
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>
            </div>

            {/* Switch Account Action */}
            <button
              onClick={() => setIsSwitcherOpen(true)}
              className="w-full py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Users className="h-3.5 w-3.5" />
              <span>Switch / Add Account</span>
            </button>
          </div>
        </div>
      </aside>

      <AccountSwitcherModal
        isOpen={isSwitcherOpen}
        onClose={() => setIsSwitcherOpen(false)}
      />
    </>
  );
}
