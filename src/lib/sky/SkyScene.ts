/**
 * @file SkyScene — Three.js 星空+城市整合场景（v2 视觉重做）
 * 纯黑宇宙 / 真实恒星 / 立体线框城市 / 线框仰望者 / 青蓝全息氛围
 * 坐标系：+X 东、+Y 天顶、+Z 北；天球 R=500；地面 y=0；1 unit = 10m
 */
import * as THREE from 'three';
import { toJulianDay, localSiderealTime, radecToVec3, radecToAltAz, DEG } from './astro';
import { STAR_COUNT, STAR_DATA } from './stars.data';
import { CONSTELLATION_SEGMENTS } from './constellations.data';
import { computeMoon, makeMoonTextures } from './moon';
import { fetchCityGeo, isFallback } from '../city/geoApi';

const R = 500;

/** 生成圆形径向渐变光点贴图（消除 PointsMaterial 默认方块） */
function makeDotTexture(): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.35, 'rgba(255,255,255,0.55)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

export interface SkySceneOptions {
  observer: { lat: number; lon: number };
  date: Date;
  mobile?: boolean;
  onConstellationHover?: (name: string | null) => void;
}

export class SkyScene {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private container: HTMLElement;
  private raf = 0;
  private opts: SkySceneOptions;
  private moonTextures: THREE.Texture[] = [];
  private moonSprite?: THREE.Sprite;
  private clock = new THREE.Clock();
  private constellLabels: { sprite: THREE.Sprite; dir: THREE.Vector3 }[] = [];
  private raycaster = new THREE.Raycaster();
  private mouseNDC = new THREE.Vector2();
  private hoveredName?: string;
  private hasPointerMoved = false;
  private lastMX = -9999;
  private lastMY = -9999;
  // 氛围动画对象
  private ambient?: THREE.Points;
  private ambientVel: Float32Array = new Float32Array(0);
  private footGlow?: THREE.Mesh;
  private bodyInner?: THREE.Points;
  private horizonGlow?: THREE.Mesh;
  private dotTex: THREE.Texture;

