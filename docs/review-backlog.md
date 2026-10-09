# レビューバックログ（把握済み・先送り）

レビューで見つかったが、その PR では直さないと判断した事項。ID（`B-n`）で参照する。
解消したら行を消し、関連する `.phpcs.xml.dist` の除外や `phpstan-baseline.neon` も一緒に減らす。
Phase 1（セキュリティ同期）で直るものは [DEVELOPMENT_PLAN.md](DEVELOPMENT_PLAN.md) にも載せている。

| ID | 重大度 | 内容 | 場所 | 解消予定 |
|----|--------|------|------|----------|
| B-1 | Low | 未接頭辞のグローバル関数 `on_deactivation()` `add_wc4jp_paidy_gateway()` `init_paidy_receiver()` と、WooCommerce 有効判定に `apply_filters( 'active_plugins', ... )` を使っている（`class_exists( 'WooCommerce' )` で足りる）。`.phpcs.xml.dist` で一時除外中 | `paidy-wc.php` | Phase 2 |
| B-2 | Medium | 受信エンドポイントのレガシー: 非 strict `in_array()`、`json_encode()`（→ `wp_json_encode()`）、未使用 `$request`、保存は `paidy_received_data` なのに `get_received_data()` / `clear_received_data()` は `received_data` を読む（常に空）、`add_option()` の autoload に文字列 `'no'`。`uninstall.php` が `paidy_site_hash` `paidy_received_data` `wc_paidy_show_ssl_notice` 等を消さない | `class-wc-paidy-apply-receiver.php`, `uninstall.php` | Phase 1 で receiver を JP4WC 版に置換、uninstall は Phase 2 |
| B-3 | Medium | PHPStan baseline 39 件の中に実バグがある: フレームワーク `$dx` 未定義（L145）、`ceil()` / `floor()` に引数 2 つ（L776/778、PHP 8 で `ArgumentCountError`）、`jp4wc_array_to_message()` が `null` を返す経路、`get_order_id_by_transaction_id()` が `false` を返す経路。`WooCommerce::$payment_gateways` 動的プロパティ参照（blocks-support） | `includes/jp4wc-framework/class-jp4wc-framework.php` ほか | フレームワークを JP4WC から同期（Phase 2）。JP4WC 側に無ければ JP4WC へ PR |
| B-4 | Low | ESLint（`npm run lint:js`）が 985 件（ほぼ prettier の整形）。CI に `lint:js` を入れられない | `src/` | Phase 3 で `npm run format:js` を単独 PR にし、CI へ追加 |
| B-5 | Low | i18n スクリプトが壊れている: `bin/build_i18n.sh` と `npm run i18n:json` は存在しない `languages/` を参照。`i18n/` の JSON 10 個のうち 7 個は現在のスクリプトパスの md5 と一致しない（旧パス由来とみられる） | `bin/build_i18n.sh`, `package.json`, `i18n/` | Phase 3（`update-i18n` スキルで整理） |
| B-6 | High（WP.org 規約） | `readme.txt` に `== External Services ==` が無い。`api.paidy.com` `apps.paidy.com` `paidy.artws.info`（申込仲介・自社サーバー）の開示が必要。JP4WC での教訓: 「有効化条件」は実コードで確認して書く | `readme.txt` | Phase 3（リリース PR） |
| B-7 | Medium | デプロイワークフローが `actions/checkout@master` `softprops/action-gh-release@v1` を使い、テストをゲートにしていない。JP4WC は `workflow_call` でフルマトリクスを通してからデプロイ | `.github/workflows/deploy-on-pushing-a-new-tag-and-create-release-with-attached-zip.yml` | Phase 3（`ci.yml` に `workflow_call` を追加して呼ぶ） |
| B-8 | Low | `package-lock.json` が未追跡（`.gitignore`）。CI の `build-js` は `npm install` なので依存の解決がビルドごとに変わり得る | `.gitignore`, `.github/workflows/ci.yml` | 方針決定後（追跡するなら `npm ci` に変更） |
| B-10 | Low | プラグインヘッダー `Requires at least: 5.0` / `WC requires at least: 6.0.0` が実態（PHP 8.1、ブロックチェックアウト、`FeaturesUtil`）と合わない。CI の最小は WP 6.7 / WC 10.2 | `paidy-wc.php` | Phase 3（リリース PR。`Tested up to` は実環境確認後） |
| B-11 | Low | `readme.txt` の Minimum Requirements（PHP 7 / WC 3.0 / MySQL 5.6）が古い。Installation の文言に「Woo sbp」が残っている | `readme.txt` | B-10 と同時 |
| B-12 | Low | `paidy-wc.php` の `paidy_redirect_to_wizard()` が毎 `admin_init` で `new WC_Gateway_Paidy()` を生成している（オプション確認だけなら不要） | `paidy-wc.php` | Phase 2 |
| B-13 | Medium | wp-env の開発サイト（:10150）で paidy-wc 本体が起動しない。`.wp-env.json` の `woocommerce.latest-stable.zip` は `woocommerce.latest-stable/` に展開され、`wc_paidy_plugin()` の `active_plugins` に `woocommerce/woocommerce.php` があるかという判定が常に偽になる（`paidy/v1/*` も未登録。2026-10-09 確認）。B-1 の `class_exists( 'WooCommerce' )` 判定に変えるか、`.wp-env.json` を版なしの `woocommerce.zip` にする | `paidy-wc.php`, `.wp-env.json` | Phase 2（B-1 と同時） |
