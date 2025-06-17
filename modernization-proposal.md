# MaplatTin モダンESモジュール化・型安全性向上・Deno対応 改善提案

## 概要
このドキュメントは、MaplatTinリポジトリをモダンなESモジュール構成に移行し、TypeScriptの型安全性を向上させ、Deno互換性を追加するための改善提案です。

## 1. 現状の問題点

### 1.1 ESモジュール関連
- `src/index.ts:16` で `"use strict"` を使用（TypeScriptとESモジュールでは不要）
- `src/index.ts:928-934` でwindow/globalオブジェクトに直接代入（ESモジュールのベストプラクティスではない）
- UMD、CJS、ESの3形式でビルド（モダンな環境ではESモジュールのみで十分な場合が多い）

### 1.2 型安全性
- 約80箇所以上で`any`型を使用
- 主な使用パターン：
  - GeoJSON geometryへのアクセス時
  - 配列操作での型アサーション
  - コールバック関数のパラメータ
  - 一時的なオブジェクトの構築
  - 一部のクラスプロパティ

### 1.3 依存関係管理
- `delaunator`がpeerDependenciesに設定（通常の依存関係として含めた方がユーザーフレンドリー）

## 2. 改善提案

### 2.1 新しい型定義ファイル（`src/types/tin.d.ts`）

```typescript
import type { Feature, Point, Position, FeatureCollection } from "geojson";

export interface PointsSetBD {
  forw: FeatureCollection<Point>;
  bakw: FeatureCollection<Point>;
  edges: number[][];
}

export interface VertexDelta {
  forw: [number, number];
  bakw: [number, number];
}

export interface WeightBuffer {
  [target: string]: {
    [vertexKey: string]: {
      [edgeKey: string]: number;
    };
  };
}

export type LengthItem = [Position, number, number, number, string?];

export type VertexParams = [number[], FeatureCollection<Polygon>[]];

export interface TriangleProperties {
  a?: any; // This should match the z parameter type from @maplat/transform
  b?: any;
  c?: any;
}
```

### 2.2 package.json の改善

```json
{
  "name": "@maplat/tin",
  "version": "0.11.0",
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "default": "./dist/index.js"
    }
  },
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["dist", "src", "README.md", "LICENSE"],
  "scripts": {
    "build": "tsc && vite build",
    "test": "vitest run",
    "test:watch": "vitest",
    "coverage": "vitest run --coverage",
    "lint": "eslint src tests",
    "typecheck": "tsc --noEmit",
    "prepublishOnly": "npm run lint && npm run typecheck && npm run test && npm run build"
  },
  "dependencies": {
    "@maplat/edgeruler": "^0.1.1",
    "@maplat/transform": "^0.1.5",
    "@turf/boolean-point-in-polygon": "^7.2.0",
    "@turf/centroid": "^7.2.0",
    "@turf/convex": "^7.2.0",
    "@turf/helpers": "^7.2.0",
    "@turf/line-intersect": "^7.2.0",
    "delaunator": "^5.0.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.17.0",
    "@types/delaunator": "^5.0.3",
    "@types/geojson": "^7946.0.15",
    "@types/node": "^22.10.2",
    "@typescript-eslint/eslint-plugin": "^8.18.2",
    "@typescript-eslint/parser": "^8.18.2",
    "@vitest/coverage-v8": "^1.6.0",
    "eslint": "^9.17.0",
    "eslint-config-prettier": "^9.1.0",
    "jest-matcher-deep-close-to": "^3.0.2",
    "jsdom": "^25.0.1",
    "prettier": "^3.4.2",
    "typescript": "^5.7.2",
    "vite": "^5.4.11",
    "vite-plugin-dts": "^4.4.0",
    "vitest": "^1.6.0"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/code4history/MaplatTin.git"
  },
  "author": "Code for History",
  "license": "Maplat Limited License 1.1",
  "bugs": {
    "url": "https://github.com/code4history/MaplatTin/issues"
  },
  "homepage": "https://github.com/code4history/MaplatTin/wiki",
  "keywords": [
    "triangulation",
    "warp",
    "GIS",
    "Maplat",
    "MaplatTin",
    "deno"
  ]
}
```

