# =========================================
# Cursor Pack – Yohaku
# FULL INTEGRATED MASTER / EXIT-FIRST / KYA-READY / CONTEXT-RECEIPT-READY / VALUATION LADDER
# (Gate1=¥10B(100億) → Gate2=¥150B(1500億) → Gate3=¥1T–¥2T(Notion級))
# M&A-READY / SHIP-RAILS
#
# vNext ✅10/10⁴ (2026-02-11)
#   + Slack Surface Strategy ✅
#   + Authorization-first（Approve=Authorizationの実装。Human optionalを“仕様化”）✅
#   + Approval Lanes（Auto/Review/Gate）✅
#   + Outcome Pack（結果/事故/上書き/停止の最小信号＝walled garden）✅
#   + No‑Switch Ops（Shadow→Canary→Live / Circuit Breaker）✅
#   + Truth‑First（Receipt署名/Policy理由/差分の型）✅
#   + Evidence‑First（判断の要点/参照元(ref+hash)/モデル情報）✅
#   + Data‑Minimization（raw doc/PIIを保持しない：参照ID+hashのみ）✅
#   + MCP‑Ready（context_refsを“参照として”受け取り、証跡に残す）✅
#   + PROD Idempotency（ConfirmRequest + Fencing(id+confirm_id) + 202詰み復旧）✅  ← misexecを構造で潰す
#   + NEW: Context Receipt（署名付きコンテキスト証明：何を見たか/どの権限かを監査可能にする）✅ ← C1 / BYO Context Provider
#
# We don’t sell “agents”. We sell “safe confirmation”.
# We don’t store “your data”. We store “proof that a responsible authorization happened”.
# Human optional. Accountability mandatory.
#
# 目的：この1ファイルをCursor/Claude Codeに渡せば、実装もGTMもブレずに “Exit-firstで勝つ”。
# =========================================



# =========================================
# Market Shift 2026（Agent fleets / last 80 miles / seat pricing death）
# =========================================
# 市場は「人間がAIを使う」から「エージェント艦隊を人間が管理する」へ移行する。
# 価値の中心は、モデル能力ではなく "最後の80マイル" に移る。
# Yohakuの役割は、各エージェントが安全に本番で動けるための OS 条件を提供すること。
#
# Core shift（2026年のパネル/Sierra/Dreamer/CapitalGの示唆）：
#   - single task management → fleet management（fleets of agents）
#   - seat-based pricing → outcome / usage pricing（/confirm課金が正解）
#   - demo agents → production agents（"作れる"より"本番で回せる"が価値）
#   - 厚いドメイン専門レイヤー + 安全・権限・プライバシーのOS が勝つ
#   - 規制産業での導入スピード = "最後の80マイル" を持つ者が勝つ
#
# Yohaku OS requirements（5つの境界）：
#   1. Permission boundary（何をやっていいか）
#   2. Execution boundary（どこから先がConfirmか）
#   3. Human override（どこで人が介入するか）
#   4. Audit boundary（何を証拠として残すか）
#   5. Recovery boundary（壊れた時どう戻すか）
#
# Fleet management concepts（言語をここに固定）：
#   - Fleet（agent群の単位）
#   - Mission / Workflow（業務単位）
#   - Policy Pack（fleet共通の権限制御）
#   - Fleet Freeze（群れごと止める）
#   - Fleet Health / Incident Rate（運用指標）
#   ※ いまの tenant / connector / target freeze はそのまま fleet management に読み替えられる
#
# Yohaku is the last 80 miles for agent production.
# Manage fleets, not just prompts.
# Human optional. Accountability mandatory.
#
# GTM言語（コピー固定）：
#   EN: "The last 80 miles for agent production."
#   JP: 「エージェントを"本番で回せる状態"にする最後の80マイル」
#
# Offer（phase1設計パートナー向け）：Yohaku Risk Desk（30 days）
#   - Receiver Starter Kit導入
#   - Policy Pack設計
#   - Shadow→Canary→Live運用レール
#   - Incident/Freeze Runbook
#   - Audit Bundle提出練習
#
# Distribution戦略（OpenClaw × Yohaku）：
#   - OpenClaw = 入口パック / distribution（OSS・話題・配布）
#   - Yohaku = OS / execution boundary / monetization（課金の本体）
#   - 絶対ルール：OpenClaw専用SaaSにしない。"Agent Fleet OSの最初の対応先"として扱う
#   - OpenClawが落ちても死なない（入口中立）
#
# ルール：Yohaku is not a prompt tool. It is a fleet operations boundary.
# =========================================


# =========================================
# Atlassian / Agent Ops Layer（2026 追記）
# =========================================
# 示唆：Atlassian CEO（2026 Q2 / Rovo 500万MAU / Teamwork Graph 1000億オブジェクト）
# 「AIを載せたか」ではなく「業務プロセスを握っているか」が価値の源泉
#
# Yohakuへの翻訳（5つ）：
#
# 1. ポジショニングを上げる
#    旧：safe confirmation API
#    新：Agent Ops Layer / change management for agents
#    → 承認・確認・エスカレーション・停止・監査提出を束ねる"実行プロセスのOS"
#    → Exit-first は正しいまま。言語を一段上げるだけ。
#
# 2. /confirm 課金をさらに正当化する
#    → seat-based pricing の崩壊 = /confirm usage 課金が時代に合う証拠
#    → lane（Auto/Review/Gate）× risk tier で価格差をつける
#    → 将来：Outcome/MTTR 改善に結びつく料金説明を乗せる
#
# 3. "既存ワークフローに差し込む"を徹底する
#    → 新しいUIを覚えさせない
#    → Slack Surface ✅ → 次: Jira / ServiceNow / Linear / 社内Webhookフロー
#    → 「今ある承認・運用の流れに、YohakuのReceiptとFreezeを差し込む」
#    → チャットアプリ化は避ける（Atlassianも別UIを主役にしていない）
#
# 4. "信頼ループ"をプロダクトの主役にする
#    → 「どれだけ賢いか」より「人間が怖がらず使えるか」が導入の論点
#    → 機能追加より "信頼ループを最小クリックで回すUI" を強化
#    → Approve画面の説明量 / Receiptの読みやすさ / Freezeの押しやすさ / Audit Bundleの提出しやすさ
#
# 5. Execution Graph として整理して前に出す
#    → 「どのagentが、誰の代理で、どのworkflowのどの時点で、何を見て、どう確定したか」
#    → KYA / Context Receipt / Outcome Pack / prev_hash chain = Execution Graphの最小版
#    → "logs" ではなく "Execution Graph" として見せると一段強くなる
#    → raw データは持たない（Data-Minimization）。関係性のグラフだけを持つ。
#
# やらないこと（Atlassianの示唆から）：
#    ✗ 別の"エージェントUI"を作る（チャットアプリ化）
#    ✗ System of Record を取りに行く（SoRの上で統制するレイヤーに徹する）
#    ✗ "AIを載せたSaaS"を増やす（"AI時代の責任インフラ"を押し出す）
#
# 一言：
#    System of Record ではなく System of Process / Agent Ops Layer を握る
# =========================================

# =========================================
# ActionSpec / Execution DSL（2026 追記）
# =========================================
# 示唆：MulmoScript / Karpathy "leash" / OpenClaw security minefield
# 「AIを直接実行させるな。AIに"実行脚本"を書かせろ。
#  Yohakuはその脚本を lint し、authorize し、execute し、receipt に残す。」
#
# Core concept：
#   自然言語は証拠にならない。DSL（ActionSpec）だけが実行可能。
#   AIは ActionSpec を生成する → Yohaku が lint / authorize / execute / audit する
#
# 実行フロー（内部）：
#   natural language / agent output
#   → compile to ActionSpec（/plan が返す正規化済み中間表現）
#   → policy lint（forbidden effects / budget / lane整合 / PII検出）
#   → approve（authz: human / policy / delegation）
#   → confirm（runtime: idempotent execution）
#   → receipt / outcome（compiled_spec_hash を含む）
#
# ActionSpec の最小スキーマ（phase1: Webhook + Calendar Hold のみ）：
#   {
#     "spec_version": "0.1",
#     "intent": "webhook.dispatch | calendar.hold.create",
#     "target": "<registered_url | ics>",
#     "summary": "<3行以内の人間向け要約>",
#     "params": { ... },
#     "risk": { "tier": "low|medium|high", "lane": "auto|review|gate" },
#     "budgets": {
#       "max_actions": 1,
#       "max_external_calls": 1,
#       "max_recipients": 0,
#       "allowed_domains": ["<registered>"]
#     },
#     "context_refs": [{"type": "...", "ref": "...", "hash": "sha256:..."}]
#   }
#
# Lint で見るもの（confirm 前に必ず通す）：
#   - 許可されていない action がないか（Phase Guard）
#   - registered target 以外に行こうとしていないか
#   - PII / raw doc を持ち出そうとしていないか
#   - lane と risk_tier が整合しているか
#   - budget を超えていないか（max_actions / max_external_calls）
#   - Context Receipt の scope が action に足りているか
#
# Receipt への追加（compiled_spec_hash）：
#   - 「最終的に実行された ActionSpec はこれ」を hash で固定
#   - "AIがその場で勝手に変えた"疑惑に強くなる
#   - Receipt = Context + Permission + Policy + ActionSpec + Outcome の完全な証跡
#
# Approve 画面の設計方針：
#   上：3行の要約（人間向け）
#   下：ActionSpec diff（正確な差分）
#   右：risk / lane / budgets / context_receipts
#   → "AIの気持ちを読む画面"ではなく"実行脚本の差分を確認する画面"
#
# Budgeted Autonomy（Karpathy "leash" の仕様化）：
#   ActionSpec に budget を持たせる → budget 超過は confirm 不可
#   → Auto lane も怖くなくなる（予算内なら自動実行、超えたら Gate）
#
# Conformance Tests（追加予定）：
#   T39_plan_compiles_to_canonical_actionspec
#   T40_confirm_requires_spec_hash_match
#   T41_forbidden_effects_rejected_by_lint
#   T42_budget_exceeded_returns_403
#
# ⚠️ やりすぎ注意：
#   - 一般DSLを作らない（Turing complete にしない）
#   - phase1は Webhook + Calendar Hold の2コネクタ専用の狭いDSLのみ
#   - 「設計で気持ちよくなる罠」に入らない
#   - 今必要なのは: AIが直接実行せず、structured spec に落としてから確定させる筋を通すこと
# =========================================



# =========================================
# Promptfoo買収（OpenAI）が示すYohakuの勝ち筋（2026 追記）
# =========================================
# 出来事：OpenAIがPromptfoo（Fortune 500の25%超が利用）を買収し、
#         Frontierプラットフォームに統合（自動レッドチーミング/エージェント評価/監視/追跡）
#
# 市場への示唆：
#   「安全・ガバナンス・監査・追跡」は"あったら良い機能"ではなく、
#   エンタープライズ導入の前提条件になった。
#   OpenAI Frontierが重視するのは：identity / permissions / boundaries / reporting / traceability
#
# Yohakuの住み分け（これを固定する）：
#   Promptfoo = pre-deploy security（出荷前に危険を見つける）
#   Yohaku    = runtime trust control（本番で危険を実行させない）
#   → 競合ではなく層が違う。Promptfooの結果を入力として食える設計にするだけでいい。
#
# やってはいけないこと：
#   ✗ 汎用AIセキュリティスキャナを作る（OpenAIが内製していく）
#   ✗ 汎用evals基盤を作る（吸収されやすい）
#   ✗ 汎用guardrails UIを作る（同上）
#   → そこはPromptfoo/Frontier側の領域。Yohakuは runtime boundary に徹する。
#
# Yohakuが取るべき5つのruntime boundary：
#   1. 実行前の境界：ActionSpec lint → approve → confirm（自然言語をそのまま実行しない）
#   2. 実行時の境界：Receipt / Ledger / Context Receipt / Outcome Pack（誰が/何を/どの権限で/どうなったか）
#   3. 異常時の境界：Freeze / Circuit Breaker（「いま止める」を持つ）
#   4. 冪等と復旧の境界：ConfirmRequest + fencing + 202復旧（本番運用の信頼）
#   5. 監査提出の境界：Audit Bundle（「説明できる」を提出物まで落とす）
#
# 追加すべき概念（実装は後回しでいい。設計に入れておく）：
#   security_signals[]（外部セキュリティ評価の結果を入力として受け取る）
#     例: prompt_injection_suspected / data_exfil_risk / jailbreak_detected / mcp_proxy_violation
#   lint_results のカテゴリ追加：
#     prompt_injection_risk / tool_misuse / out_of_policy_agent_behavior / data_leak_risk
#   Audit Bundle に security_provenance を追加：
#     「この実行はどの security signal を前提に許可/拒否されたか」を残す
#
# OpenClaw との関係：
#   OpenClaw = 入口パック（distribution）
#   Yohaku   = runtime boundary（外部副作用は全部 /confirm に流す）
#   "OpenClaw用セキュリティ製品"にしない。入口として使うだけ。
#
# 一言：
#   Promptfooが「出荷前に危険を見つける」なら、Yohakuは「本番で危険を実行させない」。
# =========================================



# =========================================
# North Star（矛盾ゼロ：Gate1→Gate2→Gate3の“増やし方”を最初から固定）
# =========================================
# ※表記ルール（外部でも誤解されないために固定）：
#   - ¥10B = 100億円（10 billion JPY）
#   - ¥150B = 1500億円
#   - ¥1T = 1兆円
#
# Gate1 / Gate2 / Gate3 は「機能の追加」で上がらない。
# 上がるのは
#   ①/confirm の流量
#   ②規格（Conformance+Treaty+KYA）が外部循環
#   ③中立（Provider Neutral）
#   ④“Slack/Chatに貼って成立する”導線
#   ⑤No‑Switch運用（Shadow→Canary→Live + Circuit Breaker）で“本番”に入れること
#   ⑥Evidence（要点 + 参照元(ref+hash) + モデル情報）で“説明できる実行”になること
#   ⑥.5 Context Receipt（署名付きコンテキスト証明：何を見たか/どの権限か）で“監査の決定打”になること  ← NEW
#   ⑦Authorization-first（人間クリック前提を捨てる。Human/Policy/Delegationのいずれでも「責任」を残す）
#   ⑧Approval Lanes（Auto/Review/Gate）で “速度” と “責任” を両立すること
#   ⑨Outcome Pack（結果/事故/停止/上書きの最小信号）が溜まり、改善と監査が回ること（=堀）
#   ⑩PROD Idempotency（tenant×idempotency_key + T03(409) + fencing + 202復旧）でmisexecを構造で潰すこと
#
#   - Gate1（¥10B / 100億円 / 独立が成立する最低ライン）:
#       - 目標：Valuation >= ¥10B（=100億円+）
#       - 目安：ARR ¥0.7B〜¥1.0B（7〜10億円） × 10〜15x
#       - 到達の意味：プロダクトが“事業”になり、買収が来ても断れる土台ができる
#
#   - Gate2（¥150B / 1500億円 / ユニコーン級＝標準化が現実になるライン）:
#       - 目標：Valuation >= ¥150B（=1,500億円+）
#       - 目安：ARR ¥7.5B〜¥10B（75〜100億円） × 15〜20x（勝者multiple前提）
#       - 到達の意味：/confirmが“業界の当たり前”に寄り、Compatibleが外部で回り始める
#
#   - Gate3（¥1T〜¥2T / 1兆〜2兆円 / Notion級＝産業のOSを書き換えるライン）:
#       - 目標：Valuation >= ¥1T〜¥2T（=1兆〜2兆円）
#       - 目安：ARR ¥50B〜¥120B（500〜1,200億円） × 15〜25x（標準化×高NRR×高成長）
#       - 到達の意味：Exit（ConfirmOS）が“中立インフラ”として埋め込まれ続ける
#
# 原理（1行）：
#   /confirm（確定）の“流量” × “規格（Conformance+Treaty+KYA）” × “中立（Provider Neutral）”
#   × “Slack/Chatに貼って成立” × “No‑Switch運用（Shadow/Canary/Circuit Breaker）”
#   × “Truth‑First（Receipt署名/Policy理由/差分の型）”
#   × “Evidence‑First（要点/参照元/モデル情報）”
#   × “Context Receipt（署名付きコンテキスト証明）”
#   × “Authorization-first（Human/Policy/Delegationのどれでも責任を残す）”
#   × “Approval Lanes（Auto/Review/Gate）”
#   × “Outcome Pack（結果/事故/停止/上書きが溜まる）”
#   × “PROD Idempotency（ConfirmRequest + Fencing + 202復旧）”
#
# 重要（phase1のルール）：
#   - Phase1（0–6m）は Gate1 の最短ルートに全振り（Webhook + Calendar Hold固定）
#   - Gate2/3は phase2/3 で段階解禁（phase1で増やすほど死ぬ）
# =========================================


