# Changelog

このプロジェクトの主な変更を記録します。版数は [Semantic Versioning](https://semver.org/) に従います。

## [Unreleased]

### Added
- V3 の四辺形の外を world file で変換する `outerTransform: "worldFile"` と `worldFile` を追加した。上限までに成立しないときは扇形で作り直し、`Tin.boundaryDiagnostics` に要求方式・採用方式・理由を返す (#82)
  - Added world file transformation outside the V3 quadrilateral, with automatic fallback to fan extrapolation and diagnostics (#82)

- 制約付き三角網（`Constrain`）に `forbidGroupTriangles(groupsOf, planes?)` を足した。同じ群（四辺形の補助頂点の全体・必須エッジごとの端点と中継点など）に属する点だけでできた三角形を、制約でない辺の反転で解消する（禁止制約）。反転は、反転後の三角形がすべての面で三角網と同じ向きの、面積 0 でない三角形になるときだけ行い、反転した辺は制約として扱う。

- V3 の生成時に採用した余白、補助頂点の三角形の反転数、禁止制約の残数を `Tin.boundaryDiagnostics` で参照できるようにした (#82)
  - Added `Tin.boundaryDiagnostics` for the selected V3 margin, boundary triangle flips, and remaining forbidden triangles (#82)

### Changed
- V3 は GCP と必須エッジの中継点の凸包の辺（凸包の辺の上に並ぶ点は隣り合う点どうし）を、まず全部制約の辺にして三角網を組む。`strict`（地理面へ写した三角網）が壊れるときは、重なりや反転に関わる凸包の辺だけを外して組み直し、`strict` に戻るか外す辺が無くなるまで繰り返す。外した辺のうち `strict` を保てるものは 1 本ずつ戻す。`strict` に戻せないとき（凸包の辺を外しても strict にならない）は、外して得るものが無いので、凸包の辺を全部制約にした三角網を採る（凸包の辺を全部外すと strict になるときだけ、その三角網）。補助頂点を含む三角形が凸包の内側に食い込むのを減らすが、`strict` を保つことを優先するので、両面で凸包の形が食い違う所には食い込みが残ることがある。V2 は変えない。食い込み（補助頂点を含む三角形が凸包の内側に入る面積 / 凸包の面積、地図面）は、延岡 10.94→3.80%、伏見 16.09→0%、三重山 6.30→0.05%、奈良町 5.59→3.61%（`strict_error` が `strict` になる）、館林城 9.33→4.98%、館林城下町 10.19→0.04%。`strict` の判定は悪くならない。`loose` は組み直さず、凸包の辺を全部制約にするので、地図面の三角網で地理側の向きが逆になる三角形が増えることがある（`loose` は元から一対一を保証しない）(#86)
  - V3 now first constrains every edge of the convex hull of the GCPs and points on constrained edges (between neighbouring points, including those on a hull side). If that breaks `strict`, only the hull edges involved in the overlap or flip are dropped and the triangulation is rebuilt until `strict` holds; dropped edges that `strict` tolerates are restored one by one. If `strict` cannot be restored, the triangulation with every hull edge constrained is used (dropping edges gains nothing), unless dropping all of them yields `strict`. `loose` is not rebuilt, so it can have more triangles whose orientation differs between planes (`loose` never guaranteed one-to-one). This reduces, but does not always remove, auxiliary-vertex triangles cutting into the hull: `strict` takes priority, so some intrusion can remain where the hulls of the two planes disagree. V2 is unchanged. Intrusion (area of auxiliary-vertex triangles inside the hull / hull area, map plane): Nobeoka 10.94→3.80%, Fushimi 16.09→0%, Miesan 6.30→0.05%, Naramachi 5.59→3.61% (`strict_error` becomes `strict`), Tatebayashi castle 9.33→4.98%, Tatebayashi Jokamachi 10.19→0.04%. `strict` outcomes do not get worse (#86)

- V3 の扇形の中心を、V2 と同じく GCP の重心そのもの（地理側は三角網で変換した点）にした。以前は重心を含む三角形の 3 頂点の平均で、GCP が対称に並ぶと中心が片側へずれ、補助頂点が片側に詰まった。10° の区分の境界の方向（真東など）にある GCP は両側の区分に入れ、同じ位置の補助頂点（四隅の頂点との重複も）は 1 つにまとめる。既存の compiled はそのまま読める（作り直したときだけ変わる）(#87)
  - V3 now uses the GCP centroid itself as the fan center (the geographic side is transformed through the triangulation), as V2 does, instead of the mean of the containing triangle's vertices, which shifted the center when GCPs were laid out symmetrically. GCPs exactly on a 10° bin boundary count for both neighbouring bins. Existing compiled data is read as-is; only regenerating it changes the center (#87)

- V3 の plain（`vertexMode` が birdeye でないとき）は、扇形外挿の縮尺と回転を、凸包の点の比の最小値と角度の平均ではなく、重心から遠い凸包の点（重心からの紙の距離が最遠の点の 0.6 倍以上。3 点に満たないときは凸包の全点）に、重心を固定した相似を当てはめる最小二乗で決める。重心に近い凸包の点の打ち誤差が極値として拾われ、紙の隅で増幅されるのを避ける。正しい CRS・誤差 3 画素の GCP 24 組で、凸包の外側の最大が 109.5 km → 18.7 km、誤差の無い GCP では変わらず、中心を大きく描いた図では外側の二乗平均が 1.16 倍（lcc の平面距離）。当てはまりが悪いとき（一致度 `|Σ F·conj(B)| / √(Σ|F|²·Σ|B|²)` が 0.5 未満。地理側が紙に対して裏返しの入力など）、点が空・全点が重心と一致するときは、従来の推定に戻る（最小二乗だけだと、鏡像に近い入力で補助頂点が際限なく遠くへ飛ぶ）。V2（`useV2Algorithm`）と birdeye は変えない。同じ GCP から作り直した compiled は、補助頂点の地理側の位置が変わり、`strict` を保つために外す凸包の辺が増えて内側の三角網も変わることがある（延岡の食い込み 3.80→7.53%）。保存済みの compiled は変わらない (#90)
  - V3 plain (`vertexMode` other than birdeye) now fixes the scale and rotation of the fan extrapolation by a least-squares, centroid-fixed similarity fitted to the hull points far from the centroid (paper distance ≥ 0.6 × the farthest; all hull points if fewer than 3), instead of the minimum ratio and mean angle over all hull points, which let the pointing error of hull points near the centroid be picked as an extreme and amplified at the paper corners. With 24 GCPs on the correct CRS and 3 px error, the outer maximum drops from 109.5 km to 18.7 km; error-free GCPs are unchanged; for a map drawn with an enlarged centre the outer RMS is 1.16× (planar lcc distance). It falls back to the legacy estimate when the fit is poor (agreement `|Σ F·conj(B)| / √(Σ|F|²·Σ|B|²)` below 0.5, e.g. a geographic plane mirrored relative to the paper) or when the samples are empty or all coincide with the centroid (a bare least-squares fit lets the vertices fly arbitrarily far on near-mirrored input). V2 (`useV2Algorithm`) and birdeye are unchanged. Regenerated compiled data has different auxiliary-vertex positions on the geographic side, and more hull edges may be dropped to keep `strict`, which can change the inner triangulation (Nobeoka intrusion 3.80→7.53%). Stored compiled data is unchanged (#90)

- V3 は GCP の外接矩形に 10〜50% の余白を試し、地図面・地理面の三角網に補助頂点と必須エッジの禁止制約を適用する (#82)
  - V3 tries margins of 10–50% around the GCP bounding box and applies the auxiliary vertex and constrained edge group rules to triangulations in both planes (#82)

- `Tin.getCompiled()` の戻り値の型を `Compiled` から `CompiledTransformData`（`Compiled` と world file 外周の `CompiledWorldFileOuter` の和）に変えた。`const c: Compiled = tin.getCompiled()` と書く TypeScript の利用者は型の調整が必要
  - Changed the return type of `Tin.getCompiled()` from `Compiled` to `CompiledTransformData` (the union of `Compiled` and the world file outer `CompiledWorldFileOuter`). TypeScript users writing `const c: Compiled = tin.getCompiled()` need to adjust their types

- ビルドで `@maplat/transform` を外部依存（external）にした
  - Marked `@maplat/transform` as an external dependency in the build

### Fixed
- V3 の補助頂点が GCP や必須エッジの中継点と同じ位置になり、Delaunator がその点を三角網から落として `updateTin()` が `Invalid edge ... is not part of the triangulation` で失敗することがあったのを直した。GCP の外接矩形の高さや幅が 0 のとき、余白を広げた矩形からの補助頂点の位置が内点に一致することがあった。補助頂点は内点・他の補助頂点と位置が重なるものを除いて作るようにした
- 必須エッジの中継点を、両面の折れ線の累積長比が厳密一致するときだけまとめていたのを直した。`Math.sqrt` と加算・除算の丸めで対応する折れ点どうしの比が数 ULP ずれると中継点が 2 件作られて点が重なり、`updateTin()` が `Invalid edge ... is not part of the triangulation` で失敗することがあった。比の差が `256 * Number.EPSILON` 以内の折れ点は最も近いもの 1 つと組み合わせて 1 つの中継点にまとめ、両側を対応確定にして重複を作らせない。相手面の端点（GCP の位置）とは組み合わせず、端点付近の内点と GCP が重なるのを防ぐ。中継点の並び替えの同値時の比較も安定するようにした。中継点の生成は `src/edge-nodes.ts` の `interpolateEdgeNodes` に切り出した
- 必須エッジの折れ点の比の突き合わせで、座標が大きく辺が短いとき（地理面 1.5e7 付近・辺 30 px 以内など）に中継点が重なって `updateTin()` が失敗するのを直した（#106）。許容幅を `256 * Number.EPSILON` の固定値から、折れ線ごとの `256 * Number.EPSILON + 4 * (ulp(紙面の最大絶対座標) / 紙面の折れ線の全長 + ulp(地理面の最大絶対座標) / 地理面の折れ線の全長)` にした（座標の量子化によるずれを覆う。係数 4 は実測で決めた）。片方の面の折れ線が極端に短いときにもう片方の別の折れ点までまとめないよう、許容幅には上限 `MAX_RATIO_MATCH_TOLERANCE = 1e-9` を置いた。あわせて、突き合わせを比の順序を保つ最大の対応づけ（比の差の合計が最小）にして、許容幅内に折れ点が複数あっても地理面の折れ線が逆戻りしないようにした。許容幅内の対応づけで余った折れ点が、相手面の折れ点と許容幅内で一致するときは、同じ位置とみなして中継点を作らない（従来も比が厳密に同じときは黙って作られなかったのを、許容幅内まで広げて明文化した）。重ならない通常の入力では出力は変わらない（実地図 48 通り＝tests/maps の GCP つき 5 件と tests/compiled の points を持つ 19 件を、それぞれ v2・v3 のアルゴリズムで組んだ `getCompiled()` と `edgeNodes` が、従来の実装の値とバイト一致することを `tests/edge-nodes-real-maps.test.ts` で固定した）
- dist の型定義が参照する `geojson` の型が `hoist: false` の利用者で解決できない不具合を直した（`@types/geojson` を dependencies へ移動）(#76)
- 制約線（edge）の端点の添字を検査するようにした。GCP の範囲に無い添字・整数でない添字の edge と、位置が重なって三角網に入らなかった点を端点にする edge は、`updateTin()`（と `constrainedTin`）が `Error` を投げる。制約線の処理に反復の上限（辺の数の 2 乗）を置いた
- 対応が大きく乱れた制御点で、交差（kinks）の数え上げが時間とメモリを使い切るのを直した。`strictMode` が `auto` のときは交差を 1 件見つけた時点で `loose` へ切り替え、`strict` のときは `kinks` を 1 方向あたり 10 万件（同じ位置の交差を 1 件に数えた件数）までにし、位置が重なる交差ばかりのときは見つけた総数がその 16 倍に届いた時点で数え上げをやめる。公開関数 `findIntersections` の結果は変わらない

## [1.1.1] - 2026-11-02

1.1.1-rc.1 と同じ内容の正式版です（版番号のみ変更）。変更点は 1.1.1-rc.1 までの各項を参照してください。

## [1.1.1-rc.1] - 2026-10-26

- 版の種別: patch（1.1.1）。`WeightBuffer` の非推奨は公開の entry から届かないため、minor（1.2.0）にはしなかった

### Fixed
- 公開の型定義を、利用側の `skipLibCheck: false` で検査できるようにした。`dist/index.d.ts` が指す `./types/kinks.d`・`./types/tin.d` が `dist` に無かったのを直し、`dist` の型定義の相対 import に `.js` を付けた（`moduleResolution: node16` で必要）。公開している型の名前は変えていない

### Deprecated
- 内部の型 `WeightBuffer`（`src/types/tin.ts`）を非推奨にした。1.1.0 で weight_buffer の算出を廃止して以降使っておらず、代わりの型は無い。公開の entry（`@maplat/tin`）から export されていない型のため、次のメジャー（2.0.0）で削除する（MaplatTin#48）

## [1.1.0] - 2026-10-05

1.1.0-rc.1 と同じ内容の正式版です。版番号と、依存 `@maplat/transform` の指定を RC から正式版（`^1.1.0`）へ戻したことだけが違います。変更点は 1.1.0-rc.1 までの各項を参照してください。

## [1.1.0-rc.1] - 2026-09-28

### Changed
- 三角形内の重み付き補間 `weight_buffer` の算出を廃止し、空の `{}` を書き出すようにした（重み付き補間が変換品質を下げていたため）。compiled のフォーマット版を 2.00704／3.00001 へ更新
- `@maplat/transform` を 1.1.0-rc.1 へ追随
- 依存関係を更新
