---
name: sync-from-jp4wc
description: Japanized for WooCommerce（JP4WC）の Paidy モジュールの変更を、この単体プラグイン（paidy-wc）へ取り込む。「JP4WC の変更を取り込んで」「JP4WC と同期して」「JP4WC 2.9.x の Paidy 修正を反映して」「Webhook 署名検証を JP4WC から持ってきて」などと言われたら使う。ファイル対応表・テキストドメイン置換・意図的な差分の再適用・設定名の照合・テスト移植・検証までを行う。JP4WC にも残る不具合を見つけたときの Issue の書式と起票後の記録も扱う（「JP4WC に Issue を出して」「JP4WC に起票して」）。
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
grep -nE "@since[[:space:]]+2\.|(PR|issue) #[0-9]+" "$f"                # JP4WC の版・PR 番号
# JP4WC だけが発火するフックへのリスナー（paidy-wc では一度も呼ばれない）
for h in $(grep -oE "add_(action|filter)\([[:space:]]*'(jp4wc|wc4jp)[a-z0-9_]*'" "$f" | grep -oE "'[^']+'" | tr -d "'" | sort -u); do
  grep -rqE "(do_action|apply_filters)\([[:space:]]*'$h'" --include='*.php' includes class-wc-paidy.php paidy-wc.php || echo "never fired in paidy-wc: $h"
done
```

- `never fired in paidy-wc` が出たら、paidy-wc 側の対応するフックに付け替える。`jp4wc_updated`（JP4WC の `JP4WC_Install` が発火）は
  `paidy_wc_updated`（`paidy_wc_check_version()` が発火。意図的な差分 9）。付け替えないとエラーも警告も出ず、処理が黙って動かない
- `JP4WC_VERSION` は `WC_PAIDY_VERSION` に（意図的な差分 10。`defined()` でガードされているので PHPStan は何も言わない）
- `@since 2.x` は次の paidy-wc の版（現行 Stable tag + 1）に、コメント中の JP4WC の版（「2.9.15 で」など）も paidy-wc の版に直す。
  `PR #213` / `issue #210` は paidy-wc の番号と紛れるので「Japanized for WooCommerce PR #213」と書く
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
- 手順 3 (a) の 2 つ目以降の確認（版・PR 番号・フック）をテストにも流す。`has_action( 'jp4wc_updated', … )` を確かめるテストは、
  フックが paidy-wc で発火しなくても通るので、paidy-wc のフック名に書き換える
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

- 作り直す前の `composer phpstan` で出る通常のエラーは、新しいコードのエラー。baseline に入れず直す（JP4WC 側のバグなら「JP4WC に Issue を出す」の書式で JP4WC にも報告）。
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

## JP4WC に Issue を出す

同期やレビューで見つけた不具合が JP4WC にも残っているとき（取り込まなかった悪化 hunk、手順 5 の新しいエラー、Bot レビューの指摘で
JP4WC でも再現するもの）は、paidy-wc では直さず JP4WC に Issue を出し、直ってから同期する。書式は JP4WC #231〜#234（2026-10-10 起票）に揃える。

### 起票前に確かめる

```bash
J=~/Dev/Japanized-for-WooCommerce
# artisanworkshop を指すリモート（このマシンのクローンは origin がフォークで upstream が正）
R=$(git -C "$J" remote -v | awk '/artisanworkshop\/Japanized-for-WooCommerce.*\(fetch\)/ { print $1; exit }')
git -C "$J" fetch -q "$R"
git -C "$J" show "$R/main:readme.txt" | grep -m1 '^Stable tag:'; git -C "$J" rev-parse --short "$R/main"   # 「確認した版」
git -C "$J" grep -n '<該当コード>' "$R/main" -- includes/gateways/paidy/                                     # 行番号
gh issue list --repo artisanworkshop/Japanized-for-WooCommerce --state all --search '<キーワード> in:title,body'  # 重複
```

- 版・行番号は artisanworkshop の `main` で取る（ローカルの作業ツリーやフォークの `main` が古いと行番号がずれる。pull はユーザーに確認してから）
- 該当箇所が `main` に同じ形で残っていることを確かめる。直っていれば Issue ではなく同期する

### タイトル・ラベル

- `Paidy: ` + 店舗・購入者から見て何が起きるかを 1 文で。原因のコードより症状を先に書く（#231・#232・#234）。
  症状が表に出にくい欠陥は、欠陥そのものを書く（#233「取消・キャプチャ・返金で transaction_id を検証せずに API の URL に連結している」）
- ラベルは `bug`（機能追加なら `enhancement`）

### 本文

