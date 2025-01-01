import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { featureCollection, point } from "@turf/helpers";
import { getCoords } from "@turf/invariant";
import { indexesToTri, normalizeNodeKey } from "./triangulation";
import { Feature, Polygon, Position, Point, FeatureCollection } from "geojson";
import { normalizeEdges } from "./edgeutils";
import type { 
  WeightBuffer, Tins, VerticesParams, PropertyTriKey, 
  IndexedTins, Tri
} from "./geometry";
import { unitCalc, transformArr } from "./geometry";
import type { EdgeSet, EdgeSetLegacy } from "./edgeutils";

export type PointSet = [Position, Position];
export type BiDirectionKey = "forw" | "bakw";
export type WeightBufferBD = { [key in BiDirectionKey]?: WeightBuffer };
export type VertexMode = "plain" | "birdeye";
export type StrictMode = "strict" | "auto" | "loose";
export type StrictStatus = "strict" | "strict_error" | "loose";
export type YaxisMode = "follow" | "invert";
export type Centroid = Feature<Point>;
export type CentroidBD = { [key in BiDirectionKey]?: Centroid };
export type TinsBD = { [key in BiDirectionKey]?: Tins };
export type Kinks = FeatureCollection<Point>;
export type KinksBD = { [key in BiDirectionKey]?: Kinks };
export type VerticesParamsBD = { [key in BiDirectionKey]?: VerticesParams };
export type IndexedTinsBD = { [key in BiDirectionKey]?: IndexedTins };

export const format_version = 2.00703; //(Version 2 format for library version 0.7.3)

export interface Compiled {
  version?: number;
  points: PointSet[];
  tins_points: (number | string)[][][];
  weight_buffer: WeightBufferBD;
  strict_status?: StrictStatus;
  centroid_point: Position[];
  edgeNodes?: PointSet[];
  kinks_points?: Position[];
  yaxisMode?: YaxisMode;
  vertexMode?: VertexMode;
  strictMode?: StrictMode;
  vertices_params: number[][];
  vertices_points: PointSet[];
  edges: EdgeSet[];
  bounds?: number[][];
  boundsPolygon?: Feature<Polygon>;
  wh?: number[];
  xy?: number[];
}

// For old Interface
export interface CompiledLegacy extends Compiled {
  tins?: TinsBD;
  centroid?: CentroidBD;
  kinks?: KinksBD;
  vertices_params: number[][] & VerticesParamsBD;
  edges: EdgeSet[] & EdgeSetLegacy[];
}


export class Transform {
  static VERTEX_PLAIN = "plain" as const;
  static VERTEX_BIRDEYE = "birdeye" as const;
  static MODE_STRICT = "strict" as const;
  static MODE_AUTO = "auto" as const;
  static MODE_LOOSE = "loose" as const;
  static STATUS_STRICT = "strict" as const;
  static STATUS_ERROR = "strict_error" as const;
  static STATUS_LOOSE = "loose" as const;
  static YAXIS_FOLLOW = "follow" as const;
  static YAXIS_INVERT = "invert" as const;

  points: PointSet[] = [];
  pointsWeightBuffer?: WeightBufferBD;
  strict_status?: StrictStatus;
  vertices_params?: VerticesParamsBD;
  centroid?: CentroidBD;
  edgeNodes?: PointSet[];
  edges?: EdgeSet[];
  tins?: TinsBD;
  kinks?: KinksBD;
  yaxisMode: YaxisMode = Transform.YAXIS_INVERT;
  strictMode: StrictMode = Transform.MODE_AUTO;
  vertexMode?: VertexMode = Transform.VERTEX_PLAIN;
  bounds?: number[][];
  boundsPolygon?: Feature<Polygon>;
  wh?: number[];
  xy?: number[];
  indexedTins?: IndexedTinsBD;
  stateFull = false;
  stateTriangle?: Tri;
  stateBackward?: boolean;

  constructor() {}

