// 実データ（tests/maps・tests/compiled）から TIN を組むテストの時間の上限。
// 既定の 5 秒は、高負荷の環境で揺れた。
// 測定（2026-11-07・手元で 5 回）: 最長 1015 ms（tests/strict-constraint-edge.test.ts: uno_bus_gtfs_error (v3): every constrained edge survives as a TIN edge）。
// coverage 付きの 1 回では対象の最長が 2333 ms（tests/m12-weight-buffer-removal.test.ts の T2-VER）。
// 共有の CI で coverage 付きに回すと手元の 2〜5 倍遅くなった実績があるため、
// coverage 付きの最長の 5 倍（約 11.7 秒）を 5 秒刻みに丸めて 20 秒にする。
export const REAL_DATA_TIMEOUT_MS = 20000;
