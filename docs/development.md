# 開発環境と開発フロー

[CLAUDE.md](../CLAUDE.md) の「開発環境」「必須チェック」の詳細版。

## 前提

| ツール | 備考 |
|--------|------|
| PHP 8.1+ / Composer 2 | ローカルは Herd の PHP 8.5。`composer.json` の `platform.php` は 8.1.0 固定なので lock は 8.1 で解決される |
| Node 20 / npm 10 | `@wordpress/scripts` 30 系。`package-lock.json` は未追跡（`.gitignore`）なので `npm install` |
| Docker Desktop | wp-env と PHPUnit 用 MySQL |
| Subversion | `bin/install-wp-tests.sh` が WordPress テストライブラリを `svn export` する（`brew install svn`） |
| wp-cli | ローカル未導入。`npm run i18n:pot` などは動かない → `.claude/skills/update-i18n` の phar フォールバック |

```bash
composer install
npm install
```

## ポート（dev-env スキルのスロット 15）

| 用途 | ポート | 設定場所 |
|------|--------|----------|
| wp-env development | 10150 | `.wp-env.json` `port` |
| wp-env tests | 10151 | `.wp-env.json` `testsPort` |
| phpMyAdmin development / tests | 10152 / 10153 | `.wp-env.json` `env.*.phpmyadminPort` |
| PHPUnit 用 MySQL（Docker） | 10154 | `bin/test-db.sh`（`PAIDY_WC_TEST_DB_PORT` で変更可） |
| 予備 | 10155〜10159 | — |

台帳は `~/.claude/skills/dev-env/ports.json`（元本 `~/Dev/claude-skills`）。ポートを変えるときは `dev-env` スキルの手順に従い、
`.wp-env.override.json` でその場しのぎをしない。

## wp-env（動作確認用のサイト）

```bash
npm run env:start            # http://localhost:10150 (admin / password)
npm run env:cli -- plugin list
npm run env:stop
```

同梱プラグイン: WooCommerce 最新、WP Mail Logging、Plugin Check、Query Monitor。`WPLANG` は `ja`。
**現状 paidy-wc 本体が起動しない**（backlog B-13: WooCommerce が `woocommerce.latest-stable/` に展開され、`wc_paidy_plugin()` の判定が偽になる）。
REST / Webhook の確認は PHPUnit の `rest_do_request()` で代替し、実 Webhook は外部から届くステージングで確かめる。
Paidy のテスト鍵は wp-admin の WooCommerce → 設定 → 決済 → Paidy で入力する（リポジトリに資格情報を書かない）。

## ステージング用 ZIP

wp-env では本体が起動しない（B-13）ので、実決済・実 Webhook はステージングで確かめる。インストール用 ZIP は `bin/build-zip.sh` で
`dist/` に作る（`dist/` は `.gitignore` 済み）。

```bash
bash bin/build-zip.sh   # → dist/paidy-wc-<HEAD の短縮ハッシュ>.zip
```

- 構成はリリースと同じ（Git で追跡しているファイルに rsync で `.distignore` を適用）。ただし中身は**作業ツリー**から読むので、
  コミット前の修正もステージングで試せる。中身が HEAD から作る ZIP と違うとき（`.distignore` の変更も含む）は名前が `paidy-wc-<hash>-dirty.zip` になり、
  違うファイルを表示する。
  ステージングでの確認を記録するときは ZIP の名前を書く（`-dirty` なら未コミットの変更を含む）
- Git が追跡していないファイルは入らない。出荷対象のものがあれば一覧を表示するので、入れるなら `git add` してから作り直す
- スクリプトは作った後に `unzip -tq` で検証し、`paidy-wc/paidy-wc.php` があることと、`.distignore` の `/` で始まる項目（`/tests` `/vendor` など）が
  入っていないことを確かめる（macOS の openrsync とデプロイの GNU rsync の違いへの備え）。同じ名前の ZIP は消してから作る
  （`zip -r` は既存の ZIP に追記し、消したファイルが残るため）
- ZIP の中のフォルダー名は `paidy-wc/`。「プラグインのアップロード」で既存のプラグインを置き換えられる。版は上げないので管理画面の表示は元の版のまま
- サンクスページの確認は debug ログ（source `paidy-wc`）で判断する。裏取りに失敗すると `Paidy thank-you completion blocked` が出る。
  WooCommerce はゲスト注文の受領ページを、注文から 10 分を過ぎるとメール確認のフォームに差し替える（会員の注文はログインを求める）ので、
  そのときは `woocommerce_thankyou_paidy` が動かない。「支払い待ちのまま」だけでは合否を判断しない
