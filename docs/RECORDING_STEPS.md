# デモ録画の手順（今すぐ撮れる版）

> **サーバーはすでに起動済みです。**
> ブラウザを開くだけで録画できます。

---

## 今の状態

| サービス | 状態 |
|---------|------|
| Yohaku サーバー | ✅ 起動中 http://localhost:3000 |
| Webhook 受信サーバー | ✅ 起動中 http://localhost:4001 |
| DB | ✅ リセット済み（クリーンな状態） |

---

## STEP 1：録画を開始する（30秒）

1. **`Command + Shift + 5`** を押す
2. 画面下に録画メニューが出る
3. **「選択した部分を収録」** をクリック
4. ブラウザウィンドウだけをドラッグで囲む
5. **「収録」** ボタンをクリック

---

## STEP 2：デモを操作する（90秒）

### ① ブラウザで開く
```
http://localhost:3000/demo
```

→ 「Yohaku Demo 録画用セットアップ 🚀 準備中...」が表示される  
→ 10秒ほどで自動的に **Approve ページ** に遷移する

---

### ② Approve ページで「承認する」を押す

画面に承認ボタンが出るので押す。

→ 「承認完了」と表示される  
→ 自動的に **Receipt ページ** に遷移する

---

### ③ Receipt ページをゆっくりスクロールする（これがメイン）

**見せる順番（ゆっくり、各5秒）：**

1. **一番上：Status: 完了 ✅**
2. **Approval Lane: Review / Human**（人間が承認した証拠）
3. **Evidence Pack**（何を根拠に実行したか）
4. **Truth-First**（Receipt Hash + Signature = 改ざん不能）
5. **Outcome Pack: success**（実行結果）
6. **Webhook: delivered ✅**（実際に送信された）

---

### ④ Freeze を試す（オプション・30秒追加）

ブラウザで別タブを開いて：
```
http://localhost:3000/demo
```
→ もう一度デモを開始しようとする  
→ 途中で **Freeze** をかける（画面に Freeze ボタンがある場合）  
→ 「実行が止まった」を見せる

---

## STEP 3：録画を止める（5秒）

1. **`Command + Shift + 5`** を押す
2. **「停止」** をクリック
3. デスクトップに `.mov` ファイルが保存される

---

## STEP 4：mp4 に変換する（2分）

ターミナルで以下を実行：

```bash
cd ~/Desktop && ls *.mov
```

ファイル名を確認して（例：`画面収録 2026-02-06 ...mov`）：

```bash
ffmpeg -i "$(ls ~/Desktop/*.mov | head -1)" -vcodec h264 -acodec aac ~/Desktop/yohaku-demo.mp4
```

ffmpeg がない場合：
```bash
brew install ffmpeg
```

---

## STEP 5：YouTube にアップロードする（5分）

1. [YouTube Studio](https://studio.youtube.com) を開く
2. 「作成」→「動画をアップロード」
3. `~/Desktop/yohaku-demo.mp4` を選択
4. タイトル：`Yohaku — Verified Execution OS for AI Agents (90sec demo)`
5. 公開設定：**限定公開**（最初は限定公開でOK）
6. アップロード完了 → URL をコピー

---

## STEP 6：README に動画リンクを貼る

URLをコピーしたら、ここに貼ってください。
私が README を更新して push します。

---

## うまくいかない場合

### 「準備中...」で止まる
→ ブラウザで `Command + R` でリロード

### サーバーが止まっていた場合
ターミナルで：
```bash
cd /Users/koyamasyohei/Yohaku
npx prisma db push --force-reset --accept-data-loss
npm run dev &
WEBHOOK_SIGNING_SECRET=e029d7d1e287eba2ff73d91f04dd9dc66bd75423eb9173044a831bf5b086040e node scripts/webhook-receiver.js &
```

### エラーが出た場合
→ エラー文をそのままここに貼る → すぐ直す
