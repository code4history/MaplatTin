# Restore Birdeye Scaling And Strict Overlap Resolution

## Why
- During the refactor that split boundary/weight helpers, the historic bird's-eye vertex scaling logic was simplified to reuse the plain implementation. That removed the per-quadrant scaling/rotation fallback that Maplat relied on for exaggerated perspective projections.
- Strict mode previously tried to heal overlapping triangles by detecting shared edges and re-triangulating; the modern code only flags `strict_error` without attempting the remediation. This weakens backwards compatibility for datasets that expect the self-healing behaviour.
- Reintroducing these behaviours ensures the 0.9.4-era datasets continue to transform correctly while keeping the new module structure and documentation.

## What Changes
- Re-specify the bird's-eye boundary vertex algorithm so it matches the 0.9.4 behaviour (quadrant sampling, averaging, and fallback) while remaining encapsulated in `boundary-vertices.ts`.
- Reintroduce the strict-mode overlap resolution workflow—search index construction, intersection checks, edge splitting, and TIN replacement—compatible with the current TypeScript module layout.
- Extend documentation to explain the revived algorithms and any new helper functions.

## Impact
- Bird's-eye visualisations regain their intended perspective scaling without affecting the plain vertex mode.
- Strict mode once again attempts to repair overlaps before degrading to `strict_error`, improving resilience for legacy maps.
- Implementation effort is contained within the existing helper modules and strict TIN logic, keeping the recent refactor structure intact.