# =========================================
# 目的（ズレたら負け）
# =========================================
# - 「AIエージェントの出口（ConfirmOS）」を握る：
#     安全に“確定（Confirm）”できる実行レイヤーを標準化する
# - 0–6mは “電話でPMF” ではなく “ExitレイヤーでPMF” を最短で取る
# - phase1は “低リスクなデジタルアクション2本（Webhook + Calendar Hold）” に絞り、速度と信頼を最大化する
# - “勝手に増える” を作る：Team Viral（承認リンク/結果リンク）＋ Receiver Starter Kit（導入テンプレ）＋ Compatible badge
# - 2026の前提（産業のOS書き換え文脈）：
#     AIは「答える」→「実行する」。その世界では“権限設計/監査/停止/KYA”が必須インフラになる
# - Satya型（バックグラウンドAI）が一般化するほど：
#     承認は “消える” のではなく “Authorizationとして設計される”
#     → Humanクリックは例外処理になる（Auto/Review/Gateで分岐）
# - Responsible AI（運用と統制が本丸）：
#     「判断をログ化し、追跡可能にする」＝守りではなく“攻めの生産性”になる
# - Evidence‑First（説明できる実行）：
#     「何をした？」だけでなく「なぜ許された？」「どの参照を見た？」「どのモデルで決まった？」を最小で残す
# - NEW: Context Receipt（監査の決定打）：
#     「どの参照を“いつ/どの権限で”見たか」を署名で証明する（rawは持たない）
#     → BYO Context Provider（顧客のMCP/内製）発行の署名を検証して残す（phase1は取得/同期をSEALED）
# - Data‑Minimization（地雷を踏まない）：
#     raw doc/PII/営業秘密を“集めない設計”に寄せる（参照ID+hashのみを証跡として保存）
# - Outcome Pack（堀の正体）：
#     “ログがある” だけだと弱い。結果/事故/停止/上書きの最小信号が溜まると、改善と監査が回って真似しにくい
# - No‑Switch前提（止められない加速）：
#     「止める」ではなく「安全に入れる」＝ Shadow→Canary→Live + Circuit Breaker を“商品”として持つ
# - PROD Idempotency（misexecを構造で潰す）：
#     並列/クラッシュ/再送/タイムアウトが“普通”の世界で、二重実行しない設計が価値になる
# - “bits→atoms（現場/供給網/エネルギー）”が近づくほど事故コストが跳ねる：
#     だから Exit（確定/責任/停止/真実/証拠/結果）を握る価値が増す
# - Fleet OS（2026の言語アップデート）：
#     「1件のConfirm」ではなく「エージェント艦隊の安全な本番運用」を売る
#     旧：この実行を安全に確認する
#     新：エージェント艦隊を安全に運用する（Fleet Freeze / Policy Pack / Fleet Health）
# - "最後の80マイル"が主商品：
#     エージェントを作るのは簡単。規制産業で安全に本番導入するのが最後の80マイル
#     Shadow→Canary→Live / Review/Gate / Freeze / Audit Bundle / Idempotency / Context Receipt
#     これら全部がすでに実装済み。売り方だけがまだ弱い。
# - Wedge（最初の導入領域を絞る）：
#     IT運用 / 社内自動化 / SupportOps / RevOps が最初のwedge
#     "どこでも使える"は正しいが売る時に弱い。厚い専門レイヤーは最初の領域を絞ることで作る
#
# このファイルの読み方（最重要）
# 1) Phase1 Focus Rules と SEALED を守る（ここに違反する実装は禁止）
# 2) Authorization-first + Approval Lanes（Auto/Review/Gate）を崩さない（Human optional / Accountability mandatory）
# 3) ConfirmOS（approve/authz/confirm/idempotency/ledger/undo/gate/KYA/Truth/Evidence/Outcome/ContextReceipt）を最優先で堅くする
# 4) Conformance Suite + Treaty v0 を “実装物” として完成させる（椅子取り開始）
# 5) 30日スコアカードを毎週見て、勝ち筋だけに集中する（増やさない）
# 6) Gate1→Gate2→Gate3の順で、拡張の順番を間違えない
# =========================================


# =========================================
# 用語（ブレ防止）
# =========================================
# - “Exit” = 実行の責任・監査・可逆性・停止を提供する層（ConfirmOS）
# - “SEALED” = phase1で「DB/ログ/スタブはOK」だが「本番で実行されるパスは禁止」な機能群
# - “Phase Switch” = YOHAKU_PHASE で実行可能機能を強制（文章ではなくガードで縛る）
# - “KYA” = Know Your Agent：実行主体（agent）/代理（principal）/委任（delegation）を追跡可能にする
# - “Dynamic Agent Layer” = UIではなくエージェントが業務を進める層（入口）。Yohakuは中立のExitとして埋め込まれる
# - “Slack Surface” = 会話と合意形成の場（Slack/Email/Chat）に、Authorization/Receiptが貼られて成立する状態
# - “No‑Switch Ops” = 止められない加速を前提に、Shadow→Canary→Live + Circuit Breaker で安全に本番導入する運用モデル
# - “Truth‑First” = 監査に耐える“真実の出力”をプロダクト原則に固定（Receipt署名/Policy理由/差分の型）
# - “Evidence‑First” = 説明できる実行を成立させる最小の証拠パック
#     - decision_rationale（判断の要点：短文）
#     - data_sources（参照元：ref+hash+typeのみ。中身は持たない）
#     - model_info（provider/model/mode/version）
#     - context_refs（外部データ参照：ref+hash）
#     - context_receipts（署名付きコンテキスト証明：ref+hash+sig。raw無し）  ← NEW
# - “Data‑Minimization” = raw doc/PII/営業秘密を“保持しない”設計（参照ID+hashのみ）
# - “Context Ref” = 外部データ参照の識別子（MCP resource id / doc id / ticket id 等）
# - “Context Receipt” = 署名付きコンテキスト証明（何を見たか/どの権限か/いつ を hash+sig で固定。rawは持たない）  ← NEW
# - “Context Provider” = Context Receipt を発行する側（顧客のMCP server / 内製service 等）。Yohakuは検証・証跡化のみ。
# - “Idempotency” = tenant_id × idempotency_key で同一リクエストを同一結果に固定する軸（違いはT03で409）
# - “ConfirmRequest” = Idempotency lock + request_hash + response cache + 状態遷移（started→side_effects_started→completed）を持つ行
# - “Fencing” = 副作用直前に row id + confirm_id で「正当な実行者」かを確認するガード（ABA防止）
# - “ABA” = stale delete → recreate で古いプロセスが新しい行を奪う問題（idで縛って潰す）
# - “202 Recovery” = side_effects_startedで落ちても Receipt(tenant×confirm_id) で復旧して200を返す（202永久詰み防止）
#
# NEW: Authorization-first（Approve = Authorizationの実装）
# - “Authorization（AuthZ）” = 「誰/何が、何を、なぜ許可したか」の記録。/confirm は AuthZ を必須にする。
# - 実装名は /approve（approve_id）でもOK。外部説明は “Authorization object” と呼ぶ（Humanクリック前提を消す）。
# - 全レーン共通：Receipt/ledgerに “誰が・誰の代理で・何を・なぜ許したか” を残す（Accountability mandatory）
#
# NEW: Outcome Pack（堀の正体）
# - Outcome Pack = 実行の最終結果と、事故/停止/上書きの最小信号（rawデータ無し）
# - 目的：
#     1) 監査：結果まで追える（“判断した”で終わらない）
#     2) 運用：MTTR短縮（原因・停止・復旧が回る）
#     3) 改善：失敗/上書き/事故の信号が溜まる（walled garden）
#
# NEW: Context Receipt（監査の決定打）
# - Context Receipt = 「どの参照を、いつ、どの権限で見たか」を署名で固定する証明
# - Yohakuは “取得/同期” はしない（phase1 SEALED）。受け取って検証し、receipt/ledgerに残すだけ。
# - raw doc/全文ログは保持しない（hash+sig+refのみ）
#
# Approval Lanes（Auto / Review / Gate）
# - Lane = 「誰/何が最終確定したか」の型。execution_mode（shadow/canary/live）とは別軸。
# - phase1は “Reviewが既定” だが、Autoを小さく回せる設計が本命（Human optionalの現実化）。
#
# Auto（policy-approved / 人間ゼロで回す）
# - 目的：速度。バックグラウンドAI（朝投げて夜チェック）を成立させる。
# - 条件：phase1は “低リスク + registered target + reversible + idempotent” が揃ったら Auto OK。
# - 実装：/approve は必須（=AuthZ作成）。principal_type=policy / approved_via=policy。
# - 出力：approval_lane=auto / principal_type=policy / policy_ref必須
# - Slack：原則 “結果メッセージのみ”
#
# Review（human-in-the-loop / phase1の主戦場）
# - 目的：中リスクを人が高速にさばく（Approve=1枚完結/2クリック）。
# - 出力：approval_lane=review / principal_type=human / principal_user_id(or email_hash)必須
# - Slack：2メッセージ（依頼→結果）
#
# Gate（two-person / step-up / breakglass / 高リスク）
# - 目的：不可逆・高リスクを “絶対に事故らない形” に閉じる。
# - 出力：approval_lane=gate / required_approvals>=2 / policy_ref（なぜGateか）必須
# - phase1：不可逆は実行禁止（Gate判定されたら 403/NotAllowed が正解）
# =========================================


# =========================================
# Slack思想（phase1で“入れるべき”のはこれだけ）
# =========================================
# Slackを作らない。Slackを勝ち筋のSurfaceにする。
#
# - Slack/Email/Chat = Dynamic Layer（会話と合意形成）
# - Yohaku = Confirm Layer（Authorization/Receipt/Freeze）
# - Thread = 1タスク = 1 approve_id（仕事の単位を固定）
#
# 2メッセージルール（ノイズを殺して速度を出す）
# - Review/Gate:
#   - Message #1（依頼）：Approveリンク + 要点3行 + Riskバッジ + TTL
#   - Message #2（結果）：Succeeded/Failed + Receiptリンク + Freeze導線（必要なら）
# - Auto:
#   - Message #2（結果）だけ（デフォルト）
#
# Copy to Slack（標準テンプレ / チャンネルを荒らさない）
# - Message #1（依頼 / threadの親）※Review/Gateのみ
#   [Yohaku Approve] {plan.summary}
#   Lane: {approval_lane} | Risk: {risk_badges} | TTL: {ttl}
#   Target: {target_domain} | Idempotency: {idempotency_key}
#   Approve → {approve_url}
#
# - Message #2（結果 / 同thread返信）※全レーン
#   [Yohaku Result] {status} | Attempts: {attempts}
#   Receipt → {receipt_url}
#   Jobs → {jobs_url}
#   If incident: Freeze → {freeze_url}
#
# - Auto結果（thread無しでもOK）
#   [Yohaku Auto Result] {status}
#   Policy: {policy_ref} | Risk: {risk_tier}
#   Receipt → {receipt_url}
#   Jobs → {jobs_url}
#   If incident: Freeze → {freeze_url}
#
# RULE: retry/logはSlackに出さない（Jobs/Receiptに閉じる）
# RULE: “Authorization-first” を守る（Approveは人間クリックの同義語ではない）
# =========================================


# =========================================
# Responsible AI / Evidence Logging（phase1で“入れる”のはこれだけ）
# =========================================
# AIの企業導入は「モデル精度」より「運用と統制（ガバナンス）」が本丸になる。
# Yohakuの立ち位置：モデルを売らない。実行の責任（説明/監査/停止/結果）を売る。
#
# Phase1 Evidence‑First のルール（最小で強い）
# 1) Receipt と ledger は「真実（Truth）」＋「証拠（Evidence）」＋「承認の型（Lane）」＋「結果（Outcome）」を出す
#    - Truth: receipt_hash/server_sig + policy_ref/risk_tier + diffの型
#    - Evidence: decision_rationale + data_sources(ref+hash) + model_info + context_refs + context_receipts（署名検証済み）  ← NEW
#    - Lane: approval_lane(auto|review|gate) + principal_type(policy|human)
#    - Outcome: outcome_pack（最終status/事故/停止/上書きの最小信号。raw無し）
# 2) “中身”は持たない（Data‑Minimization）
#    - raw doc、PII、営業秘密、全文ログを保持しない（参照だけ残す）
# 3) Chain-of-thoughtは保存しない（禁止）
#    - rationale は「短い要点」に固定（400文字上限など）
# 4) 参照元は ref + hash + type だけ
#    - data_sources[] = { type, ref, hash, redaction }（contentは絶対に持たない）
# 5) MCP‑Ready（context_refs）
#    - phase1は context_refs を受け取り、receipt/ledgerに保存するだけ（取得・同期はSEALED）
# 5.5) NEW: Context Receipt（context_receipts）
#    - phase1は context_receipts を受け取り、署名検証して receipt/ledger に保存するだけ（取得・同期はSEALED）
#    - 署名検証のため issuer registry（公開鍵）を tenant ごとに持つ
# 6) Outcome Pack（重要）
#    - webhook/jobの最終結果（2xx/4xx/5xx/timeout/attempts/latency）など“数字と状態”は持つ
#    - response body/顧客データは持たない（response_hashはOK）
# 7) PROD Idempotency（重要）
#    - 同一 idempotency_key は同一結果（receipt/job）に固定（課金も二重にしない）
#    - 入力が違うのに同じ idempotency_key は 409（T03）
#    - 202永久詰みは復旧可能にする（Receipt.confirm_id）
#
# なぜ必要か（プロダクトとしての勝ち筋）
# - 監査/苦情/復旧/改善が回る＝“ログは守りではなく攻めの生産性”
# - データ争奪戦が来ても、余白は「集めない設計」で地雷を避ける（スクラビング依存を減らす）
# - “Outcomeの信号”が溜まると、運用改善が複利で回り、真似しにくい（walled garden）
# - Idempotencyが堅いほど “本番実行” の心理障壁が下がる（導入が速くなる）
# - Context Receiptがあると「何を見たか/どの権限か」を監査で一撃で説明でき、導入摩擦がさらに下がる  ← NEW
#
# UIに落とす（phase1の最小）
# - Approve Page（Review/Gate）：Risk + “Evidence summary（3行）” を出す（長文禁止）
# - Receipt Page（全レーン）：Evidence Pack + Policy理由 + KYA + Lane + Status + Outcome Pack + Context Receipt（ある場合）
# - Export：Audit Bundle（zip/json）で「提出」できる（中身はref+hash + outcomeの最小信号 + context_receipt(sig)）
# =========================================


# =========================================
# Outcome Pack（NEW：堀を“仕様化”）
# =========================================
# 目的：
# - 「判断した」だけでなく「結果どうだった？」まで追えるようにする（監査・運用・改善）
# - raw doc/PII/成果物本文を持たず、数値/状態/参照IDだけで成立させる（Data‑Minimization）
#
# Outcome Pack（phase1 最小スキーマ）
# outcome_pack = {
#   "final_status": "succeeded|failed|partial|simulated|queued",
#   "completed_at": "<iso8601|null>",
#   "duration_ms": <number|null>,
#   "actions": [
#     {
#       "action":"webhook.dispatch|calendar.hold.create",
#       "status":"ok|queued|succeeded|failed|simulated",
#       "attempts": <number|null>,
#       "latency_ms": <number|null>,
#       "http_status": <number|null>,              # webhookのみ
#       "error_code":"timeout|4xx|5xx|sig_mismatch|skew|frozen|policy_denied|unknown|null",
#       "error_hash":"sha256:...|null",            # 生ログは持たない。ハッシュのみ可
#       "response_hash":"sha256:...|null"          # response bodyは持たない。ハッシュのみ可
#     }
#   ],
#   "incident": {
#     "flag": <bool>,
#     "severity":"low|med|high|null",
#     "reason_short":"<=140 chars|null",           # 140文字程度。長文禁止
#     "incident_ref":"ticket://...|pager://...|null", # 参照のみ
#     "freeze_rule_id":"frz_...|null"
#   },
#   "overrides": [
#     {
#       "type":"manual_retry|manual_freeze|manual_override|rollback",
#       "by_principal_type":"human|policy",
#       "by_principal_ref":"user_id|policy_ref",
#       "reason_short":"<=140 chars",
#       "at":"<iso8601>"
#     }
#   ]
# }
#
# 生成ルール（phase1）
# - /confirm 時点：final_status=queued or simulated（shadow）
# - webhook_jobs が succeeded/failed に収束：Outcome Packを更新（Receiptのstatusも更新）
# - Freeze（手動/自動）：incident.flag=true と freeze_rule_id をセット
# - 手動で「incident扱い」にしたい時：
#   - Receipt UI or APIで outcome_feedback を送れる（後述。中身は短文・参照のみ）
#
# 重要：Outcome Packは “責任の堀”。
# - rawデータは要らない
# - “結果/事故/停止/上書き” の信号だけで十分
# - これが溜まると、運用改善が複利で回り、真似しにくくなる
# =========================================


