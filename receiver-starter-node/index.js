/**
 * Yohaku Receiver Starter Kit - Node.js / Express
 * 
 * このサンプルは、Yohaku Action CloudからのWebhookを受信するための
 * 最小限の実装例です。
 * 
 * 必須要件:
 * 1. X-Yohaku-Signature を検証（HMAC-SHA256）
 * 2. X-Idempotency-Key を保存して重複処理しない（24h）
 * 3. 2xxでack（成功）、5xx/timeoutはリトライされる
 */

const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

// 環境変数
const WEBHOOK_SIGNING_SECRET = process.env.WEBHOOK_SIGNING_SECRET || 'your-secret-here';
const PORT = process.env.PORT || 3001;

// Idempotency キャッシュ（本番環境ではRedisやDBを使用）
const idempotencyCache = new Map();

/**
 * HMAC署名を検証（timestamp replay protection付き）
 * 
 * @param {object} payload - リクエストボディ
 * @param {string} signature - X-Yohaku-Signature
 * @param {string} timestamp - X-Yohaku-Timestamp
 * @param {string} secret - WEBHOOK_SIGNING_SECRET
 * @param {number} maxSkewSeconds - 許容するタイムスタンプのずれ（デフォルト300秒=5分）
 * @returns {object} { valid: boolean, reason?: string }
 */
function verifySignature(payload, signature, timestamp, secret, maxSkewSeconds = 300) {
  // 1. Timestampのスキューチェック（replay attack対策）
  const now = Math.floor(Date.now() / 1000);
  const receivedTimestamp = parseInt(timestamp, 10);
  
  if (isNaN(receivedTimestamp)) {
    return { valid: false, reason: 'Invalid timestamp format' };
  }
  
  const skew = Math.abs(now - receivedTimestamp);
  if (skew > maxSkewSeconds) {
    return { valid: false, reason: `Timestamp skew too large: ${skew}s (max ${maxSkewSeconds}s)` };
  }
  
  // 2. 署名検証（timestamp.payload）
  const signaturePayload = `${receivedTimestamp}.${JSON.stringify(payload)}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(signaturePayload)
    .digest('hex');
  
  const receivedSignatureHex = signature.replace(/^sha256=/, '');
  
  if (expectedSignature !== receivedSignatureHex) {
    return { valid: false, reason: 'Signature verification failed' };
  }
  
  return { valid: true };
}

/**
 * Idempotency チェック
 */
function isIdempotent(idempotencyKey) {
  if (idempotencyCache.has(idempotencyKey)) {
    return false; // 重複
  }
  
  // 24時間後に削除
  idempotencyCache.set(idempotencyKey, Date.now());
  setTimeout(() => {
    idempotencyCache.delete(idempotencyKey);
  }, 24 * 60 * 60 * 1000);
  
  return true;
}

/**
 * Webhook受信エンドポイント
 */
app.post('/webhook', (req, res) => {
  console.log('[WEBHOOK] Received:', req.headers);
  
  const signature = req.headers['x-yohaku-signature'];
  const timestamp = req.headers['x-yohaku-timestamp'];
  const idempotencyKey = req.headers['x-idempotency-key'];
  const jobId = req.headers['x-yohaku-job-id'];
  
  // 1. 署名検証（timestamp replay protection）
  if (!signature) {
    console.error('[WEBHOOK] Missing signature');
    return res.status(401).json({ error: 'Missing signature' });
  }
  
  if (!timestamp) {
    console.error('[WEBHOOK] Missing timestamp');
    return res.status(401).json({ error: 'Missing timestamp' });
  }
  
  console.log('[WEBHOOK] Body:', JSON.stringify(req.body));
  console.log('[WEBHOOK] Signature:', signature);
  console.log('[WEBHOOK] Timestamp:', timestamp);
  console.log('[WEBHOOK] Secret prefix:', WEBHOOK_SIGNING_SECRET.substring(0, 6) + '...');
  
  const signatureResult = verifySignature(req.body, signature, timestamp, WEBHOOK_SIGNING_SECRET);
  if (!signatureResult.valid) {
    console.error('[WEBHOOK] Signature verification failed:', signatureResult.reason);
    return res.status(401).json({ error: 'Invalid signature', reason: signatureResult.reason });
  }
  
  console.log('[WEBHOOK] ✅ Signature verified (timestamp OK)');
  
  // 2. Idempotency チェック
  if (!idempotencyKey) {
    console.error('[WEBHOOK] Missing idempotency key');
    return res.status(400).json({ error: 'Missing idempotency key' });
  }
  
  if (!isIdempotent(idempotencyKey)) {
    console.log('[WEBHOOK] ⚠️  Duplicate request (idempotency)');
    return res.status(200).json({ status: 'ok', message: 'Already processed' });
  }
  
  console.log('[WEBHOOK] ✅ Idempotency check passed');
  
  // 3. ビジネスロジック実行
  try {
    const { event, tenant_id, confirm_id, payload } = req.body;
    
    console.log('[WEBHOOK] Processing event:', event);
    console.log('[WEBHOOK] Tenant:', tenant_id);
    console.log('[WEBHOOK] Confirm ID:', confirm_id);
    console.log('[WEBHOOK] Payload:', payload);
    
    // ここにビジネスロジックを実装
    // 例: データベースに保存、外部APIを呼び出し、etc.
    
    // 成功レスポンス（2xx）
    res.status(200).json({
      status: 'ok',
      job_id: jobId,
      processed_at: new Date().toISOString(),
    });
    
    console.log('[WEBHOOK] ✅ Processed successfully');
    
  } catch (error) {
    console.error('[WEBHOOK] Error:', error);
    
    // エラーレスポンス（5xx）→ Yohakuがリトライする
    res.status(500).json({
      error: 'Processing failed',
      message: error.message,
    });
  }
});

/**
 * ヘルスチェック
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Yohaku Receiver',
    uptime: process.uptime(),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Yohaku Receiver listening on port ${PORT}`);
  console.log(`📝 Webhook endpoint: http://localhost:${PORT}/webhook`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Secret prefix: ${WEBHOOK_SIGNING_SECRET.substring(0, 6)}...`);
});










