declare module "robust-predicates" {
  export function orient2d(
    ax: number,
    ay: number,
    bx: number,
    by: number,
    cx: number,
    cy: number,
  ): number;

  export function incircle(
    ax: number,
    ay: number,
    bx: number,
    by: number,
    cx: number,
    cy: number,
    dx: number,
    dy: number,
  ): number;
}
