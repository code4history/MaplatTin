# tin-v3-data-model Specification

## ADDED Requirements
### Requirement: V3 SHALL Distinguish Editing Payloads From Distribution Payloads
The package SHALL define a rich editing payload for authoring workflows and a lighter distribution payload for runtime-only consumption.

#### Scenario: Editing payload export
- **GIVEN** a `Tin` instance prepared from GCPs and constrained edges
- **WHEN** the package exports an editing payload
- **THEN** the payload SHALL preserve the information required to inspect, adjust, and re-export the triangulation, including control points, edge definitions, and authoring-relevant metadata

#### Scenario: Distribution payload export
- **GIVEN** a valid editing payload
- **WHEN** the package exports a distribution payload
- **THEN** the payload SHALL remove edit-only structures while preserving every field required by the runtime to transform coordinates and transfer viewpoints

### Requirement: Tin SHALL Own V3.1 Generation and Single-Coordinate Evaluation During Format Development
During V3.1 format development, the package SHALL own both payload generation and single-coordinate evaluation for CRS-aware payloads so format candidates can be judged end-to-end.

#### Scenario: Developer compares candidate V3.1 payloads
- **GIVEN** a source dataset that can be rendered as V2, V3, and V3.1 payloads
- **WHEN** the developer evaluates coordinate conversion behavior across those payloads
- **THEN** `@maplat/tin` SHALL be able to generate the candidate payload and evaluate single-coordinate conversion from that same package context

#### Scenario: V3.1 contract is accepted
- **GIVEN** the V3.1 payload contract has been accepted
- **WHEN** runtime ownership is reviewed
- **THEN** the package SHALL allow the single-coordinate evaluation path to migrate into `@maplat/transform`

### Requirement: V3.1 Initializer SHALL Support CRS-Aware GCP Input
The V3.1 initializer SHALL accept GCPs as `[[illustration coordinates, map coordinates], ...]` together with an optional CRS directive for the input map coordinates.

#### Scenario: CRS metadata is omitted
- **GIVEN** a V3.1 initializer call with `gcps` and no `crs` field
- **WHEN** the package stores the input map coordinates
- **THEN** it SHALL interpret those input coordinates as `EPSG:4326` coordinates

#### Scenario: CRS metadata is explicitly provided
- **GIVEN** a V3.1 initializer call with `gcps` and `crs: { code, text }`
- **WHEN** the package stores the input map coordinates
- **THEN** it SHALL convert those input map coordinates into the package's current map-coordinate state as needed while preserving the declared source CRS

#### Scenario: Caller requests current map CRS
- **GIVEN** a V3.1 initializer call with `crs: true`
- **WHEN** the map's current CRS has already been fixed
- **THEN** the package SHALL interpret the input map coordinates in that fixed CRS

#### Scenario: Caller requests current map CRS before it is fixed
- **GIVEN** a V3.1 initializer call with `crs: true`
- **WHEN** the map's current CRS has not yet been fixed
- **THEN** the package SHALL fail instead of silently choosing another CRS

### Requirement: V3.1 SHALL Support an Unresolved Map-CRS State
The V3.1 runtime SHALL support a state in which the map CRS and world-file parameters are not yet fixed.

#### Scenario: Map CRS is unresolved
- **GIVEN** GCPs have been provided but the map CRS and world-file parameters are not yet fixed
- **WHEN** the package stores the working state
- **THEN** it SHALL keep the map-side GCP coordinates in `EPSG:4326`-normalized form and SHALL NOT generate triangulation yet

#### Scenario: Map CRS becomes fixed
- **GIVEN** the map CRS and world-file parameters have been fixed
- **WHEN** the package rebuilds the working state
- **THEN** it SHALL derive map coordinates from that fixed CRS plus world-file placement and only then evaluate whether triangulation should be built

### Requirement: V3.1 SHALL Estimate CRS and World-File Parameters Only On Explicit Request
The package SHALL estimate map CRS and world-file parameters from GCPs only when the caller explicitly invokes the estimation procedure.

#### Scenario: GCPs are edited without estimation request
- **GIVEN** the caller adds, removes, or updates GCPs
- **WHEN** no explicit CRS-estimation command is invoked
- **THEN** the package SHALL NOT automatically recompute the map CRS or world-file parameters

#### Scenario: Explicit estimation is invoked
- **GIVEN** the caller explicitly requests CRS estimation
- **WHEN** the package runs the estimator
- **THEN** it SHALL normalize all map-side GCP coordinates to `EPSG:4326`, enumerate candidate projected CRSs, fit isotropic-scale-plus-rotation-plus-translation world-file parameters for each candidate, and adopt the candidate whose transformed residual variance is minimal before any shear optimization

### Requirement: CRS Search and Shear Optimization SHALL Be Separate Steps
The package SHALL treat CRS selection and shear fitting as separate operations.

#### Scenario: CRS is supplied by the caller
- **GIVEN** the caller explicitly supplies the target map CRS
- **WHEN** the package estimates world-file parameters
- **THEN** it SHALL first fit isotropic scale, rotation, and translation in that CRS and MAY then refine the result by fitting shear

