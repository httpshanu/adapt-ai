import { LeaderboardEntry, LeagueTier, UserAccount } from '../types';

export const LEAGUE_TIER_CONFIG: Record<
  LeagueTier,
  { name: LeagueTier; minXp: number; badgeColor: string; bgGradient: string; icon: string }
> = {
  Bronze: {
    name: 'Bronze',
    minXp: 0,
    badgeColor: 'text-amber-700 bg-amber-50 border-amber-200',
    bgGradient: 'from-amber-600 to-amber-800',
    icon: '🥉',
  },
  Silver: {
    name: 'Silver',
    minXp: 300,
    badgeColor: 'text-slate-700 bg-slate-100 border-slate-300',
    bgGradient: 'from-slate-400 to-slate-600',
    icon: '🥈',
  },
  Gold: {
    name: 'Gold',
    minXp: 800,
    badgeColor: 'text-yellow-700 bg-yellow-50 border-yellow-300',
    bgGradient: 'from-amber-400 to-yellow-500',
    icon: '🥇',
  },
  Diamond: {
    name: 'Diamond',
    minXp: 1500,
    badgeColor: 'text-cyan-700 bg-cyan-50 border-cyan-300',
    bgGradient: 'from-cyan-500 to-blue-600',
    icon: '💎',
  },
  Grandmaster: {
    name: 'Grandmaster',
    minXp: 3000,
    badgeColor: 'text-purple-700 bg-purple-50 border-purple-300',
    bgGradient: 'from-purple-600 to-pink-600',
    icon: '👑',
  },
};

export function getLeagueTier(xp: number): LeagueTier {
  if (xp >= 3000) return 'Grandmaster';
  if (xp >= 1500) return 'Diamond';
  if (xp >= 800) return 'Gold';
  if (xp >= 300) return 'Silver';
  return 'Bronze';
}

export function calculateLevel(xp: number): {
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
  title: string;
} {
  // 100 XP per level with scaling
  const level = Math.floor(Math.sqrt(xp / 30)) + 1;
  const currentLevelBase = Math.pow(level - 1, 2) * 30;
  const nextLevelBase = Math.pow(level, 2) * 30;
  const xpInCurrentLevel = Math.max(0, xp - currentLevelBase);
  const xpNeededForNext = Math.max(1, nextLevelBase - currentLevelBase);
  const progressPercent = Math.min(100, Math.round((xpInCurrentLevel / xpNeededForNext) * 100));

  const TITLES = [
    'Algorithm Novice',
    'Syntax Explorer',
    'Array Apprentice',
    'Pointer Navigator',
    'Recursion Seeker',
    'Tree Climber',
    'Graph Traverser',
    'Dynamic Strategist',
    'Algorithm Knight',
    'Binary Wizard',
    'Grand Grandmaster',
  ];
  const title = TITLES[Math.min(level - 1, TITLES.length - 1)];

  return {
    level,
    currentLevelXp: xpInCurrentLevel,
    nextLevelXp: xpNeededForNext,
    progressPercent,
    title,
  };
}

export function calculateSolveXp(
  difficulty: 'EASY' | 'MEDIUM' | 'HARD',
  streak: number,
  isFirstSolve: boolean = true
): { base: number; multiplier: number; total: number } {
  let base = 50;
  if (difficulty === 'MEDIUM') base = 100;
  if (difficulty === 'HARD') base = 200;

  if (!isFirstSolve) {
    base = Math.round(base * 0.25); // Practice repeat
  }

  let multiplier = 1.0;
  if (streak >= 14) multiplier = 1.5;
  else if (streak >= 7) multiplier = 1.3;
  else if (streak >= 3) multiplier = 1.15;

  const total = Math.round(base * multiplier);
  return { base, multiplier, total };
}

