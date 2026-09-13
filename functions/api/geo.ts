/**
 * CF Pages Function: GET /api/geo?lat=..&lon=..
 * KV 绑定名: GEO_CACHE（Dashboard 手动创建，主审执行）
 * 纪律: 永远 HTTP 200；任何失败返回 { "fallback": true }
 * 修复 A1: import 路径 ../../src/...；修复 A2: 零 workers-types 依赖
 * 修复 C1 (2026-09-13): Overpass 服务端算力超时(timeout:12 对超密城区不够)
 *   → timeout 提到 25、网络等待 15s、镜像按实测速度排序(api.de 最快)、
 *     建筑噪声类型过滤减负、响应头 x-geo-mirror 记录命中镜像便于诊断
 */
import { latlonToENU, METERS_PER_UNIT } from "../../src/lib/city/projection";
import { fnv1a } from "../../src/lib/city/seed";
import { CITY_CONFIG } from "../../src/lib/city/config";

interface KVLite {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>;
}
interface Env { GEO_CACHE: KVLite }

const MIRRORS = [
  "https://overpass-api.de/api/interpreter",          // 实测最快(1.8s)，放第一
  "https://overpass.private.coffee/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",    // 实测常超时，垫底
];
const PER_MIRROR_TIMEOUT = 15000;   // 网络等待给足（服务端算力时间另由 timeout 控制）
const MAX_RING_PTS = 9;     // 含闭合点，实际轮廓 ≤8 顶点
const KV_TTL = 2592000;     // 30 天
const FAIL_TTL = 600;       // 失败短缓存 10min，防 Overpass 被击穿
const MAX_KV_BYTES = 500_000;

type Pt = { x: number; z: number };
const r1 = (v: number) => Math.round(v * 10) / 10;
const flat = (pts: Pt[]) => pts.flatMap((p) => [p.x, p.z]);

function buildQuery(lat: number, lon: number): string {
  // timeout:25 — 超密城区(2km 内上万个 building)12s 算力不够会超时丢 building（修复 C1）
  // building 过滤噪声类型(施工棚/车库/棚/废墟/屋顶)减负 + 提升视觉质量
  return `[out:json][timeout:25];
(
  way["building"]["building"!~"^(construction|garage|shed|ruins|roof)$"](around:2000,${lat},${lon});
  way["waterway"~"^(river|stream)$"](around:2500,${lat},${lon});
  way["natural"="water"](around:2500,${lat},${lon});
  node["natural"="peak"](around:3000,${lat},${lon});
);
out geom qt ${CITY_CONFIG.MAX_OUT_WAYS};`;   // qt = quadtile 空间序截断（修复 B2）
}

