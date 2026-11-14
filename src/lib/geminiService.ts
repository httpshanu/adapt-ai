export interface GeminiRequestPayload {
  mode: 'hint' | 'explain' | 'debug' | 'chat' | 'generate-problem';
  problemTitle: string;
  problemTopic: string;
  problemDifficulty: string;
  problemDescription: string;
  userCode?: string;
  language?: string;
  errorMessage?: string;
  userPrompt?: string;
  chatHistory?: { role: 'user' | 'assistant'; content: string }[];
}

export interface GeminiResponsePayload {
  success: boolean;
  content: string;
  modelUsed: string;
  suggestedAction?: string;
}

export async function callGeminiAI(
  payload: GeminiRequestPayload,
  userApiKey?: string
): Promise<GeminiResponsePayload> {
  const apiKey = userApiKey || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  // Formulate system instructions based on mode
  let systemPrompt = `You are CodeAdapt AI Tutor, an elite and encouraging Computer Science DSA mentor.`;
  let userMessage = '';

  if (payload.mode === 'hint') {
    systemPrompt += ` Your goal is to guide the student towards solving the problem on their own. DO NOT provide the full solution code. Provide a concise, intuitive hint focusing on the invariant, data structure choice, or pointer movement.`;
    userMessage = `Problem: ${payload.problemTitle} (${payload.problemTopic}, ${payload.problemDifficulty})
Problem Description:
${payload.problemDescription}

Student's current ${payload.language || 'Python'} code:
\`\`\`${payload.language || 'python'}
${payload.userCode || 'No code written yet'}
\`\`\`

Give me a targeted, intuitive hint to help me make progress without spoiling the complete code.`;
  } else if (payload.mode === 'explain') {
    systemPrompt += ` Provide a structured, beautiful breakdown: 1. Core Intuition 2. Optimal Algorithmic Pattern 3. Big-O Complexity (Time & Space) with justification 4. Common Edge Cases to watch out for.`;
    userMessage = `Problem: ${payload.problemTitle} (${payload.problemTopic}, ${payload.problemDifficulty})
Problem Description:
${payload.problemDescription}

Explain the optimal approach, why it works, and its Big-O time and space complexity.`;
  } else if (payload.mode === 'debug') {
    systemPrompt += ` The student's code failed or produced unexpected output. Spot the logic bug, edge-case mishandling, or syntax issue. Explain what is happening and how to think about the fix without rewriting the entire solution for them.`;
    userMessage = `Problem: ${payload.problemTitle} (${payload.problemTopic})
Student Code:
\`\`\`${payload.language || 'python'}
${payload.userCode}
\`\`\`
Error / Failed details:
${payload.errorMessage || 'Wrong output on test cases'}

Help me debug my code and point out where my logic breaks down.`;
  } else if (payload.mode === 'generate-problem') {
    systemPrompt += ` Generate a brand new, highly engaging DSA problem for topic ${payload.problemTopic} at difficulty ${payload.problemDifficulty}. Format with: Title, Description, Example 1, Example 2, Constraints, Starter Code, and Reference Solution.`;
    userMessage = `Generate a creative new algorithmic problem for ${payload.problemTopic} (${payload.problemDifficulty} difficulty).`;
  } else {
    // General chat
    userMessage = payload.userPrompt || 'Can you explain this problem?';
  }

  // If Gemini API Key is available, call the live Google Gemini API
  if (apiKey) {
    try {
      // Use gemini-2.5-flash or gemini-1.5-flash
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

      const contents: any[] = [];

      if (payload.chatHistory && payload.chatHistory.length > 0) {
        for (const msg of payload.chatHistory) {
          contents.push({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }],
          });
        }
      }

      contents.push({
        role: 'user',
        parts: [{ text: `${systemPrompt}\n\n${userMessage}` }],
      });

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1200,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return {
            success: true,
            content: text,
            modelUsed: 'gemini-2.5-flash (Google Live AI)',
          };
        }
      }
      console.warn('Gemini API call returned non-200, falling back to built-in AI tutor engine');
    } catch (apiErr) {
      console.warn('Gemini API request failed, using intelligent built-in tutor:', apiErr);
    }
  }

  // Built-in Intelligent Fallback AI Tutor (works offline or without API key)
  return getBuiltInAITutorResponse(payload);
}

