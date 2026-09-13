import * as THREE from "three";
import type { CityGeo, CityBuilding } from "./geoApi";
import { classifyMode, CITY_CONFIG, type CityMode } from "./config";
import { mergeLineGeometries, type PlaceholderBuilding } from "./placeholder";
import { CELL, COVERAGE, SECTOR_COUNT, sectorOf } from "./projection";

/**
 * 交付给 REALTIME 的批次。
 * buildings 批含 GPU 生长 attribute（契约 v4 §2，aMatch 语义已简化，见审计 C2）：
 *   aDelay    FULL: 扇区 base(0~0.5s 按桶数均分) + 距中心 0~0.4s；HYBRID: 全 0
 *   aTargetH  目标高度(units)，已含服务端 H_SCALE
 *   aMatch    1=与占位建筑匹配(仅FULL) / 2=新增或HYBRID叠加（0 不使用）
 * material 由 REALTIME 注入（buildings → grow.vert ShaderMaterial；
 * water/peaks → LineBasicMaterial）。position.y 已是最终高度，shader 用
 * growth 因子缩放即可，boundingSphere 按最终态计算，视锥剔除安全。
 */
export interface CityBatch {
  kind: "buildings" | "water" | "peaks";
  geometry: THREE.BufferGeometry;
  sector: number;    // water/peaks 恒 -1（静态批，不进波纹）
  mode: CityMode;
}

/**
 * @param geo        /api/geo 成功响应
 * @param phBuildings 占位城市元数据（buildPlaceholderCity(...).userData.buildings）
 * @param mobile     REALTIME 画质分级判定后传入
 */
export function cityGeoToBatches(
  geo: CityGeo,
  phBuildings: PlaceholderBuilding[],
  mobile: boolean,
): { batches: CityBatch[]; mode: CityMode } {
  const mode = classifyMode(geo.raw_count);
  const batches: CityBatch[] = [];

  if (mode !== "PLACEHOLDER+") {
    let blds = geo.buildings;
    if (mobile && blds.length > CITY_CONFIG.MAX_BUILDINGS_MOBILE) {
      blds = [...blds]
        .sort((a, b) => centroidR(a) - centroidR(b))
        .slice(0, CITY_CONFIG.MAX_BUILDINGS_MOBILE);
    }
    const nBuckets = mobile ? 2 : SECTOR_COUNT;
    const buckets: CityBuilding[][] = Array.from({ length: nBuckets }, () => []);
    for (const b of blds) {
      const c = centroid(b);
      const sec = sectorOf(c.x, c.z);
      buckets[mobile ? (sec < SECTOR_COUNT / 2 ? 0 : 1) : sec].push(b);
    }
    const delayStep = 0.5 / nBuckets;   // 修复 B3：按实际桶数均分波纹窗口
    buckets.forEach((bucket, si) => {
      if (!bucket.length) return;
      batches.push({
        kind: "buildings",
        geometry: buildBuildingGeometry(bucket, phBuildings, mode, si * delayStep),
        sector: si,
        mode,
      });
    });
  }

  // PLACEHOLDER+ 也画真实 water/peaks（国内水系覆盖远好于 building，画面不空）
  const waterGeo = buildWaterGeometry(geo.water);
  if (waterGeo) batches.push({ kind: "water", geometry: waterGeo, sector: -1, mode });
  const peakGeo = buildPeakGeometry(geo.peaks);
  if (peakGeo) batches.push({ kind: "peaks", geometry: peakGeo, sector: -1, mode });

  return { batches, mode };
}

function ringInfo(b: CityBuilding): { n: number; cx: number; cz: number } {
  const nPts = b.pts.length / 2;
  const closed =
    nPts > 1 &&
    b.pts[0] === b.pts[(nPts - 1) * 2] &&
    b.pts[1] === b.pts[(nPts - 1) * 2 + 1];
  const n = closed ? nPts - 1 : nPts;   // 防御性剥离闭合重复点（修复 B1）
  let cx = 0, cz = 0;
  for (let i = 0; i < n; i++) { cx += b.pts[i * 2]; cz += b.pts[i * 2 + 1]; }
  return { n, cx: cx / n, cz: cz / n };
}
function centroid(b: CityBuilding): { x: number; z: number } {
  const { cx, cz } = ringInfo(b);
  return { x: cx, z: cz };
}
function centroidR(b: CityBuilding): number {
  const { cx, cz } = ringInfo(b);
  return Math.hypot(cx, cz);
}

function buildBuildingGeometry(
  blds: CityBuilding[],
  ph: PlaceholderBuilding[],
  mode: CityMode,
  baseDelay: number,
): THREE.BufferGeometry {
  const pos: number[] = [], delay: number[] = [], target: number[] = [], match: number[] = [];
  const MATCH_R = CELL * 1.5;

  for (const b of blds) {
    const { n, cx, cz } = ringInfo(b);
    if (n < 3) continue;
    const r = Math.hypot(cx, cz);
    const d = mode === "HYBRID" ? 0 : baseDelay + Math.min(0.4, (r / COVERAGE) * 0.4);
    let m = 2;
    if (mode === "FULL") {
      for (const pb of ph) {
        if (Math.hypot(pb.x - cx, pb.z - cz) <= MATCH_R) { m = 1; break; }
      }
    }
    const push = (x: number, y: number, z: number) => {
      pos.push(x, y, z); delay.push(d); target.push(b.h); match.push(m);
    };
    // 每栋：顶环 n 段 + n 条竖线 = 2n 段 = 4n 顶点（底环贴地不可见，省略）
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const x0 = b.pts[i * 2], z0 = b.pts[i * 2 + 1];
      const x1 = b.pts[j * 2], z1 = b.pts[j * 2 + 1];
      push(x0, b.h, z0); push(x1, b.h, z1);
      push(x0, 0, z0);   push(x0, b.h, z0);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("aDelay", new THREE.Float32BufferAttribute(delay, 1));
  g.setAttribute("aTargetH", new THREE.Float32BufferAttribute(target, 1));
  g.setAttribute("aMatch", new THREE.Float32BufferAttribute(match, 1));
  return g;
}

function buildWaterGeometry(water: number[][]): THREE.BufferGeometry | null {
  const pos: number[] = [];
  const Y = 0.15;   // 略高于占位水面(0.02)与地面，防 z-fighting
  for (const line of water) {
    const n = line.length / 2;
    for (let i = 0; i < n - 1; i++) {
      pos.push(line[i * 2], Y, line[i * 2 + 1], line[i * 2 + 2], Y, line[i * 2 + 3]);
    }
  }
  if (!pos.length) return null;
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  return g;
}

function buildPeakGeometry(peaks: [number, number][]): THREE.BufferGeometry | null {
  if (!peaks.length) return null;
  const geos: THREE.BufferGeometry[] = [];
  for (const [x, z] of peaks) {
    const cone = new THREE.ConeGeometry(1.5, 2.4, 4, 1, true);
    cone.translate(x, 1.2, z);
    geos.push(new THREE.EdgesGeometry(cone));
    cone.dispose();
  }
  const merged = mergeLineGeometries(geos);
  geos.forEach((g) => g.dispose());
  return merged;
}

/** 仅释放 geometry；material 归 REALTIME 所有由其释放 */
export function disposeBatches(batches: CityBatch[]): void {
  for (const b of batches) b.geometry.dispose();
}