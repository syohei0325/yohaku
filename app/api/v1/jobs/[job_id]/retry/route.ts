import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/v1/jobs/[job_id]/retry
 * Webhook Job再送
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { job_id: string } }
) {
  const { job_id } = params;

  try {
    const job = await prisma.webhookJob.findUnique({
      where: { jobId: job_id },
    });

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // Reset to queued for retry
    await prisma.webhookJob.update({
      where: { jobId: job_id },
      data: {
        status: 'queued',
        nextRetryAt: new Date(),
        errorCode: null,
        errorHash: null,
        httpStatus: null,
      },
    });

    return NextResponse.json({
      success: true,
      job_id,
      status: 'queued',
    });
  } catch (error) {
    console.error('[POST /api/v1/jobs/:id/retry] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