# =========================================
# PROD Idempotency（NEW：misexecを構造で潰す）
# =========================================
# 目的（これが“本番の怖さ”を消す）
# - 同一 idempotency_key（tenant内）は “完全に同一の結果” を返す（receipt_id / job_id を固定）
# - 入力が違うのに同じ idempotency_key は 409（T03: IDEMPOTENCY_CONFLICT）
# - 並列リクエストでも副作用は1回だけ（DB制約 + lock）
# - started/side_effects_started でクラッシュしても 202永久詰みにならない（Receipt.confirm_idで復旧）
# - ABA問題（stale delete → recreateで古いプロセスが新しい行を奪う）をFencingで潰す
#
# 中核：ConfirmRequest（tenant_id × idempotency_key のロック行）
# - idempotency_key は外部入力（冪等性の軸）
# - confirm_id は内部生成ID（監査/追跡/復旧の軸、NOT NULL）
# - request_hash は安定入力のhash（T03判定用）
#   推奨：plan_id + approve_id + execution_mode + context_refs_digest + context_receipts_digest（ソートしてdigest）  ← NEW
# - status：started → side_effects_started → completed（or failed）
# - response_json：completed時点のレスポンスを丸ごとキャッシュ（refs_only前提）
# - receipt_id：復旧用（completed時点で必須）
# - expires_at：24h
# - updated_at：stale検知用
#
# Fencing（副作用直前のガード：最重要）
# - 副作用（webhook_jobs作成/ledger追記）の直前に、
#   ConfirmRequest の status を started→side_effects_started に遷移させる
# - 条件は tenant+key ではなく “row id + confirm_id” で縛る（ABA完全対策）
# - updateMany(where: {id, confirm_id, status:'started'}) の count==1 のときだけ副作用へ進む
# - count!=1 なら 202（自分は正当な実行者じゃない）
#
# stale delete（安全版）
# - stale判定対象：started と side_effects_started の両方
# - delete許可条件：副作用ゼロ証明が通った時だけ
#   - webhook_jobs / ledger_events が0件
# - 副作用ありなら delete禁止（202 or 復旧）
#
# 202詰み復旧（最重要）
# - Receipt に confirm_id を保存し、tenant_id × confirm_id を unique
# - side_effects_startedで落ちて response_json/receipt_id が空でも：
#   - confirm_id で Receipt が引けたら復旧して200を返す（必要ならConfirmRequestをcompletedに直す）
#   - Receiptが無ければ本当に処理中 → 202
#
# phase1前提（DB uniqueと矛盾させない）
# - webhook_jobs に @@unique([tenantId, idempotencyKey]) を置くなら：
#   - phase1は webhook.dispatch 最大1本 をPolicyで強制する（Plan検証で400）
#   - 将来複数webhookを解禁するなら uniqueを (tenant,idempotency,action_key) に拡張する
# =========================================


# =========================================
# Phase Switch（実装で必ず使う）
# =========================================
# - YOHAKU_PHASE = phase1 | phase1_5 | phase2 | phase3
#   - phase1   : 0–6m（Exit-first / Webhook+CalendarHold固定 / Private β / Conformance+Treaty v0 / 低リスクのみ）
#   - phase1_5 : 6–12m（Private β拡張 / 追加コネクタ最小 / Slack App任意 / Auto lane本格運用 / outcome_feedback強化）
#   - phase2   : 12–24m（β / 招待制 / Enterprise要件の一部解禁 / Conformance公開 / Yohaku-Compatible開始 / Gate強化）
#   - phase3   : 24–36m（GA / Enterprise / SLA 99.9% / Marketplace解禁）
#
# SEALED強制（必須）
# - phase1 では以下のAPI/機能は必ず 403/NotImplemented を返す（実装しても実行不可）
#   - Phone（/api/call.* / call.place 実行） ※設計・スタブのみ
#   - Proactive/Nudge 実行（/api/nudges/*）
#   - Relationship Graph 実行（/api/relationship/*）
#   - External Memory import/sync（Drive/Notion/Email）
#   - OS Deep Integrations 実行（Shortcuts/Extensions）
#   - Marketplace / Connector SDK 一般公開
#   - Public /v1/* の一般公開（Private β専用の認証なしで露出させない）
#   - MCP server / data sync（phase1は context_refs保存のみ）
#   - Context Capture（Yohakuが外部SaaSへ取りに行く取得/同期）  ← NEW（phase1 SEALED）
# - CI/Lint で "SEALED_EXECUTION" タグが production build に入ったら fail
#
# NOTE（No‑Switch Ops）
# - phase1でも “Shadow（Dry‑run）” は許可しうる（外部実行なし / 監査の練習 / 本番移行の摩擦を下げる）
# - ただし phase1の “Live実行” はコネクタ2本固定（Webhook + CalendarHold）を絶対に崩さない
# - Context Receipt（署名検証/保存）は phase1で許可（取得/同期はSEALED）  ← NEW
# =========================================


# =========================================
# Valuation Ladder STRATEGY（Gate1=¥10B(100億) / Gate2=¥150B(1500億) / Gate3=¥1T–¥2T(Notion級)）
# =========================================
# 重要：M&Aが来ても断れる会社は「標準化で勝ってる」会社だけ。
# “買われるための会社” は買われなかった瞬間に終わる。
#
# ルール（最重要）
# - phase1は Gate1 に全振り（2本固定）。Gate2/3を狙うほど、phase1で増やすと死ぬ。
# - Gate2/3は “機能の追加” ではなく “規格の外部循環（Conformance+Treaty+KYA+ContextReceipt）” と “流量の増加（/confirm）” が本体。  ← NEW
# - Authorization-first + Auto/Review/Gate が成立するほど “Human optional” が現実になる（→ /confirm流量が伸びる）。
# - Outcome Packが回り始めるほど、運用改善が複利で回る（→ NRR/継続が上がる）。
# - PROD Idempotencyが堅いほど、本番実行の心理障壁が下がり導入が速くなる（→ /confirm流量が伸びる）。
# - Context Receiptがあるほど、監査/責任説明が一撃で通り導入が速くなる（→ /confirm流量が伸びる）。  ← NEW
# =========================================


# =========================================
# 10/10³化（Gate1→Gate2→Gate3 & 断れるM&Aのための追加10点）
# =========================================
# 1) Gate1/2/3 Gate（ARR/NRR/GM/Trust/SLO）を明文化（評価軸を固定）
# 2) “M&Aが来ても断れる” 条件（独立スケールの方程式）を明文化
# 3) Pricing Ladder（小→中→大）を追加：MRR 8,000万円級までの道筋を固定（Gate1）
# 4) “Enterpriseに行ける設計”をSEALEDで保持（SAML/SCIM/RBAC/Region/SOC2）
# 5) Multi‑planner / Provider Neutral（OpenAI依存を断つ）を“仕様”に格上げ
# 6) Standard Flywheel（Compatible badge → Treaty → Audit/Receipt）を配布の主軸に格上げ
# 7) Expansion Engine（同一tenant内で agent数・action数が増える）をKPI化
# 8) Data Room Ready（買収・調達に強い指標/ログ/契約）を最初から整備
# 9) “Giant’s Perimeter” 戦略（巨人の周辺を顧客にする）をGTMに固定
# 10) Funding Rails（薄めても勝つ / 薄めずに勝つ の分岐条件）を固定
#
# 追加（Slack Surfaceで速度の壁を突破）
# - “Approve/ReceiptをSlackに貼って成立” を設計の前提にする
# - 2メッセージルールをプロダクト・テンプレ・デモに固定する（Review/Gate）
# - Autoは結果だけ（ノイズを増やさない）
#
# 追加（Authorization-first：Human前提の誤解を消す）
# - “Approve = Humanクリック” ではない。Approveは Authorization object の実装。
# - principal_type（human|policy）と policy_ref / principal_user_id を必須で刻む
#
# 追加（Outcome Pack：データ堀を“最小信号”で作る）
# - Receipt/ledgerに outcome_pack を持つ（欠損=fail へ段階移行）
# - incident_flag / freeze / overrides を最小で残す（長文禁止、参照のみ）
#
# 追加（PROD Idempotency：misexecを構造で潰す）
# - ConfirmRequestでtenant×idempotency_keyを握り、T03(409)を厳密に
# - Fencing(id+confirm_id)でABAを潰す
# - Receipt.confirm_idで202詰み復旧
#
# 追加（NEW：Context Receipt）
# - “何を見たか/どの権限か” を署名で固定（context_receipts）
# - Yohakuは取得/同期しない（phase1は検証・証跡化のみ）
# - 監査で一撃で通る＝導入摩擦が下がる（/confirm流量が伸びる）
# =========================================


# =========================================
# 10/10³ FINALIZATION ADDENDUM（phase1で必ず守る：未確定のまま実装しない）
# =========================================

## A) ENV / 実運用パラメータ（あなたの環境で差し替え）
- YOHAKU_APP_ORIGIN= https://yohaku.app
- YOHAKU_API_ORIGIN= https://api.yohaku.app
- YOHAKU_STATUS_ORIGIN= https://status.yohaku.app
- DEFAULT_TZ= Asia/Tokyo
- YOHAKU_PHASE= phase1

## A-1) Authorization / Approval Lanes（Human optionalを“仕様化”）
- APPROVAL_LANES_ENABLED= true
- AUTHORIZATION_REQUIRED_FOR_CONFIRM= true          # /confirmは常にAuthZ必須（policy/humanどちらでも可）
- DEFAULT_APPROVAL_LANE_PHASE1= "review"           # phase1の既定（設計パートナーは安心優先）
- AUTO_APPROVAL_ALLOWED_PHASE1= true               # ただし条件厳格（low risk + registered target + reversible + idempotent）
- GATE_LANE_EXECUTION_ALLOWED_PHASE1= false        # phase1は不可逆禁止（Gate判定は403が正解）
- APPROVAL_LANE_MUST_BE_RECORDED= true             # receipt/ledgerに欠損したらfail
- PRINCIPAL_MUST_BE_RECORDED= true                 # principal_type + principal_ref（user_id or policy_ref）欠損=fail

## A-2) Evidence / Data Minimization（phase1：最小で強い）
- EVIDENCE_LOGGING_ENABLED= true
- EVIDENCE_RATIONALE_MAX_CHARS= 400               # chain-of-thought防止（短く固定）
- DATA_SOURCE_REFS_ONLY= true                     # contentを保存しない（ref+hashのみ）
- CONTEXT_REFS_ACCEPTED= true                     # MCP-ready：保存のみ（同期はSEALED）
- CONTEXT_REFS_STORE_MODE= "refs_only"
- AUDIT_BUNDLE_ENABLED= true                      # 提出用エクスポート（zip/json）
- AUDIT_BUNDLE_INCLUDES_RAW_SOURCE_DATA= false    # raw doc/PIIは絶対に入れない

## A-2.5) NEW: Context Receipt（署名付きコンテキスト証明）
- CONTEXT_RECEIPTS_ACCEPTED= true                 # 受け取り可（任意）
- CONTEXT_RECEIPTS_VERIFY_REQUIRED= true           # 署名検証NGは400（監査の真実）
- CONTEXT_RECEIPTS_STORE_MODE= "refs_only+sig"     # raw無し（hash+sig+refのみ）
- CONTEXT_RECEIPT_ISSUER_REGISTRY_REQUIRED= true   # issuer registry（公開鍵）登録必須

## A-3) Outcome Pack（NEW）
- OUTCOME_PACK_ENABLED= true
- OUTCOME_PACK_REFS_ONLY= true                    # error_hash/response_hash/incident_refのみ。本文禁止
- OUTCOME_REASON_MAX_CHARS= 140                   # incident/override理由は短文固定（長文禁止）
- OUTCOME_PACK_MUST_BE_RECORDED= false            # phase1は段階導入。最終的にtrueへ（phase1_5目標）
- INCIDENT_FLAGGING_ENABLED= true                 # UI/APIで「incident扱い」を付与可能（短文 + refのみ）

## A-4) PROD Idempotency（NEW）
- IDEMPOTENCY_TTL_HOURS= 24
- IDEMPOTENCY_STALE_SECONDS= 60                   # started/side_effects_startedのstale判定閾値（目安）
- IDEMPOTENCY_IN_PROGRESS_HTTP_STATUS= 202         # in-progressは202（復旧できるなら200へ）
- IDEMPOTENCY_REQUEST_HASH_INCLUDES_CONTEXT_REFS= true  # T03を厳密にする（digest化して入れる）
- IDEMPOTENCY_REQUEST_HASH_INCLUDES_CONTEXT_RECEIPTS= true # NEW: ContextReceiptもdigest化して入れる
- IDEMPOTENCY_FENCING_ENABLED= true                # row id + confirm_id でfencing（ABA防止）
- IDEMPOTENCY_RECOVERY_VIA_RECEIPT_CONFIRM_ID= true# 202詰み復旧（Receipt.confirm_id）

## B) Phase1 Connector Allowlist（phase1は2本固定）
- CONNECTOR_ALLOWLIST_PHASE1= ["webhook", "calendar_hold"]
- Any other connector MUST be 403 in phase1.

## C) Webhook Connector（phase1の主戦場）
- WEBHOOK_SIGNING_SECRET= GENERATE_AT_DEPLOY_AND_ROTATE
- WEBHOOK_SIGNING_ALG= HMAC-SHA256
- WEBHOOK_SIGNATURE_HEADERS=
  - required: ["X-Yohaku-Signature", "X-Yohaku-Timestamp", "X-Idempotency-Key", "X-Yohaku-Job-Id"]
  - timestamp_skew_seconds: 300   # 5分以上ズレたら拒否（replay対策）
- WEBHOOK_BODY_SIGNING_RULES（Truth‑First：署名の“真実”を固定）
  - sign_exact_payload_bytes: true                     # 署名は“送ったバイト列”に対して行う
  - store_payload_json_string_as_source_of_truth: true # DBに保存したpayload_json（文字列）を唯一の真実にする（refs_only構造）
  - worker_must_send_stored_payload_json_without_restringify: true
  - receiver_must_verify_against_raw_body: true        # 受信側は raw body で検証（JSON parse前に）
- WEBHOOK_RETRY_POLICY=
  - max_attempts: 8
  - backoff_seconds: [5, 15, 45, 120, 300, 600, 1200, 2400]
  - giveup_after_seconds: 7200
- WEBHOOK_REGION_POLICY=
  - allowed_regions: ["JP", "US"]
  - default_region: "JP"
- WEBHOOK_ALLOWED_TARGETS（SSRF/誤送信の根）
  - customer_owned_only: true
  - https_only: true           # devのみ http可（DEV_ALLOW_LOCALHOST）
  - disallow_private_ip: true  # 127.0.0.1/10.0.0.0/169.254/::1 等は禁止（dev例外のみ）
  - must_be_registered: true   # connector_configs.registered_urls に登録済みだけ送る（phase1必須）
  - deny_redirect: true        # 30xで別hostへ逃げるの禁止（初期は保守）
  - allowlist_domains: []      # 追加制限したい時だけ使う（空=制限なし）
- DEV_EXCEPTIONS（仕様として固定）
  - DEV_ALLOW_LOCALHOST=true のときのみ以下を許可（productionでは絶対禁止）
    - http://localhost:*
    - http://127.0.0.1:*
    - http://[::1]:*
  - productionでは https_only=true + disallow_private_ip=true を強制（例外なし）
- CONNECTOR_CONFIG_SCHEMA_WEBHOOK（phase1の事前登録制）
  - connector_configs.config_json.registered_urls:
      - url: "https://example.com/webhook"
        enabled: true
        note: "customer-owned"
      - url: "http://localhost:4001/webhook"
        enabled: true
        note: "dev only"

## D) Calendar Hold（phase1は “可逆 + 失敗しても価値が落ちない” を最優先）
- CALENDAR_HOLD_MODE= "ics_fallback_first"
- ICS_TTL_DAYS= 14
- CALENDAR_DIRECT_OAUTH= SEALED (phase1は禁止。phase1_5で検討)

