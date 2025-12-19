# tin-internals-docs Specification

## Purpose
TBD - created by archiving change document-tin-logic. Update Purpose after archive.
## Requirements
### Requirement: Tin Internals Documentation
Maintainers MUST have bilingual reference material that explains how `Tin` synthesizes boundary vertices and calculates `weight_buffer`.

#### Scenario: English notes exist
- **GIVEN** the repository docs
- **THEN** `docs/tin-internals.md` describes the boundary vertex pipeline (`calculatePlainVertices`, `checkAndAdjustVertices`) and the weight averaging performed by `calculatePointsWeight()`, including references to the relevant source locations.

#### Scenario: Japanese notes exist
- **GIVEN** the repository docs
- **THEN** `docs/tin-internals.ja.md` covers the same boundary vertex and weight-buffer behavior in Japanese so bilingual contributors can follow the implementation.

