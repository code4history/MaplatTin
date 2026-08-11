# Package Management

## MODIFIED Requirements

### Requirement: Package Manager
The project MUST use `pnpm` for dependency management and scripts.

#### Scenario: Install dependencies
Given a clean checkout
When I run `pnpm install`
Then dependencies are installed successfully
And `pnpm-lock.yaml` is generated/updated
And `npm-shrinkwrap.json` or `package-lock.json` are NOT generated

#### Scenario: Build scripts
Given `package.json`
When I inspect `scripts`
Then they should use `pnpm run` or direct command execution
And they should NOT use `npm run`

#### Scenario: Dependency Build
Given a dependency like `@maplat/transform` that requires `pnpm`
When I run `pnpm install`
Then the dependency's build script runs successfully
And the dependency's artifacts (e.g., `dist`, `lib`) are generated correctly
