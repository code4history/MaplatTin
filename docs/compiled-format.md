# MaplatTin Compiled Data Format Specification

## Overview

The **Compiled** data handled by `getCompiled()` / `setCompiled()` in MaplatTin is a JSON
serialization of the TIN (Triangulated Irregular Network) built from GCPs (Ground Control Points)
and boundary vertices.

There are two format versions:
- **V2** (`version: 2.00703`) — legacy format with exactly 4 boundary vertices
- **V3** (`version: 3`) — current format with variable boundary vertices and improved topology

---

## TypeScript Type Definitions

```typescript
export interface Compiled {
  version?: number;           // 2.00703 = V2, 3 = V3
  wh?: [number, number];     // [width, height] of the source image
  xy?: [number, number];     // origin offset [x, y] (optional)

  points: PointSet[];         // Ground control points
  centroid_point: PointSet;   // Centroid of all GCPs

  vertices_points: PointSet[];            // Boundary vertices
  vertices_params: [number[], number[]];  // Angular parameters for boundary vertices

  tins_points: TriangleIndex[][][]; // TIN triangle indices

  weight_buffer: WeightBufferBD;    // Weight lookup buffer

  strict_status?: StrictStatus;     // Topology validation result
  kinks_points?: Position[];        // Self-intersection points (strict_error only)

  edges: EdgeSet[];            // Constrained edges
  edgeNodes?: PointSet[];      // Intermediate edge nodes

  yaxisMode?: YaxisMode;       // Y-axis direction
  vertexMode?: VertexMode;     // Boundary vertex generation mode
  strictMode?: StrictMode;     // Strictness mode

  bounds?: number[][];         // Explicit boundary polygon (optional)
  boundsPolygon?: Feature<Polygon>; // GeoJSON boundary (optional)
}

// Auxiliary types
type Position      = [number, number];
type PointSet      = [Position, Position];  // [forw coordinate, bakw coordinate]
type TriangleIndex = number | string;       // numeric index, "c", "bN", or "eN"
type StrictStatus  = "strict" | "strict_error" | "loose";
type YaxisMode     = "invert" | "follow";
type VertexMode    = "birdeye" | "plain";
type StrictMode    = "strict" | "auto" | "loose";

// Constrained edge: [forw intermediate points, bakw intermediate points, [startIdx, endIdx]]
type EdgeSet = [Position[], Position[], [number, number]];

type WeightBufferBD = {
  forw?: WeightBuffer;
  bakw?: WeightBuffer;
};
```

---

## Field Reference

### Basic Information

| Field | Type | Description |
|-------|------|-------------|
| `version` | `number` | Format version (2.00703 or 3) |
| `wh` | `[number, number]` | Image `[width, height]` in pixels. Present when `setWh()` or `setBounds()` was called |
| `xy` | `[number, number]` | Bounding box origin `[x, y]`. Present only when `setBounds()` was called (submaps with explicit boundary polygon). Omitted for regular rectangular images |

Presence of `wh` and `xy` depends on initialization method, not V2 vs V3:

| Initialization | `wh` | `xy` |
|---------------|:----:|:----:|
| `setWh(w, h)` — rectangular image | ✓ | — |
| `setBounds(polygon)` — submap / explicit boundary | ✓ | ✓ |

---

### Ground Control Points

#### `points: PointSet[]`

Array of all GCPs. Each element is `[[forwX, forwY], [bakwX, bakwY]]`.

- `forw` = image (pixel) coordinate
- `bakw` = map (Mercator) coordinate

```json
"points": [
  [[1200.5, 830.2], [15120456.3, 4123890.1]],
  [[2048.0, 1500.0], [15121234.5, 4122567.8]],
  ...
]
```

---

#### `centroid_point: PointSet`

Centroid point. Serialized format `[[forwX, forwY], [bakwX, bakwY]]` is identical across V2 and V3,
but the **computation differs in V3 plain mode**:

| Mode | Computation |
|------|-------------|
| V2 / V3 `birdeye` | turf centroid coordinate transformed through forw TIN |
| V3 `plain` | Find the TIN triangle containing the turf centroid; use the **geometric mean** of its 3 vertices (fallback to V2 method if no containing triangle found) |

V3 plain's approach guarantees the centroid always lies inside an actual triangle.

---

### Boundary Vertices

#### `vertices_points: PointSet[]`

