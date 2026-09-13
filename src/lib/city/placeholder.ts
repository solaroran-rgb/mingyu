import * as THREE from "three";
import { seededRandom, type SeededRandom } from "./seed";
import { CELL, COVERAGE, sectorOf, snapToCell } from "./projection";
import { CITY_CONFIG } from "./config";

const COLOR = {
  grid: 0x50b4dc,
  building: 0x64c8eb,
  water: 0x5aa0dc,
  terrain: 0x50b4dc,
};

export interface PlaceholderBuilding { x: number; z: number; h: number; sector: number }

/**
 * 仅含 position attribute 的 LineSegments 几何合并（替代 three/examples/jsm
 * BufferGeometryUtils，消除 jsm 版本兼容风险，修复 C3）。
 */
export function mergeLineGeometries(geos: THREE.BufferGeometry[]): THREE.BufferGeometry {
  let total = 0;
  for (const g of geos) total += (g.attributes.position as THREE.BufferAttribute).count;
  const arr = new Float32Array(total * 3);
  let off = 0;
  for (const g of geos) {
    const p = g.attributes.position as THREE.BufferAttribute;
    arr.set(p.array as ArrayLike<number> as Float32Array, off);
    off += p.count * 3;
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute("position", new THREE.BufferAttribute(arr, 3));
  return out;
}

/** 轻量 seeded value noise（16×16 格），仅地形起伏用 */
function makeNoise(rnd: SeededRandom): (x: number, z: number) => number {
  const g = new Float32Array(256);
  for (let i = 0; i < 256; i++) g[i] = rnd.next();
  const at = (ix: number, iz: number) =>
    g[(((ix % 16) + 16) % 16) * 16 + (((iz % 16) + 16) % 16)];
  const fade = (t: number) => t * t * (3 - 2 * t);
  return (x, z) => {
    const x0 = Math.floor(x), z0 = Math.floor(z);
    const tx = fade(x - x0), tz = fade(z - z0);
    const a = at(x0, z0), b = at(x0 + 1, z0), c = at(x0, z0 + 1), d = at(x0 + 1, z0 + 1);
    return (a * (1 - tx) + b * tx) * (1 - tz) + (c * (1 - tx) + d * tx) * tz;
  };
}

function lineMat(color: number, opacity: number): THREE.LineBasicMaterial {
  return new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false });
}

/**
 * 构建占位城市（契约：返回 THREE.Group，修复 C1）。
 * 元数据挂 group.userData.buildings: PlaceholderBuilding[]（meshBuilder 计算 aMatch 用）。
 * seedKey 建议传 cityName；纯本地零网络，目标 ≤16ms。
 */
