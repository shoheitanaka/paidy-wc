---
name: sync-from-jp4wc
description: Japanized for WooCommerce（JP4WC）の Paidy モジュールの変更を、この単体プラグイン（paidy-wc）へ取り込む。「JP4WC の変更を取り込んで」「JP4WC と同期して」「JP4WC 2.9.x の Paidy 修正を反映して」「Webhook 署名検証を JP4WC から持ってきて」などと言われたら使う。ファイル対応表・テキストドメイン置換・意図的な差分の再適用・テスト移植・検証までを行う。
---

# JP4WC からの同期スキル（paidy-wc）

paidy-wc は JP4WC `includes/gateways/paidy/` の下流。JP4WC で入った修正は**推測で再実装せず、JP4WC の実装を取り込む**。
対応表と意図的な差分の正は `docs/sync-with-jp4wc.md`。このスキルはその手順。

## 前提

- JP4WC のローカルクローン: `~/Dev/Japanized-for-WooCommerce`（無ければ `gh repo clone artisanworkshop/Japanized-for-WooCommerce ~/Dev/Japanized-for-WooCommerce`）。
  作業前に `git -C ~/Dev/Japanized-for-WooCommerce pull` で最新にする（ユーザーに確認してから）
- paidy-wc 側はブランチを切ってから（`fix/<topic>` または `feature/<topic>`）。コミット・push はユーザーの指示があるまでしない
- 1 PR = 1 テーマ（例: 「Webhook 認証」「受信エンドポイント認証」）。`docs/DEVELOPMENT_PLAN.md` のステップ単位

## 手順

### 1. 取り込む変更を特定する

```bash
J=~/Dev/Japanized-for-WooCommerce
awk '/^== Changelog ==/{f=1} f' "$J/readme.txt" | grep -iE "^= [0-9]|paidy" | head -40
git -C "$J" log --oneline -- includes/gateways/paidy class-wc-paidy.php tests/Unit/test-paidy-*.php | head -40
```

対象の JP4WC 版・PR 番号・対象ファイルを書き出し、`docs/sync-with-jp4wc.md` の「未取り込み」表と照合する。
ユーザーからテーマが指定されていればそれだけに絞る。

### 2. 差分を読む（テキストドメイン差を除いた実質差分）

```bash
cd ~/Dev/paidy-wc
f=includes/gateways/paidy/class-wc-paidy-endpoint.php
diff <(sed "s/woocommerce-for-japan/paidy-wc/g" "$J/$f") "$f"
```

全ファイルの差分行数を一覧するには `docs/sync-with-jp4wc.md` の for ループ。
**差分の中に paidy-wc 側だけの変更（JP4WC に無い修正）があれば必ず残す**。見分けがつかないときは
`git -C ~/Dev/paidy-wc log -p -- $f` で paidy-wc 側の履歴を確認する。

### 3. ファイルを取り込む

対応表（`docs/sync-with-jp4wc.md`）に従う。典型的な 3 パターン:

**(a) ゲートウェイ PHP（`includes/gateways/paidy/class-*.php`）** — JP4WC 版をコピーして置換:

```bash
cp "$J/$f" "$f"
sed -i '' "s/'woocommerce-for-japan'/'paidy-wc'/g" "$f"
grep -n "woocommerce-for-japan\|assets/js/build\|JP4WC_\|wc4jp-" "$f"   # 残りは手で判断
```

- `assets/js/build/paidy/` の直書きがあれば `WC_PAIDY_BLOCKS_URL` / `WC_PAIDY_ASSETS_ABSPATH` 定数に置き換える
- `JP4WC_*` クラスや `wc4jp-*` オプションへの新しい依存は、単体で動くよう `class_exists()` / `get_option()` でガードするか外す
- paidy-wc 側だけにあった修正（手順 2 で特定）を再適用する

**(b) 部分移植（`class-wc-paidy.php`、`paidy-wc.php`）** — コピーせず該当ロジックだけ移す。
例: JP4WC `class-wc-paidy.php` の「`WC_Paidy_Endpoint` を `init` 11 に遅延」ブロック。

**(c) JS（`src/`）** — `src/js/paidy/<dir>/` → `src/<dir>/`（`paidy/` → `paidy/`）にコピーし、`npm run build`。
成果物（`includes/gateways/paidy/assets/js/`）の差分を確認してコミット対象に含める。

**(d) フレームワーク（`includes/jp4wc-framework/`）** — verbatim コピー。namespace の版（`v2_0_14` など）が変わったら
`class-wc-paidy.php` の `$framework_version` と全 `use ArtisanWorkshop\PluginFramework\vX_Y_Z` を揃える。

### 4. テストを移植する

```bash
cp "$J/tests/Unit/test-paidy-<name>.php" tests/Unit/
sed -i '' -e "s/'woocommerce-for-japan'/'paidy-wc'/g" -e "s/@package Japanized_For_WooCommerce/@package paidy-wc/" tests/Unit/test-paidy-<name>.php
```

- `require_once dirname( __DIR__, 2 ) . '/includes/gateways/paidy/...'` はディレクトリ構成が同じなのでそのまま動く
- JP4WC 固有（`JP4WC_` クラス、`wc4jp-` オプション）に依存するテストケースは外すか paidy-wc 向けに書き換える
- `markTestSkipped()` は使わない（クラスが無ければ `require_once` + `assertTrue( class_exists() )`）

### 5. 検証

```bash
grep -rn "woocommerce-for-japan" includes src tests paidy-wc.php class-wc-paidy.php   # 0 件
composer lint
composer phpstan:baseline && composer phpstan     # 置換したファイルの baseline を作り直す。件数が減ること
composer test                                      # 事前に composer test:db && composer test:install
npm run build                                      # src/ を触った場合
git diff --stat
```

- baseline の件数が**増えた**ら、新しいコードのエラーなので baseline に入れず直す（JP4WC 側のバグなら JP4WC にも報告）
- `.phpcs.xml.dist` の一時除外（B-1）が不要になっていたら消す
- 文字列が増えていれば `update-i18n` スキルで `i18n/paidy-wc.pot`（JS なら JSON も）を更新する

### 6. 記録

- `docs/sync-with-jp4wc.md` の「未取り込み」表から取り込んだ行を消す（または取り込み済みに移す）
- `docs/DEVELOPMENT_PLAN.md` のチェックボックスを更新
- `docs/review-backlog.md` で解消した ID の行を消す
- `readme.txt` の changelog は `release-bump` スキルの担当（この PR では触らない。ただし PR 本文に JP4WC 側の changelog 文言を引用しておく）
- コミットはせず、`git diff --stat` と変更の要約・取り込んだ JP4WC 版 / PR 番号をユーザーに提示する

## 失敗モード

| 症状 | 原因 |
|------|------|
| 管理画面やチェックアウトの文字列が英語のまま | テキストドメインの置換漏れ。`grep woocommerce-for-japan` |
| ブロックチェックアウトでスクリプト 404 | JP4WC の `assets/js/build/paidy/` パスがコピーしたファイルに残っている。定数経由にする |
| `Class JP4WC_... not found` | JP4WC 本体のクラスへの依存が入った。ガードするか外す |
| PHPStan baseline の行が「存在しないエラー」で失敗する | 置換で行がずれた。`composer phpstan:baseline` で作り直す |
| テストが `WC_Gateway_Paidy` の `__()` で textdomain 警告 | `init` 前にゲートウェイを生成している（B-9）。JP4WC の遅延ロジックを先に移植 |
| paidy-wc 側だけの修正が消えた | 手順 2 を飛ばしてコピーした。`git diff` で復元 |
