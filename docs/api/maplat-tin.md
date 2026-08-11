# Tin API signatures

> Release-dependent signatures for `@maplat/tin`.
> The release these signatures track is listed in the release block of the
> [README](../../README.md#quick-start).
> For the conceptual guide (TIN theory, strict/loose modes) see the
> [Wiki API-Reference](https://github.com/code4history/MaplatTin/wiki/API-Reference).

## Constructor options

| Option | Type | Description | Default |
|---|---|---|---|
| `bounds` | `Position[]` | Boundary polygon vertices | — |
| `wh` | `number[]` | Width and height `[w, h]` | — |
| `vertexMode` | `"plain" \| "birdeye"` | Vertex handling mode | `"plain"` |
| `strictMode` | `"strict" \| "auto" \| "loose"` | Topology check mode | `"auto"` |
| `yaxisMode` | `"follow" \| "invert"` | Y-axis direction | `"invert"` |
| `importance` | `number` | Map importance | `0` |
| `priority` | `number` | Map priority | `0` |

Either `bounds` or `wh` must be specified.

## Methods

| Method | Description |
|---|---|
| `setPoints(points)` | Set control points |
| `setEdges(edges)` | Set constrained edges |
| `updateTin()` | Initialize / update TIN network |
| `transform(coords, inverse)` | Execute coordinate transformation |
| `getCompiled()` | Get serializable state |
| `setCompiled(state)` | Restore from serialized state |
| `getFormatVersion()` | Get format version number |

## Constants

**Y-axis mode:**

- `Tin.YAXIS_FOLLOW` — Y-axis follows the coordinate system
- `Tin.YAXIS_INVERT` — Y-axis is inverted

**Status values:**

- `Tin.STATUS_STRICT` — Strict topology (roundtrip transform guaranteed)
- `Tin.STATUS_LOOSE` — Loose topology (roundtrip transform not guaranteed)

**Format version:**

- `format_version` — Current TIN format version

## Utility functions

| Function | Description |
|---|---|
| `constrainedTin(points, edges, z)` | Generate constrained Delaunay triangulation |
| `findIntersections(features)` | Find intersection points in features |
| `insertSearchIndex(tins, centroid, strict)` | Insert search index for TIN |
| `counterPoint(point)` | Calculate counter point |
| `createPoint(xy, mercator, forw)` | Create point feature |
| `vertexCalc(points, edgeNodes, centroid, originPoly, xy, vertexMode)` | Calculate vertex coordinates |

## Error handling

The library may throw errors in the following cases:

- `"TOO LINEAR1"`, `"TOO LINEAR2"` — Control points are too linear
- `"SOME POINTS OUTSIDE"` — Points outside boundary
- Custom error when attempting backward transformation in a disallowed state

## Example

```javascript
// Create a new instance with basic configuration
const tin = new Tin({
  wh: [500, 500], // Width and height of the source plane
  yaxisMode: Tin.YAXIS_FOLLOW, // Y-axis direction handling
});

// Set control points: Array of [source, target] coordinates
tin.setPoints([
  [[100, 100], [200, 200]], // Point 1
  [[200, 200], [400, 400]], // Point 2
  [[150, 150], [320, 350]], // Point 3
  [[200, 100], [420, 220]], // Point 4
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
