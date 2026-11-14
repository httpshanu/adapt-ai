import { ChatChannel, ChatMessage } from '../types';

export const CHAT_CHANNELS: ChatChannel[] = [
  {
    id: 'general',
    name: 'general-chat',
    description: 'Hangout, share your daily coding wins, and talk tech.',
    icon: '💬',
    category: 'community',
  },
  {
    id: 'doubt-help',
    name: 'doubt-solver',
    description: 'Stuck on a tricky problem? Ask the community and @CodeAdaptBot for hints!',
    icon: '🆘',
    category: 'learning',
  },
  {
    id: 'daily-quiz-talk',
    name: 'daily-quiz-chat',
    description: 'Discuss today’s blitz quiz questions, edge cases & time complexities.',
    icon: '🧠',
    category: 'learning',
  },
  {
    id: 'code-showcase',
    name: 'code-flex',
    description: 'Flex your 0ms O(N) runtime solutions, clean code snippets & streak achievements.',
    icon: '🚀',
    category: 'community',
  },
  {
    id: 'study-room',
    name: 'lo-fi-focus-room',
    description: 'Silent study space with built-in Pomodoro timer and lo-fi coding flow.',
    icon: '🎧',
    category: 'focus',
  },
];

export const INITIAL_CHANNEL_MESSAGES: Record<string, ChatMessage[]> = {
  general: [
    {
      id: 'msg_gen_1',
      channelId: 'general',
      author: {
        id: 'peer_1',
        name: 'Dev Khurana',
        avatar: 'dev_pro',
        badge: 'Diamond 💎',
        role: 'Top Contender',
      },
      content: 'Hey everyone! Just hit a 15-day streak on CodeAdapt AI 🔥 Anyone prepping for upcoming tech interviews?',
      reactions: { '🔥': 5, '👏': 3, '🚀': 2 },
      timestamp: 'Today at 4:15 PM',
    },
    {
      id: 'msg_gen_2',
      channelId: 'general',
      author: {
        id: 'peer_3',
        name: 'Ananya Roy',
        avatar: 'ananya',
        badge: 'Gold 🥇',
      },
      content: 'Awesome streak Dev! The adaptive engine recommended dynamic programming for me today after I struggled with recursion yesterday. Really loving the step-by-step difficulty curve.',
      reactions: { '💡': 4, '❤️': 2 },
      timestamp: 'Today at 4:22 PM',
    },
    {
      id: 'msg_gen_3',
      channelId: 'general',
      author: {
        id: 'bot_ai',
        name: 'CodeAdaptBot',
        avatar: 'bot',
        badge: 'AI Mentor 🤖',
        isBot: true,
      },
      content: 'Welcome to the Code Lounge! 🚀 Feel free to share your solutions, ask questions in `#doubt-solver`, or tag me `@CodeAdaptBot` if you need hints on any algorithm without spoiling the answer!',
      reactions: { '🤖': 6, '✨': 4 },
      timestamp: 'Today at 4:25 PM',
    },
  ],
  'doubt-help': [
    {
      id: 'msg_dh_1',
      channelId: 'doubt-help',
      author: {
        id: 'peer_5',
        name: 'Priya Patel',
        avatar: 'priya',
        badge: 'Silver 🥈',
      },
      content: 'Can someone explain why using `nums[left] + nums[right]` works in Two Sum Sorted, but fails if the array is unsorted?',
      reactions: { '🤔': 2 },
      timestamp: 'Today at 5:02 PM',
    },
    {
      id: 'msg_dh_2',
      channelId: 'doubt-help',
      author: {
        id: 'bot_ai',
        name: 'CodeAdaptBot',
        avatar: 'bot',
        badge: 'AI Mentor 🤖',
        isBot: true,
      },
      content: 'Great question Priya! In a sorted array, the values are monotonic. If `sum < target`, incrementing `left` is guaranteed to increase the sum. If unsorted, you can’t make any assumption about which element is larger or smaller, so two pointers can’t prune the search space! For unsorted arrays, use a Hash Map (O(N) time and O(N) space) instead.',
      reactions: { '💡': 7, '🔥': 4 },
      timestamp: 'Today at 5:03 PM',
    },
    {
      id: 'msg_dh_3',
      channelId: 'doubt-help',
      author: {
        id: 'peer_2',
        name: 'Aarav Sharma',
        avatar: 'aarav',
        badge: 'Diamond 💎',
      },
      content: 'Tagging @CodeAdaptBot is like having a private tutor in the room. Thanks bot!',
      reactions: { '🙌': 3 },
      timestamp: 'Today at 5:10 PM',
    },
  ],
  'daily-quiz-talk': [
    {
      id: 'msg_dq_1',
      channelId: 'daily-quiz-talk',
      author: {
        id: 'peer_4',
        name: 'Rohan Mehta',
        avatar: 'rohan',
        badge: 'Gold 🥇',
      },
      content: 'Did everyone check today\'s Daily Blitz? The question on Java String immutability in loops caught me off guard at first!',
      reactions: { '😅': 3, '💯': 2 },
      timestamp: 'Today at 6:30 PM',
    },
    {
      id: 'msg_dq_2',
      channelId: 'daily-quiz-talk',
      author: {
        id: 'peer_1',
        name: 'Dev Khurana',
        avatar: 'dev_pro',
        badge: 'Diamond 💎',
      },
      content: 'Yes! Always remember: `String` concatenation in loops creates O(N²) garbage allocations in JVM. Always use `StringBuilder` for O(N) amortized performance.',
      reactions: { '🔥': 5, '🧠': 4 },
      timestamp: 'Today at 6:35 PM',
    },
  ],
  'code-flex': [
    {
      id: 'msg_cf_1',
      channelId: 'code-flex',
      author: {
        id: 'peer_2',
        name: 'Aarav Sharma',
        avatar: 'aarav',
        badge: 'Diamond 💎',
      },
      content: 'Finally got 0ms 100% test case pass on "Valid Palindrome" in C++ using two pointers! Check this clean loop:',
      codeSnippet: {
        language: 'cpp',
        code: `bool isPalindrome(string s) {
    int i = 0, j = s.size() - 1;
    while (i < j) {
        while (i < j && !isalnum(s[i])) i++;
        while (i < j && !isalnum(s[j])) j--;
        if (tolower(s[i++]) != tolower(s[j--])) return false;
    }
    return true;
}`,
      },
      reactions: { '🚀': 8, '🔥': 6, '💯': 5 },
      timestamp: 'Today at 3:45 PM',
    },
  ],
  'study-room': [
    {
      id: 'msg_sr_1',
      channelId: 'study-room',
      author: {
        id: 'bot_ai',
        name: 'StudyPomodoroBot',
        avatar: 'bot',
        badge: 'Focus Assistant ⏱️',
        isBot: true,
      },
      content: 'Welcome to the Lo-Fi Study Room! 🎧 Use the timer below for a 25-minute uninterrupted Pomodoro session. Keep notifications muted and lock in.',
      reactions: { '☕': 7, '🎯': 4 },
      timestamp: 'System',
    },
  ],
};

