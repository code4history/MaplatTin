# Spec Delta: Build Configuration

## ADDED Requirements

### Build Output Separation

#### Requirement: Package and demo builds must use separate output directories
**WHEN** building the package for npm distribution
**THEN** output must go to `dist/` directory
**AND** `public/` directory contents must NOT be copied

**WHEN** building the demo for local development or GitHub Pages
**THEN** output must go to `dist-demo/` directory
**AND** `public/` directory contents must be included

#### Scenario: Package build outputs to dist/ without public assets
**GIVEN** developer runs `pnpm run build` (with BUILD_MODE=package)
**WHEN** the build completes
**THEN** `dist/` directory must contain:
  - `index.d.ts` (type definitions)
  - `maplat_tin.js` (ESM bundle)
  - `maplat_tin.cjs` (CommonJS bundle)
  - `maplat_tin.umd.js` (UMD bundle)
**AND** `dist/` directory must NOT contain:
  - `index.html`
  - Assets from `public/` directory
  - Demo-specific files

#### Scenario: Demo build outputs to dist-demo/ with all assets
**GIVEN** developer runs demo build (vite build without BUILD_MODE=package)
**WHEN** the build completes
**THEN** `dist-demo/` directory must contain:
  - `index.html`
  - All assets from `public/` directory
  - Bundled demo application files
**AND** `dist-demo/` must be gitignored

#### Scenario: copyPublicDir is disabled for package builds
**GIVEN** Vite configuration for package build
**WHEN** BUILD_MODE=package is set
**THEN** `vite.config.ts` must have `build.copyPublicDir: false`
**AND** library build must not include public directory contents

### Dev Server Configuration

#### Requirement: Dev server must serve application at root URL
**WHEN** developer runs `pnpm dev`
**THEN** browser must open at `http://localhost:5173/`
**AND** application must load without requiring `/index.html` path

#### Scenario: Root URL serves index.html
**GIVEN** Vite dev server is running
**WHEN** browser navigates to `http://localhost:5173/`
**THEN** `index.html` must be served automatically
**AND** application must load correctly

#### Scenario: Dev server opens browser automatically
**GIVEN** `vite.config.ts` has `server.open` configuration
**WHEN** developer runs `pnpm dev`
**THEN** browser must open automatically to root URL
**AND** no manual navigation should be required

## MODIFIED Requirements

_No existing requirements are modified by this change._

## REMOVED Requirements

_No requirements are removed by this change._
