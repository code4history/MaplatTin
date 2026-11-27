import { Feature, Point, Position } from 'geojson';
import { Edge, Tins } from '@maplat/transform';
import { VertexPosition } from "../types/tin.js";
import { IncrementalMesh, ReplaceEdit, ReplaceFailure } from "./mesh.js";
type VertexIndex = number | string;
/** 全部組み直しの途中の網と、compiled の番号との対応。 */
export interface BuildMesh {
    mesh: IncrementalMesh;
    /** 頂点の id → 番号（対応点は数、中継点・補完点は `e{n}`、補助頂点は `b{n}`） */
    indexOf: Map<number, VertexIndex>;
    /** 内側の点（対応点・中継点・補完点）の頂点の id。点群の配列位置の順 */
    interior: number[];
    /** 補助頂点の頂点の id（輪の中の順） */
    ring: number[];
}
/**
 * 今の手順で組んだ三角網（紙の面）から、網を作る。
 *
 * @param points 点群（内側の点の後ろに補助頂点。`pointsSet.forw.features`）
 * @param tins 紙の面の三角網
 * @param segments 必須エッジの区間（点群の配列位置の組）
 * @param gcpCount 対応点の数
 * @param sigma 網の向き。全部の三角形の多数決と合わなければ undefined を返す
 */
export declare function buildMeshFromTins(points: readonly Feature<Point>[], tins: Tins, segments: readonly Edge[], gcpCount: number, sigma: -1 | 1): BuildMesh | undefined;
/** 網を複製する（頂点の表の中身は共有する。試行は、今ある頂点を動かさない）。 */
export declare function cloneBuildMesh(build: BuildMesh): BuildMesh;
/** 網を、紙の面の三角網（GeoJSON。頂点の属性に地理面の座標と番号）へ書き出す。 */
export declare function tinsFromMesh(build: BuildMesh): Tins;
export interface BandReplacement {
    /** 新しい補助頂点（輪の中の順） */
    vertices: readonly VertexPosition[];
    /** 帯に足す内側の点（補完点）。点群の末尾に足す */
    addPoints?: readonly {
        index: VertexIndex;
        forw: Position;
        bakw: Position;
    }[];
    /** 制約にしたい凸包の辺（内側の点の配列位置の組。足す点は、今の内側の点の後ろ） */
    hull: readonly Edge[];
    /** 帯と一緒に差し替える三角形（外す凸包の辺の両側の三角形・点の編集の範囲） */
    extra?: Iterable<number>;
    /** okNew でない三角形が残っても採る（全部組み直しの中の試行だけ） */
    allowBad?: boolean;
    /** 紙の面だけで組む（全部組み直しの中の試行だけ。重なりの解消は、差し替えの後に別に行う） */
    forwOnly?: boolean;
    /** 一緒に行う頂点の編集（点の編集と帯の差し替えを 1 回で行うとき） */
    edit?: Pick<ReplaceEdit, "move" | "add" | "remove" | "release" | "constrain">;
}
export type BandFailure = ReplaceFailure | "bandNotAnnulus";
/**
 * 帯（補助頂点を 1 つ以上含む三角形の全部）を差し替える（設計書 §6.2）。
 *
 * 古い補助頂点を消し、新しい補助頂点の輪を網の外周にする。帯の内側の境（内側の網と共有する辺）は固定する。
 * 凸包の辺は「張れたら張る辺」で、必須エッジなどと両立しなければ外す。失敗したときは、網を変えない。
 *
 * @returns 成功したら、制約にできた（網の辺にある）凸包の辺
 */
export declare function replaceBand(build: BuildMesh, options: BandReplacement): {
    ok: true;
    applied: Edge[];
    removed: number[];
    added: number[];
} | {
    ok: false;
    reason: BandFailure;
};
/** 補助頂点を含む三角形のうち、ok でないものの数（今の `boundaryTriangleFlips` に当たる）。 */
export declare function countBadBandTriangles(build: BuildMesh): number;
export {};
