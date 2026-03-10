import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/v1/approve/[approve_id]/confirm
 * 承認または却下を確定
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { approve_id: string } }
) {
  const { approve_id } = params;
  const body = await request.json();
  const { action, approved_by_user_id } = body; // action: 'approve' | 'reject'

  try {
    const approval = await prisma.approval.findUnique({
      where: { approveId: approve_id },
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

    if (action === 'approve') {
      // Update approval status (usedAtは/v1/confirmで設定する)
      await prisma.approval.update({
        where: { approveId: approve_id },
        data: {
          approvedByUserId: approved_by_user_id,
          approvedAt: now,
          approvedVia: 'web_ui',
        },
      });

      // Create audit log
      await prisma.auditLog.create({
        data: {
          tenantId: approval.tenantId,
          userId: approved_by_user_id || approval.userId,
          action: 'approval.approved',
          approveId: approval.id,
          payloadJson: JSON.stringify({ approve_id, approved_via: 'web_ui' }),
        },
      });

      return NextResponse.json({
        success: true,
        approve_id,
        status: 'approved',
        receipt_id: approve_id, // For now, use approve_id as receipt_id
      });
    } else if (action === 'reject') {
      // Update approval status
      await prisma.approval.update({
        where: { approveId: approve_id },
        data: {
          usedAt: now,
        },
      });

      // Create audit log
      await prisma.auditLog.create({
        data: {
          tenantId: approval.tenantId,
          userId: approved_by_user_id || approval.userId,
          action: 'approval.rejected',
          approveId: approval.id,
          payloadJson: JSON.stringify({ approve_id, rejected_via: 'web_ui' }),
        },
      });

      return NextResponse.json({
        success: true,
        approve_id,
        status: 'rejected',
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Must be "approve" or "reject"' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('[POST /api/v1/approve/:id/confirm] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

