# AGENTS.md — Paidy for WooCommerce

GitHub 上の AI レビュー（GitHub Copilot code review / Codex）と、このリポジトリで作業するコーディングエージェント向けの入口。
**規約・設計・落とし穴の正は [`CLAUDE.md`](./CLAUDE.md)**。本ファイルはその要約と、レビュー・PR 作法の補足。食い違ったら CLAUDE.md に従う。

## プロジェクトの前提

- Paidy（日本の後払い決済）の WooCommerce 決済ゲートウェイ。WordPress.org で配布（スラッグ / テキストドメイン `paidy-wc`）
- [Japanized for WooCommerce](https://github.com/artisanworkshop/Japanized-for-WooCommerce)（JP4WC）の
  `includes/gateways/paidy/` を切り出した**下流**リポジトリ。JP4WC が最新で、変更は JP4WC → ここへ取り込む（`docs/sync-with-jp4wc.md`）
- PHP 8.1+ / WordPress 6.7+ / WooCommerce 10.2+（CI マトリクス）。HPOS 対応宣言済み。ブロックチェックアウトとクラシック両対応
- 現状の最優先課題はセキュリティ同期（`docs/DEVELOPMENT_PLAN.md` Phase 1）。Webhook / 受信エンドポイントの認証が JP4WC より古い

## Code Review Rules

### レビューの進め方

- レビューコメントは**日本語**で書く（コード・識別子・コミットメッセージは英語のまま）
- PR 本文の「概要」「変更内容」に書かれた範囲だけをレビューする。別フェーズで予定されている機能が「まだ無い」ことは指摘しない
- 指摘の前に読む:
  - `docs/review-baseline.md` — 許容済み。指摘しない
  - `docs/review-backlog.md` — 把握済みで先送り（ID 付き）。再指摘しない。PR がその ID を解消すると書いていれば、解消できているかを見る
- 指摘は「どの入力で、どう壊れるか」を 1〜3 行で書き、該当行へのインラインコメントにする。壊れ方を書けないものは指摘しない
- 重大度: Critical = 決済・注文・API キーが外部から操作/漏えいできる、High = 特定条件で決済が止まる・注文状態が壊れる、
  Medium = 下記「Medium でも指摘してよいもの」。Low（命名・コメント・リファクタ提案・書式）は指摘しない —
  書式・型・docblock は CI の PHPCS（WordPress 標準）と PHPStan level 5 が見ている
- Paidy API の仕様の正は [Paidy 開発者ドキュメント](https://paidy.com/docs/)。記憶で「仕様と違う」と指摘しない

### 決済・Webhook（`includes/gateways/paidy/class-wc-paidy-endpoint.php` `class-wc-gateway-paidy.php`）

- 外部から届く通知（Webhook・受信コールバック）だけで支払い成功と判定して注文を進める経路は Critical。
  署名検証（`hash_hmac()` + `hash_equals()`）か Paidy API への裏取り（`GET /payments/{id}`）が必要
- `permission_callback` が `__return_true` の REST ルートで注文・設定を変更していたら Critical
  （既存の 3 ルートは Phase 1 で修正予定として backlog に載っている。**新規ルート**に同じパターンがあれば指摘する）
- Paidy の ID（`pay_` / `cap_` / `ref_`）は英数 + `_` + `-`。`^pay_[A-Za-z0-9_-]+$/D` より厳しい形式ガードは実決済を止める（High）。
  URL に埋め込む前に `rawurlencode()`。PCRE の `$` は末尾改行を許すので `/D` か `\z`
- `WP_REST_Request::get_params()` はクエリ文字列が body を上書きする。署名で守る値を `get_params()` から読んでいたら指摘する
- `WP_REST_Request::get_body()` は body 無しで `null`。`'' === $body` のガードは効かない
- 注文の確定は `payment_complete()` を呼ぶ前に `has_status( array( 'pending', 'failed', 'on-hold' ) )` 等で守る。
  完了・キャンセル済み注文を遅延 Webhook が差し戻す経路は High
- キャプチャ（注文完了時）・クローズ（キャンセル時）・返金は冪等に。同じ注文で 2 回実行して二重課金/二重返金になる経路は Critical
  （`paidy_capture_id` ガードのように、済んだことを注文メタで判定する）

### 秘匿情報

- API 秘密鍵（`api_secret_key` / `test_api_secret_key`）、`paidy_site_hash`、Basic 認証ヘッダー、受信した鍵の平文を
  ログ（`wc_get_logger()` / `jp4wc_debug_log()`）・例外メッセージ・REST 応答・HTML の value 属性・診断用オプションに出す経路を指摘する
- 購入者の個人情報（氏名・住所・電話・メール）をログに出す変更は指摘する

### WordPress / WooCommerce

- 注文は `WC_Order` の CRUD。`get_post_meta()` / `update_post_meta()` / `global $post` は HPOS で壊れる
- 状態を変える入口（AJAX / REST / admin-post / 設定保存）には nonce と `manage_woocommerce`。入力は sanitize、出力は escape
- HTTP は `wp_remote_*` のみ + `is_wp_error()` チェック。`stripslashes()` → `wp_unslash()`、`json_encode()` → `wp_json_encode()`
- 翻訳可能な文字列のソースは英語、テキストドメインは `paidy-wc`。文字列を追加・変更した PR は `i18n/paidy-wc.pot`（と JS なら JSON）も更新する
- `WC_Gateway_Paidy` を `init` より前に生成する変更（`_load_textdomain_just_in_time` 警告）は指摘する
- 管理者入力の HTML を出力するときは `wp_kses( force_balance_tags( $html ), $allowed )`
- `.gitignore` だけで配布から外せると思っている変更（`.distignore` に書いていない）を指摘する

### Medium でも指摘してよいもの

- `includes/gateways/paidy/` のロジック変更にユニットテストが無い（HTTP は `pre_http_request` フィルタでモック。
  JP4WC の `tests/Unit/test-paidy-*.php` に同等のテストがあるならその移植が期待値）
- Webhook・受信・キャプチャ・返金に触る変更なのに、重複呼び出し（同じ通知が 2 回届く）のテストが無い
- 新しい PHPCS 警告・PHPStan baseline の増加

### 指摘しないもの（意図した設計・既知）

- `jp4wc_` / `wc4jp_` / `JP4WC_` 接頭辞、`WC_Gateway_Paidy` / `WC_Payments_Paidy_Blocks_Support` のクラス名（WooCommerce 慣習）、
  `paidy_*` / `wc_paidy_*` / `woocommerce_paidy_*` が混在するオプション名（既存の命名）
- `includes/jp4wc-framework/` の内容（JP4WC からの verbatim 同期。直すなら JP4WC 側）
- `docs/review-baseline.md` / `docs/review-backlog.md` に載っている事項、`.phpcs.xml.dist` の一時除外と `phpstan-baseline.neon`
- ドキュメント・PR 本文が日本語、コード・コミットメッセージが英語であること
- ビルド成果物（`includes/gateways/paidy/assets/js/`）がコミットされていること（WordPress.org 配布のため）

## コードを変更するエージェントへ

```bash
composer install
composer lint          # PHPCS（エラーで fail。警告は表示のみ）
composer phpstan       # PHPStan level 5 + baseline
composer test:db && composer test:install   # Docker MySQL (127.0.0.1:10154) + WP/WC テスト環境（初回）
composer test          # PHPUnit
npm install && npm run build   # src/ を変えたとき。成果物もコミット対象
```

- サンドボックスでは Docker / ネットワークが要るもの（`composer test`、wp-env、Paidy API）は実行できない前提で、
  実行できなかったチェックは PR 本文に明記する。実 Paidy API・`paidy.artws.info` には接続しない（資格情報はリポジトリに無い）
- JP4WC に同等の実装があるものは、推測で独自実装せず JP4WC の実装を取り込む（`docs/sync-with-jp4wc.md`）
- 変更は依頼された範囲に収める。コミットは Conventional Commits・英語。`main` への push と PR のマージはしない
- `includes/jp4wc-framework/` と `includes/gateways/paidy/assets/js/`（ビルド成果物）を手で編集しない
