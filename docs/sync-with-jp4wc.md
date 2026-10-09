# JP4WC からの同期

このプラグインは Japanized for WooCommerce（JP4WC）の Paidy モジュールの下流。JP4WC で直った不具合・セキュリティ修正は
ここに取り込む。手順はエージェント向けに `.claude/skills/sync-from-jp4wc/SKILL.md` にまとめてある。本ファイルは対応表と判断基準。

## リポジトリ

| | JP4WC | paidy-wc |
|---|---|---|
| ローカル | `~/Dev/Japanized-for-WooCommerce` | `~/Dev/paidy-wc` |
| GitHub | artisanworkshop/Japanized-for-WooCommerce | SoftStepsEC/paidy-wc（`upstream`）/ shoheitanaka/paidy-wc（`origin`） |
| テキストドメイン | `woocommerce-for-japan` | `paidy-wc` |
| バージョン（2026-10-09） | 2.9.16 | 1.5.2 |

## ファイル対応表

| JP4WC | paidy-wc | 同期方法 |
|-------|----------|----------|
| `includes/gateways/paidy/class-*.php`（8 ファイル） | `includes/gateways/paidy/class-*.php` | コピーしてテキストドメインを置換。下記「意図的な差分」を再適用 |
| `includes/gateways/paidy/assets/js/frontend/` | `includes/gateways/paidy/assets/js/frontend/` | **コピーしない**。`src/` を同期して `npm run build` |
| `assets/js/build/paidy/{admin,wizard}/` | `includes/gateways/paidy/assets/js/{admin,wizard}/` | 同上（ビルド出力パスが違う） |
| `src/js/paidy/**` | `src/**`（`src/js/paidy/paidy/` → `src/paidy/`） | コピー。import パスの相対参照を確認 |
| `includes/jp4wc-framework/*.php` | `includes/jp4wc-framework/*.php` | verbatim コピー（namespace のバージョン `v2_0_14` と `class-wc-paidy.php` の `$framework_version` を一致させる） |
| `class-wc-paidy.php`（JP4WC 側は同梱用ローダー） | `class-wc-paidy.php` | **コピーしない**。差分を読んで該当ロジック（例: Endpoint の `init` 11 遅延）だけ移植 |
| `woocommerce-for-japan.php` の Paidy 関連 | `paidy-wc.php` | 移植のみ |
| `uninstall.php` の `wc_paidy_delete_plugin()` | `uninstall.php` | 関数の中身だけ移植（paidy-wc は `paidy_wc_version` も消す） |
| `tests/Unit/test-paidy-*.php` | `tests/Unit/test-paidy-*.php` | コピーしてテキストドメイン・`@package` を置換。`dirname( __DIR__, 2 )` 基準の require パスはそのまま使える |
| `assets/images/paidy_*`、`assets/css/jp4wc-paidy.css` | 同名 | 必要時にコピー |
| `docs/payment-paidy.md` | （ユーザー向けドキュメントは readme.txt） | 参考 |

## 意図的な差分（コピー後に必ず再適用する）

1. **テキストドメイン**: `'woocommerce-for-japan'` → `'paidy-wc'`（`sed` で一括。`wp_set_script_translations` の第 2 引数も）
2. **定数**: `WC_PAIDY_BLOCKS_URL` / `WC_PAIDY_ASSETS_ABSPATH` の値は `class-wc-paidy.php` 側で定義しており、
   JP4WC は `assets/js/build/paidy/`、paidy-wc は `includes/gateways/paidy/assets/js/`。ゲートウェイ側のコードは定数経由なので
   コピーしたファイル内に直書きパスが無いか確認する
3. **`@package`**: JP4WC は `WooCommerce\Gateways` / `Japanized_For_WooCommerce`、paidy-wc は `paidy-wc`（テストファイル）
4. **ロゴ画像**: JP4WC は `includes/gateways/paidy/assets/images/` にもロゴを持つ。paidy-wc は `assets/images/`
5. **`class-wc-paidy.php`**: paidy-wc 版は `load_plugin_textdomain()` と `wc_paidy_blocks_support()` を持つ（JP4WC 版は本体側が担う）
6. **JP4WC 固有機能への参照**: 読み仮名（`_billing_yomigana_*`）は「あれば使う」実装なので残してよい。
   `JP4WC_` クラス・`wc4jp-` オプションへの新しい依存が入っていたら、単体で動くように条件分岐するか外す
