/**
 * @maplat/tin - TIN (Triangulated Irregular Network) generation library
 * 
 * This is the main entry point for the library.
 * Provides TIN generation with constrained edges for map transformation.
 */

// Main class exports
export { Tin } from './tin.ts';
export type { Options } from './tin.ts';

// Utility function exports
export { default as constrainedTin } from './constrained-tin.ts';
export { default as findIntersections } from './kinks.ts';
export { insertSearchIndex } from './searchutils.ts';
export { createPoint, counterPoint, vertexCalc } from './vertexutils.ts';

// Type exports
export type { SearchIndex } from './searchutils.ts';
export type { IntersectionPoint } from './types/kinks.ts';
export type { TriangleProperties } from './types/tin.ts';

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

// Re-export format_version with fallback
export { format_version } from '@maplat/transform';

// Also export a safe version getter function
export function getFormatVersion(): number {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { format_version } = require('@maplat/transform');
    return format_version;
  } catch {
    return 2.00703; // fallback version
  }
}