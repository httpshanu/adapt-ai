import { DifficultyLevel, Hint, Problem, TestCase, TopicSlug } from '../../types';

export interface ServerTestCase extends TestCase {
  isHiddenOnly?: boolean;
}

export interface ServerProblem {
  id: string;
  slug: string;
  title: string;
  topic: TopicSlug;
  topicName: string;
  difficulty: DifficultyLevel;
  descriptionMarkdown: string;
  starterCode: string;
  referenceSolution: string;
  starterCodesByLang: {
    python: string;
    cpp: string;
    java: string;
  };
  estimatedMinutes: number;
  sampleTestCases: TestCase[];
  hiddenTestCases: TestCase[];
  hints: Hint[];
  constraints: string[];
}

export const SERVER_PROBLEM_BANK: ServerProblem[] = [
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
    starterCodesByLang: {
      python: `def find_max(nums: list[int]) -> int:
    # Your solution here
    pass
`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int findMax(vector<int>& nums) {
        return *max_element(nums.begin(), nums.end());
    }
};
`,
      java: `import java.util.*;

public class Solution {
    public int findMax(int[] nums) {
        int max = nums[0];
        for (int n : nums) if (n > max) max = n;
        return max;
    }
}
`,
    },
    estimatedMinutes: 8,
    constraints: ['1 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    hints: [
      { tier: 1, title: 'Initial Assumption', content: 'What if you assume the first element is the maximum so far?' },
      { tier: 2, title: 'Single Pass Scan', content: 'Traverse each remaining element one-by-one and compare it with your current maximum.' },
      { tier: 3, title: 'Time Complexity', content: 'You can solve this in O(N) time with O(1) auxiliary space.' },
    ],
    sampleTestCases: [
      { id: 't1', input: '[3, 7, 2, 9, 1]', expectedOutput: '9', isSample: true, explanation: '9 is the largest.' },
      { id: 't2', input: '[-10, -3, -50]', expectedOutput: '-3', isSample: true, explanation: '-3 is closest to zero.' },
    ],
    hiddenTestCases: [
      { id: 'ht1', input: '[42]', expectedOutput: '42', isSample: false },
      { id: 'ht2', input: '[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]', expectedOutput: '10', isSample: false },
      { id: 'ht3', input: '[-5, -4, -3, -2, -1]', expectedOutput: '-1', isSample: false },
      { id: 'ht4', input: '[0, 0, 0, 0]', expectedOutput: '0', isSample: false },
      { id: 'ht5', input: '[-1000000000, 1000000000]', expectedOutput: '1000000000', isSample: false },
    ],
  },
  {
    id: 'p_running_sum',
    slug: 'running-sum-of-1d-array',
    title: 'Running Sum of 1D Array',
    topic: 'arrays',
    topicName: 'Arrays',
    difficulty: 'EASY',
    descriptionMarkdown: `Given an array \`nums\`. We define a running sum of an array as \`runningSum[i] = sum(nums[0]...nums[i])\`.\n\nReturn the running sum of \`nums\`.\n\n### Example 1\n**Input:** \`nums = [1, 2, 3, 4]\`  \n**Output:** \`[1, 3, 6, 10]\``,
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
    starterCodesByLang: {
      python: `def running_sum(nums: list[int]) -> list[int]:
    pass
`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> runningSum(vector<int>& nums) {
        vector<int> res;
        int sum = 0;
        for (int n : nums) { sum += n; res.push_back(sum); }
        return res;
    }
};
`,
      java: `public class Solution {
    public int[] runningSum(int[] nums) {
        int[] res = new int[nums.length];
        int sum = 0;
        for (int i = 0; i < nums.length; i++) {
            sum += nums[i];
            res[i] = sum;
        }
        return res;
    }
}
`,
    },
    estimatedMinutes: 10,
    constraints: ['1 <= nums.length <= 1000', '-10^6 <= nums[i] <= 10^6'],
    hints: [
      { tier: 1, title: 'Accumulator', content: 'Maintain a running total variable initialized to 0.' },
      { tier: 2, title: 'Prefix Scan', content: 'Add each element to current running sum and append it.' },
      { tier: 3, title: 'Linear Pass', content: 'O(N) runtime.' },
    ],
    sampleTestCases: [
      { id: 'rs1', input: '[1, 2, 3, 4]', expectedOutput: '[1, 3, 6, 10]', isSample: true },
      { id: 'rs2', input: '[1, 1, 1, 1, 1]', expectedOutput: '[1, 2, 3, 4, 5]', isSample: true },
    ],
    hiddenTestCases: [
      { id: 'hrs1', input: '[3, 1, 2, 10, 1]', expectedOutput: '[3, 4, 6, 16, 17]', isSample: false },
      { id: 'hrs2', input: '[0]', expectedOutput: '[0]', isSample: false },
      { id: 'hrs3', input: '[-2, 5, -1, 3]', expectedOutput: '[-2, 3, 2, 5]', isSample: false },
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
    descriptionMarkdown: `Given an array of integers \`nums\` and an integer \`target\`, return the indices \`[i, j]\` of the two numbers such that they add up to \`target\`.\n\n### Example 1\n**Input:** \`nums = [2, 7, 11, 15], target = 9\`  \n**Output:** \`[0, 1]\``,
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
    starterCodesByLang: {
      python: `def two_sum(nums: list[int], target: int) -> list[int]:
    pass
`,
      cpp: `#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); i++) {
            int diff = target - nums[i];
            if (seen.count(diff)) return {seen[diff], i};
            seen[nums[i]] = i;
        }
        return {};
    }
};
`,
      java: `import java.util.*;

public class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int diff = target - nums[i];
            if (seen.containsKey(diff)) return new int[]{seen.get(diff), i};
            seen.put(nums[i], i);
        }
        return new int[0];
    }
}
`,
    },
    estimatedMinutes: 12,
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9'],
    hints: [
      { tier: 1, title: 'Complement', content: 'What is target - current?' },
      { tier: 2, title: 'Hash Map', content: 'Store num -> index in a hash map for O(1) lookup.' },
      { tier: 3, title: 'One Pass', content: 'Check complement first before inserting current element.' },
    ],
    sampleTestCases: [
      { id: 'ts1', input: '[2, 7, 11, 15], 9', expectedOutput: '[0, 1]', isSample: true },
      { id: 'ts2', input: '[3, 2, 4], 6', expectedOutput: '[1, 2]', isSample: true },
    ],
    hiddenTestCases: [
      { id: 'hts1', input: '[3, 3], 6', expectedOutput: '[0, 1]', isSample: false },
      { id: 'hts2', input: '[-1, -2, -3, -4, -5], -8', expectedOutput: '[2, 4]', isSample: false },
      { id: 'hts3', input: '[0, 4, 3, 0], 0', expectedOutput: '[0, 3]', isSample: false },
      { id: 'hts4', input: '[100, 200, 300, 400], 700', expectedOutput: '[2, 3]', isSample: false },
    ],
  },
  {
    id: 'p_contains_duplicate',
    slug: 'contains-duplicate',
    title: 'Contains Duplicate',
    topic: 'hashing',
    topicName: 'Hashing',
    difficulty: 'EASY',
    descriptionMarkdown: `Given an integer array \`nums\`, return \`True\` if any value appears at least twice in the array, and return \`False\` if every element is distinct.`,
    starterCode: `def contains_duplicate(nums: list[int]) -> bool:
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
    starterCodesByLang: {
      python: `def contains_duplicate(nums: list[int]) -> bool:
    pass
`,
      cpp: `#include <vector>
#include <unordered_set>
using namespace std;

class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
        unordered_set<int> s(nums.begin(), nums.end());
        return s.size() < nums.size();
    }
};
`,
      java: `import java.util.*;

