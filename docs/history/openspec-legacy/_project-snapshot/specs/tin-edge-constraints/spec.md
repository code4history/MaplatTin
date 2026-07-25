# tin-edge-constraints Specification

## Purpose
TBD - created by archiving change add-edgebound-tests. Update Purpose after archive.
## Requirements
### Requirement: Edge Constraint Regression Tests
The project MUST include automated tests that exercise the internal EdgeBound constraint engine to detect regressions when modifying constrained triangulation logic.

#### Scenario: Constrain required edge via tests
- **GIVEN** a unit test constructing a simple triangulation with intersecting edges
- **WHEN** the test invokes `Constrain.constrainAll` with required edges
- **THEN** the resulting mesh in the test asserts that required edges exist and no unintended intersections remain.

#### Scenario: Detect constraint errors via tests
- **GIVEN** a unit test that feeds invalid or conflicting constraints
- **WHEN** the EdgeBound logic throws an expected error
- **THEN** the test asserts the error type/message, ensuring error handling remains stable.

### Requirement: Internal Edge Constraint Engine
`@maplat/tin` MUST provide constrained triangulation using an internal EdgeBound implementation so required edges are enforced without depending on external packages.

#### Scenario: Required edges enforced internally
- **GIVEN** a `Tin` instance receiving control points and required edges
- **WHEN** constrained triangulation runs
- **THEN** the resulting mesh includes every required edge
- **AND** no external `@maplat/edgebound` dependency is needed at build or runtime.

### Requirement: Reusable Edge Rewiring Utilities
The internal EdgeBound module MUST expose internal-only utilities that allow future logic (e.g., forbidden edge resolution) to reuse edge rewiring without altering the public API.

#### Scenario: Utilities available for future extensions
- **GIVEN** new topology correction logic within the repository
- **WHEN** it needs to adjust triangle adjacency using the EdgeBound rewiring algorithm
- **THEN** it can import internal utilities without reimplementing the algorithm
- **AND** the public exports of `@maplat/tin` remain unchanged.