## E) Budget / Rate limit（事故防止：phase1は厳格）
- APPROVE_TTL_SECONDS= 600
- IDEMPOTENCY_TTL_HOURS= 24
- MAX_ACTIONS_PER_CONFIRM= 5
- MAX_WEBHOOKS_PER_MINUTE_PER_TENANT= 120
- MAX_CONFIRM_PER_MINUTE_PER_TENANT= 30

## E-2) No‑Switch Ops（実行モード：Shadow→Canary→Live）
- CONFIRM_EXECUTION_MODES= ["shadow", "canary", "live"]
- CONFIRM_EXECUTION_MODE_DEFAULT= "live"
- SHADOW_MODE_RULES=
  - external_calls: false              # shadow は外部実行しない（Webhook/Calendar実行なし）
  - produces_receipt: true             # ただしReceiptは出す（監査と合意形成の練習）
  - writes_ledger_event: true          # ledgerに “SIMULATED” 等で残す（真実の記録）
  - counts_for_billing_confirm: false  # 課金/メータリングの confirm には含めない（混乱を防ぐ）
- CANARY_MODE_RULES=
  - external_calls: true
  - gated_by_policy: true              # tenant/connector/target単位、または割合で段階解禁（安全導入）
  - auto_freeze_on_anomaly: true       # Circuit Breakerと接続

## F) Conformance（ConfirmOS準拠テスト）v0.3（+ Lane拡張はv0.4-draft / Outcomeはv0.5-draft / PROD Idempotencyはv0.6-draft）
Artifacts（最低限）
- confirmos.schema.json
- confirmos.semantics.md
- conformance_tests/
  - T01_approve_ttl_10m
  - T02_confirm_requires_idempotency_key
  - T03_idempotency_conflict_returns_409
  - T04_undo_10s_reversible_only
  - T05_irreversibility_gate_double_approve_required
  - T06_execution_ledger_append_only_chain(prev_hash)
  - T07_webhook_signature_required
  - T08_webhook_idempotency_24h
  - T09_partial_success_contract(422/shape)
  - T10_webhook_retry_policy_backoff
  - T11_calendar_hold_reversible_or_ics_fallback
  - T12_policy_denies_out_of_allowlist_connector
  - T13_kill_switch_denies_when_frozen
  - T14_metering_counts_confirm_once
  - T15_kya_executor_is_recorded(api_key_id_or_agent_id)
  - T16_kya_principal_is_traceable(approve→confirm)
  - T17_webhook_timestamp_replay_protected
  - T18_webhook_target_must_be_registered
  - T19_provider_neutral_planner_mock_rules_work
  - T20_receipt_contains_kya_policy_truth_sig
  - T21_shadow_confirm_produces_receipt_without_side_effects
  - T22_receipt_contains_evidence_pack
  - T23_data_sources_are_refs_only_no_content
  # v0.4-draft（Lane固定：後方互換の“追加フィールド”として導入）
  - T24_receipt_contains_approval_lane_and_principal_type
  - T25_auto_lane_principal_is_policy
  - T26_review_lane_principal_is_human
  - T27_gate_requires_two_approvals_or_denied_in_phase1
  # v0.5-draft（Outcome Pack：後方互換の“追加フィールド”として導入）
  - T28_receipt_contains_outcome_pack_min
  - T29_outcome_pack_contains_no_raw_data
  - T30_outcome_pack_matches_jobs_final_state
  # v0.6-draft（PROD Idempotency：本番品質の硬さ）
  - T31_idempotency_returns_same_receipt_and_job_no_growth
  - T32_stale_started_no_side_effects_can_retry
  - T33_stale_side_effects_started_recovers_via_receipt_confirm_id
  - T34_fencing_prevents_aba_old_process_cannot_enter_side_effects
  # NEW: Context Receipt（署名付きコンテキスト証明）
  - T35_context_receipt_signature_verified_or_400
  - T36_context_receipts_digest_in_request_hash_T03_strict
  - T37_receipt_contains_context_receipts_when_provided
  - T38_context_receipt_contains_no_raw_data

Versioning
- CONFIRMOS_VERSION= 0.3
- v0.4 は Laneを “必須フィールド” にした時に切る（破壊的変更扱い）
- v0.5 は Outcome Packを “必須フィールド” にした時に切る（破壊的変更扱い）
- v0.6 は PROD Idempotency（ConfirmRequest + fencing + recovery）を “必須” にした時に切る（破壊的変更扱い）
# NOTE: Context Receiptは v0.3 の「後方互換の追加フィールド」扱い（必須化はphase2で検討）

## G) AXI Treaty（公開契約）v0：数字で責任を固定（“標準の牙”）
Definitions（固定）
- misexec_pct = 誤実行 / confirm件数（週次、7日移動平均）
- ledger_integrity = prev_hash チェーンが検証可能である割合
- receipt_integrity =
    "receipt_hash/server_sig が検証可能" かつ
    "必須フィールド（KYA + policy_ref/risk_tier + Evidence Pack + Lane）欠損なし" 割合（Truth+Evidence+Lane）
- approval_lane_coverage = approval_lane/principal_type が欠損しない割合（=100%が前提）
- outcome_pack_coverage = outcome_pack が存在する割合（phase1は段階導入。phase1_5で99.9%目標）
- webhook_delivery_success = 2h以内に成功した webhook_job の割合（attemptではない）
- context_receipt_coverage = context_receipts が存在する割合（任意。phase1は測るだけ、phase1_5で目標設定）  ← NEW
Treaty v0（初期案）
- misexec_pct > 0.5%（週）：当該週 Platform Fee の 25% クレジット
- misexec_pct > 1.0%（週）：当該週 Platform Fee の 100% クレジット
- ledger_integrity < 99.9%（週）：当該週請求を無効（0円）＋原因レポート
- receipt_integrity < 99.9%（週）：当該週 Platform Fee の 25% クレジット（当社起因のみ）＋原因レポート
- webhook_delivery_success < 99.0%（週）：当該週 usage の 25% クレジット（当社起因のみ）

## H) Unit Economics Inputs（phase1：最低限）
- avg_confirm_latency_ms_p50= 1200
- avg_confirm_latency_ms_p95= 2500
- avg_llm_cost_per_confirm_yen= 1.2
- avg_infra_cost_per_confirm_yen= 0.8
- target_gross_margin_phase1= 75%

## I) Monetization（phase1：料金・課金単位・請求定義を確定）※Gate1対応でLadder追加
- BILLING_CURRENCY= JPY
- BILLING_MODE_PHASE1= "contract_then_invoice"   # phase1は手動請求でもOK。必ず“計測”は自動でやる。
- BILLING_UNIT_DEFINITIONS=
  - confirm: "/v1/confirm が accept され ledger に CONFIRMED が1回書かれたもの（idempotencyで重複課金しない）"
  - confirm_shadow: "shadow confirm（外部実行なし）。導入/監査の練習用。課金しない（counts_for_billing=false）"
  - webhook_job: "webhook.dispatch action 1つ = 1 job（retry回数は課金しない）"
  - calendar_hold: "calendar.hold.create action 1つ（ICS生成）"
- PRICING_PHASE1_DEFAULTS=
  - plan_design_partner:
      price_jpy_per_month: 0
      duration_days: 60
      eligibility: "設計パートナー（週次で使う。改善に協力。ロゴ/事例は任意）"
      limits:
        included_confirms_per_month: 50000
        included_webhook_jobs_per_month: 50000
        included_calendar_holds_per_month: 50000
      terms:
        overage_confirm_jpy: 0
        overage_webhook_job_jpy: 0
        overage_calendar_hold_jpy: 0
  - plan_private_beta_starter:
      price_jpy_per_month: 50000
      included_confirms_per_month: 100000
      included_webhook_jobs_per_month: 100000
      included_calendar_holds_per_month: 100000
      overage_confirm_jpy: 1.0
      overage_webhook_job_jpy: 0.5
      overage_calendar_hold_jpy: 0.2
      support: "community + 48h response"
      sla: "none (phase1)"
  - plan_private_beta_pro:
      price_jpy_per_month: 200000
      included_confirms_per_month: 500000
      included_webhook_jobs_per_month: 500000
      included_calendar_holds_per_month: 500000
      overage_confirm_jpy: 0.8
      overage_webhook_job_jpy: 0.4
      overage_calendar_hold_jpy: 0.15
      support: "private channel + 24h response"
      sla: "none (phase1)"
  - plan_private_beta_team:
      price_jpy_per_month: 500000
      included_confirms_per_month: 2000000
      included_webhook_jobs_per_month: 2000000
      included_calendar_holds_per_month: 2000000
      overage_confirm_jpy: 0.6
      overage_webhook_job_jpy: 0.3
      overage_calendar_hold_jpy: 0.10
      support: "private channel + 12h response"
      sla: "none (phase1)"
  - plan_enterprise_preview:
      price_jpy_per_month: 2000000
      included_confirms_per_month: 10000000
      included_webhook_jobs_per_month: 10000000
      included_calendar_holds_per_month: 10000000
      overage_confirm_jpy: 0.4
      overage_webhook_job_jpy: 0.2
      overage_calendar_hold_jpy: 0.06
      support: "private channel + 4h response"
      sla: "none (phase1)"
      note: "Enterprise機能（SAML/SCIM等）はphase2で解禁。phase1は“Exit品質+監査+Treaty+Evidence+Lane+Outcome+Data‑Minimization/Idempotency”で売る。"
- MONETIZATION_GOALS（Gate1逆算：レンジで持つ）
  - by_month_3:  "MRR ¥1,000,000〜¥3,000,000（有料意志を2社以上）"
  - by_month_6:  "MRR ¥3,000,000〜¥10,000,000（Starter/Pro/Teamが混ざる）"
  - by_month_12: "MRR ¥15,000,000〜¥30,000,000（Team/Enterpriseが入り始める）"
  - by_month_18: "MRR ¥40,000,000〜¥60,000,000（ARR ¥480,000,000〜¥720,000,000）"
  - by_month_24: "MRR ¥70,000,000〜¥90,000,000（ARR ¥840,000,000〜¥1,080,000,000）= Gate1圏内"
- RULE（Gate1のための非交渉）
  - "Usage課金は ‘/confirm’ に寄せる（出口＝確定が主商品）"
  - "retry/attempt課金しない（信頼の毀損）"
  - "Platform Fee は ‘信頼（監査/停止/KYA/Treaty/Conformance/Truth+Evidence+Lane+Outcome/Data‑Minimization/Idempotency/ContextReceipt）’ で正当化する"  ← NEW
  - "単価を上げる前に ‘SLO/監査/責任/Lane/真実出力/証拠/結果/Idempotency/ContextReceipt’ を固める（Treatyが裏付け）"  ← NEW

## J) ICP（phase1：最初の3社 + Gate2/3へ伸びる顧客像）
- ICP_PRIMARY= "Webhookを受けられる（受け口を作れる）チーム"
- ICP_WEDGE_TEMPLATE（推奨）:
  - "ITSM/SRE/運用：申請→Authorization→実行（チケット/権限/通知/ロールバック）"
  - "現場/供給網/エネルギーに近いOps（bits→atoms）：事故コストが跳ねるのでExit価値が最大化する"
- ICP_PERSONA=
  - title: "Agent / Automation Engineer (Owner)"
  - pain: "実行が怖い（Authorization/監査/冪等/ロールバック/停止/KYA/Truth+Evidence+Lane+Outcome/Data-Minimization/Idempotencyを自前で作りたくない）"
  - success: "安全に本番実行でき、監査で怒られない。誰の代理で何をしたか追える。止められる。なぜ許されたか説明できる。Auto/Review/Gateで運用が破綻しない。結果まで追える（Outcome）。冪等が硬い（misexecしない）。Context Receiptがあると監査が一撃で通る。"  ← NEW
- ICP_SECONDARY（Gate2/3で重要）:
  - title: "Security / Compliance / Platform Team"
  - pain: "エージェントが増えるほど責任が崩れる。誰が実行したか追えない。止められない。説明できない。証拠が出せない。Laneも定義されてない。結果/事故の信号も無い。"
  - success: "KYA + Lane + Outcome + Treaty + ledger/receipt（署名/ハッシュ/理由/証拠/レーン/結果） が標準で、審査が通る。冪等/衝突/復旧が仕様化されている。Context Receiptで『何を見たか』が証明できると最強。"  ← NEW
- ICP_FIT_CHECKLIST（全部YESなら設計パートナー適格）=
  - "社内に業務API or ワークフローがある（Webhookで受けたい）"
  - "Slack/Email/Calendarが業務で必須"
  - "Authorizationが必要 or policy authorization（Auto）で回したい作業がある"
  - "監査/可視化の要求がある（ログが必要）"
  - "エージェントが複数走っている/走らせたい（責任追跡したい）"
  - "PoCに2週間コミットできる（週1で改善サイクル）"
  - "冪等性/衝突/復旧が痛点になっている or これから本番で詰みそう"
  - "（任意）Context Provider（社内MCP/内製）があり、Context Receiptを出せる"  ← NEW
- ICP_DISCOVERY_QUESTIONS（設計パートナー判定：5問 + Lane + Outcome）
  - "直近6ヶ月で『自動化』が原因のインシデントあった？"
  - "自動化/エージェントにオンコールある？"
  - "『誰が承認/許可したか』を監査/レビューで問われたことある？"
  - "idempotency / retry / replay 対策を自前で書いてる or これから書く？"
  - "『本番実行』が怖くて止まってるプロジェクトがある？"
  - "低リスクは Auto（人間ゼロ）で回したい？"
  - "高リスクは Gate（二重承認）にしたい？"
  - "結果/事故（Outcome）を今どこで追ってる？（ないなら刺さる）"
  - "冪等の409/202/復旧で詰んだことある？（あるなら刺さる）"
  - "『何を根拠にしたか』を監査で詰められた？（Context Receiptが刺さる）"  ← NEW
  - "→ YESが2つ以上なら高確度。3つ以上なら“今”刺さってる。"
- ICP_EXCLUDE_PHASE1（NO GO）=
  - "支払い/解約/不可逆アクションが最初から必須（phase1は避ける）"
  - "Webhook受け口を作れない（Receiver Starter Kitでも無理）"
  - "法務/稟議が重すぎて3ヶ月以内に動かない"

## K) Receiver Starter Kit（phase1：導入摩擦を潰す“必須成果物”）
- GOAL= "相手がWebhook受け口を30分で作れる状態"
- SHIP_IN_PHASE1=
  - "@yohaku/signature（HMAC verify + timestamp skew）"
  - "receiver-starter（Cloudflare Worker）"
  - "receiver-starter（Node/Express）"
  - "Webhook Playground（署名/冪等/リトライ/スキュー確認UI）"
- NON_GOALS_PHASE1=
  - "大量のコネクタテンプレを増やす（2本固定）"
  - "Marketplace（phase3）"
  - "Slack代替チャット（禁止）"
  - "顧客の実ファイル/成果物を収集する（禁止。参照ID+hashだけ）"
  - "Yohakuが外部SaaSへ取りに行くContext Capture（phase1禁止）。BYO Context Providerでやる。"  ← NEW

## L) Kill/Freeze（phase1：事故った瞬間に止められる“仕組み＋運用”）
- FREEZE_LEVELS=
  - global: "全tenant停止"
  - tenant: "特定tenant停止"
  - connector: "特定tenantの特定connector停止"
  - target: "特定target_url_hash停止"
- AUTO_FREEZE_TRIGGERS（phase1は保守的に）=
  - "misexec suspected event が1件でも発生 → tenant freeze + incident"
  - "webhook delivery の 5xx/timeout が連続 → connector freeze"
  - "allowlist外が検出 → confirm拒否 + incident"
  - "signature mismatch / timestamp skew の異常多発 → target freeze"
- Laneとの関係：
  - "Autoを増やすほどFreezeの価値が増える（No‑Switch必須装備）"
- Outcomeとの関係：
  - "Freezeが入ったら Outcome Pack の incident.flag=true を必ず立てる（責任の連結）"

## L-2) No‑Switch Ops（Shadow→Canary→Live）
- Shadow（Dry‑run）
  - 外部実行なし
  - Receiptは出す（KYA/Policy理由/Evidence/Lane）
  - ledgerには “SIMULATED” として残す（Truth‑First）
- Canary（段階導入）
  - tenant/connector/target単位で段階解禁
  - 異常が出たら Circuit Breaker で自動freeze
- Live（本番）
  - phase1は 2コネクタ固定（Webhook + CalendarHold）
- Circuit Breaker（自動停止）
  - 連続署名不一致/タイムスキュー → target freeze
  - 連続5xx/timeout → connector freeze
  - misexec疑い → tenant freeze
