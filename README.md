# Maplat Tin

A JavaScript library that defines and executes homeomorphic conversion between two plane coordinate systems based on control points.  
This is part of the [Maplat](https://github.com/code4history/Maplat/) project.

日本語のREADMEは[こちら](./README.ja.md)

## Key Features

- **Generate Transformation Definitions:** Create coordinate transformation definitions based on control points and edge constraints
- **Bidirectional Coordinate Transformation:** Convert coordinates between two planes in both directions
- **Topology Preservation:** Maintains homeomorphic properties during transformation
- **Flexible Configuration:** 
  - Vertex handling modes (normal/bird's-eye view)
  - Topology check modes (strict/auto/loose)
  - Y-axis direction control
- **Edge Constraints:** Ability to specify constrained edges for more accurate transformation
- **State Management:** Save and restore transformation definitions

## Installation

### npm

```sh
# Install the main package
npm install @maplat/tin

# Install required dependency
npm install delaunator
```

### Browser

```html
<!-- Required dependency -->
<script src="https://unpkg.com/delaunator/delaunator.min.js"></script>

<!-- Maplat Tin -->
<script src="https://unpkg.com/@maplat/tin/dist/maplat_tin.umd.js"></script>
```

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

| **Option** | **Type**                      | **Description**                   | **Default** |
| ------------- | --------------------------- | ------------------------- | ------------- |
| `bounds`      | `Position[]`                | **Boundary polygon vertices**        | `-`           |
| `wh`          | `number[]`                  | **Width and height [w, h]**        | `-`           |
| `vertexMode`  | `"plain"｜"birdeye"`        | **Vertex handling mode**          | `"plain"`     |
| `strictMode`  | `"strict"｜"auto"｜"loose"` | **Topology check mode** | `"auto"`      |
| `yaxisMode`   | `"follow"｜"invert"`        | **Y-axis direction**              | `"invert"`    |
| `importance`  | `number`                    | **Map importance**           | `0`           |
| `priority`    | `number`                    | **Map priority**           | `0`           |

Either `bounds` or `wh` must be specified.

### Methods

| **Method**                  | **Description**                          |
| ---------------------------- | --------------------------------- |
| `setPoints(points)`          | **Set control points**                   |
| `setEdges(edges)`            | **Set constrained edges**            |
| `updateTin()`                | **Initialize/update TIN network**    |
| `transform(coords, inverse)` | **Execute coordinate transformation**                 |
| `getCompiled()`              | **Get serializable state**     |
| `setCompiled(state)`         | **Restore from serialized state** |

### Error Handling

The library may throw errors in the following cases:

- `"TOO LINEAR1"`,`"TOO LINEAR2"`: Control points are too linear
- `"SOME POINTS OUTSIDE"`: Points outside boundary
- Custom error when attempting backward transformation in a disallowed state

## License

Maplat Limited License 1.1

Copyright (c) 2024 Code for History

## Developers

- Kohei Otsuka
- Code for History

We welcome your contributions! Feel free to submit [issues and pull requests](https://github.com/code4history/MaplatTin/issues).