Array of boundary vertices that form the outer hull of the TIN. These correspond to `"b0"`, `"b1"`, ..., `"b(N-1)"` in the triangle index notation.

| Version | Count |
|---------|-------|
| V2 (any mode) | Always **4 points** |
| V3 (any mode) | **Up to 36 points** (4 corners + edge vertices from 10° angular bins) |

V3 uses `withEdgeVertices=true` for both `plain` and `birdeye` modes. The difference between the
two modes is how the 4 corners are computed (single aggregate ratio vs per-quadrant ratios) — the
edge vertex pass is identical. For well-formed TINs all 32 non-corner bins produce a vertex,
yielding **36 points in practice**.

```json
"vertices_points": [
  [[-706.6, -817.65], [15118175.26, 4124361.15]],
  [[-706.6, 17170.65], [15118789.17, 4118425.45]],
  [[18256.3, 17170.65], [15126543.21, 4118123.45]],
  [[18256.3, -817.65], [15126289.54, 4124012.33]]
]
```

---

#### `vertices_params: [number[], number[]]`

Angular parameters (radians) for each boundary vertex.

- `vertices_params[0]` = angle of each boundary vertex as seen from centroid in **forw** space
- `vertices_params[1]` = angle of each boundary vertex as seen from centroid in **bakw** space

Length equals `vertices_points.length`.

```json
"vertices_params": [
  [-2.977, -2.624, ..., 2.686, 2.877],
  [-0.161, -0.541, ..., 0.505, 0.300]
]
```

---

### TIN Triangles

#### `tins_points: TriangleIndex[][][]`

Three-dimensional array of triangle vertex indices.

**Structure**: `tins_points[dir][triIndex][vertexIndex]`

| Dimension | Meaning |
|-----------|---------|
| `dir = 0` | TIN for forw→bakw transformation (always present) |
| `dir = 1` | TIN for bakw→forw transformation (only when `strict_status === "loose"`) |

Each triangle is an array of **3 vertex indices**.

##### Vertex Index Notation

| Value | Meaning |
|-------|---------|
| Integer `0` to `N-1` | Index into `points` array (GCP or edge node) |
| `"c"` | Centroid point (`centroid_point`) |
| `"bN"` | Boundary vertex N (`vertices_points[N]`) |
| `"eN"` | Edge node N (`edgeNodes[N]`) |

```json
"tins_points": [
  [
    [197, 410, 406],
    [410, 408, 406],
    ["b2", 197, "c"],
    ["b0", "b1", "c"],
    ...
  ]
]
```

> **Note**: `tins_points[1]` exists only when `strict_status === "loose"` and is used for
> bakw→forw transformation. When `strict_status === "strict"`, only `tins_points[0]` is
> used for both directions.

---

### Weight Buffer

#### `weight_buffer: WeightBufferBD`

Auxiliary data for weighted interpolation. Internal structure is managed by `@maplat/transform`.

- `weight_buffer.forw` = forward stretch ratios (Mercator edge length ÷ image edge length)
- `weight_buffer.bakw` = reciprocal weights for inverse transformation (`1 / forw`)

Whether `bakw` is present depends on `strict_status`, not V2 vs V3:

```typescript
const includeReciprocals = this.strict_status === Tin.STATUS_STRICT;
```

| `strict_status` | `weight_buffer.forw` | `weight_buffer.bakw` |
|----------------|:--------------------:|:--------------------:|
| `"strict"` | ✓ | ✓ |
| `"strict_error"` / `"loose"` | ✓ | — |

---

### Topology Validation

#### `strict_status: StrictStatus`

Result of the self-intersection check on the bakw TIN.

| Value | Meaning |
|-------|---------|
| `"strict"` | No self-intersections. Single TIN handles both directions |
| `"strict_error"` | Self-intersections detected; coordinates recorded in `kinks_points` |
| `"loose"` | bakw TIN has issues; `tins_points[1]` is used for bakw→forw |

#### `kinks_points?: Position[]`

Present only when `strict_status === "strict_error"`. List of **bakw TIN** self-intersection coordinates (in bakw/Mercator space).

Internally, kinks are detected and stored for **both forw and bakw** directions
(`this.kinks = { forw: ..., bakw: ... }`), but only bakw kinks are serialized to the compiled format.

> **Naming inconsistency**: In `scripts/dev-server.ts`, the API uses
> `kinks_points` = **forw** kinks and `kinks_bakw` = **bakw** kinks — the opposite of
> the compiled format where `kinks_points` means **bakw** kinks.

