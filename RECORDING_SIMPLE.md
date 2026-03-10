# 🎬 録画手順（超シンプル版）

## ✅ 準備完了！すぐに録画できます

---

## 📍 ステップ1：録画開始（1分）

### 1-1. QuickTime Playerを起動

1. **Spotlight（Cmd + Space）**で「QuickTime」と入力
2. QuickTime Playerが開いたら：
   - メニュー → **「ファイル」→「新規画面収録」**
3. 録画ボタンの横の **▼** をクリック
   - **「選択部分を収録」**を選ぶ
4. ブラウザウィンドウ全体を四角で囲む
5. **赤い録画ボタンをクリック** → 録画開始！

---

## 📍 ステップ2：デモ実行（45秒）

### 2-1. ブラウザで開く

```
http://localhost:3000/demo
```

→ **自動的にセットアップが開始され、Approve Pageに遷移**（5秒）

---

### 2-2. Approve Page（15秒）

**画面を見せながら、ゆっくり下にスクロール：**
- 📋 実行内容（Webhook送信、Calendar Hold）
- 🚦 実行責任（KYA）
- ⏱️ 残り時間
- Risk: low
- ✓ Reversible
- ✓ Idempotent

**「✅ 承認して実行」ボタン**をクリック

---

### 2-3. Receipt Page（自動遷移、20秒）

**ゆっくり下にスクロールして全体を見せる：**

1. **一番上**（3秒）
   - ✅ Status: 成功
   - Receipt ID

2. **新機能セクション**（5秒） ← **ここが最重要！**
   - 🚦 **Approval Lane**（青いバッジ：👤 Review）
   - 🚦 **Principal Type**（青いバッジ：👤 Human）

3. **その他のセクション**（7秒）
   - 🔐 実行責任（KYA）
   - 📊 Evidence Pack
   - 🔒 Truth-First（Receipt検証）
   - 📋 実行結果（2件：Webhook + Calendar Hold）

4. **Jobs Table リンク**をクリック（5秒）

---

### 2-4. Jobs Table（5秒）

- Status: succeeded を確認
- Attempts: 1/8
- Target URL確認

---

### 2-5. （任意）Receiver Log

- 新しいタブで `http://localhost:4001` を開く
- ✅ 署名検証成功のログを確認

---

## 📍 ステップ3：録画停止

- 画面上部のメニューバーに **■（停止ボタン）**
- **停止ボタンをクリック**
- デスクトップに `Screen Recording [日時].mov` として保存

→ **録画完了！** 🎉

---

## 📍 ステップ4：スクショ4枚（5分）

**Cmd + Shift + 4** で範囲を選択して撮影：

### 1枚目：Approve Page
1. ブラウザで `http://localhost:3000/demo` を開く
2. 自動的にApprove Pageに遷移（少し待つ）
3. **Cmd + Shift + 4** → Approve画面全体を囲む → クリック
4. デスクトップに保存される → ファイル名を **`01-approve.png`** に変更

### 2枚目：Receipt Page（Lanesが見える位置）
1. Approve Pageで「✅ 承認して実行」をクリック
2. Receipt Pageに遷移
3. **🚦 Approval Lane** と **🚦 Principal Type** が見える位置にスクロール
4. **Cmd + Shift + 4** → その部分を囲む → クリック
5. ファイル名を **`04-receipt-lanes.png`** に変更

### 3枚目：Jobs Table
1. Jobs Tableのタブを開く（または再度リンクをクリック）
2. Status: succeeded が見える位置
3. **Cmd + Shift + 4** → Jobs Table全体を囲む → クリック
4. ファイル名を **`03-jobs-succeeded.png`** に変更

### 4枚目：Receiver Log
1. ブラウザで新しいタブを開く
2. `http://localhost:4001` にアクセス
3. ✅ 署名検証成功のログが見える
4. **Cmd + Shift + 4** → ログ全体を囲む → クリック
5. ファイル名を **`02-receiver-verified.png`** に変更

→ **スクショ完了！** 📸

---

## 📍 ステップ5：ファイル整理（1分）

ターミナルで実行：

```bash
cd /Users/koyamasyohei/Yohaku
./scripts/organize-demo-assets.sh
```

**確認：**
```
✅ Found video: Screen Recording...
✅ Found screenshot 1: ...
✅ Found screenshot 2: ...
✅ Found screenshot 3: ...
✅ Found screenshot 4: ...
✅ Done!
```

---

## 📍 ステップ6：動画変換（5分）

### 6-1. ffmpegをインストール（初回のみ）

```bash
brew install ffmpeg
```

（すでにインストール済みの場合はスキップ）

---

### 6-2. 動画を変換

```bash
cd /Users/koyamasyohei/Yohaku
./scripts/convert-video.sh
```

**確認：**
```
✅ Created: docs/demo/mvp-flow.mp4
✅ Created: docs/demo/mvp-flow.gif
✅ Conversion complete!
```

---

## 📍 ステップ7：README更新（2分）

### 7-1. README.mdを開く

```bash
open /Users/koyamasyohei/Yohaku/README.md
```

---

### 7-2. コメントアウトを解除（2箇所）

#### **箇所1：動画セクション**

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

**やること：**
- 3行削除：`**録画後にここに動画を埋め込みます**`、`<!-- `、`-->`

---

#### **箇所2：スクショセクション**

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

**やること：**
- 3行削除：`**録画後にここにスクショを埋め込みます**`、`<!--`、`-->`

---

### 7-3. 保存

**Cmd + S** で保存

→ **README更新完了！** 📝

---

## ✅ 完了チェックリスト

- [ ] 録画完了（45秒）
- [ ] スクショ4枚撮影完了
- [ ] ファイル整理完了（organize-demo-assets.sh）
- [ ] 動画変換完了（convert-video.sh）
- [ ] README.md更新完了（コメントアウト解除）

---

## 🚨 トラブルシューティング

### Q: 2回目の録画でエラーが出る

```bash
# データベースをリセット
./scripts/reset-demo.sh

# サーバーを再起動
./scripts/start-servers.sh
```

---

### Q: サーバーが起動しない

```bash
# 古いプロセスを終了
lsof -ti:3000 | xargs kill -9
lsof -ti:4001 | xargs kill -9

# 再起動
./scripts/start-servers.sh
```

---

### Q: 録画ファイルが見つからない

```bash
# デスクトップで確認
ls -la ~/Desktop/Screen*.mov

# 手動で移動
mv ~/Desktop/Screen\ Recording*.mov docs/demo/mvp-flow.mov
```

---

## 🎯 今すぐ始めてください！

1. **QuickTime Playerを起動**
2. **画面収録を開始**
3. **ブラウザで `http://localhost:3000/demo` を開く**
4. **45秒のデモを実行**
5. **録画停止**

**全ての準備が整っています！🚀**
