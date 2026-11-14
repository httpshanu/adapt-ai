'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { INITIAL_PROBLEMS } from '../lib/problemsData';
import { calculateNewMastery, getMasteryStatus } from '../lib/adaptiveEngine';
import { QuestionBankRepository } from '../lib/questionBankRepository';
import { selectAdaptiveProblem } from '../lib/questionSelector';
import { 
  ActivityDay,
  ChatMessage,
  DailyQuizResult,
  ExecutionJobResult,
  LeaderboardEntry,
  Problem, 
  QuestionBankInventory, 
  Recommendation, 
  RevisionItem,
  Submission, 
  TopicMastery, 
  TopicSlug, 
  UserAccount, 
  VerdictStatus 
} from '../types';
import { 
  buildActivityHeatmap, 
  calculateUserStreak, 
  getTodayDateString, 
  isRevisionDue, 
  recordProblemRevision 
} from '../lib/spacedRepetition';
import { 
  buildLeaderboard, 
  calculateLevel, 
  calculateSolveXp, 
  getLeagueTier 
} from '../lib/gamificationEngine';
import { 
  INITIAL_CHANNEL_MESSAGES, 
  generateBotResponse 
} from '../lib/communityData';
import { getTodayDateKey } from '../lib/dailyQuizData';
import { calculateEloChange } from '../lib/duelEngine';

export interface AppContextType {
  // Account Management
  accounts: UserAccount[];
  currentAccount: UserAccount;
  switchAccount: (accountId: string) => void;
  createAccount: (name: string, email: string, avatar: string, role?: 'student' | 'competitive' | 'mentor') => void;
  deleteAccount: (accountId: string) => void;
  userName: string;
  setUserName: (name: string) => void;

  // Gamification & Progression
  xp: number;
  addXp: (amount: number) => void;
  levelInfo: ReturnType<typeof calculateLevel>;
  leaderboard: LeaderboardEntry[];

  // Daily Quiz
  dailyQuizResult: DailyQuizResult | null;
  completeDailyQuiz: (score: number, total: number, xpEarned: number) => void;

  // Community Lounge
  channelMessages: Record<string, ChatMessage[]>;
  sendChatMessage: (channelId: string, content: string, codeSnippet?: { language: string; code: string }) => void;
  toggleReaction: (channelId: string, messageId: string, emoji: string) => void;

  // 1v1 Arena & Debugger Blitz
  recordDuelOutcome: (won: boolean, opponentElo: number) => { playerChange: number; newElo: number };
  recordBugFixed: (challengeId: string, xpEarned: number) => void;

  // Core Learning Engine
  diagnosticCompleted: boolean;
  completeDiagnostic: (baselines: Record<TopicSlug, number>) => void;
  masteries: Record<TopicSlug, TopicMastery>;
  solvedProblemIds: string[];
  submissions: Submission[];
  currentRecommendation: Recommendation;
  inventory: QuestionBankInventory;
  revisionItems: RevisionItem[];
  revisionDueIds: string[];
  streakInfo: { currentStreak: number; longestStreak: number; isActiveToday: boolean };
  activityDays: ActivityDay[];
  evaluateSolution: (
    problem: Problem,
    code: string,
    language: 'python' | 'cpp' | 'java',
    hintsUsed: number,
    timeSpentSeconds?: number
  ) => Promise<{ result: ExecutionJobResult; newMasteryScore: number; delta: number; nextRec: Recommendation }>;
  recordSubmission: (
    problem: Problem,
    code: string,
    verdict: VerdictStatus,
    passedTests: number,
    totalTests: number,
    runtimeMs: number,
    hintsUsed: number
  ) => Promise<{ newMasteryScore: number; delta: number; nextRec: Recommendation }>;
  completeRevision: (problemId: string) => void;
  refreshRecommendation: () => Promise<void>;
  resetAllData: () => void;
}

