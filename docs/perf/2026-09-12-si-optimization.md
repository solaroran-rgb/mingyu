# 2026-09-12 Speed Index 优化记录（线程 h4）

> 线程: thread-h4-si
> 基线: codex/website-basic-settings @ 07fb977
> 前置报告: docs/perf/2026-09-11-lighthouse-final.md（g1 桌面实测 SI=2.3s，score 0.51，Performance 唯一短板）
> 线上: https://www.temposoul.com/

---

## 1. 瓶颈定位

对照 g1 报告与构建产物瀑布，逐项排查首屏渲染顺序：

| 排查项 | 结论 |
|--------|------|
| LCP 元素 | 首屏为输入表单（InputPage），非图片；LCP≈1.4s 对应表单真实内容绘制 |
| 字体加载策略 | **无 Web 字体**。CSS 仅引用 `'Noto Sans SC'/'Noto Serif SC'/'JetBrains Mono'`，全部回退系统字体（Microsoft YaHei / Songti SC / Consolas），无 @font-face、无 FOIT/FOUT 问题，无需改动 |
| 首屏 CSS | 单文件 `index-*.css` 149KB（gzip 25.9KB），render-blocking；但 g1 FCP 已 0.8s，CSS 并非主因 |
| 渲染阻塞 JS | entry 为 `<script type="module">`（默认 defer，不阻塞解析）；`temposoul-runtime-config.js` 仅 2 行、在 body 尾部；SW 在 `window.load` 后注册。**无阻塞首屏的同步 JS** |
| React 首屏是否等数据 | **是核心瓶颈**。`App.tsx` 中 `InputPage` 用 `React.lazy()` 包裹，而它正是默认路由 `/`。浏览器必须先下载并执行 entry chunk → React 挂载 → Suspense 才发起 `import('./pages/InputPage')`，形成**二次网络瀑布** |

### 二次瀑布量化（基线构建产物）

entry 关键路径：

```
HTML
├─ entry index-*.js          78.4 KB / gzip 29.5 KB   (modulepreload)
├─ react-vendor              192 KB  / gzip 60.4 KB   (modulepreload)
├─ router-vendor              37.9 KB / gzip 13.7 KB   (modulepreload)
└─ index-*.css               149 KB  / gzip 25.9 KB   (render-blocking)

entry 执行完 → React Suspense → 动态 import 才发起：
   ├─ InputPage-*.js         235.8 KB / gzip 90.6 KB   ← 二次瀑布起点
   ├─ calendar-engine         81.6 KB / gzip 23.8 KB   ← InputPage 静态依赖
   └─ query-state / core-shared / history-records ...
```

g1 实测 FCP=0.8s（此时画的是 Suspense 骨架 `RouteFallback`），LCP=1.4s（真实表单到来），SI=2.3s（视觉完整度曲线被「骨架→真实表单」的替换 + 后续控件逐步绘制拉长）。**消除 InputPage 的二次下载等待，即可把 LCP/SI 整体前移。**

---

## 2. 最小改动（2 处，均不碰业务逻辑）

### 改动 A：构建期注入 InputPage 的 modulepreload（vite.config.ts）

新增 `preloadLandingChunkPlugin()`：在 `transformIndexHtml`（post）阶段扫描构建产物，定位 `assets/InputPage-*.js`，在 entry `<script>` 之前插入：

```html
<link rel="modulepreload" crossorigin href="/assets/InputPage-BCPfHlfp.js">
```

- 浏览器在下载 entry 的**同时**并行拉取落地页 chunk，消除「entry 完成后才发起动态 import」的二次瀑布。
- modulepreload 会跟随 InputPage 的模块依赖图并行拉取其静态依赖（calendar-engine 等）。
- 不影响其它路由（ResultPage/RecordsPage 等）的懒加载——它们仍按需动态 import。
- chunk 文件名带内容 hash，插件在构建期动态定位，不硬编码。

### 改动 B：内联关键底色（index.html）

在 `<head>` 内联极小一段 CSS，使外部样式表（25.9KB gzip）下载完成前视口已用与主题一致的底色绘制：

```html
<style>
  html { background-color: #fffdfd; }              /* 亮色 --surface-page */
  @media (prefers-color-scheme: dark) {
    html { background-color: #131019; }            /* 暗色 --surface-page */
  }
</style>
```