export function generateBotResponse(userPrompt: string): string {
  const lower = userPrompt.toLowerCase();
  
  if (lower.includes('two sum') || lower.includes('2sum')) {
    return 'For Two Sum: If array is sorted, use two pointers (`left = 0`, `right = n - 1`). If unsorted, iterate through the list while storing `complement = target - num` in a Hash Map. That gives optimal O(N) time and O(N) space!';
  }
  if (lower.includes('reverse linked list') || lower.includes('linked list')) {
    return 'For Reversing a Linked List: Maintain three pointers (`prev = null`, `curr = head`, `next = null`). In each step, remember `next = curr.next`, point `curr.next = prev`, then shift `prev = curr` and `curr = next`. Returns `prev`!';
  }
  if (lower.includes('binary search') || lower.includes('search')) {
    return 'For Binary Search: Always compute `mid = left + (right - left) // 2` to avoid integer overflow. Check `nums[mid] == target`. If target is greater, search right (`left = mid + 1`); otherwise search left (`right = mid - 1`).';
  }
  if (lower.includes('dp') || lower.includes('dynamic programming')) {
    return 'The secret to Dynamic Programming is finding the recurrence relation! Ask yourself: 1) What is the state representation? 2) What choice can I make at each step? 3) What is the base case? Start with memoization (top-down) before converting to tabulation (bottom-up).';
  }
  if (lower.includes('streak') || lower.includes('xp') || lower.includes('points') || lower.includes('leaderboard')) {
    return 'Keep up your daily practice! Solving daily quizzes earns +30 to +50 XP, and maintaining your daily streak gives up to a 1.5x multiplier on all problem solves. Top the weekly leaderboard to claim the Grandmaster crown! 👑';
  }
  
  return `That's a fantastic algorithmic question! 💡 In computer science, always start by analyzing the brute-force approach, identify the bottleneck (repeated searches or redundant subproblems), and apply the optimal data structure (Hash Map, Heap, or Monotonic Stack). What constraints are you dealing with?`;
}