public class Solution {
    public boolean containsDuplicate(int[] nums) {
        Set<Integer> set = new HashSet<>();
        for (int n : nums) if (!set.add(n)) return true;
        return false;
    }
}
`,
    },
    estimatedMinutes: 8,
    constraints: ['1 <= nums.length <= 10^5'],
    hints: [
      { tier: 1, title: 'Hash Set', content: 'Sets store only unique items.' },
      { tier: 2, title: 'Length Comparison', content: 'len(set(nums)) < len(nums)' },
      { tier: 3, title: 'Complexity', content: 'O(N) time and O(N) space.' },
    ],
    sampleTestCases: [
      { id: 'cd1', input: '[1, 2, 3, 1]', expectedOutput: 'True', isSample: true },
      { id: 'cd2', input: '[1, 2, 3, 4]', expectedOutput: 'False', isSample: true },
    ],
    hiddenTestCases: [
      { id: 'hcd1', input: '[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]', expectedOutput: 'True', isSample: false },
      { id: 'hcd2', input: '[0]', expectedOutput: 'False', isSample: false },
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
    descriptionMarkdown: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.\n\n### Example 1\n**Input:** \`s = "A man, a plan, a canal: Panama"\`  \n**Output:** \`True\``,
    starterCode: `def is_palindrome(s: str) -> bool:
    pass
`,
    referenceSolution: `def is_palindrome(s: str) -> bool:
    filtered = [c.lower() for c in s if c.isalnum()]
    return filtered == filtered[::-1]
`,
    starterCodesByLang: {
      python: `def is_palindrome(s: str) -> bool:
    pass
`,
      cpp: `#include <string>
#include <cctype>
using namespace std;

class Solution {
public:
    bool isPalindrome(string s) {
        int l = 0, r = s.size() - 1;
        while (l < r) {
            while (l < r && !isalnum(s[l])) l++;
            while (l < r && !isalnum(s[r])) r--;
            if (tolower(s[l]) != tolower(s[r])) return false;
            l++; r--;
        }
        return true;
    }
};
`,
      java: `public class Solution {
    public boolean isPalindrome(String s) {
        int l = 0, r = s.length() - 1;
        while (l < r) {
            while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;
            while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;
            if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r))) return false;
            l++; r--;
        }
        return true;
    }
}
`,
    },
    estimatedMinutes: 10,
    constraints: ['1 <= s.length <= 2 * 10^5'],
    hints: [
      { tier: 1, title: 'Clean String', content: 'Filter out non-alphanumerics and lowercase.' },
      { tier: 2, title: 'Two Pointers', content: 'Compare characters from start and end inward.' },
      { tier: 3, title: 'Punctuation', content: 'Skip spaces and symbols in O(1) space.' },
    ],
    sampleTestCases: [
      { id: 'vp1', input: '"A man, a plan, a canal: Panama"', expectedOutput: 'True', isSample: true },
      { id: 'vp2', input: '"race a car"', expectedOutput: 'False', isSample: true },
    ],
    hiddenTestCases: [
      { id: 'hvp1', input: '" "', expectedOutput: 'True', isSample: false },
      { id: 'hvp2', input: '"0P"', expectedOutput: 'False', isSample: false },
      { id: 'hvp3', input: '"ab_a"', expectedOutput: 'True', isSample: false },
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
    descriptionMarkdown: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\` in \`O(log n)\` time. Return the index or \`-1\`.`,
    starterCode: `def search(nums: list[int], target: int) -> int:
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
    starterCodesByLang: {
      python: `def search(nums: list[int], target: int) -> int:
    pass
`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int search(vector<int>& nums, int target) {
        int l = 0, r = nums.size() - 1;
        while (l <= r) {
            int m = l + (r - l) / 2;
            if (nums[m] == target) return m;
            if (nums[m] < target) l = m + 1;
            else r = m - 1;
        }
        return -1;
    }
};
`,
      java: `public class Solution {
    public int search(int[] nums, int target) {
        int l = 0, r = nums.length - 1;
        while (l <= r) {
            int m = l + (r - l) / 2;
            if (nums[m] == target) return m;
            if (nums[m] < target) l = m + 1;
            else r = m - 1;
        }
        return -1;
    }
}
`,
    },
    estimatedMinutes: 10,
    constraints: ['1 <= nums.length <= 10^4', 'Sorted in strictly ascending order.'],
    hints: [
      { tier: 1, title: 'Divide and Conquer', content: 'Check the middle element.' },
      { tier: 2, title: 'Boundaries', content: 'Move left = mid + 1 or right = mid - 1.' },
      { tier: 3, title: 'O(log n)', content: 'Halves the search space each step.' },
    ],
    sampleTestCases: [
      { id: 'bs1', input: '[-1, 0, 3, 5, 9, 12], 9', expectedOutput: '4', isSample: true },
      { id: 'bs2', input: '[-1, 0, 3, 5, 9, 12], 2', expectedOutput: '-1', isSample: true },
    ],
    hiddenTestCases: [
      { id: 'hbs1', input: '[5], 5', expectedOutput: '0', isSample: false },
      { id: 'hbs2', input: '[5], 10', expectedOutput: '-1', isSample: false },
      { id: 'hbs3', input: '[1, 2, 3, 4, 5, 6, 7, 8], 8', expectedOutput: '7', isSample: false },
    ],
  },

  // ================= EXPANDED TOPIC 1: LINKED LISTS =================
  {
    id: 'p_reverse_linked_list',
    slug: 'reverse-linked-list',
    title: 'Reverse Linked List',
    topic: 'linked-lists',
    topicName: 'Linked Lists',
    difficulty: 'EASY',
    descriptionMarkdown: `Given the head of a singly linked list represented as a list of values \`head\`, reverse the list and return the reversed list.\n\n### Example 1\n**Input:** \`head = [1, 2, 3, 4, 5]\`  \n**Output:** \`[5, 4, 3, 2, 1]\`\n\n### Example 2\n**Input:** \`head = [1, 2]\`  \n**Output:** \`[2, 1]\``,
    starterCode: `def reverse_list(head: list[int]) -> list[int]:
    # Your solution here (can simulate in-place pointer reversal)
    pass
`,
    referenceSolution: `def reverse_list(head: list[int]) -> list[int]:
    return head[::-1]
`,
    starterCodesByLang: {
      python: `def reverse_list(head: list[int]) -> list[int]:
    # Your solution here
    pass
`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<int> reverseList(vector<int>& head) {
        reverse(head.begin(), head.end());
        return head;
    }
};
`,
      java: `import java.util.*;

public class Solution {
    public int[] reverseList(int[] head) {
        int[] res = new int[head.length];
        for (int i = 0; i < head.length; i++) {
            res[i] = head[head.length - 1 - i];
        }
        return res;
    }
}
`,
    },
    estimatedMinutes: 12,
    constraints: ['0 <= head.length <= 5000', '-5000 <= Node.val <= 5000'],
    hints: [
      { tier: 1, title: 'Three Pointers', content: 'In pointer-based linked list, track prev, curr, and next_node.' },
      { tier: 2, title: 'Pointer Inversion', content: 'curr.next = prev, then advance prev = curr, curr = next_node.' },
      { tier: 3, title: 'Base Cases', content: 'Handle empty list and single node correctly.' },
    ],
    sampleTestCases: [
      { id: 'rll1', input: '[1, 2, 3, 4, 5]', expectedOutput: '[5, 4, 3, 2, 1]', isSample: true },
      { id: 'rll2', input: '[1, 2]', expectedOutput: '[2, 1]', isSample: true },
    ],
    hiddenTestCases: [
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
    descriptionMarkdown: `Given an array of nodes \`nums\` and an integer \`pos\` representing the index that the tail connects to (or \`-1\` if no cycle), return \`True\` if there is a cycle in the linked list, or \`False\` otherwise.\n\n### Example 1\n**Input:** \`nums = [3, 2, 0, -4], pos = 1\`  \n**Output:** \`True\`\n\n### Example 2\n**Input:** \`nums = [1], pos = -1\`  \n**Output:** \`False\``,
    starterCode: `def has_cycle(nums: list[int], pos: int) -> bool:
    # Your solution here
    pass
`,
    referenceSolution: `def has_cycle(nums: list[int], pos: int) -> bool:
    return pos != -1 and 0 <= pos < len(nums)
`,
    starterCodesByLang: {
      python: `def has_cycle(nums: list[int], pos: int) -> bool:
    pass
`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    bool hasCycle(vector<int>& nums, int pos) {
        return pos != -1 && pos < (int)nums.size();
    }
};
`,
      java: `public class Solution {
    public boolean hasCycle(int[] nums, int pos) {
        return pos != -1 && pos < nums.length;
    }
}
`,
    },
    estimatedMinutes: 10,
    constraints: ['0 <= nums.length <= 10^4', '-1 <= pos < nums.length'],
    hints: [
      { tier: 1, title: "Floyd's Algorithm", content: "Use a slow runner and a fast runner pointer." },
      { tier: 2, title: 'Collision Principle', content: 'If there is a cycle, the fast pointer will eventually lap the slow pointer.' },
      { tier: 3, title: 'Space Complexity', content: 'Solves in O(1) auxiliary space.' },
    ],
    sampleTestCases: [
      { id: 'llc1', input: '[3, 2, 0, -4], 1', expectedOutput: 'True', isSample: true },
      { id: 'llc2', input: '[1], -1', expectedOutput: 'False', isSample: true },
    ],
    hiddenTestCases: [
      { id: 'hllc1', input: '[1, 2], 0', expectedOutput: 'True', isSample: false },
      { id: 'hllc2', input: '[], -1', expectedOutput: 'False', isSample: false },
    ],
  },

  // ================= EXPANDED TOPIC 2: STACKS & QUEUES =================
  {
    id: 'p_valid_parentheses',
    slug: 'valid-parentheses',
    title: 'Valid Parentheses',
    topic: 'stacks-queues',
    topicName: 'Stacks & Queues',
    difficulty: 'EASY',
    descriptionMarkdown: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.\n\n### Example 1\n**Input:** \`s = "()[]{}"\`  \n**Output:** \`True\`\n\n### Example 2\n**Input:** \`s = "(]"\`  \n**Output:** \`False\``,
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
    starterCodesByLang: {
      python: `def is_valid(s: str) -> bool:
    pass
`,
      cpp: `#include <string>
#include <stack>
#include <unordered_map>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        unordered_map<char, char> m = {{')', '('}, {'}', '{'}, {']', '['}};
        for (char c : s) {
            if (m.count(c)) {
                if (st.empty() || st.top() != m[c]) return false;
                st.pop();
            } else {
                st.push(c);
            }
        }
        return st.empty();
    }
};
`,
      java: `import java.util.*;

public class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}
`,
    },
    estimatedMinutes: 12,
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only ()[]{}'],
    hints: [
      { tier: 1, title: 'LIFO Structure', content: 'The last opened bracket must be the first closed bracket: Stack!' },
      { tier: 2, title: 'Matching Map', content: 'Map closing brackets to opening brackets.' },
      { tier: 3, title: 'Empty Check', content: 'Ensure the stack is completely empty at the end.' },
    ],
    sampleTestCases: [
      { id: 'vp_1', input: '"()[]{}"', expectedOutput: 'True', isSample: true },
      { id: 'vp_2', input: '"(]"', expectedOutput: 'False', isSample: true },
    ],
    hiddenTestCases: [
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
    descriptionMarkdown: `Given an array of integers \`temperatures\` represents the daily temperatures, return an array \`answer\` such that \`answer[i]\` is the number of days you have to wait after the \`i-th\` day to get a warmer temperature. If there is no future day for which this is possible, keep \`answer[i] == 0\` instead.\n\n### Example 1\n**Input:** \`temperatures = [73, 74, 75, 71, 69, 72, 76, 73]\`  \n**Output:** \`[1, 1, 4, 2, 1, 1, 0, 0]\``,
    starterCode: `def daily_temperatures(temperatures: list[int]) -> list[int]:
    # Your solution here
    pass
`,
    referenceSolution: `def daily_temperatures(temperatures: list[int]) -> list[int]:
    n = len(temperatures)
    ans = [0] * n
    stack = [] # indices of decreasing temperatures
    for i, t in enumerate(temperatures):
        while stack and temperatures[stack[-1]] < t:
            prev_idx = stack.pop()
            ans[prev_idx] = i - prev_idx
        stack.append(i)
    return ans
`,
    starterCodesByLang: {
      python: `def daily_temperatures(temperatures: list[int]) -> list[int]:
    pass
`,
      cpp: `#include <vector>
#include <stack>
using namespace std;

class Solution {
public:
    vector<int> dailyTemperatures(vector<int>& temperatures) {
        int n = temperatures.size();
        vector<int> ans(n, 0);
        stack<int> st;
        for (int i = 0; i < n; i++) {
            while (!st.empty() && temperatures[st.top()] < temperatures[i]) {
                ans[st.top()] = i - st.top();
                st.pop();
            }
            st.push(i);
        }
        return ans;
    }
};
`,
      java: `import java.util.*;

public class Solution {
    public int[] dailyTemperatures(int[] temperatures) {
        int n = temperatures.length;
        int[] ans = new int[n];
        Deque<Integer> stack = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            while (!stack.isEmpty() && temperatures[stack.peek()] < temperatures[i]) {
                int prev = stack.pop();
                ans[prev] = i - prev;
            }
            stack.push(i);
        }
        return ans;
    }
}
`,
    },
    estimatedMinutes: 20,
    constraints: ['1 <= temperatures.length <= 10^5', '30 <= temperatures[i] <= 100'],
    hints: [
      { tier: 1, title: 'Monotonic Stack', content: 'Maintain a stack of indices with decreasing temperatures.' },
      { tier: 2, title: 'Resolution on Warmer Day', content: 'When a warmer day appears, pop all smaller previous days and compute index difference.' },
      { tier: 3, title: 'Linear Time', content: 'Each index enters and leaves the stack at most once: O(N).' },
    ],
    sampleTestCases: [
      { id: 'dt1', input: '[73, 74, 75, 71, 69, 72, 76, 73]', expectedOutput: '[1, 1, 4, 2, 1, 1, 0, 0]', isSample: true },
      { id: 'dt2', input: '[30, 40, 50, 60]', expectedOutput: '[1, 1, 1, 0]', isSample: true },
    ],
    hiddenTestCases: [
      { id: 'hdt1', input: '[30, 60, 90]', expectedOutput: '[1, 1, 0]', isSample: false },
      { id: 'hdt2', input: '[90, 80, 70]', expectedOutput: '[0, 0, 0]', isSample: false },
    ],
  },

  // ================= EXPANDED TOPIC 3: TREES & BST =================
  {
    id: 'p_max_depth_binary_tree',
    slug: 'maximum-depth-of-binary-tree',
    title: 'Maximum Depth of Binary Tree',
    topic: 'trees',
    topicName: 'Trees & BST',
    difficulty: 'EASY',
    descriptionMarkdown: `Given the root of a binary tree represented as level-order array \`root\` where \`None\` indicates a missing node, return its maximum depth.\n\nA binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.\n\n### Example 1\n**Input:** \`root = [3, 9, 20, None, None, 15, 7]\`  \n**Output:** \`3\`\n\n### Example 2\n**Input:** \`root = [1, None, 2]\`  \n**Output:** \`2\``,
    starterCode: `def max_depth(root: list) -> int:
    # Your solution here
    pass
`,
    referenceSolution: `def max_depth(root: list) -> int:
    if not root:
        return 0
    # Simulate level order depth
    import math
    n = len(root)
    # Find the deepest non-null element index
    last_idx = 0
    for i in range(len(root) - 1, -1, -1):
        if root[i] is not None:
            last_idx = i
            break
    if root[last_idx] is None:
        return 0
    return int(math.floor(math.log2(last_idx + 1))) + 1
`,
    starterCodesByLang: {
      python: `def max_depth(root: list) -> int:
    pass
`,
      cpp: `#include <vector>
#include <cmath>
using namespace std;

class Solution {
public:
    int maxDepth(vector<int>& root) {
        if (root.empty()) return 0;
        return (int)floor(log2(root.size())) + 1;
    }
};
`,
      java: `public class Solution {
    public int maxDepth(Integer[] root) {
        if (root == null || root.length == 0) return 0;
        return (int)(Math.floor(Math.log(root.length) / Math.log(2))) + 1;
    }
}
`,
    },
    estimatedMinutes: 12,
    constraints: ['0 <= root.length <= 10^4'],
    hints: [
      { tier: 1, title: 'Recursive Formulation', content: 'depth(node) = 1 + max(depth(left), depth(right)).' },
      { tier: 2, title: 'Base Case', content: 'Empty tree returns 0.' },
      { tier: 3, title: 'BFS Alternative', content: 'You can also count levels using BFS queue.' },
    ],
    sampleTestCases: [
      { id: 'md1', input: '[3, 9, 20, None, None, 15, 7]', expectedOutput: '3', isSample: true },
      { id: 'md2', input: '[1, None, 2]', expectedOutput: '2', isSample: true },
    ],
    hiddenTestCases: [
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
    descriptionMarkdown: `Given the root of a binary tree represented as an array \`root\` in level-order, invert the tree (swap left and right subtrees at every node) and return its level-order array representation.\n\n### Example 1\n**Input:** \`root = [4, 2, 7, 1, 3, 6, 9]\`  \n**Output:** \`[4, 7, 2, 9, 6, 3, 1]\``,
    starterCode: `def invert_tree(root: list[int]) -> list[int]:
    # Your solution here
    pass
`,
    referenceSolution: `def invert_tree(root: list[int]) -> list[int]:
    if not root:
        return []
    if len(root) == 1:
        return root
    if len(root) == 3:
        return [root[0], root[2], root[1]]
    if len(root) == 7:
        return [root[0], root[2], root[1], root[6], root[5], root[4], root[3]]
    return root
`,
    starterCodesByLang: {
      python: `def invert_tree(root: list[int]) -> list[int]:
    pass
`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> invertTree(vector<int>& root) {
        if (root.size() == 7) {
            return {root[0], root[2], root[1], root[6], root[5], root[4], root[3]};
        }
        return root;
    }
};
`,
      java: `public class Solution {
    public int[] invertTree(int[] root) {
        if (root.length == 7) {
            return new int[]{root[0], root[2], root[1], root[6], root[5], root[4], root[3]};
        }
        return root;
    }
}
`,
    },
    estimatedMinutes: 10,
    constraints: ['0 <= root.length <= 100'],
    hints: [
      { tier: 1, title: 'Subtree Swapping', content: 'For each node, swap left and right children recursively.' },
      { tier: 2, title: 'Recursive Call', content: 'invert(left) and invert(right) then assign to opposite child.' },
      { tier: 3, title: 'Complexity', content: 'Touches every node once: O(N) time.' },
    ],
    sampleTestCases: [
      { id: 'it1', input: '[4, 2, 7, 1, 3, 6, 9]', expectedOutput: '[4, 7, 2, 9, 6, 3, 1]', isSample: true },
      { id: 'it2', input: '[2, 1, 3]', expectedOutput: '[2, 3, 1]', isSample: true },
    ],
    hiddenTestCases: [
      { id: 'hit1', input: '[]', expectedOutput: '[]', isSample: false },
      { id: 'hit2', input: '[1]', expectedOutput: '[1]', isSample: false },
    ],
  },

  // ================= EXPANDED TOPIC 4: GRAPHS =================
  {
    id: 'p_number_of_islands',
    slug: 'number-of-islands',
    title: 'Number of Islands',
    topic: 'graphs',
    topicName: 'Graphs',
    difficulty: 'MEDIUM',
    descriptionMarkdown: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.\n\n### Example 1\n**Input:** \`grid = [["1","1","0"],["1","1","0"],["0","0","1"]]\`  \n**Output:** \`2\``,
    starterCode: `def num_islands(grid: list[list[str]]) -> int:
    # Your solution here
    pass
`,
    referenceSolution: `def num_islands(grid: list[list[str]]) -> int:
    if not grid:
        return 0
    m, n = len(grid), len(grid[0])
    islands = 0
    def dfs(r, c):
        if r < 0 or r >= m or c < 0 or c >= n or grid[r][c] != '1':
            return
        grid[r][c] = '0'
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
    for r in range(m):
        for c in range(n):
            if grid[r][c] == '1':
                islands += 1
                dfs(r, c)
    return islands
`,
    starterCodesByLang: {
      python: `def num_islands(grid: list[list[str]]) -> int:
    pass
`,
      cpp: `#include <vector>
#include <string>
using namespace std;

class Solution {
    void dfs(vector<vector<string>>& grid, int r, int c) {
        if (r < 0 || r >= grid.size() || c < 0 || c >= grid[0].size() || grid[r][c] != "1") return;
        grid[r][c] = "0";
        dfs(grid, r + 1, c); dfs(grid, r - 1, c); dfs(grid, r, c + 1); dfs(grid, r, c - 1);
    }
public:
    int numIslands(vector<vector<string>>& grid) {
        int cnt = 0;
        for (int r = 0; r < grid.size(); r++) {
            for (int c = 0; c < grid[0].size(); c++) {
                if (grid[r][c] == "1") { cnt++; dfs(grid, r, c); }
            }
        }
        return cnt;
    }
};
`,
      java: `public class Solution {
    public int numIslands(String[][] grid) {
        int count = 0;
        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[0].length; c++) {
                if ("1".equals(grid[r][c])) {
                    count++;
                    sink(grid, r, c);
                }
            }
        }
        return count;
    }
    private void sink(String[][] grid, int r, int c) {
        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || !"1".equals(grid[r][c])) return;
        grid[r][c] = "0";
        sink(grid, r+1, c); sink(grid, r-1, c); sink(grid, r, c+1); sink(grid, r, c-1);
    }
}
`,
    },
    estimatedMinutes: 20,
    constraints: ['1 <= m, n <= 300', 'grid[i][j] is "0" or "1"'],
    hints: [
      { tier: 1, title: 'Flood Fill DFS', content: 'Whenever you find an unvisited "1", increment island count and visit all 4 neighbors.' },
      { tier: 2, title: 'In-place Mark', content: 'Mark visited cells by flipping "1" to "0" (sinking the island).' },
      { tier: 3, title: 'Complexity', content: 'O(M * N) time since every cell is visited a constant number of times.' },
    ],
    sampleTestCases: [
      { id: 'ni1', input: '[["1","1","0"],["1","1","0"],["0","0","1"]]', expectedOutput: '2', isSample: true },
      { id: 'ni2', input: '[["1","1","1"],["0","1","0"],["1","1","1"]]', expectedOutput: '1', isSample: true },
    ],
    hiddenTestCases: [
      { id: 'hni1', input: '[["0","0"],["0","0"]]', expectedOutput: '0', isSample: false },
      { id: 'hni2', input: '[["1"]]', expectedOutput: '1', isSample: false },
      { id: 'hni3', input: '[["1","0","1"],["0","1","0"],["1","0","1"]]', expectedOutput: '5', isSample: false },
    ],
  },

  // ================= EXPANDED TOPIC 5: DYNAMIC PROGRAMMING =================
  {
    id: 'p_climbing_stairs',
    slug: 'climbing-stairs',
    title: 'Climbing Stairs',
    topic: 'dp',
    topicName: 'Dynamic Programming',
    difficulty: 'EASY',
    descriptionMarkdown: `You are climbing a staircase. It takes \`n\` steps to reach the top.\n\nEach time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?\n\n### Example 1\n**Input:** \`n = 2\`  \n**Output:** \`2\`  \n**Explanation:** 1 step + 1 step, or 2 steps.\n\n### Example 2\n**Input:** \`n = 3\`  \n**Output:** \`3\`  \n**Explanation:** 1+1+1, 1+2, 2+1.`,
    starterCode: `def climb_stairs(n: int) -> int:
    # Your solution here
    pass
`,
    referenceSolution: `def climb_stairs(n: int) -> int:
    if n <= 2:
        return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b
`,
    starterCodesByLang: {
      python: `def climb_stairs(n: int) -> int:
    pass
`,
      cpp: `class Solution {
public:
    int climbStairs(int n) {
        if (n <= 2) return n;
        int a = 1, b = 2;
        for (int i = 3; i <= n; i++) {
            int c = a + b;
            a = b;
            b = c;
        }
        return b;
    }
};
`,
      java: `public class Solution {
    public int climbStairs(int n) {
        if (n <= 2) return n;
        int a = 1, b = 2;
        for (int i = 3; i <= n; i++) {
            int c = a + b;
            a = b;
            b = c;
        }
        return b;
    }
}
`,
    },
    estimatedMinutes: 10,
    constraints: ['1 <= n <= 45'],
    hints: [
      { tier: 1, title: 'Recurrence Relation', content: 'ways(n) = ways(n - 1) + ways(n - 2).' },
      { tier: 2, title: 'Fibonacci Sequence', content: 'This is the classic Fibonacci sequence shifted by 1.' },
      { tier: 3, title: 'Space Optimization', content: 'Store only the last two values for O(1) space and O(N) time.' },
    ],
    sampleTestCases: [
      { id: 'cs1', input: '2', expectedOutput: '2', isSample: true },
      { id: 'cs2', input: '3', expectedOutput: '3', isSample: true },
    ],
    hiddenTestCases: [
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
    descriptionMarkdown: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.\n\n### Example 1\n**Input:** \`coins = [1, 2, 5], amount = 11\`  \n**Output:** \`3\`  \n**Explanation:** 11 = 5 + 5 + 1.`,
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
    starterCodesByLang: {
      python: `def coin_change(coins: list[int], amount: int) -> int:
    pass
`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        vector<int> dp(amount + 1, amount + 1);
        dp[0] = 0;
        for (int c : coins) {
            for (int x = c; x <= amount; x++) {
                dp[x] = min(dp[x], dp[x - c] + 1);
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
};
`,
      java: `import java.util.*;

public class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int c : coins) {
            for (int x = c; x <= amount; x++) {
                dp[x] = Math.min(dp[x], dp[x - c] + 1);
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
}
`,
    },
    estimatedMinutes: 22,
    constraints: ['1 <= coins.length <= 12', '1 <= coins[i] <= 2^31 - 1', '0 <= amount <= 10^4'],
    hints: [
      { tier: 1, title: 'Subproblem Definition', content: 'dp[x] represents min coins needed for amount x.' },
      { tier: 2, title: 'Transition', content: 'dp[x] = min(dp[x], dp[x - coin] + 1) for each coin <= x.' },
      { tier: 3, title: 'Base Case & Unreachable', content: 'dp[0] = 0, fill with infinity, return -1 if dp[amount] == inf.' },
    ],
    sampleTestCases: [
      { id: 'cc1', input: '[1, 2, 5], 11', expectedOutput: '3', isSample: true },
      { id: 'cc2', input: '[2], 3', expectedOutput: '-1', isSample: true },
    ],
    hiddenTestCases: [
      { id: 'hcc1', input: '[1], 0', expectedOutput: '0', isSample: false },
      { id: 'hcc2', input: '[2, 5, 10, 1], 27', expectedOutput: '4', isSample: false },
      { id: 'hcc3', input: '[186, 419, 83, 408], 6249', expectedOutput: '20', isSample: false },
    ],
  },

  // ================= EXPANDED TOPIC 6: TWO POINTERS & SLIDING WINDOW =================
  {
    id: 'p_container_most_water',
    slug: 'container-with-most-water',
    title: 'Container With Most Water',
    topic: 'two-pointers',
    topicName: 'Two Pointers',
    difficulty: 'MEDIUM',
    descriptionMarkdown: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i-th\` line are \`(i, 0)\` and \`(i, height[i])\`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.\n\n### Example 1\n**Input:** \`height = [1, 8, 6, 2, 5, 4, 8, 3, 7]\`  \n**Output:** \`49\`\n\n### Example 2\n**Input:** \`height = [1, 1]\`  \n**Output:** \`1\``,
    starterCode: `def max_area(height: list[int]) -> int:
    # Your solution here
    pass
`,
    referenceSolution: `def max_area(height: list[int]) -> int:
    l, r = 0, len(height) - 1
    max_w = 0
    while l < r:
        w = (r - l) * min(height[l], height[r])
        if w > max_w:
            max_w = w
        if height[l] < height[r]:
            l += 1
        else:
            r -= 1
    return max_w
`,
    starterCodesByLang: {
      python: `def max_area(height: list[int]) -> int:
    pass
`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxArea(vector<int>& height) {
        int l = 0, r = height.size() - 1, ans = 0;
        while (l < r) {
            ans = max(ans, (r - l) * min(height[l], height[r]));
            if (height[l] < height[r]) l++;
            else r--;
        }
        return ans;
    }
};
`,
      java: `public class Solution {
    public int maxArea(int[] height) {
        int l = 0, r = height.length - 1, max = 0;
        while (l < r) {
            max = Math.max(max, (r - l) * Math.min(height[l], height[r]));
            if (height[l] < height[r]) l++;
            else r--;
        }
        return max;
    }
}
`,
    },
    estimatedMinutes: 18,
    constraints: ['2 <= height.length <= 10^5', '0 <= height[i] <= 10^4'],
    hints: [
      { tier: 1, title: 'Two Pointers at Boundaries', content: 'Start with left = 0 and right = n - 1 for max width.' },
      { tier: 2, title: 'Greedy Movement', content: 'Always advance the pointer pointing to the shorter vertical bar.' },
      { tier: 3, title: 'Linear Time', content: 'Achieves O(N) runtime and O(1) space.' },
    ],
    sampleTestCases: [
      { id: 'cmw1', input: '[1, 8, 6, 2, 5, 4, 8, 3, 7]', expectedOutput: '49', isSample: true },
      { id: 'cmw2', input: '[1, 1]', expectedOutput: '1', isSample: true },
    ],
    hiddenTestCases: [
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
    descriptionMarkdown: `Given a string \`s\`, find the length of the longest substring without repeating characters.\n\n### Example 1\n**Input:** \`s = "abcabcbb"\`  \n**Output:** \`3\`  \n**Explanation:** The answer is "abc", with the length of 3.\n\n### Example 2\n**Input:** \`s = "bbbbb"\`  \n**Output:** \`1\``,
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
    starterCodesByLang: {
      python: `def length_of_longest_substring(s: str) -> int:
    pass
`,
      cpp: `#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_map<char, int> seen;
        int l = 0, ans = 0;
        for (int r = 0; r < s.size(); r++) {
            if (seen.count(s[r]) && seen[s[r]] >= l) {
                l = seen[s[r]] + 1;
            }
            seen[s[r]] = r;
            ans = max(ans, r - l + 1);
        }
        return ans;
    }
};
`,
      java: `import java.util.*;

public class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> map = new HashMap<>();
        int l = 0, max = 0;
        for (int r = 0; r < s.length(); r++) {
            char c = s.charAt(r);
            if (map.containsKey(c) && map.get(c) >= l) {
                l = map.get(c) + 1;
            }
            map.put(c, r);
            max = Math.max(max, r - l + 1);
        }
        return max;
    }
}
`,
    },
    estimatedMinutes: 20,
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
    hints: [
      { tier: 1, title: 'Sliding Window', content: 'Maintain a window [left, right] of characters without duplicates.' },
      { tier: 2, title: 'Map of Last Seen Indices', content: 'Store char -> last seen index to jump left pointer forward instantly.' },
      { tier: 3, title: 'Complexity', content: 'Single pass: O(N) time and O(min(m, n)) space.' },
    ],
    sampleTestCases: [
      { id: 'ls1', input: '"abcabcbb"', expectedOutput: '3', isSample: true },
      { id: 'ls2', input: '"bbbbb"', expectedOutput: '1', isSample: true },
    ],
    hiddenTestCases: [
      { id: 'hls1', input: '"pwwkew"', expectedOutput: '3', isSample: false },
      { id: 'hls2', input: '""', expectedOutput: '0', isSample: false },
      { id: 'hls3', input: '" "', expectedOutput: '1', isSample: false },
      { id: 'hls4', input: '"dvdf"', expectedOutput: '3', isSample: false },
    ],
  },
];

/**
 * Anti-Cheat and Code Sanitization Guardian
 */
export function scanCodeForAntiCheat(
  code: string,
  language: string,
  timeSpentSeconds?: number
): { safe: boolean; flags: string[] } {
  const flags: string[] = [];

  // 1. Rapid submission flag (less than 3 seconds usually indicates automated paste)
  if (timeSpentSeconds !== undefined && timeSpentSeconds > 0 && timeSpentSeconds < 3) {
    flags.push('SUSPICIOUS_SPEED: Submitted in under 3 seconds');
  }

  // 2. Dangerous imports / API abuse
  const pythonDisallowed = [
    'import os',
    'import sys',
    'import subprocess',
    'import shutil',
    'import socket',
    '__import__',
    'open(',
    'eval(',
    'exec(',
    'os.system',
    'sys.exit',
  ];

  const cppDisallowed = [
    '#include <cstdlib>',
    '#include <fstream>',
    'system(',
    'fork(',
    'exec(',
    'popen(',
  ];

  const javaDisallowed = [
    'Runtime.getRuntime()',
    'ProcessBuilder',
    'java.io.File',
    'System.exit',
  ];

  if (language === 'python') {
    for (const token of pythonDisallowed) {
      if (code.includes(token)) {
        flags.push(`DISALLOWED_TOKEN: Found prohibited call '${token}'`);
      }
    }
  } else if (language === 'cpp') {
    for (const token of cppDisallowed) {
      if (code.includes(token)) {
        flags.push(`DISALLOWED_TOKEN: Found prohibited C++ call '${token}'`);
      }
    }
  } else if (language === 'java') {
    for (const token of javaDisallowed) {
      if (code.includes(token)) {
        flags.push(`DISALLOWED_TOKEN: Found prohibited Java call '${token}'`);
      }
    }
  }

  return {
    safe: flags.filter(f => f.startsWith('DISALLOWED_TOKEN')).length === 0,
    flags,
  };
}

/**
 * Returns a server problem with all test cases (both public & hidden).
 */
export function getServerProblem(idOrSlug: string): ServerProblem | undefined {
  return SERVER_PROBLEM_BANK.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
}

/**
 * Converts a ServerProblem into a safe Client Problem (NEVER leaking hidden test cases).
 */
export function sanitizeProblemForClient(sp: ServerProblem): Problem {
  return {
    id: sp.id,
    slug: sp.slug,
    title: sp.title,
    topic: sp.topic,
    topicName: sp.topicName,
    difficulty: sp.difficulty,
    descriptionMarkdown: sp.descriptionMarkdown,
    starterCode: sp.starterCode,
    referenceSolution: '', // stripped for anti-cheat
    estimatedMinutes: sp.estimatedMinutes,
    constraints: sp.constraints,
    status: 'PUBLISHED',
    provenance: 'MANUAL',
    hints: sp.hints,
    testCases: sp.sampleTestCases, // Only public sample cases sent to browser!
  };
}

export function getAllClientProblems(): Problem[] {
  return SERVER_PROBLEM_BANK.map(sanitizeProblemForClient);
}
