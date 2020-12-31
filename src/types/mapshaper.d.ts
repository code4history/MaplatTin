declare module "mapshaper" {
  namespace internal {
    function dedupIntersections(xy: any): any[];
    function findSegmentIntersections(args: any): any;
    class ArcCollection {
      constructor(...args: any);
    }
  }
}
