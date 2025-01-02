import type { Tri, Tins } from "@maplat/transform";
import type { PropertyTriKey } from "@maplat/transform";

type BiDirectionKey = "forw" | "bakw";
type TinsBD = { [key in BiDirectionKey]?: Tins };
type SearchTris = { [key in BiDirectionKey]: Tri };
export type SearchIndex = { [key: string]: SearchTris[] };

/**
 * 三角形のインデックスキーを計算する
 * 三つの頂点のインデックスから、ソートされたキー配列を生成
 * 
 * @param tri インデックスキーを計算する三角形
 * @returns ソートされたキー配列
 */
function calcSearchKeys(tri: Tri): string[] {
  const vtx = (["a", "b", "c"] as PropertyTriKey[]).map(
    key => tri.properties![key].index
  );
  return [
    [0, 1],
    [0, 2],
    [1, 2],
    [0, 1, 2]
  ]
    .map(set =>
      set
        .map(i => vtx[i])
        .sort()
        .join("-")
    )
    .sort();
}

/**
 * 検索インデックスに三角形を追加する
 * 
 * @param searchIndex 検索インデックス
 * @param tris 追加する三角形ペア
 * @param tins （オプション）追加先の三角形群
 * @throws キーの不一致エラー
 */
function insertSearchIndex(
  searchIndex: SearchIndex,
  tris: SearchTris,
  tins?: TinsBD
) {
  const keys = calcSearchKeys(tris.forw);
  const bakKeys = calcSearchKeys(tris.bakw);
  if (JSON.stringify(keys) != JSON.stringify(bakKeys))
    throw `${JSON.stringify(tris, null, 2)}\n${JSON.stringify(
      keys
    )}\n${JSON.stringify(bakKeys)}`;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (!searchIndex[key]) searchIndex[key] = [];
    searchIndex[key].push(tris);
  }
  if (tins) {
    tins.forw!.features.push(tris.forw);
    tins.bakw!.features.push(tris.bakw);
  }
}

export {
  insertSearchIndex
};