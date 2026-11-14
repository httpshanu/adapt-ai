import { DiagnosticQuestion } from '../types';

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  // Arrays
  {
    id: 'dq_arr_1',
    topic: 'arrays',
    topicName: 'Arrays',
    difficulty: 'EASY',
    questionText: 'What is the average time complexity of accessing an element at a given index in a dynamic array (like Python list)?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'],
    correctOptionIndex: 0,
    explanation: 'Array elements reside in contiguous memory, allowing constant time O(1) arithmetic addressing base + (index * size).',
  },
  {
    id: 'dq_arr_2',
    topic: 'arrays',
    topicName: 'Arrays',
    difficulty: 'MEDIUM',
    questionText: 'What is the worst-case time complexity of inserting an element at the beginning (index 0) of an array with n elements?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctOptionIndex: 2,
    explanation: 'Inserting at index 0 requires shifting all n existing elements one position to the right, which takes O(n) time.',
  },
  {
    id: 'dq_arr_3',
    topic: 'arrays',
    topicName: 'Arrays',
    difficulty: 'MEDIUM',
    questionText: 'Which algorithmic pattern is best suited for computing running cumulative sums to answer range query sums in O(1)?',
    options: ['Sliding Window', 'Prefix Sum Array', 'Binary Search', 'Two Pointers'],
    correctOptionIndex: 1,
    explanation: 'A Prefix Sum array precalculates sums up to index i, allowing sum(L, R) = prefix[R] - prefix[L-1] in O(1) time.',
  },

  // Strings
  {
    id: 'dq_str_1',
    topic: 'strings',
    topicName: 'Strings',
    difficulty: 'EASY',
    questionText: 'In Python, strings are immutable. What happens when you repeatedly do s += char in a loop of length n?',
    options: [
      'It modifies the existing string in-place in O(n) total time.',
      'It creates a new string object each time, leading to O(n^2) total time.',
      'Python compiles it automatically to O(1) time.',
      'It throws a MemoryAllocationException.'
    ],
    correctOptionIndex: 1,
    explanation: 'Because strings are immutable, concatenation creates a new string copy each iteration, causing O(n^2) overhead. Using "".join(list) is O(n).',
  },
  {
    id: 'dq_str_2',
    topic: 'strings',
    topicName: 'Strings',
    difficulty: 'MEDIUM',
    questionText: 'What is the ideal pointer movement technique to check if a string is a palindrome without extra memory?',
    options: [
      'Slow and Fast pointer starting at index 0',
      'Two pointers starting from opposite ends (left=0, right=len-1) moving towards center',
      'Nested loops comparing each character with all others',
      'A queue and a stack'
    ],
    correctOptionIndex: 1,
    explanation: 'Two pointers moving inward check symmetric characters in O(n) time with O(1) space.',
  },

  // Searching
  {
    id: 'dq_sea_1',
    topic: 'searching',
    topicName: 'Searching',
    difficulty: 'EASY',
    questionText: 'What prerequisite condition MUST be satisfied before you can apply Binary Search on an array?',
    options: [
      'The array must contain only positive integers.',
      'The array elements must be sorted in a monotonic order.',
      'The array size must be a power of 2.',
      'All elements must be distinct.'
    ],
    correctOptionIndex: 1,
    explanation: 'Binary Search relies on monotonic ordering to eliminate half of the remaining search space at every comparison.',
  },
  {
    id: 'dq_sea_2',
    topic: 'searching',
    topicName: 'Searching',
    difficulty: 'MEDIUM',
    questionText: 'In Binary Search over an array of size 1,000,000, roughly how many comparisons are needed in the worst case?',
    options: ['Around 10', 'Around 20', 'Around 10,000', 'Around 500,000'],
    correctOptionIndex: 1,
    explanation: 'log2(1,000,000) is approximately 20 (since 2^20 = 1,048,576).',
  },

  // Hashing
  {
    id: 'dq_hash_1',
    topic: 'hashing',
    topicName: 'Hashing',
    difficulty: 'EASY',
    questionText: 'What is the average time complexity to lookup a key in a well-balanced Hash Table (Python dictionary)?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctOptionIndex: 0,
    explanation: 'Hash functions map keys to array buckets directly in O(1) average time.',
  },
  {
    id: 'dq_hash_2',
    topic: 'hashing',
    topicName: 'Hashing',
    difficulty: 'MEDIUM',
    questionText: 'When using a Hash Table to solve the "Two Sum" problem in one pass, what do you store as the key and value?',
    options: [
      'Key: array index, Value: element value',
      'Key: element value, Value: array index',
      'Key: target sum, Value: element value',
      'Key: element frequency, Value: element value'
    ],
    correctOptionIndex: 1,
    explanation: 'Storing key = num and value = index allows looking up `target - current_num` in O(1) time to immediately retrieve its original index.',
  },
];
