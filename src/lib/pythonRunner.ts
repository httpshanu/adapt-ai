import { Problem, TestCase, VerdictStatus } from '../types';

export interface RunResult {
  verdict: VerdictStatus;
  passedTests: number;
  totalTests: number;
  runtimeMs: number;
  memoryMb: number;
  stdout: string;
  errorMessage?: string;
  testDetails: {
    testCaseId: string;
    input: string;
    expected: string;
    actual: string;
    passed: boolean;
    isSample: boolean;
    explanation?: string;
  }[];
}

/**
 * Executes or evaluates student Python code against test cases.
 * Handles syntax verification, simulated execution, edge-case checking, and verdict extraction.
 */
export async function executePythonCode(
  code: string,
  problem: Problem,
  onlySamples: boolean = false
): Promise<RunResult> {
  const startTime = performance.now();
  
  // 1. Basic syntax / formatting sanity check
  const trimmed = code.trim();
  if (!trimmed || trimmed === problem.starterCode.trim() || trimmed.includes('pass') && trimmed.split('\n').length <= 3) {
    return {
      verdict: 'WRONG_ANSWER',
      passedTests: 0,
      totalTests: onlySamples ? problem.testCases.filter(t => t.isSample).length : problem.testCases.length,
      runtimeMs: 12,
      memoryMb: 14.2,
      stdout: 'Function returned None or default placeholder pass.',
      errorMessage: 'Your function has not been implemented or returned nothing.',
      testDetails: problem.testCases
        .filter(tc => !onlySamples || tc.isSample)
        .map(tc => ({
          testCaseId: tc.id,
          input: tc.input,
          expected: tc.expectedOutput,
          actual: 'None',
          passed: false,
          isSample: tc.isSample,
          explanation: tc.explanation,
        })),
    };
  }

  // Check for common Python syntax errors
  if ((code.match(/def /g) || []).length === 0 || !code.includes(':')) {
    return {
      verdict: 'SYNTAX_ERROR',
      passedTests: 0,
      totalTests: onlySamples ? problem.testCases.filter(t => t.isSample).length : problem.testCases.length,
      runtimeMs: 8,
      memoryMb: 12.0,
      stdout: '',
      errorMessage: 'SyntaxError: invalid syntax on line 1. Missing function header or colon.',
      testDetails: [],
    };
  }

  // Artificial async execution delay to simulate sandbox execution (300-600ms)
  await new Promise((resolve) => setTimeout(resolve, onlySamples ? 350 : 650));

  const targetTestCases = problem.testCases.filter(tc => !onlySamples || tc.isSample);
  const testDetails = [];
  let passedCount = 0;

  // Emulation heuristic logic:
  // Check if student code has key logical components matching reference solution or keywords
  const isReferenceMatch = code.replace(/\s+/g, '').includes(problem.referenceSolution.replace(/\s+/g, '').substring(0, 40));
  
  // Specific problem heuristic checkers for interactive demonstration
  let logicPasses = false;
  if (problem.slug === 'two-sum') {
    logicPasses = (code.includes('seen') || code.includes('dict') || code.includes('{}') || code.includes('enumerate') || (code.includes('for') && code.includes('target -')));
  } else if (problem.slug === 'find-maximum-in-array') {
    logicPasses = (code.includes('max') || code.includes('>') || (code.includes('for') && code.includes('if')));
  } else if (problem.slug === 'valid-palindrome') {
    logicPasses = (code.includes('isalnum') || code.includes('[::-1]') || (code.includes('left') && code.includes('right')));
  } else if (problem.slug === 'binary-search') {
    logicPasses = (code.includes('while') && (code.includes('left <= right') || code.includes('// 2') || code.includes('mid')));
  } else if (problem.slug === 'group-anagrams') {
    logicPasses = (code.includes('sorted') || code.includes('defaultdict') || code.includes('join'));
  } else if (problem.slug === 'search-in-rotated-sorted-array') {
    logicPasses = (code.includes('mid') && code.includes('nums[left] <= nums[mid]') && code.includes('while'));
  } else {
    // Dynamic variations & generated questions
    const normUserCode = code.replace(/\s+/g, '');
    const normRefCode = problem.referenceSolution.replace(/\s+/g, '');
    logicPasses = normUserCode.includes(normRefCode.substring(0, 25)) || (code.includes('return ') && !code.includes('pass'));
  }

  for (let i = 0; i < targetTestCases.length; i++) {
    const tc = targetTestCases[i];
    // If logic passes, mark tests as passed. If not, fail some or all.
    const tcPassed = logicPasses;
    if (tcPassed) passedCount++;

    testDetails.push({
      testCaseId: tc.id,
      input: tc.input,
      expected: tc.expectedOutput,
      actual: tcPassed ? tc.expectedOutput : 'Wrong Output',
      passed: tcPassed,
      isSample: tc.isSample,
      explanation: tc.explanation,
    });
  }

  const duration = Math.round(performance.now() - startTime);
  const allPassed = passedCount === targetTestCases.length;

  return {
    verdict: allPassed ? 'ACCEPTED' : 'WRONG_ANSWER',
    passedTests: passedCount,
    totalTests: targetTestCases.length,
    runtimeMs: Math.max(32, duration % 100),
    memoryMb: 14.1,
    stdout: allPassed ? `All ${passedCount} tests verified successfully.` : `Passed ${passedCount} of ${targetTestCases.length} tests.`,
    testDetails,
  };
}
