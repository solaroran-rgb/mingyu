# 2026-09-11 Lighthouse 性能验收与构建优化报告

> 线程 C · Lighthouse/PWA 验收与性能优化
> 分支: thread-c-perf @ 52d9f24
> 线上验证目标: https://www.temposoul.com/

## 1. Lighthouse 跑分

### 采集方式

本次环境下 **本地 Lighthouse 和 PageSpeed Insights API 均不可用**：

- **本地 Lighthouse**: Chrome 已安装（`%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe`），但 `npx lighthouse` 启动失败（Chrome 进程异常退出，exit code 1）。
- **PageSpeed Insights API**: `https://www.googleapis.com/pagespeedonline/v5/runPagespeed` 连接超时（WinError 10060），可能受网络代理影响。

**替代方案**: 以 Vite 构建输出 + index.html modulepreload 清单为准，手动记录关键指标。Lighthouse 正式跑分需主控部署后在有 Chrome 的环境复测。

### 桌面基线分（线上当前版本）

| 指标 | 数值 | 说明 |
|------|------|------|
| Lighthouse Performance | **待复测** | 当前线上版本未做过 Lighthouse 验收 |
| 初始 JS 传输量（gzip） | **~492 kB** | 见下方 chunk 分析 |
| 最大 chunk | **chart-engine 908 kB** (gzip 255 kB) | 被 modulepreload 到首屏 |

## 2. 问题诊断

### 根因：chart-engine (908KB) 被 modulepreload 到首屏

基线构建的 `index.html` 包含以下 `<link rel="modulepreload">`：

```html
<link rel="modulepreload" href="react-vendor-BYpgkEqn.js">   <!-- 192 KB -->
<link rel="modulepreload" href="tyme-vendor-Dq0bNFQQ.js">     <!-- 212 KB -->
<link rel="modulepreload" href="chart-engine-BNGS0YYK.js">    <!-- 908 KB ← 问题！ -->
<link rel="modulepreload" href="router-vendor-7KCDXqXQ.js">   <!-- 38 KB -->
```

**原因链**：
1. Vite 的 `__vitePreload` 辅助函数被 Rollup 放入了 `chart-engine` chunk
2. 入口 chunk（`index-*.js`）必须静态导入 preload helper
3. 导致 `chart-engine` 成为入口的静态依赖 → 自动生成 modulepreload
4. 908KB 的 bazi/ziwei/chart 代码在用户首次打开首页时即被下载

**次要问题**：`InputPage` 通过 `@temposoul/core/calendar` 导入日历工具函数，但 Rollup 将这些共享模块合并进了 `chart-engine` chunk，进一步放大了首屏负担。

## 3. 优化措施

### 修改文件

- `build/chunking.ts` — 重写 manualChunks 策略

### 优化内容

1. **隔离 Vite preload helper**：将 `\0vite/preload-helper.js` 和 `\0vite/modulepreload-polyfill.js` 映射到独立的 `vite-helpers` chunk（1.82 KB），不再拉入 engine 代码。

2. **修正包路径**：原规则检查 `packages/core/src/bazi`，但实际构建解析路径为 `packages/core/dist/bazi`（包经 tsc 编译后发布到 dist/）。修正为同时匹配 `src/` 和 `dist/`。

3. **拆分 chart-engine 为多个粒度 chunk**：

| 新 chunk | 内容 | 大小 | 加载时机 |
|----------|------|------|----------|
| `calendar-engine` | 日历/时间工具 | 81 KB (gzip 23 KB) | InputPage |
| `bazi-engine` | 八字排盘引擎 | 469 KB (gzip 119 KB) | ResultPage (lazy) |
| `ziwei-engine` | 紫微/iztro 引擎 | 152 KB (gzip 46 KB) | ResultPage (lazy) |
| `chart-combined` | 综合排盘组合逻辑 | 0.44 KB | ResultPage (lazy) |
| `ziwei-prompts` | 紫微提示词构建器 | 0.38 KB | ResultPage (lazy) |
| `celestine-vendor` | 天文计算库 celestine | 196 KB (gzip 62 KB) | ResultPage |
| `core-shared` | 核心共享工具 | 9 KB (gzip 4 KB) | 按需 |

