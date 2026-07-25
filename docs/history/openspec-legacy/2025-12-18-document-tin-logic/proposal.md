# Document Tin Internals And Define Cleanup Plan

## Why
- The current `Tin` implementation contains several non-trivial behaviors—boundary vertex synthesis and point weight buffering—that lack a written explanation, making maintenance risky.
- Downstream callers rely on `updateTinAsync()` even though the pipeline is synchronous, and the codebase still exposes Promise chaining patterns that we would like to normalize with `async/await` or remove.
- Upcoming refactors require clear guidance before we start editing geometry code; this proposal captures the analysis results and frames the work for the implementation phase.

## What Changes
- Added bilingual documentation (`docs/tin-internals.md`, `docs/tin-internals.ja.md`) that explains how the boundary vertices (`b0`–`b3`) and `weight_buffer` values are produced, with source references for future debugging.
- Summarized the runtime cleanup we expect to perform next: remove redundant Promise wrappers around synchronous TIN generation, rewrite consumer-facing async helpers with `async/await`, outline where JSDoc should clarify transformation steps, and identify modules that may be split for clarity.
- Captured these expectations as OpenSpec requirements so the implementation phase can rely on an approved specification.

## Impact
- Developers can understand and discuss TIN internals without reverse-engineering `src/tin.ts`.
- The spec now records concrete refactor targets (async cleanup, documentation coverage, module boundaries) to guide the next iteration.
- No runtime behavior changes land with this proposal; existing tests continue to exercise the current code.
