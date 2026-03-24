# 奈良町テストデータ一時停止: strict_error 未修復問題

**作成日**: 2026-03-24
**ステータス**: 部分修復済み・テストデータ一時停止中

## 経緯

### 旧バージョン（〜v0.9.3 相当）
- `naramachi_yasui_bunko`（1002 GCP, birdeye モード, strictMode: strict）は `strict_status: strict`（正常）でビルドできていた。

### 2025-11-09 コミット `302c9e7`「Align legacy overlap fix with 0.9.4」
- `src/strict-overlap.ts` のオーバーラップ検出アルゴリズムが大幅に書き換えられた。
- **変更の意図**: 面積がほぼゼロになる「線状（縮退）三角形」もオーバーラップ（エラー）として検出できるようにする。
  - `pointInTriangle()` に `epsilon = 1e-9` を導入 → 境界上の点（線状三角形の非共有頂点がエッジ上に乗る場合）も「内側」として検出するようになった。
- **意図しない影響**: 奈良町では bakw 空間で線状三角形が生じており、これが正しく検出されるようになった結果、`strict_status: strict_error` が返るようになった。

### 2026-03-24: 縮退三角形フリップ修復の実装（部分改善）
- `isDegenerate()` ヘルパー関数を追加し、面積ゼロ（doubleArea < 1e-6）の縮退三角形を明示的に検出するパスを実装。
- 縮退三角形のフリップ前に隣接三角形との交差チェック（外積符号判定）を行い、安全な場合のみフリップを実行。
- **奈良町での計測結果（v2/v3 共通）**:
  - フリップ検討対象: 123 エッジ（うち少なくとも一方が縮退）
  - 隣接チェック通過: 43 エッジ（80 エッジは隣接三角形との交差リスクにより棄却）
  - forw 空間凸性チェック通過: 13 エッジ（30 エッジは forw 空間のフリップ条件を満たさず棄却）
  - **実際にフリップ実行: 13 エッジ**
  - 結果: `bakw_kinks: 1 → 0`（bakw 方向の辺交差は解消）
  - `forw_kinks: 2` は残存（forw 空間に3個の縮退三角形があり、bakw 操作では修復不可）
  - bakw 縮退三角形: 43 → 30（13 個解消、30 個は forw/隣接チェックで棄却）
- **`strict_error` は継続**: forw の kinks が残るため

## 残存する問題

### forw kinks（2件）
- forw 空間に3個の縮退三角形が存在し、2個の辺交差（kink）を引き起こしている。
- forw 空間の縮退三角形は constrainedTin（Delaunay 三角分割）の出力に起因するため、bakw 側のフリップでは対処できない。
- 根本対処には constrainedTin 入力点の前処理（重複点・線状点の除去）が必要。

### bakw 縮退三角形（30件）
- 隣接チェックまたは forw 凸性チェックで棄却されたもの。
- 直接の辺交差は生じていないが、正確な変換精度に影響する可能性がある。

## 残存する TODO

1. **forw 縮退三角形の前処理**: constrainedTin 入力前に線状点・重複点を検出・除去する前処理を実装。
2. **bakw 縮退三角形への代替戦略**: forw 空間のチェックで棄却されるケースへの対応（フリップ以外の修復手法、またはフリップの影響を forw 側にも反映させる方法）。
3. **反復修復**: フリップ後に新たな縮退三角形が生じる場合への対応（上限付き反復ループ）。

## 対応

- テストファイルを `tests/maps/_suspended/`・`tests/compiled/_suspended/`・`tests/cases/_suspended/` に退避。
- テストコード（`tests/tin.test.ts`, `tests/transform.test.ts`, `spec/tin_node.spec.js`）の奈良町エントリをコメントアウト。
- 生成スクリプト（`scripts/generate-compiled.ts`, `scripts/generate-cases.ts`）の奈良町エントリをコメントアウト。
- 問題修復後、別の適切なテストデータに差し替え予定（旧データは `_suspended/` に保管）。

## 関連ファイル

- `src/strict-overlap.ts` — オーバーラップ検出・修復ロジック
- `tests/maps/_suspended/naramachi_yasui_bunko.json`
- `tests/compiled/_suspended/naramachi_yasui_bunko_v2.json`
- `tests/compiled/_suspended/naramachi_yasui_bunko_v3.json`
- `tests/cases/_suspended/naramachi_yasui_bunko_v2.json`
- `tests/cases/_suspended/naramachi_yasui_bunko_v3.json`
