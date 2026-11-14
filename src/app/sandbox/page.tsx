'use client';

import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Play, 
  RotateCcw, 
  Copy, 
  Check, 
  Terminal, 
  Sliders, 
  Clock, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  FileCode2,
  ChevronDown,
  Layers
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import { 
  SUPPORTED_LANGUAGES, 
  SupportedLanguage, 
  LanguageConfig 
} from '../../lib/starterCodes';
import { runCodeInSandbox, SandboxExecutionResult } from '../../lib/codeSandboxRunner';

const SAMPLE_PROGRAMS: Record<SupportedLanguage, { label: string; code: string; input: string }[]> = {
  python: [
    {
      label: 'Interactive Sum (Read Stdin)',
      code: `# Python 3.12: Read integers from stdin and calculate their sum
import sys

def main():
    tokens = sys.stdin.read().split()
    if not tokens:
        print("No input provided. Please enter numbers in the input box below!")
        return

    numbers = [int(x) for x in tokens if x.lstrip('-').isdigit()]
    print(f"Read {len(numbers)} numbers: {numbers}")
    print(f"Total Sum = {sum(numbers)}")
    print(f"Average   = {sum(numbers)/len(numbers):.2f}")

if __name__ == '__main__':
    main()
`,
      input: '12 45 8 92 -15 30',
    },
    {
      label: 'Two Sum Algorithm',
      code: `# Two Sum algorithm in Python
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Test execution
nums = [2, 7, 11, 15]
target = 9
result = two_sum(nums, target)
print(f"Array: {nums}")
print(f"Target: {target}")
print(f"Indices: {result}")
if result:
    print(f"Values: {nums[result[0]]} + {nums[result[1]]} = {target}")
`,
      input: '',
    },
    {
      label: 'Fibonacci Sequence',
      code: `# Generate Fibonacci numbers
import sys

def fibonacci(n):
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[-1] + fib[-2])
    return fib[:n]

raw = sys.stdin.read().strip()
n = int(raw) if raw.isdigit() else 10
print(f"Generating first {n} Fibonacci numbers:")
print(fibonacci(n))
`,
      input: '12',
    },
  ],
  cpp: [
    {
      label: 'Interactive Sum (cin & vectors)',
      code: `// C++20 (GCC 13.2): Read integers and calculate sum
#include <iostream>
#include <vector>
#include <numeric>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    int val;
    vector<int> numbers;
    while (cin >> val) {
        numbers.push_back(val);
    }

    if (numbers.empty()) {
        cout << "No numbers provided in stdin.\\n";
        return 0;
    }

    long long sum = 0;
    for (int n : numbers) sum += n;

    cout << "Read " << numbers.size() << " numbers from stdin.\\n";
    cout << "Sum: " << sum << "\\n";
    cout << "Average: " << (double)sum / numbers.size() << "\\n";

    return 0;
}
`,
      input: '5 15 25 35 45',
    },
    {
      label: 'Two Sum (unordered_map)',
      code: `// Two Sum in C++ using Hash Map
#include <iostream>
#include <vector>
#include <unordered_map>

using namespace std;

vector<int> twoSum(const vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < (int)nums.size(); ++i) {
        int diff = target - nums[i];
        if (seen.find(diff) != seen.end()) {
            return {seen[diff], i};
        }
        seen[nums[i]] = i;
    }
    return {};
}

int main() {
    vector<int> nums = {3, 2, 4};
    int target = 6;
    vector<int> res = twoSum(nums, target);

    cout << "C++ Solution Result: [" << res[0] << ", " << res[1] << "]\\n";
    return 0;
}
`,
      input: '',
    },
    {
      label: 'Binary Search Algorithm',
      code: `// Binary Search in C++
#include <iostream>
#include <vector>

using namespace std;

int binarySearch(const vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

int main() {
    vector<int> sortedArr = {-1, 0, 3, 5, 9, 12};
    int target = 9;
    int index = binarySearch(sortedArr, target);

    cout << "Target " << target << " found at index: " << index << "\\n";
    return 0;
}
`,
      input: '',
    },
  ],
  java: [
    {
      label: 'Interactive Scanner Sum',
      code: `// Java 21 (OpenJDK): Read numbers from stdin
import java.util.Scanner;
import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        List<Integer> list = new ArrayList<>();

        while (scanner.hasNextInt()) {
            list.add(scanner.nextInt());
        }

        if (list.isEmpty()) {
            System.out.println("No integers received. Enter numbers in the input box!");
            return;
        }

        long sum = 0;
        for (int n : list) sum += n;

        System.out.println("Java Sandbox read " + list.size() + " items:");
        System.out.println("Sum = " + sum);
        System.out.printf("Average = %.2f%n", (double)sum / list.size());
    }
}
`,
      input: '10 20 30 40 50',
    },
    {
      label: 'Two Sum (HashMap)',
      code: `// Two Sum in Java using HashMap
import java.util.*;

public class Main {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }

    public static void main(String[] args) {
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        int[] result = twoSum(nums, target);

        System.out.println("Java Two Sum Result: [" + result[0] + ", " + result[1] + "]");
    }
}
`,
      input: '',
    },
    {
      label: 'Palindrome Checker',
      code: `// Valid Palindrome in Java
import java.util.Scanner;

public class Main {
    public static boolean isPalindrome(String s) {
        int left = 0, right = s.length() - 1;
        while (left < right) {
            while (left < right && !Character.isLetterOrDigit(s.charAt(left))) left++;
            while (left < right && !Character.isLetterOrDigit(s.charAt(right))) right--;
            if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }

    public static void main(String[] args) {
        String test = "A man, a plan, a canal: Panama";
        System.out.println("Checking string: \\"" + test + "\\"");
        System.out.println("Is Palindrome? " + isPalindrome(test));
    }
}
`,
      input: '',
    },
  ],
};

