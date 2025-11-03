import { Tins, Tri } from '@maplat/transform';
type BiDirectionKey = "forw" | "bakw";
type TinsBD = {
    [key in BiDirectionKey]?: Tins;
};
export type SearchTris = {
    [key in BiDirectionKey]: Tri;
};
export type SearchIndex = {
    [key: string]: SearchTris[];
};
/**
 * 三角形のインデックスキーを計算する
 * 三つの頂点のインデックスから、ソートされたキー配列を生成
 *
 * @param tri インデックスキーを計算する三角形
 * @returns ソートされたキー配列
 */
declare function calcSearchKeys(tri: Tri): string[];
/**
 * 検索インデックスに三角形を追加する
 *
 * @param searchIndex 検索インデックス
 * @param tris 追加する三角形ペア
 * @param tins （オプション）追加先の三角形群
 * @throws キーの不一致エラー
 */
declare function insertSearchIndex(searchIndex: SearchIndex, tris: SearchTris, tins?: TinsBD): void;
declare function removeSearchIndex(searchIndex: SearchIndex, tris: SearchTris, tins?: TinsBD): void;
export { calcSearchKeys, insertSearchIndex, removeSearchIndex };
