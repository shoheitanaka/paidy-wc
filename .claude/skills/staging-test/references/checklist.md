# テストケース（ステージング受け入れテスト）

各ケースは「前提 → 操作 → 期待する結果 → 証拠 → NG の見え方」。期待値の根拠は `docs/architecture.md`「決済フロー」の番号（F1〜F7）。
注文メモは **英語の原文**（msgid）で照合する。日本語訳がある文言は括弧で添えた。無いものは管理画面でも英語で出る。

Paidy テスト購入者（https://paidy.com/docs/en/testing.html ）:

| 目的 | メール | 電話 | 認証コード |
|------|-------|------|-----------|
| 成功 | `successful.payment@paidy.com` | `08000000001` | `8888` |
| 拒否 | `rejected.payment@paidy.com` | `08000000001` | `8888` |

請求先のその他の値（テスト用。個人情報ではない）: 姓 `テスト` 名 `太郎`、郵便番号 `100-0001`、東京都 千代田区千代田 `1-1`。

---

## T1 成功決済（F2〜F4: authorized → 処理中）

**前提**: 環境 = サンドボックス、デバッグ = 有効、在庫ありの商品。

**操作**
1. 商品ページ → カートに追加 → チェックアウトへ
2. 請求先: 上のテスト値。メール `successful.payment@paidy.com`、電話 `08000000001`
3. 決済方法「あと払い（ペイディ）」を選び「Paidy へ進む」（設定 `order_button_text`。既定は `Proceed to Paidy`）
4. 受領ページ `…/order-pay/N/?pay_for_order=true&key=wc_order_…` に移り、Paidy Checkout が自動で開く。メール・電話は請求先から入っている
5. **ここからはユーザー**（iframe は拡張から操作できない）: 「次へ」→ 認証コード `8888` → 承認完了 →
   `…/order-received/N/?key=wc_order_…&transaction_id=pay_…` へ遷移。2 回目以降の購入者はご利用方法の画面が省かれ、メール・電話の画面から始まる

**期待する結果**
- サンクスページに「ご注文ありがとうございます」。URL に `transaction_id=pay_` が付いている
- 管理画面の注文 N: 状態 **処理中**。「Paidy での支払い（pay_…）」のように取引 ID が表示される。在庫が 1 減っている
- 注文メモ: WooCommerce 標準の「支払い待ち から 処理中 に変更」
- ログ: `Paidy Payment succeeds to authorize and move to thank you page. Get data is following.` に続いて `transaction_id` を含む GET の内容
- 30〜60 秒後に Webhook（F4）: ログ `Paidy Webhook received.`（本文 `status: authorize_success`）と、注文メモに次の **どちらか 1 件**
  - サンクスページが先に完了していた場合: `This order status is processing, this site received authorize_success from the Paidy webhook.`
    （2026-10-14 の実走では 2 件ともこちら。裏取り 3 秒後に Webhook 到達）
  - Webhook が先に着いた場合: `It succeeded to check the authorization of the order in Paidy Webhook.`（Paidy Webhook で注文の authorization を確認することに成功しました。）

**証拠**: 注文番号、`pay_` ID の末尾 4 文字、注文メモの文言、ログ行。

**NG の見え方**
- サンクスページ後も「支払い待ち」: ログに `Paidy thank-you completion blocked: payment verification failed for order N` と理由行
  （`no payment data` = API 到達不可か鍵違い、`amount mismatch` = 金額計算の不一致、`unexpected status`）
- Paidy Checkout が開かない: テスト公開鍵が未設定、または注文が `pending` でない（F2 の条件）
- 注文メモが 2 件以上同じ内容: フックの多重登録（旧 B-18 の再発）

T5 のために **同じ手順をもう 1 回** 行い、2 件目の成功注文（N3）を作る。

---

## T2 拒否決済（F3 の rejected 分岐）