  setCompiled(compiled: Compiled | CompiledLegacy) {
    if (
      compiled.version ||
      (!(compiled as any).tins && compiled.points && compiled.tins_points)
    ) {
      // 新コンパイルロジック
      // pointsはそのままpoints
      this.points = compiled.points;
      // After 0.7.3 Normalizing old formats for weightBuffer
      this.pointsWeightBuffer =
      !compiled.version || compiled.version < 2.00703
        ? (["forw", "bakw"] as BiDirectionKey[]).reduce((bd, forb) => {
          const base = compiled.weight_buffer[forb];
          if (base) {
          bd[forb] = Object.keys(base!).reduce((buffer, key) => {
            const normKey = normalizeNodeKey(key);
            buffer[normKey] = base![key];
            return buffer;
          }, {} as WeightBuffer);
          }
          return bd;
        }, {} as WeightBufferBD)
        : compiled.weight_buffer;
      // kinksやtinsの存在状況でstrict_statusを判定
      if (compiled.strict_status) {
      this.strict_status = compiled.strict_status;
      } else if (compiled.kinks_points) {
      this.strict_status = Transform.STATUS_ERROR;
      } else if (compiled.tins_points.length == 2) {
      this.strict_status = Transform.STATUS_LOOSE;
      } else {
      this.strict_status = Transform.STATUS_STRICT;
      }
      // vertices_paramsを復元
      this.vertices_params = {
      forw: [(compiled.vertices_params as number[][])[0]],
      bakw: [(compiled.vertices_params as number[][])[1]]
      };
      this.vertices_params.forw![1] = [0, 1, 2, 3].map(idx => {
      const idxNxt = (idx + 1) % 4;
      const tri = indexesToTri(
        ["c", `b${idx}`, `b${idxNxt}`],
        compiled.points,
        compiled.edgeNodes || [],
        compiled.centroid_point,
        compiled.vertices_points,
        false,
        format_version
      );
      return featureCollection([tri]);
      });
      this.vertices_params.bakw![1] = [0, 1, 2, 3].map(idx => {
      const idxNxt = (idx + 1) % 4;
      const tri = indexesToTri(
        ["c", `b${idx}`, `b${idxNxt}`],
        compiled.points,
        compiled.edgeNodes || [],
        compiled.centroid_point,
        compiled.vertices_points,
        true,
        format_version
      );
      return featureCollection([tri]);
      });
      // centroidを復元
      this.centroid = {
      forw: point(compiled.centroid_point[0], {
        target: {
        geom: compiled.centroid_point[1],
        index: "c"
        }
      }),
      bakw: point(compiled.centroid_point[1], {
        target: {
        geom: compiled.centroid_point[0],
        index: "c"
        }
      })
      };
      // edgesを復元
      this.edges = normalizeEdges(compiled.edges || []);
      this.edgeNodes = compiled.edgeNodes || [];
      // tinsを復元
      const bakwI = compiled.tins_points.length == 1 ? 0 : 1;
      this.tins = {
      forw: featureCollection(
        compiled.tins_points[0].map((idxes: any) =>
        indexesToTri(
          idxes,
          compiled.points,
          compiled.edgeNodes || [],
          compiled.centroid_point,
          compiled.vertices_points,
          false,
          compiled.version
        )
        )
      ),
      bakw: featureCollection(
        compiled.tins_points[bakwI].map((idxes: any) =>
        indexesToTri(
          idxes,
          compiled.points,
          compiled.edgeNodes || [],
          compiled.centroid_point,
          compiled.vertices_points,
          true,
          compiled.version
        )
        )
      )
      };
      this.addIndexedTin();
      // kinksを復元
      if (compiled.kinks_points) {
      this.kinks = {
        bakw: featureCollection(
        compiled.kinks_points.map((coord: Position) => point(coord))
        )
      };
      }
      // yaxisModeを復元
      if (compiled.yaxisMode) {
        this.yaxisMode = compiled.yaxisMode;
      } else {
        this.yaxisMode = Transform.YAXIS_INVERT;
      }
      // After 0.7.3: Restore strict_mode & vertex_mode
      if (compiled.vertexMode) {
        this.vertexMode = compiled.vertexMode;
      }
      if (compiled.strictMode) {
        this.strictMode = compiled.strictMode;
      }
      // boundsを復元
      if (compiled.bounds) {
      this.bounds = compiled.bounds;
      this.boundsPolygon = compiled.boundsPolygon;
      this.xy = compiled.xy;
      this.wh = compiled.wh;
      } else {
      this.xy = [0, 0];
      if (compiled.wh) this.wh = compiled.wh;
      this.bounds = undefined;
      this.boundsPolygon = undefined;
      }
    } else {
      // 旧コンパイルロジック
      compiled = JSON.parse(
      JSON.stringify(compiled)
        .replace('"cent"', '"c"')
        .replace(/"bbox(\d+)"/g, '"b$1"')
      );
      this.tins = (compiled as CompiledLegacy).tins;
      this.addIndexedTin();
      this.strict_status = compiled.strict_status;
      this.pointsWeightBuffer = compiled.weight_buffer;
      this.vertices_params = compiled.vertices_params as VerticesParamsBD;
      this.centroid = (compiled as CompiledLegacy).centroid;
      this.kinks = (compiled as CompiledLegacy).kinks;
      const points: any = [];
      for (let i = 0; i < this.tins!.forw!.features.length; i++) {
      const tri = this.tins!.forw!.features[i];
      (["a", "b", "c"] as PropertyTriKey[]).map((key, idx) => {
        const forw = tri.geometry!.coordinates[0][idx];
        const bakw = tri.properties![key].geom;
        const pIdx = tri.properties![key].index;
        points[pIdx] = [forw, bakw];
      });
      }
      this.points = points;
    }
    // 翻訳したオブジェクトを返す
    return {
      tins: this.tins,
      strict_status: this.strict_status,
      weight_buffer: this.pointsWeightBuffer,
      vertices_params: this.vertices_params,
      centroid: this.centroid,
      kinks: this.kinks
    };
  }

