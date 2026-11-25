import { Feature, Point, Position } from 'geojson';
import { Transform, CompiledLegacy, CompiledTransformData, Edge, EdgeSet, EdgeSetLegacy, PointSet, StrictMode, VertexMode, WorldFile, YaxisMode } from '@maplat/transform';
import { BoundaryDiagnostics } from "./boundary-search.js";
import { PointsSetBD } from "./types/tin.js";
export declare const FORMAT_VERSION_V2 = 2.00704;
export declare const FORMAT_VERSION_V3 = 3.00001;
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
    /** true にすると v2 アルゴリズム（wh bbox・turf 重心・4 境界頂点）で build する */
    useV2Algorithm?: boolean;
    /** V3 の四辺形の外側で使う変換。省略時は従来の扇形外挿。 */
    outerTransform?: "extrapolate" | "worldFile";
    /** 四辺形の外側に使う world file。`outerTransform: "worldFile"` のとき必須。 */
    worldFile?: WorldFile;
}
/**
 * Tin (Triangulated Irregular Network) クラス
 * Transformクラスを拡張し、TINネットワークの生成機能を追加
 */
export declare class Tin extends Transform {
    importance: number;
    priority: number;
    pointsSet: PointsSetBD | undefined;
    useV2Algorithm: boolean;
    private lastBoundaryDiagnostics?;
    private requestedWorldFile?;
    private compiledOuter?;
    /** 現在の三角網を V3 で生成したときの外周の診断。 */
    get boundaryDiagnostics(): BoundaryDiagnostics | undefined;
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
    getCompiled(): CompiledTransformData;
    /** コンパイルされた設定を基底クラスで復元し、外周方式を次の生成にも引き継ぐ。 */
    setCompiled(compiled: CompiledTransformData | CompiledLegacy): void;
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
     *
     * @param kinkLimit - forw / bakw それぞれで残す交差（kinks）の件数の上限
     *   （同じ位置の交差を 1 件に数えた件数）。届いた時点で数え上げをやめます
     */
    calculateStrictTin(kinkLimit?: number): void;
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
    /** 余白を加える前の GCP の外接矩形を求める。 */
    private computeGcpBbox;
    /**
     * TINネットワークを同期的に更新し、座標変換の準備を行います。
     * 重めの計算を伴うため、呼び出し側が非同期制御を行いたい場合は
     * {@link updateTinAsync} を利用してください。
     */
    updateTin(): void;
    /** 補助頂点を含め、strictMode に従って実際に使う両方向の三角網を組む。 */
    private buildTin;
    /**
     * 非同期ラッパーを提供します。
     * 互換性のために Promise ベースの API を維持しますが、内部処理は同期的です。
     */
    updateTinAsync(): Promise<void>;
}
