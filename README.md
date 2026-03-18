# Yohaku Action Cloud

**Verified Execution OS for agent fleets.**

> AI agents are executing in production. Who authorized it? What was the evidence? Can you prove it?

Yohaku is where context becomes verified execution.
Every AI agent action passes through Yohaku before it touches the real world — and every execution leaves a signed, tamper-evident proof.

```
AI Agent decides to act
        ↓
Yohaku stops it
        ↓
"Who authorized this?" "What's the evidence?" "Is this safe?"
        ↓
Approve → Confirm → Receipt (signed, tamper-evident)
        ↓
Even if something goes wrong — you can explain everything
```

---

## ▶ Demo (90 sec)

[![Yohaku Demo](https://img.youtube.com/vi/rVUnSkW5go4/maxresdefault.jpg)](https://www.youtube.com/watch?v=rVUnSkW5go4)

**[▶ Watch on YouTube](https://www.youtube.com/watch?v=rVUnSkW5go4)**

**What you'll see:**
1. AI agent submits a plan → Approve link appears
2. Click Approve (Review lane) → Authorization created
3. Confirm runs → Receipt generated (Evidence / Lane / Outcome visible)
4. Webhook delivered ✅ — signed, tamper-evident proof

**Try it yourself:** `open http://localhost:3000/demo` after setup

---

## Why Yohaku?

As AI agents scale from demos to production, teams get stuck on:

- **"Who approved this execution?"** — No record exists
- **"What data did the AI access?"** — No proof
- **"Can we stop it right now?"** — No kill switch
- **"How do we explain this to auditors?"** — No evidence trail
- **"What if it runs twice?"** — No idempotency

Yohaku solves all of this with one layer: **Plan → Approve → Confirm → Receipt**.

---

## How It Works

### 1. Plan
AI agent generates a structured execution plan (ActionSpec).

```json
{
  "actions": [
    { "action": "webhook.dispatch", "url": "https://your-endpoint.com" },
    { "action": "calendar.hold.create", "title": "Review call", "duration_minutes": 30 }
  ]
}
```

### 2. Approve
Human or policy authorizes the plan. TTL: 10 minutes.

```bash
POST /v1/approve
{
  "plan_id": "pl_xxx",
  "approval": { "lane": "review", "principal": { "type": "human" } }
}
```

Approval Lanes:
- **Auto** — policy-based, no human needed (low risk)
- **Review** — human approves (medium risk, default)
- **Gate** — double approval required (high risk)

### 3. Confirm
Execute with idempotency guarantee. No double execution, ever.

```bash
POST /v1/confirm
X-Idempotency-Key: your-unique-key

{
  "plan_id": "pl_xxx",
  "approve_id": "aprv_xxx"
}
```

### 4. Receipt
Signed, tamper-evident proof of everything that happened.

```json
{
  "receipt_id": "rcp_xxx",
  "status": "success",
  "approval_lane": "review",
  "principal_type": "human",
  "receipt_hash": "4ee918882f58f7e2...",
  "server_sig": "5a54a955e62d9d...",
  "evidence": {
    "decision_rationale": "Plan approved and executed.",
    "data_sources": [{ "type": "policy", "ref": "allowlist", "hash": "38d352b1..." }],
    "model_info": { "provider": "openai", "model": "gpt-4" }
  },
  "outcome": { "final_status": "success", "actions": [...] }
}
```

---

## Key Features

| Feature | What it does |
|---------|-------------|
| **Authorization-first** | Every execution requires an Authorization object. Human optional, accountability mandatory. |
| **Approval Lanes** | Auto / Review / Gate — balance speed and safety per risk level |
| **KYA (Know Your Agent)** | Track executor, principal, and delegation chain |
| **Evidence Pack** | Decision rationale + data source refs + model info (no raw data stored) |
| **Context Receipt** | Signed proof of what data the AI accessed, when, and with what permissions |
| **Truth-First** | Receipt hash + server signature — tamper-evident, audit-ready |
| **Freeze / Circuit Breaker** | Emergency stop at any level (global / tenant / connector / target) |
| **PROD Idempotency** | Fencing + crash recovery — no double execution, ever |
| **Shadow Mode** | Simulate execution before going live (Shadow → Canary → Live) |
| **Data-Minimization** | No raw docs, no PII — refs + hashes only |

---

## Who Is This For?

- ✅ **SRE / DevOps / Platform Engineers** — running automation in production and scared of incidents
- ✅ **CTOs of AI-native startups** — deploying agents and need accountability
- ✅ **Enterprise IT / Compliance teams** — auditors asking "who authorized this AI action?"
- ✅ **Webhook-heavy SaaS teams** — need signing + idempotency + audit trail

---

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL
- npm

### Setup

```bash
# Clone
git clone https://github.com/syohei0325/yohaku.git
cd yohaku

# Install
npm install

# Environment
cp .env.example .env.local
# Edit .env.local with your DATABASE_URL and secrets

# Database
npx prisma db push

# Start
npm run dev
```

### Try the Demo Flow

```bash
# Start demo environment
open http://localhost:3000/demo

# Or use curl:

# 1. Create a plan
curl -X POST http://localhost:3000/api/v1/plan \
  -H "Content-Type: application/json" \
  -d '{"tenant_id": "tenant_001", "actions": [{"action": "webhook.dispatch", "url": "https://your-endpoint.com"}]}'

# 2. Approve it
curl -X POST http://localhost:3000/api/v1/approve \
  -H "Content-Type: application/json" \
  -d '{"plan_id": "pl_xxx", "tenant_id": "tenant_001"}'

# 3. Confirm execution (idempotent)
curl -X POST http://localhost:3000/api/v1/confirm \
  -H "X-Idempotency-Key: unique-key-001" \
  -H "Content-Type: application/json" \
  -d '{"plan_id": "pl_xxx", "approve_id": "aprv_xxx"}'

# 4. View receipt
open http://localhost:3000/receipt/rcp_xxx
```

---

## Environment Variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/yohaku
WEBHOOK_SIGNING_SECRET=your-signing-secret
YOHAKU_SERVER_SECRET=your-server-secret
YOHAKU_PHASE=phase1
```

---

## API Reference

```
POST /v1/plan           Create execution plan
POST /v1/approve        Issue authorization (TTL: 10 min)
POST /v1/confirm        Execute with idempotency
GET  /v1/receipt/:id    Get signed receipt
GET  /v1/ledger/export  Export audit ledger
```

---

## Architecture

- **Framework**: Next.js 14 (App Router, Node.js runtime)
- **Database**: PostgreSQL + Prisma
- **Idempotency**: ConfirmRequest table + fencing token + 202 recovery
- **Webhook**: HMAC-SHA256 signing + retry + idempotency
- **Receipt**: SHA-256 hash + HMAC server signature

---

## Conformance Tests

```bash
npm run conformance        # Run all tests
npm run conformance:T01    # approve_ttl_10m
npm run conformance:T02    # confirm_requires_idempotency_key
npm run conformance:T03    # idempotency_conflict_returns_409
```

---

## Treaty (SLA Commitments)

| Metric | Threshold | Credit |
|--------|-----------|--------|
| misexec_pct | > 0.5%/week | 25% platform fee credit |
| misexec_pct | > 1.0%/week | 100% platform fee credit |
| ledger_integrity | < 99.9%/week | Full week billing voided |
| webhook_delivery | < 99.0%/week | 25% usage credit |

---

## Design Partners

We're looking for **3 design partners** (free for 60 days) who:
- Run automation or AI agents in production
- Need accountability, audit trail, or emergency stop
- Can give weekly feedback

**→ [Book a 15-min call](mailto:hello@yohaku.app)**

---

## License

MIT

---

*Human optional. Accountability mandatory.*
