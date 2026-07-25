# Tasks: Standardize Code4History Repository Standards

## Phase 1: pnpm Enforcement
- [x] 1.1 Create `.npmrc` with `engine-strict=true`
- [x] 1.2 Add `engines` field to `package.json` requiring Node >=20 and pnpm >=9
- [x] 1.3 Verify `npm install` fails with appropriate error message
- [x] 1.4 Verify `pnpm install` continues to work

## Phase 2: Build Output Separation
- [x] 2.1 Update `vite.config.ts` to use `dist-demo/` for demo builds
- [x] 2.2 Add `copyPublicDir: false` to package build configuration
- [x] 2.3 Add `dist-demo/` to `.gitignore`
- [x] 2.4 Test package build produces clean `dist/` without public assets
- [x] 2.5 Test demo build produces complete `dist-demo/` with public assets
- [x] 2.6 Update `.github/workflows/deploy.yml` to use `dist-demo/`

## Phase 3: Dev Server Configuration
- [x] 3.1 Add `server.open` configuration to `vite.config.ts`
- [x] 3.2 Verify `pnpm dev` opens browser at `http://localhost:5173/`
- [x] 3.3 Verify demo page loads correctly at root URL

## Phase 4: CI/CD Workflow Updates
- [x] 4.1 Update `.github/workflows/ci.yml` to trigger on all branches
- [x] 4.2 Remove Node 18 from test matrix (keep Node 20, 22)
- [x] 4.3 Add `version: 9` to pnpm/action-setup in ci.yml
- [x] 4.4 Create `.github/workflows/deploy.yml` for GitHub Pages
- [x] 4.5 Add `version: 9` to pnpm/action-setup in deploy.yml
- [x] 4.6 Configure deploy workflow to trigger only on `master` branch
- [x] 4.7 Update deploy workflow to build demo and deploy `dist-demo/`

## Phase 5: Verification
- [x] 5.1 Run `pnpm install` successfully
- [ ] 5.2 Run `npm install` and verify it fails
- [x] 5.3 Run `pnpm run build` and verify clean `dist/`
- [ ] 5.4 Run `pnpm dev` and verify root URL works
- [ ] 5.5 Push to feature branch and verify CI runs
- [ ] 5.6 Merge to `master` and verify GitHub Pages deploys

## Phase 6: Documentation
- [ ] 6.1 Update README with pnpm requirement
- [ ] 6.2 Document build output directories
- [ ] 6.3 Update CONTRIBUTING.md if it exists
