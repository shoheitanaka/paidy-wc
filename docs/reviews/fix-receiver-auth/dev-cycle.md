# dev-cycle 状態: fix/receiver-auth
- タスク: Phase 1-2 受信エンドポイント認証（JP4WC 2.9.16 の `class-wc-paidy-apply-receiver.php` / `class-wc-paidy-admin-wizard.php` を取り込み）
- 開始: 2026-10-10
- オプション: auto-commit（確認ゲートなし）
- PR: 未作成
- 現在のステップ: 2（実装中）
- Copilot: 依頼 0 回 / 未収束
- Codex: 未接続（CLAUDE.md。ゲート対象外）

## 承認された計画の要判断事項
1. receiver の `jp4wc_updated`（JP4WC_Install のバージョン検出）の代わりに、paidy-wc に `paidy_wc_check_version()`（`init` 5、
   option `paidy_wc_version`、action `paidy_wc_updated`）を足して既存の平文秘密鍵を 1 回だけ伏せ字にする
2. wizard のコンストラクタのフック条件・`$plugin_name`・`hasApiKeys`（JP4WC `a417036`）は同期しない（JS とセット → backlog）
3. wizard の `plugin_version` は `WC_PAIDY_VERSION` を送る（JP4WC backlog R1-L2）
4. フィルタ名 `wc4jp_paidy_*` は JP4WC のまま
5. `uninstall.php` は JP4WC の Paidy 部分（`paidy_application_id` と claim 行の削除）を取り込み、`paidy_wc_version` も消す

## ログ
| 日時(JST) | ステップ | 内容 |
|---|---|---|
| 2026-10-10 00:20 | 1 | 計画承認 |
| 2026-10-10 00:28 | 2 | ブランチ `fix/receiver-auth` 作成（base b422b00）。JP4WC は 10d2d4e（2.9.16） |
| 2026-10-10 00:55 | 2 | 実装コミット 5 件（dd482bf / 6da05a8 / 0e562ef / 5703740 / e0aa8d9）+ docs。composer check green（PHPCS エラー 0・警告 9→2、PHPStan エラー 0・baseline 39→38、PHPUnit 119 件） |
