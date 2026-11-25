# Changelog

このプロジェクトの主な変更を記録します。版数は [Semantic Versioning](https://semver.org/) に従います。

## [Unreleased]

### Added
- 制約付き三角網（`Constrain`）に `forbidGroupTriangles(groupsOf, planes?)` を足した。同じ群（四辺形の補助頂点の全体・必須エッジごとの端点と中継点など）に属する点だけでできた三角形を、制約でない辺の反転で解消する（禁止制約）。反転は、反転後の三角形がすべての面で三角網と同じ向きの、面積 0 でない三角形になるときだけ行い、反転した辺は制約として扱う。

- V3 の生成時に採用した余白、補助頂点の三角形の反転数、禁止制約の残数を `Tin.boundaryDiagnostics` で参照できるようにした (#82)
  - Added `Tin.boundaryDiagnostics` for the selected V3 margin, boundary triangle flips, and remaining forbidden triangles (#82)

### Changed
- V3 は GCP の外接矩形に 10〜50% の余白を試し、地図面・地理面の三角網に補助頂点と必須エッジの禁止制約を適用する (#82)
  - V3 tries margins of 10–50% around the GCP bounding box and applies the auxiliary vertex and constrained edge group rules to triangulations in both planes (#82)

### Fixed
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
