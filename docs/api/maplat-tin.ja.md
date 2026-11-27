# Tin API シグネチャ

> `@maplat/tin` のリリース依存シグネチャ。
> 対象リリースは [README](../../README.ja.md#クイックスタート) のリリースブロックに
> 記載しています。
> 概念解説（TIN 理論・strict/loose モード）は
> [Wiki API-Reference](https://github.com/code4history/MaplatTin/wiki/API-Reference) を参照してください。

## コンストラクタオプション

| オプション | 型 | 説明 | デフォルト |
|---|---|---|---|
| `bounds` | `Position[]` | 境界多角形の頂点 | — |
| `wh` | `number[]` | 幅と高さ `[w, h]` | — |
| `vertexMode` | `"plain" \| "birdeye"` | 頂点処理モード | `"plain"` |
| `strictMode` | `"strict" \| "auto" \| "loose"` | トポロジーチェックモード | `"auto"` |
| `yaxisMode` | `"follow" \| "invert"` | Y軸の向き | `"invert"` |
| `importance` | `number` | 地図の重要度 | `0` |
| `priority` | `number` | 地図の優先度 | `0` |

`bounds` または `wh` のいずれかを指定する必要があります。

## プロパティ

| プロパティ | 型 | 説明 |
|---|---|---|
| `boundaryDiagnostics` | `BoundaryDiagnostics \| undefined` | 現在の三角網を V3 で生成したときの読み取り専用の診断。[V3 の外周の診断](../../README.ja.md#v3-の外周の診断)を参照。 |

## メソッド

| メソッド | 説明 |
|---|---|
| `setPoints(points)` | 制御点の設定 |
| `setEdges(edges)` | 制約付きエッジの設定 |
| `updateTin()` | TIN ネットワークの初期化/更新 |
| `transform(coords, inverse)` | 座標変換の実行 |
| `getCompiled()` | シリアライズ可能な状態の取得 |
| `setCompiled(state)` | シリアライズされた状態からの復元 |
| `getFormatVersion()` | フォーマットバージョン番号の取得 |

## 局所更新（MaplatTin #100。既定は切）

編集が影響する範囲だけを差し替える口。スイッチは 3 つで、どれも既定は `false`（入れない限り、何も変わらない）。

| コンストラクタオプション | 型 | 既定 | 説明 |
| --- | --- | --- | --- |
| `incremental` | `boolean` | `false` | `updateTin()` の後に、採用した網を取り込む。`applyEdits()` が内側の編集を局所に当てる |
| `incrementalBand` | `boolean` | `false` | `applyEdits()` が、帯（補助頂点・重心）に触れる編集も局所に当てる。`refreshBand()` にも要る。world file 外周では、帯を差し替えても `centroid`・`verticesParams` は入らない。補助頂点の変化は `movedVertices`・`removedVertices` で見る |
| `incrementalRebuild` | `boolean` | `false` | `updateTin()` の中の組み直しの繰り返しを、帯の差し替えに置き換える |

| メソッド・プロパティ | 説明 |
| --- | --- |
| `applyEdits(edits: TinEdit[], baseRevision?: number): TinPatch` | 編集を当てる。局所で済めば `mode: "local"` と差分、済まなければ全部を組み直して `mode: "full"` と `fallbackReason` を返す。`baseRevision` が今の `revision` と合わなければ、何も変えずに `"revisionMismatch"` を返す。当てられない編集は、何も変えずに例外を投げる |
| `revision: number` | `applyEdits()` の版。`setPoints()`・`setEdges()`・`setCompiled()` で 0 に戻る |
| `incrementalMesh: MeshModel \| undefined` | 局所更新の網。スイッチが切れている・取り込めない網（loose・V2）のときは `undefined` |
| `incrementalFailure` | 網を取り込めなかった理由（`"v2"`・`"loose"`・`"orientation"`・`"inconsistent"`） |
| `refreshBand(): TinPatch \| undefined` | 帯を、今の内側の点から作り直す（保存の直前に呼ぶ）。成り立たなければ、何も変えずに `undefined` |
| `collectIncrementalEvidence(rebuild?): IncrementalEvidence` | 局所更新の網を、そのまま保存してよいかの証拠を集める。網は変えない。`eligible` なら、保存する `compiled`（`meshOrigin: "incremental"` つき）が入る。全体を数え直すので、保存のときだけ呼ぶ |
| `restoreMesh(compiled, inputs?): { ok: true } \| { ok: false; reason }` | 保存した compiled から、三角形分割をせずに、三角網と網を戻す。`inputs`（`setPoints()` と同じ座標系の対応点・必須エッジ）を渡すと、compiled と合うかも確かめる。`incremental: true` の `Tin` で呼ぶ（そうでなければ `"disabled"`）。戻せなければ理由を返す（下の「`restoreMesh()` が断った後の状態」） |
| `meshOrigin: "incremental" \| undefined` | 今の三角網が、局所更新の網をそのまま保存したデータから来ているか。`updateTin()` で外れる |
| `rebuildDiagnostics` | `incrementalRebuild` を入れた `updateTin()` の、試行の内訳（全部を組んだ回数・帯の差し替えで済ませた回数・今の手順だけで組み直したか） |

**`restoreMesh()` が断った後の状態。** `setCompiled(compiled)` をした状態（順変換はできる）で、網は持たない。印（`meshOrigin`）は外れる。
`strict_status` は、次の 3 通り。

- compiled が strict と名乗っていて、網を調べて strict でないと分かったとき（`"notStrict"`・`"boundary"`）: `"strict_error"`
  になる（逆変換は断られる）。
- compiled が strict と名乗っていて、ほかの理由で断ったとき: 未確定（`undefined`）になる。
- compiled が strict_error・loose と名乗っていたとき: その値のまま残る。

例外が 2 つある。`"disabled"`（スイッチが切れている）のときは、`setCompiled(compiled)` と同じで、印も `strict_status` も
compiled のまま。`"v2"`（V2 の `Tin` に world file 外周の compiled。読む前に断る）のときは、状態に触らない。
どの場合も、編集を続けるには、対応点と必須エッジを入れ直して `updateTin()` する。

`TinEdit` は、`{ type: "addPoint", id, forw, bakw, position? }`・`{ type: "removePoint", id }`・
`{ type: "movePoint", id, forw?, bakw? }`・`{ type: "addEdge", id, start, end, forwNodes, bakwNodes, position? }`・
`{ type: "removeEdge", id }`・`{ type: "replaceEdgeNodes", id, forwNodes, bakwNodes }`。座標は `setPoints()` と同じ
座標系。対応点・必須エッジの id は、最初は配列の添字で、足す分は使われていない id を呼び出し側が振る。

`TinPatch` は、`revision`・`mode`・`fallbackReason?`・`strict_status`・`boundaryStale` と、局所で済んだときの差分
（`movedVertices`・`addedVertices`・`removedVertices`・`addedTriangles`・`removedTriangles`・`badTriangles`・
`dirtyBounds`。帯を差し替えたときは `centroid`・`verticesParams`、補完点の一覧が変わったときは `supplementPairs`）。
差分の座標は、compiled と同じ内部の座標系。頂点は、種類と id（`VertexRef`）で指す。

## 定数

**Y 軸モード:**

- `Tin.YAXIS_FOLLOW` — Y 軸が座標系に従う
- `Tin.YAXIS_INVERT` — Y 軸が反転する

**ステータス値:**

- `Tin.STATUS_STRICT` — 厳密なトポロジー（往復変換が保証される）
- `Tin.STATUS_LOOSE` — 緩和されたトポロジー（往復変換が保証されない）

**フォーマットバージョン:**

- `format_version` — 現在の TIN フォーマットバージョン（2.00704。Tin が書き出す V2 版）

## ユーティリティ関数

| 関数 | 説明 |
|---|---|
| `constrainedTin(points, edges, z)` | 制約付きドロネー三角分割の生成 |
| `findIntersections(features)` | フィーチャ内の交点を検出 |
| `insertSearchIndex(tins, centroid, strict)` | TIN の検索インデックスを挿入 |
| `counterPoint(point)` | 対向点の計算 |
| `createPoint(xy, mercator, forw)` | ポイントフィーチャの作成 |
| `vertexCalc(points, edgeNodes, centroid, originPoly, xy, vertexMode)` | 頂点座標の計算 |

## エラーハンドリング

このライブラリは以下の場合にエラーをスローします:

- `"TOO LINEAR1"`, `"TOO LINEAR2"` — 制御点が直線状に並びすぎている
- `"SOME POINTS OUTSIDE"` — 点が境界外にある
- 逆変換が許可されていない状態での逆変換実行時

## 使用例

```javascript
// 基本設定でインスタンスを作成
const tin = new Tin({
  wh: [500, 500], // ソース座標系の幅と高さ
  yaxisMode: Tin.YAXIS_FOLLOW, // Y 軸の向きの設定
});

// 制御点の設定: [ソース座標, ターゲット座標] の配列
tin.setPoints([
  [[100, 100], [200, 200]], // 点1
  [[200, 200], [400, 400]], // 点2
  [[150, 150], [320, 350]], // 点3
  [[200, 100], [420, 220]], // 点4
]);

// TIN ネットワークの初期化
tin.updateTin();

// トポロジーの状態確認
if (tin.strict_status === Tin.STATUS_STRICT) {
  console.log('トポロジーOK: 往復変換が保証されます');
} else if (tin.strict_status === Tin.STATUS_LOOSE) {
  console.log('トポロジー警告: 往復変換が保証されません');
}

// 順方向の変換（ソース → ターゲット）
const transformed = tin.transform([160, 160], false);

// 逆方向の変換（ターゲット → ソース）
const restored = tin.transform(transformed, true);
```
