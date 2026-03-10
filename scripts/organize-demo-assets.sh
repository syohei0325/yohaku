#!/bin/bash

# 録画後のファイル整理スクリプト

echo "📁 Organizing demo assets..."
echo ""

cd "$(dirname "$0")/.."

# docsフォルダ作成
mkdir -p docs/demo

# デスクトップから動画を探す
DESKTOP="$HOME/Desktop"
MOV_FILE=$(ls -t "$DESKTOP"/Screen\ Recording*.mov 2>/dev/null | head -1)

if [ -n "$MOV_FILE" ]; then
  echo "✅ Found video: $(basename "$MOV_FILE")"
  mv "$MOV_FILE" docs/demo/mvp-flow.mov
  echo "   → Moved to docs/demo/mvp-flow.mov"
else
  echo "⚠️  No .mov file found on Desktop"
  echo "   Please manually move the recording to:"
  echo "   docs/demo/mvp-flow.mov"
fi

echo ""

# スクリーンショットを探す
PNG_COUNT=0
for i in 1 2 3 4; do
  PNG_FILE=$(ls -t "$DESKTOP"/*.png 2>/dev/null | sed -n "${i}p")
  if [ -n "$PNG_FILE" ]; then
    case $i in
      1) TARGET="01-approve.png" ;;
      2) TARGET="04-receipt-lanes.png" ;;
      3) TARGET="03-jobs-succeeded.png" ;;
      4) TARGET="02-receiver-verified.png" ;;
    esac
    
    echo "✅ Found screenshot $i: $(basename "$PNG_FILE")"
    mv "$PNG_FILE" "docs/demo/$TARGET"
    echo "   → Moved to docs/demo/$TARGET"
    PNG_COUNT=$((PNG_COUNT + 1))
  fi
done

echo ""

if [ $PNG_COUNT -eq 0 ]; then
  echo "⚠️  No .png files found on Desktop"
  echo "   Please manually take 4 screenshots and save as:"
  echo "   - docs/demo/01-approve.png"
  echo "   - docs/demo/04-receipt-lanes.png"
  echo "   - docs/demo/03-jobs-succeeded.png"
  echo "   - docs/demo/02-receiver-verified.png"
else
  echo "✅ Moved $PNG_COUNT screenshot(s)"
fi

echo ""
echo "📋 Current demo assets:"
ls -lh docs/demo/ 2>/dev/null || echo "   (empty)"

echo ""
echo "✅ Done!"
