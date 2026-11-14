import { NextRequest, NextResponse } from 'next/server';
import { globalExecutionQueue } from '../../../../lib/server/executionQueue';
import { getClientIp, globalRateLimiter } from '../../../../lib/server/rateLimiter';

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const rateCheck = globalRateLimiter.check(`eval_${clientIp}`, 40, 60);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded for submissions. Please wait a few seconds.',
          retryAfterSeconds: rateCheck.resetInSeconds,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateCheck.resetInSeconds),
            'X-RateLimit-Limit': '40',
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    const body = await req.json();
    const { 
      problemId, 
      code, 
      language = 'python', 
      userId = 'anonymous', 
      idempotencyKey,
      timeSpentSeconds = 30,
      asyncMode = false
    } = body;

    if (!problemId || !code) {
      return NextResponse.json(
        { success: false, error: 'problemId and code are required' },
        { status: 400 }
      );
    }

    const job = await globalExecutionQueue.submitJob({
      problemId,
      code,
      language,
      userId,
      idempotencyKey: idempotencyKey || req.headers.get('idempotency-key') || undefined,
      timeSpentSeconds,
    });

    if (asyncMode) {
      return NextResponse.json(
        {
          success: true,
          data: {
            jobId: job.id,
            status: job.status,
            statusUrl: `/api/submissions/${job.id}/status`,
          },
        },
        { status: 202 }
      );
    }

    // Synchronous resolution with wait
    const completedJob = await globalExecutionQueue.waitForJob(job.id, 12000);

    return NextResponse.json({
      success: true,
      data: {
        jobId: completedJob.id,
        status: completedJob.status,
        result: completedJob.result,
      },
    });
  } catch (error: any) {
    console.error('Submission evaluation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Server error during submission evaluation',
      },
      { status: 500 }
    );
  }
}
