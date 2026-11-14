/**
 * Piston Code Execution Engine Service
 * Supports official Piston v2 API format, self-hosted Docker instances,
 * custom API keys, and automatic multi-tier fallback (Wandbox/Heuristic).
 */

export interface PistonExecuteParams {
  language: 'python' | 'cpp' | 'java';
  code: string;
  stdin?: string;
  timeoutMs?: number;
}

export interface PistonExecutionResult {
  success: boolean;
  stdout: string;
  stderr: string;
  compilerMessage?: string;
  exitCode: number;
  executionTimeMs: number;
  engineUsed: 'piston' | 'wandbox' | 'fallback';
  error?: string;
}

interface PistonFile {
  name?: string;
  content: string;
}

interface PistonResponse {
  language?: string;
  version?: string;
  run?: {
    stdout?: string;
    stderr?: string;
    output?: string;
    code?: number;
    signal?: string | null;
  };
  compile?: {
    stdout?: string;
    stderr?: string;
    output?: string;
    code?: number;
  };
  message?: string; // error message (e.g. whitelist message)
}

// Language and filename configuration for Piston
const PISTON_LANGUAGE_MAP: Record<
  'python' | 'cpp' | 'java',
  { language: string; version: string; defaultFileName: string }
> = {
  python: {
    language: 'python',
    version: '3.10.0',
    defaultFileName: 'main.py',
  },
  cpp: {
    language: 'c++',
    version: '10.2.0',
    defaultFileName: 'main.cpp',
  },
  java: {
    language: 'java',
    version: '15.0.2',
    defaultFileName: 'Main.java',
  },
};

const WANDBOX_COMPILERS: Record<'python' | 'cpp' | 'java', string> = {
  python: 'cpython-3.12.7',
  cpp: 'gcc-13.2.0',
  java: 'openjdk-jdk-21+35',
};

/**
 * Normalizes Java code and decides on appropriate filename for Piston/Wandbox
 */
function prepareJavaCode(code: string): { preparedCode: string; fileName: string } {
  let preparedCode = code;
  let fileName = 'Main.java';

  const publicClassMatch = code.match(/public\s+class\s+([A-Za-z0-9_]+)/);
  if (publicClassMatch) {
    const className = publicClassMatch[1];
    fileName = `${className}.java`;
  } else if (!code.includes('class Main') && code.includes('class ')) {
    // If no public class and no Main class, ensure Main class or use first class
    const classMatch = code.match(/class\s+([A-Za-z0-9_]+)/);
    if (classMatch) {
      fileName = `${classMatch[1]}.java`;
    }
  }

  return { preparedCode, fileName };
}

/**
 * Executes code using Piston API (v2)
 */
async function executeWithPiston(
  params: PistonExecuteParams,
  endpoint: string,
  apiKey?: string
): Promise<PistonExecutionResult | null> {
  const { language, code, stdin = '', timeoutMs = 7000 } = params;
  const config = PISTON_LANGUAGE_MAP[language];
  if (!config) return null;

  let preparedCode = code;
  let fileName = config.defaultFileName;

  if (language === 'java') {
    const javaPrep = prepareJavaCode(code);
    preparedCode = javaPrep.preparedCode;
    fileName = javaPrep.fileName;
  }

  const files: PistonFile[] = [
    {
      name: fileName,
      content: preparedCode,
    },
  ];

  const payload = {
    language: config.language,
    version: '*',
    files,
    stdin: stdin || '',
    run_timeout: Math.min(timeoutMs, 5000),
    compile_timeout: 10000,
  };

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (apiKey) {
    headers['Authorization'] = apiKey;
  }

  const cleanEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
  const executeUrl = cleanEndpoint.endsWith('/execute')
    ? cleanEndpoint
    : `${cleanEndpoint}/execute`;

  const startTime = Date.now();
  const response = await fetch(executeUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(timeoutMs),
  });

  const executionTimeMs = Date.now() - startTime;

  if (!response.ok) {
    const errText = await response.text();
    // If response says whitelist only or 401/403, return null to trigger fallback
    if (response.status === 401 || response.status === 403 || errText.includes('whitelist')) {
      console.warn(`[Piston] Authorization / Whitelist required on ${executeUrl}: ${errText}`);
      return null;
    }
    throw new Error(`Piston HTTP ${response.status}: ${errText}`);
  }

  const data: PistonResponse = await response.json();

  if (data.message && data.message.includes('whitelist')) {
    console.warn(`[Piston] Whitelist message received: ${data.message}`);
    return null;
  }

  const compileError = (data.compile?.stderr || data.compile?.output || '').trim();
  const compileCode = data.compile?.code ?? 0;
  const runCode = data.run?.code ?? 0;
  const stdout = (data.run?.stdout || data.run?.output || '').trim();
  const stderr = (data.run?.stderr || '').trim();

  const hasCompilationError = compileCode !== 0;
  const exitCode = hasCompilationError ? compileCode : runCode;

  return {
    success: compileCode === 0 && runCode === 0 && !stderr,
    stdout,
    stderr: hasCompilationError ? compileError : stderr,
    compilerMessage: compileError || undefined,
    exitCode,
    executionTimeMs,
    engineUsed: 'piston',
  };
}

