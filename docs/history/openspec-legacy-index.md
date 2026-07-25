# MaplatTin openspec 時代の開発履歴索引

> 本ファイルは openspec ワークフロー（〜2026年）時代に作成された開発提案・記録を、那由多開発サイクル形式の履歴として集約した索引です。
> 原文は `docs/history/openspec-legacy/<change-id>/` 配下にそのまま保存されています（内容は変更していません）。
> 那由多開発サイクルについては `docs/superpowers/`（存在する場合）を参照してください。
>
> 「推定時期」は、各 change の `proposal.md` に対して `git log --follow --diff-filter=A -1` を実行して得た**作成日**（そのファイルが最初にリポジトリへ追加されたコミットの日付）を記載しています。archive 化の際にディレクトリ名へ日付プレフィックスが付与される・リネームされるケースがあるため、ディレクトリ単位ではなくファイル単位で `--follow` を適用し、archive 日ではなく作成日を実測しています。

## 開発提案一覧（openspec/changes、archive済み + 未archive、計9件）

| change-id | 由来 | 推定時期 | 目的 | 実装状況 | 現在の扱い | 原文 |
|---|---|---|---|---|---|---|
| 2025-12-18-add-edgebound-tests | archive済み | 2025-10-21（38e5624） | EdgeBoundのコアロジックを `@maplat/tin` へ取り込んだ際に未移植だった挙動確認テストを追加し、制約エッジ再配線アルゴリズムの回帰検出力を確保する。 | 完了 | 完了・削除対象 | [原文](openspec-legacy/2025-12-18-add-edgebound-tests/) |
| 2025-12-18-document-tin-logic | archive済み | 2025-11-02（724f25c） | `Tin` 実装の境界頂点合成・点重みバッファリング等の非自明な挙動を文書化し、`updateTinAsync()` のPromiseチェーンパターンをasync/awaitへ正規化する下地を作る。 | 完了 | 完了・削除対象 | [原文](openspec-legacy/2025-12-18-document-tin-logic/) |
| 2025-12-18-integrate-edgebound-internal | archive済み | 2025-10-21（8c356e7） | 独立パッケージ `@maplat/edgebound` の保守負担を解消するため `@maplat/tin` の内部実装として統合し、必須エッジ補正ロジックの再利用性を高める。 | 完了 | 完了・削除対象 | [原文](openspec-legacy/2025-12-18-integrate-edgebound-internal/) |
| 2025-12-18-restore-birdeye-overlap | archive済み | 2025-11-03（a639397） | リファクタでスケール・回転フォールバックとstrictモードの自己修復ロジックが失われた鳥瞰図変換の互換性を回復し、0.9.4時代のデータセットが正しく変換されるようにする。 | 完了 | 完了・削除対象 | [原文](openspec-legacy/2025-12-18-restore-birdeye-overlap/) |
| migrate-to-pnpm | archive済み | 2025-12-20（3b0076a） | `@maplat/transform` 等の依存がpnpmビルドを要求するにもかかわらずnpmスクリプトを使用していた不整合を解消し、pnpmへ統一する。 | 完了 | 完了・削除対象 | [原文](openspec-legacy/migrate-to-pnpm/) |
| typescript-error-fix | archive済み | 2025-12-20（bfebcf9） | `src/tin.ts` のTypeScriptコンパイルエラーと`pnpm-lock.yaml`の不整合（`@maplat/transform`のコミットハッシュずれ）によるCI/CD失敗を解消する。 | 完了 | 完了・削除対象 | [原文](openspec-legacy/typescript-error-fix/) |
| unify-libs-turf-vite | archive済み | 2025-12-20（3b0076a） | 個別の `@turf/*` パッケージ依存を `@turf/turf` へ統合し、`vite.config.ts` をビルド・テストの単一情報源とし、ESLint Flat Configへ統一する。 | 完了 | 完了・削除対象 | [原文](openspec-legacy/unify-libs-turf-vite/) |
| complete-v3-runtime-and-format | 未archive | 2026-04-10（341fbf8） | V3三角網ペイロードにおけるGCPメタデータ・ランタイム専用ペイロード・軽量配布ペイロードの表現方法を正式仕様として定義する提案。 | 未実装（0/23） | **V4へ再定義済みの歴史文書（実施せず破棄・履歴化。決定B、m15マイルストーン設計 v1.2 §0.6参照。20/23がV4計画文書 `NextTargets/10-maplat-tin.md` と新3パッケージ Atlas/Daedalus/Teiresias で再定義・移管・無効化済み。代替としてm12-t24「MaplatTin V4仕様への未反映事項の反映」が既に登録済み）** | [原文](openspec-legacy/complete-v3-runtime-and-format/) |
| standarized_c4h_standard | 未archive | 2025-12-24（ff530eb） | Code4History標準への準拠（pnpm強制・`dist/`成果物分離・devサーバのルートURL動作・CI/CDのtest/deploy分離）を図る、Maplatの `standardize-repo-structure` と同系統の提案。 | ほぼ完了（22/29。pnpm engines制約・README pnpm記載（6.1）・`dist`/`dist-demo`分離ビルド出力先のREADME記載（6.2、README.md L133-134で実装済みを確認）は未チェックのまま実装済み。残タスクはdevサーバのルートURL動作確認（5.4）・npm失敗確認（5.2）・CI稼働確認（5.5）・GitHub Pagesデプロイ確認（5.6）という手動検証チェックリストと、CONTRIBUTING.md新設（6.3、「存在すれば更新」という条件付きタスクのため該当なし）） | 完了・削除対象 | [原文](openspec-legacy/standarized_c4h_standard/) |

