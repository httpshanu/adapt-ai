'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function OnboardingPage() {
  const router = useRouter();
  const { userName, setUserName } = useApp();

  const [displayName, setDisplayName] = useState(userName || 'Sanidhya');
  const [careerGoal, setCareerGoal] = useState('Placement / Job');
  const [language] = useState('Python 3.11+ (default)');
  const [experienceLevel, setExperienceLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (displayName.trim()) setUserName(displayName.trim());
    router.push('/diagnostic');
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

      {/* Step Indicator (1 - 2 - 3 - 4) */}
      <div className="flex items-center justify-center gap-3 mb-8">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center gap-3">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === 1
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-300'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              {step}
            </div>
            {step < 4 && <div className="w-6 h-0.5 bg-slate-200" />}
          </div>
        ))}
      </div>

      {/* Main Card */}
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Let&apos;s get to know you</h2>
          <p className="text-sm text-slate-500 mt-1.5">Help us personalize your learning experience.</p>
        </div>

        <form onSubmit={handleContinue} className="space-y-6">
          {/* Display Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Display Name</label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Sanidhya"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all font-medium"
            />
          </div>

          {/* Target Career Goal */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Target Career Goal</label>
            <select
              value={careerGoal}
              onChange={(e) => setCareerGoal(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all font-medium"
            >
              <option value="Placement / Job">Placement / Job</option>
              <option value="Coding Interviews">Coding Interviews</option>
              <option value="DSA Fundamentals">DSA Fundamentals</option>
            </select>
          </div>

          {/* Preferred Coding Language */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Preferred Coding Language</label>
            <div className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 flex items-center justify-between">
              <span>{language}</span>
              <span className="text-[11px] text-indigo-600 font-bold px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100">
                MVP Standard
              </span>
            </div>
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Experience Level <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setExperienceLevel(lvl)}
                  className={`py-3 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                    experienceLevel === lvl
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
          >
            <span>Continue</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