export const INITIAL_DEMO_ACCOUNTS: UserAccount[] = [
  {
    id: 'acc_sanidhya',
    name: 'Sanidhya Uniyal',
    email: 'sanidhya@codeadapt.ai',
    avatar: 'sanidhya',
    role: 'competitive',
    level: 5,
    xp: 920,
    streak: 3,
    longestStreak: 7,
    league: 'Gold',
    badges: ['Array Master', 'Quiz Blitz', 'Night Owl'],
    solvedCount: 8,
    diagnosticCompleted: true,
    createdAt: '2026-11-01T10:00:00Z',
    eloRating: 1420,
    duelWins: 8,
    duelLosses: 2,
    bugsFixed: 11,
  },
  {
    id: 'acc_arjun',
    name: 'Arjun Sharma',
    email: 'arjun.prep@codeadapt.ai',
    avatar: 'aarav',
    role: 'student',
    level: 4,
    xp: 850,
    streak: 4,
    longestStreak: 6,
    league: 'Gold',
    badges: ['Consistent', 'Fast Learner'],
    solvedCount: 12,
    diagnosticCompleted: true,
    createdAt: '2026-11-03T11:00:00Z',
    eloRating: 1380,
    duelWins: 6,
    duelLosses: 3,
    bugsFixed: 9,
  },
  {
    id: 'acc_riya',
    name: 'Riya Patel',
    email: 'riya.learns@codeadapt.ai',
    avatar: 'priya',
    role: 'student',
    level: 2,
    xp: 420,
    streak: 2,
    longestStreak: 4,
    league: 'Silver',
    badges: ['First Blood', 'Rising Star'],
    solvedCount: 6,
    diagnosticCompleted: false,
    createdAt: '2026-11-07T09:30:00Z',
    eloRating: 1210,
    duelWins: 2,
    duelLosses: 4,
    bugsFixed: 4,
  },
  {
    id: 'acc_dev',
    name: 'Dev Khurana',
    email: 'dev.lead@codeadapt.ai',
    avatar: 'dev_pro',
    role: 'competitive',
    level: 8,
    xp: 1850,
    streak: 14,
    longestStreak: 21,
    league: 'Diamond',
    badges: ['Code Ninja', 'Speed Demon', 'Algorithm Ace'],
    solvedCount: 28,
    diagnosticCompleted: true,
    createdAt: '2026-10-15T08:00:00Z',
    eloRating: 1820,
    duelWins: 24,
    duelLosses: 3,
    bugsFixed: 35,
  },
];

const DEFAULT_MASTERIES: Record<TopicSlug, TopicMastery> = {
  arrays: {
    topic: 'arrays',
    topicName: 'Arrays',
    score: 65,
    isProvisional: false,
    evidenceCount: 5,
    consecutiveSuccesses: 1,
    consecutiveFailures: 0,
    status: 'Developing',
    needsRevision: false,
  },
  strings: {
    topic: 'strings',
    topicName: 'Strings',
    score: 50,
    isProvisional: false,
    evidenceCount: 3,
    consecutiveSuccesses: 0,
    consecutiveFailures: 0,
    status: 'Developing',
    needsRevision: false,
  },
  searching: {
    topic: 'searching',
    topicName: 'Searching',
    score: 30,
    isProvisional: false,
    evidenceCount: 2,
    consecutiveSuccesses: 0,
    consecutiveFailures: 1,
    status: 'Needs Foundation',
    needsRevision: true,
  },
  hashing: {
    topic: 'hashing',
    topicName: 'Hashing',
    score: 42,
    isProvisional: true,
    evidenceCount: 1,
    consecutiveSuccesses: 0,
    consecutiveFailures: 0,
    status: 'Developing',
    needsRevision: false,
  },
  'two-pointers': {
    topic: 'two-pointers',
    topicName: 'Two Pointers',
    score: 45,
    isProvisional: true,
    evidenceCount: 1,
    consecutiveSuccesses: 0,
    consecutiveFailures: 0,
    status: 'Developing',
    needsRevision: false,
  },
  'linked-lists': {
    topic: 'linked-lists',
    topicName: 'Linked Lists',
    score: 35,
    isProvisional: true,
    evidenceCount: 0,
    consecutiveSuccesses: 0,
    consecutiveFailures: 0,
    status: 'Needs Foundation',
    needsRevision: false,
  },
  'stacks-queues': {
    topic: 'stacks-queues',
    topicName: 'Stacks & Queues',
    score: 40,
    isProvisional: true,
    evidenceCount: 0,
    consecutiveSuccesses: 0,
    consecutiveFailures: 0,
    status: 'Developing',
    needsRevision: false,
  },
  trees: {
    topic: 'trees',
    topicName: 'Trees & BST',
    score: 25,
    isProvisional: true,
    evidenceCount: 0,
    consecutiveSuccesses: 0,
    consecutiveFailures: 0,
    status: 'Needs Foundation',
    needsRevision: false,
  },
  graphs: {
    topic: 'graphs',
    topicName: 'Graphs',
    score: 20,
    isProvisional: true,
    evidenceCount: 0,
    consecutiveSuccesses: 0,
    consecutiveFailures: 0,
    status: 'Needs Foundation',
    needsRevision: false,
  },
  dp: {
    topic: 'dp',
    topicName: 'Dynamic Programming',
    score: 15,
    isProvisional: true,
    evidenceCount: 0,
    consecutiveSuccesses: 0,
    consecutiveFailures: 0,
    status: 'Needs Foundation',
    needsRevision: false,
  },
};

