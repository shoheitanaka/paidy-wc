# アーキテクチャ

2026-10-09 時点（v1.5.2）のコードから起こしたもの。JP4WC から取り込むと変わる箇所は「→ JP4WC」で注記。

## ディレクトリ

```
paidy-wc.php                         # エントリ。有効化/無効化フック、WooCommerce 有効チェック、ゲートウェイ登録、通貨フィルタ、HPOS 宣言
class-wc-paidy.php                   # WC_Paidy シングルトン。定数定義、includes()、textdomain、ブロック決済登録
uninstall.php                        # woocommerce_paidy_* / wc-paidy-* / wc_paidy_show_pr_notice オプション削除
includes/
  jp4wc-framework/                   # JP4WC 共有フレームワーク v2.0.14（namespace ArtisanWorkshop\PluginFramework\v2_0_14）。verbatim 同期
  gateways/paidy/
    class-wc-gateway-paidy.php                 # WC_Gateway_Paidy（WC_Payment_Gateway）: 設定・決済画面・capture/close/refund API 呼び出し
    class-wc-paidy-endpoint.php                # WC_Paidy_Endpoint: REST paidy/v1/order (Webhook), paidy/v1/check
    class-wc-paidy-apply-receiver.php          # WC_Paidy_Apply_Receiver: REST paidy-receiver/v1/receive（申込仲介からの鍵配信）
    class-wc-paidy-admin-wizard.php            # WC_Paidy_Admin_Wizard: wc-admin /paidy-on-boarding ページ、申込送信、設定連動
    class-wc-paidy-settings-controller.php     # 設定画面（決済タブ）に React（admin/paidy.js）を差し込む
    class-wc-paidy-admin-notices.php           # SSL / cURL / PR 通知
    class-wc-paidy-apply-admin-dashboard.php   # 申込促進ダッシュボード通知
    class-wc-payments-paidy-blocks-support.php # WC_Payments_Paidy_Blocks_Support（AbstractPaymentMethodType）
    assets/js/{wizard,admin,frontend}/         # webpack ビルド成果物（コミット対象）
src/                                 # React ソース。wizard/ admin/ paidy/(=frontend) main-hooks/
assets/                              # 画像・レガシー CSS/JS（jp4wc-paidy.js, wc-gateway-paidy-settings.js）
i18n/                                # paidy-wc.pot, JS 用 JSON（.po/.mo は未追跡）
```

JP4WC との配置の違いは [sync-with-jp4wc.md](sync-with-jp4wc.md) の対応表。

## 起動順

1. `paidy-wc.php` 読み込み: `register_activation_hook` / `register_deactivation_hook`、`WC_PAIDY_VERSION` 定義、
   `require class-wc-paidy.php`、`woocommerce_payment_gateways` に `WC_Gateway_Paidy` を追加、
   **`new WC_Paidy_Admin_Wizard()`**（即時）、`is_admin()` なら `WC_Paidy_Settings_Controller` と `WC_Paidy_Admin_Notices` を生成、
   `admin_init` → 有効化直後のウィザードへのリダイレクト、`init` → `WC_Paidy_Apply_Receiver`、
   `woocommerce_available_payment_gateways` → JPY 以外 / 鍵未設定なら Paidy を外す、
   `before_woocommerce_init` → `FeaturesUtil::declare_compatibility( 'custom_order_tables' )`
2. `plugins_loaded`(0) `wc_paidy_plugin()`: `active_plugins` に WooCommerce があれば `WC_Paidy::get_instance()`、無ければ管理画面に通知
3. `WC_Paidy::__construct()`: 定数（`WC_PAIDY_PLUGIN_URL` `WC_PAIDY_ASSETS_URL` `WC_PAIDY_BLOCKS_URL` `WC_PAIDY_ABSPATH`
   `WC_PAIDY_ASSETS_ABSPATH` `WC_PAIDY_PLUGIN_FILE` `JP4WC_PAIDY_FRAMEWORK_VERSION`）→ `init()`（`woocommerce_blocks_loaded` 登録）→
   `includes()`: フレームワーク → `WC_Gateway_Paidy` → `WC_Paidy_Endpoint` を読み込み、**生成は `init`(11) に遅延**
   （コンストラクタで `new WC_Gateway_Paidy()` が `__()` を呼ぶため。`init` 中・後に呼ばれたときは即時生成）→ `WC_Paidy_Apply_Admin_Dashboard`
   → `init`(10) で `load_plugin_textdomain( 'paidy-wc', false, '<dir>/i18n' )` → `init`(11) で `new WC_Paidy_Endpoint()`
4. `woocommerce_blocks_loaded` → `woocommerce_blocks_payment_method_type_registration` で `WC_Payments_Paidy_Blocks_Support` 登録

