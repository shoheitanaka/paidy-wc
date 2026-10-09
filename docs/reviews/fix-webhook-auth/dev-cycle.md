# dev-cycle 状態: fix/webhook-auth
- タスク: Phase 1-1 Webhook 認証（JP4WC 2.9.16 の `class-wc-paidy-endpoint.php` を取り込み、`WC_Paidy_Endpoint` を `init` 11 に遅延）
- 開始: 2026-10-09
- オプション: auto-commit（確認ゲートなし）
- PR: 未作成
- 現在のステップ: 4（push・PR 作成）
- Copilot: 依頼 0 回 / 未収束
- Codex: 未接続（CLAUDE.md。ゲート対象外）

## 承認された計画の要判断事項
1. 1-3 の一部（`paidy_get_payment_data()` の GET 化・形式検証、`paidy_verify_payment_for_order()`、`test-paidy-payment-id-format.php`）を前倒し
2. `paidy/v1/check` は JP4WC と同じく `__return_true` のまま
3. JP4WC の `get_option( 'testmode' )`（存在しない設定）を `environment` 判定に直して取り込む（意図的な差分）
4. WPCS に合わない書き方（非 Yoda 条件など）は直す

## ログ
| 日時(JST) | ステップ | 内容 |
|---|---|---|
| 2026-10-09 | 1 | 計画承認 |
| 2026-10-09 | 2 | ブランチ `fix/webhook-auth` 作成（base cd56e84） |
| 2026-10-09 | 2 | 実装コミット 4 件（f2ba611 / b07a603 / c27e9ee / 51a0479）+ docs。composer check green（PHPCS エラー 0・警告 9、PHPStan エラー 0・baseline 56→39、PHPUnit 55 件） |
| 2026-10-09 | 2 | wp-env の手動確認は不可（既存不具合: WooCommerce が `woocommerce.latest-stable/` にあり paidy-wc 本体が起動しない → backlog B-13）。PHPUnit の `rest_do_request()` テストで代替 |
| 2026-10-09 | 3 | review-loop R1: Critical/High 0、Medium 1（R1-1 修正）、Low 2（R1-3 修正、R1-2 → B-14）、対象外 4 + Low 1 → B-15〜B-20 |
| 2026-10-09 | 3 | review-loop R2: APPROVE（R1-1・R1-3 解消、R2-1 Low を 1 行で対応） |
