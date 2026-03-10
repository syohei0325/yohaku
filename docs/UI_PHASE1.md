# Yohaku Action Cloud – Phase1 UI実装完了

## 🎯 実装方針

**North Star**: "迷わせずに確定させる" + "後から一発で説明できる"

Phase1は「承認」×「証跡」×「停止」の3面だけで勝つ。

---

## ✅ 実装完了（4ページ + 1モーダル）

### 1️⃣ **Approve Page**（`/approve/[approve_id]`）

**目的**: 1枚完結の承認画面（Slack/メールから飛んで即決）

**構成**:
- ✅ タイトル + 30秒でわかる要約
- ✅ Riskバッジ（Reversible / Idempotent / External Call）
- ✅ KYAブロック（Executor / Principal / Tenant）
- ✅ Actions一覧（Webhook + Calendar Hold）
  - Webhook: 登録済みURL、HMAC署名あり、Payload詳細（折りたたみ）
  - Calendar Hold: 日時、期間
- ✅ 証拠（Evidence）折りたたみ（JSON表示）
- ✅ CTA（承認 / 却下ボタン、TTLカウントダウン付き）

**API**:
- `GET /api/v1/approve/[approve_id]` - 承認データ取得
- `POST /api/v1/approve/[approve_id]/confirm` - 承認/却下確定

**勝ちポイント**:
- 承認ボタンの近くにKYAを配置（心理的に効く）
- バッジと構造で判断させる（文章で説明しない）
- TTL表示で緊急性を可視化

---

### 2️⃣ **Receipt Page**（`/receipt/[receipt_id]`）

**目的**: 証跡の中心 + 社内共有（Team Viral）の武器

**構成**:
- ✅ ステータス表示（succeeded / partial / failed / queued）
- ✅ **Copy to Slack**ボタン（最上段右）← 最強の拡散導線
- ✅ Receipt ID + Created At
- ✅ KYAブロック（Executor / Principal / Tenant / Policy Ref）
- ✅ 実行結果一覧（actionごと）
  - Webhook: Job ID、Status、Attempts、Last Error
  - Calendar Hold: ICS Download
- ✅ Ledger参照（Event ID / Prev Hash / Append-only証明）
- ✅ Export（JSON / CSV）

**API**:
- `GET /api/v1/receipt/[receipt_id]` - Receipt取得

**勝ちポイント**:
- Receiptは"読む"じゃなく"貼る"ために作る
- 1クリックでSlackに貼れる導線が最優先
- KYA + Ledgerで「証明っぽさ」を演出

---

### 3️⃣ **Setup Wizard**（`/setup`）

**目的**: 30分導入を"UIで再現"

**4ステップ**:
1. ✅ **API Key作成**（Agent label推奨）
2. ✅ **Webhook URL登録**（事前登録制、localhost は dev限定）
3. ✅ **Receiver Kit起動**（コピペ用コマンド、secret prefix一致確認）
4. ✅ **エンドツーエンドテスト**（Plan → Approve → Confirm 自動実行）

**API**:
- `POST /api/v1/setup/api-key` - API Key作成
- `POST /api/v1/setup/webhook-url` - Webhook URL登録

**勝ちポイント**:
- Secret prefix一致を通過条件にする（ここが詰まると導入が死ぬ）
- テスト成功後、Receipt / Jobs への導線を提供
- 録画デモが"UI上で"撮れるようになる

---

### 4️⃣ **Jobs Table**（`/jobs`）

**目的**: Webhook配送モニタ（Hookdeck/Svixが売れてる理由）

**構成**:
- ✅ ステータスフィルタ（All / Queued / Delivering / Succeeded / Failed）
- ✅ 自動更新（5秒ごと、ON/OFF可能）
- ✅ Jobs一覧テーブル
  - Status、Job ID、Target URL、Attempts、Created、Actions
  - Last Error表示
  - Next Retry At表示
- ✅ Retryボタン（Failed時のみ表示）
- ✅ ステータス別集計（4つのカード）

