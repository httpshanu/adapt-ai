import { INITIAL_PROBLEMS } from './problemsData';
import { Problem, QuestionBankInventory, RateLimitState, TopicSlug } from '../types';

// In-memory persistent question bank store (shared across client sessions via localStorage sync)
let memoryProblemBank: Problem[] = [...INITIAL_PROBLEMS];
const userRateLimits: Map<string, RateLimitState> = new Map();
const MAX_HOURLY_GENERATIONS_PER_USER = 5;
const ONE_HOUR_MS = 60 * 60 * 1000;

export class QuestionBankRepository {
  /**
   * Initializes the repository with saved questions if running in browser
   */
  public static initializeFromStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('codeadapt_dynamic_problems');
      if (stored) {
        const parsed: Problem[] = JSON.parse(stored);
        // Merge without duplicating IDs
        const existingIds = new Set(memoryProblemBank.map(p => p.id));
        for (const p of parsed) {
          if (!existingIds.has(p.id)) {
            memoryProblemBank.push(p);
          }
        }
      }
    } catch {
      // ignore
    }
  }

  /**
   * Returns all published, validated problems.
   * Unvalidated or rejected questions are NEVER included here.
   */
  public static getAllPublished(): Problem[] {
    return memoryProblemBank.filter(p => p.status === 'PUBLISHED');
  }

  /**
   * Gets a problem by ID or slug.
   */
  public static getByIdOrSlug(idOrSlug: string): Problem | undefined {
    return memoryProblemBank.find(p => p.id === idOrSlug || p.slug === idOrSlug);
  }

  /**
   * Saves a newly validated problem into the question bank.
   */
  public static saveProblem(problem: Problem): void {
    const existingIndex = memoryProblemBank.findIndex(p => p.id === problem.id);
    if (existingIndex >= 0) {
      memoryProblemBank[existingIndex] = problem;
    } else {
      memoryProblemBank.push(problem);
    }

    if (typeof window !== 'undefined') {
      try {
        const dynamicProblems = memoryProblemBank.filter(p => p.provenance !== 'MANUAL');
        localStorage.setItem('codeadapt_dynamic_problems', JSON.stringify(dynamicProblems));
      } catch {
        // storage quota exceeded or disabled
      }
    }
  }

  /**
   * Computes the dashboard inventory metrics.
   */
  public static getInventory(
    solvedIds: string[] = [],
    revisionDueIds: string[] = []
  ): QuestionBankInventory {
    const published = this.getAllPublished();
    const solvedSet = new Set(solvedIds);

    let coreVerified = 0;
    let generatedValidated = 0;

    const byTopic: Record<TopicSlug, { total: number; solved: number; available: number }> = {
      arrays: { total: 0, solved: 0, available: 0 },
      strings: { total: 0, solved: 0, available: 0 },
      searching: { total: 0, solved: 0, available: 0 },
      hashing: { total: 0, solved: 0, available: 0 },
      'two-pointers': { total: 0, solved: 0, available: 0 },
      'linked-lists': { total: 0, solved: 0, available: 0 },
      'stacks-queues': { total: 0, solved: 0, available: 0 },
      trees: { total: 0, solved: 0, available: 0 },
      graphs: { total: 0, solved: 0, available: 0 },
      dp: { total: 0, solved: 0, available: 0 },
    };

    for (const p of published) {
      if (p.provenance === 'MANUAL') coreVerified++;
      else generatedValidated++;

      const isSolved = solvedSet.has(p.id);
      if (byTopic[p.topic]) {
        byTopic[p.topic].total++;
        if (isSolved) byTopic[p.topic].solved++;
        else byTopic[p.topic].available++;
      }
    }

    return {
      totalAvailable: published.length,
      totalCoreVerified: coreVerified,
      totalGeneratedValidated: generatedValidated,
      totalSolved: solvedIds.length,
      revisionDueCount: revisionDueIds.length,
      byTopic,
    };
  }

  /**
   * Checks per-user generation rate limit (max 5 per hour).
   */
  public static checkAndIncrementRateLimit(userId: string = 'default_user'): {
    allowed: boolean;
    remaining: number;
    resetInMinutes: number;
  } {
    const now = Date.now();
    let state = userRateLimits.get(userId);

    if (!state || now - state.windowStart > ONE_HOUR_MS) {
      state = {
        userId,
        hourlyGenerations: 1,
        windowStart: now,
        maxHourlyGenerations: MAX_HOURLY_GENERATIONS_PER_USER,
      };
      userRateLimits.set(userId, state);
      return {
        allowed: true,
        remaining: MAX_HOURLY_GENERATIONS_PER_USER - 1,
        resetInMinutes: 60,
      };
    }

    if (state.hourlyGenerations >= state.maxHourlyGenerations) {
      const remainingMs = ONE_HOUR_MS - (now - state.windowStart);
      return {
        allowed: false,
        remaining: 0,
        resetInMinutes: Math.ceil(remainingMs / (60 * 1000)),
      };
    }

    state.hourlyGenerations += 1;
    userRateLimits.set(userId, state);

    const remainingMs = ONE_HOUR_MS - (now - state.windowStart);
    return {
      allowed: true,
      remaining: state.maxHourlyGenerations - state.hourlyGenerations,
      resetInMinutes: Math.ceil(remainingMs / (60 * 1000)),
    };
  }
}