- RUNBOOK_REQUIRED= true
- POSTMORTEM_REQUIRED= true

## M) 30日スコアカード（phase1：合格/失格を固定して迷わない）
- PASS_CONDITIONS_BY_DAY_30=
  - "設計パートナー 3社（週次利用）"
  - "合計 confirm >= 500 / week"
  - "approve→confirm conversion >= 60%"
  - "webhook_delivery_success >= 99%"
  - "ledger_integrity >= 99.9%"
  - "receipt_integrity >= 99.9%"
  - "approval_lane_coverage = 100%"
  - "Evidence Pack coverage >= 99.9%"
  - "Outcome Pack coverage >= 95%（phase1目標。phase1_5で99.9%）"
  - "misexec_pct < 0.5%"
  - "Idempotency hardening pass（T03/T31〜T34 pass）"
  - "KYA欠損なし（T15/T16 pass）"
  - "Receiver Starter Kit で ‘30分導入’ 実証（3社中2社以上）"
  - "No‑Switch Ops（shadow→live）が再現（shadow_to_live_conversionが上がる）"
  - "（任意）Context Receipt coverage を計測できている（0でもOK。測れることが大事）"  ← NEW
- FAIL_FAST_TRIGGERS=
  - "Day14時点で設計パートナー0〜1社 → ICP/導線/Receiver kitを最優先で修正"
  - "misexecが発生 → 即Freeze + 原因解明が終わるまで拡販停止"
  - "webhook_successが当社起因で98%未満が継続 → 信頼改善まで新規導入停止"
  - "receipt_integrity が 99.9%未満 → Truth/Evidence/Lane修正が終わるまで拡販停止"
  - "Idempotencyが崩れた（job増殖/二重課金/202詰み） → 即停止して修正"

## N) KYA（Know Your Agent）/ Delegation（phase1の最小・必須）
目的：エージェント時代の“責任”を成立させる。
- KYA_IDENTITY_MODEL_PHASE1（必須）:
  - “Agent identity = API Key” を基本とする（エージェントごとにAPIキー分離）
- OPTIONAL_AGENT_LABEL（任意・推奨）:
  - Header: X-Yohaku-Agent-Id（顧客側の安定ID。存在すればhashして保存）
  - Header: X-Yohaku-Agent-Label（表示名）
- PRINCIPAL_MODEL_PHASE1（必須）:
  - principal_type=human|policy を必ず残す（Laneとセット）
  - human principal は user_id/email_hash を残す
  - policy principal は policy_ref を残す
- DELEGATION（phase1：設計のみ。実装はphase2）
  - principal が agent に委任した事実を残す（delegation_ref / scope_json）
  - phase1は “policy principal” で代替しても良い（人間の意図＝ポリシー化）

## O) Provider Neutral / Planner Resilience（OpenAIが死んでも検証が止まらない）
- PLANNER_MODE= "openai" | "mock" | "rules"
- RULE: “openaiが落ちても /approve(/authz) /confirm /ledger /webhook /freeze /metering は検証できる” を絶対に守る

## P) Ship Rails（Cursorが暴走しない“出す”ためのルール）
- 1 PR = 1論点（200〜400行目安）
- 追加コネクタは禁止（phase1固定）
- Conformance（T01〜T23 + T31〜T38）をCIで毎回回す（Lane/Idempotency/ContextReceipt含む）  ← NEW
- SEALED lint（sealed実行パスがprodに入ったらfail）
- “見た目UI”より “実行の責任（Lane/KYA/Ledger/Receipt/Outcome/ContextReceipt/Freeze/Truth/Evidence/Data‑Minimization/Idempotency）” を優先  ← NEW
- Slack思想：Copy to Slack / 2メッセージルール（Review/Gate）＋ Autoは結果のみ
- No‑Switch Ops：Shadow/Canary/Live + Circuit Breaker（運用の正解）
# =========================================


# =========================================
# BEGIN: README.md
# =========================================
# Yohaku Action Cloud – エージェントの“出口（確定）”を安全にする実行レイヤー
> We don’t sell “agents”. We sell “safe confirmation”.  
> Human optional. Accountability mandatory.

## 一言要約（phase1 / Exit-first / Private β）
- AIエージェントが増える世界で一番危ないのは「勝手に実行される」こと。
- Yohakuは、どの入口（LLM/音声/UI/Slack）から来ても、**Plan→Authorize→Confirm** を安全に回す **中立Exitレイヤー**。
  - ※実装のAPI名は /approve でもOK。外部説明は “Authorization object” に統一する。
- 承認は “消えない”。**Auto/Review/Gate** に分岐して “速度” と “責任” を両立する。
- phase1は **Webhook + Calendar Hold（ICS）** の2本だけに固定して、速度と信頼を最大化する。
- 導入摩擦は **Receiver Starter Kit** で潰す（30分でWebhook受け口）。
- すべての実行は **KYA（どのagentが誰の代理で何をしたか）** を追跡可能にする。
- **Evidence Pack（判断の要点/参照元(ref+hash)/モデル情報）** を残し、監査・苦情対応・改善が回る。
- **NEW: Context Receipt（署名付きコンテキスト証明）** を残し、“何を見たか/どの権限か” を監査で証明できる（rawは保持しない）。
- **Outcome Pack（結果/事故/停止/上書きの最小信号）** を残し、“判断だけのログ”で終わらせない。
- **PROD Idempotency（ConfirmRequest + fencing + 202復旧）** で misexec を構造で潰す。
- Slackは作らない。**Approve/ReceiptをSlackに貼って成立**させる（Review/Gateは2メッセージ、Autoは結果のみ）。
- 止められない加速（No‑Switch）前提：**Shadow→Canary→Live + Circuit Breaker** で“安全に本番に入れる”。
- Data‑Minimization：**raw doc/PIIは保持しない**（参照ID+hashのみ）。地雷を踏まない。

## Valuation Ladder（Gate1→Gate2→Gate3）
- Gate1（¥10B / 100億）：事業として成立し、買収が来ても断れる土台
- Gate2（¥150B / 1500億）：標準化が現実になり、勝者multipleが付く
- Gate3（¥1T〜¥2T / Notion級）：中立インフラとして産業に埋め込まれ続ける
- Yohakuの勝ち筋：**/confirm流量 × 規格（Conformance+Treaty+KYA+ContextReceipt） × 中立 × Slack Surface × No‑Switch Ops × Truth+Evidence × Lane × Outcome × Idempotency**

## Phase1のコア体験（Builders / Teams）
1) Agentが /plan を叩く
2) Lane決定（Auto/Review/Gate）
3) Authorizationを作る（/approve＝AuthZ record）
4) /confirm 実行（idempotency必須）
5) ledger に残る（KYA + Lane + Truth + Evidence + Outcome + ContextReceipt）
6) Receiptで共有（Copy to Slack / Share link）
7) 必要なら Audit Bundle で提出（zip/json、ref+hash + sig + outcome最小信号）
8) No‑Switch Ops：shadow→canary→live で安全に移行
9) PROD Idempotency：再送/並列/クラッシュでも二重実行しない

## phase1 Focus Rules（非交渉）
- ✅ Exit-first：ConfirmOS + Action Cloud（Private β）
- ✅ コネクタ2本固定：Webhook + Calendar Hold（増やさない）
- ✅ Authorization-first：/confirmは常にAuthZ必須（human/policy）
- ✅ Approval Lanes（Auto/Review/Gate）を出力に固定（Human optional）
- ✅ Conformance + Treaty v0.3 を“実装物”として完成
- ✅ Receiver Starter Kit（導入摩擦を潰す）を同時に出す
- ✅ Kill/Freeze（事故停止）を仕組みで持つ
- ✅ KYA（executor/principal）をledger/receiptに刻む
- ✅ Evidence Pack（rationale/refs/model）をledger/receiptに刻む（chain-of-thought禁止）
- ✅ NEW: Context Receipt（署名付きコンテキスト証明）を受け取り・検証・証跡化（取得/同期はSEALED）
- ✅ Outcome Pack（結果/事故/停止/上書き）を最小で刻む（raw無し）
- ✅ Data‑Minimization（raw doc/PIIを保持しない）
- ✅ Provider Neutral（mock/rules）で検証を止めない
- ✅ Slack思想：Approve/Receiptを貼って成立（Review/Gate=2メッセージ、Auto=結果のみ）
- ✅ No‑Switch Ops：Shadow→Canary→Live + Circuit Breaker
- ✅ Truth‑First：Receipt署名/Policy理由/差分の型
- ✅ PROD Idempotency：ConfirmRequest + fencing + 202復旧（misexecを構造で潰す）
- ❌ Phone（実行）/ Proactive（実行）/ 外部Memory import / OS deep / Marketplace / Public API一般公開（SEALED）
- ❌ Yohakuが外部SaaSへ取りに行くContext Capture（SEALED）

## KPI（phase1：週次で見る）
- confirm_count / tenant / week
- ttc_p50 / ttc_p95（Time-to-Confirm）
- time_to_complete_p50 / p95（結果収束）
- misexec_pct
- ledger_integrity
- receipt_integrity（Truth+Evidence+Lane欠損なし）
- approval_lane_coverage（=100%）
- evidence_pack_coverage
- context_receipt_coverage（任意、測る）
- outcome_pack_coverage（段階導入）
- idempotency_conflict_rate（409/T03）
- in_progress_202_rate（復旧できるはずのものが詰んでないか）
- incident_flag_rate / mttr_minutes
- webhook_delivery_success（2h以内）
- approve_to_confirm_conversion（Review中心）
- auto_lane_rate（Autoがどれだけ回り始めたか）
- time_to_first_ack_p50 / p95（Slack/Email）
- receipt_share_rate（Copy to Slack）
- audit_bundle_export_usage
- shadow_confirm_count / shadow_to_live_conversion
- freeze_events_per_week
# =========================================
# END: README.md
# =========================================


# =========================================
# BEGIN: docs/VISION.md
# =========================================
# VISION – AI時代の“責任ある実行”を標準化する（Gate2/3は標準化で取る）
エージェントが普及すると「実行」の総量が増える。  
事故の総量も増える。  
だから世界は **Exit（確定/責任/監査/停止/結果）** を必要とする。

## コア仮説
- 入口（LLM/チャット/アプリ）は変わる。
- でも「誰が許可したか」「止められるか」「監査できるか」「なぜ許されたか」「何を参照したか」「結果どうだったか」は残る。
- 承認は “不要” になるのではなく **Auto/Review/Gate** に分岐する（Human optional / Accountability mandatory）。
- Exitの標準は
  - 互換（Conformance）
  - 補償（Treaty）
  - 責任（KYA）
  - 許可の型（Approval Lanes / Authorization-first）
  - 監査（ledger/receipt）
  - 真実（Truth‑First）
  - 証拠（Evidence‑First）
  - NEW: コンテキスト証明（Context Receipt）
  - 結果（Outcome Pack）
  - 最小化（Data‑Minimization）
  - 冪等（PROD Idempotency）
  で成立する。
- No‑Switch（止められない）前提：
  - 止める/禁止するのではなく、Shadow→Canary→Live + Circuit Breaker で“安全に導入”できる会社が勝つ。

## Slack Surface（時代の速度に合わせる）
- PRや非同期レビューは “遅さ” が致命傷になりやすい。
- 解は「Slack = 入口」「Yohaku = 確定」。
  - Review/Gate：Slackに貼って判断できる（Authorize）
  - Auto：Slackに結果だけ出る（ノイズ無し）
  - Slackに貼って説明できる（Receipt）
  - 事故ったら止められる（Freeze）
  - 証跡は台帳に残る（ledger）
  - 真実は署名で固定（receipt_hash / server_sig）
  - 証拠は “短い要点 + 参照元(ref+hash)” で固定（Evidence Pack）
  - NEW: Context Receiptで “何を見たか/どの権限か” を署名で固定（raw無し）
  - 結果は “最小信号”で固定（Outcome Pack）
  - 冪等は ConfirmRequest + fencing + 復旧で固定（Idempotency）

## プロダクト憲法（非交渉）
0. Truth‑First：Receipt/ledgerは“真実の出力”。署名/ハッシュ/Policy理由/差分の型を固定する
0.5 Evidence‑First：判断の要点/参照元(ref+hash)/モデル情報を必ず出す（chain-of-thoughtは禁止）
0.55 Context Receipt：何を見たか/どの権限かを署名で証明（raw無し。取得/同期はphase1 SEALED）
0.6 Data‑Minimization：raw doc/PIIを保持しない（参照ID+hashのみ）
0.7 Authorization-first：/confirmは常にAuthorization（/approve record）必須。human/policyどちらでもOK。責任は必須。
0.8 Approval Lanes：Auto/Review/Gate を固定（Human optional / Accountability mandatory）
0.9 Outcome Pack：結果/事故/停止/上書きの最小信号を必ず残す（raw無し）
0.95 PROD Idempotency：ConfirmRequest + fencing + 202復旧で二重実行/詰みを構造で潰す
1. すべての confirm は ledger に残る（監査可能）
2. 取り消し可能なものは取り消せる（Undo/rollback）
3. 不可逆は Gate（二重承認＋人）を必須にする（phase1は実行禁止）
4. phase1は“低リスク”だけ（Webhook/CalendarHold）
5. 仕様はConformanceで縛る（互換性をテストで保証）
6. 信頼はTreatyで売る（定義と補償を数字で固定）
7. 入口（LLM/UI/Slack）は中立（どの入口でも使える）
8. 拡張は後（phase1は増やさない）
9. No‑Switch Ops：Shadow→Canary→Live + Circuit Breaker を標準運用にする
# =========================================
# END: docs/VISION.md
# =========================================


# =========================================
# BEGIN: docs/PRD_PHASE1.md
# =========================================
# PRD – phase1（Exit-first / Private β / Webhook + Calendar Hold）

## 対象ユーザー（phase1 / ICP）
- Enterprise IT / SRE / Ops（社内自動化・運用）
- エージェント開発チーム（LLM/Agentを本番で動かす）
- WebhookまみれSaaS（配送運用＋責任追跡）
- 現場/供給網/エネルギーに近い実行系Ops（bits→atoms）
※ “Webhook受け口を作れる” が必須条件（Receiver Starter Kitで補助）

## phase1の“確定”とは
- Authorization（/approve record）を通った実行だけを許す（human/policy）
- Approval Lane（Auto/Review/Gate）を必ず刻む
- 実行結果を ledger と receipt に残す
  - Truth‑First：署名/理由/差分の型
  - Evidence Pack：要点/参照元(ref+hash)/モデル情報
  - NEW: Context Receipt：署名付きコンテキスト証明（任意）。raw無し。取得/同期はSEALED。
  - Outcome Pack：結果/事故/停止/上書きの最小信号
- Data‑Minimization：raw doc/PIIを保持しない（参照のみ）
- KYA（executor/principal）を追跡できる
- 失敗しても価値が落ちない（CalendarはICS fallback）
- 不可逆は Gate で止める（phase1は実行禁止）
- Slack/Emailに貼って成立（Review/Gate=2メッセージ、Auto=結果のみ）
- No‑Switch Ops：必要なら shadow（Dry‑run）→ canary → live で安全に本番導入できる
- PROD Idempotency：ConfirmRequest + fencing + 202復旧で二重実行しない

## コネクタ（phase1固定）
### Connector A: Webhook（主戦場）
- 顧客所有の endpoint へ HMAC署名付きで送る（timestamp含む）
- 事前登録制（connector_configs.registered_urls のみ送信）
- 冪等キー + リトライ + 2h以内収束
- Truth‑First：署名は raw body（payload_json文字列）を唯一の真実として扱う（再stringify禁止）
- Data‑Minimization：payloadは refs_only（action.body禁止）
- Outcome：最終 http_status / attempts / latency / error_code をOutcome Packに反映（response bodyは持たない）
- phase1 policy：webhook.dispatch は最大1本（DB unique制約の前提）

### Connector B: Calendar Hold（低リスク確定）
- 直接OAuthは phase1 SEALED
- phase1は ICS fallback-first（確実に価値を届ける）
- 可逆：ユーザーが取り込まなくても損しない

## Must（機能要件）
1) /plan → /approve(authz) → /confirm（Autoは principal_type=policy の authz）
2) approve TTL10分 / confirm idempotency必須（24h）
3) Execution Ledger（append-only chain + KYA + Lane + Evidence + Outcome込み）
4) Undo 10秒（可逆アクションのみ）
5) Partial success contract（1つ失敗でも全体はレシート化）
6) Receipt生成（Copy to Slack / Share link）
   - Truth‑First：policy_ref / risk_tier / receipt_hash / server_sig
   - Evidence‑First：decision_rationale / data_sources(ref+hash) / model_info
   - NEW: Context Receipt（任意）：context_receipts(sig+hash+ref)
   - Lane：approval_lane / principal_type
   - Outcome：outcome_pack（最小）
