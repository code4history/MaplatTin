/**
 * @maplat/tin - TIN (Triangulated Irregular Network) generation library
 * 
 * This is the main entry point for the library.
 * Provides TIN generation with constrained edges for map transformation.
 */

// Main class exports
export { default } from './tin';
export { default as Tin } from './tin';
export type { Options } from './tin';

// Utility function exports
export { default as constrainedTin } from './constrained-tin';
export { default as findIntersections } from './kinks';
export { insertSearchIndex } from './searchutils';
export { createPoint, counterPoint, vertexCalc } from './vertexutils';

// Type exports
export type { SearchIndex } from './searchutils';
export type { IntersectionPoint } from './types/kinks';
export type { TriangleProperties } from './types/tin';

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
  Tri,
  Tins,
  Transform,
  VertexMode,
  YaxisMode
} from '@maplat/transform';

// Re-export format_version
export { format_version } from '@maplat/transform';