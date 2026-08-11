# Spec Delta: Package Management

## ADDED Requirements

### pnpm Enforcement

#### Requirement: Package manager must be enforced via engine-strict
**WHEN** a developer attempts to install dependencies with npm or yarn
**THEN** the installation must fail with a clear error message indicating pnpm is required

#### Scenario: npm install fails with engine error
**GIVEN** the repository has `.npmrc` with `engine-strict=true`
**AND** `package.json` has `engines.pnpm` field
**WHEN** a developer runs `npm install`
**THEN** the command must fail
**AND** display an error message about engine requirements

**Example Error:**
```
npm ERR! engine Unsupported engine
npm ERR! engine Not compatible with your version of node/npm
npm ERR! Required: {"pnpm":">=9.0.0"}
```

#### Scenario: pnpm install succeeds
**GIVEN** the repository has `.npmrc` with `engine-strict=true`
**AND** `package.json` has `engines.pnpm` field
**WHEN** a developer runs `pnpm install` with pnpm >= 9.0.0
**THEN** the command must succeed
**AND** dependencies must be installed correctly

### Node Version Requirement

#### Requirement: Minimum Node version must be enforced
**WHEN** the repository is installed or built
**THEN** Node.js version must be >= 20.0.0

#### Scenario: Build with Node 18 fails
**GIVEN** `package.json` has `engines.node: ">=20.0.0"`
**WHEN** a developer attempts to build with Node 18.x
**THEN** an appropriate warning or error should be displayed

#### Scenario: Build with Node 20+ succeeds
**GIVEN** `package.json` has `engines.node: ">=20.0.0"`
**WHEN** a developer runs build commands with Node 20.x or 22.x
**THEN** all build commands must succeed

## MODIFIED Requirements

### Lockfile Synchronization

#### Requirement: pnpm-lock.yaml must be the only lockfile
**WHEN** the repository is checked out
**THEN** only `pnpm-lock.yaml` must exist
**AND** `package-lock.json` and `yarn.lock` must not exist
**AND** `.gitignore` must include npm and yarn lockfiles

_Note: This extends the existing lockfile synchronization requirement to explicitly forbid alternative lockfiles._