/** 迭代式 Douglas-Peucker（无递归，workers CPU 友好） */
function dp(pts: Pt[], eps: number): Pt[] {
  if (pts.length <= 2) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = 1; keep[pts.length - 1] = 1;
  const stack: [number, number][] = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop()!;
    const ax = pts[a].x, az = pts[a].z;
    const dx = pts[b].x - ax, dz = pts[b].z - az;
    const len = Math.hypot(dx, dz) || 1e-9;
    let maxD = -1, idx = -1;
    for (let i = a + 1; i < b; i++) {
      const d = Math.abs(dz * (pts[i].x - ax) - dx * (pts[i].z - az)) / len;
      if (d > maxD) { maxD = d; idx = i; }
    }
    if (maxD > eps && idx > 0) { keep[idx] = 1; stack.push([a, idx], [idx, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}

function simplifyTo(pts: Pt[], maxPts: number, eps0: number): Pt[] {
  let eps = eps0, out = dp(pts, eps);
  for (let i = 0; i < 6 && out.length > maxPts; i++) { eps *= 1.7; out = dp(pts, eps); }
  return out;
}

function isClosed(pts: Pt[]): boolean {
  const n = pts.length;
  return n > 1 && pts[0].x === pts[n - 1].x && pts[0].z === pts[n - 1].z;
}

function shoelaceClosed(ring: Pt[]): number {
  // ring 已闭合（末点=首点）时直接累加即完整多边形面积
  let s = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    s += ring[i].x * ring[i + 1].z - ring[i + 1].x * ring[i].z;
  }
  return Math.abs(s / 2);
}

/** 无层数标签时：质心+面积 hash → 3~15 层伪随机（同位置恒定同高度，重试不闪变） */
function estimateHeightUnits(levels: number, areaM2: number, c: Pt): number {
  const lv = levels > 0
    ? Math.min(levels, 40)
    : 3 + (fnv1a(`${c.x.toFixed(0)},${c.z.toFixed(0)},${Math.round(areaM2 / 50)}`) % 13);
  return (lv * 3) / METERS_PER_UNIT;   // 层高 3m
}

function simplifyOsm(osm: any, origin: { lat: number; lon: number }) {
  const buildings: { pts: number[]; h: number; lv?: number; area?: number; r: number }[] = [];
  const water: number[][] = [];
  const peaks: [number, number][] = [];

  for (const el of osm.elements ?? []) {
    if (el.type === "way" && Array.isArray(el.geometry) && el.geometry.length >= 2) {
      const raw: Pt[] = el.geometry.map((g: { lat: number; lon: number }) => {
        const p = latlonToENU(g.lat, g.lon, origin);
        return { x: r1(p.x), z: r1(p.z) };
      });
      if (el.tags?.building) {
        if (raw.length < 4) continue;
        const ring = isClosed(raw) ? raw : [...raw, raw[0]];
        const areaM2 = shoelaceClosed(ring) * METERS_PER_UNIT * METERS_PER_UNIT;
        if (areaM2 < CITY_CONFIG.MIN_AREA_M2) continue;
        // 修复 C2: dp 对闭合环(首尾同点)退化 → 首尾基线零长度, 所有点距离=0 → 只剩2点。
        // 必须对非闭合点列简化(去闭合尾点), 简化后再闭合。
        // eps=2m: 保留 10m 级小建筑轮廓; 大建筑由 maxPts=8 兜底控制点数
        const open = isClosed(raw) ? raw.slice(0, -1) : raw;
        const simpRaw = simplifyTo(open, MAX_RING_PTS - 1, 2);
        if (simpRaw.length < 3) continue;                 // 至少 3 轮廓点 → 闭合 4 点
        const simp = isClosed(simpRaw) ? simpRaw : [...simpRaw, simpRaw[0]];
        const closed = isClosed(simp) ? simp : [...simp, simp[0]];   // 修复 B1
        const n = closed.length - 1;
        let cx = 0, cz = 0;
        for (let i = 0; i < n; i++) { cx += closed[i].x; cz += closed[i].z; }
        cx /= n; cz /= n;
        const lv = parseFloat(el.tags["building:levels"] ?? "");
        const h = r1(estimateHeightUnits(Number.isFinite(lv) ? lv : 0, areaM2, { x: cx, z: cz }) * CITY_CONFIG.H_SCALE);
        buildings.push({
          pts: flat(closed),
          h,
          lv: Number.isFinite(lv) && lv > 0 ? lv : undefined,
          area: Math.round(areaM2),
          r: Math.hypot(cx, cz),
        });
      } else {
        const simp = simplifyTo(raw, 60, 10);
        if (simp.length >= 2) water.push(flat(simp));
      }
    } else if (el.type === "node" && el.tags?.natural === "peak") {
      const p = latlonToENU(el.lat, el.lon, origin);
      peaks.push([r1(p.x), r1(p.z)]);
    }
  }

  buildings.sort((a, b) => a.r - b.r);
  const clipped = buildings.slice(0, CITY_CONFIG.MAX_BUILDINGS).map(({ r: _r, ...b }) => b);
  return {
    v: 1 as const,
    center: [origin.lat, origin.lon] as [number, number],
    ts: Math.floor(Date.now() / 1000),
    raw_count: buildings.length,
    buildings: clipped,
    water: water.slice(0, 120),
    peaks: peaks.slice(0, 60),
  };
}

const json = (data: unknown, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(data), {
    headers: {
      "content-type": "application/json",
      "cache-control": "public, max-age=86400",
      ...extra,
    },
  });

export async function onRequestGet({ request, env }: { request: Request; env: Env }): Promise<Response> {
  const u = new URL(request.url);
  const lat = parseFloat(u.searchParams.get("lat") ?? "");
  const lon = parseFloat(u.searchParams.get("lon") ?? "");
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    return json({ fallback: true }, { "x-geo-cache": "param-error" });
  }
  const ck = `${lat.toFixed(2)}:${lon.toFixed(2)}`;
  const key = `geo:v5:${ck}`;
  const failKey = `geo:fail:v5:${ck}`;

  try {
    const hit = await env.GEO_CACHE.get(key);
    if (hit) return json(JSON.parse(hit), { "x-geo-cache": "hit" });
    if (await env.GEO_CACHE.get(failKey)) return json({ fallback: true }, { "x-geo-cache": "fail-cooldown" });
  } catch { /* KV 故障不阻塞，继续回源 */ }

  const ql = buildQuery(lat, lon);
  for (const mirror of MIRRORS) {
    try {
      const res = await fetch(mirror, {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "user-agent": "TempoSoul-Sky/1.0 (https://www.temposoul.com)",
        },
        body: "data=" + encodeURIComponent(ql),
        signal: AbortSignal.timeout(PER_MIRROR_TIMEOUT),
      });
      if (!res.ok) continue;
      let geo;
      try {
        geo = simplifyOsm(await res.json(), { lat, lon });   // CPU 密集段独立捕获
      } catch { continue; }
      const payload = JSON.stringify(geo);
      if (payload.length < MAX_KV_BYTES) {
        await env.GEO_CACHE.put(key, payload, { expirationTtl: KV_TTL }).catch(() => {});
      }
      return json(geo, { "x-geo-cache": "miss", "x-geo-mirror": mirror });
    } catch {
      continue;
    }
  }
  await env.GEO_CACHE.put(failKey, "1", { expirationTtl: FAIL_TTL }).catch(() => {});
  return json({ fallback: true }, { "x-geo-cache": "fallback" });
}
