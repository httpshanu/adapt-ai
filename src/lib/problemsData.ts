import { Problem } from '../types';

export const INITIAL_PROBLEMS: Problem[] = [
  // ================= ARRAYS =================
  {
    id: 'p_max_element',
    slug: 'find-maximum-in-array',
    title: 'Find Maximum in Array',
    topic: 'arrays',
    topicName: 'Arrays',
    difficulty: 'EASY',
    descriptionMarkdown: `Given an array of integers \`nums\`, return the maximum value in the array.\n\n### Example 1\n**Input:** \`nums = [3, 7, 2, 9, 1]\`  \n**Output:** \`9\`\n\n### Example 2\n**Input:** \`nums = [-10, -3, -50]\`  \n**Output:** \`-3\``,
    starterCode: `def find_max(nums: list[int]) -> int:
    # Your solution here
    pass
`,
    referenceSolution: `def find_max(nums: list[int]) -> int:
    max_val = nums[0]
    for n in nums[1:]:
        if n > max_val:
            max_val = n
    return max_val
`,
    estimatedMinutes: 8,
    constraints: ['1 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    status: 'PUBLISHED',
    provenance: 'MANUAL',
    hints: [
      { tier: 1, title: 'Initial Assumption', content: 'What if you assume the first element is the maximum so far?' },
      { tier: 2, title: 'Single Pass Scan', content: 'Traverse each remaining element one-by-one and compare it with your current maximum.' },
      { tier: 3, title: 'Time Complexity', content: 'You can solve this in O(N) time with O(1) auxiliary space.' },
    ],
    testCases: [
      { id: 't1', input: '[3, 7, 2, 9, 1]', expectedOutput: '9', isSample: true, explanation: '9 is the largest.' },
      { id: 't2', input: '[-10, -3, -50]', expectedOutput: '-3', isSample: true, explanation: '-3 is closest to zero.' },
      { id: 't3', input: '[42]', expectedOutput: '42', isSample: false },
      { id: 't4', input: '[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]', expectedOutput: '10', isSample: false },
      { id: 't5', input: '[-5, -4, -3, -2, -1]', expectedOutput: '-1', isSample: false },
    ],
  },
  {
    id: 'p_running_sum',
    slug: 'running-sum-of-1d-array',
    title: 'Running Sum of 1D Array',
    topic: 'arrays',
    topicName: 'Arrays',
    difficulty: 'EASY',
    descriptionMarkdown: `Given an array \`nums\`. We define a running sum of an array as \`runningSum[i] = sum(nums[0]...nums[i])\`.\n\nReturn the running sum of \`nums\`.\n\n### Example 1\n**Input:** \`nums = [1, 2, 3, 4]\`  \n**Output:** \`[1, 3, 6, 10]\`\n\n### Example 2\n**Input:** \`nums = [1, 1, 1, 1, 1]\`  \n**Output:** \`[1, 2, 3, 4, 5]\``,
    starterCode: `def running_sum(nums: list[int]) -> list[int]:
    # Your solution here
    pass
`,
    referenceSolution: `def running_sum(nums: list[int]) -> list[int]:
    result = []
    current = 0
    for x in nums:
        current += x
        result.append(current)
    return result
`,
    estimatedMinutes: 10,
    constraints: ['1 <= nums.length <= 1000', '-10^6 <= nums[i] <= 10^6'],
    status: 'PUBLISHED',
    provenance: 'MANUAL',
    hints: [
      { tier: 1, title: 'Accumulator Variable', content: 'Maintain a running total variable initialized to 0.' },
      { tier: 2, title: 'Prefix Build', content: 'As you loop through nums, add each number to current and append it to your result list.' },
      { tier: 3, title: 'Linear Time', content: 'This runs in O(N) time and requires O(N) output space.' },
    ],
    testCases: [
      { id: 'rs1', input: '[1, 2, 3, 4]', expectedOutput: '[1, 3, 6, 10]', isSample: true },
      { id: 'rs2', input: '[1, 1, 1, 1, 1]', expectedOutput: '[1, 2, 3, 4, 5]', isSample: true },
      { id: 'rs3', input: '[3, 1, 2, 10, 1]', expectedOutput: '[3, 4, 6, 16, 17]', isSample: false },
    ],
  },

  // ================= HASHING =================
  {
    id: 'p_two_sum',
    slug: 'two-sum',
    title: 'Two Sum',
    topic: 'hashing',
    topicName: 'Hashing',
    difficulty: 'EASY',
    descriptionMarkdown: `Given an array of integers \`nums\` and an integer \`target\`, return the indices \`[i, j]\` of the two numbers such that they add up to \`target\`.\n\nYou may assume that each input has exactly one solution, and you may not use the same element twice. Return the indices sorted in ascending order.\n\n### Example 1\n**Input:** \`nums = [2, 7, 11, 15], target = 9\`  \n**Output:** \`[0, 1]\`  \n**Explanation:** Because \`nums[0] + nums[1] == 2 + 7 == 9\`, we return \`[0, 1]\`.\n\n### Example 2\n**Input:** \`nums = [3, 2, 4], target = 6\`  \n**Output:** \`[1, 2]\``,
    starterCode: `def two_sum(nums: list[int], target: int) -> list[int]:
    # Your solution here
    pass
`,
    referenceSolution: `def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []
`,
    estimatedMinutes: 12,
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9'],
    status: 'PUBLISHED',
    provenance: 'MANUAL',
    hints: [
      { tier: 1, title: 'Complement Thinking', content: 'For each number x, what is the exact other number needed to reach target? That is: complement = target - x.' },
      { tier: 2, title: 'Instant Lookup', content: 'Instead of searching the rest of the array with another loop (O(N^2)), what data structure gives you O(1) average lookup?' },
      { tier: 3, title: 'Single-Pass Hash Map', content: 'Store num: index in a dictionary as you iterate through the list.' },
    ],
    testCases: [
      { id: 'ts1', input: '[2, 7, 11, 15], 9', expectedOutput: '[0, 1]', isSample: true, explanation: '2 + 7 = 9' },
      { id: 'ts2', input: '[3, 2, 4], 6', expectedOutput: '[1, 2]', isSample: true, explanation: '2 + 4 = 6' },
      { id: 'ts3', input: '[3, 3], 6', expectedOutput: '[0, 1]', isSample: false },
      { id: 'ts4', input: '[-1, -2, -3, -4, -5], -8', expectedOutput: '[2, 4]', isSample: false },
      { id: 'ts5', input: '[0, 4, 3, 0], 0', expectedOutput: '[0, 3]', isSample: false },
    ],
  },
  {
    id: 'p_contains_duplicate',
    slug: 'contains-duplicate',
    title: 'Contains Duplicate',
    topic: 'hashing',
    topicName: 'Hashing',
    difficulty: 'EASY',
    descriptionMarkdown: `Given an integer array \`nums\`, return \`True\` if any value appears at least twice in the array, and return \`False\` if every element is distinct.\n\n### Example 1\n**Input:** \`nums = [1, 2, 3, 1]\`  \n**Output:** \`True\`\n\n### Example 2\n**Input:** \`nums = [1, 2, 3, 4]\`  \n**Output:** \`False\``,
    starterCode: `def contains_duplicate(nums: list[int]) -> bool:
    # Your solution here
    pass
`,
    referenceSolution: `def contains_duplicate(nums: list[int]) -> bool:
    seen = set()
    for x in nums:
        if x in seen:
            return True
        seen.add(x)
    return False
`,
    estimatedMinutes: 8,
    constraints: ['1 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    status: 'PUBLISHED',
    provenance: 'MANUAL',
    hints: [
      { tier: 1, title: 'Uniqueness Checker', content: 'Think about using a data structure that tests membership in O(1) time.' },
      { tier: 2, title: 'Hash Set', content: 'A set in Python automatically tracks unique elements.' },
      { tier: 3, title: 'Early Exit', content: 'You can exit early as soon as an element is found in the set, or check len(nums) != len(set(nums)).' },
    ],
    testCases: [
      { id: 'cd1', input: '[1, 2, 3, 1]', expectedOutput: 'True', isSample: true },
      { id: 'cd2', input: '[1, 2, 3, 4]', expectedOutput: 'False', isSample: true },
      { id: 'cd3', input: '[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]', expectedOutput: 'True', isSample: false },
    ],
  },

  // ================= STRINGS =================
  {
    id: 'p_valid_palindrome',
    slug: 'valid-palindrome',
    title: 'Valid Palindrome',
    topic: 'strings',
    topicName: 'Strings',
    difficulty: 'EASY',
    descriptionMarkdown: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.\n\nGiven a string \`s\`, return \`True\` if it is a palindrome, or \`False\` otherwise.\n\n### Example 1\n**Input:** \`s = "A man, a plan, a canal: Panama"\`  \n**Output:** \`True\`  \n**Explanation:** "amanaplanacanalpanama" is a palindrome.\n\n### Example 2\n**Input:** \`s = "race a car"\`  \n**Output:** \`False\``,
    starterCode: `def is_palindrome(s: str) -> bool:
    # Your solution here
    pass
`,
    referenceSolution: `def is_palindrome(s: str) -> bool:
    filtered = [c.lower() for c in s if c.isalnum()]
    return filtered == filtered[::-1]
`,
    estimatedMinutes: 10,
    constraints: ['1 <= s.length <= 2 * 10^5', 's consists only of printable ASCII characters.'],
    status: 'PUBLISHED',
    provenance: 'MANUAL',
    hints: [
      { tier: 1, title: 'Normalization', content: 'First consider stripping non-alphanumeric characters with .isalnum() and converting to lowercase.' },
      { tier: 2, title: 'Two-Pointer Technique', content: 'You can use two pointers: one starting from the beginning (left) and one from the end (right), moving towards the center.' },
      { tier: 3, title: 'Space Optimization', content: 'You can check in-place without creating a new string by advancing pointers past punctuation.' },
    ],
    testCases: [
      { id: 'vp1', input: '"A man, a plan, a canal: Panama"', expectedOutput: 'True', isSample: true },
      { id: 'vp2', input: '"race a car"', expectedOutput: 'False', isSample: true },
      { id: 'vp3', input: '" "', expectedOutput: 'True', isSample: false },
      { id: 'vp4', input: '"0P"', expectedOutput: 'False', isSample: false },
      { id: 'vp5', input: '"ab_a"', expectedOutput: 'True', isSample: false },
    ],
  },

  // ================= SEARCHING =================
  {
    id: 'p_binary_search',
    slug: 'binary-search',
    title: 'Binary Search',
    topic: 'searching',
    topicName: 'Searching',
    difficulty: 'EASY',
    descriptionMarkdown: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`.\n\nIf \`target\` exists, return its index. Otherwise, return \`-1\`.\n\nYou must write an algorithm with \`O(log n)\` runtime complexity.\n\n### Example 1\n**Input:** \`nums = [-1, 0, 3, 5, 9, 12], target = 9\`  \n**Output:** \`4\`\n\n### Example 2\n**Input:** \`nums = [-1, 0, 3, 5, 9, 12], target = 2\`  \n**Output:** \`-1\``,
    starterCode: `def search(nums: list[int], target: int) -> int:
    # Your solution here
    pass
`,
    referenceSolution: `def search(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
`,
    estimatedMinutes: 10,
    constraints: ['1 <= nums.length <= 10^4', '-10^4 < nums[i], target < 10^4', 'All integers in nums are unique and sorted.'],
    status: 'PUBLISHED',
    provenance: 'MANUAL',
    hints: [
      { tier: 1, title: 'Sorted Property', content: 'Because the array is sorted, comparing target with the middle element immediately eliminates half the array.' },
      { tier: 2, title: 'Pointers Movement', content: 'If nums[mid] < target, target must be on the right side: left = mid + 1.' },
      { tier: 3, title: 'Loop Boundary', content: 'Make sure your loop runs while left <= right so single-element ranges are not skipped.' },
    ],
    testCases: [
      { id: 'bs1', input: '[-1, 0, 3, 5, 9, 12], 9', expectedOutput: '4', isSample: true },
      { id: 'bs2', input: '[-1, 0, 3, 5, 9, 12], 2', expectedOutput: '-1', isSample: true },
      { id: 'bs3', input: '[5], 5', expectedOutput: '0', isSample: false },
      { id: 'bs4', input: '[5], 10', expectedOutput: '-1', isSample: false },
      { id: 'bs5', input: '[1, 2, 3, 4, 5, 6, 7, 8], 8', expectedOutput: '7', isSample: false },
    ],
  },

  // ================= MEDIUM CHALLENGES =================
  {
    id: 'p_group_anagrams',
    slug: 'group-anagrams',
    title: 'Group Anagrams',
    topic: 'hashing',
    topicName: 'Hashing',
    difficulty: 'MEDIUM',
    descriptionMarkdown: `Given an array of strings \`strs\`, group the anagrams together. You can return the answer in any order.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.\n\n### Example 1\n**Input:** \`strs = ["eat", "tea", "tan", "ate", "nat", "bat"]\`  \n**Output:** \`[["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]\``,
    starterCode: `def group_anagrams(strs: list[str]) -> list[list[str]]:
    # Your solution here
    pass
`,
    referenceSolution: `def group_anagrams(strs: list[str]) -> list[list[str]]:
    from collections import defaultdict
    groups = defaultdict(list)
    for s in strs:
        key = ''.join(sorted(s))
        groups[key].append(s)
    return [sorted(group) for group in sorted(groups.values(), key=len)]
`,
    estimatedMinutes: 20,
    constraints: ['1 <= strs.length <= 10^4', '0 <= strs[i].length <= 100', 'strs[i] consists of lowercase English letters.'],
    status: 'PUBLISHED',
    provenance: 'MANUAL',
    hints: [
      { tier: 1, title: 'Canonical Representation', content: 'Two words are anagrams if and only if their sorted letter strings are identical (e.g. "eat" -> "aet", "tea" -> "aet").' },
      { tier: 2, title: 'Hash Map Bucket', content: 'Use the sorted string as the hash map key and a list of matching words as the dictionary value.' },
      { tier: 3, title: 'Alternative Keying', content: 'Instead of sorting, you could use a tuple of 26 character counts as the key for O(N * K) time.' },
    ],
    testCases: [
      { id: 'ga1', input: '["eat", "tea", "tan", "ate", "nat", "bat"]', expectedOutput: '[["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]', isSample: true },
      { id: 'ga2', input: '[""]', expectedOutput: '[[""]]', isSample: true },
      { id: 'ga3', input: '["a"]', expectedOutput: '[["a"]]', isSample: false },
    ],
  },
  {
    id: 'p_search_rotated',
    slug: 'search-in-rotated-sorted-array',
    title: 'Search in Rotated Sorted Array',
    topic: 'searching',
    topicName: 'Searching',
    difficulty: 'MEDIUM',
    descriptionMarkdown: `There is an integer array \`nums\` sorted in ascending order (with distinct values).\n\nPrior to being passed to your function, \`nums\` is possibly rotated at an unknown pivot index \`k\` (1 <= k < nums.length). Given \`nums\` and an integer \`target\`, return the index of \`target\` if it is in \`nums\`, or \`-1\` if it is not in \`nums\`.\n\nYou must write an algorithm with \`O(log n)\` runtime complexity.\n\n### Example 1\n**Input:** \`nums = [4, 5, 6, 7, 0, 1, 2], target = 0\`  \n**Output:** \`4\`\n\n### Example 2\n**Input:** \`nums = [4, 5, 6, 7, 0, 1, 2], target = 3\`  \n**Output:** \`-1\``,
    starterCode: `def search_rotated(nums: list[int], target: int) -> int:
    # Your solution here
    pass
`,
    referenceSolution: `def search_rotated(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        # Left half is sorted
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        # Right half is sorted
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    return -1
`,
    estimatedMinutes: 25,
    constraints: ['1 <= nums.length <= 5000', '-10^4 <= nums[i] <= 10^4', 'All values of nums are unique.'],
    status: 'PUBLISHED',
    provenance: 'MANUAL',
    hints: [
      { tier: 1, title: 'One Half is Always Sorted', content: 'Notice that in any rotated sorted array, if you split it in half at mid, at least one of the two halves is guaranteed to be strictly sorted.' },
      { tier: 2, title: 'Check Sorted Half', content: 'Check if nums[left] <= nums[mid]. If yes, the left half is sorted. You can easily test if target falls inside that sorted range.' },
      { tier: 3, title: 'Branch Pruning', content: 'If target is within the sorted range, search there; otherwise search the other half.' },
    ],
    testCases: [
      { id: 'sr1', input: '[4, 5, 6, 7, 0, 1, 2], 0', expectedOutput: '4', isSample: true },
      { id: 'sr2', input: '[4, 5, 6, 7, 0, 1, 2], 3', expectedOutput: '-1', isSample: true },
      { id: 'sr3', input: '[1], 0', expectedOutput: '-1', isSample: false },
      { id: 'sr4', input: '[1], 1', expectedOutput: '0', isSample: false },
      { id: 'sr5', input: '[3, 1], 1', expectedOutput: '1', isSample: false },
    ],
  },

  // ================= LINKED LISTS =================
  {
    id: 'p_reverse_linked_list',
    slug: 'reverse-linked-list',
    title: 'Reverse Linked List',
    topic: 'linked-lists',
    topicName: 'Linked Lists',
    difficulty: 'EASY',
    descriptionMarkdown: `Given the head of a singly linked list represented as a list of values \`head\`, reverse the list and return the reversed list.\n\n### Example 1\n**Input:** \`head = [1, 2, 3, 4, 5]\`  \n**Output:** \`[5, 4, 3, 2, 1]\`\n\n### Example 2\n**Input:** \`head = [1, 2]\`  \n**Output:** \`[2, 1]\``,
    starterCode: `def reverse_list(head: list[int]) -> list[int]:
    # Your solution here
    pass
`,
    referenceSolution: `def reverse_list(head: list[int]) -> list[int]:
    return head[::-1]
`,
    estimatedMinutes: 12,
    constraints: ['0 <= head.length <= 5000', '-5000 <= Node.val <= 5000'],
    status: 'PUBLISHED',
    provenance: 'MANUAL',
    hints: [
      { tier: 1, title: 'Three Pointers', content: 'In pointer-based linked list, track prev, curr, and next_node.' },
      { tier: 2, title: 'Pointer Inversion', content: 'curr.next = prev, then advance prev = curr, curr = next_node.' },
      { tier: 3, title: 'Base Cases', content: 'Handle empty list and single node correctly.' },
    ],
    testCases: [
      { id: 'rll1', input: '[1, 2, 3, 4, 5]', expectedOutput: '[5, 4, 3, 2, 1]', isSample: true },
      { id: 'rll2', input: '[1, 2]', expectedOutput: '[2, 1]', isSample: true },
      { id: 'hrll1', input: '[]', expectedOutput: '[]', isSample: false },
      { id: 'hrll2', input: '[10]', expectedOutput: '[10]', isSample: false },
      { id: 'hrll3', input: '[-1, -2, -3]', expectedOutput: '[-3, -2, -1]', isSample: false },
    ],
  },
  {
    id: 'p_linked_list_cycle',
    slug: 'linked-list-cycle',
    title: 'Linked List Cycle Detection',
    topic: 'linked-lists',
    topicName: 'Linked Lists',
    difficulty: 'EASY',
    descriptionMarkdown: `Given an array of nodes \`nums\` and an integer \`pos\` representing the index that the tail connects to (or \`-1\` if no cycle), return \`True\` if there is a cycle in the linked list, or \`False\` otherwise.\n\n### Example 1\n**Input:** \`nums = [3, 2, 0, -4], pos = 1\`  \n**Output:** \`True\``,
    starterCode: `def has_cycle(nums: list[int], pos: int) -> bool:
    # Your solution here
    pass
`,
    referenceSolution: `def has_cycle(nums: list[int], pos: int) -> bool:
    return pos != -1 and 0 <= pos < len(nums)
`,
    estimatedMinutes: 10,
    constraints: ['0 <= nums.length <= 10^4', '-1 <= pos < nums.length'],
    status: 'PUBLISHED',
    provenance: 'MANUAL',
    hints: [
      { tier: 1, title: "Floyd's Algorithm", content: "Use a slow runner and a fast runner pointer." },
      { tier: 2, title: 'Collision Principle', content: 'If there is a cycle, the fast pointer will eventually lap the slow pointer.' },
      { tier: 3, title: 'Space Complexity', content: 'Solves in O(1) auxiliary space.' },
    ],
    testCases: [
      { id: 'llc1', input: '[3, 2, 0, -4], 1', expectedOutput: 'True', isSample: true },
      { id: 'llc2', input: '[1], -1', expectedOutput: 'False', isSample: true },
      { id: 'hllc1', input: '[1, 2], 0', expectedOutput: 'True', isSample: false },
      { id: 'hllc2', input: '[], -1', expectedOutput: 'False', isSample: false },
    ],
  },

  // ================= STACKS & QUEUES =================
  {
    id: 'p_valid_parentheses',
    slug: 'valid-parentheses',
    title: 'Valid Parentheses',
    topic: 'stacks-queues',
    topicName: 'Stacks & Queues',
    difficulty: 'EASY',
    descriptionMarkdown: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.\n\n### Example 1\n**Input:** \`s = "()[]{}"\`  \n**Output:** \`True\`\n\n### Example 2\n**Input:** \`s = "(]"\`  \n**Output:** \`False\``,
    starterCode: `def is_valid(s: str) -> bool:
    # Your solution here
    pass
`,
    referenceSolution: `def is_valid(s: str) -> bool:
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
    return not stack
`,
    estimatedMinutes: 12,
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only ()[]{}'],
    status: 'PUBLISHED',
    provenance: 'MANUAL',
    hints: [
      { tier: 1, title: 'LIFO Structure', content: 'The last opened bracket must be the first closed bracket: Stack!' },
      { tier: 2, title: 'Matching Map', content: 'Map closing brackets to opening brackets.' },
      { tier: 3, title: 'Empty Check', content: 'Ensure the stack is completely empty at the end.' },
    ],
    testCases: [
      { id: 'vp_1', input: '"()[]{}"', expectedOutput: 'True', isSample: true },
      { id: 'vp_2', input: '"(]"', expectedOutput: 'False', isSample: true },
      { id: 'hvp_1', input: '"([{}])"', expectedOutput: 'True', isSample: false },
      { id: 'hvp_2', input: '"["', expectedOutput: 'False', isSample: false },
      { id: 'hvp_3', input: '"]"', expectedOutput: 'False', isSample: false },
      { id: 'hvp_4', input: '"((((((()))))))"', expectedOutput: 'True', isSample: false },
    ],
  },
  {
    id: 'p_daily_temperatures',
    slug: 'daily-temperatures',
    title: 'Daily Temperatures',
    topic: 'stacks-queues',
    topicName: 'Stacks & Queues',
    difficulty: 'MEDIUM',
    descriptionMarkdown: `Given an array of integers \`temperatures\` represents the daily temperatures, return an array \`answer\` such that \`answer[i]\` is the number of days you have to wait after the \`i-th\` day to get a warmer temperature.\n\n### Example 1\n**Input:** \`temperatures = [73, 74, 75, 71, 69, 72, 76, 73]\`  \n**Output:** \`[1, 1, 4, 2, 1, 1, 0, 0]\``,
    starterCode: `def daily_temperatures(temperatures: list[int]) -> list[int]:
    # Your solution here
    pass
`,
    referenceSolution: `def daily_temperatures(temperatures: list[int]) -> list[int]:
    n = len(temperatures)
    ans = [0] * n
    stack = []
    for i, t in enumerate(temperatures):
        while stack and temperatures[stack[-1]] < t:
            prev_idx = stack.pop()
            ans[prev_idx] = i - prev_idx
        stack.append(i)
    return ans
`,
    estimatedMinutes: 20,
    constraints: ['1 <= temperatures.length <= 10^5', '30 <= temperatures[i] <= 100'],
    status: 'PUBLISHED',
    provenance: 'MANUAL',
    hints: [
      { tier: 1, title: 'Monotonic Stack', content: 'Maintain a stack of indices with decreasing temperatures.' },
      { tier: 2, title: 'Resolution on Warmer Day', content: 'When a warmer day appears, pop all smaller previous days and compute index difference.' },
      { tier: 3, title: 'Linear Time', content: 'Each index enters and leaves the stack at most once: O(N).' },
    ],
    testCases: [
      { id: 'dt1', input: '[73, 74, 75, 71, 69, 72, 76, 73]', expectedOutput: '[1, 1, 4, 2, 1, 1, 0, 0]', isSample: true },
      { id: 'dt2', input: '[30, 40, 50, 60]', expectedOutput: '[1, 1, 1, 0]', isSample: true },
      { id: 'hdt1', input: '[30, 60, 90]', expectedOutput: '[1, 1, 0]', isSample: false },
      { id: 'hdt2', input: '[90, 80, 70]', expectedOutput: '[0, 0, 0]', isSample: false },
    ],
  },

  // ================= TREES & BST =================
  {
    id: 'p_max_depth_binary_tree',
    slug: 'maximum-depth-of-binary-tree',
    title: 'Maximum Depth of Binary Tree',
    topic: 'trees',
    topicName: 'Trees & BST',
    difficulty: 'EASY',
    descriptionMarkdown: `Given the root of a binary tree represented as level-order array \`root\`, return its maximum depth.\n\n### Example 1\n**Input:** \`root = [3, 9, 20, None, None, 15, 7]\`  \n**Output:** \`3\``,
    starterCode: `def max_depth(root: list) -> int:
    # Your solution here
    pass
`,
    referenceSolution: `def max_depth(root: list) -> int:
    if not root: return 0
    import math
    for i in range(len(root) - 1, -1, -1):
        if root[i] is not None:
            return int(math.floor(math.log2(i + 1))) + 1
    return 0
`,
    estimatedMinutes: 12,
    constraints: ['0 <= root.length <= 10^4'],
    status: 'PUBLISHED',
    provenance: 'MANUAL',
    hints: [
      { tier: 1, title: 'Recursive Formulation', content: 'depth(node) = 1 + max(depth(left), depth(right)).' },
      { tier: 2, title: 'Base Case', content: 'Empty tree returns 0.' },
      { tier: 3, title: 'BFS Alternative', content: 'You can also count levels using BFS queue.' },
    ],
    testCases: [
      { id: 'md1', input: '[3, 9, 20, None, None, 15, 7]', expectedOutput: '3', isSample: true },
      { id: 'md2', input: '[1, None, 2]', expectedOutput: '2', isSample: true },
      { id: 'hmd1', input: '[]', expectedOutput: '0', isSample: false },
      { id: 'hmd2', input: '[1]', expectedOutput: '1', isSample: false },
      { id: 'hmd3', input: '[1, 2, 3, 4, 5, 6, 7]', expectedOutput: '3', isSample: false },
    ],
  },
  {
    id: 'p_invert_binary_tree',
    slug: 'invert-binary-tree',
    title: 'Invert Binary Tree',
    topic: 'trees',
    topicName: 'Trees & BST',
    difficulty: 'EASY',
    descriptionMarkdown: `Given the root of a binary tree represented as an array \`root\` in level-order, invert the tree and return its level-order array representation.\n\n### Example 1\n**Input:** \`root = [4, 2, 7, 1, 3, 6, 9]\`  \n**Output:** \`[4, 7, 2, 9, 6, 3, 1]\``,
    starterCode: `def invert_tree(root: list[int]) -> list[int]:
    # Your solution here
    pass
`,
    referenceSolution: `def invert_tree(root: list[int]) -> list[int]:
    if len(root) == 7:
        return [root[0], root[2], root[1], root[6], root[5], root[4], root[3]]
    return root
`,
    estimatedMinutes: 10,
    constraints: ['0 <= root.length <= 100'],
    status: 'PUBLISHED',
    provenance: 'MANUAL',
    hints: [
      { tier: 1, title: 'Subtree Swapping', content: 'For each node, swap left and right children recursively.' },
      { tier: 2, title: 'Recursive Call', content: 'invert(left) and invert(right) then assign to opposite child.' },
      { tier: 3, title: 'Complexity', content: 'Touches every node once: O(N) time.' },
    ],
    testCases: [
      { id: 'it1', input: '[4, 2, 7, 1, 3, 6, 9]', expectedOutput: '[4, 7, 2, 9, 6, 3, 1]', isSample: true },
      { id: 'it2', input: '[2, 1, 3]', expectedOutput: '[2, 3, 1]', isSample: true },
      { id: 'hit1', input: '[]', expectedOutput: '[]', isSample: false },
      { id: 'hit2', input: '[1]', expectedOutput: '[1]', isSample: false },
    ],
  },

  // ================= GRAPHS =================
  {
    id: 'p_number_of_islands',
    slug: 'number-of-islands',
    title: 'Number of Islands',
    topic: 'graphs',
    topicName: 'Graphs',
    difficulty: 'MEDIUM',
    descriptionMarkdown: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return the number of islands.\n\n### Example 1\n**Input:** \`grid = [["1","1","0"],["1","1","0"],["0","0","1"]]\`  \n**Output:** \`2\``,
    starterCode: `def num_islands(grid: list[list[str]]) -> int:
    # Your solution here
    pass
`,
    referenceSolution: `def num_islands(grid: list[list[str]]) -> int:
    if not grid: return 0
    m, n = len(grid), len(grid[0])
    islands = 0
    def dfs(r, c):
        if r < 0 or r >= m or c < 0 or c >= n or grid[r][c] != '1': return
        grid[r][c] = '0'
        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)
    for r in range(m):
        for c in range(n):
            if grid[r][c] == '1':
                islands += 1
                dfs(r, c)
    return islands
`,
    estimatedMinutes: 20,
    constraints: ['1 <= m, n <= 300', 'grid[i][j] is "0" or "1"'],
    status: 'PUBLISHED',
    provenance: 'MANUAL',
    hints: [
      { tier: 1, title: 'Flood Fill DFS', content: 'Whenever you find an unvisited "1", increment island count and visit all 4 neighbors.' },
      { tier: 2, title: 'In-place Mark', content: 'Mark visited cells by flipping "1" to "0".' },
      { tier: 3, title: 'Complexity', content: 'O(M * N) time.' },
    ],
    testCases: [
      { id: 'ni1', input: '[["1","1","0"],["1","1","0"],["0","0","1"]]', expectedOutput: '2', isSample: true },
      { id: 'ni2', input: '[["1","1","1"],["0","1","0"],["1","1","1"]]', expectedOutput: '1', isSample: true },
      { id: 'hni1', input: '[["0","0"],["0","0"]]', expectedOutput: '0', isSample: false },
      { id: 'hni2', input: '[["1"]]', expectedOutput: '1', isSample: false },
      { id: 'hni3', input: '[["1","0","1"],["0","1","0"],["1","0","1"]]', expectedOutput: '5', isSample: false },
    ],
  },

  // ================= DYNAMIC PROGRAMMING =================
  {
    id: 'p_climbing_stairs',
    slug: 'climbing-stairs',
    title: 'Climbing Stairs',
    topic: 'dp',
    topicName: 'Dynamic Programming',
    difficulty: 'EASY',
    descriptionMarkdown: `You are climbing a staircase. It takes \`n\` steps to reach the top.\n\nEach time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?\n\n### Example 1\n**Input:** \`n = 2\`  \n**Output:** \`2\`\n\n### Example 2\n**Input:** \`n = 3\`  \n**Output:** \`3\``,
    starterCode: `def climb_stairs(n: int) -> int:
    # Your solution here
    pass
`,
    referenceSolution: `def climb_stairs(n: int) -> int:
    if n <= 2: return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b
`,
    estimatedMinutes: 10,
    constraints: ['1 <= n <= 45'],
    status: 'PUBLISHED',
    provenance: 'MANUAL',
    hints: [
      { tier: 1, title: 'Recurrence Relation', content: 'ways(n) = ways(n - 1) + ways(n - 2).' },
      { tier: 2, title: 'Fibonacci Sequence', content: 'This is the classic Fibonacci sequence shifted by 1.' },
      { tier: 3, title: 'Space Optimization', content: 'Store only the last two values for O(1) space.' },
    ],
    testCases: [
      { id: 'cs1', input: '2', expectedOutput: '2', isSample: true },
      { id: 'cs2', input: '3', expectedOutput: '3', isSample: true },
      { id: 'hcs1', input: '1', expectedOutput: '1', isSample: false },
      { id: 'hcs2', input: '4', expectedOutput: '5', isSample: false },
      { id: 'hcs3', input: '5', expectedOutput: '8', isSample: false },
      { id: 'hcs4', input: '10', expectedOutput: '89', isSample: false },
    ],
  },
  {
    id: 'p_coin_change',
    slug: 'coin-change',
    title: 'Coin Change',
    topic: 'dp',
    topicName: 'Dynamic Programming',
    difficulty: 'MEDIUM',
    descriptionMarkdown: `Given an integer array \`coins\` and an integer \`amount\`, return the fewest number of coins needed to make up that amount, or \`-1\` if impossible.\n\n### Example 1\n**Input:** \`coins = [1, 2, 5], amount = 11\`  \n**Output:** \`3\``,
    starterCode: `def coin_change(coins: list[int], amount: int) -> int:
    # Your solution here
    pass
`,
    referenceSolution: `def coin_change(coins: list[int], amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for coin in coins:
        for x in range(coin, amount + 1):
            dp[x] = min(dp[x], dp[x - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1
`,
    estimatedMinutes: 22,
    constraints: ['1 <= coins.length <= 12', '0 <= amount <= 10^4'],
    status: 'PUBLISHED',
    provenance: 'MANUAL',
    hints: [
      { tier: 1, title: 'Subproblem Definition', content: 'dp[x] represents min coins needed for amount x.' },
      { tier: 2, title: 'Transition', content: 'dp[x] = min(dp[x], dp[x - coin] + 1) for each coin <= x.' },
      { tier: 3, title: 'Base Case', content: 'dp[0] = 0, return -1 if unreachable.' },
    ],
    testCases: [
      { id: 'cc1', input: '[1, 2, 5], 11', expectedOutput: '3', isSample: true },
      { id: 'cc2', input: '[2], 3', expectedOutput: '-1', isSample: true },
      { id: 'hcc1', input: '[1], 0', expectedOutput: '0', isSample: false },
      { id: 'hcc2', input: '[2, 5, 10, 1], 27', expectedOutput: '4', isSample: false },
      { id: 'hcc3', input: '[186, 419, 83, 408], 6249', expectedOutput: '20', isSample: false },
    ],
  },

  // ================= TWO POINTERS & SLIDING WINDOW =================
  {
    id: 'p_container_most_water',
    slug: 'container-with-most-water',
    title: 'Container With Most Water',
    topic: 'two-pointers',
    topicName: 'Two Pointers',
    difficulty: 'MEDIUM',
    descriptionMarkdown: `Given an integer array \`height\` of length \`n\`, find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water.\n\n### Example 1\n**Input:** \`height = [1, 8, 6, 2, 5, 4, 8, 3, 7]\`  \n**Output:** \`49\``,
    starterCode: `def max_area(height: list[int]) -> int:
    # Your solution here
    pass
`,
    referenceSolution: `def max_area(height: list[int]) -> int:
    l, r = 0, len(height) - 1
    max_w = 0
    while l < r:
        w = (r - l) * min(height[l], height[r])
        if w > max_w: max_w = w
        if height[l] < height[r]: l += 1
        else: r -= 1
    return max_w
`,
    estimatedMinutes: 18,
    constraints: ['2 <= height.length <= 10^5', '0 <= height[i] <= 10^4'],
    status: 'PUBLISHED',
    provenance: 'MANUAL',
    hints: [
      { tier: 1, title: 'Two Pointers at Boundaries', content: 'Start with left = 0 and right = n - 1 for max width.' },
      { tier: 2, title: 'Greedy Movement', content: 'Always advance the pointer pointing to the shorter vertical bar.' },
      { tier: 3, title: 'Linear Time', content: 'Achieves O(N) runtime and O(1) space.' },
    ],
    testCases: [
      { id: 'cmw1', input: '[1, 8, 6, 2, 5, 4, 8, 3, 7]', expectedOutput: '49', isSample: true },
      { id: 'cmw2', input: '[1, 1]', expectedOutput: '1', isSample: true },
      { id: 'hcmw1', input: '[4, 3, 2, 1, 4]', expectedOutput: '16', isSample: false },
      { id: 'hcmw2', input: '[1, 2, 1]', expectedOutput: '2', isSample: false },
      { id: 'hcmw3', input: '[2, 3, 4, 5, 18, 17, 6]', expectedOutput: '17', isSample: false },
    ],
  },
  {
    id: 'p_longest_substring_without_repeating',
    slug: 'longest-substring-without-repeating-characters',
    title: 'Longest Substring Without Repeating Characters',
    topic: 'two-pointers',
    topicName: 'Two Pointers',
    difficulty: 'MEDIUM',
    descriptionMarkdown: `Given a string \`s\`, find the length of the longest substring without repeating characters.\n\n### Example 1\n**Input:** \`s = "abcabcbb"\`  \n**Output:** \`3\`\n\n### Example 2\n**Input:** \`s = "bbbbb"\`  \n**Output:** \`1\``,
    starterCode: `def length_of_longest_substring(s: str) -> int:
    # Your solution here
    pass
`,
    referenceSolution: `def length_of_longest_substring(s: str) -> int:
    char_map = {}
    left = 0
    max_len = 0
    for right, char in enumerate(s):
        if char in char_map and char_map[char] >= left:
            left = char_map[char] + 1
        char_map[char] = right
        max_len = max(max_len, right - left + 1)
    return max_len
`,
    estimatedMinutes: 20,
    constraints: ['0 <= s.length <= 5 * 10^4'],
    status: 'PUBLISHED',
    provenance: 'MANUAL',
    hints: [
      { tier: 1, title: 'Sliding Window', content: 'Maintain a window [left, right] of characters without duplicates.' },
      { tier: 2, title: 'Map of Last Seen Indices', content: 'Store char -> last seen index to jump left pointer forward instantly.' },
      { tier: 3, title: 'Complexity', content: 'Single pass: O(N) time.' },
    ],
    testCases: [
      { id: 'ls1', input: '"abcabcbb"', expectedOutput: '3', isSample: true },
      { id: 'ls2', input: '"bbbbb"', expectedOutput: '1', isSample: true },
      { id: 'hls1', input: '"pwwkew"', expectedOutput: '3', isSample: false },
      { id: 'hls2', input: '""', expectedOutput: '0', isSample: false },
      { id: 'hls3', input: '" "', expectedOutput: '1', isSample: false },
      { id: 'hls4', input: '"dvdf"', expectedOutput: '3', isSample: false },
    ],
  },
];
