import { NextRequest, NextResponse } from 'next/server';
import { getClientIp, globalRateLimiter } from '../../../lib/server/rateLimiter';
import { executeCodeInEngine } from '../../../lib/server/pistonService';

interface ExecutionPayload {
  language: 'python' | 'cpp' | 'java';
  code: string;
  stdin?: string;
}

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const rateCheck = globalRateLimiter.check(`exec_${clientIp}`, 35, 60);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded for code execution. Please wait a few seconds.',
          retryAfterSeconds: rateCheck.resetInSeconds,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateCheck.resetInSeconds),
            'X-RateLimit-Limit': '35',
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }
    const body: ExecutionPayload = await req.json();
    const { language, code, stdin = '' } = body;

    if (!code || !language) {
      return NextResponse.json(
        { error: 'Missing code or language parameter' },
        { status: 400 }
      );
    }

    if (!['python', 'cpp', 'java'].includes(language)) {
      return NextResponse.json(
        { error: `Unsupported language: ${language}. Supported: python, cpp, java` },
        { status: 400 }
      );
    }

    // Execute via Piston Engine (with automatic multi-tier fallback)
    const result = await executeCodeInEngine({
      language,
      code,
      stdin,
      timeoutMs: 9000,
    });

    return NextResponse.json({
      success: result.success,
      stdout: result.stdout,
      stderr: result.stderr,
      compilerMessage: result.compilerMessage,
      exitCode: result.exitCode,
      executionTimeMs: result.executionTimeMs,
      engineUsed: result.engineUsed,
      language,
    });
  } catch (error: any) {
    console.error('Execution API error:', error);
    return NextResponse.json(
      {
        error: 'Execution failed',
        details: error?.message || 'Unknown server error',
      },
      { status: 500 }
    );
  }
}
