import { Feature, Point, Position } from 'geojson';
import { Transform, Compiled, Edge, EdgeSet, EdgeSetLegacy, PointSet, StrictMode, VertexMode, YaxisMode } from '@maplat/transform';
import { PointsSetBD } from "./types/tin.d";
/**
 * Tinクラスの初期化オプション
 */
export interface Options {
    bounds?: Position[];
    wh?: number[];
    vertexMode?: VertexMode;
    strictMode?: StrictMode;
    yaxisMode?: YaxisMode;
    importance?: number;
    priority?: number;
    stateFull?: boolean;
    points?: PointSet[];
    edges?: EdgeSet[];
}
/**
 * Tin (Triangulated Irregular Network) クラス
 * Transformクラスを拡張し、TINネットワークの生成機能を追加
 */
export declare class Tin extends Transform {
    importance: number;
    priority: number;
    pointsSet: PointsSetBD | undefined;
    /**
     * Tinクラスのインスタンスを生成します
     * @param options - 初期化オプション
     */
    constructor(options?: Options);
    /**
     * フォーマットバージョンを取得します
     */
    getFormatVersion(): number;
    /**
     * 制御点（GCP: Ground Control Points）を設定します。
     * 指定した点群に合わせて内部のTINキャッシュをリセットします。
     */
    setPoints(points: PointSet[]): void;
    /**
     * エッジ（制約線）を設定します。
     * 制約線を正規化した上で、依存するキャッシュをリセットします。
     */
    setEdges(edges?: EdgeSet[] | EdgeSetLegacy[]): void;
    /**
     * 境界ポリゴンを設定します
     */
    setBounds(bounds: Position[]): void;
    /**
     * 現在の設定を永続化可能な形式にコンパイルします
     */
    getCompiled(): Compiled;
    /**
     * 幅と高さを設定します
     */
    setWh(wh?: number[]): void;
    /**
     * 頂点モードを設定します
     */
    setVertexMode(mode: VertexMode): void;
    /**
     * 厳密性モードを設定します
     */
    setStrictMode(mode: StrictMode): void;
    /**
     * 厳密なTINを計算します
     */
    calcurateStrictTin(): void;
    /**
     * 点群セットを生成します。
    * GCP と中間エッジノードを GeoJSON Point に変換し、後続の三角分割に備えます。
     */
    generatePointsSet(): {
        forw: Feature<Point>[];
        bakw: Feature<Point>[];
        edges: Edge[];
    };
    /**
     * 入力データの検証と初期データの準備
     */
    private validateAndPrepareInputs;
    /**
     * TINネットワークを同期的に更新し、座標変換の準備を行います。
     * 重めの計算を伴うため、呼び出し側が非同期制御を行いたい場合は
     * {@link updateTinAsync} を利用してください。
     */
    updateTin(): void;
    /**
     * 非同期ラッパーを提供します。
     * 互換性のために Promise ベースの API を維持しますが、内部処理は同期的です。
     */
    updateTinAsync(): Promise<void>;
}
