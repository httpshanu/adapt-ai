import { NextRequest, NextResponse } from 'next/server';
import { globalExecutionQueue } from '../../../../../lib/server/executionQueue';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const jobId = params.id;
  const job = globalExecutionQueue.getJob(jobId);

  if (!job) {
    return NextResponse.json(
      { success: false, error: 'Job not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      jobId: job.id,
      status: job.status,
      createdAt: job.createdAt,
      startedAt: job.startedAt,
      completedAt: job.completedAt,
      result: job.result,
    },
  });
}
