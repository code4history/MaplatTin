<!-- SECTION 1: Header (logo, badges, title) -->
<h1 align="center">MaplatTin</h1>

<p align="center">
  <a href="https://github.com/code4history/MaplatTin/actions/workflows/ci.yml"><img src="https://github.com/code4history/MaplatTin/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/npm/l/@maplat/tin" alt="License" /></a>
</p>

<!-- SECTION 2: Elevator Pitch -->
## MaplatTin について

MaplatTin は制御点に基づいて2つの平面座標系間の同相変換を定義・実行する
JavaScript ライブラリです。非線形かつ位相を保存する（同相な）双方向写像を
保証し、これが [Maplat](https://github.com/code4history/Maplat) ビューアが
古地図を正確な現代地図へ**元の画像を歪めずに**重ね合わせるための中核特性
です。

MaplatTin は Apache License 2.0（バージョン 0.14.2 以降）のオープンソース
プロジェクトです。

<!-- SECTION 3: Language switch link -->
**[英語版はこちら / Read this document in English](README.md)**

<!-- SECTION 4: Key Features -->
## 主な特徴

- **座標変換定義の生成** — 制御点とエッジ制約に基づいて座標変換定義を生成
- **双方向座標変換** — 2つの平面間で双方向の座標変換が可能
- **位相保存** — 変換時の同相性（トポロジー）を維持
- **柔軟な設定** — 通常/鳥瞰図モードの頂点処理・厳密/自動/緩和モードの
  トポロジーチェック・Y 軸の向きの制御
- **エッジ制約** — より正確な変換のための制約付きエッジの指定が可能
- **状態管理** — 変換定義の保存と復元をサポート
- オープンソース（Apache 2.0・バージョン 0.14.2 以降）— Maplat エコシステムの一部

<!-- SECTION 5: Quick Start -->
## クイックスタート

<!-- release-pinned:start -->
> **現在のリリース: `1.1.1`**。このブロックは本リポジトリで唯一
> リリース版数を持つ場所です。ブロックの外はすべて 1.0 正式版を前提に
> 書かれています。
> npm: [`@maplat/tin`](https://www.npmjs.com/package/@maplat/tin)
> [![npm](https://img.shields.io/npm/v/@maplat/tin)](https://www.npmjs.com/package/@maplat/tin)

### インストール

```bash
# pnpm（推奨）
pnpm add @maplat/tin

# npm
npm install @maplat/tin
```

### 最小利用例

```typescript
import Tin from '@maplat/tin';

// 基本設定でインスタンスを作成
const tin = new Tin({
  wh: [500, 500], // ソース座標系の幅と高さ
  yaxisMode: Tin.YAXIS_FOLLOW,
});

// 制御点の設定: [ソース座標, ターゲット座標] の配列
tin.setPoints([
  [[100, 100], [200, 200]],
  [[200, 200], [400, 400]],
  [[150, 150], [320, 350]],
  [[200, 100], [420, 220]],
]);

// TIN ネットワークの初期化
tin.updateTin();

// 順方向の変換（ソース → ターゲット）
const transformed = tin.transform([160, 160], false);

// 逆方向の変換（ターゲット → ソース）
const restored = tin.transform(transformed, true);
```

### CDN（jsDelivr）

```html
<!-- MaplatTin (UMD) -->
<script src="https://cdn.jsdelivr.net/npm/@maplat/tin@1.1.1/dist/maplat_tin.umd.js"></script>
<script>
  const mapTin = new tin.Tin({ wh: [500, 500] });
</script>
```

または ES モジュールとして使用する場合:

```html
<script type="module">
  import Tin from 'https://cdn.jsdelivr.net/npm/@maplat/tin@1.1.1/dist/maplat_tin.js';
  const tin = new Tin({ wh: [500, 500] });
</script>
```

※最新の互換バージョンを使用してください。

### V3 の四辺形の外を world file で変換する

`new Tin({ points, outerTransform: "worldFile", worldFile })` では、三角網を囲む
四辺形の外側を world file のアフィン変換で扱います。四隅と辺上の補助頂点にも
同じ world file を適用するため、四辺形の辺をまたいで変換が連続します。
地理面の GCP と同じ CRS を使い、原点の値は左上画素の中心の座標で指定します。
係数の欠落や不正がある場合と、`useV2Algorithm: true` との併用はエラーです。
既定の方式は `"extrapolate"` です。

V3 の余白を小さい順に試し、実際に使う三角網で、補助頂点を含む三角形の反転と
面積 0 がなくなった最初の余白を採用します。`strict` では地図面から逆変換用の
三角網を写し、`loose` では地理面で独立に三角網を組みます。既定の `auto` は、
内側に交差が無ければ `strict` の三角網で、あれば `loose` の三角網で判定します。
50% まで試しても使える外周が見つからない場合、`"extrapolate"` で三角網を
作り直します。

`getCompiled()` の戻り値は `CompiledTransformData` です。world file 外周の出力は
`outerTransform: "worldFile"`、`worldFile`、全補助頂点を並べた `vertices_points`
を持ちます。扇形に切り替えた出力には `outerTransform: "extrapolate"` と扇形の
パラメータが入ります。いずれも world file 外周に対応した `@maplat/transform` で
読み込めます。このビルドをブラウザーで直接使う場合は、Transform の UMD スクリプトを
先に読み込むか、インポートマップで ES モジュールの `@maplat/transform` を解決してください。

### V3 の外周の診断

`updateTin()` または `updateTinAsync()` の後、`tin.boundaryDiagnostics` から、採用した
余白と、地図面・地理面でそれぞれ作った三角網の診断件数の合計を取得できます。
型は `BoundaryDiagnostics` です。

| 項目 | 意味 |
|---|---|
| `margin` | GCP の外接矩形の幅・高さに対し、各辺に加えた余白の割合。 |
| `boundaryTriangleFlips` | 地図面で作った三角網と、地理面で独立に作った三角網のそれぞれで、補助頂点を含む三角形のうち面の間で向きが反転するか面積が 0 になるものを数えた合計。`strict` では実際に使う地理面の三角網を地図面から写して作るので、探索の時点のこの値と、出来上がった三角網の反転の数は一致しないことがある。 |
| `remainingForbiddenTriangles` | 辺反転の後も同じ群の点だけでできている三角形の数。群は補助頂点の全体、または 1 本の必須エッジの端点と中継点。 |
| `requestedOuterTransform` | world file 外周を指定したときの `"worldFile"`。 |
| `outerTransform` | world file 外周を指定したときに実際に採用した `"worldFile"` または `"extrapolate"`。 |
| `fallbackReason` | world file 外周が成立せず扇形で作り直したときの `"boundaryFlips"`。 |

扇形外挿の余白は 10%、15%、22.5%、34%、50% の順に試し、補助頂点の三角形の反転が 0 で、
重心からの扇形が両面で星形になる最初の余白を採用します。どの余白も合格しない場合は、
両面で輪が閉じる（扇形が星形になる）余白を優先し、その中で反転が最少の余白を採用し、同数なら小さい方を選びます。
world file 外周を指定して扇形に切り替わった場合は、作り直した三角網の余白と件数を返します。
`getCompiled()` は診断を出力しません。V2 と、compiled を読み込んだ直後のプロパティは
`undefined` です。

### API リファレンス

- **API シグネチャ**（リリース依存）: [`docs/api/`](docs/api/) を参照
- **概念解説**（リリース非依存）:
  [Wiki API-Reference](https://github.com/code4history/MaplatTin/wiki/API-Reference)
  を参照

### 開発

#### セットアップ
リポジトリをクローンし依存関係をインストールします。

```bash
git clone https://github.com/code4history/MaplatTin.git
cd MaplatTin
pnpm install
```

#### 開発サーバー
ホットリロード付きの開発サーバーを起動します。

```bash
pnpm dev
```

#### ビルド

```bash
pnpm build         # ライブラリをビルド (dist/)
pnpm build:demo    # デモサイトをビルド (dist-demo/)
```

#### テスト

```bash
pnpm test          # ユニットテスト (Vitest) を実行
pnpm typecheck     # 型チェック (TypeScript) を実行
pnpm lint          # リンター/フォーマッター (ESLint/Prettier) を実行
```

テストカバレッジ:

- `tests/edgebound/` — 内部 EdgeBound 制約エンジンのテスト（455 テスト）
- `tests/tin.test.ts` — 実際の地図データを使用した TIN 変換テスト
- `tests/transform.test.ts` — 座標変換テスト
<!-- release-pinned:end -->

<!-- SECTION 6: Prerequisites -->
## 動作環境

> `package.json` の `engines` フィールドから自動抽出（特定のリリースに紐づく値）。

- Node.js: `>=20.0.0`（GitHub Actions で検証済みの LTS）
- pnpm: `>=9.0.0`（必須・`package.json` で pnpm を強制）

<!-- SECTION 7 Peer Dependencies: 省略（OpenLayers 依存なし） -->

<!-- SECTION 8: Ecosystem / Related Repositories -->
## エコシステム

MaplatTin は [Code for History](https://github.com/code4history) が運営する
Maplat エコシステムの一部です。全容は下記エコシステム図を参照してください。

📖 **エコシステム図** — *（図は現在外部非公開の計画リポジトリに保持して
います。下記の姉妹リポジトリ表が公開版の代替です）*

### 姉妹リポジトリ

| リポジトリ | ライセンス | npm | 役割 |
|---|---|---|---|
| [Maplat](https://github.com/code4history/Maplat) | Apache 2.0 | `@maplat/ui` | メインビューア |
| [MaplatCore](https://github.com/code4history/MaplatCore) | Apache 2.0 | `@maplat/core` | コアライブラリ |
| [MaplatTin](https://github.com/code4history/MaplatTin) | Apache 2.0 | `@maplat/tin` | TIN 変換 |
| [MaplatTransform](https://github.com/code4history/MaplatTransform) | Apache 2.0 | `@maplat/transform` | 座標変換 |
| [MaplatEditor](https://github.com/code4history/MaplatEditor) | Apache 2.0 | — | データ作成ツール（デスクトップ） |
| [Chuci](https://github.com/code4history/Chuci) | MIT | `@c4h/chuci` | マルチメディアスワイパー/ビューア Web Components |
| [Quyuan](https://github.com/code4history/Quyuan) | MIT | `@c4h/quyuan` | GeoJSON テンプレートエンジン＋マルチメディアビューア Web Components |
| [Weiwudi](https://github.com/code4history/Weiwudi) | MIT | `@c4h/weiwudi` | タイルキャッシュ用 Service Worker |

> MaplatEditor は上記ビューアライブラリが描画する地図・POI を作成する
> データ作成ツールです。Maplat エコシステムはエンドツーエンド:
> MaplatEditor で作成し、いずれかのビューアライブラリで公開、という流れになります。

<!-- SECTION 9: Nayuta links -->
## リンク

| 対象 | リンク | 用途 |
|---|---|---|
| プロジェクト情報・機能紹介・事例 | <https://www.maplat.jp/> | 製品サイト |
| 支援企業・案件問い合わせ | <https://www.nayuta-inc.co.jp/> | コーポレートサイト（那由多社） |

> Apache ライセンスのリポジトリ（本リポジトリ）は両サイトへリンクします。
> MIT ライセンスの姉妹リポジトリ（Weiwudi / Quyuan / Chuci）へは那由多社リンクを置きません。
> 英語ページへ遷移する場合は `/en/` を付与してください（例: `https://www.maplat.jp/en/`）。

<!-- SECTION 10: License -->
## License

Apache License 2.0 — 詳細は [LICENSE](LICENSE) を参照。

```
Copyright 2019-2026 Kohei Otsuka, Code for History / Nayuta, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

> **特許注記**: Maplat の座標変換技術は日本国内で特許登録されています
> （Patent No. 6684776）。

> **過去のバージョン**: 0.14.2 より前のバージョンは Maplat Limited License
> 1.1 の下で配布されていました。Apache 2.0 へのライセンス復帰は 0.14.2
> 以降に適用されます。npmjs.com 上の過去版は元の制限付きライセンス条項の
> まま残ります。

<!-- SECTION 11: Contributors / Sponsors -->
## Contributors

- Kohei Otsuka
- Code for History

あなたの貢献をお待ちしています！
[イシューやプルリクエスト](https://github.com/code4history/MaplatTin/issues)は大歓迎です。
