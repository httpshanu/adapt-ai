'use client';

import React, { useState } from 'react';
import AppSidebar from '../../components/AppSidebar';
import { useApp } from '../../context/AppContext';
import { 
  ArrowDown, 
  ArrowUp, 
  Check,
  Copy,
  Crown, 
  Flame, 
  Hash,
  Info, 
  Minus, 
  Search, 
  Sparkles, 
  Trophy, 
  Users, 
  Zap 
} from 'lucide-react';
import { LEAGUE_TIER_CONFIG, buildLeaderboard } from '../../lib/gamificationEngine';

export default function LeaderboardPage() {
  const { currentAccount } = useApp();
  const [timeframe, setTimeframe] = useState<'weekly' | 'all-time'>('all-time');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedUid, setCopiedUid] = useState<string | null>(null);

  const copyToClipboard = (uid: string) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(uid);
      setCopiedUid(uid);
      setTimeout(() => setCopiedUid(null), 2000);
    }
  };

  const leaderboardData = buildLeaderboard(currentAccount, timeframe);

  const filteredData = leaderboardData.filter((entry) =>
    entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (entry.uid && entry.uid.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const top3 = leaderboardData.slice(0, 3);
  const userRankEntry = leaderboardData.find((e) => e.isCurrentUser);

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <AppSidebar />

      <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
        {/* Page Title & Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                Global Rankings
              </span>
              <span className="text-xs text-slate-500 font-medium">Updated live</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>CodeAdapt Arena Leaderboard</span>
              <Trophy className="h-7 w-7 text-amber-500" />
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Compete with students worldwide. Solve problems, ace daily quizzes, and climb to Grandmaster!
            </p>
          </div>

          {/* Timeframe Switcher Tabs */}
          <div className="flex items-center bg-white border border-slate-200 p-1 rounded-2xl shadow-xs self-start md:self-auto">
            <button
              onClick={() => setTimeframe('weekly')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                timeframe === 'weekly'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Weekly Sprint ⚡
            </button>
            <button
              onClick={() => setTimeframe('all-time')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                timeframe === 'all-time'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All-Time Legends 👑
            </button>
          </div>
        </div>

        {/* Top 3 Podium Cards */}
        {top3.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 items-end">
            {/* 2nd Place */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col items-center text-center relative order-2 md:order-1 pt-10">
              <div className="absolute -top-6 h-12 w-12 rounded-2xl bg-gradient-to-tr from-slate-300 to-slate-500 text-white flex items-center justify-center font-bold text-xl shadow-md border-2 border-white">
                2
              </div>
              <div className="h-16 w-16 rounded-2xl bg-slate-700 text-white flex items-center justify-center text-2xl font-bold shadow-md mb-2">
                🥈
              </div>
              <h3 className="font-bold text-slate-900 text-base">{top3[1].name}</h3>
              
              {/* UID Tag */}
              <button
                onClick={() => copyToClipboard(top3[1].uid)}
                title="Click to copy UID"
                className="mt-1 mb-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200/80 text-[11px] font-mono font-bold text-slate-700 transition-colors"
              >
                <span>#{top3[1].uid}</span>
                {copiedUid === top3[1].uid ? (
                  <Check className="h-3 w-3 text-emerald-600" />
                ) : (
                  <Copy className="h-3 w-3 text-slate-400" />
                )}
              </button>

              <span className="text-xs text-slate-500 font-medium mb-3">{top3[1].badge}</span>

              <div className="w-full bg-slate-50 rounded-2xl p-3 border border-slate-100 flex justify-around text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Points</span>
                  <span className="font-extrabold text-indigo-600 text-sm">{top3[1].xp} XP</span>
                </div>
                <div className="border-r border-slate-200" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Solved</span>
                  <span className="font-bold text-slate-800 text-sm">{top3[1].solvedCount}</span>
                </div>
                <div className="border-r border-slate-200" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Streak</span>
                  <span className="font-bold text-amber-600 text-sm">🔥 {top3[1].streak}d</span>
                </div>
              </div>
            </div>

            {/* 1st Place (Crown) */}
            <div className="bg-gradient-to-b from-amber-500/10 to-white rounded-3xl p-6 border-2 border-amber-300 shadow-xl flex flex-col items-center text-center relative order-1 md:order-2 pt-12 md:-translate-y-4">
              <div className="absolute -top-7 h-14 w-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-white flex items-center justify-center font-extrabold text-2xl shadow-lg border-2 border-white">
                <Crown className="h-7 w-7 text-yellow-100 fill-yellow-100" />
              </div>
              <div className="h-20 w-20 rounded-3xl bg-amber-500 text-white flex items-center justify-center text-3xl font-bold shadow-lg mb-2 ring-4 ring-amber-100">
                👑
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 mb-1 border border-amber-300">
                Current Champion
              </span>
              <h3 className="font-extrabold text-slate-900 text-lg">{top3[0].name}</h3>
              
              {/* UID Tag */}
              <button
                onClick={() => copyToClipboard(top3[0].uid)}
                title="Click to copy UID"
                className="mt-1 mb-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-100/70 hover:bg-amber-200/80 border border-amber-200 text-xs font-mono font-bold text-amber-900 transition-colors"
              >
                <span>#{top3[0].uid}</span>
                {copiedUid === top3[0].uid ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-amber-600" />
                )}
              </button>

              <span className="text-xs text-amber-700 font-semibold mb-3">{top3[0].badge}</span>

              <div className="w-full bg-white rounded-2xl p-3.5 border border-amber-200 shadow-xs flex justify-around text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Points</span>
                  <span className="font-extrabold text-amber-600 text-base">{top3[0].xp} XP</span>
                </div>
                <div className="border-r border-slate-100" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Solved</span>
                  <span className="font-bold text-slate-800 text-base">{top3[0].solvedCount}</span>
                </div>
                <div className="border-r border-slate-100" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Streak</span>
                  <span className="font-bold text-amber-600 text-base">🔥 {top3[0].streak}d</span>
                </div>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col items-center text-center relative order-3 pt-10">
              <div className="absolute -top-6 h-12 w-12 rounded-2xl bg-gradient-to-tr from-amber-700 to-amber-900 text-white flex items-center justify-center font-bold text-xl shadow-md border-2 border-white">
                3
              </div>
              <div className="h-16 w-16 rounded-2xl bg-amber-800 text-white flex items-center justify-center text-2xl font-bold shadow-md mb-2">
                🥉
              </div>
              <h3 className="font-bold text-slate-900 text-base">{top3[2].name}</h3>
              
              {/* UID Tag */}
              <button
                onClick={() => copyToClipboard(top3[2].uid)}
                title="Click to copy UID"
                className="mt-1 mb-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200/80 text-[11px] font-mono font-bold text-slate-700 transition-colors"
              >
                <span>#{top3[2].uid}</span>
                {copiedUid === top3[2].uid ? (
                  <Check className="h-3 w-3 text-emerald-600" />
                ) : (
                  <Copy className="h-3 w-3 text-slate-400" />
                )}
              </button>

              <span className="text-xs text-slate-500 font-medium mb-3">{top3[2].badge}</span>

              <div className="w-full bg-slate-50 rounded-2xl p-3 border border-slate-100 flex justify-around text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Points</span>
                  <span className="font-extrabold text-indigo-600 text-sm">{top3[2].xp} XP</span>
                </div>
                <div className="border-r border-slate-200" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Solved</span>
                  <span className="font-bold text-slate-800 text-sm">{top3[2].solvedCount}</span>
                </div>
                <div className="border-r border-slate-200" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Streak</span>
                  <span className="font-bold text-amber-600 text-sm">🔥 {top3[2].streak}d</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Current User Position Sticky Banner */}
        {userRankEntry && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-extrabold text-xl">
                #{userRankEntry.rank}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base">Your Active Standing</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 font-medium">
                    {userRankEntry.league} Tier
                  </span>
                  {/* Current User UID Badge with Copy */}
                  <button
                    onClick={() => copyToClipboard(userRankEntry.uid)}
                    title="Click to copy your Player UID"
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/25 hover:bg-white/35 text-xs font-mono font-bold text-white transition-colors border border-white/30"
                  >
                    <span>UID: #{userRankEntry.uid}</span>
                    {copiedUid === userRankEntry.uid ? (
                      <Check className="h-3 w-3 text-emerald-300" />
                    ) : (
                      <Copy className="h-3 w-3 text-white/70" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-indigo-100 mt-0.5">
                  You have <span className="font-bold text-white">{userRankEntry.xp} XP</span> and a{' '}
                  <span className="font-bold text-amber-300">🔥 {userRankEntry.streak}-day streak</span>!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs font-medium text-indigo-100">
                Solve a problem or take the Daily Quiz to climb higher!
              </span>
            </div>
          </div>
        )}

        {/* Table Filter & Search */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-600" />
              <h2 className="font-bold text-slate-900 text-base">All Competitors</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {filteredData.length} students
              </span>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search name or UID (e.g. CA-1001)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Rank</th>
                  <th className="py-3.5 px-6">Student & Player UID</th>
                  <th className="py-3.5 px-6">League Tier</th>
                  <th className="py-3.5 px-6">Problems Solved</th>
                  <th className="py-3.5 px-6">Daily Streak</th>
                  <th className="py-3.5 px-6 text-right">Total XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((row) => {
                  const tier = LEAGUE_TIER_CONFIG[row.league];
                  return (
                    <tr
                      key={row.userId}
                      className={`transition-colors ${
                        row.isCurrentUser
                          ? 'bg-indigo-50/50 font-semibold'
                          : 'hover:bg-slate-50/70'
                      }`}
                    >
                      {/* Rank */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono font-bold text-sm ${
                              row.rank === 1
                                ? 'text-amber-500'
                                : row.rank === 2
                                ? 'text-slate-500'
                                : row.rank === 3
                                ? 'text-amber-800'
                                : 'text-slate-700'
                            }`}
                          >
                            #{row.rank}
                          </span>
                          {row.trend === 'up' && (
                            <span className="text-[10px] text-emerald-600 font-bold flex items-center">
                              <ArrowUp className="h-3 w-3" /> {row.trendValue || 1}
                            </span>
                          )}
                          {row.trend === 'down' && (
                            <span className="text-[10px] text-rose-500 font-bold flex items-center">
                              <ArrowDown className="h-3 w-3" /> {row.trendValue || 1}
                            </span>
                          )}
                          {row.trend === 'new' && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-indigo-100 text-indigo-700 font-bold">
                              NEW
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Name, UID & Badge */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                            {row.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm">{row.name}</span>
                              {row.isCurrentUser && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-indigo-600 text-white">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              {/* Player UID badge with one-click copy */}
                              <button
                                onClick={() => copyToClipboard(row.uid)}
                                title="Click to copy UID"
                                className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 px-1.5 py-0.5 rounded transition-colors"
                              >
                                <span>#{row.uid}</span>
                                {copiedUid === row.uid ? (
                                  <Check className="h-2.5 w-2.5 text-emerald-600" />
                                ) : (
                                  <Copy className="h-2.5 w-2.5 text-indigo-400" />
                                )}
                              </button>
                              <span className="text-xs text-slate-300">·</span>
                              <span className="text-xs text-slate-500">{row.badge}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* League */}
                      <td className="py-4 px-6">
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${tier.badgeColor}`}
                        >
                          {tier.icon} {row.league}
                        </span>
                      </td>

                      {/* Solved */}
                      <td className="py-4 px-6 text-slate-700 font-medium">
                        {row.solvedCount} problems
                      </td>

                      {/* Streak */}
                      <td className="py-4 px-6 font-semibold text-amber-600">
                        🔥 {row.streak} days
                      </td>

                      {/* XP */}
                      <td className="py-4 px-6 text-right font-extrabold text-indigo-600 text-base">
                        {row.xp.toLocaleString()} XP
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
