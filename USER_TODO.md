# 🎯 あなたがやること（録画と送信）

## ✅ 準備完了したもの

私（AI）が以下を完了しました：

1. ✅ **Approval Lanes（Auto/Review/Gate）の実装**
   - Prisma Schema更新 + DB反映
   - API更新（/v1/approve, /v1/confirm）
   - Receipt UI更新（新しいLanesセクション表示）

2. ✅ **録画ガイド作成**
   - `RECORDING_GUIDE.md` - 詳細な手順書

3. ✅ **README.md更新**
   - 新機能の説明追加
   - 動画・スクショの埋め込み準備完了（コメントアウト済み）

4. ✅ **自動化スクリプト作成**
   - `scripts/start-servers.sh` - サーバー起動
   - `scripts/webhook-receiver.js` - Webhook受信サーバー
   - `scripts/organize-demo-assets.sh` - ファイル整理
   - `scripts/convert-video.sh` - 動画変換

5. ✅ **アウトリーチテンプレート**
   - `OUTREACH_TEMPLATE.md` - 3パターン準備完了

---

## 📋 あなたがやること（3ステップ）

### 🎬 ステップ1：録画（30分）

#### 1-1. サーバーを起動
```bash
cd /Users/koyamasyohei/Yohaku
./scripts/start-servers.sh
```

**確認：**
- ✅ `http://localhost:3000` が開く
- ✅ `http://localhost:4001` が開く

---

#### 1-2. 録画実行（45秒）

**手順：**

1. **QuickTime Player**を起動
   - メニュー → 「ファイル」→「新規画面収録」
   - 「選択部分を収録」を選ぶ
   - ブラウザウィンドウを囲む
   - **録画開始ボタン（赤丸）をクリック**

2. **デモを実行（45秒）**
   ```
   ① Setup Wizard（http://localhost:3000/setup）
      - Webhook URL: http://localhost:4001/webhook
      - Calendar Email: demo@example.com
      - [保存して次へ]
   
   ② Approve Page（自動遷移）
      - 実行内容を確認（10秒見せる）
      - [✅ 承認して実行]
   
   ③ Receipt Page（自動遷移）
      - ゆっくりスクロール（15秒）
      - 🚦 Approval Lane セクション（新機能！）
      - 🔐 KYA セクション
      - 📊 Evidence Pack セクション
      - Jobs Table リンクをクリック
   
   ④ Jobs Table
      - Status: succeeded を確認（5秒）
   
   ⑤ （任意）Receiver Log
      - http://localhost:4001 を開く
      - ✅ 署名検証成功を確認
   ```

3. **録画停止**
   - QuickTime Playerのメニューバー → 停止ボタン
   - デスクトップに `Screen Recording [日時].mov` として保存される

---

#### 1-3. スクリーンショット撮影（4枚）

**Cmd + Shift + 4** で範囲を選択して撮影：

1. **Approve Page**（承認画面）
   - ファイル名を `01-approve.png` に変更
   
2. **Receipt Page**（Lanesセクション表示）
   - 🚦 Approval Lane が見える位置
   - ファイル名を `04-receipt-lanes.png` に変更

3. **Jobs Table**
   - Status: succeeded が見える
   - ファイル名を `03-jobs-succeeded.png` に変更

4. **Receiver Log**（http://localhost:4001）
   - ✅ 署名検証成功のログ
   - ファイル名を `02-receiver-verified.png` に変更

---

#### 1-4. ファイル整理
```bash
cd /Users/koyamasyohei/Yohaku
./scripts/organize-demo-assets.sh
```

**確認：**
```bash
ls -la docs/demo/
# 以下のファイルがあることを確認：
# - mvp-flow.mov
# - 01-approve.png
# - 04-receipt-lanes.png
# - 03-jobs-succeeded.png
# - 02-receiver-verified.png
```

---

### 🎥 ステップ2：動画変換（10分）

```bash
cd /Users/koyamasyohei/Yohaku
./scripts/convert-video.sh
```

**ffmpegがない場合：**
```bash
brew install ffmpeg
```

**確認：**
```bash
ls -la docs/demo/
# 以下のファイルが追加されていることを確認：
# - mvp-flow.mp4
# - mvp-flow.gif
```

