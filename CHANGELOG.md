# Changelog

このプロジェクトの主な変更を記録します。版数は [Semantic Versioning](https://semver.org/) に従います。

## [Unreleased]

### Fixed
- dist の型定義が参照する `geojson` の型が `hoist: false` の利用者で解決できない不具合を直した（`@types/geojson` を dependencies へ移動）(#76)
- 制約線（edge）の端点の添字を検査するようにした。GCP の範囲に無い添字・整数でない添字の edge は、`updateTin()`（と `constrainedTin`）が `Error` を投げる。制約線の処理に反復の上限（辺の数の 2 乗）を置いた
- 対応が大きく乱れた制御点で、交差（kinks）の数え上げが時間とメモリを使い切るのを直した。`strictMode` が `auto` のときは交差を 1 件見つけた時点で `loose` へ切り替え、`strict` のときは `kinks` を 1 方向あたり 10 万件（同じ位置の交差を 1 件に数えた件数）までにする。公開関数 `findIntersections` の結果は変わらない

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
