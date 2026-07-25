# Tasks

## 1. Dependencies
- [x] 1.1 Remove individual `@turf/*` packages from `peerDependencies` in `package.json`.
- [x] 1.2 Add `@turf/turf` (v7.x) to `dependencies` in `package.json`.
- [x] 1.3 Run `pnpm install` to update lockfile.

## 2. Tooling Unification
- [x] 2.1 Ensure `vite` is upgraded to ^6.0.0 and `vitest` to ^3.0.0.
- [x] 2.2 Extract test configuration from `vite.config.ts` to `vitest.config.ts`.
- [x] 2.3 Migrate ESLint to Flat Config (`eslint.config.js`) if not already done.
- [x] 2.3 Ensure strict usage of `type: module` in all scripts.

## 3. Verification
- [x] 3.1 Run `pnpm run lint` and fix any new linting errors.
- [x] 3.2 Run `pnpm run build` to verify the bundling process.
- [x] 3.3 Run `pnpm run test` to ensure no regressions in functionality.