## 決済フロー（クラシック / ブロック共通）

1. `process_payment()` → `result: success`、`redirect` は受領ページ（`order-pay`）
2. 受領ページ `woocommerce_receipt_paidy` → `paidy_make_order()`: 注文データ（items / coupons / shipping / 購入者。
   `jp4wc_paidy_order_items` `jp4wc_paidy_order_coupons` フィルタ）を JS に埋め込み、`https://apps.paidy.com/` の Paidy Checkout を起動。
   `_billing_yomigana_*`（JP4WC の読み仮名）があれば `name2` に渡す
3. 認証成功 → サンクスページ（`?transaction_id=pay_...`）: `thankyou_completed()` が `payment_complete( $transaction_id )`
   （→ JP4WC は `paidy_verify_payment_for_order()` で裏取りする。paidy-wc ではメソッドは移植済みだがサンクスページからは未使用＝Phase 1-3）
   失敗/クローズ → チェックアウトへ戻る（`checkout_reject_to_cancel()` が `?status=rejected|closed` を見て注文をキャンセル）
4. Paidy Webhook `POST /wp-json/paidy/v1/order`（`payment_id`, `order_ref`, `status`）:
   - 認証 `paidy_webhook_permission_check()`: `x-paidy-signature` があれば body の HMAC-SHA256 を秘密鍵で検証
     （`environment` が `live` なら `api_secret_key`、それ以外は `test_api_secret_key`。ゲートウェイの `set_api_secret_key()` と同じ判定）。
     署名が無ければ `REMOTE_ADDR` を Paidy 公式の送信元 IP（`WC_Paidy_Endpoint::PAIDY_WEBHOOK_IPS`、`paidy_webhook_allowed_ips` フィルタ）と照合。
     `X-Forwarded-For` は `paidy_trust_proxy_headers` フィルタで明示的に有効にしたときだけ使う。フィルタで許可リストを空にすると検証なしで通す
   - 注文の `payment_method` が `paidy` でなければ 403
   - `authorize_success` で注文が `pending` / `cancelled`（`paidy_endpoint_enable_authorize_statuses` フィルタ）なら、
     `transaction_id` 設定済みならスキップ（冪等性）→ `WC_Gateway_Paidy::paidy_verify_payment_for_order()` で
     `GET /payments/{id}` を裏取り（ID 一致・`order.order_ref` 一致・金額一致・状態が `authorized|active|closed`。`paidy_verify_allowed_statuses` フィルタ）
     → 在庫を引き `payment_complete()`。`capture_success` / `close_success` / `refund_success` は注文メモのみ
   - `paidy_get_payment_data()` は `^pay_[A-Za-z0-9_-]+$/D` で検証し `rawurlencode()` して `wp_safe_remote_get()`。失敗時は `null`
5. 注文 `completed` → `jp4wc_order_paidy_status_completed()`: `POST /payments/{id}/captures` → `paidy_capture_id` を保存
   （→ JP4WC は `paidy_capture_id` 既存なら再キャプチャしないガード）
6. `processing|completed → cancelled` → `POST /payments/{id}/close`
7. 返金 `process_refund()` → `POST /payments/{id}/refunds`（`capture_id` 必須。`paidy_refund_id` に配列で追記）

Paidy API は `https://api.paidy.com/`、認証は `Authorization: Bearer <secret key>`（テスト/本番は `environment` 設定で切替）。
`debug` 設定が `yes` のとき `jp4wc_debug_log()` が `wc_get_logger()`（source `paidy-wc`）に出す。

## オンボーディング（申込ウィザード）

- `WC_Paidy_Admin_Wizard` が wc-admin に `/paidy-on-boarding` ページを登録し、`src/wizard` の React アプリを表示
- 申込フォームの保存（`woocommerce_paidy_on_boarding_settings` の `add_option` / `updated_option`）をトリガに
  `send_apply_data_to_wcartws()` が `https://paidy.artws.info/api/applications/` へ `wp_remote_post()`。
  このとき `paidy_site_hash`（16 文字ランダム）を生成・送信する
- 審査結果と API 鍵は仲介サーバーから `POST /wp-json/paidy-receiver/v1/receive` で届く。
  鍵は `site_hash` 派生鍵の AES-256-CBC で暗号化されており、復号して `woocommerce_paidy_settings` に書き込む。
  **現状 `check_permissions()` は無条件 true**（→ JP4WC は state token + `x-paidy-receiver-signature` HMAC、
  application_id の一致確認、リプレイ防止、受信データから秘密鍵の平文を除外）
- `POST /wp-json/paidy/v1/check` は仲介サーバーからの Webhook 登録確認用（状態を変えない）
- `wizard=false` で手動設定フィールドへ切替（`WC_Paidy_Settings_Controller` が `admin/paidy.js` で UI を制御）

