import { TinsBD } from '@maplat/transform';
import { SearchIndex } from "./searchutils";
type ConstraintEdges = number[][];
export declare function resolveOverlaps(tins: TinsBD, searchIndex: SearchIndex, edges: ConstraintEdges): boolean;
export {};