7) Policy Engine（phase1は allowlist + freeze + registered target + lane判定 + canary gate）
8) Usage metering（confirm/webhook_job/calendar_hold）
9) Receiver Starter Kit（30分導入）提供
10) Provider Neutral / Planner resilience（mock/rules）でOpenAI無しでも検証可能
11) No‑Switch Ops（任意だが強い）：shadow confirm（外部実行なし、Receiptは出す）
12) Audit Bundle export（提出用zip/json）：raw doc/PIIは含めない（outcomeは最小信号だけ）
13) PROD Idempotency（本番品質）
   - ConfirmRequest（tenant×idempotency）でロック
   - request_hashで409(T03)
   - fencing(id+confirm_id)
   - Receipt.confirm_idで202詰み復旧
14) NEW: Context Receipt（署名付きコンテキスト証明）
   - issuer registry（公開鍵）登録
   - /plan /confirm で受け取り（任意）→ 署名検証 → receipt/ledgerに保存（raw無し）
   - request_hash に context_receipts_digest を含める（T03厳密）

## 受け入れ基準（DoD）
- AuthZなしconfirm不可（policy authz含む）
- 409 on idempotency conflict
- ledger_integrity ≥ 99.9%（週）
- receipt_integrity ≥ 99.9%（週）
- approval_lane_coverage = 100%（必須）
- evidence_pack_coverage ≥ 99.9%（週）
- outcome_pack_coverage ≥ 95%（phase1目標）
- webhook_delivery_success（2h以内）≥ 99.0%（週）
- ttc_p50 ≤ 2.0s（Webhookのみのケース）
- CalendarHoldは必ずICS生成
- phase1 allowlist外コネクタは必ず 403
- 署名検証がないWebhookは拒否
- timestamp skew のWebhookは拒否
- webhook target は登録済みのみ
- retry/backoffが仕様通りに動く
- freezeが効く（Outcomeにも反映）
- meteringが二重に数えない
- KYA: executor/principal が追跡可能
- Provider Neutral: mock/rulesで検証が止まらない
- idempotency hardening（T03/T31〜T34 pass）
- NEW: context_receipts 署名検証（T35〜T38 pass）
# =========================================
# END: docs/PRD_PHASE1.md
# =========================================


# =========================================
# BEGIN: docs/CONFIRM_OS.md
# =========================================
# ConfirmOS – Authorization/取消/監査/二重承認/KYA/Lane/Outcome/Idempotency/ContextReceipt の標準（出口＝確定の規格）

## 要件（v0.3 + Lane(v0.4-draft) + Outcome(v0.5-draft) + Idempotency(v0.6-draft) + ContextReceipt(additive)）
- Confirm Sheet（誰が/何を/いつ/影響）
- /approve（TTL10分）→ /confirm（idempotency必須）
- Authorization-first：/confirmは必ずAuthZ（/approve record）を要求する（human/policy）
- Approval Lanes（Auto/Review/Gate）を Receipt/Ledger に必ず刻む（Human optionalを成立させる）
- Outcome Pack（最小）を Receipt/Ledger に刻む（判断だけで終わらせない）
- PROD Idempotency（ConfirmRequest + fencing + recovery）を持つ（misexecを潰す）
- NEW: Context Receipt（署名付きコンテキスト証明）を Receipt/Ledger に刻める（raw無し。取得/同期はSEALED）
- KYA（executor/principal/delegation）を追跡できる
- Undo 10秒（可逆のみ）
- ledger（append-only chain）
- Partial success contract（422/shapeを固定）
- Provider Neutral（planner差し替え可能）
- Slack Surface：貼って成立（Review/Gateは2メッセージ、Autoは結果のみ）
- Truth‑First：receipt_hash / server_sig + policy_ref/risk_tier + diffの型
- Evidence‑First：decision_rationale + data_sources(ref+hash) + model_info
- Data‑Minimization：raw doc/PII/営業秘密を保持しない
- No‑Switch Ops（推奨）：shadow→canary→live + circuit breaker

## Authorization / Approval Lanes（仕様）
- approval_lane: auto|review|gate
- principal_type: policy|human
- principal_user_id（humanの場合）
- policy_ref（policyの場合、または gate理由）
- required_approvals（gateの場合>=2）
- approvals_collected

## Context Receipt（仕様：additive）
- context_receipts[]（任意）
- issuer + issuer_key_id（検証キー）
- ref_type + ref（参照ID）
- content_hash（canonical contentのhash）
- scope_hash（権限/スコープのhash）
- principal_type + principal_ref_hash（誰の権限か：生は持たない）
- captured_at（いつ見たか）
- issuer_sig（署名）
- rawは持たない

## Outcome Pack（仕様）
- outcome_pack.final_status
- outcome_pack.actions[]（attempts/latency/http_status/error_code/error_hash/response_hash）
- outcome_pack.incident（flag/severity/reason_short/ref/freeze_rule_id）
- outcome_pack.overrides[]（manual_retry/manual_freeze/rollback 等）

## PROD Idempotency（仕様）
- tenant_id × idempotency_key でロック（ConfirmRequest）
- request_hash が異なる場合は 409（T03）
- fencing：row id + confirm_id で started→side_effects_started を一度だけ通す
- recovery：Receipt(tenant×confirm_id) で202詰み復旧

## Proof‑of‑Execution（PoEx）
- confirmごとに receipt 発行（server_sig / receipt_hash）
- phase2以降：Merkle Root / 透明性ログ

## Execution Ledger（台帳）
- すべての実行を追跡できる（KYA + Lane + Evidence + ContextReceipt + Outcome込み）
- prev_hash で改ざん検知
- 保持：90日（既定）
# =========================================
# END: docs/CONFIRM_OS.md
# =========================================


# =========================================
# BEGIN: docs/ACTION_CLOUD_PHASE1.md
# =========================================
# Action Cloud – phase1（Private β / Exit-first / Gate1 seed / Gate2&3 seed）

## 目的
- エージェントが “安全に実行” できる最小基盤を提供する
- コネクタは2本固定（Webhook + CalendarHold）
- Authorization-first（/confirmにAuthZ必須）で “人間前提” を消す
- Approval Lanes（Auto/Review/Gate）で “速度×責任” を破綻させない
- NEW: Context Receipt（署名付きコンテキスト証明）で“何を見たか/どの権限か”を監査可能にする（raw無し、取得/同期はSEALED）
- Outcome Pack（最小）で “結果/事故/停止/上書き” の信号を貯める（堀）
- PROD Idempotency（ConfirmRequest + fencing + recovery）で misexec を構造で潰す
- KYA（executor/principal）を必ず追跡可能にする
- Conformance/Treatyを実装物として出す（椅子取り開始）
- 課金のためのメータリングを同時に仕上げる
- Provider Neutral を最初から成立させる
- Slack Surface：Approve/Receiptを貼って成立（Review/Gate=2メッセージ、Auto=結果のみ）
- Truth‑First：Receipt署名/Policy理由/差分の型
- Evidence‑First：要点/参照元(ref+hash)/モデル情報
- Data‑Minimization：raw doc/PIIを保持しない
- No‑Switch Ops：shadow→canary→live + circuit breaker
- Audit Bundle：提出できる（zip/json）

