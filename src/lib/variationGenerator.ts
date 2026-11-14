import { DifficultyLevel, Problem, TopicSlug } from '../types';

interface VariationTemplate {
  key: string;
  topic: TopicSlug;
  difficulty: DifficultyLevel;
  sourceProblemSlug: string;
  generate: () => Problem;
}

/**
 * Pre-calibrated algorithmic variation generators with controlled inputs,
 * distinct sub-invariants, and verified reference solutions.
 */
const VARIATION_TEMPLATES: VariationTemplate[] = [
  // ================= ARRAYS VARIATIONS =================
  {
    key: 'var_equilibrium_index',
    topic: 'arrays',
    difficulty: 'EASY',
    sourceProblemSlug: 'running-sum-of-1d-array',
    generate: () => ({
      id: `p_var_equilibrium_${Date.now()}`,
      slug: 'find-pivot-equilibrium-index',
      title: 'Find Pivot Equilibrium Index',
      topic: 'arrays',
      topicName: 'Arrays',
      difficulty: 'EASY',
      descriptionMarkdown: `Given an array of integers \`nums\`, calculate the **pivot index** of this array.\n\nThe pivot index is the index where the sum of all the numbers strictly to the left of the index is equal to the sum of all the numbers strictly to the index's right. If no such index exists, return \`-1\`. If there are multiple pivot indices, return the leftmost one.\n\n### Example 1\n**Input:** \`nums = [1, 7, 3, 6, 5, 6]\`  \n**Output:** \`3\`  \n**Explanation:** Left sum = nums[0] + nums[1] + nums[2] = 1 + 7 + 3 = 11. Right sum = nums[4] + nums[5] = 5 + 6 = 11.\n\n### Example 2\n**Input:** \`nums = [1, 2, 3]\`  \n**Output:** \`-1\``,
      starterCode: `def pivot_index(nums: list[int]) -> int:
    # Your solution here
    pass
`,
      referenceSolution: `def pivot_index(nums: list[int]) -> int:
    total = sum(nums)
    left_sum = 0
    for i, x in enumerate(nums):
        if left_sum == total - left_sum - x:
            return i
        left_sum += x
    return -1
`,
      estimatedMinutes: 15,
      constraints: ['1 <= nums.length <= 10^4', '-1000 <= nums[i] <= 1000'],
      status: 'DRAFT',
      provenance: 'PARAMETERIZED_VARIATION',
      sourceProblemId: 'p_running_sum',
      hints: [
        { tier: 1, title: 'Total Sum Invariant', content: 'Notice that right_sum at index i can be derived directly as total_sum - left_sum - nums[i].' },
        { tier: 2, title: 'Single Pass', content: 'First calculate total_sum in O(N). Then iterate while accumulating left_sum.' },
        { tier: 3, title: 'Time Complexity', content: 'This solves the problem in O(N) time with O(1) extra memory.' },
      ],
      testCases: [
        { id: 't_eq_1', input: '[1, 7, 3, 6, 5, 6]', expectedOutput: '3', isSample: true, explanation: 'Sum(0..2) == Sum(4..5) == 11' },
        { id: 't_eq_2', input: '[1, 2, 3]', expectedOutput: '-1', isSample: true },
        { id: 't_eq_3', input: '[2, 1, -1]', expectedOutput: '0', isSample: false },
        { id: 't_eq_4', input: '[0, 0, 0, 0]', expectedOutput: '0', isSample: false },
        { id: 't_eq_5', input: '[-1, -1, 0, 1, 1, 0]', expectedOutput: '5', isSample: false },
      ],
    }),
  },
  {
    key: 'var_second_largest',
    topic: 'arrays',
    difficulty: 'EASY',
    sourceProblemSlug: 'find-maximum-in-array',
    generate: () => ({
      id: `p_var_second_largest_${Date.now()}`,
      slug: 'find-second-largest-element',
      title: 'Find Second Largest Element',
      topic: 'arrays',
      topicName: 'Arrays',
      difficulty: 'EASY',
      descriptionMarkdown: `Given an array of integers \`nums\`, return the **second distinct largest** value in the array. If no distinct second largest element exists, return \`-1\`.\n\n### Example 1\n**Input:** \`nums = [12, 35, 1, 10, 34, 1]\`  \n**Output:** \`34\`\n\n### Example 2\n**Input:** \`nums = [10, 10, 10]\`  \n**Output:** \`-1\`  \n**Explanation:** All elements are identical.`,
      starterCode: `def second_largest(nums: list[int]) -> int:
    # Your solution here
    pass
`,
      referenceSolution: `def second_largest(nums: list[int]) -> int:
    first = second = -float('inf')
    for x in nums:
        if x > first:
            second = first
            first = x
        elif x > second and x != first:
            second = x
    return second if second != -float('inf') else -1
`,
      estimatedMinutes: 12,
      constraints: ['2 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
      status: 'DRAFT',
      provenance: 'PARAMETERIZED_VARIATION',
      sourceProblemId: 'p_max_element',
      hints: [
        { tier: 1, title: 'Two Pointers / Variables', content: 'Keep two variables: first and second, both initialized to negative infinity.' },
        { tier: 2, title: 'Cascade Update', content: 'When a new max is found, the old first becomes the new second!' },
        { tier: 3, title: 'Duplicate Handling', content: 'Be careful to ignore elements equal to first when considering second.' },
      ],
      testCases: [
        { id: 'sl1', input: '[12, 35, 1, 10, 34, 1]', expectedOutput: '34', isSample: true },
        { id: 'sl2', input: '[10, 10, 10]', expectedOutput: '-1', isSample: true },
        { id: 'sl3', input: '[5, 20]', expectedOutput: '5', isSample: false },
        { id: 'sl4', input: '[-5, -2, -10]', expectedOutput: '-5', isSample: false },
      ],
    }),
  },

  // ================= HASHING VARIATIONS =================
  {
    key: 'var_two_sum_difference',
    topic: 'hashing',
    difficulty: 'EASY',
    sourceProblemSlug: 'two-sum',
    generate: () => ({
      id: `p_var_two_sum_diff_${Date.now()}`,
      slug: 'find-pair-with-target-difference',
      title: 'Find Pair with Target Difference',
      topic: 'hashing',
      topicName: 'Hashing',
      difficulty: 'EASY',
      descriptionMarkdown: `Given an array of integers \`nums\` and an integer \`diff\`, return \`True\` if there exists a pair of distinct indices \`(i, j)\` such that \`abs(nums[i] - nums[j]) == diff\`. Otherwise return \`False\`.\n\n### Example 1\n**Input:** \`nums = [1, 5, 3, 4, 2], diff = 3\`  \n**Output:** \`True\`  \n**Explanation:** abs(5 - 2) == 3.\n\n### Example 2\n**Input:** \`nums = [8, 12, 16], diff = 5\`  \n**Output:** \`False\``,
      starterCode: `def pair_difference(nums: list[int], diff: int) -> bool:
    # Your solution here
    pass
`,
      referenceSolution: `def pair_difference(nums: list[int], diff: int) -> bool:
    seen = set()
    for x in nums:
        if (x - diff) in seen or (x + diff) in seen:
            return True
        seen.add(x)
    return False
`,
      estimatedMinutes: 12,
      constraints: ['2 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9', '0 <= diff <= 10^9'],
      status: 'DRAFT',
      provenance: 'PARAMETERIZED_VARIATION',
      sourceProblemId: 'p_two_sum',
      hints: [
        { tier: 1, title: 'Bidirectional Lookup', content: 'If abs(a - b) == diff, then either a = b + diff or a = b - diff.' },
        { tier: 2, title: 'Set Lookup', content: 'As you iterate through nums, check if (x - diff) or (x + diff) already exists in your seen set.' },
        { tier: 3, title: 'Linear Time', content: 'With a Hash Set, each membership test takes O(1) average time.' },
      ],
      testCases: [
        { id: 'pd1', input: '[1, 5, 3, 4, 2], 3', expectedOutput: 'True', isSample: true },
        { id: 'pd2', input: '[8, 12, 16], 5', expectedOutput: 'False', isSample: true },
        { id: 'pd3', input: '[1, 1], 0', expectedOutput: 'True', isSample: false },
        { id: 'pd4', input: '[-5, 0, 5], 10', expectedOutput: 'True', isSample: false },
      ],
    }),
  },
  {
    key: 'var_nearby_duplicate',
    topic: 'hashing',
    difficulty: 'MEDIUM',
    sourceProblemSlug: 'contains-duplicate',
    generate: () => ({
      id: `p_var_nearby_dup_${Date.now()}`,
      slug: 'contains-nearby-duplicate',
      title: 'Contains Nearby Duplicate',
      topic: 'hashing',
      topicName: 'Hashing',
      difficulty: 'MEDIUM',
      descriptionMarkdown: `Given an integer array \`nums\` and an integer \`k\`, return \`True\` if there are two distinct indices \`i\` and \`j\` in the array such that \`nums[i] == nums[j]\` and \`abs(i - j) <= k\`.\n\n### Example 1\n**Input:** \`nums = [1, 2, 3, 1], k = 3\`  \n**Output:** \`True\`\n\n### Example 2\n**Input:** \`nums = [1, 2, 3, 1, 2, 3], k = 2\`  \n**Output:** \`False\``,
      starterCode: `def contains_nearby_duplicate(nums: list[int], k: int) -> bool:
    # Your solution here
    pass
`,
      referenceSolution: `def contains_nearby_duplicate(nums: list[int], k: int) -> bool:
    seen = {}
    for i, x in enumerate(nums):
        if x in seen and i - seen[x] <= k:
            return True
        seen[x] = i
    return False
`,
      estimatedMinutes: 15,
      constraints: ['1 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9', '0 <= k <= 10^5'],
      status: 'DRAFT',
      provenance: 'PARAMETERIZED_VARIATION',
      sourceProblemId: 'p_contains_duplicate',
      hints: [
        { tier: 1, title: 'Store Last Seen Index', content: 'Use a dictionary where the key is the number and value is its most recent index.' },
        { tier: 2, title: 'Distance Check', content: 'Whenever you see x again, check if current_index - seen[x] <= k.' },
        { tier: 3, title: 'Always Update', content: 'Always update seen[x] = current_index to keep the most recent index for future checks.' },
      ],
      testCases: [
        { id: 'nd1', input: '[1, 2, 3, 1], 3', expectedOutput: 'True', isSample: true },
        { id: 'nd2', input: '[1, 2, 3, 1, 2, 3], 2', expectedOutput: 'False', isSample: true },
        { id: 'nd3', input: '[1, 0, 1, 1], 1', expectedOutput: 'True', isSample: false },
      ],
    }),
  },

  // ================= STRINGS VARIATIONS =================
  {
    key: 'var_palindrome_almost',
    topic: 'strings',
    difficulty: 'EASY',
    sourceProblemSlug: 'valid-palindrome',
    generate: () => ({
      id: `p_var_valid_palindrome_ii_${Date.now()}`,
      slug: 'valid-palindrome-with-one-deletion',
      title: 'Valid Palindrome with One Deletion',
      topic: 'strings',
      topicName: 'Strings',
      difficulty: 'EASY',
      descriptionMarkdown: `Given a string \`s\`, return \`True\` if the \`s\` can be a palindrome after deleting **at most one** character from it.\n\n### Example 1\n**Input:** \`s = "aba"\`  \n**Output:** \`True\`\n\n### Example 2\n**Input:** \`s = "abca"\`  \n**Output:** \`True\`  \n**Explanation:** You could delete character 'c'.\n\n### Example 3\n**Input:** \`s = "abc"\`  \n**Output:** \`False\``,
      starterCode: `def valid_palindrome_almost(s: str) -> bool:
    # Your solution here
    pass
`,
      referenceSolution: `def valid_palindrome_almost(s: str) -> bool:
    def is_p(sub):
        return sub == sub[::-1]
    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            return is_p(s[left+1:right+1]) or is_p(s[left:right])
        left += 1
        right -= 1
    return True
`,
      estimatedMinutes: 15,
      constraints: ['1 <= s.length <= 10^5', 's consists of lowercase English letters.'],
      status: 'DRAFT',
      provenance: 'PARAMETERIZED_VARIATION',
      sourceProblemId: 'p_valid_palindrome',
      hints: [
        { tier: 1, title: 'Normal Pointers First', content: 'Advance left and right pointers while characters match.' },
        { tier: 2, title: 'Single Mismatch Choice', content: 'When s[left] != s[right], you have two choices: delete s[left] or delete s[right].' },
        { tier: 3, title: 'Sub-check', content: 'Check if s[left+1 : right+1] or s[left : right] is a palindrome.' },
      ],
      testCases: [
        { id: 'vp2_1', input: '"aba"', expectedOutput: 'True', isSample: true },
        { id: 'vp2_2', input: '"abca"', expectedOutput: 'True', isSample: true },
        { id: 'vp2_3', input: '"abc"', expectedOutput: 'False', isSample: true },
        { id: 'vp2_4', input: '"tebbem"', expectedOutput: 'False', isSample: false },
      ],
    }),
  },

  // ================= SEARCHING VARIATIONS =================
  {
    key: 'var_search_insert_position',
    topic: 'searching',
    difficulty: 'EASY',
    sourceProblemSlug: 'binary-search',
    generate: () => ({
      id: `p_var_search_insert_${Date.now()}`,
      slug: 'search-insert-position',
      title: 'Search Insert Position',
      topic: 'searching',
      topicName: 'Searching',
      difficulty: 'EASY',
      descriptionMarkdown: `Given a sorted array of distinct integers \`nums\` and a target value \`target\`, return the index if the target is found. If not, return the index where it would be if it were inserted in order.\n\nYou must write an algorithm with \`O(log n)\` runtime complexity.\n\n### Example 1\n**Input:** \`nums = [1, 3, 5, 6], target = 5\`  \n**Output:** \`2\`\n\n### Example 2\n**Input:** \`nums = [1, 3, 5, 6], target = 2\`  \n**Output:** \`1\`\n\n### Example 3\n**Input:** \`nums = [1, 3, 5, 6], target = 7\`  \n**Output:** \`4\``,
      starterCode: `def search_insert(nums: list[int], target: int) -> int:
    # Your solution here
    pass
`,
      referenceSolution: `def search_insert(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return left
`,
      estimatedMinutes: 10,
      constraints: ['1 <= nums.length <= 10^4', '-10^4 <= nums[i], target <= 10^4', 'nums contains distinct values sorted in ascending order.'],
      status: 'DRAFT',
      provenance: 'PARAMETERIZED_VARIATION',
      sourceProblemId: 'p_binary_search',
      hints: [
        { tier: 1, title: 'Loop Termination', content: 'What value does `left` hold when the binary search loop terminates with left > right?' },
        { tier: 2, title: 'Insertion Point', content: 'When target is not found, `left` naturally points to the smallest index where nums[index] > target.' },
        { tier: 3, title: 'Return Left', content: 'Simply return `left` after the while loop finishes.' },
      ],
      testCases: [
        { id: 'si1', input: '[1, 3, 5, 6], 5', expectedOutput: '2', isSample: true },
        { id: 'si2', input: '[1, 3, 5, 6], 2', expectedOutput: '1', isSample: true },
        { id: 'si3', input: '[1, 3, 5, 6], 7', expectedOutput: '4', isSample: true },
        { id: 'si4', input: '[1, 3, 5, 6], 0', expectedOutput: '0', isSample: false },
      ],
    }),
  },
  {
    key: 'var_find_min_rotated',
    topic: 'searching',
    difficulty: 'MEDIUM',
    sourceProblemSlug: 'search-in-rotated-sorted-array',
    generate: () => ({
      id: `p_var_find_min_rotated_${Date.now()}`,
      slug: 'find-minimum-in-rotated-sorted-array',
      title: 'Find Minimum in Rotated Sorted Array',
      topic: 'searching',
      topicName: 'Searching',
      difficulty: 'MEDIUM',
      descriptionMarkdown: `Suppose an array of length \`n\` sorted in ascending order is rotated between \`1\` and \`n\` times.\n\nGiven the sorted rotated array \`nums\` of **unique** elements, return the **minimum element** of this array.\n\nYou must write an algorithm that runs in \`O(log n)\` time.\n\n### Example 1\n**Input:** \`nums = [3, 4, 5, 1, 2]\`  \n**Output:** \`1\`\n\n### Example 2\n**Input:** \`nums = [4, 5, 6, 7, 0, 1, 2]\`  \n**Output:** \`0\``,
      starterCode: `def find_min(nums: list[int]) -> int:
    # Your solution here
    pass
`,
      referenceSolution: `def find_min(nums: list[int]) -> int:
    left, right = 0, len(nums) - 1
    while left < right:
        mid = (left + right) // 2
        if nums[mid] > nums[right]:
            left = mid + 1
        else:
            right = mid
    return nums[left]
`,
      estimatedMinutes: 15,
      constraints: ['1 <= nums.length <= 5000', '-5000 <= nums[i] <= 5000', 'All the integers of nums are unique.'],
      status: 'DRAFT',
      provenance: 'PARAMETERIZED_VARIATION',
      sourceProblemId: 'p_search_rotated',
      hints: [
        { tier: 1, title: 'Pivot Point Invariant', content: 'Compare nums[mid] with nums[right].' },
        { tier: 2, title: 'Right Comparison', content: 'If nums[mid] > nums[right], the minimum MUST be strictly in the right half: left = mid + 1.' },
        { tier: 3, title: 'Left Comparison', content: 'If nums[mid] <= nums[right], the minimum is at mid or in the left half: right = mid.' },
      ],
      testCases: [
        { id: 'fm1', input: '[3, 4, 5, 1, 2]', expectedOutput: '1', isSample: true },
        { id: 'fm2', input: '[4, 5, 6, 7, 0, 1, 2]', expectedOutput: '0', isSample: true },
        { id: 'fm3', input: '[11, 13, 15, 17]', expectedOutput: '11', isSample: false },
        { id: 'fm4', input: '[2, 1]', expectedOutput: '1', isSample: false },
      ],
    }),
  },
];

/**
 * Generates an unattempted parameterized variation for a given topic and difficulty.
 */
export function generateVariationForTopic(
  topic: TopicSlug,
  difficulty: DifficultyLevel,
  existingProblemSlugs: Set<string>
): Problem | null {
  // Find templates matching topic and difficulty that have not yet been published
  const candidates = VARIATION_TEMPLATES.filter(
    (vt) => vt.topic === topic && vt.difficulty === difficulty
  );

  for (const template of candidates) {
    const candidateProblem = template.generate();
    if (!existingProblemSlugs.has(candidateProblem.slug)) {
      return candidateProblem;
    }
  }

  // Fallback: search across adjacent difficulties in same topic
  const topicCandidates = VARIATION_TEMPLATES.filter((vt) => vt.topic === topic);
  for (const template of topicCandidates) {
    const candidateProblem = template.generate();
    if (!existingProblemSlugs.has(candidateProblem.slug)) {
      return candidateProblem;
    }
  }

  return null;
}
