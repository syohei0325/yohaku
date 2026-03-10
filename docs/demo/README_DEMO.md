# Yohaku Action Cloud – Demo Assets

## 📸 スクリーンショット（4枚）

### 1. `01-approve.png` – Approve Page
- TTLカウントダウン
- Riskバッジ（Reversible / Idempotent / Registered Target）
- KYA（Executor / Principal / Tenant）
- Actions（Webhook + Calendar Hold）

### 2. `02-receiver-verified.png` – Receiver Log
- `✅ Signature verified`
- Timestamp validation OK

### 3. `03-jobs-succeeded.png` – Jobs Table
- Status: Succeeded
- Attempts: 1
- Job ID / Target URL

### 4. `04-receipt-kya.png` – Receipt Page
- KYA（Executor / Principal / Tenant / Policy Ref）
- Job status（succeeded）
- Copy to Slackボタン
- Ledger（Event ID / Prev Hash）

---

## 🎥 デモ動画（45秒）

### `mvp-flow.mp4` / `mvp-flow.gif`

**流れ**:
1. Setup Wizard Step 4 → テスト実行
2. Receipt Page → KYA + Job status確認
3. Jobs Table → Webhook配送確認（succeeded）
4. Approve Page → 承認画面（TTL + Risk + KYA）

---

## 🚀 使い方

### README.md に埋め込み
```markdown
## デモ動画（45秒）

![MVP Flow](docs/demo/mvp-flow.gif)

### スクリーンショット

| Approve Page | Receipt Page |
|--------------|--------------|
| ![Approve](docs/demo/01-approve.png) | ![Receipt](docs/demo/04-receipt-kya.png) |

| Jobs Table | Receiver Verified |
|------------|-------------------|
| ![Jobs](docs/demo/03-jobs-succeeded.png) | ![Receiver](docs/demo/02-receiver-verified.png) |
```

### 設計パートナーDM
```
45秒デモ: https://github.com/yohaku/action-cloud/blob/main/docs/demo/mvp-flow.gif
スクショ: https://github.com/yohaku/action-cloud/tree/main/docs/demo
```

---

## 📋 撮影チェックリスト

- [ ] PostgreSQL起動中
- [ ] Next.js起動中（http://localhost:3000）
- [ ] Webhook Worker起動中
- [ ] Receiver起動中（PORT=4001）
- [ ] `.env` と Receiver の `WEBHOOK_SIGNING_SECRET` が統一
- [ ] ブラウザのタブを整理
- [ ] 画面録画の準備（Shift + Cmd + 5）

---

**詳細な台本は `DEMO_SCRIPT_45SEC.md` を参照**
