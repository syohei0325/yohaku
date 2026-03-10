# Yohaku Action Cloud – Demo Assets

## 🎥 45秒デモ

![mvp-flow](./mvp-flow.gif)

**MP4版**: [mvp-flow.mp4](./mvp-flow.mp4)

---

## 📸 スクリーンショット（4枚）

### 1️⃣ Approve Page（10秒で判断できる）
**TTL + Riskバッジ + KYA が全部見える**

![01-approve](./01-approve.png)

**ポイント**:
- TTLカウントダウン（残り時間が見える）
- Riskバッジ（Reversible / Idempotent / Registered Target）
- KYA（Executor / Principal / Tenant）
- Actions（Webhook + Calendar Hold）

---

### 2️⃣ Receipt Page（KYA + Copy to Slack）
**証跡の中心 + 社内共有の武器**

![04-receipt-kya](./04-receipt-kya.png)

**ポイント**:
- Copy to Slackボタン（Team Viral）
- KYA（誰が・誰の代理で・何を確定したか）
- Job status（succeeded）
- Ledger参照（Event ID / Prev Hash）

---

### 3️⃣ Jobs Table（queued → succeeded）
**Webhook配送モニタ**

![03-jobs-succeeded](./03-jobs-succeeded.png)

**ポイント**:
- Status: Succeeded
- Attempts: 1
- 自動更新（5秒）
- Retry機能

---

### 4️⃣ Receiver Log（Signature verified）
**本物感の核**

![02-receiver-verified](./02-receiver-verified.png)

**ポイント**:
- ✅ Signature verified
- Timestamp validation OK
- HMAC-SHA256署名検証成功

---

## 🚀 使い方

### GitHub README.md に埋め込み
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
45秒デモ: https://github.com/[your-org]/action-cloud/blob/main/docs/demo/mvp-flow.gif
スクショ: https://github.com/[your-org]/action-cloud/tree/main/docs/demo
```

---

## 📊 デモで伝わること

### **1. 承認（Approve）**
- 10秒で判断できる構造
- TTL（10分）で緊急性を可視化
- Riskバッジで判断の軸を固定

### **2. 証跡（Receipt）**
- KYA（誰が・誰の代理で）を必ず記録
- Ledger（append-only）で監査可能
- Copy to Slackで社内共有（Team Viral）

### **3. 停止（Freeze）**
- 事故った瞬間に止められる
- Tenant / Connector / Target単位

### **4. 配送保証（Jobs）**
- Webhook配送をリアルタイムモニタ
- Retry（指数バックオフ、2h収束）
- Signature verified（HMAC-SHA256）

---

**🎯 この4枚で「これ無しで本番は無理」を言わせる。**

