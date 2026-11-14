import { NextRequest, NextResponse } from 'next/server';
import { callGeminiAI, GeminiRequestPayload } from '../../../lib/geminiService';
import { getClientIp, globalRateLimiter } from '../../../lib/server/rateLimiter';

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const rateCheck = globalRateLimiter.check(`ai_${clientIp}`, 25, 60);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded for AI Tutor requests. Please slow down.',
          retryAfterSeconds: rateCheck.resetInSeconds,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateCheck.resetInSeconds),
            'X-RateLimit-Limit': '25',
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    const body: GeminiRequestPayload = await req.json();
    const userApiKey = req.headers.get('x-gemini-api-key') || undefined;

    if (!body.problemTitle || !body.mode) {
      return NextResponse.json(
        { success: false, error: 'mode and problemTitle are required' },
        { status: 400 }
      );
    }

    const aiResponse = await callGeminiAI(body, userApiKey);

    return NextResponse.json({
      success: true,
      data: aiResponse,
    });
  } catch (error: any) {
    console.error('AI API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to process AI tutor request',
      },
      { status: 500 }
    );
  }
}
