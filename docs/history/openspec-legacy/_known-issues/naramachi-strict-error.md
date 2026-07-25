# 奈良町テストデータ復活: strict_error → strict 修復完了

**作成日**: 2026-03-24
**解決日**: 2026-03-25
**ステータス**: ✅ 修復完了・テストデータ復活済み

## 経緯

### 旧バージョン（〜v0.9.3 相当）
- `naramachi_yasui_bunko`（1002 GCP, birdeye モード, strictMode: strict）は `strict_status: strict`（正常）でビルドできていた。

### 2025-11-09 コミット `302c9e7`「Align legacy overlap fix with 0.9.4」
- `src/strict-overlap.ts` のオーバーラップ検出アルゴリズムが大幅に書き換えられた。
- **変更の意図**: 面積がほぼゼロになる「線状（縮退）三角形」もオーバーラップ（エラー）として検出できるようにする。
  - `pointInTriangle()` に `epsilon = 1e-9` を導入 → 境界上の点も「内側」として検出するようになった。
- **意図しない影響**: 奈良町では bakw 空間で線状三角形が生じており、これが正しく検出されるようになった結果、`strict_status: strict_error` が返るようになった。

### 2026-03-24: 縮退三角形フリップ修復の実装（部分改善）
- `isDegenerate()` ヘルパー関数を追加し、面積ゼロ（doubleArea < 1e-6）の縮退三角形を明示的に検出するパスを実装。
- 縮退三角形のフリップ前に隣接三角形との交差チェック（外積符号判定）を行い、安全な場合のみフリップを実行。
- **奈良町での計測結果**:
  - フリップ検討対象: 123 エッジ（うち少なくとも一方が縮退）
  - 隣接チェック通過: 43 エッジ（80 エッジは隣接三角形との交差リスクにより棄却）
  - forw 空間凸性チェック通過: 13 エッジ（30 エッジは forw 空間のフリップ条件を満たさず棄却）
  - **実際にフリップ実行: 13 エッジ**
  - 結果: `bakw_kinks: 1 → 0`（bakw 方向の辺交差は解消）
  - `forw_kinks: 2` は残存（bakw フリップが forw 縮退三角形を新規作成していたため）

### 2026-03-25: forw kink 修復の実装（完全解決）
- **根本原因の特定**: bakw 縮退フリップが新規作成する三角形の forw 側が縮退になることが判明。
  - `resolveOverlaps` は初期キーのみ1パス処理するため、新規作成エッジは未処理のままになっていた。
- **修正内容**（コミット `7b4e689`）:
  1. **反復ループ化**: `resolveOverlaps` を `MAX_FLIP_ITERATIONS=10` の反復ループに変更。
     新規作成エッジも次イテレーションで処理される。
  2. **`forwDegenerateFlipValid` 追加**: forw 縮退検出時に bakw 空間の凸性を符号付き外積で判定。
     bakw 座標が ~1e7 のため面積比較より外積が数値安定。
  3. **`degenerateFlipValid` 改善**: 隣接三角形が少なくとも1つ見つかった場合のみフリップ有効。
     振動フリップ（bakw フリップ後の degenerate T_new が元に戻そうとする現象）を防止。
- **奈良町での最終結果**:
  - `forwKinkPoints: 2 → 0`
  - `bakwKinkPoints: 0`（維持）
  - `forwDegIdx: 3 → 0`
  - `strict_status: strict_error → strict` ✅

## 対応

- テストファイルを `tests/maps/_suspended/` から `tests/maps/` へ復活。
- テストコード（`tests/tin.test.ts`, `tests/transform.test.ts`, `spec/tin_node.spec.js`）の奈良町エントリを復活。
- 生成スクリプト（`scripts/generate-compiled.ts`, `scripts/generate-cases.ts`）の奈良町エントリを復活。
- Compiled JSON を再生成。

## 関連ファイル

- `src/strict-overlap.ts` — オーバーラップ検出・修復ロジック
- `scripts/export-naramachi-debug.ts` — デバッグ可視化データ生成スクリプト
- `tests/maps/naramachi_yasui_bunko.json`
- `tests/compiled/naramachi_yasui_bunko_v2.json`
- `tests/compiled/naramachi_yasui_bunko_v3.json`
- `tests/cases/naramachi_yasui_bunko_v2.json`
- `tests/cases/naramachi_yasui_bunko_v3.json`
