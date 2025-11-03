import { TinsBD, WeightBufferBD } from '@maplat/transform';
interface WeightBufferOptions {
    tins: TinsBD;
    targets: Array<keyof TinsBD>;
    includeReciprocals: boolean;
}
/**
 * Calculate per-point stretch ratios used for non-linear interpolation.
 */
export declare function buildPointsWeightBuffer(options: WeightBufferOptions): WeightBufferBD;
export {};
