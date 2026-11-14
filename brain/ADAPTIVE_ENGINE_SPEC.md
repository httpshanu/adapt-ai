# CodeAdapt AI — Adaptive Engine Algorithmic Specification

**Document Status:** Complete Implementation & Verification Guide  
**Module:** `services/adaptive-engine`  
**Purpose:** Mathematical formulas, decision heuristics, state machines, and unit test verification matrices for real-time mastery calculation and next-problem recommendation.

---

## 1. Mathematical Mastery Formulation

### 1.1 The Continuous Rolling Update Formula
Mastery $M_{topic}$ is maintained on the bounded continuum $[0.00, 100.00]$. Following each evaluated submission on topic $T$:

$$M_{new} = \text{clamp}\Big((1 - \alpha) \cdot M_{current} + \alpha \cdot S_{attempt},\; 0.00,\; 100.00\Big)$$

Where:
- $\alpha$: Learning momentum parameter. Standardized at $\alpha = 0.20$ for MVP (configurable via environment variable `ADAPTIVE_ALPHA`).
- $S_{attempt}$: Normalized Attempt Performance Score $[0, 100]$.

### 1.2 Attempt Performance Score Computation ($S_{attempt}$)

$$S_{attempt} = \text{BaseVerdictScore} \times \text{DifficultyWeight} \times \text{HintModifier}$$

#### A. Base Verdict Scores
- **Accepted (AC):** $100$
- **Wrong Answer (WA):** Evaluated proportionally to passed test ratio:
  $$S_{WA} = \max\left(20,\; \left\lfloor \frac{\text{Passed Tests}}{\text{Total Tests}} \times 60 \right\rfloor\right)$$
- **Time Limit Exceeded (TLE) / Memory Limit (MLE):** $30$ (indicates correct algorithm logic in some cases but sub-optimal complexity).
- **Runtime Error (RTE):** $20$ (crashed midway).
- **Syntax / Compilation Error:** $\Delta M = 0$ (Do not update mastery; student gets compiler feedback).
- **Judge Infrastructure Error (503 / Timeout):** $\Delta M = 0$ (Do not penalize the student).

#### B. Difficulty Multipliers
- **Easy Problem:** $1.00$ (or $0.85$ if student current mastery $M_{current} \ge 75$, to avoid inflation from trivial problems).
- **Medium Problem:** $1.00$.
- **Hard Problem:** $1.20$ (capped at max score of $100$).

#### C. Hint Penalty Multipliers
- 0 Hints Used: $1.00$ (Full score credit)
- 1 Hint Revealed (Conceptual): $0.90$
- 2 Hints Revealed (Pattern / Invariant): $0.75$
- 3 Hints Revealed (Pseudocode Walkthrough): $0.55$

---

## 2. Worked Examples & State Transitions

### Example 1: Accepted Submission
- Prior Mastery: $M_{current} = 60.0$
- Verdict: Accepted (AC), Medium problem, 0 hints used $\implies S_{attempt} = 100.0$
- Formula:
  $$M_{new} = (1 - 0.2) \times 60.0 + 0.2 \times 100.0 = 48.0 + 20.0 = \mathbf{68.0}$$

### Example 2: Wrong Answer Submission
- Prior Mastery: $M_{current} = 60.0$
- Verdict: Wrong Answer (failed on boundary condition, passed 2/10 tests) $\implies S_{attempt} = 20.0$
- Formula:
  $$M_{new} = (1 - 0.2) \times 60.0 + 0.2 \times 20.0 = 48.0 + 4.0 = \mathbf{52.0}$$

### Example 3: Syntax Error or Judge Timeout
- Prior Mastery: $M_{current} = 60.0$
- Verdict: Syntax error
- Result: $\Delta M = 0 \implies M_{new} = \mathbf{60.0}$ (Attempt recorded in log, but mastery calculation bypassed).

---

## 3. Seven Canonical QA & Production Scenarios

These seven scenarios are required to pass automated test suites (`test_adaptive_scenarios.py` / `adaptive.test.ts`):

