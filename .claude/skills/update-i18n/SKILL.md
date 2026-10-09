---
name: update-i18n
description: Paidy for WooCommerce（paidy-wc）の翻訳ファイルを更新する。ユーザー向け文字列（`__()` / `esc_html__()` / `@wordpress/i18n`）を追加・変更した PR で必ず実行する。POT 再生成 → （ローカルの）ja.po 更新と日本語訳 → JS 用 JSON 再生成 → 検証まで。「翻訳を更新して」「POT を作り直して」「日本語訳を追加して」「i18n を更新して」で使う。
---

# i18n 更新スキル（paidy-wc）

## このリポジトリの翻訳の持ち方（他リポジトリと違う点）

| ファイル | 追跡 | 役割 |
|---------|------|------|
| `i18n/paidy-wc.pot` | ✅ | 全文字列のテンプレート。WordPress.org の翻訳（言語パック）の元 |
| `i18n/paidy-wc-ja-<md5>.json` | ✅ | JS（React アプリ 3 本）の日本語訳。`wp_set_script_translations( ..., 'paidy-wc', WC_PAIDY_ABSPATH . 'i18n/' )` が読む |
| `i18n/paidy-wc-ja.po` / `.mo` | ❌（`.gitignore`） | ローカル作業用。PHP 側の日本語訳は **WordPress.org 言語パック**が配信する |

- テキストドメイン: `paidy-wc`。ディレクトリは `i18n/`（`languages/` ではない。`bin/build_i18n.sh` と `npm run i18n:json` は
  `languages/` を参照していて動かない → backlog B-5）
- JSON の `<md5>` = ビルド済みスクリプトのプラグイン相対パスの md5:

  | スクリプト | md5 |
  |-----------|-----|
  | `includes/gateways/paidy/assets/js/admin/paidy.js` | `f1b5d108cb3324c74c7028b874613d58` |
  | `includes/gateways/paidy/assets/js/frontend/paidy.js` | `16463c661bc87af3055e72f37a52b9e8` |
  | `includes/gateways/paidy/assets/js/wizard/paidy.js` | `12e0aa1eda445dc81ea8e0362028f102` |

  確認: `printf '%s' 'includes/gateways/paidy/assets/js/wizard/paidy.js' | md5`
- **この開発機に wp-cli は未導入**。`wp i18n` は scratchpad に取得した phar で実行する（リポジトリ内に phar を置かない）
- `msgmerge` / `msgattrib` / `msgfmt` は Homebrew の gettext（導入済み）
- コミットはユーザーが指示する（このスキルではコミットしない）

## 手順

### 0. wp-cli phar を用意する

```bash
WP=<scratchpad>/wp-cli.phar
[ -f "$WP" ] || curl -sL -o "$WP" https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
php "$WP" --version
```

（wp-env が起動中なら `npm run make-pot` / `npm run make-json` でも代替できる。コンテナ内の wp-cli を使う）

### 1. POT を再生成する

```bash
cd ~/Dev/paidy-wc
php "$WP" i18n make-pot . i18n/paidy-wc.pot --domain=paidy-wc \
  --exclude=vendor,node_modules,tests,docs,bin,includes/gateways/paidy/assets \
  --headers='{"Report-Msgid-Bugs-To":"https://wordpress.org/support/plugin/paidy-wc"}'
git diff --stat i18n/paidy-wc.pot
git diff i18n/paidy-wc.pot | grep '^[-+]msgid' 
```

- `src/`（React のソース）は除外しない。JS の文字列は `src/` から抽出され、`#: src/...` の参照が付く
- 今回の変更分以外の msgid が増減していたら過去の更新漏れ。まとめて反映するか、見送るならユーザーに報告する
- 行番号参照だけの差分は正常

### 2. ローカルの ja.po を更新して日本語訳を入れる（PHP / JS とも、JSON を作るために必要）

`i18n/paidy-wc-ja.po` が無ければ（追跡していないので新しいクローンには無い）WordPress.org から取得する:
https://translate.wordpress.org/projects/wp-plugins/paidy-wc/stable/ja/default/ → Export（`.po`）→ `i18n/paidy-wc-ja.po` に保存。

```bash
msgmerge --update --backup=none --no-fuzzy-matching i18n/paidy-wc-ja.po i18n/paidy-wc.pot
msgattrib --untranslated i18n/paidy-wc-ja.po | grep '^msgid'
```

