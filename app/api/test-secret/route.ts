import { NextResponse } from 'next/server';

/**
 * GET /api/test-secret
 * Secret prefix確認用（録画前プリフライト）
 */
export async function GET() {
  const secret = process.env.WEBHOOK_SIGNING_SECRET || '';
  const prefix = secret.substring(0, 6);

  return NextResponse.json({
    message: 'Secret prefix check',
    prefix,
    length: secret.length,
    env_loaded: !!secret,
  });
}