```markdown
## 概要

`includes/gateways/paidy/<file>.php` の `<function>()` は、<コードが何をしていて、何が足りないか>（<行> 行）。

## 起きること

- **<症状の見出し>**
  - <起きる条件と結果。エラーメッセージは `Error: Cannot use object of type WP_Error as array` のように原文で>

## 確認した版

- main（<Stable tag>、<短縮ハッシュ>）の <行> 行
- 同じコードの単体版（Paidy for WooCommerce）で、<一時テスト・`node --check` など、何をして何を確かめたか>

## 修正案

- <方針。差分が小さければ PHP のコードブロックで示す（#234）>

## 関連

- #<JP4WC の関連 Issue / PR>（<関係を一言。別の不具合なら「今回とは別の不具合です」>）
- 単体版 Paidy for WooCommerce の backlog B-<n>。こちらで直していただいたものを単体版に同期します。
```

- です・ます調で書く（paidy-wc の docs は である調だが、Issue は JP4WC 向け）
- paidy-wc は「単体版（Paidy for WooCommerce）」と書き、参照は backlog の `B-<n>` だけにする。paidy-wc の PR 番号は JP4WC の `#` に
  自動リンクされて別物を指し、レビュー ID（`R1-X1`・`G1-1`）は JP4WC 側から意味が取れないので書かない。単体版の行番号も書かない
- 実測したこと（一時テストの結果、`node --check`）と推測を分ける。確かめていない挙動を「起きます」と書かない
- 1 Issue = 1 原因。同じ修正で直る複数の箇所はまとめる（#231 は取消・キャプチャ・返金の 3 か所）
- JP4WC は公開リポジトリで、private vulnerability reporting は無効（2026-10-10 時点）。悪用の手順が書ける脆弱性（認証の回避・秘密鍵の
  漏えいなど）は公開 Issue にせず、Security Advisory の下書きにするかをユーザーに確認する。公開 Issue にするときも成立条件と影響の説明に
  とどめ、再現用のリクエストは書かない（#233）

### 起票と記録

本文は scratchpad に書き、タイトル・ラベル・本文をユーザーに見せて承認を得てから起票する（公開される操作なので、1 件ずつ確認する）。

```bash
gh issue create --repo artisanworkshop/Japanized-for-WooCommerce --label bug \
  --title 'Paidy: <症状>' --body-file <scratchpad>/jp4wc-issue-B<n>.md
```

起票したら paidy-wc 側に記録する（ドキュメントだけの変更なら `main` へ直接コミットしてよい。コミットはユーザーの指示で）:

- `docs/review-backlog.md` の該当行の「解消予定」を `JP4WC #<n> で修正後に同期（<いつまでに>）` にする（B-26 の行と同じ形）
- リリース前に直すものは `docs/DEVELOPMENT_PLAN.md` の該当ステップに `B-<n> → JP4WC #<n>（<一言>）` を足す（1-5 の記述と同じ形）
- 取り込まなかった hunk なら `docs/sync-with-jp4wc.md` の「意図的な差分」に Issue 番号を書く
- Bot レビューの指摘から出したものは、スレッドに Issue 番号と「JP4WC で直してから同期する」旨を返信し、未解決のまま残す
- JP4WC で直ったら手順 1〜6 で取り込み、backlog の行を消す

## 失敗モード

| 症状 | 原因 |
|------|------|
| 管理画面やチェックアウトの文字列が英語のまま | テキストドメインの置換漏れ。`grep woocommerce-for-japan` |
| ブロックチェックアウトでスクリプト 404 | JP4WC の `assets/js/build/paidy/` パスがコピーしたファイルに残っている。定数経由にする |
| `Class JP4WC_... not found` | JP4WC 本体のクラスへの依存が入った。ガードするか外す |
| PHPStan baseline の行が「存在しないエラー」で失敗する | 置換で行がずれた。`composer phpstan:baseline` で作り直す |
| テストが `WC_Gateway_Paidy` の `__()` で textdomain 警告 | `init` 前にゲートウェイを生成している（B-9）。JP4WC の遅延ロジックを先に移植 |
| paidy-wc 側だけの修正が消えた | 手順 2 を飛ばしてコピーした。`git diff` で復元 |
| アップグレード時の処理（`paidy_received_data` の秘密鍵の伏せ字など）が動かない | JP4WC の `jp4wc_updated` に登録したまま。paidy-wc では発火しない。手順 3 (a) の `never fired` 確認 |
| sandbox なのに本番鍵で検証される・設定を変えても挙動が変わらない | 取り込んだコードが paidy-wc に無い設定名を読んでいる（JP4WC の `testmode`）。`check-setting-keys.php` で照合 |
