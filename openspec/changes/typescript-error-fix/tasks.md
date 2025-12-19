# Tasks: TypeScript Error Fix

## Phase 1: Fix CI/CD Lockfile Issue
- [ ] 1.1 Run `pnpm install` to update lockfile with correct @maplat/transform commit
- [ ] 1.2 Commit and push lockfile update
- [ ] 1.3 Verify CI/CD pipeline passes

## Phase 2: Fix TypeScript Type Errors in src/tin.ts
- [ ] 2.1 Import `WeightBufferBD` type from @maplat/transform (already done)
- [ ] 2.2 Add null checks for optional properties:
  - [ ] 2.2.1 Fix `this.pointsWeightBuffer` usage at L180-181
  - [ ] 2.2.2 Fix `this.edgeNodes` usage at L241
- [ ] 2.3 Add explicit type annotations for callback parameters:
  - [ ] 2.3.1 Fix callback at L364 (node, index, arr)
  - [ ] 2.3.2 Fix callback at L372 (acc, len, idx)
  - [ ] 2.3.3 Fix callback at L378 (accum, idx, arr)
  - [ ] 2.3.4 Fix callbacks at L389, 396, 401 (item, prev, curr, etc.)
  - [ ] 2.3.5 Fix callback at L445-446 (a, b, item, index, arr)
  - [ ] 2.3.6 Fix callback at L491 (prev, point)
- [ ] 2.4 Fix GeoJSON type compatibility issues:
  - [ ] 2.4.1 Fix transformArr call at L566 with proper FeatureCollection type
  - [ ] 2.4.2 Fix transformArr call at L583 with proper FeatureCollection type
  - [ ] 2.4.3 Fix transformArr call at L595 with proper type assertion

## Phase 3: Verification
- [ ] 3.1 Run `pnpm run typecheck` - must pass with 0 errors
- [ ] 3.2 Run `pnpm exec eslint src` - must maintain 0 warnings
- [ ] 3.3 Run `pnpm run test` - all tests must pass
- [ ] 3.4 Verify CI/CD pipeline completes successfully

## Phase 4: Documentation
- [ ] 4.1 Update CHANGELOG.md with type error fixes
- [ ] 4.2 Document any non-obvious type assertions in code comments
