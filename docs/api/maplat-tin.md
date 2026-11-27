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

## Properties

| Property | Type | Description |
|---|---|---|
| `boundaryDiagnostics` | `BoundaryDiagnostics \| undefined` | Read-only diagnostics from the last V3 build for the current mesh. See [V3 boundary diagnostics](../../README.md#v3-boundary-diagnostics). |

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

## Incremental updates (MaplatTin #100; off by default)

Entry points for replacing only the part of the mesh an edit affects. There are three switches, all `false` by
default (nothing changes unless you turn one on).

| Constructor option | Type | Default | Description |
| --- | --- | --- | --- |
| `incremental` | `boolean` | `false` | Imports the adopted mesh after `updateTin()`; `applyEdits()` applies interior edits locally |
| `incrementalBand` | `boolean` | `false` | `applyEdits()` also applies edits that touch the band (auxiliary vertices and centroid) locally. Also required by `refreshBand()` |
| `incrementalRebuild` | `boolean` | `false` | Replaces the rebuild loops inside `updateTin()` with local band replacements |

| Method / property | Description |
| --- | --- |
| `applyEdits(edits: TinEdit[], baseRevision?: number): TinPatch` | Applies edits. Returns `mode: "local"` with the differences, or rebuilds everything and returns `mode: "full"` with `fallbackReason`. If `baseRevision` differs from the current `revision`, changes nothing and returns `"revisionMismatch"`. Throws, changing nothing, on edits that cannot be applied |
| `revision: number` | Revision of `applyEdits()`. Reset to 0 by `setPoints()`, `setEdges()` and `setCompiled()` |
| `incrementalMesh: MeshModel \| undefined` | The incremental mesh; `undefined` when the switch is off or the mesh cannot be imported (loose, V2) |
| `incrementalFailure` | Why the mesh could not be imported (`"v2"`, `"loose"`, `"orientation"`, `"inconsistent"`) |
| `refreshBand(): TinPatch \| undefined` | Rebuilds the band from the current interior points (call it just before saving). Returns `undefined`, changing nothing, if it cannot |
| `collectIncrementalEvidence(rebuild?): IncrementalEvidence` | Gathers the evidence that the incremental mesh may be saved as-is, without changing it. When `eligible`, `compiled` holds the data to save (with `meshOrigin: "incremental"`). It recounts the whole mesh, so call it only when saving |
| `restoreMesh(compiled, inputs?): { ok: true } \| { ok: false; reason }` | Restores the triangulation and the mesh from saved compiled data without triangulating. Pass `inputs` (GCPs and edges in the `setPoints()` coordinate system) to also check them against the compiled data. On failure it returns a reason (the state is that of `setCompiled()`, with no mesh) |
| `meshOrigin: "incremental" \| undefined` | Whether the current triangulation comes from data saved from an incremental mesh. Cleared by `updateTin()` |
| `rebuildDiagnostics` | Breakdown of the attempts of an `updateTin()` with `incrementalRebuild` (full builds, band replacements, whether it fell back to the current procedure) |

`TinEdit` is one of `{ type: "addPoint", id, forw, bakw, position? }`, `{ type: "removePoint", id }`,
`{ type: "movePoint", id, forw?, bakw? }`, `{ type: "addEdge", id, start, end, forwNodes, bakwNodes, position? }`,
`{ type: "removeEdge", id }`, `{ type: "replaceEdgeNodes", id, forwNodes, bakwNodes }`. Coordinates use the
`setPoints()` system. GCP and edge ids are the array indices at first; the caller assigns unused ids to additions.

`TinPatch` has `revision`, `mode`, `fallbackReason?`, `strict_status`, `boundaryStale`, and, for local updates, the
differences (`movedVertices`, `addedVertices`, `removedVertices`, `addedTriangles`, `removedTriangles`,
`badTriangles`, `dirtyBounds`; `centroid` and `verticesParams` when the band was replaced; `supplementPairs` when
the list changed). Patch coordinates use the internal system of compiled data. Vertices are addressed by kind and
id (`VertexRef`).

## Constants

**Y-axis mode:**

- `Tin.YAXIS_FOLLOW` — Y-axis follows the coordinate system
- `Tin.YAXIS_INVERT` — Y-axis is inverted

**Status values:**

- `Tin.STATUS_STRICT` — Strict topology (roundtrip transform guaranteed)
- `Tin.STATUS_LOOSE` — Loose topology (roundtrip transform not guaranteed)

**Format version:**

- `format_version` — Current TIN format version (2.00704; the V2 version Tin writes)

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
