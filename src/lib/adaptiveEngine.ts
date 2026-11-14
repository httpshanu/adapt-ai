import { DifficultyLevel, Problem, ReasonCode, Recommendation, TopicMastery, TopicSlug, VerdictStatus } from '../types';

export const ALPHA = 0.20; // Learning rate momentum parameter

/**
 * Calculates new mastery score after an attempt using rolling exponential update formula:
 * M_new = (1 - alpha) * M_current + alpha * S_attempt
 */
export function calculateNewMastery(
  currentScore: number,
  verdict: VerdictStatus,
  passedTests: number,
  totalTests: number,
  difficulty: DifficultyLevel,
  hintsUsed: number
): { newScore: number; delta: number; attemptScore: number } {
  // 1. Syntax errors and internal judge errors do not penalize mastery
  if (verdict === 'SYNTAX_ERROR' || verdict === 'INTERNAL_ERROR') {
    return { newScore: currentScore, delta: 0, attemptScore: currentScore };
  }

  // 2. Base verdict score
  let baseScore = 0;
  if (verdict === 'ACCEPTED') {
    baseScore = 100;
  } else if (verdict === 'WRONG_ANSWER') {
    const passRatio = totalTests > 0 ? passedTests / totalTests : 0;
    baseScore = Math.max(20, Math.floor(passRatio * 60));
  } else if (verdict === 'TIME_LIMIT_EXCEEDED') {
    baseScore = 30;
  } else {
    // RUNTIME_ERROR
    baseScore = 20;
  }

  // 3. Difficulty multiplier
  let diffMultiplier = 1.0;
  if (difficulty === 'EASY') {
    diffMultiplier = currentScore >= 75 ? 0.85 : 1.0;
  } else if (difficulty === 'HARD') {
    diffMultiplier = 1.2;
  }

  // 4. Hint penalty
  let hintMultiplier = 1.0;
  if (hintsUsed === 1) hintMultiplier = 0.90;
  else if (hintsUsed === 2) hintMultiplier = 0.75;
  else if (hintsUsed >= 3) hintMultiplier = 0.55;

  const attemptScore = Math.min(100, Math.max(0, baseScore * diffMultiplier * hintMultiplier));

  // 5. Rolling exponential update
  const rawNewScore = (1 - ALPHA) * currentScore + ALPHA * attemptScore;
  const newScore = Math.round(Math.min(100, Math.max(0, rawNewScore)) * 10) / 10;
  const delta = Math.round((newScore - currentScore) * 10) / 10;

  return { newScore, delta, attemptScore };
}

/**
 * Returns student mastery categorization
 */
export function getMasteryStatus(score: number): 'Needs Foundation' | 'Developing' | 'Confident' {
  if (score < 40) return 'Needs Foundation';
  if (score < 75) return 'Developing';
  return 'Confident';
}

/**
 * Prerequisite dependency map
 */
export const TOPIC_PREREQUISITES: Record<TopicSlug, TopicSlug[]> = {
  arrays: [],
  strings: ['arrays'],
  searching: ['arrays'],
  hashing: ['arrays', 'strings'],
  'two-pointers': ['arrays', 'strings'],
  'linked-lists': ['arrays'],
  'stacks-queues': ['arrays', 'strings'],
  trees: ['linked-lists', 'stacks-queues'],
  graphs: ['trees', 'stacks-queues'],
  dp: ['arrays', 'searching'],
};

/**
 * Adaptive recommendation heuristic selector
 */
