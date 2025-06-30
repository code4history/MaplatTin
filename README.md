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


## Development Setup

This project supports using local dependencies for development. We recommend using `yalc` for managing local package dependencies.

### Using yalc for Local Development

1. **Install yalc globally:**
   ```sh
   npm install -g yalc
   ```

2. **Publish local dependencies:**
   ```sh
   # In the MaplatTransform directory
   cd ../MaplatTransform
   yalc publish
   
   # In the MaplatEdgeBound directory
   cd ../MaplatEdgeBound
   yalc publish
   ```

3. **Link local dependencies in this project:**
   ```sh
   # In the MaplatTin directory
   yalc add @maplat/transform @maplat/edgebound
   ```

4. **Update local dependencies when changed:**
   ```sh
   # In the dependency directory (e.g., MaplatTransform)
   yalc publish --push
   ```

5. **Remove local dependencies (to use npm packages):**
   ```sh
   # In the MaplatTin directory
   yalc remove @maplat/transform @maplat/edgebound
   npm install
   ```

**Note:** The `.yalc` directory and `yalc.lock` file are ignored by git and will not be committed.

### Browser

When using in the browser, you need to include the peer dependencies:

```html
<!-- Required dependencies -->
<script src="https://unpkg.com/delaunator@5.0.0/delaunator.min.js"></script>
<script src="https://unpkg.com/@turf/helpers@7.2.0/dist/turf-helpers.min.js"></script>
<script src="https://unpkg.com/@turf/boolean-point-in-polygon@7.2.0/dist/turf-boolean-point-in-polygon.min.js"></script>
<script src="https://unpkg.com/@turf/centroid@7.2.0/dist/turf-centroid.min.js"></script>
<script src="https://unpkg.com/@turf/convex@7.2.0/dist/turf-convex.min.js"></script>
<script src="https://unpkg.com/@turf/line-intersect@7.2.0/dist/turf-line-intersect.min.js"></script>

<!-- Maplat Tin (UMD) -->
<script src="https://unpkg.com/@maplat/tin/dist/tin.umd.js"></script>
<script>
// Use the library
const tin = new tin.default({
    wh: [500, 500]
});
</script>
```

Or using ES modules:

```html
<!-- Maplat Tin (ESM) -->
<script type="module">
import Tin from "https://unpkg.com/@maplat/tin/dist/index.js";
// Use the library
const tin = new Tin({
    wh: [500, 500]
});
</script>
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