未翻訳の `msgstr` を埋める。既存訳のトーンに合わせる（注文メモ・管理者向けは「Paidy: 〜しました。」調、
プレースホルダー `%s` / `%1$s` は必ず残す）。プラグイン名・作者名・URL は未翻訳のまま。

```bash
msgfmt --check -o i18n/paidy-wc-ja.mo i18n/paidy-wc-ja.po
```

`.po` / `.mo` はコミットされない。**PHP 側の訳は translate.wordpress.org にも投入する**（ユーザーの作業。報告に含める）。

### 3. JS 用 JSON を再生成する（`src/` の文字列を変えた場合のみ）

`wp i18n make-json` は `.po` の `#: <path>` 参照ごとに JSON を作り、ファイル名の md5 は**その参照パス**で計算する。
WordPress が実行時に探すのは**ビルド済みスクリプトのパス**の md5 なので、先に `.po` の `#: src/...` 参照を
ビルド済みパスに書き換えてから `make-json` する（`bin/build_i18n.sh` が本来やろうとしていること。現状は `languages/` を見ていて動かない）。

```bash
S=<scratchpad>
cp i18n/paidy-wc-ja.po "$S/paidy-wc-ja.po"
# バンドルごとにソース参照をビルド済みパスへ。main-hooks/ は wizard と admin の両方に含まれるので両方へ展開する。
sed -E -i '' \
  -e 's#src/wizard/[^ ]+#includes/gateways/paidy/assets/js/wizard/paidy.js#g' \
  -e 's#src/admin/[^ ]+#includes/gateways/paidy/assets/js/admin/paidy.js#g' \
  -e 's#src/paidy/[^ ]+#includes/gateways/paidy/assets/js/frontend/paidy.js#g' \
  -e 's#src/main-hooks/[^ ]+#includes/gateways/paidy/assets/js/wizard/paidy.js includes/gateways/paidy/assets/js/admin/paidy.js#g' \
  "$S/paidy-wc-ja.po"
mkdir -p "$S/json" && cp "$S/paidy-wc-ja.po" "$S/json/"
php "$WP" i18n make-json "$S/json" --no-purge --pretty-print
ls "$S/json"      # paidy-wc-ja-{12e0aa1e…,f1b5d108…,16463c66…}.json ができているはず
cp "$S/json"/paidy-wc-ja-*.json i18n/
```

- 生成された JSON の md5 が上の表と一致することを確認する。一致しない名前のファイルができたら、参照の書き換え漏れ
  （`grep -n '^#: src/' "$S/paidy-wc-ja.po"`）
- **この手順は 2026-10-09 時点で未実行**（wp-cli 未導入のため）。初回に通したら、この注記を消して手順を確定させる。
  うまくいかなければ、既存 JSON（例: `12e0aa1e…`）の構造に合わせて `locale_data.paidy-wc` にエントリを手で追加する
- 旧パス由来の JSON 7 個（表に無い md5）は触らない（B-5 で整理）

### 4. 検証

- [ ] `git diff i18n/paidy-wc.pot` に今回の新規文字列がすべて含まれる
- [ ] `msgattrib --untranslated` の残りがプラグインメタデータのみ、`msgattrib --only-fuzzy` が空
- [ ] JS 文字列を変えた場合、対応する md5 の JSON に新しい msgid が入っている（`grep '<英語文字列>' i18n/*.json`）
- [ ] wp-env（`WPLANG` ja）で該当画面を開き、日本語で表示される（JS は `SCRIPT_DEBUG` でも JSON が読まれる）
- [ ] `git status` に `.po` / `.mo` が出てこない（gitignore 済みなら出ない）
- [ ] バージョンを上げた PR なら、POT の `Project-Id-Version` が新バージョン（`make-pot` はヘッダーの `Version` から取る）

## 失敗モード

| 症状 | 原因 |
|------|------|
| `npm run i18n:pot` が `wp: command not found` | wp-cli 未導入 → 手順 0 の phar |
| `npm run i18n:json` / `bin/build_i18n.sh` が何もしない | `languages/` を参照している（B-5）。手順 3 を使う |
| 翻訳したのに JS が英語のまま | JSON の md5 がビルド済みパスと違う／`locale_data` のドメインキーが `paidy-wc` でない／キャッシュ |
| PHP 側が日本語にならない | ローカルの `.mo` は配布されない。本番は WordPress.org 言語パック。wp-env で見るなら `.mo` を置くか言語パックを更新 |
| msgmerge 後に `#, fuzzy` が付く | `--no-fuzzy-matching` を付け忘れた。`.po` を戻してやり直す |
