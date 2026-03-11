# 🎬 録画を開始する（超簡単ガイド）

## ✅ 準備完了しました！

- ✅ Next.js（http://localhost:3000）起動中
- ✅ Receiver（http://localhost:4001）起動中
- ✅ Webhook Worker 起動中
- ✅ ブラウザでSetup Wizardを開きました
- ✅ QuickTime Playerを起動しました

---

## 🎬 今すぐやること（3ステップ）

### ステップ1: 録画を開始（10秒）

QuickTime Playerが開いているので：

1. **メニューバーの「ファイル」をクリック**
2. **「新規画面収録」をクリック**
3. **赤い録画ボタンをクリック**
4. **「画面全体」または「選択したウィンドウ」を選ぶ**
5. **「収録」ボタンをクリック**

**→ 録画が開始されます**

---

### ステップ2: デモを実行（45秒）

録画が開始したら、ブラウザに戻って以下を実行：

#### 0:00-0:10 Setup Wizard
1. ブラウザでSetup Wizardを見せる
2. 下にスクロール
3. **「🚀 Send Test Plan」ボタンをクリック**

#### 0:10-0:20 Approve Page
1. 自動で出てくる**Approveリンクをクリック**
2. Approve Pageを3秒見せる（TTL/KYA/Risk）
3. **「Approve」ボタンをクリック**

#### 0:20-0:30 Receipt Page
1. 自動でReceiptに遷移
2. Receiptページを5秒見せる（KYA/Job Status）

#### 0:30-0:40 Jobs Table
1. 新しいタブで **http://localhost:3000/jobs** を開く
2. succeeded の行を見せる

#### 0:40-0:45 Receiver Verification
1. ターミナルに切り替え
2. Receiverログで **✅ Signature verified** を見せる

---

### ステップ3: 録画を停止（5秒）

**画面上部のメニューバーに「停止」ボタンが出てる**のでクリック

**または `Command + Control + Esc` を押す**

**→ 動画がデスクトップに保存されます**

---

## 📸 録画後：スクショを撮る（5分）

録画が終わったら、以下の4枚を撮る：

### 撮り方（全部同じ）
1. **`Shift + Command + 4` を押す**
2. **マウスで範囲を選択してクリック**
3. **デスクトップに自動保存される**

### 撮るもの
1. **Approve Page**（Setup → Send Test Plan → Approveページ）
2. **Receipt Page**（Approve → Receipt）
3. **Jobs Table**（http://localhost:3000/jobs）
4. **Receiverログ**（ターミナル、✅ Signature verified）

---

## 📦 完了後：ファイルを整理（10秒）

ターミナルで以下を実行：

```bash
cd /Users/koyamasyohei/Yohaku
./scripts/organize-demo-assets.sh
```

**このコマンドが自動で:**
- デスクトップから動画とスクショを `docs/demo/` に移動
- ファイル名を整理
- 内容を表示

---

## ✅ 完了確認

```bash
ls -la docs/demo/
```

**この5つのファイルが表示されればOK:**
```
01-approve.png
02-receiver-verified.png
03-jobs-succeeded.png
04-receipt-kya.png
mvp-flow.mov
```

**この出力をCursorに貼れば、残りは全部自動でやります！**

---

## 🎬 準備完了！今すぐ録画を開始してください。

**QuickTime Player → ファイル → 新規画面収録 → 録画ボタン**

**質問があれば、いつでもCursorに聞いてください。**
