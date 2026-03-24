import { TinsBD, WeightBufferBD } from '@maplat/transform';
interface WeightBufferOptions {
    tins: TinsBD;
    targets: Array<keyof TinsBD>;
    includeReciprocals: boolean;
    /** Number of boundary vertices (b0..b{N-1}).  Defaults to 4 for v2 format. */
    numBoundaryVertices?: number;
}
/**
 * Calculate per-point stretch ratios used for non-linear interpolation.
 */
export declare function buildPointsWeightBuffer(options: WeightBufferOptions): WeightBufferBD;
export {};