```
+-------------------------------------------------------------------------------------------------------------+
| # | Test Scenario Context               | Expected System Behavior               | Transparent Reason Code  |
+---+-------------------------------------+----------------------------------------+--------------------------+
| 1 | New user with Searching mastery 31  | Selects Easy searching problem or       | "Build searching basics  |
|   | (Foundational band < 40)            | prerequisite topic revision.           | before harder problems." |
+---+-------------------------------------+----------------------------------------+--------------------------+
| 2 | Mastery 60, single Wrong Answer     | Small mastery drop (60 -> 52);         | "Let's try another       |
|   | on Medium problem                   | recommends similar-level problem.      | problem at this level."  |
+---+-------------------------------------+----------------------------------------+--------------------------+
| 3 | Three consecutive Wrong Answers     | Intervenes: offers progressive hints;  | "Reviewing a prerequisite|
|   | on same topic                       | recommends prerequisite or Easy.       | may help."               |
+---+-------------------------------------+----------------------------------------+--------------------------+
| 4 | Mastery 80, three consecutive       | Promotes difficulty: recommends Hard   | "You solved several      |
|   | Accepted submissions on Medium      | problem or composite topic challenge.  | mediums, try a harder."  |
+---+-------------------------------------+----------------------------------------+--------------------------+
| 5 | Syntax error submitted              | No change to mastery (Delta = 0);      | None (Feedback directly  |
|   | (Invalid Python syntax)             | student views syntax traceback.        | in editor console).      |
+---+-------------------------------------+----------------------------------------+--------------------------+
| 6 | Judge runner timeout / 503 error    | No change to mastery (Delta = 0);      | "System issue, not your  |
|   |                                     | instant retry action surfaced.         | answer."                 |
+---+-------------------------------------+----------------------------------------+--------------------------+
| 7 | All eligible problems in topic      | Honest feedback; pulls from Spaced     | "No new problems yet;    |
|   | solved by user                      | Repetition queue or next topic.        | here is a revision pick."|
+-------------------------------------------------------------------------------------------------------------+
```

---

## 4. Pseudocode Implementation of Engine

```typescript
export interface StudentProfile {
  userId: string;
  topicMasteries: Record<string, number>;
  consecutiveSuccesses: Record<string, number>;
  consecutiveFailures: Record<string, number>;
  solvedProblemIds: Set<string>;
  revisionQueueIds: Set<string>;
}

export function computeNextRecommendation(
  student: StudentProfile,
  allProblems: Problem[],
  topicPrereqMap: Record<string, string[]>
): RecommendationResult {
  // 1. Spaced Repetition Priority
  if (student.revisionQueueIds.size > 0) {
    const revisionId = Array.from(student.revisionQueueIds)[0];
    const problem = allProblems.find(p => p.id === revisionId);
    if (problem) {
      return {
        problem,
        reasonCode: 'SPACED_REVISION',
        explanation: 'It is time for a quick refresher to lock this concept into long-term memory.'
      };
    }
  }

  // 2. Identify Focus Topic
  // Find topic with consecutive failures >= 3 or lowest mastery
  let focusTopic = Object.keys(student.topicMasteries).reduce((lowest, topic) => 
    student.topicMasteries[topic] < student.topicMasteries[lowest] ? topic : lowest
  );

  // Recovery Check: 3 failures in a row
  if ((student.consecutiveFailures[focusTopic] || 0) >= 3) {
    const prereqs = topicPrereqMap[focusTopic] || [];
    for (const prereq of prereqs) {
      if ((student.topicMasteries[prereq] || 0) < 60) {
        const prereqProblem = findUnsolvedProblem(allProblems, prereq, 'EASY', student.solvedProblemIds);
        if (prereqProblem) {
          return {
            problem: prereqProblem,
            reasonCode: 'PREREQ_RECOVERY',
            explanation: `Reviewing prerequisite concepts in ${prereq} will help unblock you here.`
          };
        }
      }
    }
  }

  // 3. Determine Target Difficulty Band
  const currentMastery = student.topicMasteries[focusTopic] || 0;
  let targetDifficulty: 'EASY' | 'MEDIUM' | 'HARD' = 'EASY';

  if ((student.consecutiveSuccesses[focusTopic] || 0) >= 3 && currentMastery >= 75) {
    targetDifficulty = 'HARD';
  } else if (currentMastery >= 40) {
    targetDifficulty = 'MEDIUM';
  }

  // 4. Find Unsolved Problem matching Topic & Difficulty
  let candidate = findUnsolvedProblem(allProblems, focusTopic, targetDifficulty, student.solvedProblemIds);

  // Fallback 1: Try adjacent difficulty in same topic
  if (!candidate && targetDifficulty === 'HARD') {
    candidate = findUnsolvedProblem(allProblems, focusTopic, 'MEDIUM', student.solvedProblemIds);
  }
  if (!candidate) {
    candidate = findUnsolvedProblem(allProblems, focusTopic, 'EASY', student.solvedProblemIds);
  }

  // Fallback 2: Catalog Exhaustion
  if (!candidate) {
    return {
      problem: null,
      reasonCode: 'CATALOG_EXHAUSTED',
      explanation: 'You have solved all current problems in this topic! More problems are on the way.'
    };
  }

  return {
    problem: candidate,
    reasonCode: currentMastery < 40 ? 'INIT_BASELINE' : 'CONSOLIDATE_LEVEL',
    explanation: currentMastery < 40 
      ? 'Build fundamental confidence before advancing to complex problems.'
      : 'Solidify your problem-solving patterns at your current mastery level.'
  };
}
```