const DEFAULT_INITIAL_RECOMMENDATION: Recommendation = {
  problem: INITIAL_PROBLEMS[2], // Two Sum
  reasonCode: 'INIT_BASELINE',
  explanation: 'Build problem-solving intuition in Hashing based on your initial baseline.',
  targetTopic: 'hashing',
  tier: 1,
  isGenerated: false,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Accounts State
  const [accounts, setAccounts] = useState<UserAccount[]>(INITIAL_DEMO_ACCOUNTS);
  const [currentAccountId, setCurrentAccountId] = useState<string>('acc_sanidhya');

  // Active User Core State
  const [diagnosticCompleted, setDiagnosticCompleted] = useState<boolean>(true);
  const [masteries, setMasteries] = useState<Record<TopicSlug, TopicMastery>>(DEFAULT_MASTERIES);
  const [solvedProblemIds, setSolvedProblemIds] = useState<string[]>(['p_max_element']);
  const [revisions, setRevisions] = useState<Record<string, RevisionItem>>({
    p_max_element: {
      problemId: 'p_max_element',
      problemTitle: 'Find Maximum in Array',
      topic: 'arrays',
      difficulty: 'EASY',
      repetitionLevel: 1,
      lastSolvedAt: getTodayDateString(),
      nextDueAt: getTodayDateString(),
      isDue: true,
    },
  });
  const [revisionDueIds, setRevisionDueIds] = useState<string[]>(['p_max_element']);
  const [currentRecommendation, setCurrentRecommendation] = useState<Recommendation>(DEFAULT_INITIAL_RECOMMENDATION);
  const [inventory, setInventory] = useState<QuestionBankInventory>(
    QuestionBankRepository.getInventory(['p_max_element'], ['p_max_element'])
  );

  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: 'sub_init_1',
      problemId: 'p_max_element',
      problemTitle: 'Find Maximum in Array',
      topic: 'arrays',
      code: 'def find_max(nums):\n    return max(nums)',
      verdict: 'ACCEPTED',
      passedTests: 5,
      totalTests: 5,
      runtimeMs: 34,
      memoryMb: 14.2,
      hintsUsed: 0,
      createdAt: new Date().toISOString(),
    },
  ]);

  // Gamification & Quiz State
  const [dailyQuizResult, setDailyQuizResult] = useState<DailyQuizResult | null>(null);
  const [channelMessages, setChannelMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_CHANNEL_MESSAGES);

  // Current active account object
  const currentAccount = accounts.find((a) => a.id === currentAccountId) || accounts[0];

  // Helper to load specific account data from storage
  const loadAccountData = (accId: string) => {
    try {
      const savedAccData = localStorage.getItem(`codeadapt_user_${accId}_data`);
      if (savedAccData) {
        const parsed = JSON.parse(savedAccData);
        if (parsed.masteries) setMasteries({ ...DEFAULT_MASTERIES, ...parsed.masteries });
        if (Array.isArray(parsed.solvedProblemIds)) setSolvedProblemIds(parsed.solvedProblemIds);
        if (typeof parsed.diagnosticCompleted === 'boolean') setDiagnosticCompleted(parsed.diagnosticCompleted);
        if (parsed.revisions) setRevisions(parsed.revisions);
        if (Array.isArray(parsed.submissions)) setSubmissions(parsed.submissions);
      } else {
        // First time loading this account
        if (accId === 'acc_riya') {
          setDiagnosticCompleted(false);
          setSolvedProblemIds([]);
          setSubmissions([]);
        } else if (accId === 'acc_dev') {
          setDiagnosticCompleted(true);
          setSolvedProblemIds(['p_max_element', 'p_valid_palindrome', 'p_two_sum', 'p_binary_search']);
        }
      }

      // Load today's quiz result if saved
      const todayKey = getTodayDateKey();
      const savedQuiz = localStorage.getItem(`codeadapt_user_${accId}_quiz_${todayKey}`);
      if (savedQuiz) {
        setDailyQuizResult(JSON.parse(savedQuiz));
      } else {
        setDailyQuizResult(null);
      }
    } catch {
      // Graceful error recovery
    }
  };

  // Helper to persist current active account data
  const persistCurrentAccountData = (accId: string) => {
    try {
      const dataToSave = {
        masteries,
        solvedProblemIds,
        diagnosticCompleted,
        revisions,
        submissions,
      };
      localStorage.setItem(`codeadapt_user_${accId}_data`, JSON.stringify(dataToSave));
    } catch {
      // ignore
    }
  };

  // Initial Load on Mount
  useEffect(() => {
    QuestionBankRepository.initializeFromStorage();

    try {
      const savedAccounts = localStorage.getItem('codeadapt_all_accounts');
      if (savedAccounts) {
        const parsedAccs = JSON.parse(savedAccounts);
        if (Array.isArray(parsedAccs) && parsedAccs.length > 0) {
          setAccounts(parsedAccs);
        }
      }

      const activeId = localStorage.getItem('codeadapt_active_account_id') || 'acc_sanidhya';
      setCurrentAccountId(activeId);
      loadAccountData(activeId);

      const savedChat = localStorage.getItem('codeadapt_chat_messages');
      if (savedChat) {
        setChannelMessages(JSON.parse(savedChat));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save accounts when accounts list or active account changes
  useEffect(() => {
    try {
      localStorage.setItem('codeadapt_all_accounts', JSON.stringify(accounts));
      localStorage.setItem('codeadapt_active_account_id', currentAccountId);
    } catch {
      // ignore
    }
  }, [accounts, currentAccountId]);

  // Save current account learning data whenever it updates
  useEffect(() => {
    persistCurrentAccountData(currentAccountId);
    setInventory(QuestionBankRepository.getInventory(solvedProblemIds, revisionDueIds));
  }, [masteries, solvedProblemIds, revisionDueIds, revisions, submissions, diagnosticCompleted, currentAccountId]);

  // Compute revision due IDs
  useEffect(() => {
    const due = Object.values(revisions)
      .filter((r) => isRevisionDue(r.nextDueAt))
      .map((r) => r.problemId);
    setRevisionDueIds(due);
  }, [revisions]);

  // Reactive recommendation calculation
  const updateRecommendation = async (
    currentMasteries = masteries,
    currentSolved = solvedProblemIds
  ) => {
    const rec = await selectAdaptiveProblem({
      userId: currentAccount.name,
      masteries: currentMasteries,
      solvedProblemIds: currentSolved,
      revisionDueProblemIds: revisionDueIds,
    });
    setCurrentRecommendation(rec);
    setInventory(QuestionBankRepository.getInventory(currentSolved, revisionDueIds));
  };

  useEffect(() => {
    updateRecommendation();
  }, [masteries, solvedProblemIds]);

  // Switch Account Handler
  const switchAccount = (accountId: string) => {
    persistCurrentAccountData(currentAccountId);
    setCurrentAccountId(accountId);
    loadAccountData(accountId);
  };

  // Create New Account Handler
  const createAccount = (
    name: string,
    email: string,
    avatar: string,
    role: 'student' | 'competitive' | 'mentor' = 'student'
  ) => {
    const newId = `acc_${Date.now()}`;
    const newAccount: UserAccount = {
      id: newId,
      name: name.trim() || 'New Learner',
      email: email.trim() || `${newId}@codeadapt.ai`,
      avatar: avatar || 'sanidhya',
      role,
      level: 1,
      xp: 0,
      streak: 1,
      longestStreak: 1,
      league: 'Bronze',
      badges: ['First Blood'],
      solvedCount: 0,
      diagnosticCompleted: false,
      createdAt: new Date().toISOString(),
    };

    const updated = [...accounts, newAccount];
    setAccounts(updated);
    switchAccount(newId);
  };

  // Delete Account Handler
  const deleteAccount = (accountId: string) => {
    if (accounts.length <= 1) return;
    const filtered = accounts.filter((a) => a.id !== accountId);
    setAccounts(filtered);
    if (currentAccountId === accountId) {
      switchAccount(filtered[0].id);
    }
  };

  // User Name Adapter for Backward Compatibility
  const userName = currentAccount.name;
  const setUserName = (name: string) => {
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === currentAccountId ? { ...acc, name } : acc))
    );
  };

  // Gamification: XP & Level Info
  const xp = currentAccount.xp;
  const levelInfo = calculateLevel(xp);
  const leaderboard = buildLeaderboard(currentAccount);

  const addXp = (amount: number) => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === currentAccountId) {
          const newXp = acc.xp + amount;
          const newTier = getLeagueTier(newXp);
          const newLevel = calculateLevel(newXp).level;
          return {
            ...acc,
            xp: newXp,
            league: newTier,
            level: newLevel,
          };
        }
        return acc;
      })
    );
  };

  // Daily Quiz Handler
  const completeDailyQuiz = (score: number, total: number, xpEarned: number) => {
    const result: DailyQuizResult = {
      date: getTodayDateKey(),
      score,
      total,
      xpEarned,
      completedAt: new Date().toISOString(),
    };
    setDailyQuizResult(result);
    try {
      localStorage.setItem(
        `codeadapt_user_${currentAccountId}_quiz_${getTodayDateKey()}`,
        JSON.stringify(result)
      );
    } catch {
      // ignore
    }
    addXp(xpEarned);
  };

  // 1v1 Arena Duel Outcome Handler
  const recordDuelOutcome = (won: boolean, opponentElo: number) => {
    const currentElo = currentAccount.eloRating || 1200;
    const { playerChange, newElo } = calculateEloChange(currentElo, opponentElo, won);
    const xpBonus = won ? 100 : 30;

    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === currentAccountId) {
          return {
            ...acc,
            eloRating: newElo,
            duelWins: (acc.duelWins || 0) + (won ? 1 : 0),
            duelLosses: (acc.duelLosses || 0) + (won ? 0 : 1),
          };
        }
        return acc;
      })
    );
    addXp(xpBonus);
    return { playerChange, newElo };
  };

  // Bug Hunt Fixed Handler
  const recordBugFixed = (challengeId: string, xpEarned: number) => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === currentAccountId) {
          return {
            ...acc,
            bugsFixed: (acc.bugsFixed || 0) + 1,
          };
        }
        return acc;
      })
    );
    addXp(xpEarned);
  };

  // Community Chat Handlers
  const sendChatMessage = (
    channelId: string,
    content: string,
    codeSnippet?: { language: string; code: string }
  ) => {
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      channelId,
      author: {
        id: currentAccount.id,
        name: currentAccount.name,
        avatar: currentAccount.avatar,
        badge: `${currentAccount.league} ${currentAccount.league === 'Grandmaster' ? '👑' : currentAccount.league === 'Diamond' ? '💎' : '🥇'}`,
        role: currentAccount.role,
      },
      content,
      codeSnippet,
      reactions: {},
      timestamp: 'Just now',
    };

    setChannelMessages((prev) => {
      const channelList = prev[channelId] || [];
      const updated = {
        ...prev,
        [channelId]: [...channelList, newMsg],
      };
      try {
        localStorage.setItem('codeadapt_chat_messages', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    // Check if user is asking CodeAdaptBot
    if (content.toLowerCase().includes('@codeadaptbot') || channelId === 'doubt-help') {
      setTimeout(() => {
        const botReply = generateBotResponse(content);
        const botMsg: ChatMessage = {
          id: `msg_bot_${Date.now()}`,
          channelId,
          author: {
            id: 'bot_ai',
            name: 'CodeAdaptBot',
            avatar: 'bot',
            badge: 'AI Mentor 🤖',
            isBot: true,
          },
          content: botReply,
          reactions: { '💡': 1, '🔥': 1 },
          timestamp: 'Just now',
        };

        setChannelMessages((prev) => {
          const list = prev[channelId] || [];
          const updated = {
            ...prev,
            [channelId]: [...list, botMsg],
          };
          try {
            localStorage.setItem('codeadapt_chat_messages', JSON.stringify(updated));
          } catch {
            // ignore
          }
          return updated;
        });
      }, 900);
    }
  };

  const toggleReaction = (channelId: string, messageId: string, emoji: string) => {
    setChannelMessages((prev) => {
      const list = prev[channelId] || [];
      const updatedList = list.map((msg) => {
        if (msg.id === messageId) {
          const currentCount = msg.reactions[emoji] || 0;
          return {
            ...msg,
            reactions: {
              ...msg.reactions,
              [emoji]: currentCount + 1,
            },
          };
        }
        return msg;
      });
      const updated = { ...prev, [channelId]: updatedList };
      try {
        localStorage.setItem('codeadapt_chat_messages', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Learning Engine Submissions & Diagnostics
  const streakInfo = calculateUserStreak(submissions.map((s) => s.createdAt));
  const activityDays = buildActivityHeatmap(submissions);
  const revisionItems = Object.values(revisions).map((r) => ({
    ...r,
    isDue: isRevisionDue(r.nextDueAt),
  }));

  const completeDiagnostic = (baselines: Record<TopicSlug, number>) => {
    const updated: Record<TopicSlug, TopicMastery> = { ...masteries };
    (Object.keys(baselines) as TopicSlug[]).forEach((topic) => {
      const score = baselines[topic];
      updated[topic] = {
        ...updated[topic],
        score,
        isProvisional: false,
        evidenceCount: 3,
        status: getMasteryStatus(score),
        needsRevision: score < 40,
      };
    });
    setMasteries(updated);
    setDiagnosticCompleted(true);
    addXp(150); // XP bonus for completing diagnostic baseline
    updateRecommendation(updated, solvedProblemIds);
  };

  const recordSubmission = async (
    problem: Problem,
    code: string,
    verdict: VerdictStatus,
    passedTests: number,
    totalTests: number,
    runtimeMs: number,
    hintsUsed: number
  ) => {
    const topic = problem.topic;
    const currentTm = masteries[topic];

    const { newScore, delta } = calculateNewMastery(
      currentTm.score,
      verdict,
      passedTests,
      totalTests,
      problem.difficulty,
      hintsUsed
    );

    const isAccepted = verdict === 'ACCEPTED';
    const isFirstSolve = isAccepted && !solvedProblemIds.includes(problem.id);
    const updatedSolved = isFirstSolve
      ? [...solvedProblemIds, problem.id]
      : solvedProblemIds;

    // Gamification XP calculation
    if (isAccepted) {
      const { total } = calculateSolveXp(problem.difficulty, currentAccount.streak, isFirstSolve);
      addXp(total);
      if (isFirstSolve) {
        setAccounts((prev) =>
          prev.map((acc) =>
            acc.id === currentAccountId ? { ...acc, solvedCount: acc.solvedCount + 1 } : acc
          )
        );
      }
    }

    const newTm: TopicMastery = {
      ...currentTm,
      score: newScore,
      evidenceCount: currentTm.evidenceCount + 1,
      consecutiveSuccesses: isAccepted ? currentTm.consecutiveSuccesses + 1 : 0,
      consecutiveFailures: isAccepted ? 0 : currentTm.consecutiveFailures + 1,
      status: getMasteryStatus(newScore),
      needsRevision: newScore < 40,
    };

    const updatedMasteries = {
      ...masteries,
      [topic]: newTm,
    };

    const newSub: Submission = {
      id: `sub_${Date.now()}`,
      problemId: problem.id,
      problemTitle: problem.title,
      topic,
      code,
      verdict,
      passedTests,
      totalTests,
      runtimeMs,
      memoryMb: 14.1,
      hintsUsed,
      createdAt: new Date().toISOString(),
    };

    // Update Spaced Repetition Progression
    const updatedRevisionItem = recordProblemRevision(
      revisions[problem.id],
      problem.id,
      problem.title,
      problem.topic,
      problem.difficulty,
      isAccepted
    );

    const updatedRevisions = {
      ...revisions,
      [problem.id]: updatedRevisionItem,
    };

    setRevisions(updatedRevisions);
    setMasteries(updatedMasteries);
    setSolvedProblemIds(updatedSolved);
    setSubmissions([newSub, ...submissions]);

    // Adaptive Question Selection
    const nextRec = await selectAdaptiveProblem({
      userId: currentAccount.name,
      masteries: updatedMasteries,
      solvedProblemIds: updatedSolved,
      revisionDueProblemIds: revisionDueIds,
      preferredTopic: topic,
    });

    setCurrentRecommendation(nextRec);
    setInventory(QuestionBankRepository.getInventory(updatedSolved, revisionDueIds));

    return {
      newMasteryScore: newScore,
      delta,
      nextRec,
    };
  };

  const evaluateSolution = async (
    problem: Problem,
    code: string,
    language: 'python' | 'cpp' | 'java',
    hintsUsed: number,
    timeSpentSeconds = 30
  ) => {
    try {
      const res = await fetch('/api/submissions/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: problem.id,
          code,
          language,
          userId: currentAccount.name,
          timeSpentSeconds,
        }),
      });

      const json = await res.json();
      const result: ExecutionJobResult = json?.data?.result || {
        verdict: 'INTERNAL_ERROR',
        passedTests: 0,
        totalTests: problem.testCases.length,
        runtimeMs: 0,
        memoryMb: 14.0,
        sampleResults: [],
        error: json?.error || 'Evaluation failed',
      };

      const outcome = await recordSubmission(
        problem,
        code,
        result.verdict,
        result.passedTests,
        result.totalTests,
        result.runtimeMs,
        hintsUsed
      );

      return {
        result,
        newMasteryScore: outcome.newMasteryScore,
        delta: outcome.delta,
        nextRec: outcome.nextRec,
      };
    } catch (err: any) {
      const fallbackResult: ExecutionJobResult = {
        verdict: 'INTERNAL_ERROR',
        passedTests: 0,
        totalTests: problem.testCases.length,
        runtimeMs: 0,
        memoryMb: 14.0,
        sampleResults: [],
        error: err?.message || 'Network error during evaluation',
      };
      const outcome = await recordSubmission(
        problem,
        code,
        'INTERNAL_ERROR',
        0,
        problem.testCases.length,
        0,
        hintsUsed
      );
      return {
        result: fallbackResult,
        newMasteryScore: outcome.newMasteryScore,
        delta: outcome.delta,
        nextRec: outcome.nextRec,
      };
    }
  };

  const completeRevision = (problemId: string) => {
    if (revisions[problemId]) {
      const updated = recordProblemRevision(
        revisions[problemId],
        problemId,
        revisions[problemId].problemTitle,
        revisions[problemId].topic,
        revisions[problemId].difficulty,
        true
      );
      setRevisions({
        ...revisions,
        [problemId]: updated,
      });
      addXp(30); // XP bonus for spaced revision
    }
  };

  const refreshRecommendation = async () => {
    await updateRecommendation();
  };

  const resetAllData = () => {
    setMasteries(DEFAULT_MASTERIES);
    setSolvedProblemIds(['p_max_element']);
    setDiagnosticCompleted(false);
    localStorage.removeItem(`codeadapt_user_${currentAccountId}_data`);
    setInventory(QuestionBankRepository.getInventory(['p_max_element'], []));
    updateRecommendation(DEFAULT_MASTERIES, ['p_max_element']);
  };

  return (
    <AppContext.Provider
      value={{
        accounts,
        currentAccount,
        switchAccount,
        createAccount,
        deleteAccount,
        userName,
        setUserName,
        xp,
        addXp,
        levelInfo,
        leaderboard,
        dailyQuizResult,
        completeDailyQuiz,
        channelMessages,
        sendChatMessage,
        toggleReaction,
        recordDuelOutcome,
        recordBugFixed,
        diagnosticCompleted,
        completeDiagnostic,
        masteries,
        solvedProblemIds,
        submissions,
        currentRecommendation,
        inventory,
        revisionItems,
        revisionDueIds,
        streakInfo,
        activityDays,
        evaluateSolution,
        recordSubmission,
        completeRevision,
        refreshRecommendation,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
