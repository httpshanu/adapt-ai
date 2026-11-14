export type SupportedLanguage = 'python' | 'cpp' | 'java';

export interface LanguageConfig {
  id: SupportedLanguage;
  name: string;
  monacoLang: string;
  version: string;
  badgeColor: string;
  defaultTemplate: string;
}

export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, LanguageConfig> = {
  python: {
    id: 'python',
    name: 'Python',
    monacoLang: 'python',
    version: '3.12',
    badgeColor: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
    defaultTemplate: `# Python 3.12 Sandbox
# You can read from standard input using sys.stdin or input()

import sys

def main():
    lines = sys.stdin.read().split()
    if lines:
        print(f"Received {len(lines)} tokens from input:")
        for item in lines:
            print(" ->", item)
    else:
        print("Hello from Python 3.12 Sandbox!")
        print("Try providing custom input below to test interactive reading.")

if __name__ == "__main__":
    main()
`,
  },
  cpp: {
    id: 'cpp',
    name: 'C++',
    monacoLang: 'cpp',
    version: 'GCC 13 (C++20)',
    badgeColor: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30',
    defaultTemplate: `// C++20 Sandbox (GCC 13.2)
// You can read from standard input using std::cin

#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    string token;
    vector<string> inputs;
    while (cin >> token) {
        inputs.push_back(token);
    }

    if (!inputs.empty()) {
        cout << "Received " << inputs.size() << " tokens from stdin:\\n";
        for (const auto& item : inputs) {
            cout << " -> " << item << "\\n";
        }
    } else {
        cout << "Hello from C++20 (GCC 13.2) Sandbox!\\n";
        cout << "Try providing custom input below.\\n";
    }

    return 0;
}
`,
  },
  java: {
    id: 'java',
    name: 'Java',
    monacoLang: 'java',
    version: 'OpenJDK 21',
    badgeColor: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
    defaultTemplate: `// Java 21 Sandbox (OpenJDK 21)
// Standard input can be read using Scanner or BufferedReader

import java.util.Scanner;
import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        List<String> tokens = new ArrayList<>();

        while (scanner.hasNext()) {
            tokens.add(scanner.next());
        }

        if (!tokens.isEmpty()) {
            System.out.println("Received " + tokens.size() + " tokens from stdin:");
            for (String t : tokens) {
                System.out.println(" -> " + t);
            }
        } else {
            System.out.println("Hello from Java 21 (OpenJDK) Sandbox!");
            System.out.println("Try entering custom input in the input panel below.");
        }
    }
}
`,
  },
};

// Problem starter code templates mapped by problem slug and language
export const PROBLEM_STARTER_CODES: Record<string, Partial<Record<SupportedLanguage, string>>> = {
  'find-maximum-in-array': {
    python: `def find_max(nums: list[int]) -> int:
    # Your solution here
    pass
`,
    cpp: `#include <vector>
#include <algorithm>
#include <climits>

using namespace std;

class Solution {
public:
    int findMax(vector<int>& nums) {
        // Your solution here
        return 0;
    }
};
`,
    java: `import java.util.*;

public class Solution {
    public int findMax(int[] nums) {
        // Your solution here
        return 0;
    }
}
`,
  },
  'running-sum-of-1d-array': {
    python: `def running_sum(nums: list[int]) -> list[int]:
    # Your solution here
    pass
`,
    cpp: `#include <vector>

using namespace std;

class Solution {
public:
    vector<int> runningSum(vector<int>& nums) {
        // Your solution here
        return {};
    }
};
`,
    java: `import java.util.*;

public class Solution {
    public int[] runningSum(int[] nums) {
        // Your solution here
        return new int[0];
    }
}
`,
  },
  'two-sum': {
    python: `def two_sum(nums: list[int], target: int) -> list[int]:
    # Your solution here
    pass
`,
    cpp: `#include <vector>
#include <unordered_map>

using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your solution here
        return {};
    }
};
`,
    java: `import java.util.*;

public class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your solution here
        return new int[0];
    }
}
`,
  },
  'valid-palindrome': {
    python: `def is_palindrome(s: str) -> bool:
    # Your solution here
    pass
`,
    cpp: `#include <string>
#include <cctype>

using namespace std;

class Solution {
public:
    bool isPalindrome(string s) {
        // Your solution here
        return false;
    }
};
`,
    java: `import java.util.*;

public class Solution {
    public boolean isPalindrome(String s) {
        // Your solution here
        return false;
    }
}
`,
  },
  'binary-search': {
    python: `def search(nums: list[int], target: int) -> int:
    # Your solution here
    pass
`,
    cpp: `#include <vector>

using namespace std;

class Solution {
public:
    int search(vector<int>& nums, int target) {
        // Your solution here
        return -1;
    }
};
`,
    java: `import java.util.*;

public class Solution {
    public int search(int[] nums, int target) {
        // Your solution here
        return -1;
    }
}
`,
  },
  'reverse-linked-list': {
    python: `def reverse_list(head: list[int]) -> list[int]:
    # Your solution here
    pass
`,
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> reverseList(vector<int>& head) {
        // Your solution here
        return {};
    }
};
`,
    java: `import java.util.*;

public class Solution {
    public int[] reverseList(int[] head) {
        // Your solution here
        return new int[0];
    }
}
`,
  },
  'valid-parentheses': {
    python: `def is_valid(s: str) -> bool:
    # Your solution here
    pass
`,
    cpp: `#include <string>
#include <stack>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        // Your solution here
        return false;
    }
};
`,
    java: `import java.util.*;

