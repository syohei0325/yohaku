import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/v1/setup/calendar-email
 * Calendar Email登録（Setup Wizard用）
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { tenant_id, email } = body;

  try {
    // 既存のcalendar_hold設定を確認
    const existingConfig = await prisma.connectorConfig.findFirst({
      where: {
        tenantId: tenant_id,
        connector: 'calendar_hold',
      },
    });

    if (existingConfig) {
      // 既に存在する場合は更新
      await prisma.connectorConfig.update({
        where: { id: existingConfig.id },
        data: {
          configJson: JSON.stringify({
            default_email: email,
          }),
        },
      });
    } else {
      // 新規作成
      await prisma.connectorConfig.create({
        data: {
          tenantId: tenant_id,
          connector: 'calendar_hold',
          configJson: JSON.stringify({
            default_email: email,
          }),
        },
      });
    }

    return NextResponse.json({
      success: true,
      email,
      registered: true,
    });
  } catch (error) {
    console.error('[POST /api/v1/setup/calendar-email] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
