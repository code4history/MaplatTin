import { Feature, Point, Position } from 'geojson';
import { Transform, CompiledLegacy, CompiledTransformData, Edge, EdgeSet, EdgeSetLegacy, PointSet, StrictMode, StrictStatus, VertexMode, WorldFile, YaxisMode } from '@maplat/transform';
import { BoundaryDiagnostics } from "./boundary-search.js";
import { SupplementDiagnostics, SupplementPair, SupplementPairRecord } from "./supplement-pairs.js";
import { PointsSetBD } from "./types/tin.js";
import { ImportFailure, MeshModel } from "./incremental/model.js";
import { TinEdit, TinPatch } from "./incremental/types.js";
export declare const FORMAT_VERSION_V2 = 2.00704;
export declare const FORMAT_VERSION_V3 = 3.00001;
/** 補完点の一覧を持つ compiled（Transform の型には無い項目。読み手は無視してよい）。 */
export type CompiledWithSupplement = CompiledTransformData & {
    supplementPairs?: SupplementPairRecord[];
    /**
     * 無ければ、全部組み直し（清書）の産物。`"incremental"` は、局所更新の網をそのまま保存した特例
     * （同じ対応点から全部を組み直すと、同じ三角網にならない。MaplatTin#100・設計書 §9.5）。
     * 読み手（MaplatTransform・MaplatCore）は無視してよい。
     */
    meshOrigin?: "incremental";
};
/** `Tin#restoreMesh` が網を戻せなかった理由。 */
export type RestoreFailure = ImportFailure
/** 局所更新のスイッチ（`Options#incremental`）が切れている */
 | "disabled"
/** 渡された対応点・必須エッジが、compiled と合わない */
 | "inputMismatch"
/** compiled の中継点・補完点が、対応点と必須エッジから作り直したものと合わない */
 | "edgeNodes"
/** ok でない三角形がある（S1） */
 | "notStrict"
/** 網の外周が、両面で単純な 1 本の輪でない（S2） */
 | "boundary"
/** 必須エッジが、網の辺に無い（S3） */
 | "requiredEdge"
/** 補助頂点 3 点だけの三角形がある */
 | "forbidden"
/** 補助頂点の扇形の角度が、補助頂点と重心から計算し直した値と合わない */
 | "verticesParams";
