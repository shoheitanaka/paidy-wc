---
name: staging-test
description: Paidy for WooCommerce（paidy-wc）のステージングサイトで、Claude in Chrome（ブラウザ自動操作）を使って決済の一連の受け入れテストを回す。ZIP の置き換え → 設定確認 → テスト決済（成功・拒否）→ サンクスページの裏取りと改ざんの拒否 → キャプチャ・close・返金・取消時の残額返金 → Webhook とデバッグログの点検 → 報告書の保存まで。「ステージングでテストして」「ステージングで動作確認して」「決済の一連のテストをお願い」「ZIP をステージングに入れて確かめて」「キャプチャ / 返金 / close をステージングで確認」「B-xx をステージングで再現して」「実 Webhook を確かめて」などと言われたら、Chrome を操作し始める前に必ずこのスキルを読む。ステージングの URL を伝えられただけでも、決済プラグインの動作確認の文脈ならこのスキルを使う。
---

# ステージング受け入れテスト（paidy-wc）

wp-env では本体が起動しない（backlog B-13）ので、実決済・実 Webhook・管理画面の実挙動はステージングでしか確かめられない。
このスキルは、人手で繰り返していた確認を、ユーザーがログイン済みの Chrome を借りて **一定の順序・一定の証拠** で回し、
結果を残すためのもの。期待値の正は `docs/architecture.md`「決済フロー」。ZIP の作り方と個々の確認の背景は `docs/development.md`「ステージング用 ZIP」。

## 守ること（決済サイトを触るので最初に読む）

- **ログインはしない。** ユーザーが Chrome（拡張が入っているプロファイル）で管理者としてログイン済みなのが前提。
  `/wp-admin/` を開いてログイン画面が出たら止めてログインを頼む。パスワード・2FA コードは入力しない
- **環境を確かめてから決済する。** 決済設定の「環境」が「サンドボックス」（`environment=sandbox`）であることを目で確認してから
  チェックアウトする。Live ならテストを中止して報告する。Paidy は別のサンドボックス環境を持たず、**テストキーで本番 API に対して
  「請求されないテスト決済」を作る**方式（https://paidy.com/docs/en/testing.html ）なので、キーの取り違えがそのまま実決済になる
- **状態を変える操作は計画を見せて承認を得る。** ZIP の置き換え・テスト注文の作成・注文状態の変更・返金を、実行前に件数つきで
  列挙し、ユーザーの「進めて」を受けてから動く。計画外の操作が必要になったら都度聞く。承認は列挙した操作にだけ有効
- **秘密と識別情報を残さない。** API キーは読まない・転記しない（設定画面はパスワード欄）。ステージングのホスト名・管理者名・顧客 PII は
  報告書・docs・コミット・会話の要約に書かない（リポジトリは公開）。ホスト名は auto-memory の reference メモにだけ持つ
- **削除しない。** テスト注文はゴミ箱に入れず残す（証拠になる。消すのはユーザー）。プラグインの無効化・削除もしない
- **`confirm()` を出す UI に注意。** WooCommerce の返金ボタンは `confirm()` を出し、Chrome 拡張が固まる。クリック前に
  `javascript_tool` で `window.confirm = () => true;` を入れる。注文状態の変更（「更新」ボタン）はダイアログを出さない
- **Paidy Checkout のモーダルは操作できない。** `checkout-v2.paidy.com` の全画面 iframe で、拡張のクリック・キー入力・`find` は届かない
  （2026-10-14 の初回実走で 4 通り試して全滅）。モーダル内（次へ → 認証コード → 完了）は **ユーザーに頼む**。
  注文を別タブで複数用意してから一度に頼むと往復が減る（下の「3. テストケース」）

## 入力

| 必要なもの | どこから |
|-----------|---------|
| ステージングの URL | auto-memory の `paidy-wc-staging-site`（reference）。無ければユーザーに聞き、初回の後に保存する |
| 置き換える ZIP | `bash bin/build-zip.sh` の出力 `dist/paidy-wc-<hash>[-dirty].zip`。報告書にはこの名前を書く（`-dirty` は未コミットの変更を含む） |
| テスト範囲 | 既定はフル（T1〜T8）。「B-xx の再現」「返金だけ」など指定があれば該当ケースだけ |
| テスト商品 | ショップの安価で在庫のある単純商品。無ければユーザーに作ってもらう（商品作成は範囲外） |