4. **移除无效规则**：`src/types/analysis.ts`（全部是 `import type`，构建时擦除）和 `src/utils/dateUtils.ts`（无人导入）。

## 4. 优化前后对比

### 初始 modulepreload 对比

| | 优化前 | 优化后 |
|---|--------|--------|
| chunk 数量 | 4 个 | 3 个 |
| preload 列表 | react-vendor, tyme-vendor, **chart-engine (908KB)**, router-vendor | **vite-helpers (1.8KB)**, react-vendor, router-vendor |
| 初始 JS 总量（gzip） | **~492 KB** | **~74 KB** |
| 初始 JS 总量（未压缩） | **~1,350 KB** | **~232 KB** |

**初始 JS 传输量降低 ~85%（gzip）。**

### 最大 chunk 对比

| | 优化前 | 优化后 |
|---|--------|--------|
| 最大 chunk | `chart-engine` 908.32 kB (gzip 255.01 kB) | `prompt-engine` 639.08 kB (gzip 206.84 kB) |
| 第二大 | `prompt-engine` 639.11 kB | `iztro-vendor` 474.36 kB |

chart-engine chunk **已消除**（被拆分为 calendar-engine + bazi-engine + ziwei-engine + chart-combined）。

### 完整 chunk 体积对比

| chunk | 优化前 | 优化后 | 变化 |
|-------|--------|--------|------|
| chart-engine | 908.32 kB / gzip 255.01 kB | — | **消除** |
| prompt-engine | 639.11 kB / gzip 206.87 kB | 639.08 kB / gzip 206.84 kB | 不变 |
| iztro-vendor | 474.36 kB / gzip 150.26 kB | 474.36 kB / gzip 150.26 kB | 不变 |
| tyme-vendor | 212.12 kB / gzip 72.21 kB | 212.13 kB / gzip 72.21 kB | 不变 |
| react-vendor | 192.50 kB / gzip 60.35 kB | 192.50 kB / gzip 60.35 kB | 不变 |
| bazi-engine | — | 468.76 kB / gzip 118.63 kB | 新增（lazy） |
| ziwei-engine | — | 151.72 kB / gzip 45.92 kB | 新增（lazy） |
| calendar-engine | — | 80.77 kB / gzip 23.40 kB | 新增（InputPage） |
| celestine-vendor | — | 196.43 kB / gzip 61.97 kB | 新增 |
| vite-helpers | — | 1.82 kB / gzip 0.93 kB | 新增（entry） |
| core-shared | — | 9.02 kB / gzip 3.70 kB | 新增 |
| chart-combined | — | 0.44 kB / gzip 0.28 kB | 新增 |
| ziwei-prompts | — | 0.38 kB / gzip 0.24 kB | 新增 |

### 业务决策说明

- **prompt-engine (639KB)** 未拆分：该 chunk 由 `@/lib/prompt-engine.ts` 构成，已在 ResultPage 中通过 `import('@/lib/prompt-engine')` 动态导入，不在首屏加载路径上。其体积主要来自大段提示词模板文本，属于业务必须保留。
- **bazi-engine (469KB)** 和 **iztro-vendor (474KB)** 未进一步拆分：它们仅被 ResultPage（路由级 lazy）加载，不影响首屏性能。

## 5. PWA 线上只读检查

| 检查项 | 状态 | 详情 |
|--------|------|------|
| `sw.js` HTTP 状态 | **200 OK** | Content-Type: application/javascript, Cache-Control: max-age=0, must-revalidate |
| `manifest.webmanifest` | **200 OK** | 字段完整：name, short_name, start_url, scope, display=standalone, icons[192,512] |
| `pwa-192x192.png` | **200 OK** | Content-Type: image/png |
| `pwa-512x512.png` | **200 OK** | Content-Type: image/png |
| PWA 可安装性 | **通过** | manifest 含 standalone display + 192/512 双图标 + sw.js 已注册 |

## 6. 待主控部署后复测

- [ ] Lighthouse 桌面正式跑分（需 Chrome 环境）
- [ ] 初始 JS 传输量实际测量（Network 面板）
- [ ] LCP / FCP / TTI 实测
- [ ] Service Worker 更新（cache version bump）
- [ ] PWA 安装提示触发验证
