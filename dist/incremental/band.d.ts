import { Position } from 'geojson';
import { MeshModel } from "./model.js";
/** C7: 内側の点の算術平均が、帯を作ったときから、外接矩形の対角線のこの割合を超えて動いたら、帯を作り直す。 */
export declare const CENTROID_DRIFT_LIMIT = 0.005;
/** 編集で動く・増える・消える点（中継点を含む。C1）。 */
export interface BandChange {
    /** 今ある頂点（動かす・消す）。足す点では undefined */
    vertex?: number;
    /** 新しい位置（消す点では undefined） */
    to?: {
        forw: Position;
        bakw: Position;
    };
    /** 対応点か（外接矩形は対応点だけで取る） */
    gcp: boolean;
    /** 重心（算術平均）に入るか（対応点と中継点。補完点は入らない） */
    counted: boolean;
}
/** 編集の後の、内側の点の紙の面の座標の和と数。 */
export interface BandTotals {
    sum: [number, number];
    count: number;
}
export declare class BandStats {
    /** 両面の凸包（内側の点の全部で取る）と、凸包の辺の上にある頂点 */
    private hull;
    private hullVertices;
    /** 対応点の外接矩形（紙の面）と、その端を与える頂点 */
    private box;
    /** 区分ごとの、最も外側の点までの距離（点が無い区分は −1）と、その頂点 */
    private binMax;
    private binHolders;
    /** 補助頂点の輪（地理面）と、扇形の中心 */
    private ring;
    private centroid;
    /** 内側の点（対応点と中継点）の紙の面の座標の和と数。帯を作ったときの平均 */
    private sum;
    private count;
    private mean0;
    private diagonal;
    private constructor();
    /** 判定できない網（world file 外周・補助頂点の輪が網の外周でない網）では null。 */
    static of(model: MeshModel): BandStats | null;
    private forwDistance;
    /**
     * 地理面で、重心から輪までの距離に対する、重心から点までの距離の比（輪の内側なら 1 未満）。
     * 輪と交わらない方向なら Infinity。
     */
    private ringRatio;
    /**
     * 編集が、帯を更新しなくてよい条件（C1〜C7）を全部満たすか。満たすなら、編集の後の座標の和と数を返す
     * （編集を当てた後に {@link commit} へ渡す）。満たさなければ undefined。網を動かす前に呼ぶ。
     */
    keeps(model: MeshModel, changes: readonly BandChange[]): BandTotals | undefined;
    /** 当てた編集を、算術平均に反映する（{@link keeps} が返した値を渡す）。 */
    commit(totals: BandTotals): void;
}
