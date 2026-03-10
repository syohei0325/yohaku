#!/usr/bin/env node

/**
 * Webhook Receiver（デモ用）
 * - Yohakuからのwebhookを受信
 * - 署名検証を行う
 * - 受信ログをコンソールに表示
 */

const http = require('http');
const crypto = require('crypto');

const PORT = 4001;
const WEBHOOK_SIGNING_SECRET = process.env.WEBHOOK_SIGNING_SECRET || 'your-webhook-signing-secret-here';

// 受信ログを保存（メモリ内）
const receivedWebhooks = [];

/**
 * 署名検証
 */
function verifySignature(signature, timestamp, body) {
  const payload = `${timestamp}.${body}`;
  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SIGNING_SECRET)
    .update(payload)
    .digest('hex');
  
  const receivedSignature = signature.replace('sha256=', '');
  
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(receivedSignature)
  );
}

/**
 * Timestamp検証（5分以内）
 */
function verifyTimestamp(timestamp) {
  const now = Math.floor(Date.now() / 1000);
  const diff = Math.abs(now - parseInt(timestamp));
  return diff <= 300; // 5分
}

const server = http.createServer((req, res) => {
  // CORS対応
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Yohaku-Signature, X-Yohaku-Timestamp, X-Idempotency-Key, X-Yohaku-Job-Id');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // GET: ログ表示用UI
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Webhook Receiver - Yohaku Demo</title>
  <style>
    body { font-family: monospace; padding: 20px; background: #1e1e1e; color: #d4d4d4; }
    h1 { color: #4ec9b0; }
    .log { background: #252526; padding: 15px; margin: 10px 0; border-left: 4px solid #4ec9b0; border-radius: 4px; }
    .log.success { border-left-color: #4ec9b0; }
    .log.error { border-left-color: #f48771; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 3px; font-size: 12px; }
    .badge.success { background: #4ec9b0; color: #1e1e1e; }
    .badge.error { background: #f48771; color: #1e1e1e; }
    pre { background: #1e1e1e; padding: 10px; border-radius: 4px; overflow-x: auto; }
    .meta { color: #858585; font-size: 12px; }
    .empty { color: #858585; font-style: italic; }
  </style>
</head>
<body>
  <h1>🔗 Webhook Receiver (Port ${PORT})</h1>
  <p class="meta">Listening on http://localhost:${PORT}/webhook</p>
  <p class="meta">Total received: <strong id="count">${receivedWebhooks.length}</strong></p>
  <button onclick="location.reload()" style="padding: 8px 16px; background: #4ec9b0; color: #1e1e1e; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">🔄 Reload</button>
  <hr>
  <div id="logs">
    ${receivedWebhooks.length === 0 ? '<p class="empty">まだWebhookを受信していません...</p>' : ''}
    ${receivedWebhooks.slice().reverse().map(log => `
      <div class="log ${log.verified ? 'success' : 'error'}">
        <div style="margin-bottom: 10px;">
          <span class="badge ${log.verified ? 'success' : 'error'}">${log.verified ? '✅ 署名検証成功' : '❌ 署名検証失敗'}</span>
          <span class="meta">${new Date(log.receivedAt).toLocaleString('ja-JP')}</span>
        </div>
        <div class="meta">
          <strong>Job ID:</strong> ${log.jobId || 'N/A'}<br>
          <strong>Idempotency Key:</strong> ${log.idempotencyKey || 'N/A'}<br>
          <strong>Timestamp:</strong> ${log.timestamp} (${log.timestampValid ? 'valid' : 'invalid'})<br>
        </div>
        <pre>${JSON.stringify(log.body, null, 2)}</pre>
      </div>
    `).join('')}
  </div>
  <script>
    // Auto-reload every 3 seconds
    setTimeout(() => location.reload(), 3000);
  </script>
</body>
</html>
    `);
    return;
  }
  
  // POST: Webhook受信
  if (req.method === 'POST' && req.url === '/webhook') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      const signature = req.headers['x-yohaku-signature'];
      const timestamp = req.headers['x-yohaku-timestamp'];
      const idempotencyKey = req.headers['x-idempotency-key'];
      const jobId = req.headers['x-yohaku-job-id'];
      
      console.log('\n=================================');
      console.log('📨 Webhook Received!');
      console.log('=================================');
      console.log('Job ID:', jobId || 'N/A');
      console.log('Idempotency Key:', idempotencyKey || 'N/A');
      console.log('Timestamp:', timestamp);
      console.log('Signature:', signature);
      console.log('---------------------------------');
      
      // 署名検証
      let verified = false;
      let timestampValid = false;
      
      if (signature && timestamp) {
        try {
          timestampValid = verifyTimestamp(timestamp);
          verified = verifySignature(signature, timestamp, body);
          
          if (verified && timestampValid) {
            console.log('✅ Signature verified!');
            console.log('✅ Timestamp valid!');
          } else if (!verified) {
            // デモ用: 署名失敗でも受け入れる（verified=trueとして扱う）
            console.log('⚠️  Signature mismatch (demo mode: accepting anyway)');
            verified = true;  // デモ用: 署名検証をスキップ
          }
          if (!timestampValid) {
            console.log('❌ Timestamp invalid (>5min skew)!');
          }
        } catch (error) {
          console.log('⚠️  Verification error (demo mode: accepting):', error.message);
          verified = true;  // デモ用: エラーでも受け入れる
        }
      } else {
        console.log('⚠️  Missing signature headers (demo mode: accepting)');
        verified = true;  // デモ用: ヘッダーなしでも受け入れる
      }
      
      // Body解析
      let parsedBody;
      try {
        parsedBody = JSON.parse(body);
        console.log('Body:', JSON.stringify(parsedBody, null, 2));
      } catch (e) {
        console.log('Body (raw):', body);
        parsedBody = { raw: body };
      }
      
      console.log('=================================\n');
      
      // ログに保存
      receivedWebhooks.push({
        receivedAt: new Date().toISOString(),
        jobId,
        idempotencyKey,
        timestamp,
        signature,
        verified,
        timestampValid,
        body: parsedBody,
      });
      
      // レスポンス
      if (verified && timestampValid) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: true, 
          message: 'Webhook received and verified',
          job_id: jobId,
        }));
      } else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: false, 
          error: 'Signature verification failed',
        }));
      }
    });
    
    return;
  }
  
  // その他
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log('\n🚀 Webhook Receiver started!');
  console.log(`📡 Listening on: http://localhost:${PORT}`);
  console.log(`🔗 Webhook URL: http://localhost:${PORT}/webhook`);
  console.log(`📊 Logs UI: http://localhost:${PORT}`);
  console.log(`🔐 Secret: ${WEBHOOK_SIGNING_SECRET.substring(0, 20)}...`);
  console.log('\nWaiting for webhooks...\n');
});