**API**:
- `GET /api/v1/jobs?filter=all` - Jobs一覧取得
- `POST /api/v1/jobs/[job_id]/retry` - Job再送

**勝ちポイント**:
- リアルタイム性（5秒自動更新）
- 失敗理由が一目でわかる
- Retryが"再実行"にならないよう注意（承認が必要）

---

### 5️⃣ **Freeze Modal**（モーダル）

**目的**: 緊急停止ボタン（事故る前提のUI）

**構成**:
- ✅ Freeze範囲選択（Tenant全体 / Connector単位 / Target URL単位）
- ✅ Value入力（Tenant ID / Connector名 / Target URL）
- ✅ 停止理由（必須、監査ログに記録）
- ✅ 警告表示（Freeze中は対象範囲のすべての実行が拒否）
- ✅ Freeze実行ボタン

**API**:
- `POST /api/v1/freeze` - Freeze Rule作成
- `GET /api/v1/freeze` - Freeze Rules一覧
- `DELETE /api/v1/freeze/[rule_id]` - Freeze Rule解除

**勝ちポイント**:
- 右上に常に「🧊 Freeze」アイコン（予定）
- 停止理由を必須にすることで、監査に耐える
- 解除フローも明確に

---

### 6️⃣ **メインページ**（`/`）

**目的**: B2B SaaS Landing Page（B2C遺産を卒業）

**構成**:
- ✅ Hero Section（"AI/Automationの実行責任を30分で導入"）
- ✅ CTA（30分導入を始める / Dashboard）
- ✅ 3つの価値提案（KYA / Ledger / Freeze）
- ✅ コア体験（4ステップ）
- ✅ Phase1コネクタ（Webhook / Calendar Hold）
- ✅ 設計パートナー募集CTA
- ✅ Footer（Docs / Jobs / Dashboard / GitHub）

**勝ちポイント**:
- B2C音声アシスタントの痕跡をゼロに
- "Exit-first / Confirm Layer"の価値を明確に
- 設計パートナー獲得に直結する導線

---

## 🎨 デザイン原則

### 1. **迷わせない**
- 1画面で判断できる情報量
- バッジと構造で判断させる（文章で説明しない）
- CTAは常に明確

### 2. **証跡**
- KYA（誰が・誰の代理で・何を）を必ず表示
- Ledger（append-only）で「証明っぽさ」を演出
- Copy to Slackで社内共有を促進

### 3. **止められる**
- Freeze Modalで即座に停止
- 停止理由を必須にして監査に耐える

---

## 🚀 次の一手

### 今日やるべき（2時間）
1. ✅ スクショ4枚 + 録画1本（30分導入デモ）
2. ✅ OpenAI APIキー切り替え（mockモード卒業）
3. ✅ README.md を Market Thesis と同期

### 今週やるべき
4. ⏳ Conformance Suite v0.3 を自動テスト化（CI準備）
5. ⏳ Freeze Modalをグローバルヘッダーに統合
6. ⏳ Receipt Export機能実装（JSON / CSV / Audit bundle）

---

## 📊 実装状況

| ページ | 状態 | API | 備考 |
|--------|------|-----|------|
| Approve Page | ✅ 完成 | ✅ 完成 | TTL、KYA、Risk表示 |
| Receipt Page | ✅ 完成 | ✅ 完成 | Copy to Slack、Ledger |
| Setup Wizard | ✅ 完成 | ✅ 完成 | 4ステップ、secret prefix確認 |
| Jobs Table | ✅ 完成 | ✅ 完成 | 自動更新、Retry |
| Freeze Modal | ✅ 完成 | ✅ 完成 | 3段階Freeze |
| Landing Page | ✅ 完成 | - | B2B SaaS化完了 |

---

## 🎯 結論

**Phase1の4ページ + 1モーダルで「承認」×「証跡」×「停止」が完成。**

- ✅ 設計パートナーに見せられるUI
- ✅ 30分導入が"UIで"再現可能
- ✅ KYA / Ledger / Freezeが可視化
- ✅ B2C遺産を完全に卒業

**次は「導入デモの証拠」を作って、設計パートナー獲得に進む。**

