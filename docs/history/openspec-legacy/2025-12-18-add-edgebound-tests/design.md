## Context
- EdgeBound のコアクラスを内部化したが、元リポジトリでカバーしていた制約エッジのユニットテストが欠落している。
- 旧テストの参照先: GitHub (`https://github.com/code4history/MaplatEdgeBound/tree/master/tests`) またはローカルコピー（例: `~/github/MaplatEdgeBound/tests/`）。
- 将来の禁止エッジ実装やリファクタ時に挙動を安心して変更できるよう、最小限の回帰テストを整備する。

## Approach
- 旧 `@maplat/edgebound` テストのうち、制約エッジの挿入・交差検知・エラーハンドリングを担うケースを抽出し、Vitest 形式へ移植する。
- テストでは最小限の点群・半辺構造をセットアップし、`Constrain` API を直接叩いて結果を検証する。既存の地図データ依存は避け、純粋に幾何ロジックの確認に絞る。
- 補助的な三角形生成ユーティリティを `tests/edgebound/utils.ts` などに配置し、可読性を保つ。
- テストは `npm run test` / `pnpm run test` に統合されるため、追加のスクリプトは不要。README には「EdgeBound ユニットテストが追加された」旨のみ追記する。

## Open Questions
- 旧テストの全てを移植する必要があるか、それとも代表例に絞るか。初回は最小限で開始し、必要に応じてケースを追加する方針。
- 禁止エッジ対応時に再利用できるフィクスチャの粒度（ユーティリティ関数として切り出す範囲）を検討する。
