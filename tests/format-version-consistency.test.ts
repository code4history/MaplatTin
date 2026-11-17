import { describe, expect, it } from "vitest";
// 依存として解決した @maplat/transform（standalone の clone と CI では lock の版、親の作業場所では兄弟の作業ツリー）
import { format_version as transformFormatVersion } from "@maplat/transform";
import { FORMAT_VERSION_V2 } from "../src/tin.ts";
import { format_version as tinFormatVersion } from "../src/index.ts";

// MaplatTransform#13: compiled のフォーマット版の定数は Transform と Tin の 2 か所にある。
// 検査を Tin 側に置く理由: Transform の @maplat/tin（devDependency）は 0.14.0 に固定されており、
// Transform のテストから最新の Tin の定数は見えない（最新の Tin は @maplat/transform に依存するので、
// Transform が最新の Tin に依存すると循環依存になる。0.14.0 は fixture の生成にだけ使う）。
// V3（3.00001）は Transform が export しない（compiled-state.ts のコメント）ので比べない。
// 検出の時機: Tin だけが定数を変えたら Tin の CI で即時。Transform だけが変えたら、Transform の公開後に
// Tin の lock を作り直したときの Tin の CI。
describe("compiled のフォーマット版定数の一致（MaplatTransform#13）", () => {
  it("Tin の FORMAT_VERSION_V2 が、依存の @maplat/transform の format_version と等しい", () => {
    const resolved: number = transformFormatVersion; // リテラル型を number へ広げる（weight-buffer-removal.test.ts と同じ扱い）
    expect(FORMAT_VERSION_V2).toBe(resolved);
  });
  it("Tin の公開 format_version は FORMAT_VERSION_V2 そのもの", () => {
    expect(tinFormatVersion).toBe(FORMAT_VERSION_V2);
  });
});
