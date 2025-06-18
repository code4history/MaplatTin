# MaplatTin リポジトリへの変更提案

このドキュメントは、MaplatEdgeRulerとの一貫性を保つために、MaplatTinリポジトリで検討すべき変更点をまとめたものです。

## 1. package.jsonの依存関係

### @maplat/edgerulerのバージョン更新
- 現在: `"@maplat/edgeruler": "^0.1.1"`
- 最新: `"@maplat/edgeruler": "^0.1.2"`
- npm installで自動的に更新されるはずですが、明示的な更新を推奨

## 2. Vite設定の拡張

MaplatEdgeRulerとMaplatTransformでは、package.jsonのバージョンをdefineで定義しています：

```typescript
import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default defineConfig({
  // ... existing config ...
  define: {
    'import.meta.env.APP_VERSION': JSON.stringify(packageJson.version)
  }
});
```

この機能を追加することで、ビルド時にバージョン情報を埋め込むことができます。

## 3. README.mdの構造統一

### インストールセクション
MaplatEdgeRulerのREADMEでは、JSR (JavaScript Registry) のインストール方法を追加しました：

```markdown
### JSR (JavaScript Registry)

```sh
# For Deno
deno add @maplat/tin

# For npm/Node.js
npx jsr add @maplat/tin
```
```

## 4. deno.jsonのfmt設定

lineWidthが100に設定されていますが、他のプロジェクトは80を使用しています。統一を検討してください：

```json
"fmt": {
  "lineWidth": 80,  // 100から80に変更
  // ... other settings ...
}
```

## 5. import_map.jsonの確認

deno.jsonで `"importMap": "./import_map.json"` を参照していますが、このファイルの内容と整合性を確認してください。MaplatEdgeRulerでは、deno.jsonに直接importsを記載する方法と、別ファイルのimport_map.jsonの両方を提供しています。

## 6. prepublishOnlyスクリプト

MaplatTinのprepublishOnlyスクリプトは非常に包括的です：
```json
"prepublishOnly": "npm run lint && npm run typecheck && npm run test && npm run build"
```

これは良いプラクティスですが、他のプロジェクトでも同様の厳密なチェックを採用することを検討してください。