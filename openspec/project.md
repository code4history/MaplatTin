# Project Context

## Purpose
Maplat Tin provides the triangulated irregular network (TIN) engine that powers Maplat's historical map transformations. The library builds and applies homeomorphic coordinate conversions between two planes so web apps can align scanned maps with modern map tiles while preserving topology.

## Tech Stack
- TypeScript (strict mode, ESM-first)
- Vite for library bundling (ESM, CJS, UMD outputs)
- Vitest + jsdom for unit/integration testing
- ESLint (typescript-eslint) + Prettier for linting/formatting
- Node.js toolchain (tested on latest LTS)

## Project Conventions

### Code Style
- TypeScript sources live in `src/` and ship typed builds; avoid default exports except for utility factories.
- Follow ESLint + Prettier defaults; intentionally unused vars must start with `_` per lint config.
- Target modern ES2022 syntax; prefer pure functions or small classes with explicit exports.
- Keep modules small and focused on geometry/transformation concerns; share helpers via `vertexutils.ts`, `searchutils.ts`, etc.

### Architecture Patterns
- Library entry point re-exports from `src/index.ts`; core `Tin` class in `src/tin.ts` orchestrates triangulation and transformation.
- Constrained triangulation logic is encapsulated in `src/constrained-tin.ts`, with supporting geometry utilities split into dedicated modules.
- External geometry contracts (e.g., `Compiled`, `StrictMode`) flow through `@maplat/transform`; keep compatibility by re-exporting shared types.
- Maintain pure computation modules with minimal I/O; browser and Node consumers interact through the same API surface.

### Testing Strategy
- Use Vitest with the jsdom environment and shared setup in `tests/setup.ts`.
- Assert numeric geometry using `jest-matcher-deep-close-to` for tolerant comparisons.
- Keep scenario fixtures under `tests/cases`, `tests/maps`, and `tests/compiled`; add regression tests when fixing geometry edge cases.
- Run `npm run test` (or `npm run coverage`) before publishing; tests are part of `prepublishOnly`.

### Git Workflow
- Use feature branches and open pull requests against `main`; keep `main` releasable.
- Bump package versions via `npm run version:bump` / `npm run version:sync`; run `npm run prepublishOnly` before tagging or publishing.
- Favor clear, task-scoped commits (e.g., `fix:`, `feat:`) that map to spec changes; include context for geometry/tin adjustments.

## Domain Context
- Maplat aligns historical maps with current geospatial data; Tin transformations must remain homeomorphic to avoid map tearing.
- Control points pair source/target coordinates; constrained edges ensure important boundaries (rivers, city walls) remain intact.
- The library is consumed by other Maplat packages and browser apps, so tree-shakable ESM and legacy UMD builds are both maintained.

## Important Constraints
- Licensed under Maplat Limited License 1.1; ensure new contributors understand redistribution rules.
- Preserve backward compatibility for published APIs (UMD, CJS, ESM) when modifying exports.
- Respect peer dependency contracts (`@turf/*`, `delaunator`)—do not bundle them into builds.
- Numerical stability is critical; guard against degenerative triangles and maintain strict/auto/loose topology states.

## External Dependencies
- Runtime: `@maplat/transform` (shared geometry types); edge constraint engine is now bundled internally, derived from `@maplat/edgebound`.
- Peer Geometry Toolkit: `delaunator`, Turf modules (`@turf/helpers`, `boolean-point-in-polygon`, `centroid`, `convex`, `line-intersect`), and `robust-predicates`.
- Tooling: Vite build pipeline, TypeScript compiler, Vitest test runner, ESLint/Prettier for static analysis.
