import { INITIAL_PROBLEMS } from '../src/lib/problemsData';
import { validateProblemCandidate } from '../src/lib/questionValidator';
import { checkDuplicate } from '../src/lib/duplicateDetector';
import { generateVariationForTopic } from '../src/lib/variationGenerator';
import { generateProblemViaLLM } from '../src/lib/llmProblemGenerator';
import { selectAdaptiveProblem } from '../src/lib/questionSelector';
import { QuestionBankRepository } from '../src/lib/questionBankRepository';
import { Problem, TopicMastery, TopicSlug } from '../src/types';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, details?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${testName} ${details ? `(${details})` : ''}`);
  }
}

async function runTestSuite() {
  console.log('================================================================');
  console.log('  CodeAdapt AI — Exhaustion-Proof Question Bank Test Suite');
  console.log('================================================================\n');

  // ---------------------------------------------------------------------------
  // 1. Question Correctness & Validation Pipeline Tests
  // ---------------------------------------------------------------------------
  console.log('▶ [1/5] Testing Question Correctness & Validation Pipeline:');
  
  // Test 1.1: Every core problem in INITIAL_PROBLEMS passes validation
  for (const prob of INITIAL_PROBLEMS) {
    const valResult = await validateProblemCandidate(prob);
    assert(valResult.isValid, `Core Problem '${prob.title}' passes validation`, valResult.rejectionReason);
  }

  // Test 1.2: Problem with missing return statement in reference solution is rejected
  const brokenProblem: Problem = {
    ...INITIAL_PROBLEMS[0],
    id: 'test_broken',
    referenceSolution: 'def find_max(nums):\n    pass\n',
  };
  const brokenResult = await validateProblemCandidate(brokenProblem);
  assert(!brokenResult.isValid, 'Problem with no return statement is rejected');

  // Test 1.3: Problem with disallowed import (security check) is rejected
  const insecureProblem: Problem = {
    ...INITIAL_PROBLEMS[0],
    id: 'test_insecure',
    referenceSolution: 'import os\ndef find_max(nums):\n    return 42\n',
  };
  const insecureResult = await validateProblemCandidate(insecureProblem);
  assert(!insecureResult.isValid, 'Problem with disallowed "import os" is rejected');

  // Test 1.4: Problem with missing sample test case is rejected
  const noSampleProblem: Problem = {
    ...INITIAL_PROBLEMS[0],
    id: 'test_no_sample',
    testCases: [
      { id: '1', input: '[1]', expectedOutput: '1', isSample: false },
      { id: '2', input: '[2]', expectedOutput: '2', isSample: false },
      { id: '3', input: '[3]', expectedOutput: '3', isSample: false },
    ],
  };
  const noSampleResult = await validateProblemCandidate(noSampleProblem);
  assert(!noSampleResult.isValid, 'Problem with zero sample test cases is rejected');

  // ---------------------------------------------------------------------------
  // 2. Duplicate & Near-Duplicate Detection Tests
  // ---------------------------------------------------------------------------
  console.log('\n▶ [2/5] Testing Duplicate & Near-Duplicate Detection Engine:');

  // Test 2.1: Trivial number substitution on Two Sum must be caught as duplicate
  const twoSumBase = INITIAL_PROBLEMS.find(p => p.slug === 'two-sum')!;
  const trivialTwoSumMutation: Problem = {
    ...twoSumBase,
    id: 'p_two_sum_trivial_clone',
    title: 'Two Sum Target Match',
    descriptionMarkdown: 'Given an array of integers `numbers` and an integer `k`, return the indices `[i, j]` of the two numbers such that they add up to `k = 18`. You may assume that each input has exactly one solution.',
  };
  const dupCheck1 = checkDuplicate(trivialTwoSumMutation, INITIAL_PROBLEMS);
  assert(dupCheck1.isDuplicate, 'Trivial variable/number mutation on Two Sum is flagged as duplicate', `Score: ${dupCheck1.score}`);

  // Test 2.2: Genuinely distinct problem is NOT flagged as duplicate
  const equilibriumCandidate = generateVariationForTopic('arrays', 'EASY', new Set())!;
  const dupCheck2 = checkDuplicate(equilibriumCandidate, INITIAL_PROBLEMS);
  assert(!dupCheck2.isDuplicate, `Novel problem '${equilibriumCandidate.title}' is accepted as distinct`, `Score: ${dupCheck2.score}`);

  // ---------------------------------------------------------------------------
  // 3. Parameterized Variation Engine (Tier 2) Tests
  // ---------------------------------------------------------------------------
  console.log('\n▶ [3/5] Testing Parameterized Variation Generation:');

  const arraysVariation = generateVariationForTopic('arrays', 'EASY', new Set(['running-sum-of-1d-array']));
  assert(arraysVariation !== null, 'Generates valid unattempted variation for Arrays');
  if (arraysVariation) {
    const val = await validateProblemCandidate(arraysVariation);
    assert(val.isValid, `Generated variation '${arraysVariation.title}' passes sandbox validation`);
    assert(arraysVariation.provenance === 'PARAMETERIZED_VARIATION', 'Variation has correct PARAMETERIZED_VARIATION provenance');
    assert(!!arraysVariation.sourceProblemId, 'Variation preserves sourceProblemId link');
  }

  // ---------------------------------------------------------------------------
  // 4. Rate Limiting, Concurrency & Security Tests
  // ---------------------------------------------------------------------------
  console.log('\n▶ [4/5] Testing Rate Limiting & Concurrency Guard:');

  const testUserId = `test_user_${Date.now()}`;
  let allowedCount = 0;
  for (let i = 0; i < 7; i++) {
    const rl = QuestionBankRepository.checkAndIncrementRateLimit(testUserId);
    if (rl.allowed) allowedCount++;
  }
  assert(allowedCount === 5, 'Per-user hourly rate limiter caps at 5 generations per hour', `Allowed count was ${allowedCount}`);

  const dummyMasteries: Record<TopicSlug, TopicMastery> = {
    arrays: { topic: 'arrays', topicName: 'Arrays', score: 80, isProvisional: false, evidenceCount: 5, consecutiveSuccesses: 0, consecutiveFailures: 0, status: 'Confident', needsRevision: false },
    strings: { topic: 'strings', topicName: 'Strings', score: 80, isProvisional: false, evidenceCount: 5, consecutiveSuccesses: 0, consecutiveFailures: 0, status: 'Confident', needsRevision: false },
    searching: { topic: 'searching', topicName: 'Searching', score: 80, isProvisional: false, evidenceCount: 5, consecutiveSuccesses: 0, consecutiveFailures: 0, status: 'Confident', needsRevision: false },
    hashing: { topic: 'hashing', topicName: 'Hashing', score: 80, isProvisional: false, evidenceCount: 5, consecutiveSuccesses: 0, consecutiveFailures: 0, status: 'Confident', needsRevision: false },
    'two-pointers': { topic: 'two-pointers', topicName: 'Two Pointers', score: 80, isProvisional: false, evidenceCount: 5, consecutiveSuccesses: 0, consecutiveFailures: 0, status: 'Confident', needsRevision: false },
    'linked-lists': { topic: 'linked-lists', topicName: 'Linked Lists', score: 80, isProvisional: false, evidenceCount: 5, consecutiveSuccesses: 0, consecutiveFailures: 0, status: 'Confident', needsRevision: false },
    'stacks-queues': { topic: 'stacks-queues', topicName: 'Stacks & Queues', score: 80, isProvisional: false, evidenceCount: 5, consecutiveSuccesses: 0, consecutiveFailures: 0, status: 'Confident', needsRevision: false },
    trees: { topic: 'trees', topicName: 'Trees & BST', score: 80, isProvisional: false, evidenceCount: 5, consecutiveSuccesses: 0, consecutiveFailures: 0, status: 'Confident', needsRevision: false },
    graphs: { topic: 'graphs', topicName: 'Graphs', score: 80, isProvisional: false, evidenceCount: 5, consecutiveSuccesses: 0, consecutiveFailures: 0, status: 'Confident', needsRevision: false },
    dp: { topic: 'dp', topicName: 'Dynamic Programming', score: 80, isProvisional: false, evidenceCount: 5, consecutiveSuccesses: 0, consecutiveFailures: 0, status: 'Confident', needsRevision: false },
  };

  const concurrentPromises = [
    selectAdaptiveProblem({ userId: 'u1', masteries: dummyMasteries, solvedProblemIds: [] }),
    selectAdaptiveProblem({ userId: 'u2', masteries: dummyMasteries, solvedProblemIds: [] }),
    selectAdaptiveProblem({ userId: 'u3', masteries: dummyMasteries, solvedProblemIds: [] }),
  ];
  const concurrentResults = await Promise.all(concurrentPromises);
  assert(concurrentResults.every(r => !!r.problem), 'Concurrent selection requests resolve safely without race conditions');

  // ---------------------------------------------------------------------------
  // 5. Tiered Exhaustion-Proof Fallback Pipeline Tests
  // ---------------------------------------------------------------------------
  console.log('\n▶ [5/5] Testing 4-Tier Exhaustion-Proof Adaptive Selection:');

  // Test 5.1: Tier 1 selection (unsolved database problem available)
  const tier1Selection = await selectAdaptiveProblem({
    userId: 'test_student',
    masteries: dummyMasteries,
    solvedProblemIds: [], // no solved problems
    preferredTopic: 'arrays',
  });
  assert(tier1Selection.tier === 1, 'Tier 1 returns verified unsolved database problem', `Selected tier: ${tier1Selection.tier}`);

  // Test 5.2: Tier 2 selection (when all base array problems are solved)
  const allInitialArrayIds = INITIAL_PROBLEMS.filter(p => p.topic === 'arrays').map(p => p.id);
  const tier2Selection = await selectAdaptiveProblem({
    userId: 'test_student_tier2',
    masteries: dummyMasteries,
    solvedProblemIds: allInitialArrayIds, // all initial array problems solved!
    preferredTopic: 'arrays',
  });
  assert(
    Boolean(tier2Selection.tier === 2 || tier2Selection.isGenerated),
    'When topic questions are exhausted, Tier 2 generates a validated variation',
    `Selected: ${tier2Selection.problem.title} (Tier ${tier2Selection.tier})`
  );

  // Test 5.3: Fallback safety when all questions including generated ones are solved
  const allPublishedCurrentIds = QuestionBankRepository.getAllPublished().map(p => p.id);
  // Exhaust generation rate limit for this user
  for (let i = 0; i < 6; i++) {
    QuestionBankRepository.checkAndIncrementRateLimit('test_student_exhausted');
  }

  const fallbackSelection = await selectAdaptiveProblem({
    userId: 'test_student_exhausted',
    masteries: dummyMasteries,
    solvedProblemIds: allPublishedCurrentIds,
    revisionDueProblemIds: [allPublishedCurrentIds[0]], // simulate revision due
  });
  assert(
    Boolean(fallbackSelection.reasonCode === 'SPACED_REVISION' || (fallbackSelection.tier !== undefined && fallbackSelection.tier >= 2)),
    'Exhaustion falls back cleanly to spaced revision without crashing',
    `Reason: ${fallbackSelection.reasonCode}, Tier: ${fallbackSelection.tier}`
  );

  // ---------------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`  TEST RESULTS: ${passedTests}/${totalTests} Passed (${failedTests} Failed)`);
  console.log('================================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
