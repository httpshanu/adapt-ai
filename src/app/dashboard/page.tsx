'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Code2, 
  Compass, 
  Database, 
  Flame, 
  Hash, 
  Layers, 
  MessageSquare, 
  Play, 
  RefreshCw, 
  RotateCw, 
  ShieldCheck, 
  Sparkles, 
  Target, 
  Trophy, 
  Users, 
  Wand2, 
  Zap 
} from 'lucide-react';
import AppSidebar from '../../components/AppSidebar';
import { ActivityHeatmap } from '../../components/ActivityHeatmap';
import { useApp } from '../../context/AppContext';
import { TopicSlug } from '../../types';
import { LEAGUE_TIER_CONFIG } from '../../lib/gamificationEngine';

export default function MasteryDashboardPage() {
  const { 
    currentAccount,
    masteries, 
    currentRecommendation, 
    inventory, 
    revisionItems,
    revisionDueIds,
    streakInfo,
    activityDays,
    completeRevision,
    refreshRecommendation,
    xp,
    levelInfo,
    dailyQuizResult,
    leaderboard
  } = useApp();

  const tier = LEAGUE_TIER_CONFIG[currentAccount.league];
  const myRankEntry = leaderboard.find((e) => e.isCurrentUser) || leaderboard[0];

  const topicConfig: Record<TopicSlug, { name: string; barColor: string; iconColor: string; defaultScore: number }> = {
    arrays: { name: 'Arrays', barColor: 'bg-amber-500', iconColor: 'bg-amber-500/10 text-amber-500', defaultScore: 72 },
    strings: { name: 'Strings', barColor: 'bg-rose-500', iconColor: 'bg-rose-500/10 text-rose-500', defaultScore: 46 },
    searching: { name: 'Searching', barColor: 'bg-blue-600', iconColor: 'bg-blue-500/10 text-blue-600', defaultScore: 32 },
    hashing: { name: 'Hashing', barColor: 'bg-emerald-500', iconColor: 'bg-emerald-500/10 text-emerald-600', defaultScore: 81 },
    'two-pointers': { name: 'Two Pointers', barColor: 'bg-cyan-500', iconColor: 'bg-cyan-500/10 text-cyan-600', defaultScore: 45 },
    'linked-lists': { name: 'Linked Lists', barColor: 'bg-teal-500', iconColor: 'bg-teal-500/10 text-teal-600', defaultScore: 35 },
    'stacks-queues': { name: 'Stacks & Queues', barColor: 'bg-violet-500', iconColor: 'bg-violet-500/10 text-violet-600', defaultScore: 40 },
    trees: { name: 'Trees & BST', barColor: 'bg-green-600', iconColor: 'bg-green-500/10 text-green-600', defaultScore: 25 },
    graphs: { name: 'Graphs', barColor: 'bg-indigo-600', iconColor: 'bg-indigo-500/10 text-indigo-600', defaultScore: 20 },
    dp: { name: 'Dynamic Programming', barColor: 'bg-purple-600', iconColor: 'bg-purple-500/10 text-purple-600', defaultScore: 15 },
  };

  const topics: TopicSlug[] = [
    'arrays',
    'strings',
    'searching',
    'hashing',
    'two-pointers',
    'linked-lists',
    'stacks-queues',
    'trees',
    'graphs',
    'dp',
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Left Sidebar */}
      <AppSidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 max-w-6xl mx-auto w-full">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tier.badgeColor}`}>
                {tier.icon} {currentAccount.league} League
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Level {levelInfo.level} • {levelInfo.title}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, {currentAccount.name}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Your personalized algorithmic mastery dashboard and daily engagement hub.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={refreshRecommendation}
              title="Refresh Adaptive Recommendation"
              className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 shadow-xs transition-all"
            >
              <RotateCw className="h-4 w-4" />
            </button>

            {/* User Avatar Circle */}
            <Link 
              href="/profile" 
              className="h-11 w-11 rounded-2xl bg-indigo-600 text-white font-bold text-base flex items-center justify-center shadow-md shadow-indigo-100 hover:scale-105 transition-transform"
            >
              {currentAccount.name.charAt(0).toUpperCase()}
            </Link>
          </div>
        </div>

        {/* =========================================================================
            GAMIFICATION HERO BAR: LEVEL, XP & STREAK
        ========================================================================= */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Level & XP Progress */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs">
                    ⚡
                  </span>
                  <span>Level {levelInfo.level}: {levelInfo.title}</span>
                </div>
                <span className="text-indigo-600">{xp} Total XP</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-700" 
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>{levelInfo.currentLevelXp} XP in this level</span>
                <span>{levelInfo.nextLevelXp - levelInfo.currentLevelXp} XP to Level {levelInfo.level + 1}</span>
              </div>
            </div>

            {/* Rank & Streak Counter */}
            <div className="flex items-center justify-between md:justify-end gap-6 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 md:pl-6">
              <div className="text-center md:text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Leaderboard</span>
                <span className="text-xl font-black text-slate-900">#{myRankEntry.rank}</span>
                <span className="text-[10px] text-indigo-600 font-semibold block">{currentAccount.league}</span>
              </div>

              <div className="text-center md:text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Daily Streak</span>
                <span className="text-xl font-black text-amber-500 flex items-center gap-1">
                  🔥 {currentAccount.streak}d
                </span>
                <span className="text-[10px] text-slate-500 font-medium block">
                  Best: {currentAccount.longestStreak}d
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            3 HIGH-ENGAGEMENT ACTION CARDS (Quiz, Leaderboard, Lounge)
        ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {/* Card 1: Daily Blitz */}
          <Link
            href="/daily-quiz"
            className="group bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white p-6 rounded-3xl border border-amber-200/80 shadow-xs hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-xl shadow-sm">
                  🔥
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  {dailyQuizResult ? 'Completed Today' : '+110 XP Available'}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-amber-600 transition-colors">
                Daily DSA Blitz
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                3 quick algorithmic MCQs. Keep your streak burning and claim daily bonus points.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between text-xs font-bold text-amber-700">
              <span>{dailyQuizResult ? 'Review Today\'s Quiz' : 'Start Blitz (2 mins)'}</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Leaderboard Arena */}
          <Link
            href="/leaderboard"
            className="group bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-white p-6 rounded-3xl border border-indigo-200/80 shadow-xs hover:shadow-md hover:border-indigo-400 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl shadow-sm">
                  🏆
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                  Global Arena
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
                Arena Leaderboard
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                You are currently ranked <span className="font-bold text-indigo-600">#{myRankEntry.rank}</span>. Climb into the Top 3 to earn the Grandmaster Crown!
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-indigo-100 flex items-center justify-between text-xs font-bold text-indigo-700">
              <span>View Top Standings</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Discord Code Lounge */}
          <Link
            href="/lounge"
            className="group bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl border border-slate-700 text-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-2xl bg-indigo-500 text-white flex items-center justify-center text-xl shadow-sm">
                  💬
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  48 Online
                </span>
              </div>
              <h3 className="font-bold text-white text-base group-hover:text-indigo-300 transition-colors">
                Code Lounge (Community)
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Discord-style channels. Ask <span className="text-indigo-400 font-bold">@CodeAdaptBot</span> for algorithm hints, flex solutions, and study in lo-fi rooms.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700 flex items-center justify-between text-xs font-bold text-indigo-300">
              <span>Enter Lounge</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Recommended Next Problem Card */}
        <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm mb-8 relative overflow-hidden">
          <div className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recommended Next Problem</h3>
            </div>
            
            {/* Provenance Badge */}
            <div className="flex items-center gap-2">
              {currentRecommendation.problem.provenance === 'MANUAL' ? (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                  Verified Core Curriculum
                </span>
              ) : currentRecommendation.problem.provenance === 'PARAMETERIZED_VARIATION' ? (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-600 border border-purple-100 flex items-center gap-1">
                  <Wand2 className="h-3 w-3" />
                  Validated Parameterized Variation
                </span>
              ) : (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Validated AI Generation
                </span>
              )}
              <Link href="/catalog" className="text-xs font-semibold text-indigo-600 hover:underline">
                View all
              </Link>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <h4 className="text-xl font-bold text-slate-900">
                {currentRecommendation.problem.title}
              </h4>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 capitalize">
                  {currentRecommendation.problem.topicName}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                  {currentRecommendation.problem.difficulty}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{currentRecommendation.problem.estimatedMinutes} min</span>
                </span>
                <span className="text-xs text-amber-600 font-bold">
                  +{currentRecommendation.problem.difficulty === 'EASY' ? 50 : currentRecommendation.problem.difficulty === 'MEDIUM' ? 100 : 200} XP
                </span>
              </div>

              <p className="mt-3 text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="font-bold text-indigo-600">Why this problem: </span>
                {currentRecommendation.explanation}
              </p>
            </div>

            <Link
              href={`/problems/${currentRecommendation.problem.id}`}
              className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition-all hover:scale-105 shrink-0"
            >
              <span>Open Problem Workspace</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Spaced Repetition Due */}
        {revisionDueIds.length > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-6 sm:p-7 mb-8">
            <div className="flex items-center justify-between pb-3 border-b border-amber-500/20 mb-4">
              <div className="flex items-center gap-2.5">
                <Flame className="w-5 h-5 text-amber-600 fill-amber-500" />
                <h3 className="font-extrabold text-amber-950 text-base">
                  Spaced Repetition: {revisionDueIds.length} {revisionDueIds.length === 1 ? 'Concept' : 'Concepts'} Due for Review
                </h3>
              </div>
              <span className="text-xs font-semibold text-amber-800 bg-amber-200/60 px-2.5 py-0.5 rounded-full">
                Ebbinghaus Memory Active
              </span>
            </div>

            <p className="text-xs text-amber-900/80 mb-4 leading-relaxed">
              Based on your memory retention decay curve, solving these reinforces long-term recall and earns +30 XP bonus!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {revisionItems.filter(r => r.isDue).map((item) => (
                <div key={item.problemId} className="bg-white p-4 rounded-2xl border border-amber-200/60 flex items-center justify-between shadow-sm">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{item.problemTitle}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-600 font-semibold capitalize">
                        {item.topic}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold">
                        Stage {item.repetitionLevel + 1}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => completeRevision(item.problemId)}
                      className="text-[11px] font-semibold px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                      title="Mark as reviewed"
                    >
                      Dismiss
                    </button>
                    <Link
                      href={`/problems/${item.problemId}`}
                      className="text-[11px] font-semibold px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white shadow-sm transition-colors flex items-center gap-1"
                    >
                      <span>Review</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activity Heatmap */}
        <div className="mb-8">
          <ActivityHeatmap
            activityDays={activityDays}
            currentStreak={streakInfo.currentStreak}
            longestStreak={streakInfo.longestStreak}
            isActiveToday={streakInfo.isActiveToday}
          />
        </div>

        {/* Topic Mastery Cards */}
        <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm mb-8">
          <div className="flex items-center justify-between pb-6 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Topic Mastery & Progress</h2>
              <p className="text-xs text-slate-400 mt-0.5">Continuous rolling mastery tracking across all 10 DSA curriculum topics</p>
            </div>
            <span className="text-xs text-slate-400 font-medium">Points / 100</span>
          </div>

          <div className="divide-y divide-slate-100">
            {topics.map((topicKey) => {
              const cfg = topicConfig[topicKey];
              const score = masteries[topicKey]?.score ?? cfg.defaultScore;

              return (
                <div key={topicKey} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 w-44">
                    <div className={`h-8 w-8 rounded-xl ${cfg.iconColor} flex items-center justify-center shrink-0 font-bold text-xs`}>
                      {topicKey === 'arrays' && <Layers className="h-4 w-4" />}
                      {topicKey === 'strings' && <Code2 className="h-4 w-4" />}
                      {topicKey === 'searching' && <Compass className="h-4 w-4" />}
                      {topicKey === 'hashing' && <Hash className="h-4 w-4" />}
                      {topicKey === 'two-pointers' && <ArrowRight className="h-4 w-4" />}
                      {topicKey === 'linked-lists' && <Layers className="h-4 w-4" />}
                      {topicKey === 'stacks-queues' && <Database className="h-4 w-4" />}
                      {topicKey === 'trees' && <Target className="h-4 w-4" />}
                      {topicKey === 'graphs' && <Compass className="h-4 w-4" />}
                      {topicKey === 'dp' && <Sparkles className="h-4 w-4" />}
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-800">{cfg.name}</span>
                      <p className="text-[10px] text-slate-400 capitalize">{masteries[topicKey]?.status || 'Developing'}</p>
                    </div>
                  </div>

                  {/* Horizontal Colored Progress Bar */}
                  <div className="flex-1 mx-4">
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${cfg.barColor} transition-all duration-700`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>

                  {/* Score text */}
                  <div className="w-16 text-right font-extrabold text-sm text-slate-900">
                    {score}<span className="text-xs font-normal text-slate-400">/100</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
