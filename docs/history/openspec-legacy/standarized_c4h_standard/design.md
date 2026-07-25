# Design: Standardize Code4History Repository Standards

## Context
Code4History maintains multiple Maplat-related repositories. To ensure consistency, developer experience, and deployment reliability, organizational standards have been established. MaplatTin needs to align with these standards.

## Current State Analysis

### pnpm Enforcement
**Current**: `package.json` has `packageManager: "pnpm@10.20.0"` but no enforcement
**Issue**: Developers can still use npm/yarn, causing lockfile conflicts
**Impact**: Medium - can cause CI failures and merge conflicts

### Build Outputs
**Current**: `vite.config.ts` uses conditional logic (`BUILD_MODE=package`) but always outputs to `dist/`
**Issue**: Demo assets (from `public/`) mix with library build in `dist/`
**Impact**: High - npm package includes unnecessary demo files

### Dev Server
**Current**: Dev server requires explicit `/index.html` path
**Issue**: Non-standard behavior, poor UX
**Impact**: Low - minor inconvenience

### CI/CD
**Current**: Single `ci.yml` runs on `main` and `master`, no separate deploy workflow
**Issue**: Doesn't align with Code4History standard of "all branches test, master deploys"
**Impact**: Medium - inconsistent with org conventions

## Solution Design

### 1. pnpm Enforcement Strategy

#### .npmrc Configuration
```ini
engine-strict=true
```

**Rationale**: When combined with `package.json` engines field, this prevents npm/yarn usage entirely

#### package.json engines Field
```json
{
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=9.0.0"
  }
}
```

**Rationale**: 
- Node 20 is current LTS, aligns with CI matrix
- pnpm 9+ ensures modern features and performance
- Existing `packageManager` field provides exact version hint

### 2. Build Output Separation

#### Directory Structure
```
dist/           # Package build only (committed)
├── index.d.ts
├── maplat_tin.js
├── maplat_tin.cjs
└── maplat_tin.umd.js

dist-demo/      # Demo build only (gitignored)
├── index.html
├── assets/
└── [other demo files]
```

#### Vite Configuration Changes
```typescript
export default defineConfig({
  build: isPackageBuild
    ? {
        // Package build
        outDir: 'dist',
        copyPublicDir: false,  // KEY: Prevent public/ copy
        // ... lib config
      }
    : {
        // Demo build
        outDir: 'dist-demo',   // KEY: Separate output
        emptyOutDir: true
      }
})
```

**Rationale**:
- `copyPublicDir: false` ensures `public/` doesn't pollute package build
- Separate `outDir` keeps concerns cleanly separated
- `dist/` committed for npm; `dist-demo/` gitignored for local dev

**Alternative Considered**: Use `--outDir` CLI flag
**Rejected**: Vite config is clearer and self-documenting

### 3. Dev Server Root URL Fix

#### Configuration
```typescript
export default defineConfig({
  server: {
    open: '/'  // Opens browser at root
  },
  // ... existing config
})
```

**Rationale**: Vite automatically serves `index.html` at `/`, this just ensures browser opens there

**Alternative Considered**: Custom middleware
**Rejected**: Vite handles this natively, no need for complexity

### 4. CI/CD Workflow Split

#### Workflow Architecture
```
ci.yml (all branches)
├── lint
├── typecheck
├── test (Node 20, 22)
└── build (package)

deploy.yml (master only)
├── build (demo)
└── deploy to gh-pages
```

**Rationale**:
- Separate files improve clarity and maintainability
- All branches get quality checks
- Only master triggers deployment
- Aligns with Code4History conventions

#### Key Changes
1. **ci.yml**: Change trigger from `branches: [main, master]` to `branches: ['**']`
2. **deploy.yml**: Create new file with `branches: ['master']` trigger
3. Remove Node 18 from matrix (EOL approaching)
4. **Add explicit pnpm version**: All workflows must specify `version: 9` for pnpm/action-setup

**Example pnpm setup:**
```yaml
- name: Install pnpm
  uses: pnpm/action-setup@v4
  with:
    version: 9
```

## Trade-offs

### Build Separation
**Pro**: Clean npm packages, clear separation of concerns
**Con**: Requires updating deployment scripts
**Decision**: Proceed - cleanliness outweighs one-time script update

### pnpm Enforcement
**Pro**: Prevents lockfile issues, ensures consistency
**Con**: Forces all contributors to use pnpm
**Decision**: Proceed - organizational standard, well-documented requirement

### Workflow Split
**Pro**: Clear responsibilities, easier to maintain
**Con**: Two files to manage instead of one
**Decision**: Proceed - clarity is worth the extra file

## Validation Strategy

### Manual Testing
1. `npm install` → should fail with engine error
2. `pnpm install` → should succeed
3. `pnpm run build` → verify `dist/` is clean
4. `pnpm dev` → verify opens at root URL
5. Push to branch → verify CI runs
6. Merge to master → verify deploy runs

### Automated Testing
- CI will validate all changes on every commit
- Deploy workflow serves as integration test for demo build

## Rollback Plan
If issues arise:
1. Revert `.npmrc` and `engines` field
2. Revert `vite.config.ts` changes
3. Revert workflow files
4. All changes are isolated and easily reversible

## Open Questions
None - solution is well-defined and straightforward.
