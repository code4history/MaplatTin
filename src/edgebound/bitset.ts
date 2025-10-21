/**
 * A set of numbers, stored as bits in a typed array.
 * The amount of numbers that can be stored is limited by the length,
 * which is fixed at construction time.
 */
abstract class BitSet {
  protected readonly bs: Uint8Array | Uint16Array | Uint32Array;
  protected readonly width: 8 | 16 | 32;

  protected constructor(width: BitSet["width"], bs: BitSet["bs"]) {
    this.width = width;
    this.bs = bs;
  }

  /**
   * Add a number to the set.
   *
   * @param idx The number to add. Must be 0 <= idx < len.
   */
  add(idx: number): this {
    const byte = Math.floor(idx / this.width);
    const bit = idx % this.width;
    this.bs[byte] |= 1 << bit;
    return this;
  }

  /**
   * Delete a number from the set.
   *
   * @param idx The number to delete. Must be 0 <= idx < len.
   */
  delete(idx: number): this {
    const byte = Math.floor(idx / this.width);
    const bit = idx % this.width;
    this.bs[byte] &= ~(1 << bit);
    return this;
  }

  /**
   * Add or delete a number in the set, depending on the second argument.
   *
   * @param idx The number to add or delete. Must be 0 <= idx < len.
   * @param val If true, add the number, otherwise delete.
   */
  set(idx: number, val: boolean): boolean {
    const byte = Math.floor(idx / this.width);
    const bit = idx % this.width;
    const mask = 1 << bit;
    this.bs[byte] ^= (-Number(val) ^ this.bs[byte]) & mask;
    return val;
  }

  /**
   * Whether the number is in the set.
   *
   * @param idx The number to test. Must be 0 <= idx < len.
   */
  has(idx: number): boolean {
    const byte = Math.floor(idx / this.width);
    const bit = idx % this.width;
    return (this.bs[byte] & (1 << bit)) !== 0;
  }

  /**
   * Iterate over the numbers that are in the set.
   */
  forEach(fn: (idx: number) => void): this {
    const len = this.bs.length;
    for (let byte = 0; byte < len; byte++) {
      let bit = 0;
      while (this.bs[byte] && bit < this.width) {
        if (this.bs[byte] & (1 << bit)) {
          fn(byte * this.width + bit);
        }
        bit++;
      }
    }
    return this;
  }
}

export type { BitSet };

/**
 * A bit set using 8 bits per cell.
 */
export class BitSet8 extends BitSet {
  constructor(len: number) {
    super(8, new Uint8Array(Math.ceil(len / 8)).fill(0));
  }
}

/**
 * A bit set using 16 bits per cell.
 */
export class BitSet16 extends BitSet {
  constructor(len: number) {
    super(16, new Uint16Array(Math.ceil(len / 16)).fill(0));
  }
}

/**
 * A bit set using 32 bits per cell.
 */
export class BitSet32 extends BitSet {
  constructor(len: number) {
    super(32, new Uint32Array(Math.ceil(len / 32)).fill(0));
  }
}
