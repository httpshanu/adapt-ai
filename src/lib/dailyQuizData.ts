import { DailyQuizQuestion } from '../types';

export const ALL_DAILY_QUIZ_POOL: Omit<DailyQuizQuestion, 'date'>[] = [
  {
    id: 'dq_1',
    topic: 'Time Complexity',
    question: 'What is the worst-case time complexity of searching for an element in a balanced Binary Search Tree (AVL / Red-Black)?',
    codeSnippet: `// Balanced BST Lookup
int search(Node* root, int key) {
    if (!root || root->val == key) return root != nullptr;
    if (key < root->val) return search(root->left, key);
    return search(root->right, key);
}`,
    language: 'cpp',
    options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
    correctIndex: 1,
    explanation: 'A balanced binary search tree maintains height of floor(log2(N)), ensuring that search, insertion, and deletion always execute in O(log N) worst-case time.',
    xpReward: 30,
  },
  {
    id: 'dq_2',
    topic: 'Arrays & Two Pointers',
    question: 'What does this two-pointer snippet return when nums = [2, 7, 11, 15] and target = 9?',
    codeSnippet: `def two_sum_sorted(nums, target):
    left, right = 0, len(nums) - 1
    while left < right:
        s = nums[left] + nums[right]
        if s == target:
            return [left, right]
        elif s < target:
            left += 1
        else:
            right -= 1
    return []`,
    language: 'python',
    options: ['[0, 1]', '[1, 2]', '[0, 3]', '[]'],
    correctIndex: 0,
    explanation: 'nums[0] + nums[1] = 2 + 7 = 9. The condition s == target matches on the very first iteration, returning [0, 1].',
    xpReward: 30,
  },
  {
    id: 'dq_3',
    topic: 'Strings & Memory',
    question: 'In Java, what happens in memory when you execute the following concatenation in a loop?',
    codeSnippet: `String s = "";
for (int i = 0; i < n; i++) {
    s += i;
}`,
    language: 'java',
    options: [
      'Executes in O(n) time with a single mutable buffer',
      'Creates a new String object in each iteration, leading to O(n²) time',
      'Throws a StringIndexOutOfBoundsException',
      'Compiler automatically converts loop to a single StringBuilder at runtime',
    ],
    correctIndex: 1,
    explanation: 'Strings in Java are immutable. Inside a loop, s += i creates a new StringBuilder, appends, and produces a new String object each cycle, causing O(n²) time complexity.',
    xpReward: 30,
  },
  {
    id: 'dq_4',
    topic: 'Hashing & Collisions',
    question: 'Which collision resolution technique stores all elements hashing to the same slot in a linked list?',
    options: ['Linear Probing', 'Separate Chaining', 'Quadratic Probing', 'Double Hashing'],
    correctIndex: 1,
    explanation: 'Separate Chaining resolves collisions by maintaining an auxiliary data structure (usually a linked list or red-black tree) at each bucket in the hash table.',
    xpReward: 30,
  },
  {
    id: 'dq_5',
    topic: 'Recursion & Stack',
    question: 'What is the return value of mystery(4) in this recursive function?',
    codeSnippet: `def mystery(n):
    if n <= 1:
        return 1
    return n * mystery(n - 1)`,
    language: 'python',
    options: ['16', '24', '12', '10'],
    correctIndex: 1,
    explanation: 'This computes factorial(4): 4 * 3 * 2 * 1 = 24.',
    xpReward: 30,
  },
  {
    id: 'dq_6',
    topic: 'Dynamic Programming',
    question: 'What are the two essential properties a problem must possess for Dynamic Programming to be applicable?',
    options: [
      'Greedy choice property & Optimal substructure',
      'Overlapping subproblems & Optimal substructure',
      'Divide and conquer & Polynomial time',
      'Monotonic stack & Topological ordering',
    ],
    correctIndex: 1,
    explanation: 'DP requires Overlapping Subproblems (sub-problems are solved repeatedly) and Optimal Substructure (optimal solution can be constructed from optimal sub-solutions).',
    xpReward: 30,
  },
  {
    id: 'dq_7',
    topic: 'Stacks & Queues',
    question: 'Which data structure is ideal for checking if an arithmetic expression has balanced parentheses `({[]})`?',
    options: ['FIFO Queue', 'LIFO Stack', 'Min-Heap', 'Binary Tree'],
    correctIndex: 1,
    explanation: 'A stack operates in Last-In First-Out (LIFO) order, which matches the nested nature of closing parentheses with their most recent open counterpart.',
    xpReward: 30,
  },
];

export function getTodayDateKey(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export function getTodayQuizQuestions(dateKey: string = getTodayDateKey()): DailyQuizQuestion[] {
  // Derive a deterministic seed from the date string (e.g., 2026-11-14)
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash << 5) - hash + dateKey.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);

  const total = ALL_DAILY_QUIZ_POOL.length;
  const pickedIndices: number[] = [];
  
  for (let i = 0; i < 3; i++) {
    let index = (positiveHash + i * 2) % total;
    while (pickedIndices.includes(index)) {
      index = (index + 1) % total;
    }
    pickedIndices.push(index);
  }

  return pickedIndices.map((idx, qNum) => ({
    ...ALL_DAILY_QUIZ_POOL[idx],
    id: `dq_${dateKey}_${qNum + 1}`,
    date: dateKey,
  }));
}
