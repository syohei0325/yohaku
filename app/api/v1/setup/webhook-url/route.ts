import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateWebhookUrl } from '@/lib/webhook-validator';

/**
 * POST /api/v1/setup/webhook-url
 * Webhook URL登録（Setup Wizard用）
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { tenant_id, url } = body;

  try {
    // Validate URL
    const validation = validateWebhookUrl(url);
    if (!validation.valid) {
      return NextResponse.json(
        { error: `Invalid webhook URL: ${validation.reason}` },
        { status: 400 }
      );
    }

    // Register connector config (upsert: 既存があれば更新、なければ作成)
    const existingConfig = await prisma.connectorConfig.findFirst({
      where: {
        tenantId: tenant_id,
        connector: 'webhook',
      },
    });

    if (existingConfig) {
      // 既存の場合：URLを追加（重複チェック）
      const configJson = JSON.parse(existingConfig.configJson);
      const registeredUrls = configJson.registered_urls || [];
      
      // URLが既に登録されているか確認
      const urlExists = registeredUrls.some((u: any) => u.url === url);
      
      if (!urlExists) {
        registeredUrls.push({
          url: url,
          enabled: true,
        });
      }

      await prisma.connectorConfig.update({
        where: { id: existingConfig.id },
        data: {
          configJson: JSON.stringify({
            registered_urls: registeredUrls,
          }),
        },
      });
    } else {
      // 新規作成
      await prisma.connectorConfig.create({
        data: {
          tenantId: tenant_id,
          connector: 'webhook',
          configJson: JSON.stringify({
            registered_urls: [
              {
                url: url,
                enabled: true,
              }
            ],
          }),
        },
      });
    }

    return NextResponse.json({
      success: true,
      url,
      registered: true,
    });
  } catch (error) {
    console.error('[POST /api/v1/setup/webhook-url] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

