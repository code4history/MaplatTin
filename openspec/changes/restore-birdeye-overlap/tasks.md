## Analysis
- [x] A1. Compare 0.9.4 `Tin` bird's-eye vertex calculations with current `boundary-vertices.ts` to enumerate the per-quadrant scaling steps and fallback behaviour.
- [x] A2. Review the legacy strict-overlap repair pipeline (`calcurateStrictTinAsync`, `overlapCheckAsync`) to map each subroutine to the modern TypeScript structure.

## Implementation
- [x] I1. Implement bird's-eye specific logic inside `calculateBirdeyeVertices` (or a dedicated helper) that restores the quadrant-aware scaling/rotation with fallback, while keeping plain mode unchanged.
- [x] I2. Port the strict overlap remediation workflow into `Tin.calcurateStrictTin()` (or supporting helpers), including search-index mutation, triangle reconstruction, and revalidation.
- [x] I3. Update or add tests to cover the restored behaviours (bird's-eye output and strict overlap healing), ensuring fixtures reflect legacy expectations.
- [x] I4. Refresh documentation (`docs/tin-internals*.md`) to describe the reintroduced algorithms and any new helper functions.
- [ ] I5. Run the full Vitest suite and lint/typecheck commands to confirm the restored logic integrates cleanly.
