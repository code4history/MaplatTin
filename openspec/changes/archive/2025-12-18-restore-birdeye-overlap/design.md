# Design: Restoring Birdseye Scaling And Strict Overlap Repair

## Context
- `boundary-vertices.ts` currently offers `calculatePlainVertices` and `calculateBirdeyeVertices`, but both call the same logic. The 0.9.4 implementation computed quadrant-specific scaling/rotation factors from convex hull samples and only fell back to shared values when data was sparse.
- `Tin.calcurateStrictTin()` today mirrors only the detection half of the old `calcurateStrictTinAsync`, leaving out the intersection-based healing (`overlapCheckAsync`, edge splitting, and search index maintenance).
- The refactored codebase separates helpers into dedicated modules and expects synchronous APIs; any port must respect that structure.

## Approach
1. **Birdseye computation**
   - Recreate the 0.9.4 sequence inside `calculateBirdeyeVertices`: gather convex hull deltas, bucket them per orthant, derive scale/rotation averages, and provide the four-corner fallback when data is missing.
   - Maintain the new helper interface by encapsulating birdseye-only calculations in local utilities to avoid regressing the readability gains.

2. **Strict overlap repair**
   - Factor the legacy workflow into pure helper functions (e.g., `buildSearchIndex`, `resolveOverlap`, `splitTriangles`) that operate on the modern TypeScript types.
   - Extend `calcurateStrictTin()` with these helpers so it still sets `strict_status` appropriately while attempting remediation before giving up.
   - Keep the logic synchronous; prior Promise chains become sequential loops or helper calls.

3. **Documentation and tests**
   - Update the internals docs with sections describing the birdseye-specific factors and the strict overlap healing pipeline.
   - Add regression tests (possibly by replaying archived datasets) that confirm birdeye mode diverges from plain mode and that strict mode repairs overlaps instead of jumping straight to `strict_error`.

## Risks & Mitigations
- **Performance:** Restoring overlap repair may be expensive. Mitigate by profiling on problematic datasets and providing escape hatches if necessary.
- **Behaviour drift:** Ensure unit tests or fixture comparisons lock down the expected numerical output for both birdseye transformations and strict repairs.
