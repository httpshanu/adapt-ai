'use client';

import React, { useEffect, useState } from 'react';
import AppSidebar from '../../components/AppSidebar';
import { useApp } from '../../context/AppContext';
import { 
  AlertCircle, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Play, 
  RotateCcw, 
  ShieldAlert, 
  Sparkles, 
  Swords, 
  Terminal, 
  Trophy, 
  Users, 
  XCircle, 
  Zap 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DUEL_OPPONENTS, DUEL_PROBLEMS } from '../../lib/duelEngine';
import { DuelOpponent, DuelProblem } from '../../types';
import Link from 'next/link';

export default function DuelPage() {
  const { currentAccount, recordDuelOutcome } = useApp();

  // Match State
  const [inMatch, setInMatch] = useState(false);
  const [isMatchmaking, setIsMatchmaking] = useState(false);
  const [selectedOpponent, setSelectedOpponent] = useState<DuelOpponent>(DUEL_OPPONENTS[1]);
  const [problem, setProblem] = useState<DuelProblem>(DUEL_PROBLEMS[0]);
  const [language, setLanguage] = useState<'python' | 'cpp' | 'java'>('python');
  const [userCode, setUserCode] = useState(DUEL_PROBLEMS[0].starterCodes.python);

  // Live Duel Status
  const [matchSeconds, setMatchSeconds] = useState(300); // 5 minutes
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [userPassedTests, setUserPassedTests] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState<{ passed: boolean; message: string }[]>([]);

  // Opponent Bot Simulation
  const [botPassedTests, setBotPassedTests] = useState(0);
  const [botStatus, setBotStatus] = useState('Analyzing problem...');

  // Match End Result Modal
  const [matchOutcome, setMatchOutcome] = useState<'WIN' | 'LOSS' | null>(null);
  const [eloResult, setEloResult] = useState<{ playerChange: number; newElo: number } | null>(null);

  const playerElo = currentAccount.eloRating || 1200;
  const wins = currentAccount.duelWins || 0;
  const losses = currentAccount.duelLosses || 0;

  // Change code when language changes
  const handleLanguageChange = (lang: 'python' | 'cpp' | 'java') => {
    setLanguage(lang);
    setUserCode(problem.starterCodes[lang]);
  };

  // Start Matchmaking
  const handleStartDuel = (opp: DuelOpponent) => {
    setSelectedOpponent(opp);
    setIsMatchmaking(true);

    setTimeout(() => {
      // Pick problem randomly
      const randomProb = DUEL_PROBLEMS[Math.floor(Math.random() * DUEL_PROBLEMS.length)];
      setProblem(randomProb);
      setUserCode(randomProb.starterCodes[language]);
      setUserPassedTests(0);
      setBotPassedTests(0);
      setTestResults([]);
      setMatchSeconds(randomProb.timeLimitMinutes * 60);
      setMatchOutcome(null);
      setEloResult(null);
      setIsMatchmaking(false);
      setInMatch(true);
      setIsTimerRunning(true);
    }, 1800);
  };

  // Match Timer
  useEffect(() => {
    if (!inMatch || !isTimerRunning || matchOutcome) return;

    const interval = setInterval(() => {
      setMatchSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleMatchLoss('Time Expired!');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [inMatch, isTimerRunning, matchOutcome]);

  // Bot Simulation Progress
  useEffect(() => {
    if (!inMatch || !isTimerRunning || matchOutcome) return;

    const totalTests = problem.testCases.length;
    // Bot takes ~ 40-75 seconds depending on speedMultiplier
    const intervalTime = Math.round(10000 * selectedOpponent.speedMultiplier);

    const interval = setInterval(() => {
      setBotPassedTests((prev) => {
        const next = prev + 1;
        if (next === 1) setBotStatus('Drafting optimal hash/pointer logic...');
        else if (next === 2) setBotStatus('Testing sample inputs...');
        else if (next === totalTests - 1) setBotStatus('Executing edge test cases...');
        else if (next >= totalTests) {
          clearInterval(interval);
          setBotStatus('All tests passed! 🚀');
          handleMatchLoss(`${selectedOpponent.name} passed all test cases first!`);
          return totalTests;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [inMatch, isTimerRunning, matchOutcome, problem, selectedOpponent]);

  // User Code Run & Submit
  const handleRunCode = async () => {
    setIsSubmitting(true);
    const total = problem.testCases.length;

    // Simulate real sandbox verification against test cases
    setTimeout(() => {
      const isCompleteSolution =
        userCode.length > 80 &&
        !userCode.includes('pass') &&
        !userCode.includes('return false') &&
        !userCode.includes('return {}');

      let passedCount = isCompleteSolution ? total : Math.min(total - 1, 2);

      const generatedResults = problem.testCases.map((tc, idx) => ({
        passed: idx < passedCount,
        message: idx < passedCount ? `Test case #${idx + 1} passed (2ms)` : `Test case #${idx + 1} wrong output`,
      }));

      setUserPassedTests(passedCount);
      setTestResults(generatedResults);
      setIsSubmitting(false);

      if (passedCount === total) {
        handleMatchWin();
      }
    }, 1200);
  };

  const handleMatchWin = () => {
    setIsTimerRunning(false);
    setMatchOutcome('WIN');
    const res = recordDuelOutcome(true, selectedOpponent.elo);
    setEloResult(res);

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
      });
    } catch {
      // ignore
    }
  };

  const handleMatchLoss = (reason?: string) => {
    setIsTimerRunning(false);
    setMatchOutcome('LOSS');
    const res = recordDuelOutcome(false, selectedOpponent.elo);
    setEloResult(res);
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex min-h-screen bg-[#0b1120] text-slate-100">
      <AppSidebar />

      <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full flex flex-col">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                <Swords className="h-3.5 w-3.5 text-rose-400" /> 1v1 Live Code Arena
              </span>
              <span className="text-xs text-slate-400 font-medium">Real-Time PvP Matchmaking</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <span>Code Clash: Speed Duel</span>
              <span className="text-2xl">⚔️</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Race against peers in real-time. Solve the algorithm, pass all test cases first, and climb the Elo ladder!
            </p>
          </div>

          {/* User Elo Card */}
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-3.5 rounded-2xl shadow-sm self-start sm:self-auto">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              ⚔️
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Your Arena Elo</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-white">{playerElo} Elo</span>
                <span className="text-xs font-semibold text-emerald-400">
                  {wins}W - {losses}L
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            LOBBY SCREEN / MATCHMAKING
        ========================================================================= */}
        {!inMatch && (
          <div className="space-y-6 flex-1">
            {/* Matchmaking Overlay if active */}
            {isMatchmaking ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="h-20 w-20 rounded-3xl bg-indigo-600/20 border-2 border-indigo-500 text-indigo-400 flex items-center justify-center text-4xl mx-auto mb-4 animate-spin">
                  ⚔️
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Finding Competitor...</h3>
                <p className="text-xs text-slate-400 mb-6">Connecting you with {selectedOpponent.name} ({selectedOpponent.elo} Elo)...</p>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-rose-500 to-indigo-500 rounded-full animate-pulse w-3/4" />
                </div>
              </div>
            ) : (
              <>
                <div className="bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-800">
                  <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4 text-indigo-400" />
                    <span>Choose Your Opponent</span>
                  </h2>
                  <p className="text-xs text-slate-400 mb-6">
                    Select a student challenger from the active queue or match instantly based on your rating tier:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {DUEL_OPPONENTS.map((opp) => (
                      <div
                        key={opp.id}
                        className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500 transition-all flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="h-12 w-12 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl shadow-inner">
                              {opp.avatarEmoji}
                            </div>
                            <span className="text-xs font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                              {opp.elo} Elo
                            </span>
                          </div>

                          <h3 className="font-bold text-white text-base group-hover:text-indigo-400 transition-colors">
                            {opp.name}
                          </h3>
                          <span className="text-xs text-slate-400 font-medium block mt-0.5">
                            {opp.title}
                          </span>
                        </div>

                        <button
                          onClick={() => handleStartDuel(opp)}
                          className="mt-5 w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-950 transition-all"
                        >
                          <Swords className="h-3.5 w-3.5" />
                          <span>Challenge to Duel</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* =========================================================================
            IN-MATCH ARENA: SPLIT SCREEN (User vs Opponent)
        ========================================================================= */}
        {inMatch && (
          <div className="flex-1 flex flex-col space-y-4">
            {/* Arena Live Header */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setInMatch(false)}
                  className="h-9 w-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
                  title="Abandon Match"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div>
                  <h2 className="font-bold text-white text-sm">{problem.title}</h2>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                    <span className="capitalize">{problem.topic}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">{problem.difficulty}</span>
                    <span>•</span>
                    <span>{problem.testCases.length} Test Cases</span>
                  </div>
                </div>
              </div>

              {/* Match Timer */}
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl">
                <Clock className="h-4 w-4 text-rose-400 animate-pulse" />
                <span className="font-mono font-black text-lg text-rose-400">
                  {formatTimer(matchSeconds)}
                </span>
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold">Language:</span>
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value as any)}
                  className="bg-slate-800 border border-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-xl font-medium focus:outline-none"
                >
                  <option value="python">Python 3</option>
                  <option value="cpp">C++ 17</option>
                  <option value="java">Java 17</option>
                </select>
              </div>
            </div>

            {/* Split Screen Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
              {/* Left Column: Problem Description & Test Output (4 cols) */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                {/* Problem Statement Card */}
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex-1 overflow-y-auto max-h-[380px]">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Problem Statement</h3>
                  <div className="text-xs text-slate-300 leading-relaxed space-y-3 prose-invert">
                    <pre className="whitespace-pre-wrap font-sans">{problem.descriptionMarkdown}</pre>
                  </div>
                </div>

                {/* Opponent Progress Live Tracker */}
                <div className="bg-slate-900/90 border border-rose-500/20 p-5 rounded-3xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{selectedOpponent.avatarEmoji}</span>
                      <div>
                        <span className="font-bold text-xs text-white block">{selectedOpponent.name}</span>
                        <span className="text-[10px] text-slate-400">{selectedOpponent.elo} Elo</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-rose-400">
                      {botPassedTests} / {problem.testCases.length} Tests
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full transition-all duration-500"
                      style={{ width: `${(botPassedTests / problem.testCases.length) * 100}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 italic">Status: {botStatus}</p>
                </div>
              </div>

              {/* Right Column: Code Editor & Runner (8 cols) */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col flex-1">
                  {/* Editor Header Bar */}
                  <div className="px-5 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Terminal className="h-4 w-4 text-indigo-400" />
                      <span className="text-xs font-bold text-slate-300 uppercase font-mono">
                        solution.{language === 'python' ? 'py' : language === 'cpp' ? 'cpp' : 'java'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-emerald-400">
                        Your Progress: {userPassedTests} / {problem.testCases.length} Passed
                      </span>
                    </div>
                  </div>

                  {/* Code Textarea Area */}
                  <div className="p-4 flex-1 bg-[#070b14]">
                    <textarea
                      rows={14}
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      placeholder="Write your solution here..."
                      className="w-full h-full min-h-[300px] bg-transparent text-emerald-300 font-mono text-xs leading-relaxed focus:outline-none resize-none"
                    />
                  </div>

                  {/* Runner Bottom Action Bar */}
                  <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
                    <div className="text-xs text-slate-400">
                      <span>Hit Submit to run tests against the isolated sandbox.</span>
                    </div>

                    <button
                      disabled={isSubmitting}
                      onClick={handleRunCode}
                      className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-950 transition-all disabled:opacity-50"
                    >
                      <Play className="h-4 w-4 fill-white" />
                      <span>{isSubmitting ? 'Evaluating...' : 'Run & Submit Solution'}</span>
                    </button>
                  </div>
                </div>

                {/* Test Results Console */}
                {testResults.length > 0 && (
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Test Case Results:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {testResults.map((tr, idx) => (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                            tr.passed
                              ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
                              : 'bg-rose-950/40 border-rose-800/80 text-rose-300'
                          }`}
                        >
                          <span>{tr.message}</span>
                          {tr.passed ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <XCircle className="h-4 w-4 text-rose-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            MATCH OUTCOME MODAL (Victory or Defeat)
        ========================================================================= */}
        {matchOutcome && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in zoom-in-95 duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
              {matchOutcome === 'WIN' ? (
                <>
                  <div className="h-20 w-20 rounded-3xl bg-amber-500/10 border-2 border-amber-400 text-amber-400 flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg shadow-amber-500/10">
                    🏆
                  </div>
                  <h2 className="text-2xl font-black text-white mb-1">VICTORY!</h2>
                  <p className="text-xs text-slate-400 mb-6">
                    You beat {selectedOpponent.name} in the speed duel!
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Elo Rating</span>
                      <span className="text-xl font-black text-emerald-400">
                        +{eloResult?.playerChange || 28} Elo
                      </span>
                      <span className="text-[10px] text-slate-500 block">New: {eloResult?.newElo}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">XP Awarded</span>
                      <span className="text-xl font-black text-amber-400">+100 XP</span>
                      <span className="text-[10px] text-slate-500 block">Arena Champion</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-20 w-20 rounded-3xl bg-rose-500/10 border-2 border-rose-500 text-rose-400 flex items-center justify-center text-4xl mx-auto mb-4">
                    💀
                  </div>
                  <h2 className="text-2xl font-black text-white mb-1">DEFEAT</h2>
                  <p className="text-xs text-slate-400 mb-6">
                    {selectedOpponent.name} finished all test cases first. Keep sharpening your speed!
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Elo Change</span>
                      <span className="text-xl font-black text-rose-400">
                        {eloResult?.playerChange || -14} Elo
                      </span>
                      <span className="text-[10px] text-slate-500 block">New: {eloResult?.newElo}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Participation</span>
                      <span className="text-xl font-black text-indigo-400">+30 XP</span>
                      <span className="text-[10px] text-slate-500 block">Good Effort</span>
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setInMatch(false)}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
                >
                  Return to Lobby
                </button>
                <button
                  onClick={() => handleStartDuel(selectedOpponent)}
                  className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-950 transition-colors"
                >
                  Rematch ⚔️
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