export function generatePlayerUid(seed?: string): string {
  if (seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    const num = Math.abs(hash % 9000) + 1000;
    return `CA-${num}`;
  }
  return `CA-${Math.floor(1000 + Math.random() * 9000)}`;
}

// Active Simulated Peer Learners on the Platform
export const MOCK_COMMUNITY_PEERS: Omit<LeaderboardEntry, 'rank'>[] = [
  {
    userId: 'peer_1',
    uid: 'CA-4096',
    name: 'Dev Khurana',
    avatar: 'dev_pro',
    league: 'Diamond',
    xp: 2240,
    solvedCount: 36,
    streak: 15,
    trend: 'up',
    trendValue: 2,
    badge: 'Code Ninja',
  },
  {
    userId: 'peer_2',
    uid: 'CA-5120',
    name: 'Aarav Sharma',
    avatar: 'aarav',
    league: 'Diamond',
    xp: 1780,
    solvedCount: 29,
    streak: 11,
    trend: 'same',
    badge: 'Speed Demon',
  },
  {
    userId: 'peer_3',
    uid: 'CA-6310',
    name: 'Ananya Roy',
    avatar: 'ananya',
    league: 'Gold',
    xp: 1420,
    solvedCount: 24,
    streak: 8,
    trend: 'up',
    trendValue: 1,
    badge: 'Algorithm Ace',
  },
  {
    userId: 'peer_4',
    uid: 'CA-7042',
    name: 'Rohan Mehta',
    avatar: 'rohan',
    league: 'Gold',
    xp: 990,
    solvedCount: 16,
    streak: 6,
    trend: 'down',
    trendValue: 1,
    badge: 'Consistent',
  },
  {
    userId: 'peer_5',
    uid: 'CA-3109',
    name: 'Priya Patel',
    avatar: 'priya',
    league: 'Silver',
    xp: 750,
    solvedCount: 12,
    streak: 4,
    trend: 'up',
    trendValue: 3,
    badge: 'Fast Learner',
  },
  {
    userId: 'peer_6',
    uid: 'CA-8294',
    name: 'Kabir Verma',
    avatar: 'kabir',
    league: 'Silver',
    xp: 480,
    solvedCount: 8,
    streak: 3,
    trend: 'same',
    badge: 'Rising Star',
  },
  {
    userId: 'peer_7',
    uid: 'CA-9103',
    name: 'Ishaan Joshi',
    avatar: 'ishaan',
    league: 'Bronze',
    xp: 260,
    solvedCount: 4,
    streak: 2,
    trend: 'new',
    badge: 'First Steps',
  },
  {
    userId: 'peer_8',
    uid: 'CA-1158',
    name: 'Sneha Rao',
    avatar: 'sneha',
    league: 'Bronze',
    xp: 140,
    solvedCount: 2,
    streak: 1,
    trend: 'same',
    badge: 'Explorer',
  },
];

export function buildLeaderboard(
  currentUser: UserAccount,
  timeframe: 'weekly' | 'all-time' = 'all-time'
): LeaderboardEntry[] {
  const currentEntry: Omit<LeaderboardEntry, 'rank'> = {
    userId: currentUser.id,
    uid: currentUser.uid || generatePlayerUid(currentUser.id),
    name: currentUser.name,
    avatar: currentUser.avatar,
    league: currentUser.league,
    xp: timeframe === 'weekly' ? Math.round(currentUser.xp * 0.45) : currentUser.xp,
    solvedCount: currentUser.solvedCount,
    streak: currentUser.streak,
    trend: 'up',
    trendValue: 1,
    badge: currentUser.badges[0] || 'Apprentice',
    isCurrentUser: true,
  };

  const peerList = MOCK_COMMUNITY_PEERS.map((p) => ({
    ...p,
    xp: timeframe === 'weekly' ? Math.round(p.xp * 0.4) : p.xp,
  }));

  const all = [...peerList, currentEntry];
  all.sort((a, b) => b.xp - a.xp);

  return all.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
}
