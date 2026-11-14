import { DuelOpponent, DuelProblem } from '../types';

export const DUEL_OPPONENTS: DuelOpponent[] = [
  {
    id: 'bot_dev',
    uid: 'CA-4096',
    name: 'Dev Khurana',
    avatar: 'dev_pro',
    elo: 1820,
    league: 'Diamond',
    title: 'Speed Demon ⚡',
    avatarEmoji: '🥷',
    speedMultiplier: 0.8, // very fast
  },
  {
    id: 'bot_aarav',
    uid: 'CA-5120',
    name: 'Aarav Sharma',
    avatar: 'aarav',
    elo: 1540,
    league: 'Diamond',
    title: 'Algorithm Wizard 🧙‍♂️',
    avatarEmoji: '🧙‍♂️',
    speedMultiplier: 1.0,
  },
  {
    id: 'bot_ananya',
    uid: 'CA-6310',
    name: 'Ananya Roy',
    avatar: 'ananya',
    elo: 1410,
    league: 'Gold',
    title: 'Two-Pointer Pro 🎯',
    avatarEmoji: '🔬',
    speedMultiplier: 1.15,
  },
  {
    id: 'bot_priya',
    uid: 'CA-3109',
    name: 'Priya Patel',
    avatar: 'priya',
    elo: 1280,
    league: 'Silver',
    title: 'Rising Contender 🚀',
    avatarEmoji: '👩‍💻',
    speedMultiplier: 1.3,
  },
  {
    id: 'bot_kabir',
    uid: 'CA-8294',
    name: 'Kabir Verma',
    avatar: 'kabir',
    elo: 1190,
    league: 'Bronze',
    title: 'Novice Challenger 🥊',
    avatarEmoji: '⚡',
    speedMultiplier: 1.5,
  },
];

export const DUEL_PROBLEMS: DuelProblem[] = [
  {
    id: 'duel_valid_anagram',
    title: 'Valid Anagram Speed Duel',
    topic: 'strings',
    difficulty: 'EASY',
    descriptionMarkdown: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.

An **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.

### Example 1:
\`\`\`
Input: s = "anagram", t = "nagaram"
Output: true
\`\`\`

### Example 2:
\`\`\`
Input: s = "rat", t = "car"
Output: false
\`\`\`

### Constraints:
- \`1 <= s.length, t.length <= 5 * 10^4\`
- \`s\` and \`t\` consist of lowercase English letters.`,
    starterCodes: {
      python: `def isAnagram(s: str, t: str) -> bool:
    # Write your solution here
    pass`,
      cpp: `#include <string>
#include <unordered_map>
using namespace std;

class Solution {
public:
    bool isAnagram(string s, string t) {
        // Write your solution here
        return false;
    }
};`,
      java: `import java.util.Arrays;

class Solution {
    public boolean isAnagram(String s, String t) {
        // Write your solution here
        return false;
    }
}`,
    },
    testCases: [
      { id: 'tc1', input: '"anagram"\n"nagaram"', expectedOutput: 'true', isSample: true },
      { id: 'tc2', input: '"rat"\n"car"', expectedOutput: 'false', isSample: true },
      { id: 'tc3', input: '"a"\n"a"', expectedOutput: 'true', isSample: false },
      { id: 'tc4', input: '"ab"\n"a"', expectedOutput: 'false', isSample: false },
      { id: 'tc5', input: '"listen"\n"silent"', expectedOutput: 'true', isSample: false },
    ],
    timeLimitMinutes: 5,
  },
  {
    id: 'duel_two_sum',
    title: 'Two Sum Sprint',
    topic: 'hashing',
    difficulty: 'EASY',
    descriptionMarkdown: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

### Example:
\`\`\`
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
\`\`\``,
    starterCodes: {
      python: `def twoSum(nums: list[int], target: int) -> list[int]:
    # Write your optimal O(N) hashmap solution
    pass`,
      cpp: `#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your code here
        return {};
    }
};`,
      java: `import java.util.HashMap;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
        return new int[]{};
    }
}`,
    },
    testCases: [
      { id: 'tc1', input: '[2,7,11,15]\n9', expectedOutput: '[0, 1]', isSample: true },
      { id: 'tc2', input: '[3,2,4]\n6', expectedOutput: '[1, 2]', isSample: true },
      { id: 'tc3', input: '[3,3]\n6', expectedOutput: '[0, 1]', isSample: false },
      { id: 'tc4', input: '[1,5,9,14]\n23', expectedOutput: '[2, 3]', isSample: false },
    ],
    timeLimitMinutes: 5,
  },
  {
    id: 'duel_reverse_string',
    title: 'Reverse String In-Place',
    topic: 'two-pointers',
    difficulty: 'EASY',
    descriptionMarkdown: `Write a function that reverses a string. The input string is given as an array of characters \`s\`.

You must do this by modifying the input array **in-place** with \`O(1)\` extra memory.

### Example:
\`\`\`
Input: s = ["h","e","l","l","o"]
Output: ["o","l","l","e","h"]
\`\`\``,
    starterCodes: {
      python: `def reverseString(s: list[str]) -> list[str]:
    # In-place two pointers
    pass`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    void reverseString(vector<char>& s) {
        // Two pointers
    }
};`,
      java: `class Solution {
    public void reverseString(char[] s) {
        // Two pointers
    }
}`,
    },
    testCases: [
      { id: 'tc1', input: '["h","e","l","l","o"]', expectedOutput: '["o","l","l","e","h"]', isSample: true },
      { id: 'tc2', input: '["H","a","n","n","a","h"]', expectedOutput: '["h","a","n","n","a","H"]', isSample: true },
      { id: 'tc3', input: '["A"]', expectedOutput: '["A"]', isSample: false },
    ],
    timeLimitMinutes: 4,
  },
];

export function calculateEloChange(
  playerElo: number,
  opponentElo: number,
  playerWon: boolean
): { playerChange: number; newElo: number } {
  const K = 32;
  const expectedScore = 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));
  const actualScore = playerWon ? 1 : 0;
  const change = Math.round(K * (actualScore - expectedScore));
  const newElo = Math.max(100, playerElo + change);
  return { playerChange: change, newElo };
}
