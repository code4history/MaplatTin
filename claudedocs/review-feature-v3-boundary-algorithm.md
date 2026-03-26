# コードレビュー: feature/v3-boundary-algorithm

対象ブランチ: `feature/v3-boundary-algorithm` vs `master`

---

## 概要

本ブランチは「v3フォーマット（境界頂点N個対応）」の実装を追加したもの。
変更の中心は以下の3ファイル:

- `src/boundary-vertices.ts` — 境界頂点計算のコア
- `src/transform-v3.ts` — v3コンパイル済みデータ復元ヘルパー（新規）
- `src/tin.ts` — v2/v3アルゴリズム切り替えロジック追加

---

## 指摘事項

---

### [1] `boundary-vertices.ts`: 4つのpublic関数が1ビットの違いしかない薄いラッパー

**該当箇所**: `src/boundary-vertices.ts` L525–L571

```typescript
export function calculatePlainVertices(params): VertexPosition[] {
  return calculateVerticesCore(params, "plain", false);   // ← false
}
export function calculateBirdeyeVertices(params): VertexPosition[] {
  return calculateVerticesCore(params, "birdeye", false); // ← false
}
export function calculatePlainVerticesV3(params): VertexPosition[] {
  return calculateVerticesCore(params, "plain", true);    // ← true
}
export function calculateBirdeyeVerticesV3(params): VertexPosition[] {
  return calculateVerticesCore(params, "birdeye", true);  // ← true
}
```

v2とv3の差は `withEdgeVertices` が `false` か `true` かだけ。
4関数は実質2関数に統合可能:

```typescript
// 提案
export function calculatePlainVertices(params, withEdgeVertices = false) { ... }
export function calculateBirdeyeVertices(params, withEdgeVertices = false) { ... }
```

これに伴い `tin.ts` の dispatch も `vertexMode` × `useV2Algorithm` の2軸で整理できる。

---

### [2] `boundary-vertices.ts`: 使われていない型エイリアス

**該当箇所**: `src/boundary-vertices.ts` L30

```typescript
/** Alias kept for backward-compatibility with callers that import this name. */
export type BoundaryVerticesV3Params = BoundaryVerticesParams;
```

コメントに「後方互換性のため」とあるが、`BoundaryVerticesV3Params` という名前はこのブランチで初めて登場した新規の型名。既存コードにその名前に依存する利用者はいない。`tin.ts` 内でも `BoundaryVerticesParams` のみが import・使用されており、このエイリアスは実際には使われていない。削除してよい。

---

### [3] `transform-v3.ts`: base classとほぼ同一なヘルパー関数群

**該当箇所**: `src/transform-v3.ts` の `deriveStrictStatusV3`, `buildCentroidV3`, `buildKinksV3`, `normalizeWeightBufferV3`

これらは `node_modules/@maplat/transform/src/compiled-state.ts` の private 関数と内容が一致している:

| transform-v3.ts | compiled-state.ts | 差異 |
|---|---|---|
| `deriveStrictStatusV3` | `deriveStrictStatus` | **完全に同一** |
| `buildCentroidV3` | `buildCentroid` | **完全に同一** |
| `buildKinksV3` | `buildKinks` | **完全に同一** |
| `normalizeWeightBufferV3` | `normalizeWeightBuffer` の version >= FORMAT_VERSION 分岐 | 実質同一（v3は常に最新形式前提） |

`normalizeWeightBufferV3` は特に問題で、関数本体が1行:

```typescript
function normalizeWeightBufferV3(compiled: Compiled): WeightBufferBD {
  return compiled.weight_buffer;
}
```

これを独立した named function にする意味はなく、呼び出し側で `compiled.weight_buffer` を直接書けばよい。

根本原因は `@maplat/transform` がこれらを private にしているためだが、v3専用として切り出すのであれば「意図的なコピーである」旨のコメントを明示するか、あるいは `@maplat/transform` 側でこれらをエクスポートするリファクタリングを検討すべき。

---

### [4] `tin.ts`: `isV3Plain` にのみ適用されている centroid 改善が `isV3Birdeye` に適用されていない

**該当箇所**: `src/tin.ts` L671–L708

