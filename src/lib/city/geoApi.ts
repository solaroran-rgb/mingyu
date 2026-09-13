import { CITY_CONFIG } from "./config";

/** 服务端已完成投影/量化/简化，坐标单位 = scene units，前端零计算 */
export interface CityBuilding {
  pts: number[];   // 扁平闭合环 [x0,z0,...,xn,zn]（末点=首点）
  h: number;       // 目标高度(units)，已含 H_SCALE
  lv?: number;     // OSM building:levels（有则透传）
  area?: number;   // footprint 面积 m²
}

export interface CityGeo {
  v: 1;
  center: [number, number];
  ts: number;
  raw_count: number;             // 裁剪前建筑总数（前端据此 classifyMode）
  buildings: CityBuilding[];
  water: number[][];             // 折线集，每条 [x0,z0,x1,z1,...]
  peaks: [number, number][];
}

export type GeoFallback = { fallback: true };
export type GeoResponse = CityGeo | GeoFallback;

export function isFallback(r: GeoResponse): r is GeoFallback {
  return "fallback" in r;
}

/**
 * 拉取城市几何。任何失败（预中止/超时/非200/网络错）都返回 fallback，
 * 永不 throw —— 调用方维持占位常驻，不打扰用户。
 */
export async function fetchCityGeo(
  lat: number,
  lon: number,
  signal?: AbortSignal,
): Promise<GeoResponse> {
  if (signal?.aborted) return { fallback: true };   // 修复 B4：预中止短路
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), CITY_CONFIG.GEO_API_TIMEOUT_MS);
  const onOuterAbort = () => ctrl.abort();
  signal?.addEventListener("abort", onOuterAbort, { once: true });
  try {
    const url = `/api/geo?lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}`;
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) return { fallback: true };
    return (await res.json()) as GeoResponse;
  } catch {
    return { fallback: true };
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onOuterAbort);
  }
}