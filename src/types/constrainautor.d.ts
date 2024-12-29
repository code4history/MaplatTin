declare module '@kninnug/constrainautor' {
  export default class Constrainautor {
    constructor(delaunay: any);
    constrainAll(edges: [number, number][]): void;
  }
}