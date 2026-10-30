/**
 * @maplat/tin - TIN (Triangulated Irregular Network) generation library
 *
 * This is the main entry point for the library.
 * Provides TIN generation with constrained edges for map transformation.
 */
export { Tin } from "./tin.js";
export type { Options } from "./tin.js";
export { Tin as default } from "./tin.js";
export { default as constrainedTin } from "./constrained-tin.js";
export { default as findIntersections } from "./kinks.js";
export { insertSearchIndex } from "./searchutils.js";
export { counterPoint, createPoint, vertexCalc } from "./vertexutils.js";
export type { SearchIndex } from "./searchutils.js";
export type { IntersectionPoint } from "./types/kinks.js";
export type { TriangleProperties } from "./types/tin.js";
export type { Compiled, Edge, EdgeSet, EdgeSetLegacy, PointSet, PropertyTriKey, StrictMode, StrictStatus, Tins, Transform, Tri, VertexMode, YaxisMode, } from '@maplat/transform';
export { FORMAT_VERSION_V2 as format_version } from "./tin.js";
