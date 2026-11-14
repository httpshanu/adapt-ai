'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Award, Flame, KeyRound, LogOut, Save, Trophy, UserCheck, Users, Zap } from 'lucide-react';
import AppSidebar from '../../components/AppSidebar';
import { useApp } from '../../context/AppContext';
import AccountSwitcherModal from '../../components/AccountSwitcherModal';
import { LEAGUE_TIER_CONFIG } from '../../lib/gamificationEngine';

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { currentAccount, setUserName, resetAllData, xp, levelInfo } = useApp();

  const [name, setName] = useState(currentAccount.name);
  const [careerGoal, setCareerGoal] = useState('Placement / Job');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  const tier = LEAGUE_TIER_CONFIG[currentAccount.league];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) setUserName(name.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      resetAllData();
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <AppSidebar />

      <main className="flex-1 p-6 sm:p-10 max-w-4xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Profile & Learner Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage your personal student account, achievements, and testing preferences.
            </p>
          </div>

          <button
            onClick={() => setIsSwitcherOpen(true)}
            className="self-start sm:self-auto px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-100 transition-all"
          >
            <Users className="h-4 w-4" />
            <span>Switch / Add Test Account</span>
          </button>
        </div>

        {/* User Profile Header Card */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md shadow-indigo-100 shrink-0">
                {currentAccount.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">{currentAccount.name}</h2>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${tier.badgeColor}`}>
                    {tier.icon} {currentAccount.league}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{currentAccount.email}</p>
                <div className="flex items-center gap-3 mt-2 text-xs font-semibold text-slate-600">
                  <span>Level {levelInfo.level} ({levelInfo.title})</span>
                  <span>•</span>
                  <span className="text-indigo-600">{xp} Total XP</span>
                  <span>•</span>
                  <span className="text-amber-600 flex items-center gap-0.5">
                    🔥 {currentAccount.streak}d Streak
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements & Badges Showcase */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Unlocked Badges & Honors</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {currentAccount.badges.map((b, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5"
              >
                <span className="text-xl">🎖️</span>
                <div>
                  <span className="font-bold text-xs text-slate-800 block">{b}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">Unlocked</span>
                </div>
              </div>
            ))}
            <div className="p-3.5 rounded-2xl border border-dashed border-slate-200 flex items-center gap-2.5 opacity-60">
              <span className="text-xl">🔒</span>
              <div>
                <span className="font-bold text-xs text-slate-700 block">7-Day Blitz</span>
                <span className="text-[10px] text-slate-400">Locked</span>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information Form */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-6">Account Details</h3>

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Student Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Career Goal</label>
              <select
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="Placement / Job">Placement / Job</option>
                <option value="Coding Interviews">Coding Interviews</option>
                <option value="DSA Fundamentals">DSA Fundamentals</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Preferred Language</label>
              <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 font-medium">
                Python 3.10 / C++ 17 / Java 17 (Sandboxed Execution)
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center justify-between">
                <span>Google Gemini API Key (Optional)</span>
                <span className="text-[10px] text-indigo-600 font-normal">For live AI code mentor</span>
              </label>
              <input
                type="password"
                placeholder="AIzaSy... (leave blank to use default)"
                defaultValue={typeof window !== 'undefined' ? localStorage.getItem('codeadapt_gemini_key') || '' : ''}
                onChange={(e) => {
                  if (typeof window !== 'undefined') {
                    if (e.target.value.trim()) localStorage.setItem('codeadapt_gemini_key', e.target.value.trim());
                    else localStorage.removeItem('codeadapt_gemini_key');
                  }
                }}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-200 flex items-center gap-2 transition-all"
            >
              <Save className="h-4 w-4" />
              <span>{savedSuccess ? 'Changes Saved!' : 'Save Changes'}</span>
            </button>
          </form>
        </div>

        {/* Account Reset */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-4">Reset Student Data</h3>
          <div className="divide-y divide-slate-100">
            <button
              onClick={handleLogout}
              className="w-full py-4 flex items-center justify-between text-sm font-semibold text-rose-600 hover:text-rose-700 transition-colors text-left"
            >
              <span className="flex items-center gap-3">
                <LogOut className="h-4 w-4" />
                Reset & Log Out of Current Profile
              </span>
              <span className="text-xs">&gt;</span>
            </button>
          </div>
        </div>
      </main>

      <AccountSwitcherModal
        isOpen={isSwitcherOpen}
        onClose={() => setIsSwitcherOpen(false)}
      />
    </div>
  );
}