**Paidy テスト用の購入者（公式）**: 成功 `successful.payment@paidy.com` / 拒否 `rejected.payment@paidy.com`、電話 `08000000001`、
認証コード `8888`。受領ページは **注文の請求先メール・電話** を Paidy Checkout の buyer に渡すので、WooCommerce のチェックアウトの
請求先にこれを入れると結果が決まる。値は初回に公式ページで確かめ、変わっていたら `references/checklist.md` を直す。

## 手順

### 0. 準備（ブラウザを触る前）

1. `bash bin/build-zip.sh` → ZIP 名を控える
2. ブラウザツールを **1 回の** ToolSearch で読み込む:
   `select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__tabs_create_mcp,mcp__claude-in-chrome__tabs_close_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__computer,mcp__claude-in-chrome__read_page,mcp__claude-in-chrome__find,mcp__claude-in-chrome__form_input,mcp__claude-in-chrome__get_page_text,mcp__claude-in-chrome__browser_batch,mcp__claude-in-chrome__javascript_tool,mcp__claude-in-chrome__file_upload,mcp__claude-in-chrome__read_console_messages`
3. `tabs_context_mcp` → `tabs_create_mcp` で専用タブを作る。既存タブは使わない
4. `<staging>/wp-admin/` を開き、ダッシュボードが出る（ログイン済み）ことを確認する
5. WooCommerce > 設定 > 決済 > あと払い（ペイディ）: 有効 / 環境 = サンドボックス / デバッグモード = 有効 /
   「Webhook について」に `<staging>/wp-json/paidy/v1/order/` が出ている。デバッグが無効なら有効化を計画に入れる（ログが無いと合否を判定できない）
6. WooCommerce > ステータス > ログ で source `paidy-wc` の最新ファイルの更新時刻を控える（ベースライン）。**ファイル名は UTC 日付**
   （`paidy-wc-YYYY-MM-DD`）なので JST の朝の実走は前日分と当日分の 2 ファイルにまたがる。
   `admin.php?page=wc-status&tab=logs&view=single_file&file_id=paidy-wc-YYYY-MM-DD` で直接開ける
7. WooCommerce > ステータス から WP / WC / PHP の版、注文データストア（CPT なら注文編集は `post.php?post=N&action=edit`、HPOS なら
   `admin.php?page=wc-orders&action=edit&id=N`）、チェックアウトがブロックかクラシックかを控える。注文一覧で最新の注文番号も控える

### 1. 計画の提示と承認

次の形で出し、「進めて」を待つ。承認前に状態を変える操作をしない。

```
ステージング受け入れテストの計画（ZIP: paidy-wc-<hash>.zip）
- プラグインの置き換え（1 回）
- テスト注文の作成: 成功 2 件（T1・T5 用）、拒否 1 件（T2）
- 注文状態の変更: 完了 1 回（T4）、キャンセル 2 回（T5・T7）
- 返金: 部分返金 2 回（T6）+ キャンセル時の残額返金 1 回（T7。自動）
- 設定変更: なし（またはデバッグモードの有効化）
テスト注文は残します。Claude の操作はおよそ 40 分、Paidy モーダルの操作を 3 回お願いします（成功 2 回・拒否 1 回）。
```

### 2. プラグインの置き換え

- プラグイン > 新規プラグインを追加 > プラグインのアップロード。`find` で file input の ref を取り、`file_upload` に ZIP の絶対パスを渡す。
  拒否されたら（セッションに共有されたファイルしか渡せない）ユーザーに手動でのアップロードを頼み、置き換えの確認画面まで進めてもらう
- 「今すぐインストール」→ 既存版との比較画面 →「アップロードしたもので現在のものを置き換える」→「プラグインの更新が完了しました」→
  プラグイン一覧で有効のまま。版は 1.5.2 のまま（ZIP は版を上げない）なので、入れ替わった事実は ZIP 名と成功メッセージで記録する

### 3. テストケース

