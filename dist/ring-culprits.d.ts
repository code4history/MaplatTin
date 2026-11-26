import { Position } from 'geojson';
import { Tins } from '@maplat/transform';
/**
 * strict を壊した補助頂点を特定する（MaplatTin#98）。
 *
 * 地図面の三角網 `forw` を地理面へ写した三角形（逆変換用）のうち、向きが他と食い違う（反転・面積 0）か、
 * 内部が他の三角形と重なるものを探し、補助頂点を含む三角形が関わるものについて、その補助頂点の
 * 地図面での位置を返す。GCP だけの三角形どうしの重なりは、補助頂点を外しても直らないので数えない。
 */
export declare function findRingCulprits(forw: Tins): Position[];
