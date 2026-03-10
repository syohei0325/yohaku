import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/v1/jobs
 * Webhook Jobs一覧取得
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('filter') || 'all';
  const limit = parseInt(searchParams.get('limit') || '50');

  try {
    const where: any = {};
    
    if (filter !== 'all') {
      where.status = filter;
    }

    const jobs = await prisma.webhookJob.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({
      jobs: jobs.map((job) => ({
        job_id: job.jobId,
        tenant_id: job.tenantId,
        target_url: job.targetUrl,
        status: job.status,
        attempts: job.attempts,
        error_code: job.errorCode,
        error_hash: job.errorHash,
        http_status: job.httpStatus,
        idempotency_key: job.idempotencyKey,
        created_at: job.createdAt.toISOString(),
        updated_at: job.updatedAt.toISOString(),
        next_retry_at: job.nextRetryAt?.toISOString(),
      })),
    });
  } catch (error) {
    console.error('[GET /api/v1/jobs] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

