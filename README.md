# Maplat Tin library

JavaScript library which performs homeomorphic conversion mutually between the coordinate systems of two planes based on the control points.  
This is part of [Maplat](https://github.com/code4history/Maplat/) project.

2つの平面座標系間で制御点に基づく同相変換を実現するJavaScriptライブラリです。  
[Maplat](https://github.com/code4history/Maplat/)プロジェクトの一部として開発されています。

## Installation

### npm

```sh
# Install the main package
npm install @maplat/tin

# Install required peer dependencies
npm install delaunator
```

### Browser

Before loading Maplat Tin, you need to include its dependencies in the following order:

```html
<!-- Required dependencies -->
<script src="https://unpkg.com/delaunator/delaunator.min.js"></script>

<!-- Then load Maplat Tin -->
<script src="https://unpkg.com/@maplat/tin/dist/maplat_tin.umd.js"></script>
```

## Key Features

- **Bidirectional Coordinate Transformation:** Convert coordinates between two planes in both directions
- **Topology Preservation:** Maintains homeomorphic properties during transformation
- **Flexible Configuration:** Supports various modes for vertex handling and strict checks
- **Edge Constraints:** Ability to specify constrained edges for better control
- **State Management:** Save and restore transformation states

## 主な機能

- **双方向座標変換：**2つの平面間で双方向の座標変換が可能
- **位相保存：**変換時の同相性を維持
- **柔軟な設定：**頂点処理や厳密性チェックの各種モードをサポート
- **エッジ制約：**制約付きエッジの指定が可能
- **状態管理：**変換状態の保存と復元をサポート

## Basic Usage

```javascript
// Create a new instance with basic configuration
const tin = new Tin({
    wh: [500, 500],          // Width and height of the source plane
    yaxisMode: Tin.YAXIS_FOLLOW  // Y-axis direction handling
});

// Set control points: Array of [source, target] coordinates
tin.setPoints([
    [[100,100], [200, 200]], // Point 1
    [[200,200], [400, 400]], // Point 2
    [[150,150], [320, 350]], // Point 3
    [[200,100], [420, 220]]  // Point 4
]);

// Initialize the TIN network
tin.updateTin();

// Check topology status
if (tin.strict_status === Tin.STATUS_STRICT) {
    console.log('Topology OK: Roundtrip transform is guaranteed');
} else if (tin.strict_status === Tin.STATUS_LOOSE) {
    console.log('Topology warning: Roundtrip transform is not guaranteed');
}

// Forward transform: source to target
const transformed = tin.transform([160, 160], false);

// Backward transform: target to source
const restored = tin.transform(transformed, true);
```

## Configuration

### Constructor Options

|  **Option**  |          **Type**           |         **Description**         | **Default**  |
| ------------ | --------------------------- | ------------------------------- | ------------ |
|   `bounds`   |        `Position[]`         |  **Boundary polygon vertices**  |     `-`      |
|     `wh`     |         `number[]`          |   **Width and height [w, h]**   |     `-`      |
| `vertexMode` |    `"plain"｜"birdeye"`     |    **Vertex handling mode**     |  `"plain"`   |
| `strictMode` | `"strict"｜"auto"｜"loose"` |     **Topology check mode**     |   `"auto"`   |
| `yaxisMode`  |    `"follow"｜"invert"`     |      **Y-axis direction**       |  `"invert"`  |
| `importance` |           `number`          |        **Map importance**       |      `0`     |
|  `priority`  |           `number`          |         **Map priority**        |      `0`     |

Either `bounds` or `wh` must be specified.

### Methods

| **Method**                   | **Description**                      |
| ---------------------------- | ------------------------------------ |
| `setPoints(points)`          | **Set control points**               |
| `setEdges(edges)`            | **Set constrained edges**            |
| `updateTin()`                | **Initialize or update TIN network** |
| `transform(coords, inverse)` | **Transform coordinates**            |
| `getCompiled()`              | **Get serializable state**           |
| `setCompiled(state)`         | **Restore from serialized state**    |

## State Management

The library supports saving and restoring transformation states:

```javascript
// Save current state
const compiledState = tin.getCompiled();

// Create new instance and restore state
const tin2 = new Tin();
tin2.setCompiled(compiledState);
// Ready to transform without updateTin()
```

## Error Handling

The library may throw following errors:

- `"TOO LINEAR1"`, `"TOO LINEAR2"`: Control points are too linear
- `"SOME POINTS OUTSIDE"`: Points outside boundary
- Custom error when backward transform is not allowed

## Contributing

Contributions are welcome! Please check our [GitHub repository(https://github.com/code4history/MaplatTin) for issues and pull requests.

## License

Maplat Limited License 1.1

## Support

Need help? Join our community:

- Open Collective: [@maplat](https://opencollective.com/maplat)
- GitHub Issues: [MaplatTin Issues](https://github.com/code4history/MaplatTin/issues)
