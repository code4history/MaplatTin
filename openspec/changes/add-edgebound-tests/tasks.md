## 1. リサーチ
- [x] 1.1 旧 `@maplat/edgebound` のテストケース（制約エッジ / 交差検知 / Delaunay 復旧）を洗い出し、移植対象を決定する
  参考: GitHub `https://github.com/code4history/MaplatEdgeBound/tree/master/tests` またはローカル `~/github/MaplatEdgeBound/tests/`

## 2. テスト移植
- [x] 2.1 `tests/edgebound/` を新設し、`Constrain` の代表的シナリオ（交差エッジを自動再配線、保護済みエッジ検出など）を再現するユニットテストを作成
- [x] 2.2 旧テストが利用していた補助ユーティリティ（簡易メッシュ構築など）を TypeScript/Vitest 向けに再実装
- [x] 2.3 テストを `pnpm run test` に統合し、既存の `Tin` テストと併せて成功することを確認

## 3. ドキュメント・周知
- [x] 3.1 README か開発者向けメモに EdgeBound テストの存在と実行手順を追記
- [x] 3.2 変更後の `vitest` 実行結果を共有し、将来の禁止エッジ実装で参照できるようにする
