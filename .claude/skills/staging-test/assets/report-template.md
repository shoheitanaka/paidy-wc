# ステージング受け入れテスト YYYY-MM-DD

| 項目 | 値 |
|------|-----|
| ZIP | `paidy-wc-<hash>.zip`（HEAD `<hash>`。`-dirty` なら含めた未コミットの変更を書く） |
| ブランチ / PR | `main` または `fix/...`（PR #NN） |
| 環境 | ステージング（サンドボックス）。WP x.y.z / WC x.y.z / PHP x.y。チェックアウト: ブロック or クラシック |
| 実施 | Claude Code（Claude in Chrome）+ ユーザーの管理者セッション |
| 目的 | 定期の受け入れテスト / PR #NN の確認 / B-xx の再現 |

## 結果

| ケース | 結果 | 注文 | 証拠（注文メモ・ログ行の要点） |
|--------|------|------|------------------------------|
| T1 成功決済 | PASS / FAIL / SKIP / 未確認 | #N1 | |
| T1' 成功決済（T5 用） | | #N3 | |
| T2 拒否決済 | | #N2 | |
| T3 改ざんの拒否 | | #N2 | |
| T4 キャプチャ | | #N1 | |
| T5 close | | #N3 | |
| T6 部分返金 ×2 | | #N1 | |
| T7 完了→キャンセル（残額返金） | | #N1 | |
| T8 Webhook・ログ総点検 | | — | |
| T9 もう一方のチェックアウト | | | |

API 送信回数（`Send URL is following.`）: `/captures` n / `/close` n / `/refunds` n

## FAIL の詳細と backlog 候補

- （ケース番号）症状 → 再現手順 → 疑う箇所（ファイル・関数）→ 既存の backlog との関係

## 気づき（スキル・docs の更新点）

- 画面の違い・待ち時間・手順の抜けなど。`references/checklist.md` / `SKILL.md` に反映したか
