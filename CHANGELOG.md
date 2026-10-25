# Changelog

このプロジェクトの主な変更を記録します。版数は [Semantic Versioning](https://semver.org/) に従います。

## [1.1.1-rc.1] - 2026-10-26

- 版の種別: 既定案 minor（1.2.0）→ 確定 patch（1.1.1）（人間の確定・2026-10-25。理由: `WeightBuffer` の非推奨は公開の entry から届かず、minor の前提が成り立たない〔m1 C-7〕）

### Deprecated
- 内部の型 `WeightBuffer`（`src/types/tin.d.ts`）を非推奨にした。1.1.0 で weight_buffer の算出を廃止して以降使っておらず、代わりの型は無い。公開の entry（`@maplat/tin`）から export されていない型のため、次のメジャー（2.0.0）で削除する（MaplatTin#48）

## [1.1.0] - 2026-10-05

1.1.0-rc.1 と同じ内容の正式版です。版番号と、依存 `@maplat/transform` の指定を RC から正式版（`^1.1.0`）へ戻したことだけが違います。変更点は 1.1.0-rc.1 までの各項を参照してください。

## [1.1.0-rc.1] - 2026-09-28

### Changed
- 三角形内の重み付き補間 `weight_buffer` の算出を廃止し、空の `{}` を書き出すようにした（重み付き補間が変換品質を下げていたため）。compiled のフォーマット版を 2.00704／3.00001 へ更新
- `@maplat/transform` を 1.1.0-rc.1 へ追随
- 依存関係を更新