function getBuiltInAITutorResponse(payload: GeminiRequestPayload): GeminiResponsePayload {
  const { mode, problemTitle, problemTopic, problemDifficulty, userCode } = payload;

  if (mode === 'hint') {
    return {
      success: true,
      modelUsed: 'CodeAdapt DSA Tutor (Intelligent Heuristic)',
      content: `💡 **Targeted Pedagogical Hint for ${problemTitle}:**

1. **Observe the Invariant:** Look at how elements are positioned in **${problemTopic}**. Ask yourself: *what changes and what stays constant across iterations?*
2. **Key Data Structure:** Are you performing repetitive linear lookups? Storing visited elements in a **Hash Set / Map** or using **Two Pointers** can reduce $O(N^2)$ brute-force down to $O(N)$ or $O(\\log N)$.
3. **Edge Condition:** What happens when the input has size $0$, size $1$, or contains duplicates/negative numbers? Make sure your base case handles these gracefully before your main loop.`,
    };
  }

  if (mode === 'explain') {
    return {
      success: true,
      modelUsed: 'CodeAdapt DSA Tutor (Intelligent Heuristic)',
      content: `### 🎯 Optimal Approach & Big-O Analysis: ${problemTitle}

#### 1. Core Intuition & Pattern
This problem is best solved using the **${problemTopic.toUpperCase()}** pattern. Instead of a nested brute-force search ($O(N^2)$), we take advantage of the structural properties:
* **Single Pass:** Process elements sequentially from left to right.
* **State Preservation:** Maintain intermediate state (like a running accumulator, hash table, or sliding window) so work is never duplicated.

#### 2. Big-O Complexity Breakdown
* **Time Complexity:** $\\mathcal{O}(N)$ or $\\mathcal{O}(\\log N)$ — Every element or pointer moves forward a constant number of times.
* **Space Complexity:** $\\mathcal{O}(1)$ auxiliary space if solved in-place, or $\\mathcal{O}(N)$ when indexing lookup keys.

#### 3. Common Interview Edge Cases
* Empty collections or single-element inputs.
* Target values not present in the input.
* Duplicate values producing index collisions.`,
    };
  }

  if (mode === 'debug') {
    const codeSnippet = userCode || '';
    const hasReturn = codeSnippet.includes('return');
    const hasLoop = codeSnippet.includes('for') || codeSnippet.includes('while');

    let diagnosis = `🐞 **Code Analysis & Debugging Report:**\n\n`;
    if (!hasReturn) {
      diagnosis += `⚠️ **Missing Return Statement:** Your function does not return any value, resulting in \`None\` output.\n\n`;
    } else if (!hasLoop && problemDifficulty !== 'EASY') {
      diagnosis += `⚠️ **Control Flow Warning:** For problems in **${problemTopic}**, you typically need an iterative loop or pointer traversal.\n\n`;
    } else {
      diagnosis += `🔍 **Logic & Boundary Check:**\n- Check off-by-one errors on index boundaries (\`range(len(nums))\` vs \`len(nums) - 1\`).\n- Ensure you are returning the expected data type (e.g. integer vs list of indices).\n- Verify if mutation in-place affects subsequent iterations.\n\n`;
    }
    diagnosis += `*Recommendation:* Try running with Example 1 input in your head line-by-line with a pen & paper.`;

    return {
      success: true,
      modelUsed: 'CodeAdapt DSA Tutor (Intelligent Heuristic)',
      content: diagnosis,
    };
  }

  return {
    success: true,
    modelUsed: 'CodeAdapt DSA Tutor (Intelligent Heuristic)',
    content: `Hello! I am your CodeAdapt AI DSA Tutor. How can I help you tackle **${problemTitle}**? You can ask me for a graduated hint, an explanation of Big-O complexity, or to help find bugs in your solution.`,
  };
}
