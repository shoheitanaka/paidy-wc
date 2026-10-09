# dev-cycle 最終報告: fix/webhook-auth

## 開発内容
- タスク: Phase 1-1 Webhook 認証 / PR #39 https://github.com/SoftStepsEC/paidy-wc/pull/39
- 計画の要約: JP4WC 2.9.16 の `class-wc-paidy-endpoint.php` を取り込み、`paidy/v1/order` を HMAC 署名 or Paidy 公式 IP で認証し、
  決済方法確認・冪等性・Paidy API での裏取りを入れる。`WC_Paidy_Endpoint` を `init` 11 に遅延（B-9）
- コミット:

| sha | メッセージ |
|---|---|
| f2ba611 | fix: create WC_Paidy_Endpoint on init priority 11 |
| b07a603 | fix(security): look up Paidy payments with a validated GET request |
| c27e9ee | fix(security): authenticate the Paidy webhook before it touches orders |
| 51a0479 | chore(i18n): regenerate the POT for the webhook messages |
| 4063496 | docs: record the Phase 1-1 webhook authentication sync |
| 4d6dcbc | test: pin the GET lookup and failed-lookup handling of Paidy payments |
| de13e14 | docs: record review-loop round 1 for the webhook authentication |
| 2adeae5 | test: assert the payment lookup in the failed-lookup webhook test |
| 21726f1 | docs: record review-loop round 2 for the webhook authentication |
| 350c5f0 | docs: record dev-cycle gate round 1 |
| （本コミット） | docs: record dev-cycle gate round 2 and final report |

- 計画からの逸脱（計画承認時に合意済み）:
  1. 1-3 の一部（`paidy_get_payment_data()` の GET 化・形式検証、`paidy_verify_payment_for_order()`、`test-paidy-payment-id-format.php`）を前倒し
  2. `paidy/v1/check` は JP4WC と同じく `__return_true`
  3. JP4WC の `get_option( 'testmode' )`（存在しない設定）を `environment` 判定に直して取り込み（`docs/sync-with-jp4wc.md` 意図的な差分 7）

## review-loop（PR 前）
| ラウンド | 指摘 | 修正 | backlog |
|---|---|---|---|
| R1 | Medium 1 / Low 2 / 対象外 4 + Low 1 | 2（R1-1, R1-3） | 7（B-14〜B-20） |
| R2 | Low 1 | 1（R2-1） | 0 |

APPROVE（R2）

## Codex / Copilot ゲート
| ラウンド | bot | 新規指摘 | 修正 | 保留 | 状態 |
|---|---|---|---|---|---|
| G1 | Copilot | 2 | 0 | 2 | 未収束 → 再依頼 |
| G2 | Copilot | 0（本文は既出 2 + 対応済み 1） | 0 | 0 | 収束 |
| - | Codex | - | - | - | 未接続（CLAUDE.md） |

### 修正した指摘
なし（ゲートでの指摘はすべて保留または対応済み）

### 修正しなかった指摘（PR 上で未解決のまま残してある）
| ID | bot | 重大度 | 理由 | スレッド |
|---|---|---|---|---|
| G1-1 | Copilot | Low | 応答は TLS 越しの api.paidy.com で攻撃者が操作できず、order_ref・金額・状態の照合は残る。JP4WC と同一コード → B-21 | https://github.com/SoftStepsEC/paidy-wc/pull/39#discussion_r4229539927 |
| G1-2 | Copilot | Medium | 並行 `authorize_success` の二重処理。main / JP4WC にも元からある競合で、サンクスページ（1-3）にも同じ手当てが要る。注文単位のロックを JP4WC で設計してから同期 → B-22 | https://github.com/SoftStepsEC/paidy-wc/pull/39#discussion_r4229540002 |
| G2-1 | Copilot | - | 実際の Paidy sandbox Webhook での確認が未実施（コードの指摘ではない。人間の作業） | レビュー本文 |

## 品質ゲート
- CI: https://github.com/SoftStepsEC/paidy-wc/actions/runs/37923259760 green（350c5f0。PHPCS / PHPStan / PHPUnit 3 本 / JS build）
- 品質チェック: green（PHPCS エラー 0・警告 9 件は既存、PHPStan エラー 0・baseline 56→39、PHPUnit 61 件）

## 次にできること（人間の判断）
- **マージ前の実地確認を推奨**: Paidy の sandbox で実際の Webhook（署名の有無・送信元 IP）が 200 で受理され、注文が処理中になること。
  ローカル wp-env は B-13 のため paidy-wc が起動しないので、外部から到達できるステージング等で確認する
- JP4WC 側の対応: 署名鍵の `testmode` バグ（意図的な差分 7）、B-14（XFF 先頭）、B-15（不正入力で fatal）、B-16（フック DocBlock）、
  B-21（`id` 欠落）、B-22（並行処理のロック）。直したら paidy-wc へ同期
- 保留分の修正: `/dev-cycle fix G1-1 G1-2` または `/fix-copilot-review 39`
- マージ（GitHub 上で人間が行う）→ マージ後は `/post-merge`
