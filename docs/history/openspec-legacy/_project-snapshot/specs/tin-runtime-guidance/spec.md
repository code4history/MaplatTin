# tin-runtime-guidance Specification

## Purpose
TBD - created by archiving change document-tin-logic. Update Purpose after archive.
## Requirements
### Requirement: Tin Runtime Cleanup Guidance
The change proposal MUST spell out how the upcoming implementation will streamline async helpers, reorganize geometry helpers, and document the public API.

#### Scenario: Async refactor plan captured
- **GIVEN** the change design notes
- **THEN** `openspec/changes/document-tin-logic/design.md` explains that `Tin` will expose an `async updateTinAsync()` wrapper, that in-repo consumers will migrate to `await`, and that any other Promise-based helpers will follow the same pattern.

#### Scenario: Module and doc tasks enumerated
- **GIVEN** the change task list
- **THEN** `openspec/changes/document-tin-logic/tasks.md` includes unchecked implementation items to extract boundary vertex math, extract weight-buffer logic, add JSDoc, and rerun tests so the apply phase has concrete work items.

