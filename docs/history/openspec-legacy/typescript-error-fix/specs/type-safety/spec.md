# Spec Delta: Type Safety

## ADDED Requirements

### Type Error Resolution

#### Requirement: TypeScript compilation must complete without errors
**WHEN** running `pnpm run typecheck`
**THEN** the command must exit with code 0 and produce zero TypeScript errors

#### Scenario: Optional property access is guarded
**GIVEN** a Tin class property that may be undefined
**WHEN** the property is accessed in a method
**THEN** the code must use null checks or nullish coalescing to handle undefined values

**Example**:
```typescript
// Instead of:
compiled.weight_buffer = this.pointsWeightBuffer;

// Use:
compiled.weight_buffer = this.pointsWeightBuffer ?? {};
```

#### Scenario: Callback parameters have explicit type annotations
**GIVEN** an array method callback (map, filter, reduce, etc.)
**WHEN** the callback parameters were previously `any` or implicitly typed
**THEN** parameters must have explicit type annotations (even if `unknown`)

**Example**:
```typescript
// Instead of:
.map((item) => { ... })

// Use:
.map((item: unknown) => { ... })
```

#### Scenario: GeoJSON types are compatible with TIN transformation types
**GIVEN** a GeoJSON FeatureCollection used with transformArr
**WHEN** the function expects Tins type (FeatureCollection<Polygon, PropertiesTri>)
**THEN** appropriate type assertions must be used to bridge the gap

**Example**:
```typescript
transformArr(point(coord), tinForw as Tins) as Position
```

## MODIFIED Requirements

### Strict Type Checking

#### Requirement: All TypeScript strict mode checks must be enabled and pass
**WHEN** TypeScript compiler runs with strict mode
**THEN** compilation must succeed without requiring `any` types or `@ts-ignore` directives

_Note: This requirement was previously defined but is now being validated end-to-end with the fix of remaining type errors._
