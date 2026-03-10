#!/bin/bash

# Yohaku録画用サーバー起動スクリプト

echo "🚀 Starting Yohaku servers for recording..."
echo ""

# プロジェクトディレクトリに移動
cd "$(dirname "$0")/.."

# ポートチェック
check_port() {
  lsof -ti:$1 > /dev/null 2>&1
  return $?
}

# ポート3000をチェック
if check_port 3000; then
  echo "⚠️  Port 3000 is already in use"
  echo "   Killing existing process..."
  kill -9 $(lsof -ti:3000) 2>/dev/null
  sleep 1
fi

# ポート4001をチェック
if check_port 4001; then
  echo "⚠️  Port 4001 is already in use"
  echo "   Killing existing process..."
  kill -9 $(lsof -ti:4001) 2>/dev/null
  sleep 1
fi

echo ""
echo "📡 Starting Next.js dev server (port 3000)..."
npm run dev > /tmp/yohaku-dev.log 2>&1 &
DEV_PID=$!
echo "   PID: $DEV_PID"

echo ""
echo "🔗 Starting Webhook Receiver (port 4001)..."
node scripts/webhook-receiver.js > /tmp/yohaku-receiver.log 2>&1 &
RECEIVER_PID=$!
echo "   PID: $RECEIVER_PID"

echo ""
echo "⏳ Waiting for servers to start..."
sleep 3

echo ""
echo "✅ Servers started!"
echo ""
echo "📍 Next.js:           http://localhost:3000"
echo "📍 Setup Wizard:      http://localhost:3000/setup"
echo "📍 Webhook Receiver:  http://localhost:4001"
echo ""
echo "📋 Process IDs:"
echo "   Next.js:    $DEV_PID"
echo "   Receiver:   $RECEIVER_PID"
echo ""
echo "📝 Logs:"
echo "   Next.js:    tail -f /tmp/yohaku-dev.log"
echo "   Receiver:   tail -f /tmp/yohaku-receiver.log"
echo ""
echo "🛑 To stop:"
echo "   kill $DEV_PID $RECEIVER_PID"
echo ""
echo "🎬 Ready for recording!"
