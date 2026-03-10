import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/v1/approve/[approve_id]
 * 承認データを取得
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { approve_id: string } }
) {
  const { approve_id } = params;

  try {
    const approval = await prisma.approval.findUnique({
      where: { approveId: approve_id },
      include: {
        plan: true,
      },
    });

    if (!approval) {
      return NextResponse.json(
        { error: 'Approval not found' },
        { status: 404 }
      );
    }

    // Check TTL
    const now = new Date();
    if (approval.expiresAt && approval.expiresAt < now) {
      return NextResponse.json(
        { error: 'Approval expired (TTL exceeded)' },
        { status: 410 }
      );
    }

    // Check if already used
    if (approval.usedAt) {
      return NextResponse.json(
        { error: 'Approval already used' },
        { status: 409 }
      );
    }

    // Parse plan payload
    const planPayload = approval.plan?.payloadJson ? JSON.parse(approval.plan.payloadJson) : {};
    
    return NextResponse.json({
      approve_id: approval.approveId,
      plan_id: approval.planId,
      plan: planPayload,
      tenant_id: approval.tenantId,
      user_id: approval.userId,
      approval_lane: approval.approvalLane,
      principal_type: approval.principalType,
      status: approval.usedAt ? 'used' : 'pending',
      ttl_expires_at: approval.expiresAt?.toISOString(),
      created_at: approval.createdAt.toISOString(),
    });
  } catch (error) {
    console.error('[GET /api/v1/approve/:id] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

