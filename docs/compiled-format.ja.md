# MaplatTin コンパイル済みデータ形式仕様

## 概要

MaplatTin の `getCompiled()` / `setCompiled()` で扱うコンパイル済みデータ（以下 **Compiled**）は、
GCP（地上基準点）と境界頂点から構築した TIN（不規則三角網）を JSON シリアライズしたものです。

バージョン番号によって V2（`version: 2.00703`）と V3（`version: 3`）の 2 種類があり、
境界頂点の数え方と一部フィールドの有無が異なります。

---

## TypeScript 型定義

```typescript
export interface Compiled {
  version?: number;           // 2.00703 = V2, 3 = V3
  wh?: [number, number];     // [width, height]（画像サイズ）
  xy?: [number, number];     // [x, y] 原点オフセット（オプション）

  points: PointSet[];         // GCP 一覧
  centroid_point: PointSet;   // 重心点

  vertices_points: PointSet[];  // 境界頂点
  vertices_params: [number[], number[]]; // 境界頂点の角度パラメータ

  tins_points: TriangleIndex[][][]; // TIN 三角形インデックス

  weight_buffer: WeightBufferBD;  // 重みバッファ

  strict_status?: StrictStatus;   // 厳密性検証結果
  kinks_points?: Position[];      // 自己交差点（strict_error 時のみ）

  edges: EdgeSet[];            // 拘束辺一覧
  edgeNodes?: PointSet[];      // 拘束辺中間点

  yaxisMode?: YaxisMode;       // Y 軸方向
  vertexMode?: VertexMode;     // 境界頂点生成モード
  strictMode?: StrictMode;     // 厳密性モード

  bounds?: number[][];         // 明示的境界ポリゴン座標（オプション）
  boundsPolygon?: Feature<Polygon>; // GeoJSON 境界（オプション）
}

// 補助型
type Position      = [number, number];
type PointSet      = [Position, Position];  // [forw座標, bakw座標]
type TriangleIndex = number | string;       // 数値インデックス, "c", "bN", "eN"
type StrictStatus  = "strict" | "strict_error" | "loose";
type YaxisMode     = "invert" | "follow";
type VertexMode    = "birdeye" | "plain";
type StrictMode    = "strict" | "auto" | "loose";

// 拘束辺: [forw中間点列, bakw中間点列, [始点インデックス, 終点インデックス]]
type EdgeSet = [Position[], Position[], [number, number]];

type WeightBufferBD = {
  forw?: WeightBuffer;
  bakw?: WeightBuffer;
};
```

---

## フィールド一覧

### 基本情報

| フィールド | 型 | 説明 |
|-----------|---|------|
| `version` | `number` | フォーマットバージョン（2.00703 または 3） |
| `wh` | `[number, number]` | 画像の `[width, height]`（ピクセル）。`setWh()` または `setBounds()` 呼び出し時に存在 |
| `xy` | `[number, number]` | バウンディングボックスの原点 `[x, y]`。`setBounds()` 呼び出し時（サブマップ等）のみ存在。通常の矩形画像では `wh` のみで `xy` は省略される |

`wh` と `xy` の有無は V2/V3 の違いではなく、`setWh()` / `setBounds()` の呼び出し方に依存する：

| 設定方法 | `wh` | `xy` |
|---------|:----:|:----:|
| `setWh(w, h)` 呼び出し（通常の矩形画像） | ✓ | — |
| `setBounds(polygon)` 呼び出し（サブマップ等、明示的境界ポリゴン） | ✓ | ✓ |

---

### 地上基準点（GCP）

#### `points: PointSet[]`

GCP の一覧。各要素は `[[forwX, forwY], [bakwX, bakwY]]` の形式。

- `forw` = 画像（ピクセル）座標
- `bakw` = 地図（Mercator）座標

```json
"points": [
  [[1200.5, 830.2], [15120456.3, 4123890.1]],
  [[2048.0, 1500.0], [15121234.5, 4122567.8]],
  ...
]
```

---

#### `centroid_point: PointSet`

重心点。シリアライズ形式は `[[forwX, forwY], [bakwX, bakwY]]` で V2/V3 共通だが、
**計算方法が V3 plain モードで変わっている**。

| モード | 計算方法 |
|--------|---------|
| V2 / V3 `birdeye` | turf の重心座標を forw TIN で変換した点 |
| V3 `plain` | turf 重心を含む TIN 三角形を探し、その 3 頂点の **幾何学的平均** を使用（三角形が見つからない場合は V2 と同じ fallback） |

V3 plain の変更により、重心が必ず実際の三角形内部に収まることが保証される。

---

### 境界頂点

#### `vertices_points: PointSet[]`

