# 2026-09-11 Lighthouse 桌面最终实测报告

> 线程 g1 · Lighthouse 实测
> 分支: thread-g1-perf
> 线上目标: https://www.temposoul.com/
> 基线: cbeb64c（第一轮 C 优化已部署上线）

---

## 1. 测量方式

| 项目 | 详情 |
|------|------|
| 工具 | Lighthouse CLI (npx lighthouse@latest) |
| 浏览器 | **Microsoft Edge 152.0.0.0 (headless=new)** |
| 桌面预设 | `--preset=desktop` |
| 视口 | 1350×940, DPR=1 |
| 节流 | desktop 默认（rtt 40ms, throughput 10Mbps, CPU 4x slowdown） |
| 网络 UA | `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36` |
| 本机 benchmarkIndex | 1743 |
| 测量时间 | 2026-09-11 23:48 CST |

### Chrome 启动失败记录

- Chrome (`C:\Users\oran\AppData\Local\Google\Chrome\Application\chrome.exe`) 报 `EACCES`（spawn 权限拒绝），即使加 `--no-sandbox` 也无法启动。
- 改用 Edge 并通过 `CHROME_PATH` 环境变量指定路径后成功跑通。
- 原始 JSON 报告留存于 `docs/perf/lighthouse-report.json`。

---

## 2. 四项分数

| 类别 | 分数 | 评级 |
|------|------|------|
| **Performance** | **91** | 绿（90-100） |
| **Accessibility** | **98** | 绿（90-100） |
| **Best Practices** | **100** | 绿（90-100） |
| **SEO** | **100** | 绿（90-100） |

> Agentic Browsing 类别得分为 67（实验性类别，不在四项核心验收范围内）。

---

## 3. 关键指标

| 指标 | 数值 | 分数 | 说明 |
|------|------|------|------|
| **FCP** (First Contentful Paint) | **0.8 s** (773 ms) | 0.96 | 优秀 |
| **LCP** (Largest Contentful Paint) | **1.4 s** (1353 ms) | 0.85 | 良好 |
| **TBT** (Total Blocking Time) | **40 ms** (35 ms) | 1.00 | 优秀 |
| **CLS** (Cumulative Layout Shift) | **0.005** (0.0046) | 1.00 | 优秀 |
| **SI** (Speed Index) | **2.3 s** (2266 ms) | 0.51 | 偏低，主要拖累 Performance 总分 |
| TTI (Time to Interactive) | 1.4 s (1355 ms) | 0.99 | 优秀 |
| Max Potential FID | 90 ms (85 ms) | 0.98 | 优秀 |

### 主线程工作分解

| 类别 | 耗时 |
|------|------|
| Other | 239 ms |
| Style & Layout | 138 ms |
| Script Evaluation | 105 ms |
| Paint/Composite/Render | 44 ms |
| Script Parsing & Compilation | 4 ms |
| Parse HTML & CSS | 3 ms |
| **主线程总耗时** | **~533 ms** |

---

## 4. 与第一轮优化对比

| 指标 | 优化前（第一轮基线） | 优化后（本次实测） | 变化 |
|------|---------------------|-------------------|------|
| 初始 JS gzip 传输量 | ~492 KB | **~74 KB**（首屏 chunk 体积验证） | **↓ 85%** |
| Lighthouse Performance | 未跑成（Chrome 启动失败 + PSI 超时） | **91** | 首次实测达标 |
| FCP | 未测 | **0.8 s** | — |
| LCP | 未测 | **1.4 s** | — |
| TBT | 未测 | **40 ms** | — |
| CLS | 未测 | **0.005** | — |
| 最大首屏 chunk | chart-engine 908 KB (gzip 255 KB) 被 modulepreload | **chart-engine 已消除**，首屏仅 react-vendor + router-vendor + vite-helpers | 消除 |

**结论**：第一轮 C 的 chunk 拆分优化效果在 Lighthouse 实测中得到验证——Performance 91 分、LCP 1.4s、TBT 40ms 均达良好以上，初始 JS gzip 从 ~492KB 降至 ~74KB 的优化目标已兑现。

---

## 5. 剩余优化建议

### 5.1 性能类（按收益排序）

#### (1) Speed Index 偏低（2.3s，分数 0.51）
- **现象**：SI 是唯一拖累 Performance 总分的指标。FCP 0.8s 很快，但 SI 2.3s 说明首屏视觉完整呈现较慢。
- **可能原因**：首屏内容区域（输入页表单）在 FCP 后仍有大量内容逐步绘制，可能与 CSS 渲染或字体加载有关。
- **建议**：
  - 检查首屏 above-the-fold 内容是否有等待异步数据后才渲染的情况
  - 确保关键 CSS 内联或 preload，避免 CSS 阻塞首屏完整绘制
  - 考虑首屏骨架屏（skeleton）以改善 SI 感知

