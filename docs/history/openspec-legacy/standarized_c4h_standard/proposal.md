# Proposal: Standardize Code4History Repository Standards

## Summary
Align MaplatTin with Code4History organizational standards for pnpm enforcement, build separation, dev server configuration, and CI/CD setup.

## Problem Statement
MaplatTin currently deviates from Code4History standards in several areas:
1. No pnpm enforcement via `.npmrc` and `package.json` engines field
2. Build outputs (`dist/`) mix library artifacts with demo/dev-server assets
3. Dev server doesn't work at root URL (`http://localhost:5173/`)
4. CI/CD doesn't separate test workflows from deployment workflows

## Why
Standardizing across Code4History repositories ensures:
- Consistent developer experience across all Maplat projects
- Prevention of accidental npm/yarn usage causing lockfile conflicts
- Clean npm package distribution without demo artifacts
- Predictable CI/CD behavior aligned with organizational conventions

## Goals
1. **pnpm Enforcement**: Add `.npmrc` with `engine-strict=true` and `engines` field in `package.json`
2. **Build Separation**: Split package build (`dist/`) from demo build (`dist-demo/`)
3. **Dev Server Fix**: Configure Vite to serve `index.html` at root URL
4. **CI/CD Alignment**: Run tests on all branches, deploy GitHub Pages only from `master`

## Non-Goals
- Changing default branch (already `master`)
- Modifying core library functionality
- Removing existing CommonJS outputs (user mentioned removal, but `vite.config.ts` still generates CJS)

## Proposed Solution

### 1. pnpm Enforcement
**Add `.npmrc`:**
```ini
engine-strict=true
```

**Update `package.json`:**
```json
{
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=9.0.0"
  },
  "packageManager": "pnpm@10.20.0"
}
```

### 2. Build Output Separation
**Update `vite.config.ts`:**
- Package build (BUILD_MODE=package): outputs to `dist/`, `copyPublicDir: false`
- Demo build (default): outputs to `dist-demo/`, includes `public/`

**Add `dist-demo/` to `.gitignore`**

### 3. Dev Server Configuration
**Update `vite.config.ts`:**
```typescript
export default defineConfig({
  // ... existing config
  server: {
    open: '/'  // Ensure root URL serves index.html
  }
})
```

### 4. CI/CD Workflows
**Create/Update `.github/workflows/ci.yml`:**
- Trigger: all branches (`push: branches: ['**']`)
- Jobs: lint, typecheck, test, build
- Node versions: 20, 22

**Create `.github/workflows/deploy.yml`:**
- Trigger: `push: branches: ['master']`
- Job: build demo, deploy to gh-pages

## Implementation Phases
1. Add pnpm enforcement files
2. Update build configuration for output separation
3. Fix dev server configuration
4. Update CI/CD workflows
5. Verify all configurations work correctly

## Success Criteria
- `npm install` fails with engine-strict error
- `pnpm run build` produces clean `dist/` without demo files
- `dist-demo/` contains demo build with all public assets
- `pnpm dev` serves at `http://localhost:5173/` (root URL)
- CI runs on all branches
- GitHub Pages deploys only from `master`

## Risks and Mitigations
- **Risk**: Breaking existing workflows for contributors using npm/yarn
  - **Mitigation**: Document pnpm requirement clearly in README
- **Risk**: Demo build might break if `public/` path references change
  - **Mitigation**: Test thoroughly before merging

## Related Work
- Builds on unified tooling work from previous OpenSpec changes
- Aligns with Code4History organizational conventions