---

### Constrained Edges

#### `edges: EdgeSet[]`

List of constrained edges (fixed edges in the Constrained Delaunay Triangulation).

Each element format:

```
[
  [[forwX0, forwY0], [forwX1, forwY1], ...],  // forw intermediate points
  [[bakwX0, bakwY0], [bakwX1, bakwY1], ...],  // bakw intermediate points
  [startIndex, endIndex]                       // start/end indices into points[]
]
```

- `startIndex` / `endIndex` are indices into the `points` array
- Intermediate points are stored in `edgeNodes` and referenced via `"eN"` in `tins_points`

#### `edgeNodes?: PointSet[]`

Intermediate points of constrained edges. Correspond to `"eN"` indices in `tins_points`.
Each element is `[[forwX, forwY], [bakwX, bakwY]]`.

---

### Operation Modes

| Field | Type | Description |
|-------|------|-------------|
| `yaxisMode` | `"invert" \| "follow"` | `"invert"`: flip Y axis upward (image coordinate system); `"follow"`: use Y as-is |
| `vertexMode` | `"birdeye" \| "plain"` | **Corner ratio computation method** for boundary vertices. Available in both V2 and V3. `"birdeye"`: per-quadrant ratios (suited for perspective/aerial maps); `"plain"`: aggregate ratio from all GCPs (suited for flat maps). In V3, both modes run the full 36-bin angular pass for up to 36 vertices |
| `strictMode` | `"strict" \| "auto" \| "loose"` | `"strict"`: enforce strict topology; `"auto"`: auto-detect; `"loose"`: relaxed mode |

---

## Key Differences: V2 vs V3

| Aspect | V2 | V3 |
|--------|----|----|
| `version` | `2.00703` | `3` |
| `vertices_points` count | Always 4 | Up to 36 regardless of mode (36 in practice) |
| `vertices_params` element count | 4 | Same as `vertices_points.length` |
| `centroid_point` computation | turf centroid → TIN transform | `plain`: geometric mean of containing triangle |
| `wh` / `xy` presence | Depends on `setWh()`/`setBounds()` (same rule as V3) | Same |
| `weight_buffer.bakw` presence | When `strict_status === "strict"` (same rule as V3) | Same |
| Boundary vertex algorithm | Fixed 4 corners (image rectangle) | `plain`: angular bins from GCP distribution |
| `strict_status` tendency | Prone to `"strict_error"` (only 4 corners) | `plain` achieves `"strict"` more readily |

> **Note**: `wh`/`xy` presence and `weight_buffer.bakw` presence are NOT differences between
> V2 and V3 — they depend on `setBounds()` usage and `strict_status` respectively.

---

## Sample Statistics (naramachi_yasui_revised)

| Metric | V2 | V3 |
|--------|----|----|
| `version` | `2.00703` | `3` |
| `points.length` | 972 | 972 |
| `vertices_points.length` | 4 | 36 |
| `tins_points[0].length` (triangle count) | 3898 | 3898 |
| `edges.length` | 818 | 818 |
| `edgeNodes.length` | 976 | 976 |
| `strict_status` | `"strict_error"` | `"strict"` |
| `kinks_points` present | Yes | No |

---

## File Layout (Tests & Demo)

```
tests/
  maps/
    <map_name>.json              ← Source map data (GCPs + edges input)
  compiled/
    <map_name>_v2.json           ← V2 compiled data
    <map_name>_v3.json           ← V3 compiled data
    <map_name>.json              ← Spec test copy (usually same as V3)
  cases/
    <map_name>_v2.json           ← V2 transform test cases (100 points)
    <map_name>_v3.json           ← V3 transform test cases (100 points)
```

Generation scripts:
- `scripts/generate-compiled.ts` → regenerates `tests/compiled/`
- `scripts/generate-cases.ts` → regenerates `tests/cases/`

---

## Related Source Files

| File | Role |
|------|------|
| `src/tin.ts` | `getCompiled()` / `setCompiled()` implementation |
| `src/transform-v3.ts` | V3 format restore logic (`restoreV3State()`). By design, "transform from compiled data" belongs in `@maplat/transform`, but was placed here temporarily for V3 development efficiency. This file represents the migration boundary: when V3 development is complete, its contents will move to `@maplat/transform` |
| `@maplat/transform` | `Compiled` type definition and weight buffer handling |
