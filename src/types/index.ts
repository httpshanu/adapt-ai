export type TopicSlug = 
  | 'arrays' 
  | 'strings' 
  | 'searching' 
  | 'hashing' 
  | 'linked-lists' 
  | 'stacks-queues' 
  | 'trees' 
  | 'graphs' 
  | 'dp' 
  | 'two-pointers';

export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';

export type VerdictStatus = 
  | 'ACCEPTED' 
  | 'WRONG_ANSWER' 
  | 'TIME_LIMIT_EXCEEDED' 
  | 'MEMORY_LIMIT_EXCEEDED'
  | 'RUNTIME_ERROR' 
  | 'SYNTAX_ERROR' 
  | 'INTERNAL_ERROR';

export type ReasonCode = 
  | 'INIT_BASELINE'
  | 'STREAK_PROMOTION'
  | 'CONSOLIDATE_LEVEL'
  | 'PREREQ_RECOVERY'
  | 'TOPIC_ADVANCE'
  | 'SPACED_REVISION'
  | 'DYNAMIC_VARIATION'
  | 'LLM_GENERATED'
  | 'CATALOG_EXHAUSTED';

export type ProblemStatus = 'DRAFT' | 'VALIDATING' | 'PUBLISHED' | 'REJECTED';

export type ProvenanceType = 'MANUAL' | 'PARAMETERIZED_VARIATION' | 'LLM_GENERATED';

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isSample: boolean;
  explanation?: string;
}

export interface Hint {
  tier: 1 | 2 | 3;
  title: string;
  content: string;
}

export interface ValidationLog {
  passed: boolean;
  testCount: number;
  passedTests: number;
  runtimeMs: number;
  error?: string;
  validatedAt: string;
  duplicateScore?: number;
}

export interface GenerationMetadata {
  model?: string;
  generationType: ProvenanceType;
  sourceProblemId?: string;
  promptTokens?: number;
  duplicateScore?: number;
  timestamp: string;
}

export interface Problem {
  id: string;
  slug: string;
  title: string;
  topic: TopicSlug;
  topicName: string;
  difficulty: DifficultyLevel;
  descriptionMarkdown: string;
  starterCode: string;
  referenceSolution: string;
  estimatedMinutes: number;
  testCases: TestCase[];
  hints: Hint[];
  constraints: string[];
  // Exhaustion-Proof Fields:
  status: ProblemStatus;
  provenance: ProvenanceType;
  sourceProblemId?: string;
  validationLog?: ValidationLog;
  generationMetadata?: GenerationMetadata;
  createdAt?: string;
}

export interface DiagnosticQuestion {
  id: string;
  topic: TopicSlug;
  topicName: string;
  difficulty: DifficultyLevel;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface TopicMastery {
  topic: TopicSlug;
  topicName: string;
  score: number; // 0 - 100
  isProvisional: boolean;
  evidenceCount: number;
  consecutiveSuccesses: number;
  consecutiveFailures: number;
  status: 'Needs Foundation' | 'Developing' | 'Confident';
  needsRevision: boolean;
}

export interface Submission {
  id: string;
  problemId: string;
  problemTitle: string;
  topic: TopicSlug;
  code: string;
  verdict: VerdictStatus;
  passedTests: number;
  totalTests: number;
  runtimeMs: number;
  memoryMb: number;
  hintsUsed: number;
  createdAt: string;
}

export interface Recommendation {
  problem: Problem;
  reasonCode: ReasonCode;
  explanation: string;
  targetTopic: TopicSlug;
  tier?: 1 | 2 | 3 | 4; // 1 = Database verified, 2 = Variation, 3 = LLM Generated, 4 = Fallback
  isGenerated?: boolean;
}

export interface QuestionBankInventory {
  totalAvailable: number;
  totalCoreVerified: number;
  totalGeneratedValidated: number;
  totalSolved: number;
  revisionDueCount: number;
  byTopic: Record<TopicSlug, { total: number; solved: number; available: number }>;
}

export interface RateLimitState {
  userId: string;
  hourlyGenerations: number;
  windowStart: number;
  maxHourlyGenerations: number;
}

export interface RevisionItem {
  problemId: string;
  problemTitle: string;
  topic: TopicSlug;
  difficulty: DifficultyLevel;
  repetitionLevel: number; // 0 (1 day), 1 (3 days), 2 (7 days), 3 (21 days), 4 (60 days)
  lastSolvedAt: string;
  nextDueAt: string;
  isDue: boolean;
}

export interface ActivityDay {
  date: string; // YYYY-MM-DD
  count: number;
  accepted: number;
  failed: number;
}

export interface ExecutionJobResult {
  verdict: VerdictStatus;
  passedTests: number;
  totalTests: number;
  runtimeMs: number;
  memoryMb: number;
  sampleResults: {
    sampleIndex: number;
    passed: boolean;
    input: string;
    expectedOutput: string;
    actualOutput: string;
    stdout: string;
    stderr?: string;
  }[];
  antiCheatFlags?: string[];
  error?: string;
}

export interface ExecutionJob {
  id: string;
  idempotencyKey?: string;
  userId?: string;
  problemId: string;
  code: string;
  language: 'python' | 'cpp' | 'java';
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  result?: ExecutionJobResult;
}

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

// ==================== Gamification, Multi-Account & Community ====================

export type LeagueTier = 'Bronze' | 'Silver' | 'Gold' | 'Diamond' | 'Grandmaster';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatar: string; // avatar identifier or url
  role: 'student' | 'competitive' | 'mentor';
  level: number;
  xp: number;
  streak: number;
  longestStreak: number;
  league: LeagueTier;
  badges: string[];
  solvedCount: number;
  diagnosticCompleted: boolean;
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar: string;
  league: LeagueTier;
  xp: number;
  solvedCount: number;
  streak: number;
  trend: 'up' | 'down' | 'same' | 'new';
  trendValue?: number;
  badge?: string;
  isCurrentUser?: boolean;
}

export interface DailyQuizQuestion {
  id: string;
  date: string; // YYYY-MM-DD
  question: string;
  codeSnippet?: string;
  language?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
  xpReward: number;
}

export interface DailyQuizResult {
  date: string;
  score: number;
  total: number;
  xpEarned: number;
  completedAt: string;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    badge?: string;
    isBot?: boolean;
    role?: string;
  };
  content: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  reactions: Record<string, number>;
  userReactions?: string[];
  timestamp: string;
}

export interface ChatChannel {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'community' | 'learning' | 'focus';
}

