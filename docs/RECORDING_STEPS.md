# デモ録画の手順（これだけ読めばOK）

---

## 準備（2分）

### ターミナルで3つのコマンドを実行

**ターミナルを開いて（Command + Space → "ターミナル"）、以下を1行ずつ実行：**

```bash
cd /Users/koyamasyohei/Yohaku
```

```bash
npx prisma db push --force-reset --accept-data-loss
```

```bash
npm run dev &
```

```bash
WEBHOOK_SIGNING_SECRET=e029d7d1e287eba2ff73d91f04dd9dc66bd75423eb9173044a831bf5b086040e node scripts/webhook-receiver.js &
```

30秒待って「Ready in ...」と表示されたらOK。

---

## 録画開始（10秒）

1. **`Command + Shift + 5`** を押す
2. 「選択した部分を収録」をクリック
3. ブラウザウィンドウだけをドラッグで選択
4. 「収録」ボタンをクリック

---

## 操作（45秒）

### ① ブラウザで `http://localhost:3000/demo` を開く
→ 自動でセットアップが走る（5〜10秒）
→ Approve ページに自動遷移する

### ② Approve ページで「承認」ボタンを押す
→ 承認完了

### ③ Receipt ページが開いたらゆっくりスクロール
見せる順番：
1. **Status: 完了 ✅**（一番上）
2. **Approval Lane: Review / Human**
3. **Evidence Pack**（判断の要点・参照元・モデル情報）
4. **Truth-First**（Receipt Hash + Signature）
5. **実行結果**（Webhook: delivered ✅、ICS: ok ✅）

---

## 録画停止（5秒）

1. **`Command + Shift + 5`** を押す
2. 「停止」をクリック
3. デスクトップに `.mov` ファイルが保存される

---

## mp4に変換（2分）

ターミナルで：

```bash
cd ~/Desktop
ls *.mov
```

ファイル名を確認して：

```bash
ffmpeg -i "ファイル名.mov" -vcodec h264 -acodec aac yohaku-demo.mp4
```

ffmpegがない場合：
```bash
brew install ffmpeg
```

---

## 変換できたら

1. `~/Desktop/yohaku-demo.mp4` ができている
2. YouTube（限定公開）か Loom にアップロード
3. URLをコピー
4. `docs/LAUNCH_POSTS.md` の `[URL]` 部分に貼る
5. README の `[Watch on YouTube](#)` 部分に貼る

---

## うまくいかない場合

### 「準備中...」で止まる
→ ブラウザで `Command + R` でリロード

### エラーが画面に出る
→ そのエラー文をここに貼る → すぐ直す

### サーバーが起動していない
→ ターミナルで `npm run dev` を実行

---

## 録画後にやること（5分）

1. GitHub に push する：
```bash
cd /Users/koyamasyohei/Yohaku
git add README.md
git commit -m "docs: add demo video link"
git push
```

2. `docs/LAUNCH_POSTS.md` を開いて Hacker News に投稿する
3. 知り合い3人にDMを送る
