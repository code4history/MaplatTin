/**
 * dev-server.ts
 * TIN デバッグ可視化用の開発サーバー
 * - 静的ファイル配信 (HTML / JSON)
 * - POST /api/delete-gcp   : bakw 座標に最近傍の GCP を削除して再コンパイル
 * - GET  /api/download-map : 現在の地図 JSON をダウンロード
 *
 * Usage: npx tsx scripts/dev-server.ts
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Tin } from "../src/index.ts";
import type { Options } from "../src/index.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const PORT = 8765;
const MAP_PATH = path.join(root, "tests/maps/naramachi_yasui_bunko.json");
const DATA_PATH = path.join(root, "debug/debug_tin_data.json");

type FlatTri = [number, number, number, number, number, number];

async function buildTin(data: any, useEdges: boolean) {
  const tin = new Tin({
    wh: [data.width, data.height] as [number, number],
    strictMode: data.strictMode as Options["strictMode"],
    vertexMode: data.vertexMode as Options["vertexMode"],
    stateFull: false,
    useV2Algorithm: false,
  });
  tin.setPoints(data.gcps);
  if (useEdges && data.edges && data.edges.length > 0) tin.setEdges(data.edges);
  await tin.updateTinAsync();
  return tin;
}

async function rebuildData(deletedBakw?: [number, number]): Promise<object> {
  const data = JSON.parse(fs.readFileSync(MAP_PATH, "utf-8"));

  // エッジありで試み、制約交差エラーなら問題エッジを近い順に1本ずつ除去して再試行
  let tin: Tin;
  let droppedEdgeCount = 0;

  try {
    tin = await buildTin(data, true);
  } catch (e: any) {
    if (!e.message?.includes("intersects already constrained")) throw e;

    // 削除した GCP の bakw 座標に近い mercNodes を持つエッジから優先的に除去
    const allEdges: any[] = [...(data.edges || [])];
    const sorted = allEdges.map((edge, i) => {
      let dist = Infinity;
      if (deletedBakw) {
        for (const n of (edge.mercNodes || []) as [number, number][]) {
          dist = Math.min(dist, Math.hypot(n[0] - deletedBakw[0], n[1] - deletedBakw[1]));
        }
      }
      return { edge, dist, i };
    }).sort((a, b) => a.dist - b.dist);

    let current = [...allEdges];
    let ok = false;
    for (const { edge: candidate } of sorted) {
      current = current.filter(e => e !== candidate);
      droppedEdgeCount++;
      console.log(`  ⚠ removing conflicting edge (${droppedEdgeCount} dropped so far), retry...`);
      try {
        tin = await buildTin({ ...data, edges: current }, true);
        ok = true;
        break;
      } catch (e2: any) {
        if (!e2.message?.includes("intersects already constrained")) throw e2;
      }
    }

    if (!ok) {
      console.log("  ⚠ could not resolve conflicts — building without any edges");
      tin = await buildTin(data, false);
      current = [];
    }

    data.edges = current;
    fs.writeFileSync(MAP_PATH, JSON.stringify(data));
  }

  const tinAny = tin as any;
  const compiled = tin.getCompiled() as any;
  const kinks = tinAny.kinks;
  const tins = tinAny.tins;

  function toFlat(tri: any): FlatTri {
    const c = tri.geometry.coordinates[0];
    return [c[0][0], c[0][1], c[1][0], c[1][1], c[2][0], c[2][1]];
  }
  const forwFlat: FlatTri[] = tins.forw.features.map(toFlat);
  const bakwFlat: FlatTri[] = tins.bakw.features.map(toFlat);

  function bbox(tris: FlatTri[]): [number, number, number, number] {
    let mnx = Infinity, mny = Infinity, mxx = -Infinity, mxy = -Infinity;
    for (const [x0, y0, x1, y1, x2, y2] of tris) {
      mnx = Math.min(mnx, x0, x1, x2); mny = Math.min(mny, y0, y1, y2);
      mxx = Math.max(mxx, x0, x1, x2); mxy = Math.max(mxy, y0, y1, y2);
    }
    return [mnx, mny, mxx, mxy];
  }

  const kF = kinks?.forw?.features?.map((f: any) => f.geometry.coordinates) ?? [];
  const kB = kinks?.bakw?.features?.map((f: any) => f.geometry.coordinates) ?? [];

  return {
    strictStatus: compiled.strict_status,
    wh: [data.width, data.height],
    forwTris: forwFlat,
    bakwTris: bakwFlat,
    forwBbox: bbox(forwFlat),
    bakwBbox: bbox(bakwFlat),
    kinks_points: kF,
    kinks_bakw: kB,
    vertices_points: compiled.vertices_points ?? [],
    gcps: data.gcps.map((g: any) => [g[0], g[1]]),
    edges: (compiled.edges ?? []).map((e: any) => e[2] ?? e.startEnd ?? []),
    gcpCount: data.gcps.length,
    droppedEdgeCount,
  };
}

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".json": "application/json",
  ".js": "text/javascript",
  ".css": "text/css",
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url!, `http://localhost:${PORT}`);

  // ── API: GCP 削除 ──────────────────────────────────────────────────────────
  if (url.pathname === "/api/delete-gcp" && req.method === "POST") {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", async () => {
      try {
        const { bakwX, bakwY } = JSON.parse(body) as { bakwX: number; bakwY: number };
        const mapData = JSON.parse(fs.readFileSync(MAP_PATH, "utf-8"));

        // 最近傍 GCP を bakw 座標で検索
        let bestIdx = -1, bestDist = Infinity;
        for (let i = 0; i < mapData.gcps.length; i++) {
          const b = mapData.gcps[i][1] as [number, number];
          const d = Math.hypot(b[0] - bakwX, b[1] - bakwY);
          if (d < bestDist) { bestDist = d; bestIdx = i; }
        }
        if (bestIdx < 0) { res.writeHead(400); res.end(JSON.stringify({ error: "no GCP" })); return; }

        const removed = mapData.gcps[bestIdx];
        console.log(`  Delete GCP[${bestIdx}] forw=${JSON.stringify(removed[0])} bakw=${JSON.stringify(removed[1])} dist=${bestDist.toFixed(1)}`);

        // 削除 & エッジ処理（削除GCPを参照するエッジも除去してから再インデックス）
        mapData.gcps.splice(bestIdx, 1);
        if (mapData.edges) {
          mapData.edges = (mapData.edges as any[]).filter(
            (e: any) => !e.startEnd.includes(bestIdx)
          );
          for (const e of mapData.edges) {
            e.startEnd = (e.startEnd as number[]).map((idx: number) => idx > bestIdx ? idx - 1 : idx);
          }
        }
        fs.writeFileSync(MAP_PATH, JSON.stringify(mapData));

        console.log("  Recompiling...");
        const result = await rebuildData(removed[1] as [number, number]);
        fs.writeFileSync(DATA_PATH, JSON.stringify(result));
        console.log(`  Done. kinks_bakw:${(result as any).kinks_bakw.length} status:${(result as any).strictStatus}`);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ...result, deletedIdx: bestIdx, deletedForw: removed[0], deletedBakw: removed[1] }));
      } catch (e: any) {
        console.error("delete-gcp error:", e);
        res.writeHead(500); res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // ── API: 再ビルド ─────────────────────────────────────────────────────────
  if (url.pathname === "/api/rebuild" && req.method === "POST") {
    try {
      const result = await rebuildData();
      fs.writeFileSync(DATA_PATH, JSON.stringify(result));
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
    } catch (e: any) {
      console.error("rebuild error:", e);
      res.writeHead(500); res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // ── API: 地図ダウンロード ──────────────────────────────────────────────────
  if (url.pathname === "/api/download-map" && req.method === "GET") {
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Content-Disposition": 'attachment; filename="naramachi_yasui_bunko.json"',
    });
    res.end(fs.readFileSync(MAP_PATH));
    return;
  }

  // ── 静的ファイル ───────────────────────────────────────────────────────────
  let filePath = path.join(root, url.pathname === "/" ? "debug/debug_tin_viz.html" : url.pathname.slice(1));
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404); res.end("Not found"); return;
  }
  const ext = path.extname(filePath);
  res.writeHead(200, { "Content-Type": MIME[ext] ?? "text/plain", "Cache-Control": "no-store" });
  res.end(fs.readFileSync(filePath));
});

server.listen(PORT, () => {
  console.log(`\n🚀 Dev server: http://localhost:${PORT}/debug/debug_tin_viz.html\n`);
});
