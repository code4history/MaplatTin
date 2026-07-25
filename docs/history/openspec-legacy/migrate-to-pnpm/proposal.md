# Migrate to pnpm

## Problem
MaplatTin currently defines `npm` scripts but has dependencies (specifically `@maplat/transform`) that require `pnpm` for their build process. This mismatch causes `npm install` to fail when building dependencies, as `pnpm` is not available in the sub-process environment. Additionally, `package-lock.json` and `pnpm-lock.yaml` may drift, and the Maplat ecosystem is standardized on `pnpm`.

## Solution
Migrate the repository to use `pnpm` exclusively. This involves:
- Enforcing `pnpm` via `packageManager` in `package.json`.
- Replacing `npm` commands with `pnpm` in scripts.
- Updating CI workflows to setup `pnpm`.
- regenerating lockfiles.

## Risks
- Users/CI without `pnpm` will need to install it (mitigated by `corepack` or `packageManager` field support).
- Existing `node_modules` might need to be nuked which is standard for package manager switches.
