## ADDED Requirements

### Requirement: Birdseye Vertex Scaling Restored
Birdseye mode MUST use quadrant-aware scaling and rotation factors derived from convex hull samples, falling back to uniform values only when data is insufficient.

#### Scenario: Quadrant data available
- **GIVEN** a dataset with convex hull points in all four quadrants
- **WHEN** `Tin` runs in `VERTEX_BIRDEYE` mode
- **THEN** `calculateBirdeyeVertices` (or the delegated helper) computes distinct scale/rotation factors per quadrant before generating boundary vertices.

#### Scenario: Quadrant data missing
- **GIVEN** a dataset lacking convex hull samples in at least one quadrant
- **WHEN** `Tin` runs in `VERTEX_BIRDEYE` mode
- **THEN** the logic falls back to the shared-factor approach so the transformation remains stable, matching the 0.9.4 behaviour.
