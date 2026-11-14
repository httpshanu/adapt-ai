import { DifficultyLevel, Problem, ReasonCode, Recommendation, TopicMastery, TopicSlug } from '../types';
import { QuestionBankRepository } from './questionBankRepository';
import { validateProblemCandidate } from './questionValidator';
import { checkDuplicate } from './duplicateDetector';
import { generateVariationForTopic } from './variationGenerator';
import { generateProblemViaLLM } from './llmProblemGenerator';
import { TOPIC_PREREQUISITES } from './adaptiveEngine';

export interface SelectionContext {
  userId: string;
  masteries: Record<TopicSlug, TopicMastery>;
  solvedProblemIds: string[];
  revisionDueProblemIds?: string[];
  preferredTopic?: TopicSlug;
  consecutiveSuccesses?: Record<TopicSlug, number>;
  consecutiveFailures?: Record<TopicSlug, number>;
}

/**
 * Exhaustion-Proof Adaptive Question Selection Service.
 * Implements a strict 4-tier resolution:
 *   Tier 1: Verified Unsolved & Revision-due Problems from Repository
 *   Tier 2: Parameterized Variation Generation + Sandbox Validation + Duplicate Check
 *   Tier 3: Configurable LLM Generation + Sandbox Validation + Duplicate Check
 *   Tier 4: Graceful Fallbacks (Spaced Revision, Prerequisite, Transparent Message)
 */