```typescript
if (isV3Plain) {
  // TIN三角形の重心を使う改善ロジック（三角形内包チェック付き）
  const containingTri = tinForw.features.find(tri =>
    booleanPointInPolygon(point(forCentCoord), tri)
  );
  if (containingTri) {
    centCalc = { /* 3頂点の平均 */ };
  } else {
    centCalc = { /* turf centroid fallback */ };
  }
} else {
  // v2 / isV3Birdeye 共通パス: transformArr を使う旧来の計算
  centCalc = {
    forw: forCentroid.geometry!.coordinates,
    bakw: transformArr(forCentroid, tinForw as Tins) as Position,
  };
}
```

`isV3Birdeye` は `else` ブランチに落ちるため、v3 birdeye ではこの centroid 改善が適用されない。
コメントには「birdeye は常に bounds を持つ」という前提が書かれていないため、意図的な非適用なのか見落としなのかが不明瞭。

birdeye モードでも bounds の中心より TIN 三角形の重心の方が適切であるならば、条件を `isV3Plain` ではなく `!this.useV2Algorithm` にすべき。意図的に除外しているなら理由をコメントで明示すること。

---

### [5] `tin.ts`: v3 vertex dispatch の条件分岐が v2 パスと非対称

**該当箇所**: `src/tin.ts` L733–L744

```typescript
if (isV3Plain) {
  verticesSet = calculatePlainVerticesV3(boundaryParams);
} else if (isV3Birdeye) {
  verticesSet = calculateBirdeyeVerticesV3(boundaryParams);
} else {
  // v2パス
  verticesSet = this.vertexMode === Tin.VERTEX_BIRDEYE
    ? calculateBirdeyeVertices(boundaryParams)
    : calculatePlainVertices(boundaryParams);
}
```

v2パスは `vertexMode` で分岐しているが、v3パスは `isV3Plain`/`isV3Birdeye` で分岐している。
実際には同じ「birdeye か否か」の軸に「v3か否か」が加わっただけなので、軸の構造が統一されていない。

[1] の提案（関数に `withEdgeVertices` フラグを追加）を採用すれば次のように整理できる:

```typescript
// 提案（[1]と合わせた場合）
const isBirdeye = this.vertexMode === Tin.VERTEX_BIRDEYE;
const withEdgeVertices = !this.useV2Algorithm;
verticesSet = isBirdeye
  ? calculateBirdeyeVertices(boundaryParams, withEdgeVertices)
  : calculatePlainVertices(boundaryParams, withEdgeVertices);
```

---

### [6] `tin.ts`: GCPからのbbox計算がインラインに埋め込まれている

**該当箇所**: `src/tin.ts` L584–L601

```typescript
if (isV3Plain) {
  rawPointsSet = this.generatePointsSet();
  // GCPのmin/maxを計算して5%マージンを加算
  let gcpMinx = Infinity, gcpMaxx = -Infinity;
  let gcpMiny = Infinity, gcpMaxy = -Infinity;
  for (const p of this.points) {
    const x = p[0][0], y = p[0][1];
    if (x < gcpMinx) gcpMinx = x;
    ...
  }
  ...
} else {
  const validated = this.validateAndPrepareInputs();
  ...
}
```

`validateAndPrepareInputs()` が bbox 計算を内包しているのに対し、v3 plain の GCP ベース bbox 計算はメソッドに切り出されておらず、`updateTin()` 内にインラインで書かれている。
`validateAndPrepareInputs()` と並置される形で `computeGcpBbox()` 等のプライベートメソッドに抽出すべき。

---

## 重要度まとめ

| # | 分類 | 重要度 | 概要 |
|---|---|---|---|
| 1 | 関数の冗長化 | ★★★ | 4つのpublic関数 → 2関数+フラグで統合可能 |
| 2 | 不要なエクスポート | ★★ | 使われていない型エイリアス |
| 3 | base classとの重複 | ★★★ | `deriveStrictStatusV3` 等が完全コピー |
| 4 | 非対称処理 | ★★★ | centroid改善がv3 birdeye に未適用（意図不明） |
| 5 | 条件分岐の非対称 | ★★ | v2/v3でdispatch軸が異なる |
| 6 | インラインロジック | ★ | GCP bbox計算がメソッド化されていない |
