# Spec Delta: Package Management

## MODIFIED Requirements

### Lockfile Synchronization

#### Requirement: pnpm-lock.yaml must match package.json dependency specifications
**WHEN** package.json defines a dependency with a specific version or commit hash
**THEN** pnpm-lock.yaml must reference the exact same version or commit hash
**AND** the lockfile must be committed to version control

#### Scenario: CI enforces lockfile synchronization
**GIVEN** the CI/CD pipeline runs `pnpm install --frozen-lockfile`
**WHEN** pnpm-lock.yaml does not match package.json
**THEN** the install command must fail with a clear error message
**AND** the error must indicate which dependencies are mismatched

**Example Error**:
```
ERR_PNPM_OUTDATED_LOCKFILE  Cannot install with "frozen-lockfile" 
because pnpm-lock.yaml is not up to date with package.json

Failure reason:
specifiers in the lockfile don't match specifiers in package.json:
* @maplat/transform (lockfile: github:...#abc123, manifest: github:...#def456)
```

### Dependency Version Control

#### Requirement: GitHub-sourced dependencies must reference consistent commit hashes
**WHEN** a dependency is installed from GitHub (e.g., `github:user/repo#commit`)
**THEN** the commit hash in package.json must match the hash in pnpm-lock.yaml
**AND** both must reference an existing commit in the source repository

#### Scenario: Updating GitHub dependency commit hash
**GIVEN** package.json specifies a new commit hash for a GitHub dependency
**WHEN** developer runs `pnpm install`
**THEN** pnpm-lock.yaml must be updated to reference the new commit hash
**AND** the updated lockfile must be staged for commit

**Steps**:
1. Edit package.json to update commit hash
2. Run `pnpm install` 
3. Verify pnpm-lock.yaml reflects new hash
4. Commit both files together
