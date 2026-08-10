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

## 定数

**Y 軸モード:**

- `Tin.YAXIS_FOLLOW` — Y 軸が座標系に従う
- `Tin.YAXIS_INVERT` — Y 軸が反転する

**ステータス値:**

- `Tin.STATUS_STRICT` — 厳密なトポロジー（往復変換が保証される）
- `Tin.STATUS_LOOSE` — 緩和されたトポロジー（往復変換が保証されない）

**フォーマットバージョン:**

- `format_version` — 現在の TIN フォーマットバージョン

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