  addIndexedTin() {
    const tins = this.tins!;
    const forw = tins.forw;
    const bakw = tins.bakw;
    const gridNum = Math.ceil(Math.sqrt(forw!.features.length));
    if (gridNum < 3) {
      this.indexedTins = undefined;
      return;
    }
    let forwBound: Position[] = [];
    let bakwBound: Position[] = [];
    const forwEachBound = forw!.features.map((tri: Tri) => {
      let eachBound: Position[] = [];
      getCoords(tri)[0].map((point: Position) => {
        if (forwBound.length === 0)
          forwBound = [Array.from(point), Array.from(point)];
        else {
          if (point[0] < forwBound[0][0]) forwBound[0][0] = point[0];
          if (point[0] > forwBound[1][0]) forwBound[1][0] = point[0];
          if (point[1] < forwBound[0][1]) forwBound[0][1] = point[1];
          if (point[1] > forwBound[1][1]) forwBound[1][1] = point[1];
        }
        if (eachBound.length === 0)
          eachBound = [Array.from(point), Array.from(point)];
        else {
          if (point[0] < eachBound[0][0]) eachBound[0][0] = point[0];
          if (point[0] > eachBound[1][0]) eachBound[1][0] = point[0];
          if (point[1] < eachBound[0][1]) eachBound[0][1] = point[1];
          if (point[1] > eachBound[1][1]) eachBound[1][1] = point[1];
        }
      });
      return eachBound;
    });
    const forwXUnit = (forwBound[1][0] - forwBound[0][0]) / gridNum;
    const forwYUnit = (forwBound[1][1] - forwBound[0][1]) / gridNum;
    const forwGridCache = forwEachBound.reduce(
      (prev: number[][][], bound: Position[], index: number) => {
        const normXMin = unitCalc(
          bound[0][0],
          forwBound[0][0],
          forwXUnit,
          gridNum
        );
        const normXMax = unitCalc(
          bound[1][0],
          forwBound[0][0],
          forwXUnit,
          gridNum
        );
        const normYMin = unitCalc(
          bound[0][1],
          forwBound[0][1],
          forwYUnit,
          gridNum
        );
        const normYMax = unitCalc(
          bound[1][1],
          forwBound[0][1],
          forwYUnit,
          gridNum
        );
        for (let cx = normXMin; cx <= normXMax; cx++) {
          if (!prev[cx]) prev[cx] = [];
          for (let cy = normYMin; cy <= normYMax; cy++) {
            if (!prev[cx][cy]) prev[cx][cy] = [];
            prev[cx][cy].push(index);
          }
        }
        return prev;
      },
      []
    );
    const bakwEachBound = bakw!.features.map((tri: Tri) => {
      let eachBound: Position[] = [];
      getCoords(tri)[0].map((point: Position) => {
        if (bakwBound.length === 0)
          bakwBound = [Array.from(point), Array.from(point)];
        else {
          if (point[0] < bakwBound[0][0]) bakwBound[0][0] = point[0];
          if (point[0] > bakwBound[1][0]) bakwBound[1][0] = point[0];
          if (point[1] < bakwBound[0][1]) bakwBound[0][1] = point[1];
          if (point[1] > bakwBound[1][1]) bakwBound[1][1] = point[1];
        }
        if (eachBound.length === 0)
          eachBound = [Array.from(point), Array.from(point)];
        else {
          if (point[0] < eachBound[0][0]) eachBound[0][0] = point[0];
          if (point[0] > eachBound[1][0]) eachBound[1][0] = point[0];
          if (point[1] < eachBound[0][1]) eachBound[0][1] = point[1];
          if (point[1] > eachBound[1][1]) eachBound[1][1] = point[1];
        }
      });
      return eachBound;
    });
    const bakwXUnit = (bakwBound[1][0] - bakwBound[0][0]) / gridNum;
    const bakwYUnit = (bakwBound[1][1] - bakwBound[0][1]) / gridNum;
    const bakwGridCache = bakwEachBound.reduce(
      (prev: any, bound: any, index: number) => {
        const normXMin = unitCalc(
          bound[0][0],
          bakwBound[0][0],
          bakwXUnit,
          gridNum
        );
        const normXMax = unitCalc(
          bound[1][0],
          bakwBound[0][0],
          bakwXUnit,
          gridNum
        );
        const normYMin = unitCalc(
          bound[0][1],
          bakwBound[0][1],
          bakwYUnit,
          gridNum
        );
        const normYMax = unitCalc(
          bound[1][1],
          bakwBound[0][1],
          bakwYUnit,
          gridNum
        );
        for (let cx = normXMin; cx <= normXMax; cx++) {
          if (!prev[cx]) prev[cx] = [];
          for (let cy = normYMin; cy <= normYMax; cy++) {
            if (!prev[cx][cy]) prev[cx][cy] = [];
            prev[cx][cy].push(index);
          }
        }
        return prev;
      },
      []
    );
    this.indexedTins = {
      forw: {
        gridNum,
        xOrigin: forwBound[0][0],
        yOrigin: forwBound[0][1],
        xUnit: forwXUnit,
        yUnit: forwYUnit,
        gridCache: forwGridCache
      },
      bakw: {
        gridNum,
        xOrigin: bakwBound[0][0],
        yOrigin: bakwBound[0][1],
        xUnit: bakwXUnit,
        yUnit: bakwYUnit,
        gridCache: bakwGridCache
      }
    };
  }

