import { ActivityDay, RevisionItem, TopicSlug, VerdictStatus } from '../types';

// Spaced repetition intervals in days (Ebbinghaus / SuperMemo SM-2 curve)
const INTERVAL_DAYS = [1, 3, 7, 21, 60];

export function getTodayDateString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export function addDaysToDate(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

/**
 * Calculates if a revision item is due today or overdue.
 */
export function isRevisionDue(nextDueAt: string): boolean {
  const today = getTodayDateString();
  return nextDueAt <= today;
}

/**
 * Updates a problem's spaced repetition progression upon successful solving or review.
 */
export function recordProblemRevision(
  existingItem: RevisionItem | undefined,
  problemId: string,
  problemTitle: string,
  topic: TopicSlug,
  difficulty: 'EASY' | 'MEDIUM' | 'HARD',
  wasAccepted: boolean
): RevisionItem {
  const today = getTodayDateString();

  if (!existingItem) {
    const nextInterval = wasAccepted ? INTERVAL_DAYS[1] : INTERVAL_DAYS[0];
    return {
      problemId,
      problemTitle,
      topic,
      difficulty,
      repetitionLevel: wasAccepted ? 1 : 0,
      lastSolvedAt: today,
      nextDueAt: addDaysToDate(today, nextInterval),
      isDue: false,
    };
  }

  // Advance level on acceptance, decay to 0 on failure
  let newLevel = wasAccepted ? Math.min(existingItem.repetitionLevel + 1, INTERVAL_DAYS.length - 1) : 0;
  const daysToAdd = INTERVAL_DAYS[newLevel];

  return {
    ...existingItem,
    repetitionLevel: newLevel,
    lastSolvedAt: today,
    nextDueAt: addDaysToDate(today, daysToAdd),
    isDue: false,
  };
}

/**
 * Calculates genuine calendar streaks based on UTC/Local day boundaries.
 */
export function calculateUserStreak(submissionDates: string[]): {
  currentStreak: number;
  longestStreak: number;
  isActiveToday: boolean;
} {
  if (!submissionDates || submissionDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0, isActiveToday: false };
  }

  // Normalize dates to YYYY-MM-DD and sort ascending
  const uniqueDates = Array.from(
    new Set(
      submissionDates
        .map(d => {
          try {
            return new Date(d).toISOString().split('T')[0];
          } catch {
            return d.split('T')[0];
          }
        })
        .filter(d => Boolean(d) && d.length === 10)
    )
  ).sort();

  if (uniqueDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0, isActiveToday: false };
  }

  const today = getTodayDateString();
  const yesterday = addDaysToDate(today, -1);

  const dateSet = new Set(uniqueDates);
  const isActiveToday = dateSet.has(today);

  // Compute current streak: start from today (if solved) or yesterday (if solved)
  let currentStreak = 0;
  let checkDate = isActiveToday ? today : (dateSet.has(yesterday) ? yesterday : null);

  while (checkDate && dateSet.has(checkDate)) {
    currentStreak++;
    checkDate = addDaysToDate(checkDate, -1);
  }

  // Compute longest streak
  let longestStreak = 0;
  let runningStreak = 0;
  let prevDate: string | null = null;

  for (const d of uniqueDates) {
    if (!prevDate) {
      runningStreak = 1;
    } else {
      const expectedNext = addDaysToDate(prevDate, 1);
      if (d === expectedNext) {
        runningStreak++;
      } else {
        runningStreak = 1;
      }
    }
    if (runningStreak > longestStreak) longestStreak = runningStreak;
    prevDate = d;
  }

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    isActiveToday,
  };
}

/**
 * Builds a 90-day activity matrix for the GitHub-style commit heatmap.
 */
export function buildActivityHeatmap(
  submissions: { createdAt: string; verdict: VerdictStatus }[]
): ActivityDay[] {
  const daysMap = new Map<string, { count: number; accepted: number; failed: number }>();
  const today = new Date();

  // Prepopulate 91 days (13 weeks)
  for (let i = 90; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    daysMap.set(dateStr, { count: 0, accepted: 0, failed: 0 });
  }

  for (const sub of submissions) {
    let dateStr = '';
    try {
      if (sub.createdAt.includes('-') && sub.createdAt.length >= 10) {
        dateStr = sub.createdAt.split('T')[0];
      } else {
        dateStr = getTodayDateString();
      }
    } catch {
      dateStr = getTodayDateString();
    }

    if (daysMap.has(dateStr)) {
      const entry = daysMap.get(dateStr)!;
      entry.count++;
      if (sub.verdict === 'ACCEPTED') entry.accepted++;
      else entry.failed++;
    }
  }

  return Array.from(daysMap.entries()).map(([date, data]) => ({
    date,
    count: data.count,
    accepted: data.accepted,
    failed: data.failed,
  }));
}