### 2.3 tsconfig.json の最適化

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "useDefineForClassFields": true,
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitAny": true,
    "declaration": true,
    "sourceMap": true,
    "experimentalDecorators": true,
    "outDir": "./dist",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "typeRoots": [
      "./node_modules/@types",
      "./types"
    ]
  },
  "include": ["src/**/*", "tests/**/*", "types/**/*"],
  "exclude": ["node_modules", "dist", "npm"]
}
```

### 2.4 vite.config.ts の簡素化

```typescript
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index'
    },
    rollupOptions: {
      external: [
        '@turf/boolean-point-in-polygon',
        '@turf/centroid',
        '@turf/convex',
        '@turf/helpers',
        '@turf/line-intersect',
        '@maplat/edgeruler',
        '@maplat/transform',
        'delaunator'
      ]
    }
  },
  plugins: [
    dts({
      outDir: 'dist',
      exclude: ['tests'],
      rollupTypes: true
    })
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts']
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
});
```

### 2.5 Deno対応

#### deno.json

```json
{
  "name": "@maplat/tin",
  "version": "0.11.0",
  "exports": "./src/index.ts",
  "tasks": {
    "build": "deno task build:npm",
    "build:npm": "deno run --allow-all scripts/build_npm.ts",
    "test": "deno test --allow-read tests/",
    "lint": "deno lint",
    "fmt": "deno fmt",
    "check": "deno check src/**/*.ts"
  },
  "compilerOptions": {
    "lib": ["ES2022", "DOM"],
    "strict": true
  },
  "imports": {
    "@turf/boolean-point-in-polygon": "https://esm.sh/@turf/boolean-point-in-polygon@7",
    "@turf/centroid": "https://esm.sh/@turf/centroid@7",
    "@turf/convex": "https://esm.sh/@turf/convex@7",
    "@turf/helpers": "https://esm.sh/@turf/helpers@7",
    "@turf/line-intersect": "https://esm.sh/@turf/line-intersect@7",
    "delaunator": "https://esm.sh/delaunator@5",
    "@maplat/transform": "https://deno.land/x/maplat_transform/mod.ts",
    "@maplat/edgeruler": "https://deno.land/x/maplat_edgeruler/mod.ts"
  },
  "fmt": {
    "lineWidth": 100,
    "indentWidth": 2,
    "semiColons": true,
    "singleQuote": false
  },
  "lint": {
    "rules": {
      "tags": ["recommended"],
      "exclude": ["no-explicit-any"]
    }
  }
}
```

#### scripts/build_npm.ts

```typescript
import { build, emptyDir } from "https://deno.land/x/dnt@0.40.0/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./src/index.ts"],
  outDir: "./npm",
  shims: {
    deno: false,
  },
  package: {
    name: "@maplat/tin",
    version: Deno.args[0] || "0.11.0",
    description: "JavaScript library which performs homeomorphic conversion mutually between the coordinate systems of two planes based on the control points.",
    type: "module",
    license: "Maplat Limited License 1.1",
    repository: {
      type: "git",
      url: "git+https://github.com/code4history/MaplatTin.git",
    },
    bugs: {
      url: "https://github.com/code4history/MaplatTin/issues",
    },
    homepage: "https://github.com/code4history/MaplatTin/wiki",
    keywords: [
      "triangulation",
      "warp",
      "GIS",
      "Maplat",
      "MaplatTin"
    ],
  },
  postBuild() {
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
    Deno.copyFileSync("README_ja.md", "npm/README_ja.md");
  },
});
```

### 2.6 改善されたindex.ts（主要部分）

```typescript
// "use strict" を削除
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import centroidFunc from "@turf/centroid";
import convex from "@turf/convex";
import { featureCollection, lineString, point, polygon } from "@turf/helpers";
import lineIntersect from "@turf/line-intersect";
import { Feature, Point, Position } from "geojson";
import findIntersections from "./kinks";
import type { EdgeSet, EdgeSetLegacy } from "@maplat/transform";
import constrainedTin from "./constrained-tin";
import { transformArr } from "@maplat/transform";
import type { Tri, PropertyTriKey } from "@maplat/transform";
import { rotateVerticesTriangle, counterTri } from "@maplat/transform";
import { createPoint, counterPoint, vertexCalc } from "./vertexutils";
import { normalizeEdges } from "@maplat/transform";
import { insertSearchIndex } from "./searchutils";
import type { SearchIndex } from "./searchutils";
import { Transform, Compiled, format_version } from "@maplat/transform";
import type { 
  BiDirectionKey, VertexMode, StrictMode, YaxisMode, PointSet,
  WeightBufferBD
} from "@maplat/transform";
import type { PointsSetBD, VertexDelta, WeightBuffer } from "./types/tin.js";

export interface Options {
  bounds: Position[];
  wh: number[];
  vertexMode: VertexMode;
  strictMode: StrictMode;
  yaxisMode: YaxisMode;
  importance: number;
  priority: number;
  stateFull: boolean;
  points: PointSet[];
  edges: EdgeSet[];
}

export default class Tin extends Transform {
  importance: number;
  priority: number;
  pointsSet: PointsSetBD | undefined;

  constructor(options: Partial<Options> = {} as Options) {
    // ... コンストラクタの実装（変更なし）
  }

  // ... 他のメソッド実装（any型を適切な型に置き換え）
}

// グローバル変数への代入を削除
export { Tin };
```

### 2.7 GitHub Actions CI/CD

#### .github/workflows/ci.yml

```yaml
name: CI

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  test-node:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20, 22]
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - name: Install dependencies
        run: npm ci
      - name: Run lint
        run: npm run lint
      - name: Run type check
        run: npm run typecheck
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build

  test-deno:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Deno
        uses: denoland/setup-deno@v1
        with:
          deno-version: v1.x
      - name: Check formatting
        run: deno fmt --check
      - name: Run linter
        run: deno lint
      - name: Type check
        run: deno check src/**/*.ts
      - name: Run tests
        run: deno task test
      - name: Build npm package
        run: deno task build:npm
```

## 3. 実装手順

1. **型定義の追加**
   - `src/types/tin.d.ts`を作成
   - 既存のany型を段階的に置き換え

2. **ESモジュール対応**
   - `"use strict"`を削除
   - グローバル変数への代入を削除
   - package.jsonの`type: "module"`を設定

3. **ビルド設定の更新**
   - vite.config.tsを簡素化
   - tsconfig.jsonを最適化

4. **Deno対応**
   - deno.jsonを作成
   - NPMビルドスクリプトを追加
   - CI/CDワークフローを更新

5. **テストとドキュメント**
   - 既存のテストが全て通ることを確認
   - README.mdにDeno使用方法を追加

## 4. 移行によるメリット

- **型安全性の向上**: ランタイムエラーの削減、開発体験の向上
- **モダンな構成**: ESモジュールのみのシンプルな構成
- **Deno対応**: より広いエコシステムでの利用が可能
- **保守性の向上**: 明確な型定義により、将来の開発が容易に
- **パフォーマンス**: 不要なビルド形式を削除することで、ビルド時間の短縮

## 5. 注意事項

- 後方互換性: CommonJSサポートを削除するため、メジャーバージョンアップが必要
- 移行期間: 既存ユーザーのために、移行ガイドの作成が推奨される
- テスト: 全ての変更後、包括的なテストの実施が必要