# Change: Complete V3 Data Model and Distribution Formats

## Why
`@maplat/tin` already emits and consumes V3 triangulation payloads, but the V3 data model is still incomplete. The current compiled JSON mixes editing concerns with runtime concerns, and it does not yet define how GCP metadata, runtime-only payloads, or lighter distribution payloads should be represented.

Without a formal spec, `@maplat/tin` and `@maplat/transform` will drift on what a V3 payload contains and what is safe to strip for distribution.

## What Changes
- Define the V3.1 editing/runtime data model for compiled payloads, including optional metadata attached to control points and temporary single-coordinate evaluation ownership in `@maplat/tin`.
- Define a separate V3 distribution payload for runtime consumption that strips edit-only structures while preserving transformability.
- Define compatibility expectations between editing payloads and distribution payloads.
- Record unresolved transport decisions so implementation can proceed on canonical JSON before optional binary packaging.

## Impact
- Affected specs: `tin-v3-data-model`
- Affected code: `src/tin.ts`, single-coordinate CRS evaluation helpers, shared `Compiled` types re-exported from `@maplat/transform`, docs, demos, generators, and fixture files
