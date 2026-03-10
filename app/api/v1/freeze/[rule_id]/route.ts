import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * DELETE /api/v1/freeze/[rule_id]
 * Freeze Rule解除
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { rule_id: string } }
) {
  const { rule_id } = params;

  try {
    const rule = await prisma.freezeRule.findUnique({
      where: { ruleId: rule_id },
    });

    if (!rule) {
      return NextResponse.json(
        { error: 'Freeze rule not found' },
        { status: 404 }
      );
    }

    // Deactivate rule
    await prisma.freezeRule.update({
      where: { ruleId: rule_id },
      data: {
        isActive: false,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        tenantId: rule.tenantId,
        userId: 'admin', // TODO: Get from auth
        action: 'freeze.deactivated',
        resourceType: 'freeze_rule',
        resourceId: rule_id,
        metadata: { rule_id },
      },
    });

    return NextResponse.json({
      success: true,
      rule_id,
      is_active: false,
    });
  } catch (error) {
    console.error('[DELETE /api/v1/freeze/:id] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