export function buildPlaceholderCity(seedKey: string, mobile: boolean): THREE.Group {
  const rnd = seededRandom("temposoul:" + seedKey);
  const group = new THREE.Group();
  group.name = "placeholder-city";
  group.userData.seedKey = seedKey;
  const buildings: PlaceholderBuilding[] = [];

  // 1) 网格平面（y=0）
  const grid = new THREE.GridHelper(COVERAGE * 2, mobile ? 12 : 24, COLOR.grid, COLOR.grid);
  const gm = grid.material as THREE.LineBasicMaterial;
  gm.transparent = true;
  gm.opacity = 0.10;
  grid.name = "ph-grid";
  group.add(grid);

  // 2) 噪声地形（极暗"山河暗示"，y=-0.05 防 z-fighting；中心平坦，边缘起伏）
  const seg = mobile ? 20 : 40;
  const terrGeo = new THREE.PlaneGeometry(COVERAGE * 2, COVERAGE * 2, seg, seg);
  terrGeo.rotateX(-Math.PI / 2);
  const noise = makeNoise(rnd);
  const pos = terrGeo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    const edge = Math.min(1, Math.max(0, (Math.hypot(x, z) - COVERAGE * 0.5) / (COVERAGE * 0.5)));
    pos.setY(i, -0.05 + (noise(x / 40, z / 40) - 0.5) * 3 * edge * edge);
  }
  const terrLines = new THREE.LineSegments(new THREE.WireframeGeometry(terrGeo), lineMat(COLOR.terrain, 0.08));
  terrGeo.dispose();
  terrLines.name = "ph-terrain";
  group.add(terrLines);

  // 3) 占位建筑（CELL 量化采样，中心密边缘疏；全部 merge 为 1 个 LineSegments）
  const count = mobile ? CITY_CONFIG.PLACEHOLDER_COUNT_MOBILE : CITY_CONFIG.PLACEHOLDER_COUNT;
  const used = new Set<string>();
  const edgeGeos: THREE.BufferGeometry[] = [];
  let guard = 0;
  while (buildings.length < count && guard++ < count * 10) {
    const ang = rnd.next() * Math.PI * 2;
    const r = COVERAGE * 0.85 * Math.pow(rnd.next(), 0.7);
    const c = snapToCell({ x: Math.cos(ang) * r, z: Math.sin(ang) * r });
    const key = `${c.x},${c.z}`;
    if (used.has(key)) continue;
    used.add(key);
    const w = rnd.range(4, 10), d = rnd.range(4, 10), h = rnd.range(2, 12);
    const box = new THREE.BoxGeometry(w, h, d);
    box.translate(c.x, h / 2, c.z);
    const edges = new THREE.EdgesGeometry(box);
    box.dispose();
    edgeGeos.push(edges);
    buildings.push({ x: c.x, z: c.z, h, sector: sectorOf(c.x, c.z) });
  }
  const bLines = new THREE.LineSegments(mergeLineGeometries(edgeGeos), lineMat(COLOR.building, 0.35));
  edgeGeos.forEach((g) => g.dispose());
  bLines.name = "ph-buildings";
  group.add(bLines);

  // 4) 河流（1~2 条三次贝塞尔，双线偏移 ±0.75u 模拟宽度感；直接构建线段数组，修复 B5）
  const riverPos: number[] = [];
  const rivers = rnd.next() < 0.5 ? 2 : 1;
  const Y = 0.02;
  for (let k = 0; k < rivers; k++) {
    const curve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-COVERAGE, Y, rnd.range(-COVERAGE * 0.7, COVERAGE * 0.7)),
      new THREE.Vector3(-COVERAGE * 0.3, Y, rnd.range(-COVERAGE * 0.8, COVERAGE * 0.8)),
      new THREE.Vector3(COVERAGE * 0.3, Y, rnd.range(-COVERAGE * 0.8, COVERAGE * 0.8)),
      new THREE.Vector3(COVERAGE, Y, rnd.range(-COVERAGE * 0.7, COVERAGE * 0.7)),
    );
    for (const off of [-0.75, 0.75]) {
      let px = 0, py = Y, pz = 0;
      for (let i = 0; i <= 48; i++) {
        const p = curve.getPoint(i / 48);
        const t = curve.getTangent(i / 48);
        const cx = p.x - t.z * off, cz = p.z + t.x * off;
        if (i > 0) riverPos.push(px, py, pz, cx, Y, cz);
        px = cx; pz = cz;
      }
    }
  }
  const waterGeo = new THREE.BufferGeometry();
  waterGeo.setAttribute("position", new THREE.Float32BufferAttribute(riverPos, 3));
  const water = new THREE.LineSegments(waterGeo, lineMat(COLOR.water, 0.5));
  water.name = "ph-water";
  group.add(water);

  group.userData.buildings = buildings;
  return group;
}

/** 切城市必须调用，防显存泄漏 */
export function disposePlaceholder(group: THREE.Group): void {
  group.traverse((o) => {
    const any = o as unknown as { geometry?: THREE.BufferGeometry; material?: THREE.Material | THREE.Material[] };
    any.geometry?.dispose?.();
    const m = any.material;
    if (Array.isArray(m)) m.forEach((mm) => mm.dispose());
    else m?.dispose?.();
  });
}