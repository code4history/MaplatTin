# コードレビュー: feature/v3-boundary-algorithm

対象ブランチ: `feature/v3-boundary-algorithm` vs `master`

レビュー更新日: 2026-03-26（レビュー対応ワーキングツリー確認済み）

---

## 概要

本ブランチは「v3フォーマット（境界頂点N個対応）」の実装を追加したもの。
変更の中心は以下のファイル:

- `src/boundary-vertices.ts` — 境界頂点計算のコア
- `src/transform-v3.ts` — v3コンパイル済みデータ復元ヘルパー（新規）
- `src/tin.ts` — v2/v3アルゴリズム切り替えロジック追加
- `src/strict-overlap.ts` — 縮退三角形フリップ対応

---

## 全指摘の対応状況

---

### [1] 4つのpublic関数が薄いラッパー → ✅ 解決済み

`calculatePlainVertices(params, v3=false)` / `calculateBirdeyeVertices(params, v3=false)` に統合済み。

---

### [2] 孤立コメント `BoundaryVerticesV3Params` → ✅ 解決済み

`/** Alias kept for backward-compatibility... */` コメント行が完全に削除された。

---

### [3] base classとの重複 (`transform-v3.ts`) → ⚠️ TODOコメント対処のみ（コード残存）

`normalizeWeightBufferV3` は削除。`deriveStrictStatusV3`/`buildCentroidV3`/`buildKinksV3` は TODO コメントで意図を明示済み。コードの重複自体は残るが、これは `@maplat/transform` 側の private 関数がエクスポートされていないことによる制約であり、ブランチ内では対処不可。**マージ後に `@maplat/transform` 側の整理として持越し。**

---

### [4] centroid改善が birdeye 未適用 → ✅ 解決済み

`isV3` に統合され全v3に適用済み。

---

### [5] vertex dispatch の非対称 → ✅ 解決済み

`isV3` フラグ1本化で統一済み。

---

### [6] GCP bbox計算がインライン → ✅ 解決済み

`computeGcpBbox()` メソッドに抽出済み。

---

### [A] `strict-overlap.ts` のインデント不整合 → ✅ 解決済み

内側 `for key` ループのボディ全体が6スペースに統一されている。確認:

```
      removeSearchIndex(searchIndex, trises[0], tins);   // 6 spaces ✅
      sharedBakw.forEach((shared) => {                   // 6 spaces ✅
        ...
      });
      anyFlippedThisIter = true;                         // 6 spaces ✅
      repaired = true;                                   // 6 spaces ✅
    }                                                    // 4 spaces（inner for close）✅
```

---

### [B] `degenIdx0`/`degenIdx1` の命名 → ✅ 解決済み

`bakwDegen0`/`bakwDegen1` に改名され、`forwDegen0`/`forwDegen1` と命名スタイルが統一された。

---

### [C] 縮退フリップロジックの肥大化 → ✅ 解決済み

`checkBakwDegenerateFlip()` と `checkForwDegenerateFlip()` のヘルパー関数に抽出された。
型定義 `VertexInfo` / `TrisEntry` も追加されており、引数型が明確になった。

---

### [D] `xy` デシリアライズのコメント不整合 → ✅ 解決済み

`setCompiled` のオーバーライドに詳細コメントが追加され、`getCompiled` 側との対応が明示された:

```typescript
// V2 submap: xy/wh are serialized in compiled data (used for bbox).
// V3 submap: xy/wh are NOT serialized (GCP bbox is recomputed on load);
//   default to [0,0] so downstream code that reads xy safely gets a
//   no-op origin.  See getCompiled() for the corresponding omission.
```

---

### [E] `boundsPolygon!` 非nullアサーション → ✅ 解決済み

2か所で対処:

1. `updateTin()` 内: `!` を削除し明示的なガードに変更:
```typescript
const bp = this.boundsPolygon;
if (!bp) throw new Error("Internal error: bounds is set but boundsPolygon is missing");
```

2. `validateAndPrepareInputs()` 内: IIFE-throw パターンで対処:
```typescript
const bp = this.bounds
  ? this.boundsPolygon ?? (() => { throw new Error("..."); })()
  : undefined;
```

---

## 残存する軽微な指摘

---

### [残1] ★ `isDegenerate` 関数の定義位置（変更前から持越し）

`src/strict-overlap.ts` L454

```
L54:  checkBakwDegenerateFlip   ← isDegenerate を呼ぶ関数
L132: checkForwDegenerateFlip   ← isDegenerate を呼ぶ関数
L155: resolveOverlaps
L454: function isDegenerate     ← 使用箇所より後に定義
```

`function` 宣言はホイスティングされるため実行上の問題はないが、`checkBakwDegenerateFlip` の直前（L54付近）に移動することで、「依存先を先に定義する」読み順の一貫性が得られる。

---

### [残2] ★ `validateAndPrepareInputs` と `updateTin` でガードの書き方が不一致

同じ「bounds設定時のboundsPolygon存在保証」を2パターンで書いている:

```typescript
// validateAndPrepareInputs: IIFE-throw パターン
const bp = this.bounds
  ? this.boundsPolygon ?? (() => { throw new Error("..."); })()
  : undefined;

// updateTin: 直接 if-throw パターン（読みやすい）
const bp = this.boundsPolygon;
if (!bp) throw new Error("...");
```

機能的には同等だが、同一クラス内で書き方が異なる。`validateAndPrepareInputs` 側も直接 if-throw に統一するとよい。

---

### [残3] ★ `VertexInfo` 型が `prop.geom` を省略

`src/strict-overlap.ts` L7–11

```typescript
type VertexInfo = {
  prop: { index: number | string };   // 実際は { index, geom } だが geom を省略
  geom: Position;
};
```

`extractVertices` の戻り値は `prop: { index: ..., geom: ... }` を持つが、`VertexInfo` では `prop.geom` を省略している。ヘルパー関数内で `prop.geom` は使用しておらず、TypeScript の構造的型付けで問題は出ないが、実態と型定義の乖離がある。完全な型にするか、使用用途を明記したコメントがあるとよい。

---

## 総合評価

| # | 指摘内容 | 最終状態 |
|---|---|---|
| 1 | 4関数統合 | ✅ 解決 |
| 2 | 孤立コメント | ✅ 解決 |
| 3 | base class重複 | ⚠️ TODO対処（外部制約により持越し） |
| 4 | centroid非対称 | ✅ 解決 |
| 5 | dispatch非対称 | ✅ 解決 |
| 6 | bbox計算インライン | ✅ 解決 |
| A | インデント不整合 | ✅ 解決 |
| B | 変数命名の不一致 | ✅ 解決 |
| C | 関数の肥大化 | ✅ 解決 |
| D | コメント不整合 | ✅ 解決 |
| E | 非nullアサーション | ✅ 解決 |
| 残1 | `isDegenerate` 定義位置 | 軽微・ホイスティングで問題なし |
| 残2 | ガードの書き方不一致 | 軽微・機能的に同等 |
| 残3 | `VertexInfo` 型の不完全 | 軽微・実害なし |

**主要指摘（★★以上）は全て解決。残存するのは★1相当の軽微なものみ。マージ可能と判断します。**