  private onMove = (e: MouseEvent) => {
    // 过滤页面加载时坐标未变的静止合成事件，避免信息卡误弹
    if (Math.abs(e.clientX - this.lastMX) < 1 && Math.abs(e.clientY - this.lastMY) < 1) return;
    this.lastMX = e.clientX; this.lastMY = e.clientY;
    this.hasPointerMoved = true;
    const rect = this.container.getBoundingClientRect();
    this.mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouseNDC, this.camera);
    const hits = this.raycaster.intersectObjects(this.constellLabels.map(l => l.sprite), false);
    const name = hits.length ? (hits[0].object.userData.name as string) : null;
    if (name !== this.hoveredName) {
      this.hoveredName = name ?? undefined;
      this.opts.onConstellationHover?.(name);
    }
  };

  constructor(container: HTMLElement, opts: SkySceneOptions) {
    this.container = container;
    this.opts = opts;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x020204, 1);
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    // 距离雾：城市/地面向远方淡出到纯黑（星空材质 fog:false 不受影响）
    this.scene.fog = new THREE.FogExp2(0x020204, 0.0016);

    this.camera = new THREE.PerspectiveCamera(58, 1, 0.1, 2000);
    // 仰望构图：小人身后微俯视（看到屋顶线网肌理），视线略俯，地平线在画面 40%
    this.camera.position.set(0, 34, -95);
    this.camera.lookAt(0, 18, 120);
    this.dotTex = makeDotTexture();

    this.moonTextures = makeMoonTextures();
    this.buildGround();
    this.buildDistantSkyline();
    this.buildStars();
    this.buildStarDust();
    this.buildConstellations();
    this.buildMoon();
    this.buildAvatar();
    this.buildAmbientParticles();

    this.resize();
    window.addEventListener('resize', this.resize);
    this.container.addEventListener('mousemove', this.onMove);
    this.updateConstellationLabels();
  }

  private resize = () => {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    // 容器尚未布局（0/NaN，常见于后台标签或首帧）时跳过，避免 aspect=NaN 污染投影矩阵导致整片对象被裁剪
    if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) return;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.updateConstellationLabels();
  };

  // ---------- 地面：透视网格 + 地平线辉光 ----------
  private buildGround() {
    const grid = new THREE.GridHelper(640, 64, 0x0e4458, 0x0a2c3c);
    const gm = grid.material as THREE.Material;
    gm.transparent = true;
    gm.opacity = 0.14;
    this.scene.add(grid);

    // 地平线青色辉光带（竖直平面，渐变 shader）
    const geo = new THREE.PlaneGeometry(900, 160);
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false,
      uniforms: { uTime: { value: 0 } },
      vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: `
        varying vec2 vUv; uniform float uTime;
        void main(){
          float band = smoothstep(0.5, 0.18, abs(vUv.y - 0.32));
          float edge = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x);
          float breathe = 0.8 + 0.2*sin(uTime*0.6);
          float a = band * edge * 0.10 * breathe;
          gl_FragColor = vec4(0.05, 0.55, 0.75, a);
        }`,
    });
    const plane = new THREE.Mesh(geo, mat);
    plane.position.set(0, 30, 230);
    (plane as any)._horizonGlow = true;
    this.horizonGlow = plane;
    this.scene.add(plane);
  }

  // ---------- fallback 远景天际线（仅起伏轮廓，不画门框） ----------
  private buildDistantSkyline() {
    const top: number[] = [];
    let x = -300;
    let seed = 7;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    let prevX = x, prevH = 2 + rnd() * 8, prevZ = 200;
    x += 6;
    while (x < 300) {
      const h = 2 + rnd() * 9;
      const z = 195 + rnd() * 15;
      // 只画连续顶部轮廓折线（起伏天际线），不画垂到地面的"门框腿"
      top.push(prevX, prevH, prevZ, x, h, z);
      prevX = x; prevH = h; prevZ = z;
      x += 5 + rnd() * 7;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(top, 3));
    const m = new THREE.LineBasicMaterial({ color: 0x2a86a8, transparent: true, opacity: 0.4, depthWrite: false });
    const l = new THREE.LineSegments(g, m);
    l.frustumCulled = false;
    (l as any)._isPlaceholder = true;
    this.scene.add(l);
  }

  // ---------- 真实恒星 ----------
  private buildStars() {
    const { lat, lon } = this.opts.observer;
    const jd = toJulianDay(this.opts.date.getTime());
    const lst = localSiderealTime(jd, lon);
    const latRad = lat * DEG;

    const positions = new Float32Array(STAR_COUNT * 3);
    const mags = new Float32Array(STAR_COUNT);
    const cis = new Float32Array(STAR_COUNT);

    for (let i = 0; i < STAR_COUNT; i++) {
      const ra = STAR_DATA[i * 4];
      const dec = STAR_DATA[i * 4 + 1];
      const mag = STAR_DATA[i * 4 + 2];
      const ci = STAR_DATA[i * 4 + 3];
      const v = radecToVec3(ra, dec, lst, latRad, R);
      positions[i * 3] = v.x;
      positions[i * 3 + 1] = v.y;
      positions[i * 3 + 2] = v.z;
      mags[i] = mag;
      cis[i] = ci;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aMag', new THREE.BufferAttribute(mags, 1));
    geo.setAttribute('aCi', new THREE.BufferAttribute(cis, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uMagLimit: { value: 6.0 },               // 全部 5044 颗
        uDpr: { value: Math.min(window.devicePixelRatio, 2) },
        uTime: { value: 0 },
      },
      vertexShader: `
        attribute float aMag;
        attribute float aCi;
        uniform float uMagLimit, uDpr, uTime;
        varying float vAlpha;
        varying vec3 vColor;
        varying float vBig;
        vec3 bvToRgb(float bv) {
          float t = clamp((bv + 0.4) / 2.0, 0.0, 1.0);
          vec3 cool = vec3(0.62, 0.78, 1.0);
          vec3 mid  = vec3(1.0, 1.0, 1.0);
          vec3 warm = vec3(1.0, 0.86, 0.66);
          vec3 red  = vec3(1.0, 0.62, 0.42);
          if (t < 0.33) return mix(cool, mid, t / 0.33);
          if (t < 0.66) return mix(mid, warm, (t - 0.33) / 0.33);
          return mix(warm, red, (t - 0.66) / 0.34);
        }
        void main() {
          if (aMag > uMagLimit) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 0.0; return; }
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          float brightness = pow(10.0, -0.4 * (aMag - uMagLimit));
          float size = clamp(2.8 * pow(brightness, 0.62), 0.75, 6.8) * uDpr;
          gl_PointSize = size;
          float tw = 0.85 + 0.15 * sin(uTime * 1.7 + position.x * 13.7 + position.y * 7.3);
          vAlpha = clamp(0.32 + 0.68 * brightness, 0.0, 1.0) * tw;
          vColor = bvToRgb(aCi);
          vBig = step(aMag, 2.1);
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        varying vec3 vColor;
        varying float vBig;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;
          float core = smoothstep(0.5, 0.0, d);
          float halo = smoothstep(0.5, 0.18, d) * 0.45;
          float spike = 0.0;
          if (vBig > 0.5) {
            float ax = smoothstep(0.018, 0.0, abs(uv.y)) * smoothstep(0.5, 0.0, abs(uv.x));
            float ay = smoothstep(0.018, 0.0, abs(uv.x)) * smoothstep(0.5, 0.0, abs(uv.y));
            spike = (ax + ay) * 0.55;
          }
          float a = vAlpha * (core * 0.9 + halo + spike);
          gl_FragColor = vec4(vColor, clamp(a, 0.0, 1.0));
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false,
    });

    const points = new THREE.Points(geo, mat);
    points.frustumCulled = false;
    (points as any)._isStars = true;
    this.scene.add(points);
    (this as any)._starMat = mat;
  }

  // ---------- 背景星尘（填补天区，避免大片纯黑） ----------
  private buildStarDust() {
    const N = this.opts.mobile ? 700 : 1400;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const az = Math.random() * Math.PI * 2;
      const alt = Math.random() * Math.PI * 0.5;          // 地平线上
      const rr = 470 + Math.random() * 20;
      pos[i * 3] = rr * Math.cos(alt) * Math.sin(az);
      pos[i * 3 + 1] = rr * Math.sin(alt) + 2;
      pos[i * 3 + 2] = rr * Math.cos(alt) * Math.cos(az);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0x8fb4d8, size: 1.1, map: this.dotTex, transparent: true, opacity: 0.15,
      blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true, fog: false,
    });
    const p = new THREE.Points(geo, mat);
    p.frustumCulled = false;
    (p as any)._isStars = true;
    this.scene.add(p);
  }

  private buildConstellations() {
    const { lat, lon } = this.opts.observer;
    const jd = toJulianDay(this.opts.date.getTime());
    const lst = localSiderealTime(jd, lon);
    const latRad = lat * DEG;

    const pts: number[] = [];
    for (const seg of CONSTELLATION_SEGMENTS) {
      const [ra1, dec1, ra2, dec2] = seg;
      const a = radecToVec3(ra1 * DEG, dec1 * DEG, lst, latRad, R);
      const b = radecToVec3(ra2 * DEG, dec2 * DEG, lst, latRad, R);
      pts.push(a.x, a.y, a.z, b.x, b.y, b.z);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    const mat = new THREE.LineBasicMaterial({
      color: 0x8fd8ee, transparent: true, opacity: 0.4, depthWrite: false, fog: false,
      blending: THREE.AdditiveBlending,
    });
    const lines = new THREE.LineSegments(geo, mat);
    lines.frustumCulled = false;
    (lines as any)._isConstell = true;
    this.scene.add(lines);
    this.buildConstellationLabels();
  }

  private buildConstellationLabels() {
    const { lat, lon } = this.opts.observer;
    const jd = toJulianDay(this.opts.date.getTime());
    const lst = localSiderealTime(jd, lon);
    const latRad = lat * DEG;
    const CONS: [string, number, number][] = [
      ['Ursa Major', 11.0, 50], ['Ursa Minor', 15.0, 75], ['Cassiopeia', 1.0, 60],
      ['Orion', 5.5, 0], ['Taurus', 4.5, 18], ['Gemini', 7.0, 25],
      ['Leo', 10.5, 15], ['Virgo', 13.3, 0], ['Scorpius', 16.8, -30],
      ['Sagittarius', 19.0, -25], ['Lyra', 18.7, 38.8], ['Aquila', 19.7, 8.7],
      ['Pegasus', 23.0, 20], ['Andromeda', 0.8, 35],
    ];
    for (const [name, raH, decD] of CONS) {
      // 地平线下星座不显示标签
      const aa = radecToAltAz(raH * 15 * DEG, decD * DEG, lst, latRad);
      if (aa.alt < -2 * DEG) continue;
      const v = radecToVec3(raH * 15 * DEG, decD * DEG, lst, latRad, R);
      const c = document.createElement('canvas');
      c.width = 512; c.height = 96;
      const ctx = c.getContext('2d')!;
      // 前缀菱形标记
      ctx.fillStyle = 'rgba(120,230,255,0.95)';
      ctx.shadowColor = 'rgba(0,200,255,0.9)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(28, 48); ctx.lineTo(38, 38); ctx.lineTo(48, 48); ctx.lineTo(38, 58); ctx.closePath();
      ctx.fill();
      // 文字
      ctx.font = '600 42px "Courier New", monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.shadowBlur = 14;
      ctx.fillStyle = 'rgba(196,240,255,0.92)';
      ctx.fillText(name.toUpperCase(), 66, 50);
      const tex = new THREE.CanvasTexture(c);
      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.92, depthWrite: false, depthTest: false, fog: false });
      const sp = new THREE.Sprite(mat);
      sp.position.set(v.x, v.y, v.z);
      sp.scale.set(96, 18, 1);
      sp.renderOrder = 999;
      sp.userData.name = name;
      (sp as any)._isConstell = true;
      this.scene.add(sp);
      this.constellLabels.push({ sprite: sp, dir: new THREE.Vector3(v.x, v.y, v.z).normalize() });
    }
  }

  /** 星座标签屏幕空间钳制投影 + 防重叠松弛（dir 先乘天球半径再做仿射变换） */
  private updateConstellationLabels() {
    if (!this.constellLabels.length) return;
    const f = 1 / Math.tan((this.camera.fov * DEG) / 2);
    const aspect = this.camera.aspect || 1;
    const depth = 430;
    // 分轴安全区：标签文字自菱形向右绘制，故左边界多留一个标签宽度，右边界稍收；顶部避让标题栏
    const X_LEFT = -0.66, X_RIGHT = 0.8, Y_TOP = 0.7, Y_BOT = -0.9;
    const clampX = (x: number) => Math.max(X_LEFT, Math.min(X_RIGHT, x));
    const v = new THREE.Vector3();
    // 1) 计算每个标签的目标 NDC
    const tg = this.constellLabels.map(({ sprite, dir }) => {
      v.copy(dir).multiplyScalar(R).applyMatrix4(this.camera.matrixWorldInverse);
      const zc = Math.max(-v.z, 0.5);
      let nx = (v.x / zc) * f / aspect;
      let ny = (v.y / zc) * f;
      nx = clampX(nx);
      ny = Math.max(Y_BOT, Math.min(Y_TOP, ny));
      return { sprite, nx, ny };
    });
    // 2) 标签在 depth 处的半宽/半高（NDC），用于碰撞推开
    const halfW = (0.5 * 96 * f) / (aspect * depth) * 1.05;
    const halfH = (0.5 * 18 * f) / depth * 1.6;
    for (let pass = 0; pass < 8; pass++) {
      for (let i = 0; i < tg.length; i++) {
        for (let j = i + 1; j < tg.length; j++) {
          const a = tg[i], b = tg[j];
          const dx = b.nx - a.nx, dy = b.ny - a.ny;
          const ox = halfW * 2 - Math.abs(dx);
          const oy = halfH * 2 - Math.abs(dy);
          if (ox > 0 && oy > 0) {
            // 沿重叠更浅的轴推开
            if (oy <= ox) { const s = (oy / 2 + 0.004) * (dy >= 0 ? 1 : -1); a.ny -= s; b.ny += s; }
            else { const s = (ox / 2 + 0.004) * (dx >= 0 ? 1 : -1); a.nx -= s; b.nx += s; }
          }
        }
      }
      // 推开后收回安全区
      tg.forEach(t => { t.nx = clampX(t.nx); t.ny = Math.max(Y_BOT, Math.min(Y_TOP, t.ny)); });
    }
    // 3) 反算回世界坐标
    for (const t of tg) {
      v.set(t.nx * aspect * depth / f, t.ny * depth / f, -depth).applyMatrix4(this.camera.matrixWorld);
      t.sprite.position.copy(v);
    }
  }

  private buildMoon() {
    const { lat, lon } = this.opts.observer;
    const jd = toJulianDay(this.opts.date.getTime());
    const lst = localSiderealTime(jd, lon);
    const moon = computeMoon(jd, lst, lat * DEG, R);
    if (moon.alt < 0) return;
    const mat = new THREE.SpriteMaterial({
      map: this.moonTextures[moon.slot],
      transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending, fog: false,
    });
    this.moonSprite = new THREE.Sprite(mat);
    (this.moonSprite as any)._isMoon = true;
    this.moonSprite.position.set(moon.vec.x, moon.vec.y, moon.vec.z);
    this.moonSprite.scale.set(12, 12, 1);
    this.scene.add(this.moonSprite);
  }

  // ---------- 线框仰望者（背影，面向 +z 星空） ----------
  private buildAvatar() {
    const group = new THREE.Group();
    // 人形骨架线段（背影：头/脊柱/肩/双臂微抬仰望/髋/双腿）
    const segs: number[] = [];
    const L = (x0: number, y0: number, z0: number, x1: number, y1: number, z1: number) =>
      segs.push(x0, y0, z0, x1, y1, z1);
    // 头（12 段圆环，略前倾）
    const HY = 9.7, HZ = 0.4, HR = 0.85, N = 12;
    for (let i = 0; i < N; i++) {
      const a0 = (i / N) * Math.PI * 2, a1 = ((i + 1) / N) * Math.PI * 2;
      L(Math.cos(a0) * HR, HY + Math.sin(a0) * HR * 1.05, HZ + Math.sin(a0) * 0.15,
        Math.cos(a1) * HR, HY + Math.sin(a1) * HR * 1.05, HZ + Math.sin(a1) * 0.15);
    }
    L(0, 8.85, 0.1, 0, 8.3, 0);                       // 颈
    L(0, 8.3, 0, 0, 4.3, 0);                          // 脊柱
    L(-1.15, 8.1, 0, 1.15, 8.1, 0);                   // 肩
    L(-1.15, 8.1, 0, -1.55, 6.5, 0.7);                // 左上臂
    L(-1.55, 6.5, 0.7, -1.35, 5.5, 1.5);              // 左前臂（微抬）
    L(1.15, 8.1, 0, 1.55, 6.5, 0.7);                  // 右上臂
    L(1.55, 6.5, 0.7, 1.35, 5.5, 1.5);                // 右前臂
    L(-0.85, 4.3, 0, 0.85, 4.3, 0);                   // 髋
    L(-0.7, 4.3, 0, -0.72, 2.1, 0.1);                 // 左大腿
    L(-0.72, 2.1, 0.1, -0.62, 0.2, 0.35);             // 左小腿
    L(0.7, 4.3, 0, 0.72, 2.1, 0.1);                   // 右大腿
    L(0.72, 2.1, 0.1, 0.62, 0.2, 0.35);               // 右小腿

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(segs, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x9ff2ff, transparent: true, opacity: 0.92,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const lines = new THREE.LineSegments(geo, lineMat);
    group.add(lines);

    // 关节发光节点
    const joints = [
      [0, HY, HZ], [-1.15, 8.1, 0], [1.15, 8.1, 0],
      [-1.55, 6.5, 0.7], [1.55, 6.5, 0.7], [-1.35, 5.5, 1.5], [1.35, 5.5, 1.5],
      [-0.85, 4.3, 0], [0.85, 4.3, 0], [0, 8.3, 0],
      [-0.72, 2.1, 0.1], [0.72, 2.1, 0.1], [-0.62, 0.2, 0.35], [0.62, 0.2, 0.35],
    ];
    const jp = new Float32Array(joints.length * 3);
    joints.forEach((j, i) => { jp[i * 3] = j[0]; jp[i * 3 + 1] = j[1]; jp[i * 3 + 2] = j[2]; });
    const jg = new THREE.BufferGeometry();
    jg.setAttribute('position', new THREE.BufferAttribute(jp, 3));
    const jm = new THREE.PointsMaterial({
      color: 0xd6fbff, size: 0.5, map: this.dotTex, transparent: true, opacity: 0.95,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    group.add(new THREE.Points(jg, jm));

    // 体内呼吸粒子
    const BN = 130;
    const bp = new Float32Array(BN * 3);
    for (let i = 0; i < BN; i++) {
      bp[i * 3] = (Math.random() - 0.5) * 2.2;
      bp[i * 3 + 1] = 0.5 + Math.random() * 9;
      bp[i * 3 + 2] = (Math.random() - 0.5) * 1.4;
    }
    const bg = new THREE.BufferGeometry();
    bg.setAttribute('position', new THREE.BufferAttribute(bp, 3));
    const bm = new THREE.PointsMaterial({
      color: 0x5fe0ff, size: 0.32, map: this.dotTex, transparent: true, opacity: 0.4,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const inner = new THREE.Points(bg, bm);
    this.bodyInner = inner;
    group.add(inner);

    group.scale.setScalar(1.25);
    group.traverse(o => { o.frustumCulled = false; });
    this.scene.add(group);

    // 脚边辉光（脉动）
    const glow = new THREE.Mesh(
      new THREE.CircleGeometry(4.5, 28),
      new THREE.MeshBasicMaterial({ color: 0x00c8ff, transparent: true, opacity: 0.16, depthWrite: false })
    );
    glow.rotation.x = -Math.PI / 2;
    glow.position.y = 0.06;
    this.footGlow = glow;
    this.scene.add(glow);
  }

  // ---------- 漂浮青色微尘 ----------
  private buildAmbientParticles() {
    const N = this.opts.mobile ? 160 : 320;
    const pos = new Float32Array(N * 3);
    this.ambientVel = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 260;
      pos[i * 3 + 1] = Math.random() * 60;
      pos[i * 3 + 2] = -30 + Math.random() * 220;
      this.ambientVel[i] = 0.015 + Math.random() * 0.05;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0x6fd8ff, size: 0.5, map: this.dotTex, transparent: true, opacity: 0.34,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const p = new THREE.Points(geo, mat);
    p.frustumCulled = false;
    this.ambient = p;
    this.scene.add(p);
  }

  // ---------- 真实 OSM 立体线框城市（顶环 + 垂直墙线） ----------
  async loadOSMCity() {
    const { lat, lon } = this.opts.observer;
    try {
      const res = await fetchCityGeo(lat, lon);
      if (isFallback(res)) return;
      // 移除旧的真实城市与 fallback 天际线（直接挂在 scene 下、带标记的对象）
      const toRemove: THREE.Object3D[] = [];
      this.scene.children.forEach(c => {
        if ((c as any)._isPlaceholder || (c as any)._isRealCity) toRemove.push(c);
      });
      toRemove.forEach(o => this.scene.remove(o));

      const roofNear: number[] = [], roofMid: number[] = [], roofFar: number[] = [], wall: number[] = [], warm: number[] = [];
      let warmBudget = 60;
      for (const b of res.buildings) {
        const p = b.pts;
        const h = (b.h as number) * 0.8;                 // 视觉压矮，避免方盒感
        if (!Number.isFinite(h) || h <= 0) continue;      // NaN/坏数据防护
        const nPts = p.length / 2;
        const closed = nPts > 1 && p[0] === p[(nPts - 1) * 2] && p[1] === p[(nPts - 1) * 2 + 1];
        const n = closed ? nPts - 1 : nPts;
        if (n < 3) continue;
        let cx = 0, cz = 0, bad = false;
        for (let i = 0; i < n; i++) {
          const x = p[i * 2], z = p[i * 2 + 1];
          if (!Number.isFinite(x) || !Number.isFinite(z)) { bad = true; break; }
          cx += x; cz += z;
        }
        if (bad) continue;
        cx /= n; cz /= n;
        if (Math.hypot(cx, cz) < 18) continue;         // 小人脚下圆形广场留白
        // 最靠近相机（z 最小）的角点
        let iNear = 0, zNear = Infinity;
        for (let i = 0; i < n; i++) { if (p[i * 2 + 1] < zNear) { zNear = p[i * 2 + 1]; iNear = i; } }
        const seg: number[] = [];
        for (let i = 0; i < n; i++) {
          const j = (i + 1) % n;
          seg.push(p[i * 2], h, p[i * 2 + 1], p[j * 2], h, p[j * 2 + 1]);
        }
        // 按到相机距离分层，近实远虚营造全息景深感
        const distToCam = Math.hypot(cx, cz + 95);
        const bucket = distToCam < 110 ? roofNear : distToCam < 225 ? roofMid : roofFar;
        for (const v of seg) bucket.push(v);
        // 仅最近一圈建筑补一条竖线形成立体轮廓
        if (distToCam < 85) {
          wall.push(p[iNear * 2], 0, p[iNear * 2 + 1], p[iNear * 2], h, p[iNear * 2 + 1]);
        }
        if (warmBudget > 0 && h > 1.2 && Math.random() < 0.06) {
          warm.push(cx, h + 0.2, cz);
          warmBudget--;
        }
      }
      // 注意：城市对象必须直接挂到 scene（异步回调里再包 Group 会导致不绘制）；
      // 线框统一用 AdditiveBlending 才能在纯黑底上呈现自发光效果。
      const addLine = (arr: number[], color: number, op: number) => {
        if (!arr.length) return;
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3));
        const m = new THREE.LineBasicMaterial({ color, transparent: true, opacity: op, depthWrite: false, fog: false, blending: THREE.AdditiveBlending });
        const l = new THREE.LineSegments(g, m);
        l.frustumCulled = false;
        (l as any)._isRealCity = true;
        this.scene.add(l);
      };
      addLine(roofNear, 0x6fe0ff, 0.85);   // 近景屋顶：最亮青
      addLine(roofMid, 0x46b6dd, 0.5);     // 中景：标准青蓝
      addLine(roofFar, 0x2a7fa8, 0.28);    // 远景：深蓝淡入
      addLine(wall, 0x2c7fa3, 0.45);       // 近景墙竖线
      if (warm.length) {
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute(warm, 3));
        const m = new THREE.PointsMaterial({
          color: 0xffb066, size: 0.6, map: this.dotTex, transparent: true, opacity: 0.55,
          blending: THREE.AdditiveBlending, depthWrite: false,
        });
        const pp = new THREE.Points(g, m);
        pp.frustumCulled = false;
        (pp as any)._isRealCity = true;
        this.scene.add(pp);
      }
      // 河流
      const wat: number[] = [];
      for (const w of res.water) {
        for (let i = 0; i + 3 < w.length; i += 2) {
          wat.push(w[i], 0.12, w[i + 1], w[i + 2], 0.12, w[i + 3]);
        }
      }
      addLine(wat, 0x38b8d8, 0.55);
    } catch (e) {
      console.warn('OSM load failed', e);
    }
  }

  /** 切换地点/时间：重建星点/星座/月亮/城市 */
  updateSpatioTemporal(lat: number, lon: number, date: Date) {
    this.opts.observer = { lat, lon };
    this.opts.date = date;
    const toRemove: THREE.Object3D[] = [];
    this.scene.children.forEach(c => {
      if ((c as any)._isStars || (c as any)._isConstell || (c as any)._isMoon) toRemove.push(c);
    });
    toRemove.forEach(o => this.scene.remove(o));
    this.constellLabels.length = 0;
    this.hoveredName = undefined;
    this.opts.onConstellationHover?.(null);
    this.buildStars();
    this.buildStarDust();
    this.buildConstellations();
    this.buildMoon();
    this.updateConstellationLabels();
    this.loadOSMCity();
  }

  async captureFrame(): Promise<Blob> {
    this.renderer.render(this.scene, this.camera);
    return await new Promise((resolve, reject) => {
      this.renderer.domElement.toBlob((b) => b ? resolve(b) : reject(new Error('no blob')), 'image/png');
    });
  }

  start() {
    this.loadOSMCity();
    const loop = () => {
      const t = this.clock.getElapsedTime();
      const starMat = (this as any)._starMat;
      if (starMat) starMat.uniforms.uTime.value = t;
      if (this.horizonGlow) (this.horizonGlow.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
      // 漂浮微尘上升循环
      if (this.ambient) {
        const a = this.ambient.geometry.getAttribute('position') as THREE.BufferAttribute;
        const arr = a.array as Float32Array;
        for (let i = 0; i < arr.length / 3; i++) {
          arr[i * 3 + 1] += this.ambientVel[i];
          arr[i * 3] += Math.sin(t * 0.5 + i) * 0.004;
          if (arr[i * 3 + 1] > 62) { arr[i * 3 + 1] = 0; arr[i * 3 + 2] = -30 + Math.random() * 220; }
        }
        a.needsUpdate = true;
      }
      if (this.bodyInner) (this.bodyInner.material as THREE.PointsMaterial).opacity = 0.32 + 0.14 * Math.sin(t * 1.4);
      if (this.footGlow) {
        const s = 1 + 0.08 * Math.sin(t * 1.4);
        this.footGlow.scale.setScalar(s);
        (this.footGlow.material as THREE.MeshBasicMaterial).opacity = 0.13 + 0.06 * Math.sin(t * 1.4);
      }
      // 每帧重算星座标签的屏幕钳制位置（依赖相机矩阵，构造期矩阵尚未更新，必须在渲染循环里做）
      this.updateConstellationLabels();
      this.renderer.render(this.scene, this.camera);
      this.raf = requestAnimationFrame(loop);
    };
    loop();
  }

  dispose() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.resize);
    this.container.removeEventListener('mousemove', this.onMove);
    this.renderer.dispose();
    this.container.removeChild(this.renderer.domElement);
  }
}
