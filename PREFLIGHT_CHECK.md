# 🚀 録画前プリフライトチェック

## ✅ 実行手順（これをそのまま見ながら録画）

### 0. 録画開始前（30秒）

```bash
# ① サーバー確認（全部起動してるはず）
lsof -i :3000  # Next.js
lsof -i :4001  # Receiver
ps aux | grep webhook-worker | grep -v grep  # Worker

# ② DND ON（通知オフ）
# Mac: 画面右上の時計クリック → 「集中モード」→「おやすみモード」

# ③ ブラウザで開く（確認だけ、まだ操作しない）
open http://localhost:3000/setup
```

---

## 🎬 録画手順（45秒）

### 録画開始

**`Shift + Command + 5`** を押す → 「画面全体を収録」→「収録」ボタンをクリック

---

### 秒数別操作

| 秒数 | 操作 | 画面 |
|-----|------|------|
| **0:00** | 録画開始 | - |
| **0:02** | ブラウザで `http://localhost:3000/setup` を開く | Setup Wizard |
| **0:05** | 下にスクロールして「Step 4: Test」まで見せる | Setup Wizard |
| **0:08** | 「🚀 Send Test Plan」ボタンをクリック | Setup Wizard |
| **0:12** | 自動で出てくるApproveリンクをクリック | Approve Page |
| **0:15** | Approve Pageを3秒見せる（TTL/KYA/Risk） | Approve Page |
| **0:20** | 「Approve」ボタンをクリック | Approve Page |
| **0:25** | Receiptに遷移（KYA/Job Status表示） | Receipt Page |
| **0:30** | 新しいタブで `http://localhost:3000/jobs` を開く | Jobs Table |
| **0:35** | status = succeeded の行を見せる | Jobs Table |
| **0:40** | ターミナルに切り替えてReceiverログを見せる | Terminal |
| **0:43** | `✅ Signature verified` が見えることを確認 | Terminal |
| **0:45** | 録画停止（メニューバーの停止ボタン or `Cmd+Ctrl+Esc`） | - |

---

## 📸 スクショ手順（録画後）

録画が終わったら、以下の4枚を撮る：

### ① Approve Page

```bash
# Setup → Send Test Plan → Approveページが出る
# `Shift + Command + 4` を押してスクショ
```

### ② Receipt Page

```bash
# Approveページで「Approve」→ Receiptに遷移
# `Shift + Command + 4` を押してスクショ
```

### ③ Jobs Table

```bash
# http://localhost:3000/jobs を開く
# `Shift + Command + 4` を押してスクショ
```

### ④ Receiverログ

```bash
# ターミナルでReceiverが動いてるウィンドウを開く
# `✅ Signature verified` が見える状態で `Shift + Command + 4` でスクショ
```

---

## 📦 ファイル整理（スクショ後）

```bash
cd /Users/koyamasyohei/Yohaku

# デスクトップから移動（最新のファイルを自動で取得）
latest_mov=$(ls -t ~/Desktop/Screen\ Recording*.mov 2>/dev/null | head -1)
if [ -n "$latest_mov" ]; then
  mv "$latest_mov" docs/demo/mvp-flow.mov
  echo "✅ 動画を移動: mvp-flow.mov"
fi

# スクショを移動（最新の4つを順番に）
screenshots=($(ls -t ~/Desktop/Screenshot*.png 2>/dev/null | head -4))
if [ ${#screenshots[@]} -eq 4 ]; then
  mv "${screenshots[3]}" docs/demo/01-approve.png
  mv "${screenshots[2]}" docs/demo/04-receipt-kya.png
  mv "${screenshots[1]}" docs/demo/03-jobs-succeeded.png
  mv "${screenshots[0]}" docs/demo/02-receiver-verified.png
  echo "✅ スクショを移動: 4枚"
fi

# 確認
ls -lh docs/demo/
```

---

## ✅ 完了後

```bash
cd /Users/koyamasyohei/Yohaku
ls -la docs/demo/
```

**この出力をCursorに貼れば、あとは自動で変換・README更新・リスト作成が完了します。**

---

## 🚨 トラブルシューティング

### Q: 録画ボタンが見つからない

→ **QuickTime Player** を使う:
1. アプリケーション → QuickTime Player
2. メニューバー「ファイル」→「新規画面収録」
3. 赤い録画ボタンをクリック

### Q: Approveページが出ない

```bash
# Setup Wizardの「Send Test Plan」を押したのに何も起きない
# → ブラウザのコンソールを確認（F12 → Console）
# エラーが出てたら貼ってください
```

### Q: Receiverログが見つからない

```bash
# 新しいターミナルタブを開いて
cd /Users/koyamasyohei/Yohaku/receiver-starter-node
WEBHOOK_SIGNING_SECRET=$(grep WEBHOOK_SIGNING_SECRET /Users/koyamasyohei/Yohaku/.env.local | cut -d= -f2) PORT=4001 npm start
```

---

**準備完了！録画を開始してください。**