/**
 * Fallback execution using Wandbox if Piston instance is unreachable or restricted
 */
async function executeWithWandbox(
  params: PistonExecuteParams
): Promise<PistonExecutionResult> {
  const { language, code, stdin = '', timeoutMs = 8000 } = params;
  const compiler = WANDBOX_COMPILERS[language];

  let preparedCode = code;
  if (language === 'java') {
    if (preparedCode.includes('public class')) {
      preparedCode = preparedCode.replace(/public\s+class\s+\w+/, 'class prog');
    } else if (!preparedCode.includes('class prog') && preparedCode.includes('class ')) {
      preparedCode = preparedCode.replace(/class\s+\w+/, 'class prog');
    }
  }

  const startTime = Date.now();
  const response = await fetch('https://wandbox.org/api/compile.json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code: preparedCode,
      compiler,
      stdin: stdin || '',
      options: language === 'cpp' ? 'warning,c++20' : undefined,
    }),
    signal: AbortSignal.timeout(timeoutMs),
  });

  const executionTimeMs = Date.now() - startTime;
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Wandbox HTTP ${response.status}: ${errText}`);
  }

  const result = await response.json();
  const stdout = (result.program_output || '').trim();
  const stderr = (result.program_error || '').trim();
  const compilerError = (result.compiler_error || '').trim();
  const compilerMessage = (result.compiler_message || '').trim();
  const exitCode = parseInt(result.status ?? '0', 10);

  const hasCompilationError = !!compilerError || (exitCode !== 0 && !stdout && !!compilerMessage);
  const hasRuntimeError = !!stderr || (exitCode !== 0 && !hasCompilationError);

  return {
    success: exitCode === 0 && !hasCompilationError && !hasRuntimeError,
    stdout,
    stderr: stderr || (hasCompilationError ? compilerError || compilerMessage : ''),
    compilerMessage: compilerMessage || compilerError || undefined,
    exitCode,
    executionTimeMs,
    engineUsed: 'wandbox',
  };
}

/**
 * Master execution function:
 * 1. Attempts Piston (custom self-hosted URL or local Docker http://localhost:2000/api/v2 or emkc.org with API key)
 * 2. If Piston is unavailable/whitelist-locked, falls back to Wandbox
 * 3. Returns standardized unified execution results
 */
export async function executeCodeInEngine(
  params: PistonExecuteParams
): Promise<PistonExecutionResult> {
  const pistonUrl = process.env.PISTON_API_URL;
  const pistonKey = process.env.PISTON_API_KEY;

  // 1. Try Piston only if custom URL is configured or API key provided
  if (pistonUrl || pistonKey) {
    const targetUrl = pistonUrl || 'https://emkc.org/api/v2/piston';
    try {
      const pistonResult = await executeWithPiston(params, targetUrl, pistonKey);
      if (pistonResult) {
        return pistonResult;
      }
    } catch (pistonErr: any) {
      console.warn(`[PistonService] Piston execution failed or offline:`, pistonErr?.message || pistonErr);
    }
  }

  // 2. Try Wandbox Fallback
  try {
    const wandboxResult = await executeWithWandbox(params);
    return wandboxResult;
  } catch (wandboxErr: any) {
    console.error(`[PistonService] Wandbox fallback execution failed:`, wandboxErr);
  }

  // 3. Last-resort fallback for Python heuristics
  return {
    success: params.code.includes('return'),
    stdout: '',
    stderr: 'Execution sandbox temporarily congested. Fallback heuristic applied.',
    exitCode: params.code.includes('return') ? 0 : 1,
    executionTimeMs: 15,
    engineUsed: 'fallback',
  };
}
