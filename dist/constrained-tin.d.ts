import { FeatureCollection, Point, Polygon } from 'geojson';
import { ConstrainSnapshot } from "./edgebound/index.js";
import { Edge } from '@maplat/transform';
/**
 * 制約付きTIN（Triangulated Irregular Network）を生成します
 *
 * 点群から三角形分割を行い、指定されたエッジ（制約線）を
 * 必ず三角形の辺として含むように調整します。
 *
 * @param points - 点群を含むFeatureCollection
 *                各Featureは座標を持つPointである必要があります
 * @param edges - 制約として扱うエッジの配列
 *               各エッジは2つの頂点インデックスの組として指定
 * @param z - 生成される三角形のプロパティに含める項目の名前
 *           （例: "target"）
 *
 * @returns 三角形のFeatureCollectionを返します
 *          各三角形は以下の情報を持ちます：
 *          - geometry: 三角形の座標
 *          - properties: 頂点に関連付けられた情報（a, b, cプロパティ）
 *
 * @throws {Error} pointsがFeatureCollectionでない場合
 * @throws {Error} edgesが配列でない場合
 *
 * 処理の流れ：
 * 1. Delaunay三角分割を実行
 * 2. 制約エッジに基づいて三角分割を調整
 * 3. 結果をGeoJSON形式に変換
 */
export default function (points: FeatureCollection<Point>, edges: Edge[], z: string): FeatureCollection<Polygon>;
interface ForbiddenGroups {
    groupsOf: (vertex: number) => readonly number[];
    planes: readonly ArrayLike<number>[];
    boundary?: Edge[];
    /**
     * GCP（と必須エッジの中継点）の凸包の辺。制約の辺にして、補助頂点を含む三角形が凸包の内側に
     * 食い込まないようにする。必須エッジなどと両立しない辺は外す。
     */
    hull?: Edge[];
    allowUnusableBoundary?: boolean;
}
/**
 * 必須エッジを張った後の三角網の状態を、同じ点群・同じ必須エッジでの呼び出しの間で使い回す入れ物。
 * 外す凸包の辺だけを変えて組み直すとき、点群の三角分割と必須エッジの制約（時間の大半）を繰り返さない。
 * 使い回しても結果は変わらない（控えた状態から続きを張るのと、最初から張るのは同じ操作の列）。
 */
export interface ConstrainedTinReuse {
    snapshot?: ConstrainSnapshot;
}
/** 制約付き三角分割を作り、指定された群の禁止制約と残数を求める。 */
export declare function buildConstrainedTin(points: FeatureCollection<Point>, edges: Edge[], z: string, forbidden?: ForbiddenGroups, reuse?: ConstrainedTinReuse): {
    tin: FeatureCollection<Polygon>;
    remaining: number;
    hasBoundary: boolean;
    /** 制約にできた凸包の辺 */
    hull: Edge[];
};
export {};
