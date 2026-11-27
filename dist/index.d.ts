/**
 * @maplat/tin - TIN (Triangulated Irregular Network) generation library
 *
 * This is the main entry point for the library.
 * Provides TIN generation with constrained edges for map transformation.
 */
export { Tin } from "./tin.js";
export type { CompiledWithSupplement, Options, RebuildDiagnostics } from "./tin.js";
export type { SupplementDiagnostics, SupplementPair, SupplementPairRecord, } from "./supplement-pairs.js";
export type { BoundaryDiagnostics } from "./boundary-search.js";
export { Tin as default } from "./tin.js";
export { BOUNDARY_GROUP, EDGE_HULL, EDGE_PROTECT, EDGE_REQUIRED, IncrementalMesh, } from "./incremental/mesh.js";
export type { EdgeId, MeshAudit, MeshVertex, PointId, ReplaceEdit, ReplaceFailure, ReplaceResult, VertexRef, } from "./incremental/mesh.js";
export { MeshModel, meshFromCompiled } from "./incremental/model.js";
export type { ImportFailure, MeshEdge, MeshSupplement } from "./incremental/model.js";
export { insertEdge, insertPoint, movePoint, removeEdge, removePoint, replaceEdgeNodes, } from "./incremental/edits.js";
export type { EditFailure, EditResult, VertexChanges } from "./incremental/edits.js";
export type { TinEdit, TinPatch, TinPatchFallback } from "./incremental/types.js";
export { default as constrainedTin } from "./constrained-tin.js";
export { default as findIntersections } from "./kinks.js";
export { insertSearchIndex } from "./searchutils.js";
export { counterPoint, createPoint, vertexCalc } from "./vertexutils.js";
export type { SearchIndex } from "./searchutils.js";
export type { IntersectionPoint } from "./types/kinks.js";
export type { TriangleProperties } from "./types/tin.js";
export type { Compiled, CompiledExtrapolate, CompiledTransformData, CompiledWorldFileOuter, Edge, EdgeSet, EdgeSetLegacy, PointSet, PropertyTriKey, StrictMode, StrictStatus, Tins, Transform, Tri, VertexMode, WorldFile, YaxisMode, } from '@maplat/transform';
export { FORMAT_VERSION_V2 as format_version } from "./tin.js";