## phase1 Offer（設計パートナー向け）
- /v1/plan
- /v1/approve（human authz + policy authz）
- /v1/confirm（live + optional shadow）
- /v1/ledger/export
- /v1/receipt/audit_bundle（提出用zip/json）
- /v1/receipt/outcome_feedback（任意：incident扱い/override理由を短文で記録）
- NEW: /v1/context_receipt_issuers/*（issuer registry：登録/失効）
- Conformance Suite（CIで回せる）
- Treaty v0（定義と補償）
- Receiver Starter Kit（30分導入）
- Usage Metering（請求の根拠データ）
- Planner mode（openai/mock/rules）
- UI（phase1の4ページ）：Approve / Receipt / Setup / Jobs + Freeze（“承認×証跡×停止”）

## Non-goals（phase1でやらない）
- Phone実行
- Marketplace
- External memory import/sync（raw doc取り込み）
- Proactive execution
- Public API一般公開
- Enterprise auth（SAML/SCIM）はSEALED（phase2）
- Slack代替チャット（禁止）
- MCP同期/ミラー（phase1は context_refs保存のみ）
- Gate lane の不可逆実行（phase1は403で止める）
- Yohakuが外部SaaSへ取りに行くContext Capture（phase1禁止）
# =========================================
# END: docs/ACTION_CLOUD_PHASE1.md
# =========================================


# =========================================
# BEGIN: docs/DISTRIBUTION_PLAYBOOK.md
# =========================================
# Distribution（phase1：PLGが主 / Salesは最小 / Gate2/3は拡張で取る）

## Slack Surface Strategy（phase1：Slackは“入口”、Yohakuは“確定”）
**思想**
- Slack/Email/Chat = Dynamic Layer（会話と合意形成）
- Yohaku = Confirm Layer（Authorization/Receipt/Outcome/ContextReceipt/Freeze）
- 仕事の単位は **「スレッド = 1タスク（= 1 approve_id）」**
- 速さの敵は “別タブへの移動” と “相手が気づくまでの時差”
- だから **Approveリンク** と **Receipt** を「貼った瞬間に意味が通る」形に固定する
- Human optional を成立させるために **Approval Lanes（Auto/Review/Gate）** を採用
  - Review/Gate：2メッセージ
  - Auto：結果のみ（ノイズ0）
- Outcome Packを “結果メッセージ” に反映（成功/失敗/incident/freezed を短く）
- NEW: Context Receipt（ある場合）をReceiptに含め、監査で一撃で通す（raw無し）
- No‑Switch前提：導入は “shadow→canary→live” で安全に入るのが勝ち
- Responsible AI前提：判断・根拠・参照元・結果を出せる方が導入摩擦が減る
- PROD Idempotency：冪等/衝突/復旧が硬いほど “本番” が入る

**2メッセージルール（チャンネルを荒らさない）**
- Review/Gate：
  - Message #1（依頼）：Approve Link + 要点3行 + Riskバッジ + TTL
  - Message #2（結果）：Succeeded/Failed + Receipt Link + Jobs Link + 必要なら Freeze/Audit Bundle
- Auto：
  - Message #2（結果）のみ（Policy/Risk/Outcomeを短く）

**phase1の現実解**
- v0：Copy to Slack（テキスト生成）だけで良い（Slack App不要）
- v1_5：Slack App（ボタンでApprove/Reject、thread_ts紐付け）※任意
- 禁止：Slackの代替チャットを作る（phase1で死ぬ）
# =========================================
# END: docs/DISTRIBUTION_PLAYBOOK.md
# =========================================


# =========================================
# BEGIN: docs/ARCHITECTURE.md
# =========================================
# アーキテクチャ（phase1：Exit-first）
- Web/API: Next.js(App Router) / runtime='nodejs'
- DB: Postgres + Prisma
- Queue: outbox/inbox（webhook delivery用）
- Idempotency: 24h（409 on conflict）
  - ConfirmRequest（tenant×idempotency_key）でロック＋request_hash（T03）
  - response_jsonキャッシュ（refs_only）
  - fencing（row id + confirm_id）
  - Receipt.confirm_idで202詰み復旧
- Authorization: approvals = Authorization object（human/policy）。/confirmは必ず参照する
- Approval Lanes: approvals に approval_lane/principal_type を保存（欠損=fail）
- Evidence Pack: receipts/ledger_events に evidence_json（rationale/refs/model/context_refs/context_receipts）を保存（chain-of-thought禁止）
- NEW: Context Receipt
  - issuer registry（tenantごとの公開鍵）
  - /plan /confirm で context_receipts を受け取り → 署名検証 → context_receipts テーブル + receipt/ledger へ反映
  - 取得/同期はSEALED（BYO Context Provider）
- Outcome Pack: receipts/ledger_events に outcome_json（結果/事故/停止/上書きの最小信号）を保存（raw禁止）
- Data‑Minimization: raw doc/PIIは保存しない（参照ID+hash+sigのみ）
- Webhook: HMAC署名 + timestamp + retry + 2h収束（job課金、attempt課金しない）
  - Truth‑First: outboxは payload_json（refs_onlyの文字列）を唯一の真実として保存し、workerは再stringifyしない
  - Outcome: http_status/latency/attempts/error_code/error_hash を outcome_json に反映（raw無し）
  - phase1: webhook.dispatch最大1本（DB uniqueの前提）
- CalendarHold: ICS生成（server）
- Freeze: middlewareで強制（global/tenant/connector/target）
- Planner: openai|mock|rules（provider neutral前提）
- UI（phase1）：Approve / Receipt / Setup / Jobs + Freeze（“承認×証跡×停止”）
- Slack Surface：Copy to Slack（2メッセージ / Autoは結果のみ）
- No‑Switch Ops：Shadow→Canary→Live / Circuit Breaker
- Export: Audit Bundle（zip/json）：提出用（raw docは含めない）

## SLO（phase1）
- /plan p50 ≤ 1.0s（mock/rulesならさらに速い）
- /approve p50 ≤ 200ms
- /confirm p50 ≤ 2.0s（webhook dispatch “enqueue” まで）
- webhook delivery：2h以内成功 ≥ 99.0%（週）
- receipt_integrity ≥ 99.9%（週）
- approval_lane_coverage = 100%
- evidence_pack_coverage ≥ 99.9%（週）
- outcome_pack_coverage ≥ 95%（phase1）
- idempotency hardening pass（T03/T31〜T34）
- context_receipt tests pass（T35〜T38）
# =========================================
# END: docs/ARCHITECTURE.md
# =========================================


# =========================================
# BEGIN: docs/DATA_MODEL.md
# =========================================
# データモデル（phase1本番 + SEALED未来）

## phase1（本番）
- tenants(id, name, region, status, frozen_reason, created_at, updated_at)
- users(id, tenant_id, email_hash, role, created_at)
- api_keys(id, tenant_id, name, key_hash, scopes_json, created_at, revoked_at)

- proposals(id, tenant_id, user_id, payload_json, created_at)
- plans(id, tenant_id, user_id, proposal_id, payload_json, created_at)

- approvals(
    id, tenant_id,
    approve_id, plan_id,
    approval_lane,              # auto|review|gate（必須）
    principal_type,             # human|policy（必須）
    principal_policy_ref,       # policy principalの場合（必須）
    approved_by_user_id,        # human principalの場合（必須）
    approved_by_email_hash,
    approved_via,               # ui|api|policy
    approved_at,
    scope_json, expires_at, created_at
  )

- confirm_requests(             # PROD Idempotency（中核）
    id, tenant_id,
    idempotency_key,            # 外部入力（冪等性の軸）
    request_hash,               # T03判定（plan_id + approve_id + exec_mode + context_refs_digest + context_receipts_digest）
    confirm_id,                 # 内部生成ID（監査/追跡/復旧の軸、NOT NULL）
    status,                     # started|side_effects_started|completed|failed
    receipt_id,                 # completedで必須
    response_json,              # completedで必須（refs_only前提）
    expires_at,
    created_at, updated_at
  )
  UNIQUE(tenant_id, idempotency_key)

- audit_logs(id, tenant_id, user_id, approve_id, action, payload_json, at)

- ledger_events(
    id, tenant_id,
    confirm_id,                 # NEW（追跡/復旧/side-effect証明）
    approve_id, plan_id,
    action, status,
    approval_lane, principal_type,
    executor_api_key_id, executor_agent_id_hash, executor_agent_label,
    principal_user_id, principal_email_hash,
    policy_ref, risk_tier,
    evidence_json,                # {decision_rationale, data_sources[], model_info, context_refs[], context_receipts[]}
    outcome_json,                 # Outcome Pack（最小）
    before_json, after_json, reversible, rollback_id,
    ts, prev_hash
  )

- freeze_rules(
    id, tenant_id, level, connector, target_url_hash,
    active, reason, created_at, updated_at
  )

- connector_configs(id, tenant_id, connector, config_json, created_at, updated_at)

- webhook_jobs(
    id, tenant_id,
    idempotency_key,             # phase1: 1 confirm = 1 job前提（UNIQUE）
    confirm_id,                  # 内部追跡軸
    job_id,                      # 突合の真のキー
    target_url_hash,
    payload_json,                # refs_only構造（署名対象の文字列）
    payload_hash,                # sha256(payload_json)（任意だが推奨）
    signature, timestamp,
    status, attempts, next_attempt_at,
    http_status, latency_ms,
    error_code, error_hash, response_hash,
    created_at, updated_at
  )
  status: queued|delivering|succeeded|failed
  UNIQUE(tenant_id, idempotency_key)   # NOTE(phase1): webhook.dispatch最大1本をPolicyで強制する前提

- receipts(
    id, tenant_id,
    confirm_id,                  # NEW（202詰み復旧用）
    plan_id, status, summary_text,
    approval_lane, principal_type,
    executor_api_key_id, principal_user_id,
    policy_ref, risk_tier,
    evidence_json,
    outcome_json,                 # Outcome Pack（最小）
    receipt_hash, server_sig,
    created_at, updated_at
  )
  UNIQUE(tenant_id, confirm_id)        # 202詰み復旧（Receiptで復旧できる保証）

- receipt_links(id, tenant_id, receipt_id, token_hash, expires_at, revoked_at, created_at)

- growth_events(id, tenant_id, type, meta_json, created_at)
  type: approve_link_opened|receipt_shared|template_exported|template_imported|audit_bundle_exported|outcome_feedback_submitted

## NEW: Context Receipt（phase1：取得/同期はしない。検証して保存するだけ）
- context_receipt_issuers(
    id, tenant_id,
    issuer,                       # "mcp://customer-x/provider"
    issuer_key_id,                # "key_2026_01"
    public_key_pem,               # 検証鍵（Ed25519/ECDSA等）
    status,                       # active|revoked
    created_at, revoked_at
  )
  UNIQUE(tenant_id, issuer, issuer_key_id)

- context_receipts(
    id, tenant_id,
    confirm_id,                   # どのconfirmの証跡か
    issuer, issuer_key_id,
    captured_at,
    ref_type, ref,                # 参照ID
    canonical_ruleset, canonical_ruleset_version,
    content_hash, scope_hash,
    principal_type, principal_ref_hash,
    nonce,
    issuer_sig,                   # base64(signature)
    verified_at,
    created_at
  )
  INDEX(tenant_id, confirm_id)
  INDEX(tenant_id, ref_type, ref)

## Billing（phase1：メータリング必須 / 請求は手動でもOK）
- usage_counters_daily(id, tenant_id, day, confirms, webhook_jobs, calendar_holds, created_at)
- billing_contracts(...)
- invoices(...)

## SEALED（phase1はテーブルだけ）
- call_jobs(...) / call_summaries(...)
- memories(...) / observations(...) / nudges(...)
- contact_graph(...) / availability(...)
- marketplace_listings(...) / connector_registry(...)
- agent_certificates(...) / delegations(...)
- saml_configs(...) / scim_tokens(...) / rbac_roles(...)
- mcp_resources_cache(...) # phase2以降（phase1は保存のみ）
# =========================================
# END: docs/DATA_MODEL.md
# =========================================


# =========================================
# BEGIN: docs/API_CONTRACTS.md
# =========================================
# API コントラクト（phase1：Private β）

## Endpoint Prefix（重要：/v1 と /api/v1 の混乱を潰す）
- Contract（外部向け仕様）: YOHAKU_API_ORIGIN + /v1/*（例: https://api.yohaku.app/v1/confirm）
- Local dev（Next.js同居）: same-origin + /api/v1/*（例: http://localhost:3000/api/v1/confirm）
- ルール: ドキュメントは /v1/* を基準に書く。実装で /api/v1/* に置く場合は “同等の契約” を満たすこと。

## Auth（phase1）
- API Key（tenant単位。agentごとに分ける推奨）
- scope: plan:write, approve:write, confirm:write, ledger:read, billing:read

## Common Headers（推奨）
- Authorization: Bearer <api_key>
- X-Yohaku-Agent-Id: <string>（任意。ある場合はhashして保存）
- X-Yohaku-Agent-Label: <string>（任意。receipt表示用）
- X-Idempotency-Key: <string>（confirmは必須）
- X-Request-Id: <uuid>（任意）
- X-Yohaku-Execution-Mode: shadow|canary|live（任意。No‑Switch Ops）

## POST /v1/plan
Req:
{
  "input": "...",
  "context": {"tenant_id":"t1","user_id":"u1","tz":"Asia/Tokyo"},
  "planner": {"mode":"openai|mock|rules"},
  "context_refs": [
    {"type":"mcp_resource|doc|ticket|db_view","ref":"mcp://...|doc://...","hash":"sha256:...","note":"optional"}
  ],
  "context_receipts": [
    { "...context_receipt..." }     // 任意（あれば署名検証して保存。raw無し）
  ]
}
Res:
{
  "plans":[{ "id":"pl1", "summary":"...", "actions":[...], "confirm_sheet":{...}}],
  "planner_mode":"openai|mock|rules"
}

## POST /v1/approve
目的：Authorization object（AuthZ）を作る（Review/Gateのhuman authz、またはAutoのpolicy authz）
Req: {
  "plan_id":"pl1",
  "approval": {
    "lane":"auto|review|gate",
    "principal": {
      "type":"human|policy",
      "user_id":"u1",
      "policy_ref":"phase1_allowlist+registered_target+low_risk"
    }
  }
}
Res: {
  "approve_id":"aprv_abc123",
  "expires_in_sec":600,
  "approval_lane":"review",
  "principal_type":"human"
}

## POST /v1/confirm
Req:
{
  "plan_id":"pl1",
  "approve_id":"aprv_abc123",
  "idempotency_key":"k_123",
  "execution_mode":"shadow|canary|live",
  "context_refs":[
    {"type":"mcp_resource|doc|ticket|db_view","ref":"...","hash":"sha256:..."}
  ],
  "context_receipts":[
    { "...context_receipt..." }     // 任意（署名検証→保存。取得/同期はSEALED）
  ]
}
Res:
{
  "idempotent": false,
  "results":[
    {"action":"calendar.hold.create","status":"ok|simulated","mode":"ics","ics_url":"..."},
    {"action":"webhook.dispatch","status":"queued|simulated","job_id":"job_123"}
  ],
  "receipt_id":"rcp_123",
  "receipt_hash":"rh_...",
  "server_sig":"sig_...",
  "kya": {
    "executor_api_key_id":"key_1",
    "executor_agent_label":"...",
    "principal_type":"human|policy",
    "principal_user_id":"u1"
  },
  "approval": {"approval_lane":"review","principal_type":"human"},
  "policy": {"policy_ref":"phase1_allowlist+registered_target","risk_tier":"low"},
  "evidence": {
    "decision_rationale":"short rationale (<=400 chars)",
    "data_sources":[{"type":"policy|mcp_resource|doc|ticket","ref":"...","hash":"sha256:..."}],
    "model_info":{"planner_mode":"openai|mock|rules","provider":"...","model":"...","version":"..."},
    "context_refs":[{"type":"mcp_resource|doc|ticket","ref":"...","hash":"sha256:..."}],
    "context_receipts":[{"issuer":"...","ref":"...","content_hash":"sha256:...","issuer_sig":"..."}]
  },
  "outcome": {
    "final_status":"queued|simulated",
    "actions":[
      {"action":"webhook.dispatch","status":"queued","attempts":0,"job_id":"job_123"}
    ]
  },
  "metering": {"confirm": 1, "webhook_job": 1, "calendar_hold": 1},
  "execution_mode":"live"
}

### Idempotency behavior（重要）
- 同一 tenant_id × idempotency_key で request_hash が同じ：
  - 200 OK
  - idempotent=true
  - receipt_id/job_id は同一
  - meteringは全て0
- 同一 tenant_id × idempotency_key で request_hash が違う：
  - 409 IDEMPOTENCY_CONFLICT（T03）
  - NOTE: request_hash は context_refs_digest + context_receipts_digest を含む（厳密）
- 処理中（並列/タイムアウト/クラッシュ復旧中）：
  - 202 IN_PROGRESS（ただしReceipt.confirm_idで復旧できるなら200に昇格）

## GET /v1/ledger/export?since=...
- 監査・検証用（CSV/JSON）
- confirm_id を含む（追跡/復旧用）
- KYA（executor/principal）を含む
- Lane（approval_lane/principal_type）を含む
- Truth‑First：policy_ref/risk_tier/receipt_hash参照可能
- Evidence‑First：evidence_json参照可能（refs_only）
- ContextReceipt：context_receipts参照可能（sig+hash+refのみ）
- Outcome：outcome_json参照可能（refs_only）

## Receipt / Team Viral（Slack Surface対応）
- POST /v1/receipt/share
  Req: { "receipt_id":"rcp_123", "channel":"slack|email|link" }
  Res: { "share_url":"https://yohaku.app/r/<token>", "expires_in_sec":604800 }

- POST /v1/receipt/render_message
  目的：Copy to Slackの “2メッセージテンプレ” をサーバー側で生成（UIはコピペだけ）
  NOTE：Autoは結果のみ。Review/Gateは2メッセージ。

## Outcome Feedback（任意：phase1で“堀”を作る最小）
- POST /v1/receipt/outcome_feedback
  目的：人間が「incident扱い」「override理由」などの最小信号を残す（raw無し）
  Req: {
    "receipt_id":"rcp_123",
    "incident": {"flag": true, "severity":"med", "reason_short":"...", "incident_ref":"ticket://INC-123"},
    "override": {"type":"manual_override", "reason_short":"..."}
  }
  Res: { "ok": true }

## NEW: Context Receipt Issuer Registry（公開鍵の登録）
- POST /v1/context_receipt_issuers/register
  Req: { "issuer":"mcp://.../provider", "issuer_key_id":"key_2026_01", "public_key_pem":"-----BEGIN..." }
  Res: { "ok": true }

- POST /v1/context_receipt_issuers/revoke
  Req: { "issuer":"...", "issuer_key_id":"..." }
  Res: { "ok": true }

## Audit Bundle（提出用）
- GET /v1/receipt/audit_bundle?receipt_id=rcp_123
  Res:
  {
    "bundle_url":"https://yohaku.app/audit/<token>.zip",
    "expires_in_sec": 604800,
    "includes": ["receipt.json","ledger_chain.json","webhook_jobs.json","policy.json","evidence.json","context_receipts.json","outcome.json"],
    "raw_source_data_included": false
  }
- NOTE:
  - Data‑Minimization: raw doc/PII/営業秘密は入れない
  - data_sources/context_refs は ref+hashのみ
  - context_receipts は hash+sig+refのみ
  - outcome は “状態/数値/参照” のみ（本文禁止）
# =========================================
# END: docs/API_CONTRACTS.md
# =========================================


# =========================================
# BEGIN: docs/WEBHOOKS.md
# =========================================
# WEBHOOKS – phase1（Customer-owned endpoint）

## Yohaku → Customer
Headers:
- X-Yohaku-Signature: sha256=<hex>
- X-Yohaku-Timestamp: <unix_epoch_seconds>
- X-Idempotency-Key: <string>
- X-Yohaku-Job-Id: <uuid>

Body（refs_only）:
{
  "event":"action.executed",
  "tenant_id":"t1",
  "confirm_id":"c_123",
  "receipt_id":"rcp_123",
  "job_id":"job_123",
  "kya": {"executor_api_key_id":"key_1","executor_agent_label":"..."},
  "approval": {"approval_lane":"review","principal_type":"human"},
  "action_ref": {"plan_id":"pl1","approve_id":"aprv_abc123","action":"webhook.dispatch"},
  "payload_ref": {"type":"refs_only","hash":"sha256:..."}   // raw body/顧客データは送らない
}

## Truth‑First（重要：署名はraw body）
- 署名は “送ったバイト列” に対して行う
- outboxは payload_json（refs_only構造の文字列）を唯一の真実として保存し、workerはそれをそのまま送る
- receiverは raw body で検証してから JSON parse する

## Delivery rules（job単位）
- 2xx で成功（job=succeeded）
- 4xx は原則停止（設定ミス）→ job=failed（ledgerに残す）
- 5xx/timeout は retry（backoff）
- giveup_after_seconds で終了（job=failed、ledgerに残す）
- retry回数は課金しない（job課金）

## Outcome（phase1）
- jobが succeeded/failed に確定した時点で outcome_pack.actions[] を更新
- response bodyは保存しない（response_hashのみ可）
# =========================================
# END: docs/WEBHOOKS.md
# =========================================


# =========================================
# BEGIN: docs/CALENDAR_HOLD.md
# =========================================
# Calendar Hold（phase1：ICS fallback-first）
目的：可逆で、失敗しても価値が落ちない“確定”を作る

## Action: calendar.hold.create
- mode: ics（phase1 default）
- oauth_direct（SEALED：phase1禁止）
- ics は常に生成できる（権限ゼロでも価値）
# =========================================
# END: docs/CALENDAR_HOLD.md
# =========================================


# =========================================
# BEGIN: docs/AUDIT_BUNDLE.md
# =========================================
# Audit Bundle（提出用パッケージ）— phase1最小版
目的：監査/レビュー/苦情対応で「その場で提出」できる状態を作る。

## 原則
- Truth‑First：改ざん困難（receipt_hash/server_sig）
- Evidence‑First：判断の要点 + 参照元(ref+hash) + model_info
- NEW: Context Receipt：何を見たか/どの権限か（hash+sig+refのみ）
- Lane：Auto/Review/Gate と principal_type を含む（誰が許可したか）
- Outcome：結果/事故/停止/上書きの最小信号（raw無し）
- Data‑Minimization：raw doc/PII/営業秘密は“入れない”
- Portable：zip/jsonで持ち出せる
- Verifiable：受領者が検証できる
- Idempotency：receiptは同一idempotency_keyで固定（二重課金/二重実行しない）

## Bundle Contents（phase1）
- receipt.json（KYA + lane + policy + evidence + outcome + status + hashes）
- ledger_chain.json（prev_hash chain）
- webhook_jobs.json（delivery status + minimal errors）
- policy.json（policy_ref/risk_tier + freeze snapshot）
- evidence.json（decision_rationale + data_sources(ref+hash) + model_info + context_refs）
- context_receipts.json（hash+sig+refのみ。raw無し）  ← NEW
- outcome.json（outcome_pack：最終status/attempts/http_status/incident/freeze/overrides）

## Export API
- GET /v1/receipt/audit_bundle?receipt_id=...
- 署名付きURL（TTLあり）
- revoke可能（receipt_linksと同様）

## 非ゴール（phase1）
- raw docや社内ファイルの同梱（禁止）
- “完全な説明責任”の自動生成（要点で十分。長文は禁止）
# =========================================
# END: docs/AUDIT_BUNDLE.md
# =========================================


# =========================================
# BEGIN: docs/IMPLEMENTATION_RAILS_CURSOR.md
# =========================================
# Cursor Implementation Rails（phase1：Exit-first / 10/10⁴版）
# “コネクタを増やす” ではなく
# “Exitを標準化し、導入摩擦を潰し、止められる/KYAで責任を成立させ、
#  Truth‑First + Evidence‑First + ContextReceipt + Lane + Outcome + Idempotency で監査に勝ち、
#  Data‑Minimizationで地雷を踏まない” が仕事。

## Epic 0：土台（Day 1–2）
- Prisma schema
- /health

## Epic 0.5：PROD Idempotency（Day 2）
- ConfirmRequest（tenant×idempotency_key）を追加
- request_hash（T03）を実装（context_refs digest + context_receipts digest含む）  ← NEW
- status（started→side_effects_started→completed）
- response_jsonキャッシュ（refs_only）
- Receipt.confirm_id（unique）で202詰み復旧
- fencing（row id + confirm_id）でABAを潰す
- Conformance：T03/T31〜T34

## Epic 0.6：Authorization-first（Day 2）
- /confirm は approve_id(AuthZ) 必須（policy/human）
- /approve は “Authorization object” を作るAPI（説明もここに統一）
- principal_type / principal_ref（user_id or policy_ref）欠損=fail

## Epic 0.7：Approval Lanes（Day 2–3）
- approvalsに approval_lane/principal_type/policy_ref を追加
- receipt/ledgerに lane を必須出力（欠損=fail）
- policy approve（Auto）のデータモデルを追加（approved_via=policy）

## Epic 0.8：NEW Context Receipt（Day 3–4）
- context_receipt_issuers（issuer registry：公開鍵）を追加
- context_receipts テーブルを追加（raw無し）
- /plan /confirm で context_receipts を受け取り
- 署名検証（issuer+key_idで公開鍵を引く）
- 検証OK → 保存（context_receipts）+ receipt/ledger の evidence_json に反映
- 検証NG → 400（POLICY_VIOLATION）
- Conformance：T35〜T38

## Epic 1：/plan /approve /confirm（Day 4–8）
- /approve TTL10m（Review/Gate）
- /approve policy approve（Auto）
- /confirm idempotency必須（ConfirmRequestでロック）
- ledger_events append-only chain
- KYA（executor/principal）記録
- lane記録（approval_lane/principal_type）
- Truth‑First：policy_ref/risk_tier/receipt_hash/server_sig（T20）
- phase1 policy：webhook.dispatch最大1本（DB unique前提）

## Epic 1.2：Evidence Pack（Day 6–9）
- receipt/ledgerに evidence_json を保存
  - decision_rationale（短文）
  - data_sources(ref+hash+typeのみ、content禁止)
  - model_info（provider/model/mode/version）
  - context_refs（受け取り・保存のみ）
  - context_receipts（署名検証済みのみ）
- Conformance：T22/T23

## Epic 1.25：Outcome Pack（Day 7–10）
- receipt/ledgerに outcome_json を保存（最小）
- webhook_jobs の final state を outcome_json に反映
- Freeze/Override を outcome_json に反映（短文 + refのみ）
- Conformance：T28/T29（draft）

## Epic 1.5：No‑Switch Ops（Day 9–11）
- X-Yohaku-Execution-Mode（shadow|canary|live）
- shadow confirm（外部実行なし、Receiptは出す、billingに含めない）
- canary gate（target/connector/tenantで段階解禁）
- Circuit Breaker（異常で自動freeze）

## Epic 2：Webhook connector（Day 11–16）
- registered target only
- HMAC + timestamp + retry/backoff
- outbox worker
- delivery結果を ledger に反映
- Truth‑First：payload_json（refs_only文字列）を唯一の真実として送る（再stringify禁止）
- Outcome：http_status/attempts/latency/error_code/error_hash を記録（raw無し）

## Epic 3：Calendar Hold（ICS）（Day 16–18）
- ics generator
- receiptにicsリンク

## Epic 4：Receipt + Team Viral（Day 18–22）
- receipt生成（10秒で読める）
- receipt share link（revocable/ttl）
- growth_events 記録
- Slack Surface（重要）
  - Copy to Slack（Review/Gate=2メッセージ）
  - Autoは結果のみテンプレ
- Truth‑First/Evidence‑First/ContextReceipt/Lane/Outcome/Idempotency をReceiptに固定（欠損=failへ段階移行）

## Epic 4.5：Audit Bundle（Day 22–24）
- /v1/receipt/audit_bundle export
- zip/json生成（TTL/ revoke あり）
- raw doc/PIIを入れない（refs_only）
- Lane/Outcome/ContextReceiptも含む

## Epic 5：Receiver Starter Kit（Day 23–26）
- @yohaku/signature
- receiver-starter（Node/Express + Cloudflare Worker）
- Webhook Playground

## Epic 6：Billing Metering（Day 27–28）
- usage_counters_daily
- export endpoints
- 二重計測しない（idempotency）
- shadow confirm は billingに含めない

## Epic 7：Kill/Freeze + Runbook（Day 29）
- freeze_rules + enforcement
- auto-freeze triggers（Circuit Breaker）
- incident doc（Outcomeと連結）

## Epic 8：Conformance + Treaty（Day 30）
- schema + semantics + tests（T01〜T23 + T31〜T38）
- treaty指標が計測できる（ledger_integrity/receipt_integrity/approval_lane_coverage/misexec/outcome_pack_coverage/context_receipt_coverage）
- 30日PASS/FAILが動く

## SEALED（phase1禁止：実行パスなし）
- Phone connector（call.place）
- Proactive/Nudge実行
- External Memory import（raw doc取り込み）
- Marketplace
- Slack代替チャット（禁止）
- MCP同期（phase1はcontext_refs保存のみ）
- Context Capture（Yohakuが外部SaaSへ取りに行く取得/同期）
# =========================================
# END: docs/IMPLEMENTATION_RAILS_CURSOR.md
# =========================================


# =========================================
# BEGIN: docs/MOAT_10_OF_10.md
# =========================================
# 10/10⁴ Moat スコアカード（Exit-first + KYA + Standard + Lane + ContextReceipt + Outcome + Truth + Evidence + Data-Minimization + No‑Switch + Idempotency）
- 規格化：Conformance + Treaty が“互換の中心”になっている
- 埋め込み：/confirm が複数入口から流入し、監査がYohaku前提になっている
- Authorization-first：/confirmは常にAuthZ必須（human/policy）
- Approval Lanes：Auto/Review/Gate が運用として回っている（Human optionalが成立）
- Context Receipt：何を見たか/どの権限か を署名で証明できる（raw無し。取得/同期はSEALED）  ← NEW
- Outcome Pack：結果/事故/停止/上書きの信号が溜まり、改善が回っている（walled garden）
- PROD Idempotency：ConfirmRequest + fencing + recovery で misexec を構造で潰している
- KYA：agent/principalが標準になっている
- 透明性：Treatyが継続で改善されている
- Truth‑First：receipt_hash/server_sig/policy_ref が欠損しない
- Evidence‑First：decision_rationale/data_sources/model_info/context_refs が欠損しない
- Data‑Minimization：raw doc/PIIを保持しない（地雷回避）
- No‑Switch Ops：shadow→canary→live が再現でき、circuit breakerが回っている
- COGS：粗利≥70%（Gate1）、≥80%（Gate2+）
- 生態系：Compatibleバッジが回っている
- Provider Neutral：入口が変わってもExitが残る
- Slack Surface：Approve/Receiptが“貼って成立”（Review/Gate=2メッセージ、Auto=結果のみ）
# =========================================
# END: docs/MOAT_10_OF_10.md
# =========================================


# =========================================
# BEGIN: docs/M_AND_A_OPTIONALITY.md
# =========================================
# M&A Optionality（買収が来ても断れる / 来たら選べる）

## Data Room Ready（phase1から整える）
- KPI（週次）：confirm/NRR proxy/latency/misexec/ledger_integrity/receipt_integrity/approval_lane_coverage/evidence_pack_coverage/context_receipt_coverage/outcome_pack_coverage/webhook_success/idempotency_conflict_rate/in_progress_202_rate  ← NEW
- No‑Switch Ops：shadow_to_live_conversion / freeze_events / mttr
- Slack Surface：ack率 / time_to_ack / receipt_share_rate
- 監査提出：audit_bundle_export_usage
- Outcome：incident_rate / override_rate / rollback_rate
- ContextReceipt：issuer_count / verify_fail_rate / coverage
- 契約：billing_contracts + Treaty
- 監査：ledger_export + receipt（署名/ハッシュ/理由/証拠/レーン/コンテキスト証明/結果）
- 依存：planner provider差し替え可能（mock/rules）
# =========================================
# END: docs/M_AND_A_OPTIONALITY.md
# =========================================


# =========================================
# BEGIN: docs/ROADMAP_36M.md
# =========================================
## 0–6m（phase1：Exit-first / Private β / Gate1の種）
- Action Cloud（/plan /approve(authz) /confirm /ledger）
- コネクタ2本固定：Webhook + CalendarHold（ICS）
- Authorization-first（human/policy）
- Approval Lanes：Review中心（設計パートナーの安心）＋ Autoを1社で小さく試す（伸びの芽）
- NEW: Context Receipt（署名付きコンテキスト証明）を“持ち込み式”で検証・証跡化（取得/同期はSEALED）
- Outcome Pack（最小）を回し始める（jobs/incident/override）
- PROD Idempotency（ConfirmRequest + fencing + recovery）を完成させる（misexec潰す）
- KYA（executor/principal）をledger/receiptに必ず刻む
- Truth‑First：Receipt署名/Policy理由/差分の型（T20）
- Evidence‑First：要点/参照元(ref+hash)/モデル情報（T22/T23）
- Data‑Minimization：raw doc/PII保持しない
- Provider Neutral（mock/rules）
- Conformance + Treaty v0.3 を“実装物”として完成（Laneはv0.4-draft、Outcomeはv0.5-draft、Idempotencyはv0.6-draft）
- PLG：Team Viral（承認リンク）
- 導入摩擦：Receiver Starter Kit（30分導入）
- 信頼：Kill/Freeze + Circuit Breaker
- No‑Switch Ops：shadow→live の移行が回る（少なくともshadow）
- Slack Surface：Copy to Slack（Review/Gate=2メッセージ、Auto=結果のみ）
- Audit Bundle（提出）を最小で用意
- Phone/Proactive/Memory import/Marketplace はSEALED
- 目標：設計パートナー3社＋週次confirm増加

## 6–12m（phase1_5：再現性 + 単価の階段）
- Private β拡張（10〜30社）
- Auto lane 本格運用（human optional を現実化）
- outcome_feedback の運用を定着（incident/override信号が溜まる）
- Context Receipt coverage を増やす（監査の決定打として定着）
- 追加コネクタ最小
- Enterprise Preview少数導入
- Compatible badge開始
- Slack App（任意）/ thread_ts 紐付け（任意）
- Canary運用の本格化

## 12–24m（phase2：Gate1確定 → Gate2前兆）
- Conformance公開、Compatibleが外部で回り始める
- Treaty強化、外部公開（慎重に）
- Gate lane の本格化（二重承認・役割別・監査提出）
- Context Receipt を“準必須”に寄せ、監査標準の一部にする
- 産業（現場/供給網/エネルギー）に近い“実行系”の拡張を解禁（ConfirmOS準拠）
- 目標：MRR 7,000万〜9,000万円（ARR 8.4〜10.8億）= Gate1圏内

## 24–36m（phase3：GA / Enterprise / Marketplace）
- GA（Enterprise、SLA 99.9%、リージョン固定）
- Connector Marketplace解禁
# =========================================
# END: docs/ROADMAP_36M.md
# =========================================


# =========================================
# BEGIN: docs/SECURITY_PRIVACY.md
# =========================================
# SECURITY & PRIVACY – 最小化/保持/監査（Exit-first）
- 署名：HMAC（rotate可能）
- KYA：必要最小の追跡情報のみ
- Lane：Auto/Review/Gate + principal_type を必須記録（責任の型を固定）
- Authorization-first：/confirmはAuthZ必須（human/policy）
- Truth‑First：Receipt署名/ハッシュ（監査の真実出力）
- Evidence‑First：判断の要点 + 参照元(ref+hash) + model_info（chain-of-thoughtは禁止）
- NEW: Context Receipt：何を見たか/どの権限か を署名で証明（hash+sig+refのみ、raw無し）
- Outcome Pack：結果/事故/停止/上書きの最小信号（raw無し）
- PROD Idempotency：ConfirmRequest + fencing + recovery（二重実行/202詰みを潰す）
- Data‑Minimization（重要）：
  - raw doc（Word/PDF/PPT/Excel/画像/コード等）を保持しない（設計で回避）
  - PII/営業秘密を“収集しない”のが最強（スクラビングに依存しない）
  - data_sources/context_refs は ref+hash のみ（content禁止）
  - context_receipts は hash+sig+ref のみ（content禁止）
- 保持：audit_logs/ledger_events 90d（既定）
- phase1は不可逆を避ける（規制/炎上コスト回避）
- phase1は Context Capture（取得/同期）をやらない（SEALED）。BYO Context Providerのみ。
# =========================================
# END: docs/SECURITY_PRIVACY.md
# =========================================


# =========================================
# BEGIN: docs/REGULATORY.md
# =========================================
# REGULATORY（phase1：低リスクに限定して回避）
- phase1は “不可逆” を避ける（Gate判定は実行禁止）
- Phone/録音/本人確認はSEALED（phase1_5以降）
- Responsible AIの現実解：
  - 「判断をログ化し追跡可能」+「人間が最終判断できる（Review/Gate）」+「Autoもpolicyで説明できる」
  +「結果まで追える（Outcome）」+「監査提出できる」+「冪等/復旧が仕様化」+「Context Receiptで何を見たか証明」構造が通りやすい  ← NEW
  - raw doc/PIIを保持しない方がリスクが下がる（Data‑Minimization）
# =========================================
# END: docs/REGULATORY.md
# =========================================


# =========================================
# BEGIN: docs/CHANGELOG.md
# =========================================
# CHANGELOG
- 2025-12-17: EXIT-FIRST へ全面リライト（10/10版）
  - phase1の主戦場を “Action Cloud（Exit）Private β” に変更
  - phase1コネクタは Webhook + Calendar Hold（ICS）に固定
  - Phoneは SEALED に降格
  - 配布は Team Viral（承認リンク）中心に再設計
  - Conformance + Treaty を phase1で“実装物”として完成させる

- 2025-12-29: 10/10²（KYA/Resilience/Ship Rails）追加
  - KYA（executor/principal/delegation）をphase1必須へ
  - webhook署名にtimestamp/スキュー検証
  - webhook target を事前登録制に固定
  - Planner Resilience（openai|mock|rules）
  - Ship Rails（小PR/CI conformance/SEALED lint）

- 2025-12-29: 10/10³（Gate1重視 + M&A Optionality）追加
  - Gate1/2/3の評価軸を明文化
  - Pricing Ladder追加
  - Provider Neutral を仕様に格上げ
  - Standard Flywheel / Data Room Ready / Giant’s Perimeter / Funding Rails を固定

- 2026-01-09: Slack Surface Strategy 統合 + 運用ブレ防止の固定
  - Slack/Email/Chatを入口（Dynamic）として扱い、Yohakuを確定（Confirm）として固定
  - 2メッセージルール（依頼→結果）を配布・デモ・指標に組み込み
  - KPI/EVALS に ACK/time_to_ack を追加
  - Gate表記を外部でも誤解されない形（¥10B/¥150B/¥1T）に統一
  - Webhook dev例外（DEV_ALLOW_LOCALHOST）を仕様として明文化
  - Copy to Slack 標準テンプレを固定（チャンネルを荒らさない）
  - ICP discovery questions（5問）を追加
  - API prefix（/v1 と /api/v1）を明文化

- 2026-01-11: Responsible AI（運用と統制）文脈を統合（Evidence‑First + Data‑Minimization + MCP‑Ready）
  - Evidence Pack（decision_rationale / data_sources(ref+hash) / model_info / context_refs）をReceipt/Ledger必須に
  - Data‑Minimization（raw doc/PII/営業秘密を保持しない）をSecurity/PRD/Conformanceに反映
  - Conformanceに T22/T23 を追加（Evidence Pack / refs_only）
  - receipt_integrity を “署名検証 + 必須フィールド欠損なし” に拡張（Truth+Evidence）
  - Audit Bundle（提出用zip/json）を追加（raw docなし）
  - MCPは phase1で “保存のみ” に固定（同期/取得はSEALED）

- 2026-01-13: Approval Lanes（Auto/Review/Gate）を統合（Human optional. Accountability mandatory.）
  - Auto（policy approve）/ Review（human approve）/ Gate（二重承認）の概念を“仕様として固定”
  - receipt/ledger に approval_lane + principal_type を必須出力（欠損=fail）
  - Slack運用：Review/Gateは2メッセージ、Autoは結果のみ（ノイズ削減）
  - Treaty/EVALS/Scorecard に approval_lane_coverage と auto_lane_rate を追加
  - phase1では Gate lane の不可逆実行は禁止（Gate判定は403が正解）

- 2026-01-21: Authorization-first（Approve=Authorization）+ Outcome Pack + PROD Idempotency を統合（Human前提を完全に除去 / 堅い堀を最小信号で作る / misexecを構造で潰す）
  - “Approve = 人間クリック” の誤解を排除し、外部説明を Authorization object に統一
  - /confirmは常に Authorization（human/policy）必須（Accountability mandatory）
  - Outcome Pack（結果/事故/停止/上書きの最小信号）をReceipt/Ledger/Audit Bundleへ追加
  - outcome_pack_coverage をKPI/Treaty/Scorecardに追加（phase1は段階導入）
  - response body/生ログを持たない方針を明文化（hashのみ可）
  - ConfirmRequest（tenant×idempotency）+ request_hash(T03) + fencing(id+confirm_id) + Receipt.confirm_id復旧 を統合（202永久詰み/ABA/二重実行を潰す）

- 2026-02-11: 10/10⁴ – Context Receipt（署名付きコンテキスト証明）を統合（監査の決定打 / コネクタ地獄を回避）
  - Context Receipt（context_receipts）を /plan /confirm で任意受け取り
  - tenantごとに issuer registry（公開鍵）を持ち、署名検証して保存（raw無し）
  - request_hash に context_receipts_digest を含めて T03（409）を厳密化
  - Conformanceに T35〜T38（ContextReceipt）を追加
  - phase1は Context Capture（取得/同期）をSEALED（BYO Context Providerで勝つ）
# =========================================
# END: docs/CHANGELOG.md
# =========================================