public class Solution {
    public boolean isValid(String s) {
        // Your solution here
        return false;
    }
}
`,
  },
  'maximum-depth-of-binary-tree': {
    python: `def max_depth(root: list) -> int:
    # Your solution here
    pass
`,
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int maxDepth(vector<int>& root) {
        // Your solution here
        return 0;
    }
};
`,
    java: `public class Solution {
    public int maxDepth(Integer[] root) {
        // Your solution here
        return 0;
    }
}
`,
  },
  'number-of-islands': {
    python: `def num_islands(grid: list[list[str]]) -> int:
    # Your solution here
    pass
`,
    cpp: `#include <vector>
#include <string>
using namespace std;

class Solution {
public:
    int numIslands(vector<vector<string>>& grid) {
        // Your solution here
        return 0;
    }
};
`,
    java: `public class Solution {
    public int numIslands(String[][] grid) {
        // Your solution here
        return 0;
    }
}
`,
  },
  'climbing-stairs': {
    python: `def climb_stairs(n: int) -> int:
    # Your solution here
    pass
`,
    cpp: `class Solution {
public:
    int climbStairs(int n) {
        // Your solution here
        return 0;
    }
};
`,
    java: `public class Solution {
    public int climbStairs(int n) {
        // Your solution here
        return 0;
    }
}
`,
  },
  'container-with-most-water': {
    python: `def max_area(height: list[int]) -> int:
    # Your solution here
    pass
`,
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int maxArea(vector<int>& height) {
        // Your solution here
        return 0;
    }
};
`,
    java: `public class Solution {
    public int maxArea(int[] height) {
        // Your solution here
        return 0;
    }
}
`,
  },
  'longest-substring-without-repeating-characters': {
    python: `def length_of_longest_substring(s: str) -> int:
    # Your solution here
    pass
`,
    cpp: `#include <string>
using namespace std;

class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        // Your solution here
        return 0;
    }
};
`,
    java: `public class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Your solution here
        return 0;
    }
}
`,
  },
};

/**
 * Gets the starter code for a problem given the language.
 * Falls back to generating a starter code if not specifically listed.
 */
export function getProblemStarterCode(problemSlug: string, language: SupportedLanguage, defaultPythonCode: string): string {
  if (PROBLEM_STARTER_CODES[problemSlug]?.[language]) {
    return PROBLEM_STARTER_CODES[problemSlug]![language]!;
  }

  if (language === 'python') {
    return defaultPythonCode;
  }

  if (language === 'cpp') {
    return `// C++ Solution
#include <iostream>
#include <vector>
#include <string>

using namespace std;

class Solution {
public:
    // Solve the problem here
};
`;
  }

  return `// Java Solution
import java.util.*;

public class Solution {
    // Solve the problem here
}
`;
}
