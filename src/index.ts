/**
 * @maplat/tin - TIN (Triangulated Irregular Network) generation library
 *
 * This is the main entry point for the library.
 * Provides TIN generation with constrained edges for map transformation.
 */

// Main class exports
export { Tin } from "./tin.ts";
export type {
  CompiledWithSupplement,
  IncrementalEvidence,
  Options,
  RebuildDiagnostics,
  RestoreFailure,
} from "./tin.ts";
export type {
  SupplementDiagnostics,
  SupplementPair,
  SupplementPairRecord,
} from "./supplement-pairs.ts";
export type { BoundaryDiagnostics } from "./boundary-search.ts";
export { Tin as default } from "./tin.ts";

// 局所更新（MaplatTin#100）
export {
  BOUNDARY_GROUP,
  EDGE_HULL,
  EDGE_PROTECT,
  EDGE_REQUIRED,
  IncrementalMesh,
} from "./incremental/mesh.ts";
export type {
  EdgeId,
  MeshAudit,
  MeshVertex,
  PointId,
  ReplaceEdit,
  ReplaceFailure,
  ReplaceResult,
  VertexRef,
} from "./incremental/mesh.ts";
export { MeshModel, meshFromCompiled } from "./incremental/model.ts";
export type { ImportFailure, MeshEdge, MeshSupplement } from "./incremental/model.ts";
export {
  insertEdge,
  insertPoint,
  movePoint,
  removeEdge,
  removePoint,
  replaceEdgeNodes,
} from "./incremental/edits.ts";
export type { EditFailure, EditResult, VertexChanges } from "./incremental/edits.ts";
export type { TinEdit, TinPatch, TinPatchFallback } from "./incremental/types.ts";

// Utility function exports
export { default as constrainedTin } from "./constrained-tin.ts";
export { default as findIntersections } from "./kinks.ts";
export { insertSearchIndex } from "./searchutils.ts";
export { counterPoint, createPoint, vertexCalc } from "./vertexutils.ts";

// Type exports
export type { SearchIndex } from "./searchutils.ts";
export type { IntersectionPoint } from "./types/kinks.ts";
export type { TriangleProperties } from "./types/tin.ts";

// Re-export types from @maplat/transform
export type {
  Compiled,
  CompiledExtrapolate,
  CompiledTransformData,
  CompiledWorldFileOuter,
  Edge,
  EdgeSet,
  EdgeSetLegacy,
  PointSet,
  PropertyTriKey,
  StrictMode,
  StrictStatus,
  Tins,
  Transform,
  Tri,
  VertexMode,
  WorldFile,
  YaxisMode,
} from "@maplat/transform";

// Tin が書き出す V2 フォーマット版
export { FORMAT_VERSION_V2 as format_version } from "./tin.ts";