export default function SandboxPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('python');
  const [code, setCode] = useState<string>(SUPPORTED_LANGUAGES.python.defaultTemplate);
  const [stdinInput, setStdinInput] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<SandboxExecutionResult | null>(null);
  const [activeTab, setActiveTab] = useState<'output' | 'stderr' | 'compiler'>('output');
  const [copied, setCopied] = useState<boolean>(false);

  const langConfig = SUPPORTED_LANGUAGES[selectedLanguage];

  // Handle switching language
  const handleLanguageChange = (lang: SupportedLanguage) => {
    setSelectedLanguage(lang);
    setCode(SUPPORTED_LANGUAGES[lang].defaultTemplate);
    setExecutionResult(null);
  };

  // Load sample code
  const handleSelectSample = (sample: { label: string; code: string; input: string }) => {
    setCode(sample.code);
    if (sample.input) {
      setStdinInput(sample.input);
    }
  };

  // Run the code in sandbox
  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const res = await runCodeInSandbox({
        language: selectedLanguage,
        code,
        stdin: stdinInput,
      });
      setExecutionResult(res);

      if (res.stderr && !res.stdout) {
        setActiveTab('stderr');
      } else {
        setActiveTab('output');
      }
    } finally {
      setIsRunning(false);
    }
  };

  // Copy output to clipboard
  const handleCopyOutput = () => {
    const textToCopy = executionResult?.stdout || executionResult?.stderr || '';
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Reset to default
  const handleReset = () => {
    setCode(langConfig.defaultTemplate);
    setStdinInput('');
    setExecutionResult(null);
  };

  // Keyboard shortcut Ctrl+Enter / Cmd+Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunCode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, stdinInput, selectedLanguage]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      {/* Sandbox Header Bar */}
      <div className="border-b border-slate-200 bg-white/85 backdrop-blur-md px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Left Title and Language Tabs */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                <Terminal className="h-4 w-4" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  Multi-Language Sandbox
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                    Live Compiler
                  </span>
                </h1>
              </div>
            </div>

            {/* Language Switcher Buttons */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              {(Object.keys(SUPPORTED_LANGUAGES) as SupportedLanguage[]).map((langKey) => {
                const config = SUPPORTED_LANGUAGES[langKey];
                const isSelected = selectedLanguage === langKey;
                return (
                  <button
                    key={langKey}
                    onClick={() => handleLanguageChange(langKey)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                    }`}
                  >
                    <span>{config.name}</span>
                    <span className="text-[10px] opacity-75 hidden sm:inline">({config.version})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Quick Templates Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 text-xs font-medium shadow-sm transition-all">
                <FileCode2 className="h-3.5 w-3.5 text-indigo-600" />
                <span>Templates</span>
                <ChevronDown className="h-3 w-3 opacity-60" />
              </button>

              <div className="absolute right-0 mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-xl shadow-slate-200/50 py-1.5 hidden group-hover:block z-50">
                <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {langConfig.name} Examples
                </div>
                {SAMPLE_PROGRAMS[selectedLanguage].map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectSample(sample)}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="p-1.5 rounded-xl bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 shadow-sm transition-all"
              title="Reset to default starter template"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            {/* Run Button */}
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
            >
              <Play className={`h-3.5 w-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Compiling & Running...' : 'Run Code'}</span>
              <kbd className="hidden sm:inline-block ml-1 text-[10px] font-mono bg-emerald-700/80 px-1.5 py-0.5 rounded text-emerald-100">
                Ctrl+Enter
              </kbd>
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace (Split Grid) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Column: Monaco Code Editor */}
        <div className="lg:col-span-7 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200 bg-white">
          <div className="px-4 py-2 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${langConfig.badgeColor}`}>
                {langConfig.name}
              </span>
              <span className="text-slate-300">|</span>
              <span className="font-mono text-[11px] text-slate-700 font-medium">
                {selectedLanguage === 'python' ? 'main.py' : selectedLanguage === 'cpp' ? 'main.cpp' : 'Main.java'}
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Interactive Editor (VS Light)
            </div>
          </div>

          <div className="flex-1 min-h-[420px] lg:min-h-0">
            <Editor
              height="100%"
              language={langConfig.monacoLang}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs"
              options={{
                fontSize: 13,
                fontFamily: 'JetBrains Mono, Fira Code, Consolas, monospace',
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 14, bottom: 14 },
                smoothScrolling: true,
                cursorBlinking: 'smooth',
                tabSize: 4,
                automaticLayout: true,
              }}
            />
          </div>
        </div>

        {/* Right Column: Stdin Input & Console Output */}
        <div className="lg:col-span-5 flex flex-col bg-slate-50 divide-y divide-slate-200">
          {/* Custom Stdin Input Section */}
          <div className="p-4 bg-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                <Sliders className="h-3.5 w-3.5 text-indigo-600" />
                <span>Standard Input (stdin)</span>
              </div>
              <span className="text-[10px] text-slate-400">
                Passed to input() / cin / Scanner
              </span>
            </div>
            <textarea
              value={stdinInput}
              onChange={(e) => setStdinInput(e.target.value)}
              placeholder="Enter custom input tokens or numbers here..."
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Output Console Section */}
          <div className="flex-1 flex flex-col min-h-[300px]">
            {/* Console Toolbar */}
            <div className="px-4 py-2 bg-slate-100/90 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="flex bg-slate-200/80 p-0.5 rounded-lg border border-slate-300/60 text-xs">
                  <button
                    onClick={() => setActiveTab('output')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      activeTab === 'output'
                        ? 'bg-indigo-600 text-white font-medium shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Output
                  </button>
                  <button
                    onClick={() => setActiveTab('stderr')}
                    className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 ${
                      activeTab === 'stderr'
                        ? 'bg-rose-600 text-white font-medium shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Errors</span>
                    {executionResult?.stderr && (
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                    )}
                  </button>
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex items-center gap-2">
                {executionResult && (
                  <>
                    <div
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        executionResult.success
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {executionResult.success ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <AlertCircle className="h-3 w-3" />
                      )}
                      <span>Exit: {executionResult.exitCode}</span>
                    </div>

                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-white text-slate-700 border border-slate-200 shadow-sm">
                      <Clock className="h-3 w-3 text-slate-400" />
                      <span>{executionResult.executionTimeMs} ms</span>
                    </div>
                  </>
                )}

                <button
                  onClick={handleCopyOutput}
                  disabled={!executionResult}
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 transition-all disabled:opacity-30"
                  title="Copy Output"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Console Screen */}
            <div className="flex-1 p-4 bg-white font-mono text-xs overflow-auto select-text">
              {isRunning ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-3 py-12">
                  <div className="h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs">Compiling & executing code on {langConfig.name} sandbox...</p>
                </div>
              ) : !executionResult ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center p-8">
                  <Terminal className="h-8 w-8 mb-2 opacity-40 text-slate-400" />
                  <p className="text-xs font-sans text-slate-700 font-medium">Click &quot;Run Code&quot; or press Ctrl+Enter</p>
                  <p className="text-[11px] font-sans text-slate-400 mt-1">
                    Output from stdout and stderr will appear here in real-time.
                  </p>
                </div>
              ) : activeTab === 'output' ? (
                <div>
                  {executionResult.stdout ? (
                    <pre className="text-slate-900 whitespace-pre-wrap leading-relaxed font-mono">
                      {executionResult.stdout}
                    </pre>
                  ) : executionResult.stderr ? (
                    <div className="text-rose-700">
                      <p className="text-xs font-semibold mb-2">Execution completed with errors:</p>
                      <pre className="whitespace-pre-wrap leading-relaxed bg-rose-50 p-3 rounded-lg border border-rose-200">
                        {executionResult.stderr}
                      </pre>
                    </div>
                  ) : (
                    <div className="text-slate-400 italic">
                      [Process exited with code 0 - No output printed to stdout]
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {executionResult.stderr || executionResult.compilerMessage ? (
                    <pre className="text-rose-700 whitespace-pre-wrap leading-relaxed bg-rose-50 p-3 rounded-lg border border-rose-200">
                      {executionResult.stderr || executionResult.compilerMessage}
                    </pre>
                  ) : (
                    <p className="text-slate-400 italic">[No errors reported by compiler or runtime]</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
