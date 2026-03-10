# 📹 録画ガイド（45秒デモ）

## 🎯 目的
Yohaku Action Cloudの新機能「Approval Lanes（Auto/Review/Gate）」を含む、完全な動作デモを録画する。

---

## ⚙️ 事前準備

### 1. 開発サーバーを起動
```bash
cd /Users/koyamasyohei/Yohaku
npm run dev
```

→ `http://localhost:3000` で起動することを確認

### 2. Receiverサーバーを起動（別ターミナル）
```bash
cd /Users/koyamasyohei/Yohaku
node scripts/webhook-receiver.js
```

→ `http://localhost:4001` で起動することを確認

### 3. ブラウザを開く
- Chrome or Safariを開く
- `http://localhost:3000/setup` を開く
- ウィンドウサイズを適切に調整（1280x720推奨）

---

## 🎬 録画手順

### Step 0: QuickTime Playerで画面収録開始

1. **QuickTime Player**を起動
2. メニュー → **「ファイル」→「新規画面収録」**
3. 収録範囲を選択：
   - **「選択部分を収録」**を選ぶ
   - ブラウザウィンドウ全体を囲む
4. **録画開始ボタン（赤丸）をクリック**

---

### Step 1: Demo Setup（0:00-0:05）

**URL: `http://localhost:3000/demo`**

#### 自動セットアップ：
1. ページを開く → **自動的にセットアップが開始**
2. 「準備完了！」が表示される（3秒）
3. **自動的にApprove Pageに遷移**

**⏱️ 所要時間: 5秒**

※ API Key、Webhook URL、Calendar Emailは自動登録されます

---

### Step 2: Approve Page（0:10-0:25）

**自動遷移: `http://localhost:3000/approve/aprv_xxxxx`**

#### 確認ポイント（カメラを止めずに見せる）：

1. **📋 実行内容**
   - Webhook送信
   - Calendar Hold（ICS）

2. **🚦 実行責任（KYA）** ← スクロールして表示
   - Executor: UI
   - Principal: user_demo_001
   - Tenant: tenant_mock_001

3. **⏱️ 残り時間**（TTL 10分）
   - 表示されていることを確認

4. **🆕 新機能表示**（暗黙的に Approval Lane = Review）
   - Risk: low
   - ✓ Reversible
   - ✓ Idempotent
   - ✓ Registered Target

5. **[✅ 承認して実行]** ボタンをクリック

**⏱️ 所要時間: 15秒**

---

### Step 3: Receipt Page（0:25-0:40）

**自動遷移: `http://localhost:3000/receipt/rcp_xxxxx`**

#### 確認ポイント（ゆっくりスクロールして全て見せる）：

1. **ヘッダー**
   - ✅ Status: 成功
   - Receipt ID

2. **🚦 Approval Lane（新機能！）** ← ここが最重要
   - Lane: **👤 Review**（青色バッジ）
   - Principal Type: **👤 Human**（青色バッジ）

3. **🔐 実行責任（KYA）**
   - Executor (Agent): UI
   - Principal (User): user_demo_001
   - Policy Ref
   - Risk Tier: low
   - Execution Mode: live

4. **📊 Evidence Pack（Responsible AI）**
   - Decision Rationale（短文）
   - Data Sources（ref+hashのみ）
   - Model Info

5. **🔒 Truth-First（Receipt検証）**
   - Receipt Hash
   - Server Signature
   - ✓ Verified バッジ

6. **📋 実行結果（2件）**
   - Webhook送信: succeeded
   - Calendar Hold: succeeded

7. **Jobs Table リンクをクリック**

**⏱️ 所要時間: 15秒**

---

### Step 4: Jobs Table（0:40-0:45）

**別タブで開く: Jobs Table**

#### 確認ポイント：

1. **Webhook配信状況**
   - Status: succeeded
   - Attempts: 1/8
   - Target URL確認

2. **（任意）Receiver Log確認**
   - 別タブで `http://localhost:4001` を開く
   - ✅ Webhook受信成功
   - ✅ 署名検証成功

**⏱️ 所要時間: 5秒**

---

### Step 5: 録画停止

**QuickTime Playerのメニューバー → 停止ボタン**

→ デスクトップに `Screen Recording [日時].mov` として保存される

---

## 📸 スクリーンショット撮影（4枚）

録画後、以下の画面でスクリーンショットを撮る：

### 1. Approve Page（承認画面）
- URL: `http://localhost:3000/approve/aprv_xxxxx`
- **Cmd + Shift + 4** → 範囲を選択
- ファイル名: `01-approve.png`

### 2. Receipt Page（Lanes表示）
- URL: `http://localhost:3000/receipt/rcp_xxxxx`
- **🚦 Approval Lane セクションが見える位置**
- ファイル名: `04-receipt-lanes.png`

### 3. Jobs Table（配信状況）
- Jobs Tableページ
- Status: succeeded が見える
- ファイル名: `03-jobs-succeeded.png`

### 4. Receiver Log（検証成功）
- URL: `http://localhost:4001`
- ✅ 署名検証成功のログ
- ファイル名: `02-receiver-verified.png`

---

## 📁 ファイル整理

録画とスクショが完了したら：

```bash
# docsフォルダを作成
mkdir -p /Users/koyamasyohei/Yohaku/docs/demo

# 動画を移動
mv ~/Desktop/Screen\ Recording*.mov /Users/koyamasyohei/Yohaku/docs/demo/mvp-flow.mov

# スクショを移動（ファイル名を変更）
mv ~/Desktop/01-approve.png /Users/koyamasyohei/Yohaku/docs/demo/
mv ~/Desktop/04-receipt-lanes.png /Users/koyamasyohei/Yohaku/docs/demo/
mv ~/Desktop/03-jobs-succeeded.png /Users/koyamasyohei/Yohaku/docs/demo/
mv ~/Desktop/02-receiver-verified.png /Users/koyamasyohei/Yohaku/docs/demo/
```

---

## ✅ 録画完了チェックリスト

- [ ] 開発サーバー起動確認（:3000）
- [ ] Receiverサーバー起動確認（:4001）
- [ ] QuickTime画面収録開始
- [ ] Setup Wizard入力完了
- [ ] Approve Page確認（10秒）
- [ ] Receipt Page確認（Lanes表示！）
- [ ] Jobs Table確認
- [ ] 録画停止
- [ ] スクショ4枚撮影
- [ ] ファイル整理完了

---

## 🎯 重要ポイント

### 新機能を必ず見せる：
- **🚦 Approval Lane セクション**（Receipt Page）
- Lane: 👤 Review
- Principal Type: 👤 Human

### 既存機能もしっかり見せる：
- KYA（実行責任）
- Evidence Pack（Responsible AI）
- Truth-First（Receipt検証）
- Webhook配信成功

---

## 🚨 トラブルシューティング

### Q: 開発サーバーが起動しない
```bash
# ポートが使われているか確認
lsof -i :3000

# プロセスを終了
kill -9 [PID]

# 再起動
npm run dev
```

### Q: Receiverサーバーが起動しない
```bash
# ポートが使われているか確認
lsof -i :4001

# プロセスを終了
kill -9 [PID]

# 再起動
node scripts/webhook-receiver.js
```

### Q: Approve Pageに遷移しない
- Setup Wizardで「保存して次へ」をクリックしたか確認
- ブラウザのコンソールでエラー確認

---

**録画を開始してください！🎬**
