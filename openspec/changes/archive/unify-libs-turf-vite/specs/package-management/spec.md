# Package Management

## ADDED Requirements

### Requirement: Dependencies
The system MUST consolidate geospatial library dependencies to simplify maintenance.

#### Scenario: Turf Bundling
- The library MUST depend on the unified `@turf/turf` package (as a regular `dependency`) instead of individual `@turf/*` peer dependencies.

### Requirement: Build Configuration
The system MUST provide a unified and standardized build and test environment.

#### Scenario: Tooling versions and structure
- The project MUST use `vite` v6.x or newer and `vitest` v3.x or newer.
- The project SHOULD maintain separate `vite.config.ts` (for build) and `vitest.config.ts` (for test) to ensure structural consistency with other Maplat repositories.
- ESLint MUST be configured using the modern Flat Config system (`eslint.config.js`).
