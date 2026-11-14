'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { KeyRound, LogOut, Save, UserCheck } from 'lucide-react';
import AppSidebar from '../../components/AppSidebar';
import { useApp } from '../../context/AppContext';

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { userName, setUserName, resetAllData } = useApp();

  const [name, setName] = useState(userName || 'Sanidhya Uniyal');
  const [email] = useState('sanidhya@example.com');
  const [careerGoal, setCareerGoal] = useState('Placement / Job');
  const [savedSuccess, setSavedSuccess] = useState(false);

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
      {/* Left Sidebar matching Screen 13 */}
      <AppSidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 sm:p-10 max-w-4xl">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-8">
          Profile & Settings
        </h1>

        {/* User Profile Header Card matching Screen 13 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5 mb-8">
          <div className="h-16 w-16 rounded-full bg-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-indigo-200 shrink-0">
            {name ? name.charAt(0).toUpperCase() : 'S'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{name}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{email}</p>
          </div>
        </div>

        {/* Personal Information Form matching Screen 13 */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-6">Personal Information</h3>

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Display Name</label>
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
                Python 3.11+
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center justify-between">
                <span>Google Gemini API Key (Optional)</span>
                <span className="text-[10px] text-indigo-600 font-normal">For custom Live AI Tutor quotas</span>
              </label>
              <input
                type="password"
                placeholder="AIzaSy... (leave blank to use platform default)"
                defaultValue={typeof window !== 'undefined' ? localStorage.getItem('codeadapt_gemini_key') || '' : ''}
                onChange={(e) => {
                  if (typeof window !== 'undefined') {
                    if (e.target.value.trim()) localStorage.setItem('codeadapt_gemini_key', e.target.value.trim());
                    else localStorage.removeItem('codeadapt_gemini_key');
                  }
                }}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Your key is stored securely in your local browser and used directly for Gemini 2.5 Flash completions.
              </p>
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

        {/* Account Settings matching Screen 13 */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4">Account Settings</h3>
          <div className="divide-y divide-slate-100">
            <button className="w-full py-4 flex items-center justify-between text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors text-left">
              <span className="flex items-center gap-3">
                <KeyRound className="h-4 w-4 text-slate-400" />
                Change Password
              </span>
              <span className="text-xs text-slate-400">&gt;</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full py-4 flex items-center justify-between text-sm font-semibold text-rose-600 hover:text-rose-700 transition-colors text-left"
            >
              <span className="flex items-center gap-3">
                <LogOut className="h-4 w-4" />
                Log Out
              </span>
              <span className="text-xs">&gt;</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