**操作**: T1 と同じで、メールだけ `rejected.payment@paidy.com`。モーダルが「大変申し訳ございませんが、ペイディの決済を承認することが
できませんでした」を出す。**「他の決済方法を選ぶ」まで押してもらう**と `closed` コールバックが `status=rejected` で呼ばれ、
`…/checkout/?status=rejected&order_id=N2` に戻る（押さなければ受領ページに留まる）。

**期待する結果**
- Paidy 側の拒否画面（ここまでで Paidy の判定は PASS）
- チェックアウト上部にエラー通知 `This Paidy payment has been declined. Please select another payment method.`
  （このPaidyでのお支払いは拒否されました。別のお支払い方法を選択してください。`handle_checkout_return()`。1.5.2 では `checkout_reject_to_cancel()`）。
  1.5.2 の ZIP（`9d347a9`）では、ブロックチェックアウトでは出ず（B-60）、ショートコードでは 2 件重複した（B-61 = JP4WC #244）。
  JP4WC 2.9.18 を同期した版（`fix/sync-jp4wc-2.9.18` 以降）では **両方で 1 件**が期待値（ブロックは `core/notices` の `wc/checkout` に出るエラー通知）
- 戻り先はモーダルなしで再現できる: `checkout/?add-to-cart=<id>&status=rejected&order_id=<N2>`（ブロック）とショートコードのページに
  `?status=rejected&order_id=<N2>`。1.5.2 の実装はカートが空だとフックが動かなかったので 1 点入れ、確認後に Store API `cart/remove-item` で戻す（2.0.0 以降は `template_redirect` で動くのでカートは不要）
- 注文 N2 は **支払い待ち** のまま、取引 ID なし、在庫は減っていない（在庫は `payment_complete()` 前には引かない）
- ログに `Once the customer interrupted the payment..` は **出ない**（これは `status=closed`、購入者がモーダルを閉じたとき）

**証拠**: 注文番号 N2、通知文言のスクリーンショット（必要なら `save_to_disk`）。

---

## T3 改ざんの拒否（F3 の裏取り。`docs/development.md`）

**前提**: T2 の支払い待ち注文 N2 と、T1 の `pay_` ID。注文から 10 分以内。

**操作**
1. 管理画面の注文 N2 の「顧客の支払いページ →」リンク（または受領ページの URL）から `order-pay` の URL を取る
2. `order-pay` を `order-received` に置き換え、末尾に `&transaction_id=<T1 の pay_ ID>` を付けて開く

**期待する結果**
- 注文 N2 は **支払い待ち** のまま、取引 ID なし
- ログ: `Paidy thank-you completion blocked: payment verification failed for order N2` と
  `Paidy payment verification failed: order_ref mismatch (expected N2, got N1)`
- ページ自体（受領ページ）は表示されてよい。WooCommerce は注文キーが合えば出す。合否は注文状態とログで決める
- ブロックの注文確認ページでは `woocommerce_thankyou_paidy` が **2 回**走るので、`mismatch` と `blocked` が 2 組出る（2026-10-14 実測。正常）
- 管理画面の「顧客の支払いページ →」リンク（`a[href*="order-pay/N"]`）の `href` を JS で `order-received` に置換して `location.href` に入れると、
  注文キーを転記せずに開ける

**NG の見え方**: N2 が処理中になる（裏取りが抜けている。即 Critical）。

---

## T4 キャプチャ（F5: 処理中 → 完了）

**前提**: T1 の注文 N1（処理中、取引 ID あり）。

**操作**: 注文 N1 の編集画面 → 状態「完了」→「更新」。ダイアログは出ない。

**期待する結果**
- 注文メモ `In the payment completion process, the amount and ID match were confirmed.` が **1 件だけ**
- ログ: 応答エントリ `This is capture data.`（キャプチャデータです。`captures[0].id = cap_…`、`status: closed`）が **1 回**。
  キャプチャだけは `Send URL is following.` 行が **出ない**（フラグに `true` を渡していて記録されない。backlog 候補）ので応答で数える
