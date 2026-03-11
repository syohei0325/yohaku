# Yohaku Action Cloud – 設計パートナー獲得（Warm/Cold両対応）

## 使い方（最短）
- まずは Warm intro 3件に「JP短文版」を送る（**録画を待たずに今すぐ**）
- 反応があったら、同じスレッドに「45秒デモ + 4スクショ」を追送
- 目的は1つ：**15分デモ通話**の確定

---

## 共通：差し込み変数
- `{NAME}`: 相手の名前
- `{COMPANY}`: 会社名
- `{ROLE}`: 役職
- `{DEMO_URL}`: 45秒デモ動画URL（mp4 / loom / gif）
- `{SCREENSHOT_URL}`: スクショまとめURL（GitHub/Notion等）
- `{GITHUB_URL}`: リポジトリ or README
- `{CAL_URL}`: 予定調整リンク（なければ「候補3つ」）
- `{OFFER}`: 設計パートナー条件（例：60日無料 / 週1フィードバック）

---

# 0) Warm intro依頼（紹介者向け）— **今すぐこれを送る**

## JP（超短文）

**件名：**
```
15分だけ、AI自動化の「承認/証跡/停止」見てほしい
```

**本文：**
```
{NAME}さん、いま「AI/自動化が本番で勝手に実行して事故る」問題に対して、  
**承認（Approve）×証跡（Receipt）×停止（Freeze）**を"30分導入"で入れる Confirm Layer を作ってます。

もし {COMPANY} 周りで「自動化/エージェント運用（SRE/Ops/Platform/IT）」やってる人いたら、
15分だけ繋いでもらえませんか？（45秒デモあります。今日中に送れます）

設計パートナー：60日無料 / 週1フィードバック / 3社限定
```

---

# 1) ICP：Enterprise IT / SRE / Ops（最優先）

## 件名案
- 「自動化が増えて、実行責任（誰が承認したか）が崩れる」対策を30分で
- SRE/Ops向け：AI/自動化の"本番実行"を安全にする Confirm Layer
- 監査/インシデント対応が速くなる「実行レシート」見てください（45秒）

## JP（メール/LinkedIn）
```
{NAME}さん、突然すみません。{ROLE} の文脈で刺さりそうで連絡しました。

AI/自動化が増えるほど、現場で一番詰まるのが  
**「実行前承認」「誰が承認したか（責任）」「監査証跡」「事故時に即停止」**の実装と運用だと思ってます。

Yohakuは **Plan → Approve → Confirm** の"確定レイヤー"で、
- Approve（TTL付き）で実行前に止める
- Receipt（署名/ハッシュ）で後から一発で説明できる
- KYA（executor/principal）で「誰が誰の代理でやったか」を残す
- Freezeで即停止（インシデント時のブレーキ）
- Evidence Pack（要点/参照元ref+hash/モデル情報）で「なぜその判断か」も短く残す  
※ raw doc/PIIは保持しない設計です（参照ID+hashのみ）

45秒デモ：{DEMO_URL}  
スクショ：{SCREENSHOT_URL}

もし、**"本番実行が怖くて止まってる自動化"**が1個でもあるなら、
15分だけ現状を見せてください。合う/合わない、その場で判断します。  
{CAL_URL}

設計パートナー：60日無料 / 週1フィードバック / 3社限定

（質問：直近6ヶ月で自動化が原因のインシデント、ありました？）
```

## EN（短く）
```
Hi {NAME} — reaching out because this seems relevant to {ROLE}.

As AI/automation scales, teams get stuck on:
**pre-approval, accountability (who approved), audit trail, and emergency stop.**

We're building Yohaku, a neutral **Confirm Layer**:
Plan → Approve (TTL) → Confirm (idempotent) → Receipt (signed/hash) + Ledger (append-only) + Freeze.
Also includes an **Evidence Pack** (short rationale + ref/hash sources + model info).  
We *don't* store raw docs/PII — refs+hash only.

45-sec demo: {DEMO_URL}  
Screenshots: {SCREENSHOT_URL}

If you have even one workflow that's "too scary to run in prod", can we do a 15-min call?  
{CAL_URL}

Design Partner: 60 days free / weekly feedback / 3 slots only
```

---

# 2) ICP：WebhookまみれSaaS（2番手）

## 件名案
- Webhook運用（署名/冪等/リトライ）＋「承認/証跡/停止」をまとめて30分
- Svix/Hookdeckの"配送"に、AI時代の"実行責任"を足す話
- 「二重実行/事故」が怖いWebhook運用、どうしてますか？

