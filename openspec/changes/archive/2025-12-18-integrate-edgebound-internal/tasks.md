## 1. 実装準備
- [x] 1.1 `@maplat/edgebound` の現行コードと API を確認し、`@maplat/tin` の利用箇所を洗い出す

## 2. 取り込みとリファクタ
- [x] 2.1 EdgeBound コアロジックを `src/edgebound/` などの内部モジュールとして移植し、必須エッジ処理が現行と同等に動作することを確認
- [x] 2.2 `src/constrained-tin.ts` からの依存を内部モジュールに切り替え、旧パッケージ依存を削除
- [x] 2.3 繋ぎ替えロジックを再利用しやすい形でユーティリティ化（後続の禁止エッジ実装で再利用予定）

## 3. 動作確認と公開準備
- [x] 3.1 既存のジオメトリテスト（Vitest）を更新・追加し、必須エッジ動作のリグレッションを防止（Codex 環境では `_VOLTA_TOOL_RECURSION` を解除して `pnpm run test` を実施し成功）
- [x] 3.2 `package.json` から `@maplat/edgebound` の依存を削除し、ビルド・型チェック・テストが成功することを確認（同じく `_VOLTA_TOOL_RECURSION` を解除して `pnpm run build` を実行し成功）
- [x] 3.3 CHANGELOG など公開文書が必要な場合は更新（既存ドキュメントに対象無しのため不要）
