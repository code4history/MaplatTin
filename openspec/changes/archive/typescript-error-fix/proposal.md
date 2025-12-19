# Proposal: TypeScript Error Fix

## Summary
Fix remaining TypeScript compilation errors and CI/CD lockfile synchronization issue.

## Problem Statement
After successfully eliminating all ESLint warnings, the project still has:
1. TypeScript compilation errors in `src/tin.ts` due to strict type checking
2. CI/CD failure caused by outdated `pnpm-lock.yaml` (mismatched @maplat/transform commit hash)

## Why
TypeScript compilation errors prevent the project from building reliably and mask potential runtime issues. The CI/CD lockfile mismatch blocks merges and deployments, breaking the development workflow. Both issues must be resolved to maintain code quality standards established in #33 and ensure MaplatTin can leverage the complete type definitions provided by @maplat/transform.

## Goals
- Achieve zero TypeScript compilation errors across the codebase
- Fix CI/CD pipeline by updating lockfile to match package.json
- Maintain type safety using types exported by @maplat/transform

## Non-Goals
- Changing MaplatTransform's type definitions (they are complete and correct)
- Modifying core business logic or algorithms
- Refactoring the Tin class architecture

## Proposed Solution

### 1. Fix TypeScript Type Errors
The errors fall into these categories:
- **Undefined property access**: Properties like `pointsWeightBuffer` and `edgeNodes` can be undefined but are used without null checks
- **Type narrowing**: Callback parameters lack explicit type annotations, resulting in `unknown` types
- **GeoJSON type compatibility**: GeoJsonProperties doesn't match PropertiesTri from @maplat/transform

Solutions:
- Add null/undefined checks where properties are optional
- Provide explicit type annotations for callback parameters
- Use proper type assertions where GeoJSON types are used with TIN transformations

### 2. Update pnpm-lock.yaml
The lockfile references an outdated @maplat/transform commit:
- Lockfile: `de59708092845ba424bec22040df045933a0f617`
- package.json: `8e98b7ea5378302150ebbcf4d22a2c01f8f68e66`

Solution: Run `pnpm install` to regenerate lockfile

## Implementation Phases
1. Update pnpm-lock.yaml to fix CI/CD
2. Fix undefined property access errors with null checks
3. Add type annotations to callback parameters
4. Verify with `pnpm run typecheck` and CI/CD

## Success Criteria
- `pnpm run typecheck` passes with zero errors
- CI/CD pipeline completes successfully
- All existing tests continue to pass
- No new ESLint warnings introduced

## Risks and Mitigations
- **Risk**: Adding null checks might change runtime behavior
  - **Mitigation**: Add checks with appropriate default values or early returns that preserve existing logic
- **Risk**: Type assertions might hide real type issues
  - **Mitigation**: Use assertions only where types are guaranteed by business logic, document why

## Related Work
- Builds on #33 (ESLint warning elimination)
- Uses types from @maplat/transform (verified as complete per Issue #4)
