# 公開用投稿文・DMテンプレート

---

## 1. Hacker News（Show HN）

URL: https://news.ycombinator.com/submit

**Title:**
```
Show HN: Yohaku – The authorization layer for AI agent execution
```

**Text:**
```
AI agents are executing in production. Nobody knows who authorized it, 
nobody has the evidence, and nobody can stop it.

We built Yohaku: a neutral execution layer that every AI agent must pass through.

Plan → Approve → Confirm → Receipt

What it does:
- Authorization-first: every execution requires an Authorization object
- Signed receipts: tamper-evident proof of who approved what and why
- Evidence Pack: decision rationale + data source refs + model info (no raw data stored)
- Context Receipt: signed proof of what data the AI accessed and with what permissions
- Freeze / Circuit Breaker: emergency stop at any level
- PROD Idempotency: fencing + crash recovery, no double execution ever
- Shadow Mode: simulate before going live

Human optional. Accountability mandatory.

GitHub: https://github.com/YOUR_USERNAME/yohaku
Demo: [URL after recording]

Happy to answer questions about the design decisions.
```

---

## 2. X（Twitter）投稿文

### パターンA（短い・刺さる）
```
AI agents are executing in production.

Nobody knows who authorized it.
Nobody has the evidence.
Nobody can stop it.

We built Yohaku: the exit layer every agent must pass through.

Plan → Approve → Confirm → Receipt

Human optional. Accountability mandatory.

[デモ動画]
GitHub: [URL]
```

### パターンB（問題提起型）
```
"The AI did it" is not an answer your auditors will accept.

Yohaku gives you:
→ Who authorized the execution
→ What data the AI accessed (signed proof)
→ Why it was allowed (policy + evidence)
→ How to stop it instantly (Freeze)
→ Proof it didn't run twice (Idempotency)

The last 80 miles for agent production.

[デモ動画] [GitHub URL]
```

### パターンC（開発者向け）
```
Built the thing I wished existed when deploying AI agents:

POST /v1/plan    → structured execution spec
POST /v1/approve → authorization object (TTL: 10min)
POST /v1/confirm → idempotent execution
GET  /receipt    → signed, tamper-evident proof

Same idempotency key → same receipt (always)
Different content → 409 conflict (always)
Crash mid-flight → 202 recovery (always)

GitHub: [URL]
```

---

## 3. LinkedIn投稿文

```
We just open-sourced Yohaku.

The problem: AI agents are executing in production without accountability.
- Who authorized this action?
- What data did the AI access?
- Can we stop it right now?
- How do we explain this to auditors?

The solution: a neutral execution layer that every agent must pass through.

Plan → Approve → Confirm → Receipt

Key features:
✅ Signed receipts (tamper-evident, audit-ready)
✅ Evidence Pack (rationale + data sources + model info)
✅ Context Receipt (proof of data access)
✅ Freeze / Emergency Stop
✅ PROD Idempotency (no double execution)
✅ Shadow Mode (simulate before production)

Human optional. Accountability mandatory.

If you're running AI agents in production and worried about accountability, 
I'd love to talk. We're looking for 3 design partners (free for 60 days).

GitHub: [URL]
Demo: [URL]
```

---

## 4. 日本語DM（知り合いへ）

### SRE/エンジニア向け
```
[名前]さん、突然すみません。

いまAIエージェントの実行制御ツールを作って、今日公開しました。

「AIが本番で勝手に実行して事故る」問題に対して、
承認×証跡×停止を30分で導入できるレイヤーです。

具体的には：
- 誰が承認したか（Authorization object）
- 何を根拠にしたか（Evidence Pack）
- AIがどのデータを見たか（Context Receipt）
- 緊急停止（Freeze）
- 二重実行防止（Idempotency）

45秒デモ：[URL]
GitHub：[URL]

もし「本番に入れるのが怖い自動化」が1個でもあれば、
15分だけ話せますか？
```

### CTO/経営者向け
```
[名前]さん、お世話になっています。

今日、AIエージェントの実行責任レイヤー「Yohaku」を公開しました。

一言で言うと「AIが何かを実行する前に必ず通る関所」です。

承認・証跡・停止・監査証拠を一つのレイヤーで解決します。
EU AI Act / SOC2 / 社内コンプライアンス対応にも使えます。

設計パートナーを3社だけ探しています（60日無料）。

45秒デモ：[URL]
GitHub：[URL]

15分だけ話せますか？
```

### 英語DM（海外エンジニア向け）
```
Hey [Name],

I just open-sourced Yohaku — an authorization layer for AI agent execution.

The problem it solves: AI agents executing in production with no accountability.
Who authorized it? What data did it access? Can you stop it?

Plan → Approve → Confirm → Receipt (signed, tamper-evident)

GitHub: [URL]
Demo: [URL]

We're looking for 3 design partners (free for 60 days).
If you're running agents in production, would love to chat for 15 min.
```

---

## 5. Product Hunt（後日）

**Tagline:**
```
The authorization layer every AI agent must pass through
```

**Description:**
```
AI agents are executing in production without accountability.

Yohaku is the neutral execution layer that solves this:

→ Plan: AI generates a structured execution spec
→ Approve: Human or policy authorizes (TTL: 10 min)
→ Confirm: Idempotent execution (no double runs, ever)
→ Receipt: Signed, tamper-evident proof of everything

Key features:
• Authorization-first (Human optional. Accountability mandatory.)
• Approval Lanes: Auto / Review / Gate
• Evidence Pack: rationale + data sources + model info
• Context Receipt: signed proof of data access
• Freeze: emergency stop at any level
• Shadow Mode: simulate before production
• PROD Idempotency: fencing + crash recovery

Built for SRE, DevOps, and AI-native teams who need accountability in production.
```

---

## 投稿の優先順位

1. **今日：** GitHub に push → Hacker News に投稿
2. **今日：** 知り合い3人にDM（日本語）
3. **明日：** X に投稿（デモ動画付き）
4. **来週：** LinkedIn
5. **来月：** Product Hunt（デモ動画 + スクショが揃ってから）
