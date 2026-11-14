'use client';

import React, { useEffect, useState } from 'react';
import AppSidebar from '../../components/AppSidebar';
import { useApp } from '../../context/AppContext';
import { 
  AlertCircle, 
  ArrowRight, 
  Bug, 
  CheckCircle2, 
  Clock, 
  Flame, 
  HelpCircle, 
  Play, 
  RotateCcw, 
  Sparkles, 
  Trophy, 
  Wand2, 
  XCircle, 
  Zap 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BUG_HUNT_CHALLENGES } from '../../lib/bugHuntData';

export default function DebuggerPage() {
  const { currentAccount, recordBugFixed } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userCode, setUserCode] = useState(BUG_HUNT_CHALLENGES[0].buggyCode);
  const [timerSeconds, setTimerSeconds] = useState(BUG_HUNT_CHALLENGES[0].timeLimitSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);
  const [comboStreak, setComboStreak] = useState(0);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null);

  const currentChallenge = BUG_HUNT_CHALLENGES[currentIndex];
  const totalBugs = currentAccount.bugsFixed || 0;

  // Countdown Timer
  useEffect(() => {
    if (!isTimerRunning || isSolved || hasFailed) return;

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, isSolved, hasFailed, currentIndex]);

  const handleTimeout = () => {
    setHasFailed(true);
    setComboStreak(0);
    setVerificationMessage('Time expired! Review the solution below and try the next bug.');
  };

  const handleResetChallenge = () => {
    setUserCode(currentChallenge.buggyCode);
    setTimerSeconds(currentChallenge.timeLimitSeconds);
    setIsTimerRunning(true);
    setIsSolved(false);
    setHasFailed(false);
    setShowHint(false);
    setVerificationMessage(null);
  };

  const handleNextChallenge = () => {
    const nextIdx = (currentIndex + 1) % BUG_HUNT_CHALLENGES.length;
    setCurrentIndex(nextIdx);
    setUserCode(BUG_HUNT_CHALLENGES[nextIdx].buggyCode);
    setTimerSeconds(BUG_HUNT_CHALLENGES[nextIdx].timeLimitSeconds);
    setIsTimerRunning(true);
    setIsSolved(false);
    setHasFailed(false);
    setShowHint(false);
    setVerificationMessage(null);
  };

  // Verify Bug Fix
  const handleVerifyFix = () => {
    // Check if the user addressed the specific bug
    let passed = false;

    if (currentChallenge.id === 'bug_1') {
      passed = userCode.includes('left = mid + 1');
    } else if (currentChallenge.id === 'bug_2') {
      passed =
        userCode.includes('seen[complement] != i') ||
        (userCode.includes('complement in seen') && userCode.indexOf('complement in seen') < userCode.indexOf('seen[num] = i'));
    } else if (currentChallenge.id === 'bug_3') {
      passed = userCode.includes('n <= 1') || userCode.includes('n == 0');
    } else if (currentChallenge.id === 'bug_4') {
      passed = userCode.includes('len(nums) - 1');
    } else if (currentChallenge.id === 'bug_5') {
      passed = userCode.includes('.lower()');
    }

    if (passed) {
      setIsSolved(true);
      setIsTimerRunning(false);
      setComboStreak((prev) => prev + 1);
      const bonusXp = currentChallenge.xpReward + comboStreak * 10;
      recordBugFixed(currentChallenge.id, bonusXp);

      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    } else {
      setVerificationMessage('Bug still present! Tests failed on sample edge case. Check the logic and try again.');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <AppSidebar />

      <main className="flex-1 p-6 lg:p-10 max-w-5xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                <Bug className="h-3.5 w-3.5 text-rose-600" /> Spot the Bug Blitz
              </span>
              <span className="text-xs text-slate-500 font-medium">60s Debugger Challenge</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>Code Debugger Rush</span>
              <span className="text-2xl">🐛</span>
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Find and fix hidden logic errors under 60 seconds. Build sharp code-review intuition!
            </p>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-3">
            <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-xs flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-bold text-lg">
                🔥
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Combo Streak</span>
                <span className="text-sm font-extrabold text-slate-900">{comboStreak}x Streak</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-xs flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center font-bold text-lg">
                <Bug className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Bugs Exterminated</span>
                <span className="text-sm font-extrabold text-slate-900">{totalBugs} Fixed</span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            MAIN BUG HUNTING CARD
        ========================================================================= */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          {/* Header Row: Title, Topic, Timer */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700">
                Bug #{currentIndex + 1} of {BUG_HUNT_CHALLENGES.length}
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700">
                {currentChallenge.topic}
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700">
                {currentChallenge.difficulty}
              </span>
            </div>

            {/* 60s Countdown Timer */}
            <div
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-mono text-sm font-black transition-all ${
                timerSeconds <= 15
                  ? 'bg-rose-50 text-rose-600 border border-rose-200 animate-pulse'
                  : 'bg-slate-50 text-slate-700 border border-slate-200'
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>{timerSeconds}s Remaining</span>
            </div>
          </div>

          {/* Bug Description */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-1.5">
              {currentChallenge.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {currentChallenge.description}
            </p>
          </div>

          {/* Interactive Code Editor (Python) */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-inner">
            <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="font-bold flex items-center gap-1.5 text-rose-400">
                <Bug className="h-3.5 w-3.5" /> buggy_code.py (Edit inline to fix)
              </span>
              <button
                onClick={handleResetChallenge}
                className="hover:text-white flex items-center gap-1 transition-colors"
                title="Reset Buggy Code"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            </div>

            <textarea
              rows={12}
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              className="w-full p-4 bg-transparent text-emerald-300 font-mono text-xs leading-relaxed focus:outline-none resize-none"
            />
          </div>

          {/* Hint Dropdown Toggle */}
          <div>
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              <span>{showHint ? 'Hide Hint' : 'Need a Hint? (-0 XP penalty)'}</span>
            </button>
            {showHint && (
              <div className="mt-2 p-3.5 bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 rounded-2xl animate-in fade-in duration-150">
                💡 <span className="font-semibold">Hint:</span> {currentChallenge.hint}
              </div>
            )}
          </div>

          {/* Error Message if fix failed */}
          {verificationMessage && !isSolved && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-xs text-rose-800 font-semibold rounded-2xl flex items-center gap-2 animate-in fade-in duration-150">
              <XCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{verificationMessage}</span>
            </div>
          )}

          {/* Solved Explanation Banner */}
          {isSolved && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-2xl space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span>Bug Squashed! +{currentChallenge.xpReward} XP Awarded</span>
              </div>
              <p className="text-xs leading-relaxed text-emerald-900">
                <span className="font-bold">Why this works: </span>
                {currentChallenge.bugExplanation}
              </p>
            </div>
          )}

          {/* Bottom Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 flex-wrap gap-4">
            <span className="text-xs font-bold text-slate-500">
              Reward: <span className="text-indigo-600">+{currentChallenge.xpReward} XP</span>
            </span>

            <div className="flex items-center gap-2">
              {!isSolved ? (
                <button
                  onClick={handleVerifyFix}
                  className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-100 transition-all"
                >
                  <Play className="h-4 w-4 fill-white" />
                  <span>Debug & Verify Fix</span>
                </button>
              ) : (
                <button
                  onClick={handleNextChallenge}
                  className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-100 transition-all"
                >
                  <span>Next Bug Challenge</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
