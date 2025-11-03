/**
 * @maplat/tin - TIN (Triangulated Irregular Network) generation library
 *
 * This is the main entry point for the library.
 * Provides TIN generation with constrained edges for map transformation.
 */
export { Tin } from "./tin";
export type { Options } from "./tin";
export { Tin as default } from "./tin";
export { default as constrainedTin } from "./constrained-tin";
export { default as findIntersections } from "./kinks";
export { insertSearchIndex } from "./searchutils";
export { counterPoint, createPoint, vertexCalc } from "./vertexutils";
export type { SearchIndex } from "./searchutils";
export type { IntersectionPoint } from "./types/kinks.d";
export type { TriangleProperties } from "./types/tin.d";
export type { Compiled, Edge, EdgeSet, EdgeSetLegacy, PointSet, PropertyTriKey, StrictMode, StrictStatus, Tins, Transform, Tri, VertexMode, YaxisMode, } from '@maplat/transform';
export { format_version } from '@maplat/transform';
