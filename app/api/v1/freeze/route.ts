import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/v1/freeze
 * Freeze Rule作成（緊急停止）
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { scope, value, reason, tenant_id, user_id } = body;

  try {
    // Create freeze rule
    const freezeRule = await prisma.freezeRule.create({
      data: {
        tenantId: tenant_id || 'tenant_demo_001',
        scope,
        scopeValue: value,
        reason,
        createdBy: user_id || 'admin',
        isActive: true,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        tenantId: tenant_id || 'tenant_demo_001',
        userId: user_id || 'admin',
        action: 'freeze.created',
        resourceType: 'freeze_rule',
        resourceId: freezeRule.ruleId,
        metadata: { scope, value, reason },
      },
    });

    return NextResponse.json({
      success: true,
      rule_id: freezeRule.ruleId,
      scope,
      value,
      reason,
      is_active: true,
    });
  } catch (error) {
    console.error('[POST /api/v1/freeze] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/v1/freeze
 * Freeze Rules一覧取得
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tenant_id = searchParams.get('tenant_id') || 'tenant_demo_001';

  try {
    const rules = await prisma.freezeRule.findMany({
      where: {
        tenantId: tenant_id,
        isActive: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      rules: rules.map((rule) => ({
        rule_id: rule.ruleId,
        scope: rule.scope,
        value: rule.scopeValue,
        reason: rule.reason,
        created_by: rule.createdBy,
        created_at: rule.createdAt.toISOString(),
        is_active: rule.isActive,
      })),
    });
  } catch (error) {
    console.error('[GET /api/v1/freeze] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

