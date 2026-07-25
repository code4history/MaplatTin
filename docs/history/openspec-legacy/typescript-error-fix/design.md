# Design: TypeScript Error Fix

## Context
Following the successful elimination of all ESLint warnings (#33), the project now requires fixing TypeScript compilation errors. MaplatTransform provides complete type definitions (verified in Issue #4), so the errors stem from MaplatTin's type usage, not missing exports.

## Error Categories

### 1. Optional Property Access Without Null Checks
**Locations**: L180-181, L241

**Problem**: Properties like `pointsWeightBuffer` and `edgeNodes` are defined in the constructor and may be undefined, but are accessed without guards in method `getCompiled()`.

**Solution**: 
```typescript
// Before:
compiled.weight_buffer = this.pointsWeightBuffer;

// After:
compiled.weight_buffer = this.pointsWeightBuffer ?? {};
```

**Rationale**: Use nullish coalescing to provide safe defaults that match the Compiled type requirements.

### 2. Callback Parameters with Implicit `unknown` Type
**Locations**: L364, L372, L378, L389, L396, L401, L445-446, L491

**Problem**: Array methods (`.reduce()`, `.filter()`, `.map()`) have callback parameters without explicit types, causing TypeScript to infer `unknown`.

**Solution**:
```typescript
// Before:
segments.map((segment, idx) => {
  return segment.filter((item, index) => { ... })
})

// After:
segments.map((segment: unknown[], idx: number) => {
  return segment.filter((item: unknown, index: number) => { ... })
})
```

**Rationale**: Since these callbacks operate on dynamically structured segment data, `unknown` is actually the correct type. We must explicitly annotate to acknowledge this and use type guards or assertions where needed.

### 3. GeoJSON Type Compatibility
**Locations**: L566, L583, L595

**Problem**: `transformArr()` expects `Tins` (FeatureCollection with PropertiesTri), but receives FeatureCollection with GeoJsonProperties.

**Solution**:
```typescript
// Before:
bakw: transformArr(point(coord), tinForw) as Position

// After:
bakw: transformArr(point(coord), tinForw as Tins) as Position
```

**Rationale**: The TIN feature collections are guaranteed to have PropertiesTri properties by construction logic. The type assertion is safe and documents this business rule.

## CI/CD Lockfile Fix

**Problem**: `pnpm-lock.yaml` references commit `de59708` but `package.json` specifies `8e98b7e` for @maplat/transform.

**Root Cause**: The lockfile wasn't updated after changing the @maplat/transform version in package.json.

**Solution**: Run `pnpm install` to regenerate lockfile.

**Validation**: CI uses `--frozen-lockfile` which will fail if lockfile is out of sync, ensuring this is caught early.

## Alternative Approaches Considered

### Alternative 1: Make Properties Non-Optional
**Rejected**: Would require initializing these properties in the constructor, which might not be possible until `updateTin()` is called.

### Alternative 2: Use `!` Non-Null Assertion
**Rejected**: Less safe than nullish coalescing with defaults; doesn't document what happens when property is actually undefined.

### Alternative 3: Relax tsconfig strictness
**Rejected**: Goes against project's commitment to strict TypeScript; would hide real issues.

## Testing Strategy
1. **Type Checking**: `pnpm run typecheck` must pass
2. **Existing Tests**: All current tests must continue passing
3. **CI/CD**: Pipeline must complete successfully
4. **No New Warnings**: ESLint must remain at 0 warnings

## Open Questions
None - solution is straightforward application of TypeScript best practices.