#### (2) 减少未使用 CSS（节省 24 KiB）
- **文件**：`/assets/index-D3qrKAp4.css`（总 27 KB，未使用 25 KB）
- **建议**：
  - 此 CSS 文件 92% 未被首屏使用，考虑按路由拆分 CSS
  - 或使用 PurgeCSS / UnCSS 构建时裁剪未使用样式
  - 检查是否有全局引入的 UI 组件库样式（如 antd/tailwind）未 tree-shake

#### (3) 减少未使用 JavaScript（节省 135 KiB）
- **文件明细**：
  | 文件 | 总大小 | 未使用 | 占比 |
  |------|--------|--------|------|
  | `prompt-engine-Ckuo8gTS.js` | 94 KB | 76 KB | 81% |
  | `bazi-engine-699Ov8ta.js` | 85 KB | 42 KB | 49% |
  | `react-vendor-BYpgkEqn.js` | 61 KB | 21 KB | 34% |
- **分析**：
  - `prompt-engine` 和 `bazi-engine` 已是 lazy chunk（ResultPage 才加载），未使用比例高是正常的——它们在首屏审计中被加载测量但未执行
  - `react-vendor` 34% 未使用，可考虑进一步拆分 React 运行时中未被首屏使用的部分
- **建议**：此项优先级较低，因为三个 chunk 都不在首屏关键路径上。如需进一步优化，可在 ResultPage 层面做 code splitting 或组件级 lazy。

### 5.2 无障碍类（Accessibility 98，扣 2 分）

#### (1) 缺少 main landmark（score=0）
- **现象**：文档缺少 `<main>` 标签或 `role="main"`。
- **修复**：在 App 根布局中添加 `<main>` 包裹主内容区域。

#### (2) label-content-name-mismatch（score=0）
- **现象**：隐私提示关闭按钮 `<button aria-label="不再显示">知道了</button>`，可见文本"知道了"与 aria-label"不再显示"不匹配。
- **修复**：将 aria-label 改为与可见文本一致（如 `aria-label="知道了"`），或直接移除 aria-label（按钮文本"知道了"已足够）。

### 5.3 其他诊断项

#### (1) BFCache 未通过（score=0）
- **现象**：页面阻止了 back/forward cache 恢复。
- **建议**：检查是否有未注册的 `unload` 事件监听器或 Service Worker 拦截。当前 `sw.js` 的 `Cache-Control: max-age=0, must-revalidate` 可能影响 BFCache 行为。

#### (2) llms.txt 不符合推荐（score=0）
- **现象**：`/llms.txt` 存在但内容不符合 LLM.txt 规范推荐格式。
- **建议**：按 https://llmstxt.org/ 规范更新 llms.txt 格式（此为实验性类别，优先级低）。

---

## 6. 验收总结

| 验收项 | 状态 | 详情 |
|--------|------|------|
| 真实实测分数 | ✅ | Performance 91 / Accessibility 98 / Best Practices 100 / SEO 100 |
| 测量方式记录 | ✅ | Edge 152 headless=new, desktop preset, Chrome EACCES 已记录 |
| FCP 数值 | ✅ | 0.8 s (773 ms) |
| LCP 数值 | ✅ | 1.4 s (1353 ms) |
| TBT 数值 | ✅ | 40 ms (35 ms) |
| CLS 数值 | ✅ | 0.005 (0.0046) |
| SI 数值 | ✅ | 2.3 s (2266 ms) |
| 优化建议可执行 | ✅ | 3 性能 + 2 无障碍 + 2 诊断项 |
| 第一轮对比 | ✅ | JS gzip 492→74KB (↓85%)，chunk 拆分效果验证 |

---

## 7. 复跑建议

1. **移动端跑分**：本次仅跑桌面预设，建议追加 `--preset=mobile` 测量移动端性能（当前为桌面站，移动端体验需单独评估）。
2. **多次取样**：Lighthouse 单次测量存在波动，建议跑 3 次取中位数作为最终分数。
3. **Chrome 修复**：本机 Chrome EACCES 问题建议排查（可能是 Chrome 已在运行锁定 user-data-dir，或杀毒软件拦截），修复后可用 Chrome 复测以排除 Edge 引擎差异。
4. **SI 专项优化**：Speed Index 0.51 是 Performance 未达 95+ 的主要原因，建议主控安排 SI 专项排查。
