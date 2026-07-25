## ADDED Requirements

### Requirement: Strict Mode Overlap Repair
When strict mode detects overlapping triangles, the implementation MUST attempt the legacy repair workflow before reporting `strict_error`.

#### Scenario: Overlap detected
- **GIVEN** `Tin` operating in `MODE_STRICT`
- **WHEN** `calcurateStrictTin` finds intersecting triangles
- **THEN** it rebuilds the search index, re-triangulates the affected area, and rechecks for overlaps, mirroring the 0.9.4 remediation steps.

#### Scenario: Repair succeeds
- **GIVEN** an overlap that can be resolved through re-triangulation
- **WHEN** the repair completes
- **THEN** `strict_status` remains `STATUS_STRICT` and the backward TIN stays usable.

#### Scenario: Repair fails
- **GIVEN** an overlap that cannot be resolved
- **WHEN** the algorithm exhausts the repair attempts
- **THEN** it sets `strict_status` to `STATUS_ERROR`, matching current signalling semantics.
