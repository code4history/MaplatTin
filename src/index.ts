/**
 * @maplat/tin - TIN (Triangulated Irregular Network) generation library
 *
 * This is the main entry point for the library.
 * Provides TIN generation with constrained edges for map transformation.
 */

// Main class exports
export { Tin } from "./tin.ts";
export type { Options } from "./tin.ts";
export { Tin as default } from "./tin.ts";

// Utility function exports
export { default as constrainedTin } from "./constrained-tin.ts";
export { default as findIntersections } from "./kinks.ts";
export { insertSearchIndex } from "./searchutils.ts";
export { counterPoint, createPoint, vertexCalc } from "./vertexutils.ts";

// Type exports
export type { SearchIndex } from "./searchutils.ts";
export type { IntersectionPoint } from "./types/kinks.d.ts";
export type { TriangleProperties } from "./types/tin.d.ts";

// Re-export types from @maplat/transform
export type {
  Compiled,
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
  YaxisMode,
} from "@maplat/transform";

// Re-export format_version
export { format_version } from "@maplat/transform";