7. **Webhook 署名の鍵選択**（`class-wc-paidy-endpoint.php` の `paidy_webhook_permission_check()`）: JP4WC は
   `'yes' === $this->paidy->get_option( 'testmode' )` だが、ゲートウェイに `testmode` 設定は無く、sandbox でも本番鍵で検証してしまう。
   paidy-wc は `'live' !== $this->paidy->get_option( 'environment' )`（`set_api_secret_key()` と同じ判定）。JP4WC が直したらこの項目を消す。
   回帰テスト: `test-paidy-webhook-permission.php` の `test_signature_made_with_*`
8. **WPCS 由来の書き換え**（ロジックは不変）: endpoint の `$order->get_payment_method() !== 'paidy'` を Yoda 条件に、
   新規メソッドの DocBlock に `@since`。ゲートウェイの `$jp4wc_framework` の `@var` を `stdClass` から `Framework\JP4WC_Framework` に
   （PHPStan baseline の削減）。テスト `test-paidy-payment-id-format.php` の「issue #223」は「Japanized for WooCommerce issue #223」。
   receiver / wizard の `@since 2.9.16` は `@since 1.6.0` に、`@since` の無い state token 系メソッドには `@since 1.6.0` を足す。
   コメント中の「before 2.9.16」「2.9.13–2.9.14 の 2 日 transient」のような JP4WC の版の話は paidy-wc の版（1.6.0 より前は state token
   なし）に（receiver の `SIGNATURE_HEADER` の DocBlock と署名経路のコメント、wizard の `plugin_version` のコメント）。移植テストの「issue #210」も同様に書き換え、
   `test-paidy-receiver-signature.php` の tearDown の LIKE 削除は `$wpdb->prepare()` + `esc_like()` に（PHPCS エラー）
9. **アップグレード処理**（`class-wc-paidy-apply-receiver.php` 末尾、`paidy-wc.php`）: JP4WC は `JP4WC_Install` の `jp4wc_updated` で
   `redact_stored_secrets_on_upgrade()` を呼ぶが、paidy-wc にはバージョン検出が無い。paidy-wc は `paidy-wc.php` の
   `paidy_wc_check_version()`（`init` 5、option `paidy_wc_version`）が版の変化で `paidy_wc_updated` を発火し、receiver はそれにつなぐ。
   1.5.2 以前は版を記録していないので、版の記録が無い場合も発火する（新規インストールと区別しない）。ダウングレードでは発火しない。
   receiver を取り込むときは末尾の `add_action( 'jp4wc_updated', … )` と DocBlock の `JP4WC_Install` 言及を毎回書き換える。
   回帰テスト: `test-paidy-upgrade.php`、`test-paidy-receiver-signature.php` の `…_is_registered_at_file_load`
10. **申込送信の `plugin_version`**（`class-wc-paidy-admin-wizard.php`）: JP4WC は `JP4WC_VERSION`（paidy-wc では未定義で常に空）。
    paidy-wc は `WC_PAIDY_VERSION`（JP4WC の review-backlog R1-L2 の提案どおり）。回帰テスト: `test-paidy-wizard-apply.php`
11. **wizard のコンストラクタと `paidyForWcSettings`**（`class-wc-paidy-admin-wizard.php`）: JP4WC `a417036`（2026-02）はメニュー・
    スクリプト・説明文フィルタの登録を API キー有無の条件から外し、JS に `hasApiKeys` を渡して JS 側でリダイレクトする。
    paidy-wc は JS（`src/`）を同期していないので、条件付き登録・`$plugin_name = 'Paidy for WooCommerce'`・`hasApiKeys` なしのまま
    （backlog B-25。JS を同期するときに一緒に取り込んでこの項目を消す）

## 差分の取り方

