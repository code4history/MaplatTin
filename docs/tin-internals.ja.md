# MaplatTin TIN 構築メモ

本メモは `Tin` 実装がどのように三角網を構成しているかを整理したものです。とくに分かりづらい境界補完ノード（`b0`〜`b3`）に注目しています。

## 更新フローの概要

1. `Tin.updateTin()`（`src/tin.ts:656`）はまず入力を準備します。V3（既定）は GCP から処理対象の外接矩形を求めます（`computeGcpBbox`、`src/tin.ts:681`–`682`）。V2（`useV2Algorithm`）は `validateAndPrepareInputs()`（`src/tin.ts:599`）で、全ての前面 GCP が `wh` を基にした処理対象領域に入っているかを検証します。
2. `generatePointsSet()`（`src/tin.ts:430`）で各 GCP を GeoJSON Point に変換し、制約エッジを分割します。途中のノードには `e0`, `e1` といった ID が与えられ、後段の三角分割に参加します。
3. `constrainedTin()` を使って前面・背面の制約付き三角網を生成します（`src/tin.ts:699`–`708`）。背面は、strict モードが維持できず loose になったときだけ独立に再生成されます。
4. 重心点 `c` は前面の GCP の重心（`src/tin.ts:714`）で、背面の位置は前面の三角網で変換して求めます（`src/tin.ts:757`–`760`）。前面・背面の凸包を `convexBuf` に集め（`src/tin.ts:715`–`752`）、`calculatePlainVertices()` または `calculateBirdeyeVertices()`（選択は `src/tin.ts:838`）で境界ノードを合成します。
5. V3 は余白を変えながら境界ノードを探し（`searchBoundary`、`src/boundary-search.ts`）、凸包の辺を全部制約にして三角網を組み、strict を壊す凸包の辺だけを外します（`buildWithHull`、`src/tin.ts:915`）。生成したノードを点群に追加し、TIN の検索用インデックスを整備します。

## 境界ノード補完（`calculatePlainVertices`）

`Tin` では前面・背面の空間を共通の多角形で包むために、仮想制御点を挿入します（bbox の四隅が `b0`〜`b3`。V3 はさらに bbox の辺の上に最大 32 点）。実装は `src/boundary-vertices.ts:427`–`616` の `calculateVerticesCore()` です。

1. **凸包サンプルの収集。** `convexBuf` は各凸包頂点（前面座標）と、その点を三角網で変換した背面座標のペアを保持します。前面・背面双方の凸包から取得することで極端な変形にも耐えるようにしています（`src/tin.ts:718`–`752`）。`collectSamples()`（`src/boundary-vertices.ts:41`）が各ペアを、重心からの 2 本のベクトル（背面は y を反転）にします。
2. **縮尺と回転の推定。** `buildVertexRatio()`（`src/boundary-vertices.ts:167`）がサンプルを、plain なら 1 組、birdeye なら象限ごとの `[scale, theta]` にまとめます。推定の方法は形式で違います。
   - **V3 の plain（`"farLsq"`、`reduceSamplesFar()`、`src/boundary-vertices.ts:160`）。** 重心からの紙の距離が最遠の点の 0.6 倍以上（`FAN_FIT_FAR_RATIO`）の凸包の点だけを使い、重心を固定した相似 `F ≈ z·B` を最小二乗で当てはめます（`F`・`B` は重心からの紙・地理の差を複素数にしたもの。`z = Σ F·conj(B) / Σ |B|²`。縮尺は `|z|`、回転は `arg z`）。重みが `|B|²` になるので、重心に近い凸包の点の打ち誤差は効きにくくなります。従来の最小値は、重心に近い凸包の点の最も負に振れた誤差を拾い、紙の隅まで増幅していました（デモの素材の GCP 24 組・誤差 3 画素で、凸包の外側の最大が 109.5 km → 18.7 km）。
     - **遠い点が 3 点に満たないとき**（`FAN_FIT_MIN_POINTS`。GCP が 4〜6 組の図など）: 凸包の全点に同じ最小二乗を当てはめます。
     - **従来の推定に戻るとき**（当てはめがデータを説明できない場合）: 一致度 `|Σ F·conj(B)| / √(Σ|F|²·Σ|B|²)`（0〜1。相似に完全に乗れば 1）が 0.5（`FAN_FIT_MIN_AGREEMENT`）に満たないとき、またはサンプルが空・全点が重心と一致するとき。地理側が紙に対して裏返し（鏡像）だと `Σ F·conj(B)` が打ち消し合い、`|z|` が 0 に近い正の値になって補助頂点が際限なく遠くへ飛びます。そのとき一致度は 0 に近くなります。正常な入力の一致度の実測は、デモの素材が 0.9996 以上、実地図が 0.90〜1.00、実地図を間引いた 4〜6 組（234 組）が最小 0.79・中央値 0.9986 です。
   - **V2 と birdeye（`"min"`、`reduceSamples()`、`src/boundary-vertices.ts:78`）。** 変更なし。縮尺は紙と地理の距離比の最小値、回転は重みなしの平均角度差です（birdeye は象限ごと。サンプルが無い象限は共通の値へ戻します。`src/boundary-vertices.ts:167`–`190`）。
   - 推定を新しいものにするか（`RatioEstimator`）と、辺の上に補助頂点を作るか（`withEdgeVertices`）は別の引数です。`calculatePlainVertices(params, v3)` は V3 のときだけ `"farLsq"` を使い、`calculateWorldFileVertices()` は推定しません（地理側は world file で固定）。