- 改ざんの拒否の確認は、支払い待ちの注文の `order-pay` の URL（アドレスバー、または管理画面の「顧客の支払いページ」）の `order-pay` を
  `order-received` に変え、`&transaction_id=<別の注文の決済 ID>` を付けて開く

## 品質チェック

### PHPCS（`composer lint` / `composer format`）

- ルール: `.phpcs.xml.dist`（WordPress 標準 + PHPCompatibilityWP 8.1-、テキストドメイン `paidy-wc`）
- 対象: `paidy-wc.php` `class-wc-paidy.php` `uninstall.php` `includes/` `tests/` `phpstan-bootstrap.php`。
  ビルド成果物 `includes/gateways/paidy/assets/` は除外
- **エラーだけが exit code に影響する**（`ignore_warnings_on_exit`）。警告は直すまで表示され続ける
- 一時除外: `paidy-wc.php` の未接頭辞関数・フック名（backlog B-1）。解消時に `.phpcs.xml.dist` から消す

### PHPStan（`composer phpstan`）

- `phpstan.neon.dist`: level 5、`szepeviktor/phpstan-wordpress` + `php-stubs/woocommerce-stubs`、
  実行時定数は `phpstan-bootstrap.php` で定義（`dynamicConstantNames` でリテラル扱いを防ぐ）
- `phpstan-baseline.neon`: レガシー 35 件。新規エラーは baseline に入れず直す。
  JP4WC から同期してファイルが入れ替わったら、再生成の前に `composer phpstan` で `Ignored error pattern …` 以外のエラーが 0 件であることを
  確かめてから `composer phpstan:baseline` で再生成し、減ったことを確認する（再生成は新しいエラーも吸収して exit 0 になる）

### PHPUnit（`composer test`）

```bash
composer test:db          # Docker で mysql:8.0 を 127.0.0.1:10154 に起動（コンテナ名 paidy-wc-mysql-test）
composer test:install     # = bin/test-db.sh install: コンテナ起動 + WordPress latest / WooCommerce latest / テストライブラリを $TMPDIR に展開
composer test             # vendor/bin/phpunit
composer test:db:stop     # コンテナ削除
```

- テスト DB の接続設定（ポート・DB 名・パスワード・コンテナ名・イメージ）は `bin/test-db.sh` の `PAIDY_WC_TEST_DB_*` 環境変数が唯一の出どころ。
  `test:install` は同じ値を `bin/install-wp-tests.sh` に渡すので、変数を変えてもコンテナと `wp-tests-config.php` が食い違わない。
  既存コンテナのポートが設定と違えば `start` が止まる（`composer test:db:stop` してから起動し直す）。
  WordPress の版は `bash bin/test-db.sh install 6.9`、WooCommerce は `WC_VERSION=10.6.2 composer test:install`

- `tests/bootstrap.php` が WooCommerce を読み込み・インストールし、`paidy-wc.php` を読み込む。テストは `WP_UnitTestCase` を継承し
  `tests/Unit/test-*.php` に置く（ファイル名 `test-`、クラス名 `*_Test`）
- `$TMPDIR/wordpress` と `$TMPDIR/wordpress-tests-lib` は同じマシンの他リポジトリ（JP4WC など）と共有される。
  WooCommerce の版を変えたいときは `WC_VERSION=10.6.2 bash bin/install-wp-tests.sh ...` の前に
  `$TMPDIR/wordpress/wp-content/plugins/woocommerce` を消す。macOS は temp を定期的に消すので、
  `Could not find .../functions.php` が出たら `composer test:install` をやり直す
- `composer test:install` は何度実行しても安全。「インストール済み」の判定はディレクトリではなく実ファイル
  （`wp-includes/version.php` / `woocommerce.php` / `includes/functions.php`）で行うので、途中で失敗した展開は再実行で補完される。
  `wp-tests-config.php` は毎回作り直す（DB の接続先を変えたら再実行だけでよい）。スクリプトは `set -x` を使わないので
  DB パスワードがログに出ることはない
- `composer test:db` は停止中のコンテナが残っていれば `docker start` で再開する（Docker Desktop 再起動後など）
- `bin/install-wp-tests.sh` の WooCommerce 最新版は `downloads.wordpress.org/plugin/woocommerce.zip`（版なし。200 で直接配信）から取る。
  `woocommerce.latest-stable.zip` は版付き URL への 302 を返すので、`-L` 無しの `curl` だとリダイレクト本文が保存されて
  `unzip` が失敗する（PR #38 の CI で発生）。取得は `curl -fsSL` + `unzip -tq` で検証してから展開する
