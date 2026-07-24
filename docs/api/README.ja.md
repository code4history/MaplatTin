# MaplatTin API リファレンス

本ディレクトリは `@maplat/tin` の**リリース依存 API シグネチャ**を保持します。

ADR-0012 は Maplat の文書群を2層に分けます:

- **リリース依存シグネチャ**（コンストラクタオプション・メソッド名・定数・
  ユーティリティ関数）— 本 `docs/api/` ディレクトリ。リリースごとに更新します。
- **リリース非依存の概念解説**（TIN 理論・strict/loose モード・利用パターン）—
  [Wiki API-Reference](https://github.com/code4history/MaplatTin/wiki/API-Reference)。

シグネチャは意図的に Wiki 側へ重複保持せず、Wiki から本ディレクトリへリンクします。

## ファイル

- [`maplat-tin.ja.md`](maplat-tin.ja.md) — `Tin` クラスのシグネチャ
  （コンストラクタオプション・メソッド・定数・ユーティリティ関数）

## README との関係

README のクイックスタート節はシグネチャを本ディレクトリへ、概念解説を Wiki へ導線します。
インストール・最小利用例は [../README.ja.md](../README.ja.md) を参照してください。
