# Design: Tin Documentation And Runtime Cleanup

## Context
- `Tin.updateTin()` remains a synchronous pipeline that constructs constrained triangulations, synthesizes the boundary vertices (`b0`–`b3`), and populates `pointsWeightBuffer`.
- Consumers in this repository (`spec/*.js`, `public/index.html`) call `updateTinAsync()`, which resolves a Promise once `updateTin()` completes. The call sites currently chain `.then()`/`.catch()` handlers.
- Helper logic for boundary vertices (`calculatePlainVertices`, `calculateBirdeyeVertices`, `checkAndAdjustVertices`) and weight averaging (`calculatePointsWeight`) sits inline in `src/tin.ts`, making the file long and difficult to navigate.

## Decisions
1. **Documentation coverage**
   - Keep the freshly added `docs/tin-internals.md` and `.ja.md` as the canonical explanation of boundary vertex synthesis and weight buffering.
   - Ensure future refactors update these docs when behavior changes.

2. **Async surface cleanup**
   - Provide an explicit `async updateTinAsync(): Promise<void>` implementation on `Tin` that simply calls `this.updateTin()` inside `async`/`await` semantics. This keeps backward compatibility while avoiding manual Promise construction.
   - Audit other asynchronous helpers exposed via `Transform` (e.g., `setCompiledAsync` if present) and mirror the same approach: prefer `async`/`await` wrappers or expose synchronous entry points directly.
   - Migrate in-repo consumers (`spec/node_test.js`, `spec/tin_node.spec.js`, `public/index.html`) from `.then()` chains to `await`/`try...catch` to improve readability.

3. **Module structure**
   - Extract boundary vertex calculations into `src/boundary-vertices.ts` providing a pure function such as `computeBoundaryVertices(args)` plus the edge-expansion helper currently embedded within `Tin`.
   - Move weight-buffer averaging into `src/weight-buffer.ts`, exporting a helper that accepts the triangulations and returns the `WeightBufferBD` map.
   - Keep `Tin` responsible for orchestration: it should orchestrate helper calls but no longer contain geometric math inline.

4. **JSDoc coverage**
   - Add JSDoc to the public methods (`setPoints`, `setEdges`, `updateTin`, and the new async helper) describing assumptions about strict mode, vertex mode, and bounds.
   - Annotate the new helper modules with usage notes so contributors understand required inputs (e.g., pre-normalized triangulation features, centroid data structures).

## Open Questions
- `@maplat/transform` may already ship async helpers on `Transform`. During implementation we must confirm whether overriding them in `Tin` is safe across the bundle formats; if not, we will document the chosen compatibility approach in the follow-up change.
- Splitting helper modules will require reviewing build outputs (CJS/UMD) to confirm external exports remain unchanged; any necessary re-exports should be documented before merging.
