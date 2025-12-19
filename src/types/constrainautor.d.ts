declare module "@kninnug/constrainautor" {
  export default class Constrainautor {
    constructor(delaunay: unknown);
    constrainAll(edges: [number, number][]): void;
  }
}
