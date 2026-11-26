import { Feature, Point, Position } from 'geojson';
import { Transform, CompiledLegacy, CompiledTransformData, Edge, EdgeSet, EdgeSetLegacy, PointSet, StrictMode, VertexMode, WorldFile, YaxisMode } from '@maplat/transform';
import { BoundaryDiagnostics } from "./boundary-search.js";
import { SupplementDiagnostics, SupplementPair, SupplementPairRecord } from "./supplement-pairs.js";
import { PointsSetBD } from "./types/tin.js";
export declare const FORMAT_VERSION_V2 = 2.00704;
export declare const FORMAT_VERSION_V3 = 3.00001;
/** 補完点の一覧を持つ compiled（Transform の型には無い項目。読み手は無視してよい）。 */
export type CompiledWithSupplement = CompiledTransformData & {
    supplementPairs?: SupplementPairRecord[];
};
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
    /**
     * V3 だけ。strict のために制約から外した凸包の辺に、システムが補完点（supplementPairs）を足す。
     * 既定は true。false にすると足さない（#91 と同じ結果）。
     */
    supplementPairs?: boolean;
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
    /** V3 で補完点を足すか（`Options#supplementPairs`）。 */
    useSupplementPairs: boolean;
    private supplementRecords;
    private lastSupplementDiagnostics?;
    private lastBoundaryDiagnostics?;
    /** `updateTin()` の中で三角網を組んだ試行の数（補助頂点の手当ての手間の上限に使う）。 */
    private attemptTotal;
    private requestedWorldFile?;
    private compiledOuter?;
    /** 現在の三角網を V3 で生成したときの外周の診断。 */
    get boundaryDiagnostics(): BoundaryDiagnostics | undefined;
    /**
     * システムが足した補完点の一覧（今の三角網のもの）。座標は内部の座標（`edgeNodes` と同じ）。
     * 人間の対応点（`points`）には入らない。`updateTin()` のたびに、対応点だけから作り直される。
     */
    get supplementPairs(): SupplementPair[];
    /** 直近の `updateTin()` の補完の手順の診断（足す手順に入らなかったときは undefined）。 */
    get supplementDiagnostics(): SupplementDiagnostics | undefined;
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
    getCompiled(): CompiledWithSupplement;
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
     * 順三角網から逆三角網を写し、重なりを辺の反転で解消する（`calculateStrictTin` の前半）。
     * 交差の判定（`strict_status`・`kinks`）はしない。補完点の置き場所を測る試行は、三角網の向きを読むだけなので
     * これだけを呼ぶ。
     */
    private resolveStrictOverlaps;
    /** `calculateStrictTin` の後半: 両面の交差を数え、`strict_status` と `kinks` を決める。 */
    private detectStrictKinks;
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
    /**
     * `buildWithHull` で三角網を組み、strict のために制約から外した凸包の辺があれば、システムが補完点を
     * 足して組み直す（#89）。外れた辺が無いとき、補完点を使わない指定のとき、V2 のときは、`buildWithHull` の
     * 結果をそのまま返す。
     *
     * 補完点は rawPointsSet と allGcps と edgeNodes の末尾に、添字 `e{n}` で足す（必須エッジの中継点の
     * 続き番号）。重心・扇形外挿の推定（pointsSetFC・convexBuf）には入れない。loose 指定には足さない
     * （MaplatTin#95）。
     *
     * @param makeAttempt 点群ごとの探索の入れ物と strict の方式・「三角網の向きを読むだけ」（交差を調べない）を
     *   受け取り、`buildWithHull` に渡す試行を返す
     */
    private buildWithSupplements;
    /**
     * 凸包の辺を全部制約にして三角網を組み、strict を壊したときは、壊した原因の凸包の辺だけを外して
     * 組み直す。strict に戻るか、外す辺が無くなるまで繰り返し（strict を壊さない範囲で、なるべく多くの
     * 凸包の辺を制約にする）、戻ったら、外した辺を 1 本ずつ制約に戻して strict を保てるか試す。
     *
     * strict に戻らないときは、外して得るものが無いので、凸包の辺を全部制約にした最初の三角網を採る。
     * 凸包の辺を全部外した三角網が strict になるときだけは、そちらを採る。
     *
     * 返す結果と `this` の状態（三角網・点群・strict の判定・交差）は、必ず同じ試行から来る。試行の結果は
     * 控えておき、採用する試行の状態を戻す（失敗した試行の状態を残さない）。同じ外す指定の試行は
     * 繰り返さない。strict でも auto でもない（loose の）ときは組み直さない。
     *
     * 外す辺がある試行（最初の試行以外）は、strict になるかどうかだけが要る（採用されるのは、交差が無い
     * strict の試行か、最初の試行だけ）ので、交差の数え上げは 1 件で止める（`buildTin` の onlyDetectKinks）。
     *
     * @param attempt 外す辺の鍵を受け取り、外周を探して `this.tins` などを組み、探索の結果を返す
     */
    private buildWithHull;
    /** 今の三角網が strict か（組み立ての途中で `strict_status` が変わるので、型の絞り込みを避けて読む）。 */
    private isStrict;
    /** 三角網を組んだ結果の状態（試行ごとに控え、採用する試行の状態に戻す）。 */
    private captureBuild;
    private restoreBuild;
    /** 補助頂点を含め、strictMode に従って実際に使う両方向の三角網を組む。 */
    private buildTin;
    /**
     * 非同期ラッパーを提供します。
     * 互換性のために Promise ベースの API を維持しますが、内部処理は同期的です。
     */
    updateTinAsync(): Promise<void>;
}
