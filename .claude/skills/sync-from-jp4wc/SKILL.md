---
name: sync-from-jp4wc
description: Japanized for WooCommerce（JP4WC）の Paidy モジュールの変更を、この単体プラグイン（paidy-wc）へ取り込む。「JP4WC の変更を取り込んで」「JP4WC と同期して」「JP4WC 2.9.x の Paidy 修正を反映して」「Webhook 署名検証を JP4WC から持ってきて」などと言われたら使う。ファイル対応表・テキストドメイン置換・意図的な差分の再適用・設定名の照合・テスト移植・検証までを行う。
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

取り込むコードが読むゲートウェイ設定名を、paidy-wc のゲートウェイ設定（`init_form_fields()` のキー）と機械的に照合する:

```bash
cd ~/Dev/paidy-wc && J=~/Dev/Japanized-for-WooCommerce
php .claude/skills/sync-from-jp4wc/check-setting-keys.php "$J/includes/gateways/paidy" "$J"/tests/Unit/test-paidy-*.php
```

- `unknown gateway setting 'xxx'` が出た行は、paidy-wc では存在しない設定を読んでいる（`get_option()` は空文字を返すだけで
  エラーにならない）。実例: JP4WC の Webhook 署名検証は `get_option( 'testmode' )` で鍵を選ぶが、paidy-wc にあるのは
  `environment` だけで、sandbox の Webhook を本番鍵で検証していた。paidy-wc に実在する設定へ直し、
  `docs/sync-with-jp4wc.md` の「意図的な差分」に書き、回帰テストを足す
- **既知の 1 件**: JP4WC が直すまでは `class-wc-paidy-endpoint.php` の `testmode` が必ず出る（exit 1）。「意図的な差分」7 と
  `test-paidy-webhook-permission.php` で対応済みなので、endpoint を取り込むときは差分 7 を再適用するだけでよい（記録やテストを重ねない）
- JP4WC がゲートウェイに設定を新しく足した変更では、`--gateway="$J/includes/gateways/paidy/class-wc-gateway-paidy.php"` を付けて
  JP4WC 側の設定と照合する（付けないと新しい設定も unknown と出る。ゲートウェイを取り込んだ後の手順 5 では付けずに 0 件になればよい）
- 照合する書き方（キーは文字列リテラル）: `->get_option()` / `->update_option()` / `->get_setting()`、名前が `settings` か `options` で
  終わる変数・プロパティの `['key']`、名前が `settings` で終わる変数・プロパティへの配列リテラルの代入（テストの
  `$this->wizard->paidy_settings = array( … )` など）、`get_option( <設定オプション> )['key']`、`update_option()` / `add_option()` の値の配列キー。
  設定オプション名は `'woocommerce_paidy_settings'` と `'woocommerce_' . $this->id . '_settings'` を認識する。名前に `on_boarding` を含むもの
  （別オプションの申込設定）は除外
- 照合しないもの（目で確かめる）:
  - `$gateway->testmode` のようなプロパティ読み。PHPStan が `property.notFound` を出すが、型が分かる本体コードだけで、`tests/` は解析対象外（手順 5）
  - 別の名前の変数（`$opts['key']`、単数形の `$setting['key']`）や `wp_parse_args()` の既定値で読む設定
  - JS（`src/`）。`grep -rn woocommerce_paidy_settings src` で読んでいる箇所を探す（例: `src/main-hooks/form-info.jsx` の `environment`）
  - select 設定の比較値（`environment` は `live` / `sandbox`）と checkbox の値（`yes` / `no`）。`'yes' === $this->get_option( 'environment' )` のような比較
- `--list` を付けると、拾えた参照すべてと参照 0 件のファイルを表示する。設定を読んでいるはずのファイルが 0 件なら、照合しない書き方なので差分を目で読む

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
php .claude/skills/sync-from-jp4wc/check-setting-keys.php                         # unknown 0 件（本体 + tests）
composer lint
composer phpstan                                  # baseline を作り直す前に。「Ignored error pattern …」以外のエラーが 0 件であること
composer phpstan:baseline && composer phpstan     # 直って消えた分を baseline から落とす。件数が減ること
composer test                                      # 事前に composer test:db && composer test:install
npm run build                                      # src/ を触った場合
git diff --stat
```

- 作り直す前の `composer phpstan` で出る通常のエラーは、新しいコードのエラー。baseline に入れず直す（JP4WC 側のバグなら JP4WC にも報告）。
  既存エントリと同じエラーが増えた場合も、`… is expected to occur 1 time, but occurred 2 times` と本体のエラーが出る。
  `Ignored error pattern … was not matched` / `… but occurred only …` は直って消えた・減った分なので、そのまま再生成してよい。
  `phpstan:baseline` は新しいエラーも吸収して exit 0 にするので、この順番を飛ばさない
- `Access to an undefined property WC_Gateway_Paidy::$…`（`property.notFound`）は存在しない設定をプロパティで読んでいる可能性がある
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
| sandbox なのに本番鍵で検証される・設定を変えても挙動が変わらない | 取り込んだコードが paidy-wc に無い設定名を読んでいる（JP4WC の `testmode`）。`check-setting-keys.php` で照合 |