`references/checklist.md` に 1 ケースずつ「操作 → 期待する結果 → 証拠の取り方 → NG の見え方」がある。**ケースを始める前に該当節を読む。**
順序は T1 → T2 → T3 → T4 → T5 → T6 → T7 → T8。T4・T6・T7 は T1 の注文を使い、T5 には別の成功注文が要るので T1 を 2 回行う。
各ケースの終わりに証拠（注文番号・注文メモの文言・ログ行）を控え、次へ進む。途中で FAIL が出ても、他のケースに影響しなければ続ける。

**注文の作り方（ブロックチェックアウト。初回実走で確かめた手順）**

1. `checkout/?add-to-cart=<product_id>&quantity=1` を開く（商品ページの `button[name=add-to-cart]` の `value` が ID）
2. メールは座標クリックではなく JS で入れる（レイアウトがずれると別の場所を触る）:
   `const el=document.querySelector('#email'); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,'<mail>'); el.dispatchEvent(new Event('input',{bubbles:true})); el.dispatchEvent(new Event('change',{bubbles:true})); el.blur();`
3. JS で `#email` / `#shipping-phone` / 選択中の決済方法 / 明細数 / 合計を読み、**全部が期待どおりのときだけ**
   `.wc-block-components-checkout-place-order-button` を `.click()` する（同じ JS 内で条件分岐すると往復が 1 回で済む）
4. `order-pay/<N>/` に移り Paidy Checkout が自動で開いたら、そのタブは触らずにユーザーに渡す
5. **同じカートで次の注文を作ると WooCommerce はセッションの支払い待ち注文を再利用して上書きする**（#1161 が成功用から拒否用に変わった）。
   次の注文は商品や数量を変える（別商品を足す等）か、前の注文の支払いが終わってから作る。カートに余分に入ったら Store API で直す:
   `fetch('/wp-json/wc/store/v1/cart')` → ヘッダー `Nonce` と `items[0].key` → `POST …/cart/update-item {key, quantity:1}`
6. 成功用と拒否用を別タブで用意し、モーダルの操作を一度に頼む。拒否用は「他の決済方法を選ぶ」まで押してもらう（押さないと戻り先に遷移しない）

**管理画面の操作（JS。往復が少なく確実）**

- 状態変更: `#order_status` に `wc-completed` / `wc-cancelled` を入れて `change` を発火 → `button.save_order` を `.click()` → 8 秒待つ
- 返金: `window.confirm=()=>true;` → `button.refund-items` → `#refund_amount` に金額 → `change` → `button.do-api-refund`（「… によって ¥N を返金します」）→ 10 秒待つ（ajax 後に自動で再読み込み）
- 注文メモ: `ul.order_notes li`。返金行: `tr.refund`。取引 ID: `.woocommerce-order-data__meta`

### 4. ログの読み方

WooCommerce > ステータス > ログ。source `paidy-wc`。ファイルハンドラなら `paidy-wc-YYYY-MM-DD-<hash>.log` を開く。DB ハンドラなら
ソースで絞る。見る行:

| ログ行（先頭） | 意味 |
|---------------|------|
| `Paidy Payment succeeds to authorize and move to thank you page.` | サンクスページの裏取りに成功して `payment_complete()` した |
| `Paidy thank-you completion blocked: payment verification failed for order N` | 裏取り失敗（T3 ではこれが正）。続く `Paidy payment verification failed: ...` に理由 |
| `Paidy Webhook received.` | Webhook が到達した。続く本文の `status` を見る |
| `Send URL is following. : https://api.paidy.com/payments/pay_.../captures` | キャプチャ送信。`/close` `/refunds` も同様。**回数を数える** |
| `This is capture data.` / `This order is success cancellation data at Paidy.` / `This is refund data.` | 各 API の応答 |

文言は 1.5.2 の言語パックで日本語化されて出る（`references/checklist.md` 末尾の対応表）。**キャプチャの `Send URL` 行は出ない**
（フラグに `true` を渡していて記録されない。backlog 候補 → 報告書 2026-10-14）。キャプチャ回数は応答エントリ「キャプチャデータです。」で数える。
ページ本文を JS で `split('\n')` し、タイムスタンプ行でエントリに分けて読むと速い。