#### Scenario: CRS is searched from candidates
- **GIVEN** the package is choosing among candidate CRSs
- **WHEN** candidate CRSs are scored
- **THEN** each candidate SHALL be scored using only isotropic scale, rotation, and translation, and shear SHALL NOT influence candidate selection

#### Scenario: CRS has been fixed after search or explicit input
- **GIVEN** the map CRS has been fixed either by caller input or by candidate search
- **WHEN** the package performs final world-file optimization
- **THEN** it SHALL be able to fit shear as a later refinement step on top of the already fixed CRS and the already fitted isotropic-scale-plus-rotation-plus-translation result

### Requirement: Estimation Diagnostics SHALL Be Debug-Only
The package SHALL expose candidate scores and residual diagnostics only through an explicit debug-oriented mode rather than making them part of normal operational data.

#### Scenario: Debug mode is disabled
- **GIVEN** the caller runs CRS estimation without enabling estimator debug output
- **WHEN** the package returns or serializes the resulting state
- **THEN** candidate lists, scoring details, and similar estimation diagnostics SHALL be omitted from normal output

#### Scenario: Debug mode is enabled
- **GIVEN** the caller runs CRS estimation with estimator debug output enabled
- **WHEN** the package returns the resulting state or diagnostics
- **THEN** it MAY include candidate CRS scores, selected-CRS scoring context, and pre-shear/post-shear residual information for inspection

### Requirement: CRS Estimation SHALL Be Exposed Through Explicit and Decomposable Methods
The package SHALL provide an explicit estimation entry point and SHALL decompose the estimation workflow into smaller reusable methods.

#### Scenario: Caller runs the full estimator
- **GIVEN** the caller wants to estimate map CRS and world-file parameters from GCPs
- **WHEN** the caller invokes the package's explicit estimation entry point such as `estimateMapCrs()`
- **THEN** the package SHALL run the full explicit estimation workflow without relying on implicit side effects from initializer or point-update methods

#### Scenario: Candidate CRS enumeration is tested independently
- **GIVEN** a set of GCPs normalized to geographic coordinates
- **WHEN** the caller or tests invoke the candidate-enumeration helper
- **THEN** the package SHALL be able to return the candidate CRS list independently of the later fitting steps

#### Scenario: world_file_basic fitting is reused
- **GIVEN** a fixed CRS and a set of GCPs
- **WHEN** the caller or tests invoke the helper that fits isotropic scale, rotation, and translation
- **THEN** the package SHALL be able to compute `world_file_basic` independently so the same helper can be reused for both caller-specified CRS input and candidate-based CRS search

### Requirement: Initial V3.1 CRS Estimation Scope SHALL Be Limited to Japanese Candidate Sets
The initial estimator SHALL constrain its candidate projected CRSs to the explicitly supported Japanese operating set.

#### Scenario: Estimator enumerates candidates
- **GIVEN** the initial V3.1 estimator is run
- **WHEN** candidate projected CRSs are listed
- **THEN** the candidate set SHALL be limited to `EPSG:3857`, WGS84 UTM, WGS84 Japan plane-rectangular systems, Tokyo datum UTM, and Tokyo datum Japan plane-rectangular systems

### Requirement: Fixed Map CRS State SHALL Support Optional Non-Triangulated GCP Usage
After the map CRS and world-file parameters are fixed, the package SHALL allow callers to decide whether GCPs also participate in triangulation.

#### Scenario: GCPs participate in triangulation
- **GIVEN** the fixed map CRS state enables triangulation usage for GCPs
- **WHEN** the working transform is built
- **THEN** the package SHALL build triangulation between illustration coordinates and the map coordinates derived from the fixed CRS plus world-file parameters

#### Scenario: GCPs are control points only
- **GIVEN** the fixed map CRS state disables triangulation usage for GCPs
- **WHEN** the working transform is built
- **THEN** the package SHALL retain the GCPs as CRS/world-file control points without using them as triangulation vertices

### Requirement: Optional GCP Metadata SHALL Preserve Stable Point Indexing
The V3 data model SHALL allow optional metadata to be associated with each control point without changing the coordinate tuple indexing used by triangles and constrained edges.

#### Scenario: Metadata is present
- **GIVEN** a payload where some control points carry kind and note metadata
- **WHEN** the payload is serialized
- **THEN** the metadata SHALL remain aligned to the original point indexes used by `points`, `edges`, and `tins_points`

#### Scenario: Metadata is absent
- **GIVEN** a payload that contains only coordinate tuples
- **WHEN** it is serialized or loaded
- **THEN** the package SHALL preserve current behavior without requiring metadata fields

### Requirement: Distribution Payloads SHALL Declare Non-Editable Intent
The runtime-oriented distribution payload SHALL explicitly indicate that it is intended for transformation and distribution, not for full-fidelity re-editing.

#### Scenario: Runtime loader consumes distribution payload
- **GIVEN** a runtime distribution payload
- **WHEN** `@maplat/transform` or another consumer loads it
- **THEN** the payload kind SHALL make it clear that the transform can run without reconstructing full authoring state

#### Scenario: Editor receives distribution payload
- **GIVEN** a distribution payload is passed to an editing workflow
- **WHEN** the editor inspects the payload kind
- **THEN** it SHALL be able to reject or downgrade editing expectations instead of assuming full re-editability