```bash
cd ~/Dev/paidy-wc
J=~/Dev/Japanized-for-WooCommerce

# ゲートウェイ本体（テキストドメイン差を無視して実質差分だけ見る）
for f in includes/gateways/paidy/class-*.php; do
  echo "== $f"; diff <(sed "s/woocommerce-for-japan/paidy-wc/g" "$J/$f") "$f" | grep -c '^[<>]'
done

# 個別に読む
diff <(sed "s/woocommerce-for-japan/paidy-wc/g" "$J/includes/gateways/paidy/class-wc-paidy-endpoint.php") \
     includes/gateways/paidy/class-wc-paidy-endpoint.php | less

# JP4WC 側の Paidy 変更履歴
awk '/^== Changelog ==/{f=1} f' "$J/readme.txt" | grep -iE "^= [0-9]|paidy"
git -C "$J" log --oneline -- includes/gateways/paidy tests/Unit/test-paidy-*.php | head -40
```

## 未取り込み（JP4WC changelog より。詳細は DEVELOPMENT_PLAN.md Phase 1）

2026-10-09 時点の一覧から、Phase 1-1（ブランチ `fix/webhook-auth`）と 1-2（`fix/receiver-auth`）で取り込んだ分を除いたもの。

| JP4WC 版 | 内容 | 対象ファイル |
|---------|------|------------|
| 2.9.0 | `paidy_capture_id` による再キャプチャ防止 | gateway |
| 2.9.5 | ゲートウェイ未登録時のブロック対応 fatal 回避、wp-env 等の非標準パスでの `WC_Gateway_Paidy not found` 修正 | blocks-support, loader |
| 2.9.14 | サンクスページでの裏取り（`thankyou_completed()` から `paidy_verify_payment_for_order()`） | gateway |
| 2.9.15 | 説明文の `force_balance_tags()` | gateway |
| （2026-02、`a417036`） | wizard のフック登録条件と JS の `hasApiKeys` リダイレクト、申込 ID の表示（JS） | wizard, `src/` |

付随テスト（JP4WC `tests/Unit/`）: `test-paidy-description-balance.php` `test-paidy-guest-order-history.php`

### 取り込み済み

| Phase | JP4WC 版 | 内容 |
|-------|---------|------|
| 1-1 | 2.9.0 | `WC_Paidy_Endpoint` を `init` 11 に遅延 |
| 1-1 | 2.9.6 / 2.9.13 | `paidy/v1/order` の HMAC 署名 or IP 許可リスト認証（署名なしの通知を拒否しない）、決済方法確認、冪等性、Paidy API での裏取り。`paidy/v1/check` は JP4WC 同様 `__return_true` |
| 1-1 | 2.9.14 / #223 | `paidy_get_payment_data()` の `wp_safe_remote_get()` 化、`^pay_[A-Za-z0-9_-]+$/D` 検証 + `rawurlencode()`、`paidy_verify_payment_for_order()`。テスト `test-paidy-payment-id-format.php` |
| 1-2 | 2.9.13 / 2.9.15 / 2.9.16 | receiver の state token（non-autoload option）・HMAC 署名フォールバック・リプレイ防止・body のみから認証・application_id 一致確認・復号失敗の翻訳可能化・鍵フィールドの補完・`paidy_received_data` から秘密鍵除外（既存分はアップグレード時に伏せ字）。wizard の state token 送信・申込 ID の保存・`wizard=false` 修正・`pk_test_` 書き換えの廃止・二重ログ修正。`uninstall.php` の Paidy 部分。テスト `test-paidy-receiver-signature.php` `test-paidy-onboarding-state.php` `test-paidy-application-id.php` `test-paidy-manual-settings.php` |

## 同期後のチェック

- [ ] `grep -rn "woocommerce-for-japan" includes src tests` が 0 件
- [ ] `php .claude/skills/sync-from-jp4wc/check-setting-keys.php` が unknown 0 件（取り込んだコードが読む設定名がゲートウェイに実在する。
      「意図的な差分」7 の `testmode` のような取り違えを検出する）
- [ ] `composer check`（lint / phpstan / test）が通る。PHPStan baseline は、再生成の前の `composer phpstan` で新しいエラーが無いことを
      確かめてから再生成し、件数が減っている
- [ ] `npm run build` して成果物を更新（`src/` を同期した場合）
- [ ] wp-env でクラシック / ブロック両チェックアウトに Paidy が出る（JPY・テスト鍵）
- [ ] 文字列が増えていれば `update-i18n` スキルで POT / JSON を更新
- [ ] `readme.txt` の changelog に JP4WC 側の文言を流用して追記（`release-bump` スキル）