Webhook は非同期。注文メモとログは 30〜60 秒待って再読み込みしてから判定する。来ないときは Paidy 加盟店管理画面の Webhook 設定（テスト用）を
ユーザーに確かめてもらう。ステージングが外から届かない構成なら Webhook のケースは「未確認」と記録する（FAIL ではない）。

### 5. 報告

- `assets/report-template.md` を使って `docs/staging-tests/YYYY-MM-DD-paidy-wc-<hash>.md` に保存する（ホスト名は書かず「ステージング」とだけ）
- 会話には結果表（ケース / PASS・FAIL・SKIP・未確認 / 注文番号 / 一言）と FAIL の要点を出す
- FAIL は backlog 候補として提示する。B-番号の採番と `docs/review-backlog.md` への追記、`docs/DEVELOPMENT_PLAN.md` の
  「ステージングで確認」の記録はユーザーの確認後。**コミットはしない**（グローバル規約）

### 6. 後始末

- 作ったタブを閉じる（`tabs_close_mcp`）
- 初回なら staging URL を auto-memory に reference で保存し `MEMORY.md` に 1 行足す
- 手順で詰まった点・画面の違いは `references/checklist.md` / この SKILL.md に反映する（スキルは実行のたびに育てる）

## ブラウザ操作のコツ

- Paidy Checkout は `checkout-v2.paidy.com` の全画面 iframe。中は見えず、クリックもキーも届かない。ユーザーに操作を頼み、
  終わったら `location.pathname` と `transaction_id` の有無を JS で読む
- 受領ページ（`order-pay`）は window の load で自動起動する（`jQuery(window).on('load', paidyPay)`）。モーダルが出るまで 3〜5 秒待つ
- 決まった連続操作は `browser_batch` にまとめる（navigate → click → type → screenshot）。1 回の往復で済み、速い
- ブロックチェックアウトでは決済方法はカード内のラジオ。クラシックなら「あと払い（ペイディ）」ラジオと「Paidy へ進む」ボタン
- 管理画面の注文編集: 状態セレクト → 「更新」。注文メモは右カラム。再読み込みで Webhook のメモが増える
- 返金: 「返金」ボタン → 返金額 → 「¥N を Paidy で返金」。**押す前に** `window.confirm = () => true;`
- 10 分ルール: ゲスト注文の受領ページは注文から 10 分でメール確認フォームに変わる（`docs/development.md`）。管理者でログインして買うので
  会員注文になり影響しないが、受領ページ URL を開き直す T3 は注文から 10 分以内に行う

## 失敗モード

| 症状 | 原因と対処 |
|------|-----------|
| ログイン画面が出る | セッション切れ。ユーザーにログインしてもらい、同じタブで再開 |
| Paidy Checkout が出ない | テスト公開鍵が空 / 注文が `pending` でない / JS エラー。`read_console_messages` の pattern `paidy\|Paidy` で見る |
| サンクスページ後も注文が支払い待ち | 裏取り失敗。ログの `blocked` 行と理由（`amount mismatch` 等）を読む。Webhook で後から処理中になることもある |
| Webhook のメモが来ない | Paidy 側の Webhook URL 未設定 / ステージングが外から見えない / 署名鍵の不一致（ログに `Invalid signature`）。`Paidy Webhook received.` の有無で切り分け |
| 返金ボタンで拡張が固まる | `confirm()`。ユーザーにダイアログを閉じてもらい、`window.confirm` を差し替えてから再試行 |
| close / 返金のメモが 2 件以上、409 | 旧 B-18（フックの多重登録）の再発。`Send URL` の回数を数えて報告 |
| `file_upload` が拒否される | セッションに共有されていないパス。ユーザーに手動アップロードを頼む |
| 注文メモが英語 | 新しい文字列は WordPress.org の言語パックにまだ無い（正常）。checklist は英語の原文で照合する |
| 2 件目の注文が前の注文番号になる | 同じカートでの再チェックアウトはセッションの支払い待ち注文を再利用する。商品や数量を変える |
| 座標クリックで別の場所を押した | 通知バナーやビューポート高さでレイアウトがずれる。入力は JS、ボタンは `.click()`、押す前に `zoom` で確認 |
