import { NextResponse } from 'next/server';
import { globalExecutionQueue } from '../../../lib/server/executionQueue';

export const dynamic = 'force-dynamic';

export async function GET() {
  const mem = process.memoryUsage();
  const queueStats = globalExecutionQueue.getStats();

  return NextResponse.json(
    {
      status: 'healthy',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      memory: {
        rssMb: Math.round(mem.rss / 1024 / 1024),
        heapUsedMb: Math.round(mem.heapUsed / 1024 / 1024),
        heapTotalMb: Math.round(mem.heapTotal / 1024 / 1024),
      },
      queue: queueStats,
      environment: process.env.NODE_ENV || 'development',
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
}
