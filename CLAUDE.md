# Paidy for WooCommerce — Claude Code Instructions

Paidy（日本の後払い決済）を WooCommerce で使う単体プラグイン。
[Japanized for WooCommerce](https://github.com/artisanworkshop/Japanized-for-WooCommerce)（以下 JP4WC）に同梱されている
Paidy 決済モジュールを切り出したもので、**JP4WC 側が常に最新**。このリポジトリは JP4WC の変更を取り込む側（下流）。

## プロジェクト概要

| 項目 | 値 |
|------|-----|
| プラグイン名 / スラッグ / テキストドメイン | Paidy for WooCommerce / `paidy-wc` / `paidy-wc` |
| 現行バージョン | 1.5.2（`paidy-wc.php` ヘッダー・`WC_PAIDY_VERSION`・`readme.txt` Stable tag・`package.json`） |
| 動作要件 | PHP 8.1+（ヘッダー）/ CI は WP 6.7+ / WC 10.2+ で検証（`.github/workflows/ci.yml`） |
| メインファイル | `paidy-wc.php`（エントリ・フック登録）、`class-wc-paidy.php`（`WC_Paidy` シングルトン・定数・読み込み） |
| 配布 | WordPress.org（タグ push → `deploy-on-pushing-a-new-tag-...yml` が SVN デプロイ + GitHub Release） |
| Git | `origin` = shoheitanaka/paidy-wc（フォーク）、`upstream` = SoftStepsEC/paidy-wc（正・PR 先・`gh` の既定） |
| 上流（コードの元） | `~/Dev/Japanized-for-WooCommerce`（`includes/gateways/paidy/` が Paidy モジュール） |

詳細は `docs/` を読む（必要時に Read）:

| ファイル | 内容 | 読むタイミング |
|---------|------|--------------|
| `docs/architecture.md` | 起動順・クラス構成・REST ルート・オプション/注文メタ・外部サービス・JS アプリ | 構造に関わる変更・調査の前 |
| `docs/development.md` | 環境構築・コマンド・ポート・テスト・CI・リリース・i18n | 作業開始時・CI が落ちたとき |
| `docs/sync-with-jp4wc.md` | JP4WC からの取り込み手順・ファイル対応表・意図的な差分 | JP4WC の変更を取り込むとき |
| `docs/DEVELOPMENT_PLAN.md` | フェーズ別の開発計画（Phase 1 = セキュリティ同期） | 次に何をやるか決めるとき |
| `docs/review-baseline.md` / `docs/review-backlog.md` | レビューで指摘しない事項 / 把握済みで先送りの課題（ID 付き） | レビュー前・レビュー対応時 |

## 絶対に守るルール

- **`git commit` / `git push` はユーザーの明示的な指示があるまで実行しない**。変更はワーキングツリーに残して報告する
  （グローバル CLAUDE.md の規約）。`gh pr create` もユーザー確認後
- **開発はブランチを切ってから始める**（`main` 直接作業は禁止）。命名: `feature/<topic>` `fix/<topic>` `chore/<topic>`。
  PR は `origin` に push したブランチから `upstream`（SoftStepsEC/paidy-wc）の `main` へ:
  `gh pr create --repo SoftStepsEC/paidy-wc --base main --head shoheitanaka:<branch>`
- コード・コミットメッセージ・コード内コメントは英語、レビュー・説明・ドキュメントは日本語
- 不要なファイル変更をしない。ビルド成果物（`includes/gateways/paidy/assets/js/`）は `src/` を変えた PR でだけ更新する
- **決済プラグインなのでセキュリティ最優先**: escape on output / sanitize on input、状態を変える入口には nonce + `manage_woocommerce`、
  Webhook は署名（`hash_equals()`）で認証、秘密鍵・API キーをログ・REST 応答・HTML に出さない
- 注文データは `WC_Order` の CRUD（`get_meta()` / `update_meta_data()` / `save()`）だけで扱う。`get_post_meta()` 直叩き禁止（HPOS 宣言済み）
- `includes/jp4wc-framework/` は JP4WC から verbatim で同期する共有コード。**ここで独自修正をしない**（直すなら JP4WC 側で直してから同期）

## コード変更後の必須チェック（省略不可）

```bash
composer lint        # PHPCS（エラー 0 件必須。警告は表示されるが exit code には影響しない）
composer phpstan     # PHPStan level 5（phpstan-baseline.neon 差分でエラー 0 件必須）
composer test        # PHPUnit（事前に composer test:db && composer test:install）
composer check       # 上の 3 つをまとめて実行
```

- PHPCS の警告（`base64_decode` / 非 strict `in_array` など 9 件）は `docs/review-backlog.md` B-2 で把握済み。**新しい警告は増やさない**
- PHPStan の baseline（56 件）はレガシーコード専用。新規コードのエラーを baseline に追加しない。
  JP4WC からファイルを同期したら `composer phpstan:baseline` で再生成し、件数が減ったことを確認する
- `.phpcs.xml.dist` の `paidy-wc.php` 向け一時除外（`NonPrefixedFunctionFound` / `NonPrefixedHooknameFound`）は B-1 の解消時に消す
- `src/` を変えたら `npm run build` して成果物もコミット対象にする（CI の `build-js` はビルド成功だけを見る）
- PHP ファイルを編集したら上記に加えて手動セルフレビュー: ABSPATH ガード / DocBlock（`@since` は次リリース版）/ i18n ドメイン `paidy-wc` /
  エスケープ / サニタイズ / `hash_equals()` / HPOS / `wp_remote_*` + `is_wp_error()` / Yoda 条件

## 開発環境（要点。詳細は docs/development.md）

| 用途 | 値 |
|------|-----|
| wp-env 開発サイト / テストサイト | http://localhost:10150 / http://localhost:10151（`npm run env:start`） |
| phpMyAdmin（dev / tests） | 10152 / 10153 |
| PHPUnit 用 MySQL（Docker） | 127.0.0.1:10154（`composer test:db` / `composer test:db:stop`） |
| ポート台帳 | `~/.claude/skills/dev-env/ports.json` のスロット 15。変更は `dev-env` スキルで |
| Node / npm | 20 / 10（`node_modules` はコミットしない。`package-lock.json` は現状未追跡 → backlog B-8） |
| wp-cli | ローカル未導入。`wp i18n` は `update-i18n` スキルの phar フォールバックを使う |

## スキル

コードを書く前に該当スキルを呼ぶこと。

| スキル | 使いどころ |
|--------|-----------|
| `.claude/skills/sync-from-jp4wc`（同梱） | JP4WC の Paidy 変更をこのリポジトリへ取り込む |
| `.claude/skills/update-i18n`（同梱） | 文字列を追加・変更した PR で POT / JSON を更新する |
| `wc-development` / `wp-plugin-development` | WooCommerce ゲートウェイ・HPOS・Blocks / プラグイン全般 |
| `wp-security-check` | 決済 Webhook・REST・管理画面のセキュリティ監査 |
| `wp-phpcs` / `wp-phpstan` / `wp-phpunit` / `wp-github-actions` | 品質ツールの設定変更 |
| `wc-wp-env` / `dev-env` | wp-env の構築・ポート |
| `review-loop` / `fix-copilot-review` / `check-pr` / `ci-triage` | レビュー・Bot レビュー対応・PR チェック・CI 失敗の切り分け |
| `release-bump` | バージョンアップ・changelog・タグ（WordPress.org 自動デプロイ） |
| `dev-cycle` / `start-task` / `post-merge` | 計画 → ブランチ → 実装 → PR → ゲート → 後始末 |

共有スキルは `~/.claude/skills/`（元本は `~/Dev/claude-skills`）。このリポジトリの `.claude/skills/` にはプロジェクト固有の 2 つだけを置く。

## アーキテクチャ要約（詳細は docs/architecture.md）

- 起動: `paidy-wc.php` 読み込み時に `WC_Paidy_Admin_Wizard` 生成・`admin` なら設定コントローラ/通知を生成 → `plugins_loaded`(0) で
  WooCommerce が有効なら `WC_Paidy::get_instance()` → フレームワーク・`WC_Gateway_Paidy`・`WC_Paidy_Endpoint`・`WC_Paidy_Apply_Admin_Dashboard` を読み込み
  → `init` で `WC_Paidy_Apply_Receiver`・textdomain → `woocommerce_blocks_loaded` でブロック決済を登録
- REST ルート: `paidy/v1/order`（Paidy Webhook）、`paidy/v1/check`（paidy.artws.info からの Webhook 登録確認）、
  `paidy-receiver/v1/receive`（申込仲介サーバーからの API キー配信）
- 外部サービス: `api.paidy.com`（決済 API・Basic 認証 = 秘密鍵）、`apps.paidy.com`（チェックアウト JS）、
  `paidy.artws.info`（Artisan Workshop の加盟店申込仲介。`readme.txt` の External Services 開示が未記載 → backlog B-6）
- オプション: ゲートウェイ設定 `woocommerce_paidy_settings`、オンボーディング `woocommerce_paidy_on_boarding_settings`、
  `paidy_site_hash`、`paidy_received_data`、通知制御 `wc_paidy_show_*` / `wc_paidy_apply_notice_*`。
  **`paidy_*` / `wc_paidy_*` / `woocommerce_paidy_*` の 3 系統が混在しているのは既存の命名**（統一は backlog）
- 注文メタ: `_transaction_id`（Paidy payment_id `pay_...`）、`paidy_capture_id`、`paidy_refund_id`

## セキュリティ上の現状（最重要・Phase 1）

JP4WC 2.9.13〜2.9.16 で入った Paidy の修正が**このリポジトリには未反映**（`docs/DEVELOPMENT_PLAN.md` Phase 1）:

- `paidy/v1/order` と `paidy/v1/check` の `permission_callback` が `__return_true`（未認証で注文ステータスを操作できる。Wordfence 報告の脆弱性）
- `paidy-receiver/v1/receive` の `check_permissions()` が無条件 `return true`（API キー・申込ステータスを外部から上書きできる）
- `payment_id` の形式検証・`rawurlencode()` なしで API URL に埋め込んでいる、`GET /payments/{id}` を POST で呼んでいる（検証が常に 404）

これらに触る変更では JP4WC 側の実装（HMAC 署名 + IP 許可リスト、state token + 署名、`^pay_[A-Za-z0-9_-]+$/D`）をそのまま取り込むこと。
独自実装で再発明しない。

## よくある落とし穴（JP4WC での実例から。Paidy に関係するものだけ）

- Paidy の ID（`pay_` / `cap_` / `ref_`）は base64url（英数 + `_` + `-`）。形式ガードは `^pay_[A-Za-z0-9_-]+$/D` より厳しくしない
  （`_` と `-` の見落としで実決済が止まった実例が 2 回）。PCRE の `$` は末尾 `\n` を許すので `/D` か `\z` を使う
- `WP_REST_Request::get_body()` は body が無いと `null`（`''` ではない）。`empty()` で判定する
- `get_params()` はクエリ文字列が body を上書きする。署名検証する値は `get_json_params()` / `get_body_params()` からだけ読む
- `WC_Gateway_Paidy` を `init` より前に生成すると `_load_textdomain_just_in_time` 警告（WP 6.7+）。現状 `WC_Paidy::includes()` が
  `plugins_loaded` で `WC_Paidy_Endpoint` → ゲートウェイを生成している（backlog B-9。JP4WC は `init` 11 に遅延）
- `class_exists()` は `use` エイリアスを解決しない。常に完全修飾名を渡す
- 管理者が入力した説明文 HTML は `wp_kses( force_balance_tags( $html ), $allowed )` で出力（閉じタグ漏れで注文ボタンが重複した実例）
- `stripslashes()` ではなく `wp_unslash()`。`json_encode()` ではなく `wp_json_encode()`
- テストでプラグインクラスが無いときに `markTestSkipped()` しない。`require_once` して `class_exists` を assert する
- `.gitignore` は配布 ZIP から除外しない。配布に入れたくないものは `.distignore` にも書く（rsync `--exclude-from`）
- `@since` は現行 Stable tag + 1（作業開始時の版ではない）。Copilot が指摘する
- ブロックチェックアウトの REST 検証は 1 ページ表示で複数回走る（`calc_totals` 等）。副作用のある処理はガードする
- 翻訳 JSON のファイル名はビルド済みスクリプトのプラグイン相対パスの md5（`includes/gateways/paidy/assets/js/wizard/paidy.js` → `12e0aa1e…`）。
  出力パスを変えると JSON を作り直す必要がある（`update-i18n` スキル）
- 変更 PR で `i18n/*.po` を `msgmerge` しない（`.po` / `.mo` は gitignore 済み。PHP の翻訳は WordPress.org 言語パック、JS は同梱 JSON）
