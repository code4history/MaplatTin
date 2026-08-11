## ADDED Requirements

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
