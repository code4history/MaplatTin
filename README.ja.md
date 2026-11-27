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

V3 は、まず GCP と必須エッジの中継点の凸包の辺（凸包の辺の上に並ぶ点は隣り合う点どうし）を全部
両面で制約にし、補助頂点を含む三角形が凸包の内側に食い込まないようにします。そのために `strict`
（地理面へ写した三角網）が重なって壊れるときは、重なりに関わる凸包の辺だけを外して組み直します。
`strict` に戻るか、関わる辺が無くなるまで繰り返し、外した辺のうち `strict` を保てるものは 1 本ずつ制約に
戻します。`strict` に戻せないときは、外して得るものが無いので、凸包の辺を全部制約にした三角網を採ります。
`loose` は組み直しません。`strict` を保つことを優先するので、両面で凸包の形が食い違う所には、補助頂点を含む三角形の
食い込みが残ることがあります（同梱データでの割合は CHANGELOG に記載）。扇形の中心は V2 と同じく
GCP の重心そのものです。

### V3 の補完点（`supplementPairs`）

`strict` を保つために外した凸包の辺があると、補助頂点を含む三角形が凸包の内側へ食い込みます。そのような
凸包の辺 A–B に、V3 はシステムが **補完点** Q を 1 点足します。紙の面では A–B の弦のすぐ外（弦の長さの
1e-4 だけ外）、地理の面では「Q を頂点にする三角形の輪が全部、多数派と同じ向きに見える範囲（核）」の中で、
A–B のいちばん凹んだ GCP の少し外に置きます。すると A–Q・Q–B を制約の辺にしても `strict` を保てます。
同梱データ（延岡・館林城・奈良町・三重山・館林城下町・伏見）では、補完点 4・4・6・3・2・1 点で、食い込みが
0.00% になります。`strict` を失うことはありません。

- 補完点は**入力ではありません**。`updateTin()` のたびに、人間の GCP と必須エッジだけから、前回の結果を
  読まずに作り直します（同じ入力から同じ結果。溜まらない。要らなくなった点は次の計算に出てこない）。
  人間が補完点と同じ位置に GCP を打っていれば、補完点は足されません。
- `tin.points` には入らず、重心と扇形外挿の推定にも使いませんが、三角網と凸包の辺には使います。
  上限は、回数 4・合計 32 点・同じ凸包の辺は一度だけです。
- V3 だけ（V4 は引き継ぎ）。`strict`・`auto` が `strict` になるときに足します。**`loose` には足しません**
  （出力は従来と同じ。MaplatTin#95 で扱います）。`strict` にならないときも足しません（凸包の辺を全部制約にした
  三角網のまま）。V2 は変わりません。
- `new Tin({ ..., supplementPairs: false })` で切れます（この機能が無い版と同じ結果）。フラグは
  **インスタンスのオプション**で、`compiled` には書きません。`setCompiled()` のあとに `updateTin()` すると、
  インスタンスの設定（既定は `true`）に戻ります。地図のデータのどこに持つかは、エディタの持ち物です。
  `tin.supplementPairs` が今の補完点の一覧（`{ node, forw, bakw, kind, edge, anchor }`、内部座標）です。
- 外れた凸包の辺がある地図で `updateTin()` がおよそ 1.3〜3 倍かかります。外れた辺が無い地図は変わりません。
  手順には手間の上限（最初の三角網の組み立て 1 回分 × 1。置き場所を測る試行は 0.4 と数える）があり、辺の近くに
  対応点が並ぶ入力（揺らぎを付けた格子など）で上限に届くと、そこで諦めて補完点を使わない結果のままにするので、
  時間は最悪でも 3 倍程度に収まります。
  **格子のように外した辺が多い入力では、この時間の上限のために補完点を諦めることがあります。諦めた場合は、
  この機能が無い版（#91）と同じ結果になります。**
- `getCompiled()` は補完点を **`edgeNodes` の末尾**に足し（三角形の頂点は `"e{n}"` で指すので、今の
  `@maplat/transform` はそのまま読めます）、省略可の `supplementPairs` に一覧を持ちます
  （[compiled 形式](docs/compiled-format.ja.md)）。画面では「補完点」と呼び、人間が打つ「対応点」と分けます。

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
| `ringRescue` | 36 区分の補助頂点では `strict`（`auto` の strict の試行）にならず、輪を手当てして `strict` にしたときだけある。`"thinned"` は strict を壊す補助頂点（と両隣の区分）だけを外した輪、`"corners"` は四隅だけの輪（縮尺と回転の推定は V3 のまま）。そうでなければ項目ごと無い。 |

