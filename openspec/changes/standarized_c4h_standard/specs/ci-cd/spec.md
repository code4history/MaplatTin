# Spec Delta: CI/CD

## ADDED Requirements

### Workflow Separation

#### Requirement: Test and deployment workflows must be separate
**WHEN** code is pushed to any branch
**THEN** CI workflow must run tests, lint, typecheck, and build
**AND** deployment workflow must NOT run

**WHEN** code is pushed to master branch
**THEN** both CI workflow and deployment workflow must run

#### Scenario: All branches trigger CI workflow
**GIVEN** GitHub Actions workflow file `.github/workflows/ci.yml`
**WHEN** code is pushed to any branch
**THEN** the following jobs must run:
  - Lint check (`pnpm run lint`)
  - Type check (`pnpm run typecheck`)
  - Unit tests (`pnpm test`)
  - Package build (`pnpm run build`)
**AND** all jobs must pass for the workflow to succeed

#### Scenario: Only master triggers deployment
**GIVEN** GitHub Actions workflow file `.github/workflows/deploy.yml`
**WHEN** code is pushed to a feature branch
**THEN** deployment workflow must NOT run

**WHEN** code is pushed to `master` branch
**THEN** deployment workflow must run
**AND** demo must be built and deployed to GitHub Pages

#### Scenario: Deployment uses demo build
**GIVEN** deployment workflow is triggered on master
**WHEN** GitHub Pages deployment step runs
**THEN** workflow must build demo to `dist-demo/`
**AND** deploy `dist-demo/` contents to `gh-pages` branch

### Node Version Matrix

#### Requirement: CI must test on organizational standard Node versions
**WHEN** CI workflow runs
**THEN** tests must run on Node.js versions 20 and 22
**AND** Node 18 must NOT be in the test matrix

#### Scenario: Tests run on Node 20 and 22
**GIVEN** CI workflow configuration
**WHEN** workflow is triggered
**THEN** test matrix must include:
  - `node-version: [20, 22]`
**AND** all tests must pass on both versions

### pnpm Version Specification

#### Requirement: GitHub Actions workflows must explicitly specify pnpm version
**WHEN** GitHub Actions workflow uses pnpm/action-setup
**THEN** the action must specify `version: 9` explicitly
**AND** all workflows must use the same pnpm major version

#### Scenario: CI workflow specifies pnpm version
**GIVEN** `.github/workflows/ci.yml` uses `pnpm/action-setup@v4`
**WHEN** the Install pnpm step is defined
**THEN** it must include `version: 9` configuration

**Example:**
```yaml
- name: Install pnpm
  uses: pnpm/action-setup@v4
  with:
    version: 9
```

#### Scenario: Deploy workflow specifies pnpm version
**GIVEN** `.github/workflows/deploy.yml` uses `pnpm/action-setup@v4`
**WHEN** the Install pnpm step is defined
**THEN** it must include `version: 9` configuration

## MODIFIED Requirements

_No existing requirements are directly modified, but the CI/CD setup is being formalized._

## REMOVED Requirements

_No requirements are removed by this change._
