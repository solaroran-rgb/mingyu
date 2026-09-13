/** 全部可调参数单点集中（v4 §0.3 裁定；前后端共用，geo.ts 亦 import 本文件） */

export const CITY_CONFIG = {
  FULL_THRESHOLD: 150,         // ≥150 栋 → FULL 真实替换
  HYBRID_THRESHOLD: 20,        // 20~149 → HYBRID 叠加渐显；<20 → PLACEHOLDER+
  MAX_BUILDINGS: 800,          // 服务端裁剪上限
  MAX_BUILDINGS_MOBILE: 400,   // 移动端减半（REALTIME 降级约定）
  MAX_OUT_WAYS: 2500,          // Overpass "out geom qt" 上限（CPU 超限时第一旋钮：降到 1200）
  MIN_AREA_M2: 40,             // 小于此面积的 building 轮廓丢弃（车棚/垃圾房噪声）
  H_SCALE: 2.0,                // 建筑高度视觉夸张系数（服务端应用，写实太矮）
  PLACEHOLDER_COUNT: 30,
  PLACEHOLDER_COUNT_MOBILE: 15,
  GEO_API_TIMEOUT_MS: 15000,   // 前端总超时（服务端 3 镜像×8s 封顶 24s，前端先断）
  MORPH_DURATION_MS: 1200,     // 生长动画总时长（GPU 波纹由 REALTIME shader 驱动）
} as const;

export type CityMode = "FULL" | "HYBRID" | "PLACEHOLDER+";

export function classifyMode(buildingCount: number): CityMode {
  if (buildingCount >= CITY_CONFIG.FULL_THRESHOLD) return "FULL";
  if (buildingCount >= CITY_CONFIG.HYBRID_THRESHOLD) return "HYBRID";
  return "PLACEHOLDER+";
}