- カスタムフィールドに `paidy_capture_id`（`cap_…`）が出ていれば控える（表示されない構成もある）
- 通知メール（`notice_email`）は **送られない**（失敗時だけ）
- 数秒後の Webhook（注文が完了のとき）: `It succeeded to check the completed of the order in Paidy Webhook.`（完了 を確認）。
  全額キャプチャで支払いが閉じるので続けて `close_success` も届き、`It succeeded to check the close …`（閉じる を確認）が並ぶ（正常）

**NG の見え方**
- `In the payment completion process, the amount and ID did not match. Check on the Paidy admin.`
- `There was no status in the notification from Paidy. (HTTP …)`（応答に `status` が無い。F5 の判定）
- `The Paidy payment ID of this order is not in the expected format, …`（取引 ID の形式。1.5.2 以前の値か手で書き換えた値）
- 同じメモが 2 件以上

---

## T5 close（F6: 処理中 → キャンセル）

**前提**: T1 の 2 件目の成功注文 N3（処理中、未キャプチャ）。

**操作**: 注文 N3 の編集画面 → 状態「キャンセル」→「更新」。

**期待する結果**
- ログ: `…/payments/pay_…/close` が **1 回**、続いて `This order is success cancellation data at Paidy.`（この注文はPaidyでキャンセルが成功したデータです。）
- 注文メモに `Cancelled processing has not been completed due to a Paidy error. Please check Paidy admin. (HTTP 409)` が **無い**
  （2026-10-12 のステージングで close が 3 回送られ 2 回目以降が 409 になった旧 B-18 の再発確認。PR #46 で修正）
- 成功時は Paidy のメモは付かない（WooCommerce 標準の状態変更メモとメールのメモだけ）。合否はログで決める
- 在庫が戻る（WooCommerce のキャンセル処理。在庫管理のない商品では確認不要）
- Webhook（注文がキャンセルのとき）: `It succeeded to check the cancelled of the order in Paidy Webhook.`（キャンセル を確認。`close` の文言は注文が完了のときだけ）

**NG の見え方**: `(HTTP 409)` のメモ、close が複数回。`This order is already close data at Paidy.` は「すでに close 済み」で、
1 回目にこれが出るなら Paidy 側で先に閉じられている。

---

## T6 返金（F7: 部分返金を 2 回）

**前提**: T4 の注文 N1（完了、`paidy_capture_id` あり）。注文合計が 2 回に分けられる額（例: 合計 1,000 円なら 100 円 + 200 円）。

**操作**（1 回ごとに。JS 1 本で済む）
1. 注文 N1 の編集画面で `javascript_tool`:
   `window.confirm=()=>true; document.querySelector('button.refund-items').click(); await new Promise(r=>setTimeout(r,800));`
   `const amt=document.querySelector('#refund_amount'); amt.value='100'; amt.dispatchEvent(new Event('change',{bubbles:true})); jQuery(amt).trigger('change');`
   `await new Promise(r=>setTimeout(r,500)); document.querySelector('button.do-api-refund').click();`（ボタンの文言「あと払い（ペイディ） によって ¥100 を返金します」）
2. 10 秒待つ（ajax の後に自動で再読み込み）→ `ul.order_notes li` と `tr.refund` を読む → 2 回目（¥200）

**期待する結果**（各回）
- 注文メモ `Completion refunding has been completed at Paidy.`（Paidy で完了払い戻しが完了しました。）
- 返金行が増える（2 回目の後に 2 行）。注文状態は **完了** のまま（全額ではないので「返金済み」にならない）
- ログ: `…/refunds` が **回ごとに 1 回**、`This is refund data.`（応答の `refunds[]` に `ref_…` が増える）
- 2 回目も成功する（JP4WC 2.9.17 #243 の「2 回目以降の返金」。PR #46）
- Webhook: 注文が「返金済み」ではない（完了のまま）ので汎用メモ `The system received a notification for order refund_success via Paidy Webhook.`
  （`It succeeded to check the refunded …` は注文状態が `refunded` のときだけ）

**NG の見え方**
- `Refund is not possible because Paidy has not completed processing.`（`paidy_capture_id` が無い = T4 が失敗している）
- 2 回目で失敗、または 1 回の返金で `/refunds` が 2 回送られる
- 「Paidy で返金」ボタンが無い: ゲートウェイの `supports` に `refunds` が無いか、注文の決済方法が Paidy でない

