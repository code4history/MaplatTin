# MaplatTin TIN Construction Notes

This note explains how the current `Tin` implementation stitches together the triangulated network, with a focus on two behaviors that are easy to overlook: the synthetic boundary vertices (`b0`–`b3`) and the `weight_buffer` averaging.

## High-Level Update Flow

1. `Tin.updateTin()` calls `validateAndPrepareInputs()` (`src/tin.ts:471`) to confirm every forward GCP lies inside the working bounds. When explicit bounds are not set, it creates a padded rectangle derived from `wh`, expanding the working area by ±5 %.
2. `generatePointsSet()` (`src/tin.ts:303`) converts each GCP into paired GeoJSON points and expands constraint edges. Intermediate edge nodes inherit IDs like `e0`, `e1`, … so they can participate in the triangulation and later weight calculations.
3. Two constrained triangulations are produced with `constrainedTin()`—one for forward coordinates, one for backward (`src/tin.ts:522`). The forward triangulation is always required; the backward side is only rebuilt when strict mode degrades into “loose”.
4. The centroid (`c`) is established by transforming the forward centroid through the forward triangulation (`src/tin.ts:537`), then four synthetic boundary vertices are computed (`calculatePlainVertices()` or `calculateBirdeyeVertices()`).
5. Vertices are added to the point set, indexed TIN helpers are prepared, and `calculatePointsWeight()` derives the weight buffer used during interpolation.

## Boundary Vertex Completion (`calculatePlainVertices`)

The `Tin` needs four extra control points (`b0`–`b3`) so the forward and backward planes share an enclosing quadrilateral.

1. **Collect convex hull samples.** `convexBuf` maps each convex-hull vertex (forward space) to its transformed partner (backward space). The map is built from both the forward and backward convex hulls to ensure coverage even when the transformation is skewed (`src/tin.ts:541`–`566`).
2. **Project rays toward each boundary.** For every convex hull entry, a ray is traced from the centroid to the hull point in both coordinate systems. Ratios (`xRate`, `yRate`) describe how far the forward ray must stretch to reach the padded bounding box edges. Depending on the sign of the forward delta, the projected node is bucketed into one of four edge bins: top (0), right (1), bottom (2), left (3) (`src/tin.ts:700`–`738`).
3. **Approximate scale/rotation per quadrant.** Vectors in each quadrant are compared to their backward counterparts. For every bin the smallest distance ratio (backward/forward) is retained, and the mean angular offset between the spaces is accumulated. The result is `vertexRatio`, a four-element array of `[scale, theta]` pairs; when a quadrant has no usable samples, it falls back to another quadrant’s ratio (`src/tin.ts:742`–`796`).
4. **Place provisional vertices.** Each box corner (`bbox[i]`) is transformed: distance from centroid in forward space is scaled by the quadrant’s ratio to obtain the backward distance, while the angle is rotated by `theta`. Vertices 2 and 3 are swapped to maintain consistent winding (`src/tin.ts:807`–`823`).
5. **Expand to avoid edge collisions.** `checkAndAdjustVertices()` inspects rays from the centroid through every edge node generated earlier. If any ray would intersect the provisional backward boundary segments, the affected vertices are uniformly scaled outward so the ray meets the boundary first (`src/tin.ts:866`–`904`). This prevents constraint edges from leaking outside the transformed extent.

The outcome is a set of four synthetic points that safely enclose all transformed geometry while roughly preserving local rotation and aspect.

## Weight Buffer Averaging (`calculatePointsWeight`)

The `weight_buffer` approximates how each control point stretches between coordinate systems. It powers non-linear interpolation by reweighting barycentric coordinates.

1. **Pick calculation targets.** The function always evaluates the forward triangulation. It also includes the backward triangulation when `strict_status` is `STATUS_LOOSE` (the bidirectional meshes differ) (`src/tin.ts:918`–`924`).
2. **Collect edge ratios.** For every triangle, each undirected edge is visited exactly once. The code stores the ratio of the edge length in the counterpart geometry (Mercator) to the length in forward space. The ratio is recorded twice—once per endpoint—under keys like `"<pointId>:<sortedEdgeId>"` (`src/tin.ts:930`–`962`).
3. **Average per point.** All ratios belonging to a given point are averaged. The result becomes `pointsWeightBuffer[target][pointId]`. In strict mode an inverse value is also written into `pointsWeightBuffer.bakw` so the backward interpolation can mirror the forward weighting (`src/tin.ts:969`–`1006`).
4. **Derive centroid weight.** The centroid `c` does not directly participate in triangle edges, so its weight is the average of the four boundary weights. Again, strict mode writes the reciprocal into the `bakw` table (`src/tin.ts:1008`–`1021`).

Because every edge contributes once, the averaging reflects how much each point stretches relative to its neighbors. High ratios indicate that the backward geometry is “longer” than the sketch between the same anchors, so the algorithm nudges barycentric interpolation toward the counterpart.

## Related Observations

- Strict mode (`MODE_STRICT`) attempts to reuse the forward triangulation for the inverse transform. When edge intersections are detected, the status downgrades to `STATUS_ERROR`, the backward mesh is recomputed, and weight buffers are produced for both directions.
- The asynchronous wrapper `updateTinAsync()` used by the tests simply delegates to `updateTin()` in a `Promise`. There are no real async dependencies in the pipeline, which is why the next iteration intends to simplify it.

These notes should help guide the upcoming cleanup: we can confidently document or refactor the bounding vertices, the weight scaling, and the redundant async surface without changing behavior.
