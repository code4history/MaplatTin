## Context
`@maplat/tin` is the authoring-side package for TIN generation. It currently produces a single compiled JSON shape that bundles together everything needed for editing and runtime: GCP coordinates, edge metadata, edge nodes, centroid, vertices, and triangle indices.

V3 requires a cleaner separation:
- editors need rich metadata and enough information to rebuild and re-edit a map;
- runtimes need only the data required to transform coordinates and viewpoints;
- both packages must agree on which fields are canonical.

For V3.1 development, `@maplat/tin` must also act as the first evaluation host because it is the only package that can both generate candidate payloads and compare their conversion behavior against older formats using the same source datasets.

The first major capability in that flow is CRS estimation from GCPs. In V3.1, a map may start in an unresolved state where GCPs are known but the map CRS plus world-file parameters are not yet fixed.

## Goals / Non-Goals
- Goals:
  - Keep the triangulation index model stable while allowing richer point metadata.
  - Separate editing payloads from lightweight runtime payloads.
  - Preserve backward compatibility for existing V2/V3 compiled JSON during migration.
  - Support V3.1 format development by evaluating generated payloads directly in `@maplat/tin`.
  - Allow CRS and world-file parameters to be estimated explicitly from GCPs before the runtime triangulation is finalized.
- Non-Goals:
  - Choose and implement a binary container immediately.
  - Move CRS orchestration into `@maplat/tin`.
  - Redesign the triangulation algorithms themselves.

## Decisions
- Decision: Keep coordinate pairs and triangle indices as the canonical geometry core.
  - Rationale: the existing `points`, `tins_points`, `vertices_points`, and centroid model is already shared with `@maplat/transform`.
- Decision: during V3.1 development, `@maplat/tin` SHALL temporarily own single-coordinate evaluation for the new CRS-aware payloads.
  - Rationale: generation and evaluation must be tested together before the payload contract can be frozen.
- Decision: V3.1 SHALL allow an unresolved map-coordinate state where GCPs are stored but triangulation is deferred until the map CRS and world-file parameters are fixed.
  - Rationale: CRS estimation requires comparing candidate projected spaces before the map-coordinate system can be finalized.
- Decision: when the caller omits CRS metadata for input map coordinates in V3.1, those input coordinates SHALL be interpreted as `EPSG:4326`.
  - Rationale: CRS estimation needs a stable geographic baseline, and `4326` is the canonical interchange space.
- Decision: `crs: true` SHALL mean "use the map's already-decided CRS" and SHALL fail if that CRS is not yet fixed.
  - Rationale: it gives editors a concise way to reuse a known map CRS without duplicating CRS metadata.
- Decision: CRS selection and world-file fitting SHALL be split into stages.
  - Rationale: CRS comparison is more stable when candidate scoring uses only isotropic scale, rotation, and translation; shear can then be fitted afterward once the CRS has been fixed.
- Decision: shear SHALL be supported, but only after CRS has been chosen or specified.
  - Rationale: known-CRS workflows benefit from shear, while including shear during CRS search increases the chance of false positives and raises implementation cost.
- Decision: estimator candidate scores and residual diagnostics SHALL be treated as debug-only data, enabled by an explicit debug flag.
  - Rationale: these diagnostics are useful for development and evaluation, but they are not required for normal map authoring or runtime operation.
- Decision: CRS estimation SHALL be exposed through an explicit top-level method and decomposed into smaller helper methods.
  - Rationale: explicit entry points preserve the "no implicit recomputation" rule, while helper decomposition makes unit testing and reuse practical.
- Decision: once map CRS and world-file parameters are fixed, the package SHALL support both TIN-enabled and TIN-disabled modes for GCPs.
  - Rationale: some workflows use GCPs only to determine CRS placement, while others also use them for local warping.
- Decision: Attach optional GCP metadata alongside, not inside, the coordinate tuples.
  - Rationale: metadata should not disturb the existing point-array indexing model used by triangles, edges, and tests.
- Decision: Define two payload classes.
  - Editing payload: preserves GCPs, edge definitions, edge nodes, and authoring metadata.
  - Distribution payload: preserves only the fields required for runtime transformation and viewpoint transfer.
- Decision: Canonicalize JSON first and defer binary packaging.
  - Rationale: runtime/editor boundaries can be stabilized without blocking on a `protobuf` vs `DuckDB` decision.
- Decision: once V3.1 is fixed, the single-coordinate evaluation runtime SHALL migrate into `@maplat/transform`.
  - Rationale: long-term runtime ownership still belongs in the transformation package rather than the authoring package.

## Risks / Trade-offs
- Parallel metadata arrays can drift out of sync with point indexes.
  - Mitigation: require one-to-one alignment and validate lengths during serialization.
- A runtime-only payload may be mistaken for an editable payload.
- A runtime-only payload may be mistaken for an editable payload.
  - Mitigation: include an explicit payload kind/version marker and document that distribution payloads are not re-editable.
- Temporary runtime ownership in `@maplat/tin` may become permanent by inertia.
  - Mitigation: define an explicit migration checkpoint tied to V3.1 format acceptance.
- Deferring binary packaging may feel incomplete.
  - Mitigation: treat canonical JSON as the normative format and binary packaging as a later transport optimization.

## Migration Plan
1. Implement V3.1 payload input semantics, including unresolved CRS/world-file state and explicit CRS estimation in `@maplat/tin`.
2. Implement candidate CRS estimation from GCPs and compare V2, V3, and V3.1 behavior end-to-end using shared demos and fixtures.
3. Freeze the V3.1 payload contract.
4. Add the runtime/distribution payload spec and conversion rules from editing payload to distribution payload.
5. Migrate single-coordinate evaluation into `@maplat/transform`.
6. Update fixtures and docs to include the stabilized payload classes.
7. Evaluate binary transport only after JSON schema and package boundaries stabilize.

## Open Questions
- Should point metadata live in `point_meta`, `gcp_meta`, or another name aligned with Maplat editor terminology?
- Should distribution payloads remain loadable through the same `setCompiled` entry point, or through a distinct runtime loader?
- Which optional edit-only fields, if any, should remain in the distribution payload for debugging?
