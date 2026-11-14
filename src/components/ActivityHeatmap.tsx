'use client';

import React, { useState } from 'react';
import { ActivityDay } from '../types';
import { Flame, Trophy, Calendar, CheckCircle2 } from 'lucide-react';

interface ActivityHeatmapProps {
  activityDays: ActivityDay[];
  currentStreak: number;
  longestStreak: number;
  isActiveToday: boolean;
}

export function ActivityHeatmap({
  activityDays,
  currentStreak,
  longestStreak,
  isActiveToday,
}: ActivityHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<ActivityDay | null>(null);

  // Group days into columns of 7 days (Sunday - Saturday)
  const columns: ActivityDay[][] = [];
  let currentWeek: ActivityDay[] = [];

  activityDays.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === activityDays.length - 1) {
      columns.push(currentWeek);
      currentWeek = [];
    }
  });

  const getColorClass = (count: number) => {
    if (count === 0) return 'bg-slate-100 hover:bg-slate-200 border-slate-200/50';
    if (count <= 2) return 'bg-emerald-300 hover:bg-emerald-400 border-emerald-400/50';
    if (count <= 4) return 'bg-emerald-500 hover:bg-emerald-600 border-emerald-600/50';
    return 'bg-emerald-700 hover:bg-emerald-800 border-emerald-800/50';
  };

  const totalSubmissions = activityDays.reduce((acc, d) => acc + d.count, 0);
  const totalAccepted = activityDays.reduce((acc, d) => acc + d.accepted, 0);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-xl shadow-slate-200/40">
      {/* Top Stats Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">
              Consistency & Activity Matrix
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time UTC activity tracking across the last 90 practice days
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Current Streak Badge */}
          <div className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border ${
            isActiveToday
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-700'
              : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            <Flame className={`w-5 h-5 ${isActiveToday ? 'text-amber-500 fill-amber-500 animate-pulse' : 'text-slate-400'}`} />
            <div>
              <div className="text-xs font-semibold leading-none">
                {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'} Streak
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {isActiveToday ? 'Active Today' : 'Practice to extend'}
              </div>
            </div>
          </div>

          {/* Longest Streak Badge */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl border bg-indigo-50/70 border-indigo-200/60 text-indigo-800">
            <Trophy className="w-4 h-4 text-indigo-600" />
            <div>
              <div className="text-xs font-semibold leading-none">
                Best: {longestStreak} {longestStreak === 1 ? 'Day' : 'Days'}
              </div>
              <div className="text-[10px] text-indigo-600/80 mt-0.5">
                {totalAccepted} Accepted
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-start gap-1.5 min-w-[620px]">
          {/* Weekday indicators */}
          <div className="flex flex-col gap-1.5 pr-2 text-[10px] text-slate-400 font-medium">
            <span className="h-3 leading-3">Mon</span>
            <span className="h-3 leading-3 opacity-0">Tue</span>
            <span className="h-3 leading-3">Wed</span>
            <span className="h-3 leading-3 opacity-0">Thu</span>
            <span className="h-3 leading-3">Fri</span>
            <span className="h-3 leading-3 opacity-0">Sat</span>
            <span className="h-3 leading-3">Sun</span>
          </div>

          {/* Grid columns */}
          {columns.map((week, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-1.5">
              {week.map((day) => (
                <div
                  key={day.date}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className={`w-3.5 h-3.5 rounded-[4px] border transition-all cursor-pointer ${getColorClass(
                    day.count
                  )}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Tooltip & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
        <div>
          {hoveredDay ? (
            <span className="font-semibold text-slate-800">
              📅 {hoveredDay.date}:{' '}
              <span className="text-emerald-700">
                {hoveredDay.count} {hoveredDay.count === 1 ? 'submission' : 'submissions'}
              </span>{' '}
              ({hoveredDay.accepted} passed)
            </span>
          ) : (
            <span>
              Total: <strong className="text-slate-800">{totalSubmissions} attempts</strong> ({totalAccepted} accepted) in past 90 days
            </span>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <span>Less</span>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-[2px] bg-slate-100 border border-slate-200/50" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-300" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-700" />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