3. **四隅の配置。** `computeVertexBakwFromRatio()`（`src/boundary-vertices.ts:212`）で、各 bbox の隅について、前面の重心からの距離を縮尺で割り、角度を `theta` だけ回転させて背面座標を得ます。
4. **全ての点を包むための広げ直し。** `checkAndAdjustVerticesN()`（`src/boundary-vertices.ts:347`）は、重心から各 GCP・エッジノードへの線分が背面の多角形の外に出ないかを調べ、出る場合は横切る辺の 2 頂点を、点が収まるまで外側へ広げます。四隅で 1 回、全頂点で 1 回行います。縮尺の推定が楽観的でも、GCP が輪の外に出ないようにします。
5. **V3 のみ: 辺の上の補助頂点。** 四隅を含まない 10° の区分ごとに、区分内の最も遠い点で bbox 境界上の前面の点を決め、背面は補間した向きで四隅が作る多角形の上に置きます（`src/boundary-vertices.ts:520`–`602`）。最後に前面の角度で並べ替えます（`src/boundary-vertices.ts:604`–`614`）。

*Birdseye モード:* `vertexMode` が `Tin.VERTEX_BIRDEYE` のときに 4 象限すべてから凸包サンプルが得られれば、その象限専用のスケール・回転を適用します。いずれかの象限が欠けていても、共通のスケールへフォールバックして変換を安定させます（`src/boundary-vertices.ts:167`–`190`）。

こうして、すべての変換後ジオメトリを安全に包含しつつ、局所的な回転やアスペクト比も概ね維持した境界ノードが得られます。

## 重みバッファ（廃止）

廃止（2.00704）: 三角形内の補間は純アフィン。

## 補足事項

- strict モードは前面三角網を逆変換にも使おうとします。エッジ交差が検出されると `STATUS_ERROR` となり、背面三角網を再生成します。
- strict モードでは、旧バージョン同様に検索インデックスを使って共有辺の三角形を組み替え、解決可能な重なりであれば `STATUS_STRICT` のまま維持するようになりました（`src/strict-overlap.ts`。`resolveOverlaps` の呼び出しは `src/tin.ts:393`–`400`）。
- テストから呼ばれる `updateTinAsync()` は `updateTin()` を Promise でラップしているだけで、実際には非同期要素を持ちません。次のイテレーションで Promise/async の整理対象になる予定です。

これらの知見を踏まえることで、境界ノード計算のドキュメント化・リファクタリング・非同期処理の簡素化を安心して進められます。
