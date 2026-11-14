'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { INITIAL_PROBLEMS } from '../lib/problemsData';
import { calculateNewMastery, getMasteryStatus } from '../lib/adaptiveEngine';
import { QuestionBankRepository } from '../lib/questionBankRepository';
import { selectAdaptiveProblem } from '../lib/questionSelector';
import { 
  ActivityDay,
  ExecutionJobResult,
  Problem, 
  QuestionBankInventory, 
  Recommendation, 
  RevisionItem,
  Submission, 
  TopicMastery, 
  TopicSlug, 
  VerdictStatus 
} from '../types';
import { 
  buildActivityHeatmap, 
  calculateUserStreak, 
  getTodayDateString, 
  isRevisionDue, 
  recordProblemRevision 
} from '../lib/spacedRepetition';

interface AppContextType {
  userName: string;
  setUserName: (name: string) => void;
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
  const [userName, setUserName] = useState<string>('Sanidhya');
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

  // Load from localStorage on mount
  useEffect(() => {
    QuestionBankRepository.initializeFromStorage();

    try {
      const savedMasteries = localStorage.getItem('codeadapt_masteries');
      if (savedMasteries) {
        const parsed = JSON.parse(savedMasteries);
        setMasteries({ ...DEFAULT_MASTERIES, ...parsed });
      }
      const savedSolved = localStorage.getItem('codeadapt_solved');
      if (savedSolved) {
        const parsedSolved = JSON.parse(savedSolved);
        if (Array.isArray(parsedSolved)) setSolvedProblemIds(parsedSolved);
      }
      const savedDiag = localStorage.getItem('codeadapt_diag_completed');
      if (savedDiag !== null) setDiagnosticCompleted(Boolean(JSON.parse(savedDiag)));
      const savedName = localStorage.getItem('codeadapt_username');
      if (savedName && typeof savedName === 'string') setUserName(savedName);
      const savedRevisions = localStorage.getItem('codeadapt_revisions');
      if (savedRevisions) {
        const parsedRev = JSON.parse(savedRevisions);
        if (typeof parsedRev === 'object' && parsedRev !== null) setRevisions(parsedRev);
      }
      const savedSubmissions = localStorage.getItem('codeadapt_submissions');
      if (savedSubmissions) {
        const parsedSubs = JSON.parse(savedSubmissions);
        if (Array.isArray(parsedSubs)) setSubmissions(parsedSubs);
      }
    } catch {
      // ignore corrupted data gracefully
    }
  }, []);

  // Compute revision due IDs
  useEffect(() => {
    const due = Object.values(revisions)
      .filter((r) => isRevisionDue(r.nextDueAt))
      .map((r) => r.problemId);
    setRevisionDueIds(due);
  }, [revisions]);

  // Update inventory and sync state
  useEffect(() => {
    try {
      localStorage.setItem('codeadapt_masteries', JSON.stringify(masteries));
      localStorage.setItem('codeadapt_solved', JSON.stringify(solvedProblemIds));
      localStorage.setItem('codeadapt_diag_completed', JSON.stringify(diagnosticCompleted));
      localStorage.setItem('codeadapt_username', userName);
      localStorage.setItem('codeadapt_revisions', JSON.stringify(revisions));
      localStorage.setItem('codeadapt_submissions', JSON.stringify(submissions));
    } catch {
      // ignore
    }

    setInventory(QuestionBankRepository.getInventory(solvedProblemIds, revisionDueIds));
  }, [masteries, solvedProblemIds, revisionDueIds, revisions, submissions, userName, diagnosticCompleted]);

  // Streak calculation and Heatmap days
  const streakInfo = calculateUserStreak(submissions.map((s) => s.createdAt));
  const activityDays = buildActivityHeatmap(submissions);
  const revisionItems = Object.values(revisions).map((r) => ({
    ...r,
    isDue: isRevisionDue(r.nextDueAt),
  }));

  // Initial and reactive recommendation calculation
  const updateRecommendation = async (
    currentMasteries = masteries,
    currentSolved = solvedProblemIds
  ) => {
    const rec = await selectAdaptiveProblem({
      userId: userName,
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
    const updatedSolved = isAccepted && !solvedProblemIds.includes(problem.id)
      ? [...solvedProblemIds, problem.id]
      : solvedProblemIds;

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

    // Adaptive Question Selection (Tier 1 -> Tier 2 -> Tier 3 -> Tier 4)
    const nextRec = await selectAdaptiveProblem({
      userId: userName,
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
          userId: userName,
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
    }
  };

  const refreshRecommendation = async () => {
    await updateRecommendation();
  };

  const resetAllData = () => {
    setMasteries(DEFAULT_MASTERIES);
    setSolvedProblemIds(['p_max_element']);
    setDiagnosticCompleted(false);
    localStorage.clear();
    setInventory(QuestionBankRepository.getInventory(['p_max_element'], []));
    updateRecommendation(DEFAULT_MASTERIES, ['p_max_element']);
  };

  return (
    <AppContext.Provider
      value={{
        userName,
        setUserName,
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
