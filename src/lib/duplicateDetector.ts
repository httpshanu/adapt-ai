import { Problem } from '../types';

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  score: number; // 0.0 to 1.0 (1.0 = identical)
  matchedProblemId?: string;
  matchedTitle?: string;
  reason?: string;
}

const JACCARD_THRESHOLD = 0.68;
const TITLE_SIMILARITY_THRESHOLD = 0.80;

/**
 * Strips numbers, variable identifiers, punctuation, and markdown formatting.
 * Masks trivial numeric substitutions (e.g. replacing '9' with '18' or 'nums' with 'arr').
 */
export function normalizeStatementForComparison(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/```[\s\S]*?```/g, '') // strip code blocks
    .replace(/`[^`]+`/g, ' <VAR> ') // mask backticked variables
    .replace(/-?\b\d+\b/g, ' <NUM> ') // mask numbers to catch trivial replacements
    .replace(/[^\w\s<>]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 2 || token === '<NUM>' || token === '<VAR>');
}

/**
 * Computes Jaccard Similarity between two token sets.
 */
function computeJaccard(tokensA: string[], tokensB: string[]): number {
  if (tokensA.length === 0 || tokensB.length === 0) return 0;
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);

  let intersectionCount = 0;
  setA.forEach((item) => {
    if (setB.has(item)) intersectionCount++;
  });

  const unionCount = setA.size + setB.size - intersectionCount;
  return unionCount === 0 ? 0 : intersectionCount / unionCount;
}

/**
 * Computes Levenshtein Distance similarity ratio for short strings (e.g. titles).
 */
function computeStringSimilarity(a: string, b: string): number {
  const s1 = a.toLowerCase().trim();
  const s2 = b.toLowerCase().trim();
  if (s1 === s2) return 1.0;
  if (!s1 || !s2) return 0.0;

  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }

  const distance = dp[m][n];
  const maxLen = Math.max(m, n);
  return 1.0 - distance / maxLen;
}

/**
 * Checks a candidate problem against an existing problem bank to detect
 * exact and near-duplicates, preventing trivial number/variable mutations.
 */
export function checkDuplicate(
  candidate: Problem,
  existingProblems: Problem[]
): DuplicateCheckResult {
  const candidateTokens = normalizeStatementForComparison(candidate.descriptionMarkdown);

  for (const existing of existingProblems) {
    if (existing.id === candidate.id) continue;

    // 1. High Title Similarity Check
    const titleSim = computeStringSimilarity(candidate.title, existing.title);
    if (titleSim >= TITLE_SIMILARITY_THRESHOLD) {
      return {
        isDuplicate: true,
        score: Math.round(titleSim * 100) / 100,
        matchedProblemId: existing.id,
        matchedTitle: existing.title,
        reason: `Title is too similar to existing problem '${existing.title}' (${Math.round(titleSim * 100)}% match).`,
      };
    }

    // 2. Token Jaccard Similarity on Masked Statements
    const existingTokens = normalizeStatementForComparison(existing.descriptionMarkdown);
    const jaccard = computeJaccard(candidateTokens, existingTokens);

    // Also check token containment if candidate is very short copy of existing statement core
    const setA = new Set(candidateTokens);
    const setB = new Set(existingTokens);
    let intersectionCount = 0;
    setA.forEach((item) => {
      if (setB.has(item)) intersectionCount++;
    });
    const candidateContainment = setA.size > 0 ? intersectionCount / setA.size : 0;

    // A candidate is a duplicate if overall Jaccard is high,
    // OR if its substantive core is > 82% identical to an existing problem of the same topic
    const isTopicMatch = candidate.topic === existing.topic;
    const isDuplicate = jaccard >= JACCARD_THRESHOLD || (isTopicMatch && candidateContainment >= 0.82 && jaccard >= 0.40);

    const score = Math.max(jaccard, candidateContainment);

    if (isDuplicate) {
      return {
        isDuplicate: true,
        score: Math.round(score * 100) / 100,
        matchedProblemId: existing.id,
        matchedTitle: existing.title,
        reason: `High conceptual overlap (${Math.round(score * 100)}%) with problem '${existing.title}'. Trivial variable or number substitutions are rejected.`,
      };
    }
  }

  return {
    isDuplicate: false,
    score: 0.0,
  };
}