TIN の外周を構成する境界頂点の一覧。三角形インデックス中の `"b0"`, `"b1"`, ... `"b(N-1)"` に対応する。

| バージョン | 点数 |
|-----------|------|
| V2（`plain` / `birdeye` 問わず） | 常に **4 点** |
| V3（`plain` / `birdeye` 問わず） | **最大 36 点**（4 隅 + 10° 単位の角度ビンからの辺頂点） |

V3 は plain/birdeye を問わず `withEdgeVertices=true` で計算される。plain と birdeye の違いは
4 隅の計算方法（単一集計 vs 四象限ごとの比率）であり、辺頂点の追加有無は変わらない。
正常な TIN では全 32 辺ビンに頂点が追加され、4 隅 + 32 辺 = **36 点固定**になる。

```json
"vertices_points": [
  [[-706.6, -817.65], [15118175.26, 4124361.15]],
  [[-706.6, 17170.65], [15118789.17, 4118425.45]],
  [[18256.3, 17170.65], [15126543.21, 4118123.45]],
  [[18256.3, -817.65], [15126289.54, 4124012.33]]
]
```

---

#### `vertices_params: [number[], number[]]`

境界頂点の角度パラメータ（ラジアン）。

- `vertices_params[0]` = forw 側での各境界頂点の角度（重心からの方位）
- `vertices_params[1]` = bakw 側での各境界頂点の角度（重心からの方位）

要素数は `vertices_points.length` と一致する。

```json
"vertices_params": [
  [-2.977, -2.624, ..., 2.686, 2.877],
  [-0.161, -0.541, ..., 0.505, 0.300]
]
```

---

### TIN 三角形

#### `tins_points: TriangleIndex[][][]`

TIN を構成する三角形のインデックス配列。

**構造**: `tins_points[dir][triIndex][vertexIndex]`

| 次元 | 意味 |
|------|------|
| `dir = 0` | forw→bakw 変換用の TIN（常に存在） |
| `dir = 1` | bakw→forw 変換用の TIN（`strict_status === "loose"` のみ存在） |

各三角形は **3 要素の配列**で頂点インデックスを表す。

##### 頂点インデックスの種類

| 値 | 意味 |
|----|------|
| 数値 `0` 〜 `N-1` | `points` 配列のインデックス（GCP または edgeNode） |
| `"c"` | 重心点（`centroid_point`） |
| `"bN"` | 境界頂点 N 番目（`vertices_points[N]`） |
| `"eN"` | edgeNode N 番目（`edgeNodes[N]`） |

```json
"tins_points": [
  [
    [197, 410, 406],
    [410, 408, 406],
    ["b2", 197, "c"],
    ["b0", "b1", "c"],
    ...
  ]
]
```

> **注意**: `strict_status === "loose"` の場合のみ `tins_points[1]` が存在し、
> `bakw→forw` の変換に使用される。`strict_status === "strict"` の場合は
> `tins_points[0]` のみで双方向変換を行う。

---

### 重みバッファ

#### `weight_buffer: WeightBufferBD`

重み付き変換のための補助データ。内部構造は `@maplat/transform` が管理する。

- `weight_buffer.forw` = forward 方向の伸縮比（Mercator 辺長 ÷ 画像辺長）
- `weight_buffer.bakw` = 逆変換用の逆数（`1 / forw`）

`bakw` が存在するかどうかは V2/V3 の違いではなく、**`strict_status` による**：

```typescript
const includeReciprocals = this.strict_status === Tin.STATUS_STRICT;
```

| `strict_status` | `weight_buffer.forw` | `weight_buffer.bakw` |
|----------------|:--------------------:|:--------------------:|
| `"strict"` | ✓ | ✓ |
| `"strict_error"` / `"loose"` | ✓ | — |

---

### 厳密性情報

#### `strict_status: StrictStatus`

TIN の自己交差検証結果。

| 値 | 意味 |
|----|------|
| `"strict"` | bakw TIN に自己交差なし。forw→bakw・bakw→forw ともに単一 TIN で対応可能 |
| `"strict_error"` | bakw TIN に自己交差あり。`kinks_points` に交差点が記録される |
| `"loose"` | bakw TIN で問題があり `tins_points[1]` を使用して bakw→forw を処理 |

#### `kinks_points?: Position[]`

`strict_status === "strict_error"` の場合のみ存在。**bakw TIN** の自己交差座標の一覧（bakw 座標系）。

内部では forw/bakw **両方向** の kinks が検出・保持されるが（`this.kinks = { forw: ..., bakw: ... }`）、
compiled 形式には bakw kinks のみシリアライズされる。

