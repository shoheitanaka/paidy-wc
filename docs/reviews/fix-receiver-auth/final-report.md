# dev-cycle 最終報告: fix/receiver-auth

## 開発内容
- タスク: Phase 1-2 受信エンドポイント認証（JP4WC 2.9.16 の receiver / wizard を取り込み）
- PR: #41 https://github.com/SoftStepsEC/paidy-wc/pull/41
- 承認された計画の要約: `paidy-receiver/v1/receive` の無条件 `return true` を、JP4WC 2.9.16 の state token + body の HMAC 署名
  （`x-paidy-receiver-signature`）+ application_id 一致 + リプレイ防止に置き換える。ウィザードは state token を送り申込 ID を保存する。
  JP4WC の `jp4wc_updated` の代わりに `paidy_wc_check_version()` / `paidy_wc_updated` を追加して、既存の平文秘密鍵を伏せ字にする
- コミット:

| sha | メッセージ |
|---|---|
| dd482bf | fix(security): authenticate the Paidy onboarding receiver |
| 6da05a8 | fix(security): send a state token and record the application ID from the wizard |
| 0e562ef | fix: redact secret keys stored before 1.6.0 once after an upgrade |
| 5703740 | fix: delete the receiver's option rows on uninstall |
| e0aa8d9 | chore(i18n): regenerate the POT for the receiver messages |
| df6d2cc | docs: record the Phase 1-2 receiver authentication sync |
| fc2c102 | fix: do not fire paidy_wc_updated on a downgrade（R1-2） |
| 38da74f | test: cover the state token and plugin version in the wizard's application POST（R1-1） |
| 0f84193 | docs: describe paidy-wc versions in the synced receiver comments（R1-3） |
| d527124 / 47ba9ee | docs: record review-loop round 1 / 2 |
| 16e83f3 / 237f480 / d3d43f1 / 57f423b | docs: dev-cycle の状態・ゲート記録 |

- 設計ドキュメントからの逸脱（計画承認時に合意済み）: `paidy_wc_updated` の追加（意図的な差分 9）、`plugin_version` に `WC_PAIDY_VERSION`（10）、
  wizard のコンストラクタ・`hasApiKeys` は未同期（11 / B-25）、フィルタ名 `wc4jp_paidy_*` は JP4WC のまま

## review-loop（PR 前）
| ラウンド | 指摘 | 修正 | backlog |
|---|---|---|---|
| R1 | Medium 1 / Low 7 / 対象外 3（うち High 1） | 6（R1-1〜R1-5・R1-8） | 5（B-26〜B-30） |
| R2 | Low 1（APPROVE） | 1（R2-1 を差分 8 に明記） | 0 |

## Codex / Copilot ゲート
| ラウンド | bot | 新規指摘 | 修正 | 保留 | 状態 |
|---|---|---|---|---|---|
| G1 | Copilot | 2 | 0 | 2 | 未収束 |
| G2 | Copilot | 2（スレッド 1 + 本文 1） | 0 | 2 | 未収束 |
| G3 | Copilot | 0（本文は既出の確認事項のみ） | 0 | 0 | 収束 |

Codex は未接続（CLAUDE.md）。

### 修正した指摘
なし（ゲートでの修正は 0 件）

### 修正しなかった指摘（PR 上で未解決のまま残してある）
| ID | bot | 重大度 | 理由 | スレッド |
|---|---|---|---|---|
| G1-1 | Copilot | Low | クエリでの上書きは誤り（`get_param()` は JSON → POST → GET）。配列の `TypeError` は JP4WC 由来 → B-31（2026-10-10 訂正: `GET` + form-encoded の body ではクエリが勝つ。B-31 に統合） | https://github.com/SoftStepsEC/paidy-wc/pull/41#discussion_r4232057442 |
| G1-2 | Copilot | Low | 副作用後の保存失敗で claim を解放するのは JP4WC の設計。DB 失敗時のみ → B-32 | https://github.com/SoftStepsEC/paidy-wc/pull/41#discussion_r4232057519 |
| G2-1 | Copilot | Low | 伏せ字の失敗時に再試行しない。JP4WC の `check_version()` も同じ順序 → B-33 | https://github.com/SoftStepsEC/paidy-wc/pull/41#discussion_r4232127589 |
| G2-2 | Copilot | Low | タイムアウトでも state token を破棄（署名経路で通る）。JP4WC の設計 → B-34 | （本文のみ） |

## 品質ゲート
- CI: https://github.com/SoftStepsEC/paidy-wc/actions/runs/37957069260 green（PHPCS / PHPStan / PHPUnit 3 本 / JS build）
- 品質チェック: green（PHPCS エラー 0・警告 2、PHPStan エラー 0・baseline 38、PHPUnit 123 件）

## 次にできること（人間の判断）
- **マージ前の確認**: 仲介サーバー（paidy.artws.info）が paidy-wc のサイトにも `state` を返し、`x-paidy-receiver-signature` /
  `-timestamp` を付けてコールバックを送っていること（G3 の Copilot 本文も同じ確認を求めている）
- **B-26（High、差分外）**: 再申込で `site_hash` が送られない。main・JP4WC とも同じ。JP4WC で直してから同期（1.6.0 のリリース前に検討）
- 保留分（B-31〜B-34）は JP4WC へ PR してから同期。個別に直す場合は `/dev-cycle fix G1-1` など
- マージ（GitHub 上で人間が行う）→ マージ後は `/post-merge`