## REST ルート

| ルート | クラス | 認証（現状 → JP4WC） | 用途 |
|--------|--------|---------------------|------|
| `POST paidy/v1/order` | `WC_Paidy_Endpoint::paidy_check_webhook` | HMAC 署名 or IP 許可リスト（`paidy_webhook_permission_check`。JP4WC と同じ） | Paidy Webhook |
| `POST paidy/v1/check` | `WC_Paidy_Endpoint::paidy_regist_webhook` | `__return_true`（JP4WC も同じ。呼び出し元は paidy.artws.info で状態を変えない） | Webhook 登録確認 |
| `POST paidy-receiver/v1/receive` | `WC_Paidy_Apply_Receiver::handle_receive_data` | `return true` → state token + 署名 | 申込結果・鍵配信 |

## オプション・メタ

| 種別 | キー | 内容 |
|------|------|------|
| option | `woocommerce_paidy_settings` | ゲートウェイ設定（`enabled` `title` `description` `environment` `api_public_key` `api_secret_key` `test_api_public_key` `test_api_secret_key` `store_name` `logo_image_url` `debug` `notice_email` ...） |
| option | `woocommerce_paidy_on_boarding_settings` | 申込ウィザードの入力・ステータス |
| option | `paidy_site_hash` | 仲介サーバーとの共有シークレット（autoload） |
| option | `paidy_received_data` | 最後に受信した申込結果（non-autoload。→ JP4WC は秘密鍵を除外） |
| option | `paidy_do_activation_redirect` | 有効化直後のリダイレクトフラグ |
| option | `wc_paidy_show_ssl_notice` `wc_paidy_show_curl_notice` `wc_paidy_show_pr_notice` `wc_paidy_apply_notice_{2,3,99}` | 通知の非表示 |
| order meta | `_transaction_id` | Paidy `payment_id`（`pay_...`） |
| order meta | `paidy_capture_id` | `cap_...`（キャプチャ済みの印） |
| order meta | `paidy_refund_id` | `ref_...` の配列 |

`uninstall.php` は `woocommerce_paidy_*` と `wc-paidy-*` 接頭辞のオプションと `wc_paidy_show_pr_notice` を削除する
（`paidy_site_hash` `paidy_received_data` `wc_paidy_show_ssl_notice` 等は残る → backlog B-2）。

## フック（公開 API）

| フック | 種別 | 用途 |
|--------|------|------|
| `woocommerce_paidy_icon` | filter | チェックアウトのアイコン URL |
| `jp4wc_paidy_explanation` | filter | 説明文 HTML |
| `jp4wc_paidy_order_items` / `jp4wc_paidy_order_coupons` | filter | Paidy に渡す明細 |
| `paidy_endpoint_enable_authorize_statuses` | filter | `authorize_success` を受け付ける注文ステータス |
| `wc_paidy_payment_icons` | filter | ブロックチェックアウトのアイコン |
| `wc_paidy_apply_enabled` | filter | 申込促進通知の有効/無効 |
| `paidy_application_approved` / `paidy_application_rejected` | action | 申込結果受信時 |
| `wc_jp4wc_logging` | filter | フレームワークのログ出力可否 |

## JS アプリ

| エントリ（webpack.config.js） | ソース | 出力 | 読み込み元 |
|------|--------|------|-----------|
| `wizard/paidy` | `src/wizard/index.js` | `includes/gateways/paidy/assets/js/wizard/paidy.js` | `WC_Paidy_Admin_Wizard`（wc-admin ページ） |
| `admin/paidy` | `src/admin/index.js` | `.../admin/paidy.js` | `WC_Paidy_Settings_Controller`（決済設定タブ） |
| `frontend/paidy` | `src/paidy/index.js` | `.../frontend/paidy.js` | `WC_Payments_Paidy_Blocks_Support`（ブロックチェックアウト） |

`@woocommerce/dependency-extraction-webpack-plugin` で `wc-blocks-registry` / `wc-settings` を外部化。
翻訳は `wp_set_script_translations( handle, 'paidy-wc', WC_PAIDY_ABSPATH . 'i18n/' )`。

## 外部サービス（readme.txt の External Services に記載が必要 → backlog B-6）

| ドメイン | 用途 | 送るデータ |
|---------|------|-----------|
| `api.paidy.com` | 決済の照会・キャプチャ・クローズ・返金 | payment_id、金額、秘密鍵（Bearer） |
| `apps.paidy.com` | 購入者ブラウザで Paidy Checkout を起動 | 注文明細、購入者情報、公開鍵 |
| `paidy.artws.info` | Artisan Workshop の加盟店申込仲介（送信・結果受信・Webhook 登録確認） | 店舗情報、サイト URL、`site_hash` |