/** 局所更新の網を保存してよいかの証拠（設計書 §9.5 の条件 (a)(b) と、診断 (d)）。 */
export interface IncrementalEvidence {
    /** 条件を全部満たす（`compiled` を、特例として保存してよい） */
    eligible: boolean;
    /** 満たさなかった条件（`eligible` が true なら空） */
    failed: ("noMesh" | "boundaryStale" | "badTriangles" | "meshShape" | "boundary" | "requiredEdge" | "boundaryOnlyTriangles" | "gcpRoundTrip" | "sweepKinks")[];
    /** (a) 帯（補助頂点・重心）が最新か */
    boundaryFresh: boolean;
    /** (a) S1: ok でない三角形の数（網の全部を数え直した値。0 が条件） */
    badTriangles: number;
    /** (a) S1: 紙の面で折り返している内側の辺の数（0 が条件） */
    forwFolds: number;
    /** (a) 網の形: 3 つ以上の三角形に属する辺の数（0 が条件）と、索引が三角形の表と一致するか */
    nonManifoldEdges: number;
    indexMatches: boolean;
    /** (a) S2: 網の外周が、両面で単純な 1 本の輪か */
    boundarySimple: boolean;
    /** (a) S3: 網の辺に無い必須エッジの区間の数（0 が条件） */
    missingRequiredEdges: number;
    /** (a) S4: 補助頂点 3 点だけの三角形の数（0 が条件） */
    boundaryOnlyTriangles: number;
    /** (a)(d) 同じ必須エッジの点だけの三角形の数（残っていても保存はする） */
    remainingForbiddenTriangles: number;
    /** (b) 書き出した compiled を Transform で読み直したときの、対応点の往復の誤差の最大（紙 → 地理・地理 → 紙） */
    gcpRoundTrip: {
        forward: number;
        backward: number;
    };
    /** (b)(d) 書き出した網へ、今の交差の数え上げを 1 件まで走らせた結果（両面の合計。0 が条件） */
    sweepKinks: number;
    /** (d) 最後の全部組み直し・復元から重ねた、局所更新の回数 */
    editsSinceRebuild: number;
    /** (d) 同じ入力を全部組み直したときの状態と交差の件数（呼び出し側が渡した値） */
    rebuildStatus?: StrictStatus;
    rebuildKinks?: number;
    /** 特例として保存する compiled（`meshOrigin: "incremental"` つき）。`eligible` のときだけ */
    compiled?: CompiledWithSupplement;
}
/** `incrementalRebuild` を入れた `updateTin()` の、試行の内訳。 */
export interface RebuildDiagnostics {
    /** 今の手順（全部を組む）で組んだ試行の数 */
    fullAttempts: number;
    /** 帯の差し替えで済ませた試行の数 */
    localAttempts: number;
    /** 帯の差し替えが成り立たず、今の手順で組み直した試行の数（fullAttempts に含む） */
    localFailures: number;
    /** 帯の差し替えの試行に使った時間（ミリ秒） */
    localMs: number;
    /** 採用した三角網が、帯の差し替えの結果か */
    adoptedLocal: boolean;
    /** 採用した局所の結果が、今の交差の数え上げと食い違ったので、今の手順だけで組み直した */
    fellBack: boolean;
}
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
    /**
     * 局所更新（MaplatTin#100）のスイッチ。既定は false で、何も変わらない。true にすると、`updateTin()` の
     * 後に、採用した三角網を局所更新の網（`Tin#incrementalMesh`）へ取り込む。`updateTin()` の結果
     * （`getCompiled()`）は、どちらでも同じ。
     */
    incremental?: boolean;
    /**
     * `updateTin()` の中の組み直しの繰り返し（strict を壊す凸包の辺を外す・補完点を足す・strict を壊す補助頂点を
     * 外す）を、網への局所の操作に置き換える（MaplatTin#100 の第 1 段 b）。既定は false で、何も変わらない。
     * true にすると、最初の 1 回だけ今の手順で組み、2 回目からの試行は、帯（補助頂点を含む三角形）だけを
     * 差し替える。strict になる結果だけを採るので、strict の判定は悪くならないが、三角形の集合は、切った
     * ときと同じとは限らない。world file 外周・loose 指定・V2 では、切ったときと同じ。
     */
    incrementalRebuild?: boolean;
    /**
     * `applyEdits` で、帯（補助頂点・重心）に触れる編集も、帯の差し替えで局所に当てる（MaplatTin#100 の
     * 第 1 段 b の帯の差し替え）。既定は false で、帯に触れる編集は全部組み直しへ落ちる。
     */
    incrementalBand?: boolean;
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
    /** 局所更新のスイッチ（`Options#incremental`）。 */
    incremental: boolean;
    /** 組み直しの繰り返しを局所の操作に置き換えるスイッチ（`Options#incrementalRebuild`）。 */
    incrementalRebuild: boolean;
    /** 帯に触れる編集を局所に当てるスイッチ（`Options#incrementalBand`）。 */
    incrementalBand: boolean;
    /** 局所の試行で作った三角網（採用したら、地理面の三角網を足して、交差の数え上げで確かめる）。 */
    private localTins;
    /** 局所の試行の結果が、今の交差の数え上げと食い違ったので、今の手順だけで組み直している。 */
    private localRebuildDisabled;
    private lastRebuildDiagnostics?;
    /** 直近の `updateTin()` の、試行の内訳（`incrementalRebuild` を入れたときだけ）。 */
    get rebuildDiagnostics(): RebuildDiagnostics | undefined;
    private mesh?;
    private meshFailure?;
    /** 対応点・必須エッジの id（`points`・`edges` の並び）。undefined は、配列の添字が id。 */
    private pointIds?;
    private edgeIds?;
    /** `applyEdits` で進む版の番号。`setPoints` などで入力を入れ直すと 0 に戻る。 */
    private editRevision;
    /** 網が、`tins`・`points`・`edges` より先に進んでいる（局所更新を当てた後、まだ書き戻していない）。 */
    private meshAhead;
    /** 補助頂点・重心が最新でない（局所更新を当てた後、清書か帯の差し替えをするまで）。 */
    private bandStale;
    /** 今の三角網が、局所更新の網をそのまま保存した特例（`meshOrigin: "incremental"`）から来ているか。 */
    private originIncremental;
    /** 最後の全部組み直し・復元から重ねた、局所更新の回数。 */
    private localEdits;
    /**
     * 今の三角網の出どころ。`"incremental"` は、局所更新の網をそのまま保存した特例（読み込んだ compiled に
     * 印があった）。全部組み直す（`updateTin()`）と、印は外れる。
     */
    get meshOrigin(): "incremental" | undefined;
    /**
     * 局所更新の網（今の三角網を取り込んだもの）。スイッチが切れている・三角網が無い・取り込めない網
     * （loose・V2 など。理由は `incrementalFailure`）のときは undefined。
     */
    get incrementalMesh(): MeshModel | undefined;
    /** 局所更新の網へ取り込めなかった理由（取り込めた・スイッチが切れているときは undefined）。 */
    get incrementalFailure(): ImportFailure | undefined;
    /** `applyEdits` の版の番号。次の `applyEdits` に、前提として渡す。 */
    get revision(): number;
    /** 網と、網から決まる状態を捨てる（入力や設定を入れ直したとき）。 */
    private dropMesh;
    /**
     * 局所更新を当てた網を、`points`・`edges`・`tins` などへ書き戻す（`transform()`・`getCompiled()` の前に
     * 自動で呼ばれる。全体を作り直すので、編集のたびには呼ばないこと。表示は `TinPatch` で足りる）。
     */
    private syncFromMesh;
    /** 今の入力（対応点・必須エッジ。内部の座標系）と、その id の並び。 */
    private currentInputs;
    /**
     * 編集を当てる（MaplatTin#100 の第 2 段 a）。局所で済めば、網の差分を返す（`mode: "local"`）。済まなければ、
     * 編集を入力に当てて全部組み直し、その結果を返す（`mode: "full"`。理由は `fallbackReason`）。
     *
     * - `edits` は、全部が当たるか、全部組み直しか、のどちらか（一部だけ当たった網を返さない）。
     * - `baseRevision` が今の版（`revision`）と合わなければ、何も変えずに `"revisionMismatch"` を返す。
     *   呼び出し側は、最新の入力を `setPoints`・`setEdges` で入れ直して、`updateTin()` すること。
     * - 当てられない編集（id が無い・既に使われている・座標が有限でない）は、何も変えずに例外を投げる。
     * - 全部組み直しが例外を投げる入力（必須エッジが交差する・点が一直線、など）では、`updateTin()` と同じ
     *   例外を投げる。入力は編集の後の状態になり、三角網は無い。
     * - 局所で済むのは、スイッチ（`Options#incremental`）が入っていて、strict・strict_error の V3 の網で、
     *   帯（補助頂点・重心）を更新しなくてよい内側の編集だけ。
     * - 座標は、`setPoints` に渡すのと同じ、外の座標系（差分の座標は、compiled と同じ内部の座標系）。
     */
    applyEdits(edits: TinEdit[], baseRevision?: number): TinPatch;
    /** 紙の面と地理面の間で座標を変換する。局所更新を当てた後は、網から三角網を作り直してから変換する。 */
    transform(apoint: number[], backward?: boolean, ignoreBounds?: boolean): number[] | false;
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
    /** 設定を変える前に、局所更新を当てた網を入力へ書き戻して、網を捨てる（id の並びと版は保つ）。 */
    private retireMesh;
    /**
     * 現在の設定を永続化可能な形式にコンパイルします
     */
    getCompiled(): CompiledWithSupplement;
    /** コンパイルされた設定を基底クラスで復元し、外周方式を次の生成にも引き継ぐ。 */
    setCompiled(compiled: CompiledTransformData | CompiledLegacy): void;
    /**
     * 保存した compiled から、三角網と局所更新の網を戻す（MaplatTin#100。設計書 §9.5 (c)）。三角形分割はしない。
     *
     * 局所更新の網をそのまま保存した特例（`meshOrigin: "incremental"`）の地図は、`updateTin()` で開くと、
     * 清書と同じ strict_error に戻る。この口で開けば、保存した strict な網から、局所更新を続けられる。
     * 印の無い（全部組み直しの）compiled も、同じように戻せる（`updateTin()` を待たずに編集を始められる）。
     *
     * 戻すのは、対応点・必須エッジ・中継点と補完点（中継点がどの必須エッジの何番目か）・三角形・補助頂点・
     * 重心・補助頂点の扇形。凸包の辺の印は、内側の点の紙の面の凸包の辺のうち、網の辺にあるものに付け直す。
     * 戻した網で、S1（全部の三角形が ok）・S2（外周が両面で単純）・S3（必須エッジが全部ある）と、
     * 補助頂点 3 点だけの三角形が無いことを、全部を数えて確かめる。
     *
     * 失敗したとき（理由を返す）は、`setCompiled(compiled)` をした状態（変換はできる）で、網は持たない。
     * 印（`meshOrigin`）は外れる。`strict_status` は、次の 3 通り:
     * - compiled が strict と名乗っていて、網を調べて strict でないと分かったとき（`"notStrict"`・`"boundary"`）は、
     *   strict_error になる（逆変換は断られる。交差の一覧 `kinks` は持たない）
     * - compiled が strict と名乗っていて、ほかの理由で断ったときは、未確定（undefined）になる
     * - compiled が strict_error・loose と名乗っていたときは、その値のまま残る
     *
     * スイッチが切れている（`"disabled"`）ときは、`setCompiled(compiled)` と同じ（印も `strict_status` も compiled のまま）。
     * `"v2"`（読む前に断る）のときは、状態に触らない。
     * 呼び出し側は、対応点と必須エッジを入れ直して `updateTin()` すること。
     *
     * @param compiled 保存した compiled（座標は内部の座標系。follow では地理面の Y が反転済み）
     * @param inputs 呼び出し側が持つ対応点・必須エッジ（`setPoints`・`setEdges` に渡すのと同じ、外の座標系）。
     *   渡すと、compiled と合うかを確かめる（follow の反転は、ここで掛ける。呼び出し側で compiled と直接比べないこと）
     */
    restoreMesh(compiled: CompiledWithSupplement, inputs?: {
        points?: PointSet[];
        edges?: EdgeSet[] | EdgeSetLegacy[];
    }): {
        ok: true;
    } | {
        ok: false;
        reason: RestoreFailure;
    };
    /**
     * 帯（補助頂点・重心）を、今の内側の点から作り直す（保存の直前に、帯を最新にするために呼ぶ。設計書 §9.5 (a)）。
     * スイッチ `incrementalBand` が要る。成り立てば差分を返し、成り立たなければ（スイッチが切れている・網が無い・
     * どの余白でも strict な帯にならない）何も変えずに undefined を返す。
     */
    refreshBand(): TinPatch | undefined;
    /** 局所更新を当てた後の、Tin の状態の更新。 */
    private afterLocalEdit;
    /**
     * 局所更新の網を、そのまま保存してよいかの証拠を集める（設計書 §9.5 の条件 (a)(b) と診断 (d)）。
     * 清書（別のインスタンスでの全部組み直し）が strict にならず、この網が strict のときに使う。
     *
     * 網の全部を数え直し（差分管理の値を信用しない）、書き出した compiled を Transform で読み直して対応点の往復を
     * 確かめ、今の交差の数え上げを両面で 1 件まで走らせる。全体を回るので、保存のときだけ呼ぶこと。網は変えない。
     * 帯が最新でないと条件を満たさないので、先に `refreshBand()` を呼ぶ。
     *
     * @param rebuild 同じ入力を全部組み直したときの状態と交差の件数（診断に写すだけ）
     */
    collectIncrementalEvidence(rebuild?: {
        status: StrictStatus;
        kinks: number;
    }): IncrementalEvidence;
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
    /** 三角網を最初から全部組む（`updateTin()` の本体）。 */
    private rebuildAll;
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