> **注意（命名の不一致）**: `scripts/dev-server.ts` の API では
> `kinks_points` = forw kinks、`kinks_bakw` = bakw kinks という逆の命名になっており、
> compiled 形式の `kinks_points`（= bakw kinks）と意味が異なる。

---

### 拘束辺

#### `edges: EdgeSet[]`

GCP 間の拘束辺（Constrained Delaunay Triangulation における固定辺）の一覧。

各要素の形式:

```
[
  [[forwX0, forwY0], [forwX1, forwY1], ...],  // forw 側の中間点列
  [[bakwX0, bakwY0], [bakwX1, bakwY1], ...],  // bakw 側の中間点列
  [startIndex, endIndex]                       // points[] の始点・終点インデックス
]
```

- `startIndex` / `endIndex` は `points` 配列のインデックス
- 中間点は `edgeNodes` に格納されており、`tins_points` からも参照される

#### `edgeNodes?: PointSet[]`

拘束辺の中間点の一覧。`tins_points` 内の `"eN"` インデックスに対応する。
各要素は `[[forwX, forwY], [bakwX, bakwY]]`。

---

### 動作モード

| フィールド | 型 | 説明 |
|-----------|---|------|
| `yaxisMode` | `"invert" \| "follow"` | `"invert"`: Y 軸を上向きに反転（画像座標系）、`"follow"`: Y 軸をそのまま使用 |
| `vertexMode` | `"birdeye" \| "plain"` | `"birdeye"`: 境界頂点を角度ビンで生成（V3）、`"plain"`: 単純な4隅矩形（V2互換） |
| `strictMode` | `"strict" \| "auto" \| "loose"` | `"strict"`: 厳密性を強制、`"auto"`: 自動判定、`"loose"`: 緩いモード |

---

## V2 と V3 の主な違い

| 項目 | V2 | V3 |
|------|----|----|
| `version` | `2.00703` | `3` |
| `vertices_points` 点数 | 常に 4 点 | `plain`/`birdeye` 問わず最大 36 点（実質 36 点固定） |
| `vertices_params` 要素数 | 4 | `vertices_points.length` と同数 |
| `centroid_point` の計算 | turf 重心を TIN 変換 | `plain` モードでは含む三角形の幾何学的平均 |
| `wh` / `xy` フィールド | `setWh()`/`setBounds()` 依存（V3 と同条件） | 同左 |
| `weight_buffer.bakw` | `strict_status === "strict"` 時のみ（V3 と同条件） | 同左 |
| 境界頂点の生成アルゴリズム | 画像の4隅を投影（4点固定） | GCP の角度分布に基づく（`plain` では多点） |
| `strict_status` の傾向 | 4点境界のため `strict_error` になりやすい | `plain` では多点境界で `strict` を達成しやすい |

> **補足**: `wh`/`xy` の有無および `weight_buffer.bakw` の有無は V2/V3 の違いではなく、
> それぞれ `setBounds()` 呼び出しの有無・`strict_status` の値に依存する。

---

## 実データ例（naramachi_yasui_revised）

| 指標 | V2 | V3 |
|-----|----|----|
| `version` | `2.00703` | `3` |
| `points.length` | 972 | 972 |
| `vertices_points.length` | 4 | 36 |
| `tins_points[0].length`（三角形数） | 3898 | 3898 |
| `edges.length` | 818 | 818 |
| `edgeNodes.length` | 976 | 976 |
| `strict_status` | `"strict_error"` | `"strict"` |
| `kinks_points` | あり | なし |

---

## ファイル配置（テスト・デモ用）

```
tests/
  maps/
    <map_name>.json              ← 元のマップデータ（GCP + edges の入力）
  compiled/
    <map_name>_v2.json           ← V2 コンパイル済みデータ
    <map_name>_v3.json           ← V3 コンパイル済みデータ
    <map_name>.json              ← spec テスト用（通常 V3 と同一）
  cases/
    <map_name>_v2.json           ← V2 変換テストケース（100 点）
    <map_name>_v3.json           ← V3 変換テストケース（100 点）
```

生成スクリプト:
- `scripts/generate-compiled.ts` → `tests/compiled/` を更新
- `scripts/generate-cases.ts` → `tests/cases/` を更新

---

## 関連ソースファイル

| ファイル | 役割 |
|---------|------|
| `src/tin.ts` | `getCompiled()` / `setCompiled()` の実装 |
| `src/transform-v3.ts` | V3 形式のリストア処理（`restoreV3State()`）。設計上は「コンパイル済みデータから座標変換する処理」は `@maplat/transform` の担当だが、V3 開発効率のため一時的に `@maplat/tin` にまとめた。V3 開発完了後、この処理を `@maplat/transform` に移す際の境界となるファイル |
| `@maplat/transform` | `Compiled` 型定義・重みバッファ処理 |