  transform(apoint: number[], backward?: boolean, ignoreBounds?: boolean) {
    if (backward && this.strict_status == Transform.STATUS_ERROR)
      throw 'Backward transform is not allowed if strict_status == "strict_error"';
    // if (!this.tins) this.updateTin();
    if (this.yaxisMode == Transform.YAXIS_FOLLOW && backward) {
      apoint = [apoint[0], -1 * apoint[1]];
    }
    const tpoint = point(apoint);
    if (this.bounds && !backward && !ignoreBounds) {
      if (!booleanPointInPolygon(tpoint, this.boundsPolygon!)) return false;
    }
    const tins = backward ? this.tins!.bakw : this.tins!.forw;
    const indexedTins = backward
      ? this.indexedTins!.bakw
      : this.indexedTins!.forw;
    const verticesParams = backward
      ? this.vertices_params!.bakw
      : this.vertices_params!.forw;
    const centroid = backward ? this.centroid!.bakw : this.centroid!.forw;
    const weightBuffer = backward
      ? this.pointsWeightBuffer!.bakw
      : this.pointsWeightBuffer!.forw;
    let stateTriangle = undefined,
      stateSetFunc = undefined;
    if (this.stateFull) {
      if (this.stateBackward == backward) {
        stateTriangle = this.stateTriangle;
      } else {
        this.stateBackward = backward;
        this.stateTriangle = undefined;
      }
      stateSetFunc = (tri?: Tri) => {
        this.stateTriangle = tri;
      };
    }
    let ret = transformArr(
      tpoint,
      tins!,
      indexedTins,
      verticesParams,
      centroid,
      weightBuffer,
      stateTriangle,
      stateSetFunc
    );
    if (this.bounds && backward && !ignoreBounds) {
      const rpoint = point(ret);
      if (!booleanPointInPolygon(rpoint, this.boundsPolygon!)) return false;
    } else if (this.yaxisMode == Transform.YAXIS_FOLLOW && !backward) {
      ret = [ret[0], -1 * ret[1]];
    }
    return ret;
  }

}