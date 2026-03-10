import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

/**
 * POST /api/v1/setup/api-key
 * API Key作成（Setup Wizard用）
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { tenant_id, agent_label } = body;

  try {
    // Ensure Tenant exists (upsert)
    await prisma.tenant.upsert({
      where: { id: tenant_id },
      update: {},
      create: {
        id: tenant_id,
        name: 'Demo Tenant',
        region: 'JP',
        status: 'active',
      },
    });

    // Generate API Key
    const apiKey = `yohaku_${crypto.randomBytes(32).toString('hex')}`;
    const signingSecret = crypto.randomBytes(32).toString('hex');
    const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
    const keyName = agent_label || 'Setup Wizard Key';

    // 既存の ApiKey があれば削除して再作成（デモ用: 常に新鮮なキーを返す）
    await prisma.apiKey.deleteMany({
      where: {
        tenantId: tenant_id,
        name: keyName,
      },
    });

    await prisma.apiKey.create({
      data: {
        tenantId: tenant_id,
        name: keyName,
        keyHash,
        scopesJson: JSON.stringify(['plan:write', 'approve:write', 'confirm:write', 'ledger:read']),
      },
    });

    // Store signing secret (in production, use secure storage)
    // For now, we'll return it to the user
    process.env.WEBHOOK_SIGNING_SECRET = signingSecret;

    return NextResponse.json({
      success: true,
      api_key: apiKey,
      signing_secret: signingSecret,
      agent_label: agent_label || 'Setup Wizard Key',
    });
  } catch (error) {
    console.error('[POST /api/v1/setup/api-key] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

