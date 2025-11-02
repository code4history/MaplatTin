import type {
  PropertyTriKey,
  TinsBD,
  Tri,
  WeightBufferBD,
} from "@maplat/transform";

interface WeightBufferOptions {
  tins: TinsBD;
  targets: Array<keyof TinsBD>;
  includeReciprocals: boolean;
}

/**
 * Calculate per-point stretch ratios used for non-linear interpolation.
 */
export function buildPointsWeightBuffer(
  options: WeightBufferOptions,
): WeightBufferBD {
  const { tins, targets, includeReciprocals } = options;
  const edgeRatios: WeightBufferBD = {};

  targets.forEach((target) => {
    const triCollection = tins[target];
    if (!triCollection || !triCollection.features) return;

    edgeRatios[target as keyof WeightBufferBD] = {};
    const seenEdges: Record<string, boolean> = {};

    triCollection.features.forEach((tri: Tri) => {
      const props = ["a", "b", "c"] as PropertyTriKey[];
      for (let i = 0; i < 3; i++) {
        const j = (i + 1) % 3;
        const prop_i = props[i];
        const prop_j = props[j];
        const index_i = tri.properties![prop_i].index;
        const index_j = tri.properties![prop_j].index;
        const key = [index_i, index_j].sort().join("-");

        if (seenEdges[key]) continue;
        seenEdges[key] = true;

        const i_xy = tri.geometry!.coordinates[0][i];
        const j_xy = tri.geometry!.coordinates[0][j];
        const i_merc = tri.properties![prop_i].geom;
        const j_merc = tri.properties![prop_j].geom;

        const ratio = Math.sqrt(
          Math.pow(i_merc[0] - j_merc[0], 2) +
            Math.pow(i_merc[1] - j_merc[1], 2),
        ) / Math.sqrt(
          Math.pow(i_xy[0] - j_xy[0], 2) + Math.pow(i_xy[1] - j_xy[1], 2),
        );

        const targetBuffer = edgeRatios[target as keyof WeightBufferBD]!;
        targetBuffer[`${index_i}:${key}`] = ratio;
        targetBuffer[`${index_j}:${key}`] = ratio;
      }
    });
  });

  const pointsWeightBuffer: WeightBufferBD = {};
  if (includeReciprocals) {
    pointsWeightBuffer.bakw = {};
  }

  targets.forEach((target) => {
    const targetBuffer = edgeRatios[target as keyof WeightBufferBD];
    pointsWeightBuffer[target as keyof WeightBufferBD] = {};

    if (!targetBuffer) {
      return;
    }

    const pointWeights: Record<string, number[]> = {};
    Object.keys(targetBuffer).forEach((key) => {
      const [pointId] = key.split(":");
      if (!pointWeights[pointId]) {
        pointWeights[pointId] = [];
      }
      pointWeights[pointId].push(targetBuffer[key]);
    });

    Object.keys(pointWeights).forEach((pointId) => {
      const weights = pointWeights[pointId];
      const avgWeight = weights.reduce((sum, w) => sum + w, 0) / weights.length;

      pointsWeightBuffer[target as keyof WeightBufferBD]![pointId] = avgWeight;

      if (includeReciprocals && pointsWeightBuffer.bakw) {
        pointsWeightBuffer.bakw[pointId] = 1 / avgWeight;
      }
    });

    let centroidSum = 0;
    for (let i = 0; i < 4; i++) {
      const key = `b${i}`;
      const weight =
        pointsWeightBuffer[target as keyof WeightBufferBD]![key] || 0;
      centroidSum += weight;
    }
    pointsWeightBuffer[target as keyof WeightBufferBD]!["c"] = centroidSum / 4;

    if (includeReciprocals && pointsWeightBuffer.bakw) {
      pointsWeightBuffer.bakw["c"] = 1 /
        pointsWeightBuffer[target as keyof WeightBufferBD]!["c"];
    }
  });

  return pointsWeightBuffer;
}
