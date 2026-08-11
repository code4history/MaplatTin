## ADDED Requirements

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