---

## T7 完了 → キャンセル（F6 後段: 残額の自動返金）

**前提**: T6 の注文 N1（完了、一部返金済み）。

**操作**: 注文 N1 の編集画面 → 状態「キャンセル」→「更新」。

**期待する結果**
- 返金行が **1 件増え**、返金合計が注文合計に達する（`get_remaining_refund_amount()` 分）
- 注文状態は **キャンセル** のまま（全額返金でも「返金済み」に変わらない。`woocommerce_order_fully_refunded_status` を一時的に `false`）
- 注文メモ `Completion refunding has been completed at Paidy.`
- ログ: `…/refunds` が **1 回**
- Webhook: 注文がキャンセルなので汎用メモ `The system received a notification for order refund_success via Paidy Webhook.`

**NG の見え方**
- `The remaining amount was not refunded at Paidy when the order was cancelled. Please check Paidy admin. (…)`
- 状態が「返金済み」になる
- 残額が 0 なのに `/refunds` が送られる

---

## T8 Webhook とログの総点検

T1〜T7 の後、ログの今回分（ベースラインより後）を上から読む。

- `Invalid signature for Paidy webhook.` / `Unauthorized access to Paidy webhook.` / `Paidy webhook payment verification failed. Order not completed.` が **無い**
- `Order payment method is not Paidy. Possible unauthorized access attempt.` が無い
- 今回作った注文（N1・N2・N3）ごとの Webhook: N1・N3 に `authorize_success`、N1 に `capture_success` と `refund_success`、N3 に `close_success`。
  1 件も届いていなければ「Webhook 未確認」とし、原因の切り分け（Paidy 側設定 / 到達性 / 署名鍵）を報告に書く
- API 送信回数（`Send URL is following.`）: `/captures` 1、`/close` 1、`/refunds` 3（T6 ×2 + T7 ×1）
- PHP の Warning / Notice / Fatal が管理画面・チェックアウト・サンクスページに出ていない（`WP_DEBUG_DISPLAY` が有効な環境のみ判定可能）

---

## 日本語化された文言の対応（1.5.2 の言語パック。ログ・注文メモはこちらで出る）

| 英語の原文（msgid） | 画面・ログでの表示 |
|---|---|
| `Paidy Payment succeeds to authorize and move to thank you page. Get data is following.` | Paidy決済の承認に成功し、サンキューページに移動します。取得データは以下のとおりです。 |
| `Paidy Webhook received. ` | Paidy Webhook を受信しました。 |
| `This order status is processing, this site received authorize_success from the Paidy webhook.` | この注文ステータスは処理中であり、このサイトは Paidy Webhook から authorize_success を受信しました。 |
| `It succeeded to check the %s of the order in Paidy Webhook.` | Paidy Webhook で注文の 完了 / 閉じる / キャンセル を確認することに成功しました。 |
| `The system received a notification for order %s via Paidy Webhook.` | システムは、Paidy Webhook 経由で注文 refund_success の通知を受信しました。 |
| `In the payment completion process, the amount and ID match were confirmed.` | 支払完了プロセスでは、金額と ID の一致が確認されました。 |
| `This is capture data.` | キャプチャデータです。 |
| `This order is success cancellation data at Paidy.` | この注文はPaidyでキャンセルが成功したデータです。 |
| `Completion refunding has been completed at Paidy.` | Paidy で完了払い戻しが完了しました。 |
| `Paidy thank-you completion blocked: …` / `Paidy payment verification failed: …` / `Send URL is following.` | 英語のまま |

## T9（任意）もう一方のチェックアウト

サイトにブロックとクラシック（`[woocommerce_checkout]`）の両方のページがあれば、既定でない方で T1 をもう 1 回。
ブロックでは決済方法の説明が `paidy_description` の生 HTML で出る（画像が消えていないか）。クラシックでは `wp_kses` 後の HTML。
