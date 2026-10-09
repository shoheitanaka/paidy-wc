# レビューベースライン（許容済み・指摘しない）

`review-loop` スキルと AI レビュー（Copilot / Codex）が参照する。ここに載っているものは意図した設計か、
別の仕組みで担保しているので、コードレビューで指摘しない。先送り中の既知問題は [review-backlog.md](review-backlog.md)。

## 命名

- `jp4wc_` / `wc4jp_` / `JP4WC_` 接頭辞の関数・定数・フック（JP4WC 由来。`.phpcs.xml.dist` の prefixes に登録済み）
- `WC_Gateway_Paidy` / `WC_Payments_Paidy_Blocks_Support`（WooCommerce の命名慣習）、`woocommerce_paidy_icon` フィルタ
- オプション名が `paidy_*` / `wc_paidy_*` / `woocommerce_paidy_*` / `wc-paidy-*` と混在していること（既存データとの互換のため変えない）
- `includes/gateways/paidy/` のファイル名が `class-wc-*.php`（WordPress 標準の `class-<classname>.php` と一致）

## 共有コード

- `includes/jp4wc-framework/` の内容（JP4WC から verbatim 同期。スタイル・型・未使用変数の指摘はここではなく JP4WC へ）。
  PHPCS では `PrefixAllGlobals` / `ValidHookName` を除外、PHPStan では baseline 化

## 品質ツールの例外

- `.phpcs.xml.dist` の一時除外（`paidy-wc.php` の `NonPrefixedFunctionFound` / `NonPrefixedHooknameFound`）— backlog B-1 の解消まで
- `phpstan-baseline.neon` の 38 件（PR #38 時点は 56 件）— レガシー専用。増やす変更は指摘対象、減らす変更は歓迎
- `composer phpstan:baseline` が baseline を include したまま同じファイルへ再生成すること — PHPStan は生成先と同じパスを
  include から除外するので既存の抑制は失われない（PR #38 で検証: 再生成前後で同一・56 件維持、続く `composer phpstan` は No errors）。
  「既存 baseline を無視して上書きする」という指摘は誤検知
- PHPCS 警告 2 件（`class-jp4wc-framework.php` の `base64_*`）— 共有コード。フレームワークの同期（Phase 2-2）で扱う
- `tests/` で `WordPress.Files.FileName` を除外（`test-*.php` + `*_Test` は WordPress コアのテスト命名）

## 設計上の判断

- Webhook（`paidy/v1/order`）に nonce / `current_user_can()` を要求しない。サーバー間通信なので署名（HMAC）と IP 許可リストで認証する
  （JP4WC `SECURITY-FIX-PAIDY.md` の判断。Phase 1-1 で取り込み済み）
- `paidy/v1/check` の `permission_callback` が `__return_true` であること。呼び出し元は Paidy ではなく paidy.artws.info で、
  Paidy の署名・IP では認証できず、受け取った値を返すだけで状態を変えない（JP4WC も同じ。コード内にも理由のコメントがある）
- `paidy_webhook_allowed_ips` フィルタで許可リストを空にすると署名なしの Webhook を通すこと（運用者が明示的に選ぶオプトアウト。
  既定は Paidy 公式 IP。JP4WC 2.9.6 で「署名なしの通知を全部拒否して注文が自動キャンセルされた」障害の対策として残している）
- `X-Forwarded-For` を既定で使わず、`paidy_trust_proxy_headers` フィルタでの明示的なオプトインに限ること
- 受信エンドポイント（`paidy-receiver/v1/receive`）に nonce / `current_user_can()` を要求しない。呼び出し元は申込仲介サーバーで、
  ウィザードが発行した state token か、`paidy_site_hash` を鍵にした body の HMAC 署名で認証する（JP4WC 2.9.16 と同じ。Phase 1-2）。
  ルートが `GET, POST` なのは元からの定義（JP4WC も同じ）。body の無い `GET` は state token でしか通らない（空 body の署名は信用しない）
- 受信エンドポイントと `uninstall.php` の `$wpdb` 直接クエリ（`LIKE` + `esc_like()`）。state token と claim は接尾辞がランダム・ハッシュの
  option 行で、core API では列挙できない（JP4WC と同じ。`phpcs:disable` の理由もコード内にある）
- `paidy_wc_check_version()` が、版の記録が無いとき（新規インストール、1.5.2 以前からの更新）にも `paidy_wc_updated` を発火すること。
  1.5.2 以前は版を記録していないので区別できない。リスナー（秘密鍵の伏せ字）は冪等。ダウングレードでは版を記録するだけで発火しない
- 受信エンドポイントの `check_permissions()` が `application_id` / `state` を `get_param()` で読むこと。`get_param()` は JSON → POST（body）→ GET（クエリ）の順に
  最初に見つかった値を返すので、署名された body の値をクエリで上書きすることはできない（WordPress core `WP_REST_Request::get_parameter_order()`）。
  body に無いキーをクエリで補っても、処理本体は body のみ（`get_body_only_params()`）を読む。配列値の `TypeError` は backlog B-31
- 受信エンドポイントのフィルタ名が `wc4jp_paidy_*` であること（JP4WC から verbatim。同期差分を増やさないため改名しない）
- 受信エンドポイントで `base64_decode()` + `openssl_decrypt()` を使うこと（仲介サーバーが AES-256-CBC で鍵を暗号化して送る）
- Paidy API の認証に秘密鍵を `Authorization` ヘッダーで送ること（Paidy API の仕様）
- `apps.paidy.com` の JS を CDN から読み込むこと（Paidy Checkout の仕様。PCI の観点でも同梱しない）
- ビルド成果物 `includes/gateways/paidy/assets/js/` をコミットしていること（WordPress.org 配布に必要）。`src/` も同梱する
- `.po` / `.mo` を追跡しないこと（PHP 側の翻訳は WordPress.org 言語パック、JS 側は同梱 JSON）
- `composer.json` の `platform.php` を 8.1.0 に固定していること（ヘッダーの `Requires PHP: 8.1` と CI の最小 PHP に合わせる）
- `tests/bootstrap.php` が `WP_TESTS_PHPUNIT_POLYFILLS_PATH` / `WC_REMOVE_ALL_DATA` を定義すること（テストライブラリ / WooCommerce の定数）

## ドキュメント・言語

- ドキュメント・PR 本文・レビューコメントが日本語、コード・コメント・コミットメッセージが英語であること
- `docs/` 配下の記録（計画・レビュー記録）の文言
