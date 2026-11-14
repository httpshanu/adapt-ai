import { BugHuntChallenge } from '../types';

export const BUG_HUNT_CHALLENGES: BugHuntChallenge[] = [
  {
    id: 'bug_1',
    title: 'The Infinite Binary Search',
    topic: 'Searching',
    difficulty: 'EASY',
    description: 'This binary search implementation gets stuck in an infinite loop on certain targets. Find and fix the pointer update bug!',
    language: 'python',
    buggyCode: `def binary_search(nums, target):
    left = 0
    right = len(nums) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid  # <-- BUG HERE!
        else:
            right = mid - 1
            
    return -1`,
    fixedCode: `def binary_search(nums, target):
    left = 0
    right = len(nums) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
            
    return -1`,
    bugExplanation: 'When `nums[mid] < target`, setting `left = mid` causes an infinite loop when `left` and `right` differ by 1. It must be `left = mid + 1`.',
    hint: 'Look closely at line 10: does `left` make forward progress beyond `mid`?',
    testCases: [
      { id: 'b1_tc1', input: 'nums = [1, 3, 5, 7, 9], target = 7', expectedOutput: '3', isSample: true },
      { id: 'b1_tc2', input: 'nums = [2, 4, 6, 8], target = 5', expectedOutput: '-1', isSample: true },
      { id: 'b1_tc3', input: 'nums = [1, 2], target = 2', expectedOutput: '1', isSample: false },
    ],
    timeLimitSeconds: 60,
    xpReward: 60,
  },
  {
    id: 'bug_2',
    title: 'Self-Pairing Two Sum',
    topic: 'Hashing',
    difficulty: 'EASY',
    description: 'This function allows a number to add to itself to reach the target! Prevent using the same element at the same index twice.',
    language: 'python',
    buggyCode: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        seen[num] = i
        
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [i, seen[complement]]  # <-- BUG: can pick itself!
            
    return []`,
    fixedCode: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
            
    return []`,
    bugExplanation: 'Populating the hash map before checking allows `target - num == num` to match index `i` with itself (e.g. target 6 with element 3 at index 0). We must check `complement in seen and seen[complement] != i` or check as we insert in one pass.',
    hint: 'What happens when `nums = [3, 2, 4]` and `target = 6`? It might return `[0, 0]`!',
    testCases: [
      { id: 'b2_tc1', input: 'nums = [3, 2, 4], target = 6', expectedOutput: '[1, 2]', isSample: true },
      { id: 'b2_tc2', input: 'nums = [2, 7, 11, 15], target = 9', expectedOutput: '[0, 1]', isSample: true },
      { id: 'b2_tc3', input: 'nums = [3, 3], target = 6', expectedOutput: '[0, 1]', isSample: false },
    ],
    timeLimitSeconds: 60,
    xpReward: 60,
  },
  {
    id: 'bug_3',
    title: 'Runaway Factorial Stack',
    topic: 'Recursion',
    difficulty: 'EASY',
    description: 'Running this factorial function triggers RecursionError: maximum recursion depth exceeded! Fix the base case.',
    language: 'python',
    buggyCode: `def factorial(n):
    # Base case bug!
    if n == 1:
        return 1
    return n * factorial(n - 1)
# What if n is 0?`,
    fixedCode: `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)`,
    bugExplanation: 'For `n = 0`, the function called `factorial(-1)`, then `factorial(-2)` infinitely. The base condition should check `n <= 1` or `n == 0 or n == 1`.',
    hint: 'Check what happens when `factorial(0)` is invoked.',
    testCases: [
      { id: 'b3_tc1', input: 'n = 0', expectedOutput: '1', isSample: true },
      { id: 'b3_tc2', input: 'n = 4', expectedOutput: '24', isSample: true },
      { id: 'b3_tc3', input: 'n = 5', expectedOutput: '120', isSample: false },
    ],
    timeLimitSeconds: 50,
    xpReward: 50,
  },
  {
    id: 'bug_4',
    title: 'Array Index Out of Bounds',
    topic: 'Arrays',
    difficulty: 'MEDIUM',
    description: 'This function checks if every adjacent pair is sorted, but throws an IndexError on the last element.',
    language: 'python',
    buggyCode: `def is_sorted(nums):
    for i in range(len(nums)):
        if nums[i] > nums[i + 1]:  # <-- BUG: index out of range at the end!
            return False
    return True`,
    fixedCode: `def is_sorted(nums):
    for i in range(len(nums) - 1):
        if nums[i] > nums[i + 1]:
            return False
    return True`,
    bugExplanation: '`range(len(nums))` runs up to index `len(nums) - 1`, where `nums[i + 1]` attempts to access `nums[len(nums)]`, causing an `IndexError`. The loop must stop at `len(nums) - 1`.',
    hint: 'Adjust the range of the loop so `i + 1` never exceeds the bounds.',
    testCases: [
      { id: 'b4_tc1', input: 'nums = [1, 2, 3, 4]', expectedOutput: 'True', isSample: true },
      { id: 'b4_tc2', input: 'nums = [1, 3, 2]', expectedOutput: 'False', isSample: true },
    ],
    timeLimitSeconds: 60,
    xpReward: 70,
  },
  {
    id: 'bug_5',
    title: 'Case-Sensitive Palindrome Trap',
    topic: 'Strings',
    difficulty: 'EASY',
    description: 'The function fails to recognize "Racecar" as a valid palindrome because of letter casing. Fix the case sensitivity.',
    language: 'python',
    buggyCode: `def is_palindrome(s):
    # Only checks raw characters without case folding
    filtered = [ch for ch in s if ch.isalnum()]
    return filtered == filtered[::-1]`,
    fixedCode: `def is_palindrome(s):
    filtered = [ch.lower() for ch in s if ch.isalnum()]
    return filtered == filtered[::-1]`,
    bugExplanation: 'Palindromes are case-insensitive. Calling `.lower()` on each alphanumeric character ensures that "Racecar" or "A man, a plan, a canal: Panama" evaluate to True.',
    hint: 'Apply `.lower()` when normalizing characters.',
    testCases: [
      { id: 'b5_tc1', input: 's = "Racecar"', expectedOutput: 'True', isSample: true },
      { id: 'b5_tc2', input: 's = "hello"', expectedOutput: 'False', isSample: true },
    ],
    timeLimitSeconds: 50,
    xpReward: 50,
  },
];