扇形外挿の余白は 10%、15%、22.5%、34%、50% の順に試し、補助頂点の三角形の反転が 0 で、
重心からの扇形が両面で星形になる最初の余白を採用します。どの余白も合格しない場合は、
両面で輪が閉じる（扇形が星形になる）余白を優先し、その中で反転が最少の余白を採用し、同数なら小さい方を選びます。
world file 外周を指定して扇形に切り替わった場合は、作り直した三角網の余白と件数を返します。
`getCompiled()` は診断を出力しません。V2 と、compiled を読み込んだ直後のプロパティは
`undefined` です。

### 局所更新（既定は切）

対応点を 1 つ編集すると、通常は `updateTin()` が三角網の全部を組み直します。局所更新（MaplatTin #100）は、
編集が影響する範囲だけを差し替えます。`strict` の保証は保ったままです（新しい三角形が全部、両面で同じ向きに
なる差し替えだけを採ります）。編集ツール（MaplatEditor）向けの機能で、**スイッチはどれも既定で切れており、
入れない限り何も変わりません。**

| オプション（`new Tin({...})`） | 既定 | 入れたときの動き |
| --- | --- | --- |
| `incremental` | `false` | `updateTin()` の後に、採用した網（`tin.incrementalMesh`）を持ち続け、`applyEdits()` が内側の編集を局所に当てます。切れていれば、`applyEdits()` は常に全部組み直します。 |
| `incrementalBand` | `false` | `applyEdits()` が、帯（補助頂点・重心）に触れる編集も、帯を差し替えて局所に当てます。`incremental` が要ります。`refreshBand()` にも要ります。 |
| `incrementalRebuild` | `false` | `updateTin()` の中の組み直しの繰り返し（凸包の辺を外す・補完点・輪の間引き）を、帯の差し替えに置き換えます。大きな地図で大幅に速くなります。今の手順が strict になる地図は strict になりますが、三角形の集合は同じとは限りません。ほかの 2 つとは独立です。 |

```ts
const tin = new Tin({ points, edges, wh, incremental: true, incrementalBand: true });
tin.updateTin();

// 編集を当てる。座標は setPoints() と同じ座標系。id は、最初は配列の添字
const patch = tin.applyEdits([{ type: "movePoint", id: 12, bakw: [x, y] }], tin.revision);
if (patch.mode === "local") {
  // patch.movedVertices・addedTriangles・removedTriangles などが、変わった所
} else {
  // "full": 全部を組み直した（理由は patch.fallbackReason）。tin.getCompiled() を読み直す
}
```

- `applyEdits(edits, baseRevision?)` が受け付ける編集は、`addPoint`・`removePoint`・`movePoint`・`addEdge`・
  `removeEdge`・`replaceEdgeNodes` です。全部の編集を局所に当てるか、全部を組み直すかの、どちらかです。
  id が無い編集などは、何も変えずに例外を投げます。`baseRevision` が古ければ、何も変えずに
  `fallbackReason: "revisionMismatch"` を返します。全部組み直しが例外を投げる入力（必須エッジが交差する・
  点が一直線に並ぶ、など）では、`applyEdits()` も同じ例外を投げます。このとき、入力は編集した後の状態で、
  三角網はありません（`updateTin()` が失敗した後と同じです）。
- 局所更新の後の `getCompiled()`・`transform()` は、最新の状態を返します。`updateTin()` は、編集した後の入力から
  全部を組み直します。
- **局所更新の網を、そのまま保存する。** 編集した後の入力を全部組み直すと strict にならないのに、局所更新の網は
  strict、ということがあります。そのときは `tin.refreshBand()` の後に `tin.collectIncrementalEvidence()` を呼び、
  `evidence.eligible` なら `evidence.compiled`（`meshOrigin: "incremental"` つき）を保存します。そのデータは、
  `updateTin()` ではなく `tin.restoreMesh(compiled)` で開きます（組み直すと strict を失います）。
  `incremental: true` で作った `Tin` で開いてください（そうでなければ、`restoreMesh()` は `"disabled"` を返します）。今の三角網が
  そういうデータから来ているかは、`tin.meshOrigin` で分かります。全部組み直しが strict なら、その compiled を
  そのまま保存してください。

シグネチャは [`docs/api/`](docs/api/)、`meshOrigin` は [`docs/compiled-format.ja.md`](docs/compiled-format.ja.md)
を見てください。

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