## JP
```
{NAME}さん、{COMPANY} のWebhook/連携が多い文脈で刺さると思い連絡しました。

Webhookは自前でやろうとすると、署名/冪等/リトライ/リプレイ対策/監視が地獄で、
さらにAI/自動化が絡むと **「誰が確定したか」**がないと事故る、が現実だと思ってます。

Yohakuは
- Webhook配送（署名+timestamp+retry+idempotency）
- その上に Approve/KYA/Ledger/Freeze を載せて "責任ある実行" を成立させる
という設計です。

45秒デモ：{DEMO_URL}  
スクショ：{SCREENSHOT_URL}

15分だけ、今のWebhook運用（失敗時の再送/監視/責任追跡）を見せてもらえたら、
「どこが危ないか」「Yohakuで潰せるか」すぐ判断します。  
{CAL_URL}

設計パートナー：60日無料 / 週1フィードバック / 3社限定
```

---

# 3) ICP：bits→atoms（現場/供給網/エネルギー）— 3社目以降

## 件名案
- "bits→atoms" になるほど、AI自動化は「停止」と「証跡」が必須になる
- 現場系自動化の事故コストを下げる：承認×証跡×停止のConfirm Layer
- 監査できるAI自動化：実行レシート（署名/ハッシュ）を残す

## JP
```
{NAME}さん、現場に近い自動化（設備/物流/供給網/エネルギー）の文脈だと、
AI/自動化の価値と同時に **事故コスト**が跳ねるので、  
「承認」「証跡」「即停止」がインフラになると思ってます。

Yohakuは、AIが"提案"じゃなく"実行"する時代に向けて、
Plan → Approve → Confirm を **責任が成立する形**で提供します。
- KYA（誰が・誰の代理で）
- Receipt（署名/ハッシュ）＋Ledger（追跡）
- Freeze（緊急停止）
- Evidence Pack（短い要点 + 参照元ref+hash + モデル情報）
※ raw doc/PIIは保持しません（参照ID+hashのみ）

45秒デモ：{DEMO_URL}  
スクショ：{SCREENSHOT_URL}

もし "本番に入れるのが怖くて止まってる自動化" があるなら、
15分だけ現状を聞かせてください。  
{CAL_URL}

設計パートナー：60日無料 / 週1フィードバック / 3社限定
```

---

# フォローアップ（共通）

## Follow-up #1（2日後）
```
{NAME}さん、リマインドです。  
45秒デモ：{DEMO_URL}  
「今の運用で一番怖いポイント」だけでも聞かせてもらえたら、合う/合わないすぐ出します。{CAL_URL}
```

## Follow-up #2（6〜7日後 / 最終）
```
{NAME}さん、これ最後の連絡にします。  
もし今は優先度低ければスルーでOKです。  
逆に「自動化の本番実行が怖い/監査が詰まる」タイミングが来たら、いつでも声かけてください。
```

---

# 今日の勝ち手順（微調整版）

## 1. **今すぐ：Warm intro 3件に超短文投げる**（録画を待たない）
```
「今夜45秒デモ送るので、合いそうなら15分だけください」
```

## 2. **録画 + 変換**（30分）
```bash
# 録画実行
open /Users/koyamasyohei/Yohaku/RECORDING_GUIDE_DETAILED.md

# 整理
./scripts/organize-demo-assets.sh

# mp4/gif変換
ffmpeg -i docs/demo/mvp-flow.mov -vcodec h264 -acodec aac docs/demo/mvp-flow.mp4
ffmpeg -i docs/demo/mvp-flow.mov -vf "fps=10,scale=800:-1:flags=lanczos" docs/demo/mvp-flow.gif
```

## 3. **README更新**（10分）
```markdown
# 構成（シンプル）
1. 45秒デモ動画
2. 3行価値（承認×証跡×停止）
3. 使い所（誰向け）
4. 15分CTA
```

## 4. **返信来た人にデモ追送**
```
デモできました！{DEMO_URL}
15分通話、いつがいいですか？{CAL_URL}
```

## 5. **通話で「YESが出た論点」からConformance/Audit Bundleを足す**

---

# 設計パートナー条件（最終版）

```
✅ 60日無料（Platform Fee + Usage）
✅ 週次で使う（confirm >= 50/week目安）
✅ 週1回15分フィードバック
✅ ロゴ/事例は任意（強制しない）
✅ 3社限定（先着順）
```

---

# 注意点

## ❌ やらない
- スライド作成（最初は不要）
- 長文メール（3段落まで）
- 完璧を待つ（送って反応を取る）
- SOC2/ISO等の約束（phase1では言わない）

## ✅ やる
- 録画を待たずにWarm投げる
- 45秒動画 + 4スクショで十分
- 15分のヒアリングが本番
- 相手の詰まったところを聞いて改善

---

**今すぐWarm intro 3件に超短文を送ってください！🚀**
