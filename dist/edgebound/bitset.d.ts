/**
 * A set of numbers, stored as bits in a typed array.
 * The amount of numbers that can be stored is limited by the length,
 * which is fixed at construction time.
 */
declare abstract class BitSet {
    protected readonly bs: Uint8Array | Uint16Array | Uint32Array;
    protected readonly width: 8 | 16 | 32;
    protected constructor(width: BitSet["width"], bs: BitSet["bs"]);
    /**
     * Add a number to the set.
     *
     * @param idx The number to add. Must be 0 <= idx < len.
     */
    add(idx: number): this;
    /**
     * Delete a number from the set.
     *
     * @param idx The number to delete. Must be 0 <= idx < len.
     */
    delete(idx: number): this;
    /**
     * Add or delete a number in the set, depending on the second argument.
     *
     * @param idx The number to add or delete. Must be 0 <= idx < len.
     * @param val If true, add the number, otherwise delete.
     */
    set(idx: number, val: boolean): boolean;
    /**
     * Whether the number is in the set.
     *
     * @param idx The number to test. Must be 0 <= idx < len.
     */
    has(idx: number): boolean;
    /**
     * Iterate over the numbers that are in the set.
     */
    forEach(fn: (idx: number) => void): this;
}
export type { BitSet };
/**
 * A bit set using 8 bits per cell.
 */
export declare class BitSet8 extends BitSet {
    constructor(len: number);
}
/**
 * A bit set using 16 bits per cell.
 */
export declare class BitSet16 extends BitSet {
    constructor(len: number);
}
/**
 * A bit set using 32 bits per cell.
 */
export declare class BitSet32 extends BitSet {
    constructor(len: number);
}
