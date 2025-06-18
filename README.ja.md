# Maplat Tin

2つの平面座標系間で制御点に基づく同相変換を定義・実行するJavaScriptライブラリです。  
[Maplat](https://github.com/code4history/Maplat/)プロジェクトの一部として開発されています。

English README is [here](./README.md).

## 主な機能

- **座標変換定義の生成:** 制御点とエッジ制約に基づいて座標変換定義を生成
- **双方向座標変換:** 2つの平面間で双方向の座標変換が可能
- **位相保存:** 変換時の同相性（トポロジー）を維持
- **柔軟な設定:** 
  - 通常/鳥瞰図モードの頂点処理
  - 厳密/自動/緩和モードのトポロジーチェック
  - Y軸の向きの制御
- **エッジ制約:** より正確な変換のための制約付きエッジの指定が可能
- **状態管理:** 変換定義の保存と復元をサポート

## インストール方法

### npm

```sh
# メインパッケージのインストール
npm install @maplat/tin

# 必要な依存パッケージのインストール
npm install delaunator
```

### JSR (JavaScript Registry)

```sh
# Deno向け
deno add @maplat/tin

# npm/Node.js向け
npx jsr add @maplat/tin
```

### Deno

```typescript
// JSR経由（推奨）
import Tin from "jsr:@maplat/tin";

// deno.jsonのimport mapを使用
import Tin from "@maplat/tin";

// またはnpmから直接
import Tin from "npm:@maplat/tin@0.11.1";

// ライブラリを使用
const tin = new Tin({
    wh: [500, 500],
    yaxisMode: Tin.YAXIS_FOLLOW
});
```

### ブラウザ

```html
<!-- Maplat Tin (ESモジュール) -->
<script type="module">
import Tin from "https://unpkg.com/@maplat/tin/dist/index.js";
// ライブラリを使用
const tin = new Tin({
    wh: [500, 500]
});
</script>
```

## 基本的な使用方法

```javascript
// 基本設定でインスタンスを作成
const tin = new Tin({
  wh: [500, 500],          // ソース座標系の幅と高さ
  yaxisMode: Tin.YAXIS_FOLLOW  // Y軸の向きの設定
});

// 制御点の設定: [ソース座標, ターゲット座標] の配列
tin.setPoints([
  [[100,100], [200, 200]], // 点1
  [[200,200], [400, 400]], // 点2
  [[150,150], [320, 350]], // 点3
  [[200,100], [420, 220]]  // 点4
]);

// TINネットワークの初期化
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

## 設定オプション

### コンストラクタオプション
| **オプション** | **型**                      | **説明**                   | **デフォルト** |
| ------------- | --------------------------- | ------------------------- | ------------- |
| `bounds`      | `Position[]`                | **境界多角形の頂点**        | `-`           |
| `wh`          | `number[]`                  | **幅と高さ [w, h]**        | `-`           |
| `vertexMode`  | `"plain"｜"birdeye"`        | **頂点処理モード**          | `"plain"`     |
| `strictMode`  | `"strict"｜"auto"｜"loose"` | **トポロジーチェックモード** | `"auto"`      |
| `yaxisMode`   | `"follow"｜"invert"`        | **Y軸の向き**              | `"invert"`    |
| `importance`  | `number`                    | **地図の重要度**           | `0`           |
| `priority`    | `number`                    | **地図の優先度**           | `0`           |

`bounds`または`wh`のいずれかを指定する必要があります。

### メソッド

| **メソッド**                  | **説明**                          |
| ---------------------------- | --------------------------------- |
| `setPoints(points)`          | **制御点の設定**                   |
| `setEdges(edges)`            | **制約付きエッジの設定**            |
| `updateTin()`                | **TINネットワークの初期化/更新**    |
| `transform(coords, inverse)` | **座標変換の実行**                 |
| `getCompiled()`              | **シリアライズ可能な状態の取得**     |
| `setCompiled(state)`         | **シリアライズされた状態からの復元** |

### エラーハンドリング

このライブラリは以下の場合にエラーをスローします：

- `"TOO LINEAR1"`,`"TOO LINEAR2"`: 制御点が直線状に並びすぎている
- `"SOME POINTS OUTSIDE"`: 点が境界外にある
- 逆変換が許可されていない状態での逆変換実行時

## ライセンス

Maplat Limited License 1.1

Copyright (c) 2024 Code for History

## 開発者

- Kohei Otsuka
- Code for History

あなたの貢献をお待ちしています！[イシューやプルリクエスト](https://github.com/code4history/MaplatTin/issues)は大歓迎です。