---

### 📝 ステップ3：README.mdを更新（5分）

`README.md` を開いて、以下のコメントアウトを解除：

**変更前：**
```markdown
## 🎬 45秒デモ

**録画後にここに動画を埋め込みます**

<!-- 
[![デモ動画](docs/demo/mvp-flow.gif)](docs/demo/mvp-flow.mp4)
[▶️ 動画を見る（mp4）](docs/demo/mvp-flow.mp4)
-->
```

**変更後：**
```markdown
## 🎬 45秒デモ

[![デモ動画](docs/demo/mvp-flow.gif)](docs/demo/mvp-flow.mp4)

[▶️ 動画を見る（mp4）](docs/demo/mvp-flow.mp4)
```

同様に、スクリーンショットのセクションも解除：

**変更前：**
```markdown
## 📸 スクリーンショット

**録画後にここにスクショを埋め込みます**

<!--
| Approve Page | Receipt Page（Lanes表示） |
|--------------|---------------------------|
| ![Approve](docs/demo/01-approve.png) | ![Receipt](docs/demo/04-receipt-lanes.png) |

| Jobs Table | Receiver Verified |
|------------|-------------------|
| ![Jobs](docs/demo/03-jobs-succeeded.png) | ![Receiver](docs/demo/02-receiver-verified.png) |
-->
```

**変更後：**
```markdown
## 📸 スクリーンショット

| Approve Page | Receipt Page（Lanes表示） |
|--------------|---------------------------|
| ![Approve](docs/demo/01-approve.png) | ![Receipt](docs/demo/04-receipt-lanes.png) |

| Jobs Table | Receiver Verified |
|------------|-------------------|
| ![Jobs](docs/demo/03-jobs-succeeded.png) | ![Receiver](docs/demo/02-receiver-verified.png) |
```

---

## 📧 ステップ4：Warm intro 3件に送る（30分）

### テンプレートを開く
```bash
open /Users/koyamasyohei/Yohaku/OUTREACH_TEMPLATE.md
```

### 送る内容（超短文）

```
{NAME}さん、いま「AI/自動化が本番で勝手に実行して事故る」問題に対して、  
**承認（Approve）×証跡（Receipt）×停止（Freeze）**を"30分導入"で入れる Confirm Layer を作ってます。

もし {COMPANY} 周りで「自動化/エージェント運用（SRE/Ops/Platform/IT）」やってる人いたら、
15分だけ繋いでもらえませんか？（45秒デモあります。録画完了しました）

デモ：https://github.com/[your-repo]/blob/main/docs/demo/mvp-flow.mp4

設計パートナー：60日無料 / 週1フィードバック / 3社限定
```

### 送り先の優先順位
1. **Enterprise IT / SRE / Ops**（2件）
2. **WebhookまみれSaaS**（1件）

---

## ✅ 完了チェックリスト

- [ ] **録画完了**（45秒デモ）
- [ ] **スクショ4枚撮影完了**
- [ ] **ファイル整理完了**（organize-demo-assets.sh）
- [ ] **動画変換完了**（convert-video.sh）
- [ ] **README.md更新完了**（コメントアウト解除）
- [ ] **Warm intro 3件送信完了**

---

## 🚨 トラブルシューティング

### Q: サーバーが起動しない
```bash
# ポート確認
lsof -i :3000
lsof -i :4001

# プロセス終了
kill -9 [PID]

# 再起動
./scripts/start-servers.sh
```

### Q: 録画ファイルが見つからない
```bash
# デスクトップで検索
ls -la ~/Desktop/Screen*.mov

# 手動で移動
mv ~/Desktop/Screen\ Recording*.mov docs/demo/mvp-flow.mov
```

### Q: ffmpegがインストールできない
```bash
# Homebrewをインストール
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# ffmpegをインストール
brew install ffmpeg
```

---

## 📞 質問があれば

- 録画ガイド: `RECORDING_GUIDE.md`
- アウトリーチテンプレート: `OUTREACH_TEMPLATE.md`
- スクリプト: `scripts/` フォルダ

---

**🎬 録画を開始してください！**
