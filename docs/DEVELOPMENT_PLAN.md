# 開発計画

最終更新: 2026-10-09。各フェーズは 1 つ以上の PR。PR はブランチを切って `upstream`（SoftStepsEC/paidy-wc）`main` へ。
タスク完了時はチェックボックスを更新する。

## 方針

- JP4WC（Japanized for WooCommerce 2.9.16）が Paidy モジュールの最新。**独自実装より JP4WC からの取り込みを優先**する
  （[sync-with-jp4wc.md](sync-with-jp4wc.md)）
- セキュリティ修正（Phase 1）を他のすべてに優先し、1.6.0 としてリリースする
- 1 PR = 1 フェーズの 1 ステップ。品質ツール（`composer check`）が緑であることを PR の前提にする

## Phase 0 — 開発基盤（PR #38、2026-10-09 マージ）

- [x] `composer.json` を刷新（PHPCS / PHPStan / PHPUnit、`platform.php` 8.1）
- [x] `.phpcs.xml.dist`（WordPress 標準、エラーのみ fail）、`phpstan.neon.dist` + baseline（56 件）
- [x] `phpunit.xml.dist`、`tests/bootstrap.php`（WP + WooCommerce）、スモークテスト 12 件
- [x] `bin/install-wp-tests.sh`（WooCommerce 同時インストール）、`bin/test-db.sh`（Docker MySQL 10154）
- [x] `.github/workflows/ci.yml`（PHPCS / PHPStan / PHPUnit 3 本 / JS build）
- [x] `.wp-env.json` をスロット 15（10150〜10153）へ、Plugin Check / Query Monitor 同梱
- [x] `.gitignore` / `.distignore` / `.gitattributes` に開発ファイルを追加
- [x] `CLAUDE.md` / `AGENTS.md` / `docs/` / `.claude/skills/{sync-from-jp4wc,update-i18n}`

## Phase 1 — セキュリティ同期（1.6.0）

JP4WC 2.9.0〜2.9.16 の Paidy 修正を取り込む。推奨順（各 1 PR、依存順）:

- [x] **1-1 Webhook 認証**（`class-wc-paidy-endpoint.php`、ブランチ `fix/webhook-auth`）: `paidy/v1/order` の `permission_callback` を
      JP4WC の `paidy_webhook_permission_check()`（`x-paidy-signature` HMAC-SHA256 + `paidy_webhook_allowed_ips` IP 許可リスト、
      注文の `payment_method === 'paidy'` 確認）に置換。`paidy/v1/check` は JP4WC と同じく `__return_true` のまま（呼び出し元は
      paidy.artws.info で状態を変えない）。`WC_Paidy_Endpoint` の生成を `init` 11 に遅延（B-9）。
      Webhook の裏取りに必要な `paidy_get_payment_data()`（GET 化・形式検証・`rawurlencode()`）と `paidy_verify_payment_for_order()` を
      1-3 から前倒しで移植。JP4WC の `get_option( 'testmode' )`（存在しない設定）は `environment` 判定に直して取り込み（意図的な差分）。
      テスト: `test-paidy-webhook-permission.php`（新規）、`test-paidy-payment-id-format.php`（移植）
- [ ] **1-2 受信エンドポイント認証**（`class-wc-paidy-apply-receiver.php`、`class-wc-paidy-admin-wizard.php`）: JP4WC 版に置換
      （state token を non-autoload option に、`x-paidy-receiver-signature` / `x-paidy-receiver-timestamp` の HMAC フォールバック、
      リプレイ防止、body のみから認証、application_id 一致確認、`paidy_received_data` から秘密鍵除外、鍵フィールド補完、
      `wizard=false` 修正）。テスト: `test-paidy-receiver-signature.php` `test-paidy-application-id.php`
      `test-paidy-manual-settings.php` `test-paidy-onboarding-state.php` を移植。B-2 の大半が同時に解消
- [ ] **1-3 決済照会の修正**（`class-wc-gateway-paidy.php`）: サンクスページでの裏取り（`thankyou_completed()` から
      `paidy_verify_payment_for_order()` を呼ぶ）、`paidy_capture_id` による再キャプチャ防止、
      説明文の `force_balance_tags()` + 保存時検証、ゲスト注文履歴の扱い。
      テスト: `test-paidy-description-balance.php` `test-paidy-guest-order-history.php` を移植
      （`paidy_get_payment_data()` の GET 化・形式検証と `test-paidy-payment-id-format.php` は 1-1 で取り込み済み）
- [ ] **1-4 ブロック対応の fatal 回避**（`class-wc-payments-paidy-blocks-support.php`、2.9.5）
- [ ] **1-5 リリース 1.6.0**: `release-bump` スキル。changelog は JP4WC の Security 行を流用。`readme.txt` に External Services（B-6）を
      この時点で入れてもよい

## Phase 2 — クリーンアップ

- [ ] 2-1 `paidy-wc.php` の未接頭辞関数のリネーム、`class_exists( 'WooCommerce' )` 判定、`paidy_redirect_to_wizard()` の生成抑制（B-1, B-12）。
      `.phpcs.xml.dist` の一時除外を削除
- [ ] 2-2 `includes/jp4wc-framework/` を JP4WC 最新版に同期し、`composer phpstan:baseline` を再生成（B-3）。
      JP4WC 側にも残るバグ（`ceil()` 2 引数など）は JP4WC へ PR
- [ ] 2-3 `uninstall.php` の削除対象を実際のオプション名に合わせる（B-2 残り）
- [ ] 2-4 PHPStan level を 6 に上げる検討

## Phase 3 — 配布・i18n・CI 整備

- [ ] 3-1 `readme.txt`: External Services、Minimum Requirements、ヘッダーの `Requires at least` / `WC requires at least`（B-6, B-10, B-11）
- [ ] 3-2 i18n: `bin/build_i18n.sh` / `i18n:json` の `languages/` 参照修正、不要 JSON の整理、POT 再生成（B-5）
- [ ] 3-3 `npm run format:js` を単独 PR で適用し、CI に `lint:js` を追加（B-4）
- [ ] 3-4 デプロイワークフローのゲート化（`ci.yml` に `workflow_call` を追加し、タグ push でフルマトリクスを通す）、action の版更新（B-7）
- [ ] 3-5 `package-lock.json` の追跡方針（B-8）

## Phase 4 — E2E

- [ ] 4-1 Playwright（`wp-e2e-playwright` スキル）: クラシック / ブロック両チェックアウトで Paidy が表示され、受領ページで
      Paidy Checkout の JS が起動するところまで（Paidy のテスト環境の認証は手動）。CI は夜間・手動のみ
- [ ] 4-2 wp-env 上での管理画面ウィザードの E2E（`paidy.artws.info` はモック）

## 継続

- JP4WC のリリースごとに `docs/sync-with-jp4wc.md` の手順で差分を確認し、Paidy 関連の変更を取り込む
- CI の WC 固定版を半年ごとに更新（JP4WC の `testing.yml` と揃える）
- `Tested up to`（WP / WC）は実環境確認後に更新
