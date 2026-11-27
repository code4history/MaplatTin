import { expect, it } from "vitest";
import { worldFileToCrs, type WorldFile } from "@maplat/transform";

// world file 外周の網の補助頂点は、地理面の位置が「world file の値そのもの」であることを、Tin が厳密な一致で
// 確かめる（restoreMesh・collectIncrementalEvidence。MaplatTin#100）。その「world file の値」は、
// @maplat/transform の worldFileToCrs の式で決まる。依存の Transform を上げて式（演算の順）が変わると、
// 保存済みの compiled の補助頂点が、最後の桁で合わなくなり、restoreMesh が断るようになる。
// ここで、固定の入力に対する値を、ビット単位で縛る（許す誤差は入れない）。この試験が落ちたら、
// Transform の式が変わっている。保存済みの compiled の扱い（厳密な一致のままでよいか）を決め直すこと。

const worldFile: WorldFile = {
  xScale: 0.6543210987654321,
  xSkew: -0.0123456789012345,
  xOrigin: 15123456.789012345,
  ySkew: 0.0234567890123456,
  yScale: -0.6432109876543211,
  yOrigin: 4123456.123456789
};

it("worldFileToCrs の値が、ビット単位で変わっていない", () => {
  const cases: [number[], number[]][] = [
    [[0, 0], [15123456.468024634, 4123456.4333338886]],
    [[1234.5678, 9876.54321], [15124142.339152906, 4117132.69121758]],
    [[-500.25, 14000.125], [15122956.30284715, 4114439.6648466513]],
    [[8038.4, -0.001], [15128716.162757296, 4123644.9890298964]]
  ];
  for (const [pixel, expected] of cases) {
    const actual = worldFileToCrs(worldFile, pixel);
    // toBe は Object.is で比べる（最後の桁まで同じであること）
    expect(actual[0]).toBe(expected[0]);
    expect(actual[1]).toBe(expected[1]);
  }
});
