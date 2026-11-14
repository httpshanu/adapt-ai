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
  Play, 
  RefreshCw, 
  RotateCw, 
  ShieldCheck, 
  Sparkles, 
  Target, 
  Wand2 
} from 'lucide-react';
import AppSidebar from '../../components/AppSidebar';
import { ActivityHeatmap } from '../../components/ActivityHeatmap';
import { useApp } from '../../context/AppContext';
import { TopicSlug } from '../../types';

export default function MasteryDashboardPage() {
  const { 
    userName, 
    masteries, 
    currentRecommendation, 
    inventory, 
    revisionItems,
    revisionDueIds,
    streakInfo,
    activityDays,
    completeRevision,
    refreshRecommendation,
    resetAllData 
  } = useApp();

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
      <main className="flex-1 p-8 sm:p-10 max-w-6xl">
        {/* Top Header Row with Avatar 'S' */}
        <div className="flex items-center justify-between pb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, {userName}!
            </h1>
            <p className="text-sm text-slate-500 mt-1">Here&apos;s your DSA learning overview and question bank health.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={refreshRecommendation}
              title="Refresh Adaptive Recommendation"
              className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-all"
            >
              <RotateCw className="h-4 w-4" />
            </button>

            {/* User Avatar Circle */}
            <Link href="/profile" className="h-11 w-11 rounded-full bg-indigo-600 text-white font-bold text-base flex items-center justify-center shadow-md shadow-indigo-200 hover:scale-105 transition-transform">
              {userName ? userName.charAt(0).toUpperCase() : 'S'}
            </Link>
          </div>
        </div>

        {/* =========================================================================
            QUESTION BANK INVENTORY & EXHAUSTION-PROOF INDICATOR (Requirement 9)
        ========================================================================= */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-indigo-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Adaptive Question Bank Health</h2>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              <ShieldCheck className="h-3.5 w-3.5" />
              Exhaustion-Proof Active
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Available Questions */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Available Questions</span>
                <Layers className="h-4 w-4 text-slate-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-slate-900">{inventory.totalAvailable}</span>
                <span className="text-[11px] text-slate-400 font-medium">({inventory.totalCoreVerified} verified core)</span>
              </div>
            </div>

            {/* 2. Solved Questions */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Solved Questions</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-slate-900">{inventory.totalSolved}</span>
                <span className="text-[11px] text-slate-400 font-medium">completed</span>
              </div>
            </div>

            {/* 3. Revision-Due Questions */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                <span>Revision-Due</span>
                <Flame className="h-4 w-4 text-amber-500" />
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-slate-900">{inventory.revisionDueCount}</span>
                <span className="text-[11px] text-slate-400 font-medium">spaced review</span>
              </div>
            </div>

            {/* 4. Validated Generated Questions */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm bg-gradient-to-br from-white to-indigo-50/30">
              <div className="flex items-center justify-between text-indigo-600 text-xs font-bold">
                <span className="flex items-center gap-1">
                  <Wand2 className="h-3.5 w-3.5" />
                  Validated Generated
                </span>
                <span className="h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-indigo-900">{inventory.totalGeneratedValidated}</span>
                <span className="text-[11px] text-indigo-600 font-medium">sandbox verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Next Problem Card */}
        <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm mb-8 relative overflow-hidden">
          <div className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recommended next problem</h3>
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
                <span className="text-xs text-slate-400">
                  Tier {currentRecommendation.tier} Resolution
                </span>
              </div>

              <p className="mt-3 text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="font-bold text-indigo-600">Why this problem: </span>
                {currentRecommendation.explanation}
              </p>
            </div>

            <Link
              href={`/problems/${currentRecommendation.problem.id}`}
              className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition-all hover:scale-105 shrink-0"
            >
              <span>Open problem workspace</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* =========================================================================
            SPACED REPETITION & REVISION QUEUE (PRD Epic 9)
        ========================================================================= */}
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
                Ebbinghaus SM-2 Active
              </span>
            </div>

            <p className="text-xs text-amber-900/80 mb-4 leading-relaxed">
              Based on your mastery memory decay curves, practicing these problems today reinforces long-term retention before your next difficulty level.
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

        {/* =========================================================================
            GENUINE ACTIVITY HEATMAP MATRIX
        ========================================================================= */}
        <div className="mb-8">
          <ActivityHeatmap
            activityDays={activityDays}
            currentStreak={streakInfo.currentStreak}
            longestStreak={streakInfo.longestStreak}
            isActiveToday={streakInfo.isActiveToday}
          />
        </div>

        {/* Middle Section: Topic Mastery Cards */}
        <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm mb-8">
          <div className="flex items-center justify-between pb-6 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Topic Mastery & Progress</h2>
              <p className="text-xs text-slate-400 mt-0.5">Continuous rolling updates across all 10 DSA curriculum topics</p>
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
