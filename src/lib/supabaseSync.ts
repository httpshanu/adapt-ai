import { supabase, isSupabaseConfigured } from './supabaseClient';
import { UserAccount, Submission, DailyQuizResult, ChatMessage, LeaderboardEntry } from '../types';

/**
 * Syncs user profile state to Supabase PostgreSQL User table
 */
export async function syncUserToSupabase(account: UserAccount): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    const { error } = await supabase.from('User').upsert(
      {
        id: account.id,
        uid: account.uid,
        name: account.name,
        email: account.email,
        avatar: account.avatar,
        role: account.role,
        level: account.level,
        xp: account.xp,
        streak: account.streak,
        longestStreak: account.longestStreak,
        league: account.league,
        badges: account.badges,
        solvedCount: account.solvedCount,
        diagnosticCompleted: account.diagnosticCompleted,
        eloRating: account.eloRating || 1200,
        duelWins: account.duelWins || 0,
        duelLosses: account.duelLosses || 0,
        bugsFixed: account.bugsFixed || 0,
        updatedAt: new Date().toISOString(),
      },
      { onConflict: 'uid' }
    );

    if (error) {
      console.warn('Supabase syncUser error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase syncUser failed:', err);
    return false;
  }
}

/**
 * Saves a code submission to Supabase
 */
export async function syncSubmissionToSupabase(
  userId: string,
  submission: Submission
): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    const { error } = await supabase.from('Submission').insert({
      id: submission.id,
      userId,
      problemId: submission.problemId,
      problemTitle: submission.problemTitle,
      topic: submission.topic,
      code: submission.code,
      language: 'python',
      verdict: submission.verdict,
      passedTests: submission.passedTests,
      totalTests: submission.totalTests,
      runtimeMs: submission.runtimeMs,
      memoryMb: submission.memoryMb,
      hintsUsed: submission.hintsUsed,
      createdAt: submission.createdAt || new Date().toISOString(),
    });

    if (error) {
      console.warn('Supabase syncSubmission error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase syncSubmission failed:', err);
    return false;
  }
}

/**
 * Saves a daily quiz result to Supabase
 */
export async function syncQuizToSupabase(
  userId: string,
  result: DailyQuizResult
): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    const { error } = await supabase.from('DailyQuizResult').upsert(
      {
        userId,
        date: result.date,
        score: result.score,
        total: result.total,
        xpEarned: result.xpEarned,
        completedAt: result.completedAt || new Date().toISOString(),
      },
      { onConflict: 'userId,date' }
    );

    if (error) {
      console.warn('Supabase syncQuiz error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase syncQuiz failed:', err);
    return false;
  }
}

/**
 * Fetches global live rankings from Supabase PostgreSQL
 */
export async function fetchLiveLeaderboardFromSupabase(): Promise<LeaderboardEntry[] | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const { data, error } = await supabase
      .from('User')
      .select('id, uid, name, avatar, league, xp, solvedCount, streak, badges')
      .order('xp', { ascending: false })
      .limit(50);

    if (error || !data || data.length === 0) return null;

    return data.map((u, idx) => ({
      rank: idx + 1,
      userId: u.id,
      uid: u.uid,
      name: u.name,
      avatar: u.avatar || 'sanidhya',
      league: (u.league as any) || 'Bronze',
      xp: u.xp || 0,
      solvedCount: u.solvedCount || 0,
      streak: u.streak || 0,
      trend: 'same',
      badge: Array.isArray(u.badges) && u.badges[0] ? u.badges[0] : 'Apprentice',
    }));
  } catch (err) {
    console.warn('Supabase fetchLeaderboard failed:', err);
    return null;
  }
}
