# @maplat/tin パッケージのバグレポート

## 問題の概要
@maplat/tin v0.11.2のpackage.jsonで指定されているビルド成果物のファイルパスが実際のファイルと一致していない。

## 詳細

### package.jsonの記述
```json
{
  "main": "./dist/maplat_edgebound.cjs",
  "module": "./dist/maplat_tin.js",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "browser": "./dist/maplat_tin.umd.js",
      "import": "./dist/maplat_tin.js",
      "require": "./dist/maplat_tin.cjs"
    }
  }
}
```

### 実際のdistディレクトリの内容
```
total 220
drwxr-xr-x. 2 opc opc  4096 Jun 25 10:29 .
drwxr-xr-x. 4 opc opc   101 Jun 25 10:29 ..
-rw-r--r--. 1 opc opc  1375 Jun 25 10:29 constrained-tin.d.ts
-rw-r--r--. 1 opc opc   911 Jun 25 10:29 index.d.ts
-rw-r--r--. 1 opc opc  1449 Jun 25 10:29 index.html
-rw-r--r--. 1 opc opc   346 Jun 25 10:29 kinks.d.ts
-rw-r--r--. 1 opc opc   649 Jun 25 10:29 searchutils.d.ts
-rw-r--r--. 1 opc opc 51569 Jun 25 10:29 tin.cjs
-rw-r--r--. 1 opc opc  2715 Jun 25 10:29 tin.d.ts
-rw-r--r--. 1 opc opc 83014 Jun 25 10:29 tin.js
-rw-r--r--. 1 opc opc 51985 Jun 25 10:29 tin.umd.js
-rw-r--r--. 1 opc opc   976 Jun 25 10:29 vertexutils.d.ts
```

### 不一致点
1. `maplat_edgebound.cjs` → 存在しない（実際は `tin.cjs`）
2. `maplat_tin.js` → 存在しない（実際は `tin.js`）
3. `maplat_tin.umd.js` → 存在しない（実際は `tin.umd.js`）
4. `maplat_tin.cjs` → 存在しない（実際は `tin.cjs`）

## エラーメッセージ
```
[commonjs--resolver] Failed to resolve entry for package "@maplat/tin". The package may have incorrect main/module/exports specified in its package.json.
```

## 影響
Viteでビルドする際に、パッケージの解決に失敗してビルドエラーが発生する。

## 一時的な回避策
直接ファイルパスを指定してインポートする：
```typescript
import Tin from "@maplat/tin/dist/tin.js";
```

## 修正案
package.jsonを以下のように修正する：
```json
{
  "main": "./dist/tin.cjs",
  "module": "./dist/tin.js",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "browser": "./dist/tin.umd.js",
      "import": "./dist/tin.js",
      "require": "./dist/tin.cjs"
    }
  }
}
```

## 発見日
2025-06-25

## 環境
- @maplat/tin: 0.11.2
- Vite: 5.4.19
- Node.js環境でのビルド時に発生