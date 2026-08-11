## Analysis
- [x] A1. Capture written explanations for boundary vertex synthesis in both English and Japanese (`docs/tin-internals.md`, `docs/tin-internals.ja.md`).
- [x] A2. Capture written explanations for `calculatePointsWeight()` and the resulting `weight_buffer` usage in both languages.

## Implementation
- [x] I1. Refactor `Tin` async entry points: replace any ad-hoc `new Promise` wrappers with `async`/`await`, keep `updateTin()` synchronous, and ensure `updateTinAsync()` (and any similar helpers) delegate via `await` instead of manual chaining.
- [x] I2. Update first-party consumers (`public/index.html`, `spec/tin_node.spec.js`, `spec/node_test.js`, and other repo call sites) to use `await`/`try...catch` instead of `.then()`/`.catch()` once the async helpers are modernized.
- [x] I3. Extract boundary vertex math into a dedicated module (e.g., `src/boundary-vertices.ts`) and weight calculations into `src/weight-buffer.ts`, updating `Tin` to import these helpers while keeping backwards-compatible exports.
- [x] I4. Add targeted JSDoc (or concise inline comments where JSDoc will not reach) for `generatePointsSet()`, the new helper modules, and public methods whose behavior depends on strict mode or vertex mode.
- [x] I5. Run the full Vitest suite (`pnpm test` or equivalent) and confirm no regressions; update any fixtures if deterministic output changes because of the refactor.
