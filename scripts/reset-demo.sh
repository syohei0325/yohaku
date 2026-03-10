#!/bin/bash

# デモ録画用のデータベースリセットスクリプト

echo "🗑️  Resetting demo database..."
echo ""

cd "$(dirname "$0")/.."

# Prismaでデータベースをリセット
echo "📦 Pushing schema..."
npx prisma db push --force-reset --accept-data-loss

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Database reset complete!"
  echo ""
  echo "🎬 Ready for recording!"
  echo ""
  echo "Next steps:"
  echo "  1. ./scripts/start-servers.sh"
  echo "  2. Open http://localhost:3000/demo"
  echo "  3. Start recording!"
else
  echo ""
  echo "❌ Database reset failed"
  exit 1
fi