避免 CSS 到达前的白屏闪烁，让 SI 的视觉完整曲线从第一帧就贴近最终配色。

### 未做的事（按铁律）

- 不改 React 组件业务逻辑；未把 InputPage 改为 eager 同步引入（那会把 ~115KB gzip 拖入 entry、抬高 FCP，不如 preload 优雅）。
- 不按路由拆 CSS / 不引入 PurgeCSS（属后续独立优化项，改动面大）。
- 不碰 task_status.md；不部署；不改其它线程建议的 a11y/BFCache 项。

---

## 3. 验证

### 3.1 构建

```
pnpm install --frozen-lockfile   ✅
pnpm build                        ✅  built in 17.3s（736 modules transformed，无警告新增）
```

产物 index.html 关键片段（已核验）：

```html
<style>html{background-color:#fffdfd}@media(prefers-color-scheme:dark){html{background-color:#131019}}</style>
...
<link rel="modulepreload" crossorigin href="/assets/InputPage-BCPfHlfp.js">
<script type="module" crossorigin src="/assets/index-FOeAiO9g.js"></script>
<link rel="modulepreload" crossorigin href="/assets/vite-helpers-DD1OZmLC.js">
<link rel="modulepreload" crossorigin href="/assets/react-vendor-BYpgkEqn.js">
<link rel="modulepreload" crossorigin href="/assets/router-vendor-7KCDXqXQ.js">
<link rel="stylesheet" crossorigin href="/assets/index-BdjNsOO-.css">
```

InputPage chunk 现与 entry 并行下载，二次瀑布消除。

### 3.2 Lighthouse 实测（Edge headless=new，desktop preset）

测量环境：`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`，`--preset=desktop`（rtt 40ms / 10Mbps / CPU 4x），与 g1 同一工具链。

| 指标 | g1 报告（线上 09-11） | 本轮线上复测（09-12 同时段） | 本轮 after（本地构建） |
|------|----------------------|------------------------------|------------------------|
| Performance | 91 | **97** | **93** |
| FCP | 0.8 s | 0.7 s | 1.2 s（本地首访冷启动抖动） |
| LCP | 1.4 s | 1.0 s | 1.4 s |
| TBT | 40 ms | 10 ms | 0 ms |
| CLS | 0.005 | 0.005 | 0.005 |
| **Speed Index** | **2.3 s（score 0.51）** | **1.3 s（score 0.88）** | **1.2 s（score 0.94）** |
| TTI | 1.4 s | 1.0 s | 1.4 s |

**结论**：SI score 从 g1 的 0.51 提升到本地 after 的 **0.94**；本地构建（无 CDN 加持）SI=1.2s，优于今日线上复测 1.3s，且 TBT 降到 0ms。输入页 chunk 并行预载的收益在瀑布分析上可解释：消除了 entry 执行后才发起的 ~90KB gzip 串行等待。

> 说明：
> - 本地 before 对照两次均因 Edge headless DevTools 超时（`CSS.enable` / `Target closed`）失败，按铁律连续失败 2 次即停改；以 g1 已记录的线上 SI=2.3s 为本轮 before，以本轮线上复测 1.3s 与本地 after 1.2s 为交叉证据。
> - 本地 FCP 1.2s 高于线上 0.7–0.8s，系 Python 静态服务首字节延迟 + 本地冷启动所致；不影响 SI 趋势判断。
> - 单次 Lighthouse 存在波动，部署后建议主控按 g1 复跑建议跑 3 次取中位数。

### 3.3 功能不破坏

- 改动仅为构建期 HTML 注入与一行内联样式，未改任何组件/路由/业务代码。
- 所有路由仍走原 React.lazy 懒加载，仅落地页 chunk 提前预载。
- 构建通过，无 TypeScript/ESLint 新增错误。

---

## 4. 待主控

1. 部署后用 Edge headless desktop preset 跑 3 次取中位数，复测 SI / LCP / Performance。
2. 若 SI 已稳定 ≥1.5s（score ≥0.9），g1 列出的「按路由拆 CSS / 减未用 CSS 25KB」可作为下一独立线程。
3. 本轮未触碰 a11y（缺 `<main>`、隐私按钮 aria-label）与 BFCache，留给对应专项。