export function computeNextRecommendation(
  masteries: Record<TopicSlug, TopicMastery>,
  allProblems: Problem[],
  solvedProblemIds: string[],
  lastProblemTopic?: TopicSlug
): Recommendation {
  const solvedSet = new Set(solvedProblemIds);
  const topics: TopicSlug[] = [
    'arrays',
    'strings',
    'searching',
    'hashing',
    'two-pointers',
    'linked-lists',
    'stacks-queues',
    'trees',
    'graphs',
    'dp',
  ];

  // Check 1: Recovery protocol (>=3 consecutive failures on current or any topic)
  for (const topic of topics) {
    const tm = masteries[topic];
    if (tm && tm.consecutiveFailures >= 3) {
      const prereqs = TOPIC_PREREQUISITES[topic];
      for (const prereq of prereqs) {
        if (masteries[prereq].score < 60) {
          const prereqProb = allProblems.find(
            (p) => p.topic === prereq && p.difficulty === 'EASY' && !solvedSet.has(p.id)
          );
          if (prereqProb) {
            return {
              problem: prereqProb,
              reasonCode: 'PREREQ_RECOVERY',
              explanation: `You hit a hurdle in ${tm.topicName}. Let's revisit foundational ${masteries[prereq].topicName} concepts first.`,
              targetTopic: prereq,
              tier: 1,
              isGenerated: false,
            };
          }
        }
      }

      // Step down difficulty on same topic
      const easyProb = allProblems.find((p) => p.topic === topic && p.difficulty === 'EASY' && !solvedSet.has(p.id));
      if (easyProb) {
        return {
          problem: easyProb,
          reasonCode: 'PREREQ_RECOVERY',
          explanation: `Let's take a step back with an easier problem in ${tm.topicName} to regain momentum.`,
          targetTopic: topic,
          tier: 1,
          isGenerated: false,
        };
      }
    }
  }

  // Check 2: Streak promotion (>=3 consecutive successes on a topic)
  if (lastProblemTopic && masteries[lastProblemTopic]) {
    const tm = masteries[lastProblemTopic];
    if (tm.consecutiveSuccesses >= 3) {
      const hardProb = allProblems.find((p) => p.topic === lastProblemTopic && p.difficulty === 'HARD' && !solvedSet.has(p.id));
      if (hardProb) {
        return {
          problem: hardProb,
          reasonCode: 'STREAK_PROMOTION',
          explanation: `Incredible! You solved 3 problems in a row in ${tm.topicName}. Stepping up to a Hard challenge!`,
          targetTopic: lastProblemTopic,
          tier: 1,
          isGenerated: false,
        };
      }

      const medProb = allProblems.find((p) => p.topic === lastProblemTopic && p.difficulty === 'MEDIUM' && !solvedSet.has(p.id));
      if (medProb) {
        return {
          problem: medProb,
          reasonCode: 'STREAK_PROMOTION',
          explanation: `Consistent success! Leveling up to Medium in ${tm.topicName}.`,
          targetTopic: lastProblemTopic,
          tier: 1,
          isGenerated: false,
        };
      }
    }
  }

  // Check 3: Select topic with lowest mastery score
  const sortedTopics = [...topics].sort((a, b) => masteries[a].score - masteries[b].score);
  const targetTopic = sortedTopics[0];
  const targetMastery = masteries[targetTopic].score;

  // Select difficulty based on mastery band
  let targetDifficulty: DifficultyLevel = 'EASY';
  if (targetMastery >= 75) {
    targetDifficulty = 'HARD';
  } else if (targetMastery >= 40) {
    targetDifficulty = 'MEDIUM';
  }

  // Find candidate problem
  let candidate = allProblems.find((p) => p.topic === targetTopic && p.difficulty === targetDifficulty && !solvedSet.has(p.id));

  // Fallback to adjacent difficulties if exhausted
  if (!candidate && targetDifficulty === 'HARD') {
    candidate = allProblems.find((p) => p.topic === targetTopic && p.difficulty === 'MEDIUM' && !solvedSet.has(p.id));
  }
  if (!candidate) {
    candidate = allProblems.find((p) => p.topic === targetTopic && p.difficulty === 'EASY' && !solvedSet.has(p.id));
  }

  // Fallback to other topics if current topic is fully solved
  if (!candidate) {
    for (const altTopic of sortedTopics.slice(1)) {
      candidate = allProblems.find((p) => p.topic === altTopic && !solvedSet.has(p.id));
      if (candidate) break;
    }
  }

  // Absolute fallback if everything is solved
  if (!candidate) {
    candidate = allProblems[0];
    return {
      problem: candidate,
      reasonCode: 'CATALOG_EXHAUSTED',
      explanation: 'You have solved all problems in this curriculum! Here is a recommended revision problem.',
      targetTopic: candidate.topic,
      tier: 4,
      isGenerated: false,
    };
  }

  const reasonCode: ReasonCode = targetMastery < 40 ? 'INIT_BASELINE' : 'CONSOLIDATE_LEVEL';
  const explanation = targetMastery < 40
    ? `Based on your diagnostic baseline in ${masteries[candidate.topic].topicName}, let's build solid fundamentals.`
    : `Strengthen your problem-solving patterns in ${masteries[candidate.topic].topicName} at this mastery level.`;

  return {
    problem: candidate,
    reasonCode,
    explanation,
    targetTopic: candidate.topic,
    tier: 1,
    isGenerated: false,
  };
}