export async function selectAdaptiveProblem(
  context: SelectionContext
): Promise<Recommendation> {
  const allPublished = QuestionBankRepository.getAllPublished();
  const solvedSet = new Set(context.solvedProblemIds);
  const revisionDueSet = new Set(context.revisionDueProblemIds || []);

  // Determine focus topic & target difficulty
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
  let targetTopic = context.preferredTopic;

  if (!targetTopic) {
    // Check consecutive failure recovery
    for (const t of topics) {
      if ((context.consecutiveFailures?.[t] || 0) >= 3) {
        targetTopic = t;
        break;
      }
    }
  }

  if (!targetTopic) {
    // Default to lowest mastery topic
    const sorted = [...topics].sort((a, b) => (context.masteries[a]?.score || 0) - (context.masteries[b]?.score || 0));
    targetTopic = sorted[0];
  }

  const masteryScore = context.masteries[targetTopic]?.score || 40;
  let targetDifficulty: DifficultyLevel = 'EASY';
  if ((context.consecutiveSuccesses?.[targetTopic] || 0) >= 3 && masteryScore >= 75) {
    targetDifficulty = 'HARD';
  } else if (masteryScore >= 40) {
    targetDifficulty = 'MEDIUM';
  }

  // =========================================================================
  // TIER 1: Unseen & Revision-Due Verified Problems from Database
  // =========================================================================

  // Check 1A: Revision due in spaced repetition
  for (const p of allPublished) {
    if (revisionDueSet.has(p.id)) {
      return {
        problem: p,
        reasonCode: 'SPACED_REVISION',
        explanation: `Time for spaced revision in ${p.topicName} to retain long-term algorithmic intuition.`,
        targetTopic: p.topic,
        tier: 1,
        isGenerated: false,
      };
    }
  }

  // Check 1B: Unsolved matching topic and difficulty
  const tier1Match = allPublished.find(
    (p) => p.topic === targetTopic && p.difficulty === targetDifficulty && !solvedSet.has(p.id)
  );
  if (tier1Match) {
    return {
      problem: tier1Match,
      reasonCode: masteryScore < 40 ? 'INIT_BASELINE' : 'CONSOLIDATE_LEVEL',
      explanation: masteryScore < 40
        ? `Let's build foundational confidence in ${tier1Match.topicName}.`
        : `Consolidate your problem-solving patterns in ${tier1Match.topicName}.`,
      targetTopic,
      tier: 1,
      isGenerated: false,
    };
  }

  // Check 1C: Unsolved in adjacent difficulties of same topic
  const tier1Adjacent = allPublished.find(
    (p) => p.topic === targetTopic && !solvedSet.has(p.id)
  );
  if (tier1Adjacent) {
    return {
      problem: tier1Adjacent,
      reasonCode: 'CONSOLIDATE_LEVEL',
      explanation: `Exploring another verified problem in ${tier1Adjacent.topicName} calibrated to your pace.`,
      targetTopic,
      tier: 1,
      isGenerated: false,
    };
  }

  // =========================================================================
  // TIER 2: Parameterized Variation Generation + Validation Pipeline
  // =========================================================================
  const existingSlugs = new Set(allPublished.map((p) => p.slug));
  const variationCandidate = generateVariationForTopic(targetTopic, targetDifficulty, existingSlugs);

  if (variationCandidate) {
    // Quality Gate 1: Check Duplicate / Near-Duplicate
    const dupResult = checkDuplicate(variationCandidate, allPublished);
    if (!dupResult.isDuplicate) {
      // Quality Gate 2: Isolated Sandbox Test Suite Validation
      const valResult = await validateProblemCandidate(variationCandidate);
      if (valResult.isValid) {
        // Mark as published and save to repository
        variationCandidate.status = 'PUBLISHED';
        variationCandidate.validationLog = valResult.log;
        variationCandidate.generationMetadata = {
          generationType: 'PARAMETERIZED_VARIATION',
          sourceProblemId: variationCandidate.sourceProblemId,
          timestamp: new Date().toISOString(),
          duplicateScore: dupResult.score,
        };
        QuestionBankRepository.saveProblem(variationCandidate);

        return {
          problem: variationCandidate,
          reasonCode: 'DYNAMIC_VARIATION',
          explanation: `All standard problems in ${variationCandidate.topicName} were solved! Here is an adaptive variation with modified constraints.`,
          targetTopic,
          tier: 2,
          isGenerated: true,
        };
      } else {
        variationCandidate.status = 'REJECTED';
        variationCandidate.validationLog = valResult.log;
        QuestionBankRepository.saveProblem(variationCandidate);
      }
    }
  }

  // =========================================================================
  // TIER 3: LLM Generation + Sandbox Validation + Duplicate Check
  // =========================================================================
  const rateLimit = QuestionBankRepository.checkAndIncrementRateLimit(context.userId);
  if (rateLimit.allowed) {
    const llmCandidate = await generateProblemViaLLM(
      {
        topic: targetTopic,
        difficulty: targetDifficulty,
        studentMastery: masteryScore,
        prerequisites: TOPIC_PREREQUISITES[targetTopic] || [],
      },
      existingSlugs
    );

    if (llmCandidate) {
      // Quality Gate 1: Check Duplicate
      const dupResult = checkDuplicate(llmCandidate, allPublished);
      if (!dupResult.isDuplicate) {
        // Quality Gate 2: Sandbox Validation
        const valResult = await validateProblemCandidate(llmCandidate);
        if (valResult.isValid) {
          llmCandidate.status = 'PUBLISHED';
          llmCandidate.validationLog = valResult.log;
          QuestionBankRepository.saveProblem(llmCandidate);

          return {
            problem: llmCandidate,
            reasonCode: 'LLM_GENERATED',
            explanation: `AI-Synthesized challenge calibrated specifically for your current mastery level in ${llmCandidate.topicName}.`,
            targetTopic,
            tier: 3,
            isGenerated: true,
          };
        } else {
          llmCandidate.status = 'REJECTED';
          llmCandidate.validationLog = valResult.log;
          QuestionBankRepository.saveProblem(llmCandidate);
        }
      }
    }
  }

  // =========================================================================
  // TIER 4: Graceful Fallbacks (Never serve unvalidated questions)
  // =========================================================================

  // Fallback 4A: Prerequisite topic unsolved problem
  const prereqs = TOPIC_PREREQUISITES[targetTopic] || [];
  for (const prereq of prereqs) {
    const prereqProb = allPublished.find((p) => p.topic === prereq && !solvedSet.has(p.id));
    if (prereqProb) {
      return {
        problem: prereqProb,
        reasonCode: 'PREREQ_RECOVERY',
        explanation: `Topic ${targetTopic} catalog is currently complete. Revisiting foundational practice in ${prereqProb.topicName}.`,
        targetTopic: prereq,
        tier: 4,
        isGenerated: false,
      };
    }
  }

  // Fallback 4B: Spaced revision pick from already solved problems
  const revisionCandidate = allPublished.find((p) => solvedSet.has(p.id));
  if (revisionCandidate) {
    return {
      problem: revisionCandidate,
      reasonCode: 'SPACED_REVISION',
      explanation: `Mastery refresh: You've conquered all new problems! Here is a spaced repetition pick to keep your logic sharp.`,
      targetTopic: revisionCandidate.topic,
      tier: 4,
      isGenerated: false,
    };
  }

  // Fallback 4C: Honest transparent message
  const fallbackProblem = allPublished[0];
  return {
    problem: fallbackProblem,
    reasonCode: 'CATALOG_EXHAUSTED',
    explanation: 'You have solved all current curriculum problems! Our authoring pipeline is creating new validated sets.',
    targetTopic: fallbackProblem.topic,
    tier: 4,
    isGenerated: false,
  };
}