- HTTP を伴うコードは `pre_http_request` フィルタでモックする（`tests/Unit/test-paidy-payment-id-format.php` の `mock_paidy_api()` 参照）。
  テストから実 Paidy API を呼ばない
- Paidy の REST ルートは `rest_do_request()` で実際に叩ける（ノンス不要）。`paidy/v1/order` は署名か Paidy の IP が要るので、
  `x-paidy-signature` を付けるか `$_SERVER['REMOTE_ADDR']` を設定し、tearDown で戻す（`test-paidy-webhook-permission.php`）
- 注文を `payment_complete()` するテストは物理商品で注文を作る。仮想かつダウンロード商品だけの注文は completed になり、
  completed 遷移のキャプチャフックが Paidy API を呼ぶ

### JS

```bash
npm run build       # src/ → includes/gateways/paidy/assets/js/{wizard,admin,frontend}/paidy.js (+ .asset.php, css)
npm run start       # watch
npm run lint:js     # 現状 985 件（ほぼ prettier）。backlog B-4 で一括 format 後に CI へ追加する
```

ビルド成果物はコミットする（WordPress.org 配布に含まれる）。`src/` を変えていない PR で成果物を再生成しない。

## CI（`.github/workflows/ci.yml`）

| ジョブ | 内容 |
|--------|------|
| `phpcs` | `composer lint`。findings は GitHub の annotation に出る |
| `phpstan` | `composer phpstan --error-format=github` |
| `phpunit` | PHP 8.1 / WP 6.7 / WC 10.2.2 → PHP 8.3 / WP 6.9 / WC 10.6.2 → PHP 8.5 / latest / latest の 3 本（MySQL 8.0 サービス） |
| `build-js` | `npm install && npx wp-scripts build` |

- トリガー: `main` への PR と push、手動。`**.md` `docs/**` `.claude/**` だけの変更では走らない
- WC の固定版は「6 か月前・12 か月前に current だったマイナーの最新パッチ」。半年ごとに JP4WC の `testing.yml` と合わせて更新する。
  WooCommerce は WordPress を L-1 でサポートするので、古い WP × 新しい WC の組は入れない
- 失敗したら `ci-triage` スキル（コード起因かインフラ起因かの切り分け）

## リリース

1. `release-bump` スキルでバージョン（`paidy-wc.php` ヘッダーと `WC_PAIDY_VERSION`、`readme.txt` Stable tag + changelog、`package.json`）を上げる PR
2. マージ後、`main` でタグを push（`git tag 1.6.0 && git push upstream 1.6.0`）→
   `.github/workflows/deploy-on-pushing-a-new-tag-and-create-release-with-attached-zip.yml` が
   `10up/action-wordpress-plugin-deploy` で WordPress.org SVN へデプロイし、`.distignore` 準拠の ZIP を GitHub Release に添付する
3. タグ名はバージョンそのまま（`v` 無し。既存タグ `1.4.8` などに合わせる）

注意: 配布 ZIP の除外は `.distignore`（rsync）で決まる。`.gitignore` は無関係。`Tested up to` は実環境で確認した値だけ書く。

## 翻訳（i18n）

- テキストドメイン `paidy-wc`、ファイルは `i18n/`。追跡しているのは `paidy-wc.pot` と JS 用 JSON（`paidy-wc-ja-<md5>.json`）。
  `.po` / `.mo` は gitignore（PHP の日本語訳は WordPress.org 言語パック）
- JSON の `<md5>` はビルド済みスクリプトのプラグイン相対パスの md5:

  | スクリプト | md5 |
  |-----------|-----|
  | `includes/gateways/paidy/assets/js/admin/paidy.js` | `f1b5d108cb3324c74c7028b874613d58` |
  | `includes/gateways/paidy/assets/js/frontend/paidy.js` | `16463c661bc87af3055e72f37a52b9e8` |
  | `includes/gateways/paidy/assets/js/wizard/paidy.js` | `12e0aa1eda445dc81ea8e0362028f102` |

  残り 7 つの JSON は現在のスクリプトパスと一致しない（旧パス由来とみられる。backlog B-5 で整理）
- 手順は `.claude/skills/update-i18n/SKILL.md`

## 参照

- JP4WC の開発ドキュメント: `~/Dev/Japanized-for-WooCommerce/CLAUDE.md`、`docs/testing.md`
- Paidy 開発者ドキュメント: https://paidy.com/docs/
