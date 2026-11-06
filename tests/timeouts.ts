// 実データ（tests/maps・tests/compiled）から TIN を組むテストの時間の上限。
// 既定の 5 秒は、高負荷の環境で揺れた。値は手元で 5 回測った最長の 3 倍を 5 秒刻みに丸めたもの（下限 10 秒）。
// 値 = max(10000, ceil(3T / 5000) × 5000)
// 測定: 2026-11-07・最長 1015 ms（tests/strict-constraint-edge.test.ts: uno_bus_gtfs_error (v3): every constrained edge survives as a TIN edge）
export const REAL_DATA_TIMEOUT_MS = 10000;