## 既知の問題対応履歴（openspec/known-issues、計1件）

> `openspec/changes/` の提案とは別に、`openspec/known-issues/` にはテストデータの不具合修復記録が保存されている。マイルストーン設計 v1.2 §1 の棚卸し表がこの区分を対象外としており、当初のT1実装ではAC1の91エントリに含まれていなかった（実装レビューv1 スコープ外Major1として指摘）。T1への前進修正でマイルストーン設計・タスク設計両方に区分を追記した上で本エントリを追加している。

| ファイル | 推定時期 | 目的 | 現在の扱い | 原文 |
|---|---|---|---|---|
| naramachi-strict-error.md | 2026-03-24（1247e44、解決2026-03-25） | 奈良町テストデータ（naramachi_yasui_bunko）で `strict_status` が `strict_error` を返すようになった不具合（2025-11-09のオーバーラップ検出アルゴリズム変更に起因）を、縮退三角形フリップ修復の反復ループ化で完全解決した経緯の記録。 | 完了・解決済みの修復記録（削除対象） | [原文](openspec-legacy/_known-issues/naramachi-strict-error.md) |

## 当時のプロジェクト概要（参考・陳腐化済み）

| 項目 | 推定時期 | 目的 | 現状との乖離 | 原文 |
|---|---|---|---|---|
| project.md | 2025-10-21（8c356e7） | openspecワークフロー導入時点でのMaplatTinプロジェクト概要・規約を記述したもの。 | 那由多開発サイクル移行（本索引作成）により、開発プロセス・ドキュメント体系は本ファイル群へ置き換わっている。参考情報として保存。 | [原文](openspec-legacy/_project-snapshot/project.md) |
| specs/tin-internals-docs/spec.md | 2025-11-02（724f25c） | Tin内部ロジックの文書化仕様（document-tin-logic由来）。 | 完了済み変更の仕様記録として保存。 | [原文](openspec-legacy/_project-snapshot/specs/tin-internals-docs/spec.md) |
| specs/tin-strict-overlap/spec.md | 2025-11-03（a639397） | strictモードの三角形重複自己修復に関する仕様（restore-birdeye-overlap由来）。 | 完了済み変更の仕様記録として保存。 | [原文](openspec-legacy/_project-snapshot/specs/tin-strict-overlap/spec.md) |
| specs/tin-boundary-behaviour/spec.md | 2025-11-03（a639397） | 鳥瞰図境界頂点の変換挙動に関する仕様（restore-birdeye-overlap由来）。 | 完了済み変更の仕様記録として保存。 | [原文](openspec-legacy/_project-snapshot/specs/tin-boundary-behaviour/spec.md) |
| specs/package-management/spec.md | 2025-12-20（3b0076a） | pnpm移行・依存統合に関する仕様（migrate-to-pnpm/unify-libs-turf-vite由来）。 | 完了済み変更の仕様記録として保存。 | [原文](openspec-legacy/_project-snapshot/specs/package-management/spec.md) |
| specs/tin-edge-constraints/spec.md | 2025-10-21（8c356e7） | EdgeBound内部統合による制約エッジ仕様（integrate-edgebound-internal由来）。 | 完了済み変更の仕様記録として保存。 | [原文](openspec-legacy/_project-snapshot/specs/tin-edge-constraints/spec.md) |
| specs/tin-runtime-guidance/spec.md | 2025-11-02（724f25c） | Tinランタイム挙動のガイダンス仕様（document-tin-logic由来）。 | 完了済み変更の仕様記録として保存。 | [原文](openspec-legacy/_project-snapshot/specs/tin-runtime-guidance/spec.md) |
