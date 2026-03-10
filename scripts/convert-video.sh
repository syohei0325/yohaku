#!/bin/bash

# 動画変換スクリプト（mp4 + gif）

echo "🎥 Converting video to mp4 and gif..."
echo ""

cd "$(dirname "$0")/.."

# ffmpegがインストールされているか確認
if ! command -v ffmpeg &> /dev/null; then
  echo "❌ ffmpeg is not installed"
  echo ""
  echo "Please install ffmpeg:"
  echo "  brew install ffmpeg"
  echo ""
  exit 1
fi

# 動画ファイルの存在確認
if [ ! -f "docs/demo/mvp-flow.mov" ]; then
  echo "❌ Video file not found: docs/demo/mvp-flow.mov"
  echo ""
  echo "Please record the video first using:"
  echo "  RECORDING_GUIDE.md"
  echo ""
  exit 1
fi

echo "✅ Found video: docs/demo/mvp-flow.mov"
echo ""

# mp4に変換
echo "📹 Converting to mp4..."
ffmpeg -i docs/demo/mvp-flow.mov \
  -vcodec h264 \
  -acodec aac \
  -y \
  docs/demo/mvp-flow.mp4 \
  2>&1 | grep -E "Duration|time=|error" || true

if [ -f "docs/demo/mvp-flow.mp4" ]; then
  MP4_SIZE=$(du -h docs/demo/mvp-flow.mp4 | cut -f1)
  echo "✅ Created: docs/demo/mvp-flow.mp4 ($MP4_SIZE)"
else
  echo "❌ Failed to create mp4"
  exit 1
fi

echo ""

# gifに変換
echo "🎬 Converting to gif (this may take a while)..."
ffmpeg -i docs/demo/mvp-flow.mov \
  -vf "fps=10,scale=800:-1:flags=lanczos" \
  -y \
  docs/demo/mvp-flow.gif \
  2>&1 | grep -E "Duration|time=|error" || true

if [ -f "docs/demo/mvp-flow.gif" ]; then
  GIF_SIZE=$(du -h docs/demo/mvp-flow.gif | cut -f1)
  echo "✅ Created: docs/demo/mvp-flow.gif ($GIF_SIZE)"
else
  echo "❌ Failed to create gif"
  exit 1
fi

echo ""
echo "📋 Demo assets:"
ls -lh docs/demo/

echo ""
echo "✅ Conversion complete!"
echo ""
echo "Next step: Update README.md to embed the video"
