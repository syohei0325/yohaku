# 🎬 45秒デモ録画スクリプト

## 📋 録画前チェック（10秒）

```bash
# ① サーバー起動確認
lsof -i :3000  # Next.js ✅
lsof -i :4001  # Receiver ✅
ps aux | grep webhook-worker | grep -v grep  # Worker ✅

# ② 通知OFF
# Mac: 画面右上の時計 → 「集中モード」→「おやすみモード」
```

---

## 🎬 録画開始

### Macの画面収録を開く

**2つの方法から選ぶ：**

#### 方法A: キーボードショートカット
```
Shift + Command + 5
→ 「画面全体を収録」を選択
→ 「収録」ボタンをクリック
```

#### 方法B: QuickTime Player
```
1. Spotlight（Command + Space）で「QuickTime」と入力
2. QuickTime Playerを開く
3. メニューバー「ファイル」→「新規画面収録」
4. 赤い録画ボタンをクリック
```

---

## ⏱️ 録画内容（45秒タイムライン）

録画が開始したら、以下を実行：

### 0:00-0:10 Setup Wizard

```
1. ブラウザで http://localhost:3000/setup を開く
2. ページをゆっくりスクロール
3. Step 4「🚀 Send Test Plan」ボタンまで見せる
4. ボタンをクリック
```

**画面に映るもの:**
- Setup Wizardのステップ（1-4）
- API Key作成
- Webhook URL登録
- Receiver Kit起動
- テスト実行ボタン

---

### 0:10-0:20 Approve Page

```
1. 自動で出てくるApproveリンクをクリック
   （または新しいタブで開く）
2. Approve Pageを3秒ほど見せる
3. 「Approve」ボタンをクリック
```

**画面に映るもの:**
- ✅ Risk Badges（Reversible, Idempotent, etc.）
- ⏱️ TTL Countdown（10分）
- 👤 KYA（Executor/Principal）
- 📋 Actions（Webhook + Calendar Hold）
- 🔵 Approve Button

---

### 0:20-0:30 Receipt Page

```
1. Approveボタンをクリックすると自動でReceiptに遷移
2. Receiptページを5秒見せる
```

**画面に映るもの:**
- ✅ Status: Succeeded
- 👤 KYA（Executor/Principal）
- 📦 Job Status（webhook_job）
- 🔗 Ledger Event ID
- 📋 Copy to Slack ボタン

---

### 0:30-0:40 Jobs Table

```
1. 新しいタブで http://localhost:3000/jobs を開く
2. succeeded の行を見せる
```

**画面に映るもの:**
- 📊 Job ID / Status / Attempts / Target
- ✅ status = succeeded
- 🔢 attempts = 1
- 🎯 target = http://localhost:4001/webhook

---

### 0:40-0:45 Receiver Verification

```
1. ターミナルに切り替え
2. Receiverログを見せる
3. ✅ Signature verified が見えることを確認
```

**画面に映るもの:**
- ターミナル（Receiver実行中）
- `✅ Signature verified` のログ
- `📦 Received webhook` のログ

---

### 0:45 録画停止

```
方法A: 画面上部メニューバーの「停止」ボタンをクリック
方法B: Command + Control + Esc を押す
```

**動画は自動的にデスクトップに保存される:**
```
~/Desktop/Screen Recording 2026-01-08 at XX.XX.XX.mov
```

---

## 📸 スクショ撮影（録画後）

録画が終わったら、以下の4枚を撮る：

### ① Approve Page

```bash
# 1. Setup → Send Test Plan → Approveページが出る
# 2. `Shift + Command + 4` を押す
# 3. マウスで範囲を選択してクリック
# 4. デスクトップに Screenshot XXX.png が保存される
```

### ② Receipt Page

```bash
# 1. Approveページで「Approve」→ Receiptに遷移
# 2. `Shift + Command + 4` を押してスクショ
```

### ③ Jobs Table

```bash
# 1. http://localhost:3000/jobs を開く
# 2. `Shift + Command + 4` を押してスクショ
```

### ④ Receiverログ

```bash
# 1. ターミナルでReceiverが動いてるウィンドウを開く
# 2. `✅ Signature verified` が見える状態で `Shift + Command + 4` でスクショ
```

---

## 📦 ファイル整理

スクショと動画を整理：

```bash
cd /Users/koyamasyohei/Yohaku
./scripts/organize-demo-assets.sh
```

**このスクリプトが自動で:**
1. ✅ デスクトップから最新の動画を `docs/demo/mvp-flow.mov` に移動
2. ✅ デスクトップから最新のスクショ4枚を `docs/demo/01-approve.png` 等に移動
3. ✅ `docs/demo/` の内容を表示

---

## ✅ 完了確認

```bash
ls -la docs/demo/
```

**期待する出力:**
```
01-approve.png
02-receiver-verified.png
03-jobs-succeeded.png
04-receipt-kya.png
mvp-flow.mov
```

**この出力が出たら完了！**

次のステップ：
1. 動画変換（MP4 / GIF）
2. README.md更新（デモ動画埋め込み）
3. 設計パートナーリスト作成

---

## 🚨 トラブルシューティング

### Q: 録画ボタンが見つからない

→ **QuickTime Playerを使う**:
```bash
open -a "QuickTime Player"
# メニューバー「ファイル」→「新規画面収録」
```

### Q: Approveページが出ない

```bash
# Setup Wizardの「Send Test Plan」を押したのに何も起きない
# → ブラウザのコンソールを確認（F12 → Console）
# エラーが出てたらスクショして貼ってください
```

### Q: Receiverログに何も出ない

```bash
# Webhook Workerが動いてるか確認
ps aux | grep webhook-worker | grep -v grep

# 動いてなければ起動
cd /Users/koyamasyohei/Yohaku
npm run webhook-worker
```

---

**🎬 準備完了！録画を開始してください。**
