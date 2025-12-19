# Design: pnpm Migration

## Context
The project currently uses `npm` but has a mixed environment where some dependencies (linked via git) require `pnpm` to build. This causes fragility.

## Architecture
- **Package Manager**: Switch to `pnpm`.
- **Lockfile**: `pnpm-lock.yaml` becomes the source of truth. `package-lock.json` will be removed.
- **CI/CD**: GitHub Actions will use `pnpm/action-setup` (or `corepack enable`) to provision the correct `pnpm` version.

## Key Decisions
1. **Strict Versioning**: Use `packageManager` field in `package.json` to pin `pnpm` version (aligning with `package.json` vs `pnpm-lock.yaml` enforcement).
2. **Scripts**: Update `scripts` to use `pnpm run` for consistency, though `npm run` usually delegates, we prefer explicit `pnpm` usage to avoid confusion.
