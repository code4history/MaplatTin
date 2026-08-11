# Bundle Turf, Unify Vite & ESLint

## Why
- **Turf Bundling**: Currently, `MaplatTin` depends on granular `@turf/*` packages. To simplify dependency management and reuse the shared "Maplat Bundle" approach, we will switch to the single `@turf/turf` package.
- **Vite & Tooling Unification**: Ensure `vite.config.ts` is the single source of truth for build and test (consolidating `vitest.config.ts` if present). Standardize ESLint usage by ensuring `eslint.config.js` (Flat Config) is used, consistent with modern Maplat repos.
- **ES Modules**: Reinforce the migration to ES modules by ensuring all scripts and configs operate in ESM mode.

## What Changes
- **Dependencies**: Move Turf.js from `peerDependencies` to `dependencies` (using `@turf/turf` v7.x) to simplify consumption.
- **Vite & Tooling**: 
    - Ensure `vite` is at least v6.x (LTS) and `vitest` is v3.x.
    - Extract test configuration to `vitest.config.ts` to align with `Weiwudi` and `MaplatTransform` structures.
- **ESLint**: Migrate to `eslint.config.js` (Flat Config) ensuring standardization.
- **Cleanup**: Ensure `type: "module"` is fully respected.

## Impact
- **Developer Experience**: Simplified dependency management and configuration.
- **Consistency**: Aligns `MaplatTin` with `MaplatCore` and other repositories in the ecosystem.
- **Consumption**: Consumers must now provide `@turf/turf` instead of individual packages, which is generally simpler for standard setups.
