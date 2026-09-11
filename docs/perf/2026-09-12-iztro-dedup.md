# 2026-09-12 iztro-vendor 跨 worker/主线程去重

> 线程 h3 · iztro 去重重构
> 分支: thread-h3-iztro
> 基线: codex/website-basic-settings @ 07fb977

---

## 1. 问题

第二轮 g6 发现 iztro-vendor（474KB / gzip 150KB）被打入两个独立 chunk：

| chunk 文件 | 消费者 | 大小 (raw) |
|---|---|---|
| `iztro-vendor-9x8J0NMZ.js` | 主线程 | 463.25 KB |
| `index-BTT9-c59.js` | 3 个 Web Worker（动态 import） | ~474 KB |

**根因**：Vite 为每个 `new Worker(new URL(...))` 创建独立 Rollup build。主线程 build 通过
`build/chunking.ts` 的 `manualChunks` 将 iztro 归入 `iztro-vendor` chunk；而 worker build
默认不应用主线程的 `manualChunks`，导致 iztro 被归入一个自动命名的 `index-[hash].js` chunk。
两者内容相同（同一 iztro@2.5.8 CommonJS 包），但因文件名带内容哈希而产生两个物理文件。

## 2. 方案

在 `vite.config.ts` 中：

1. **`worker.rollupOptions.output.manualChunks`**：新增 `workerManualChunks()`，对 worker build
   也将 `node_modules/iztro` 归入 `iztro-vendor` chunk（与主线程同名）。其余依赖（tyme4ts、
   celestine、自身计算代码）保持 `undefined`（内联到 worker 入口），避免为每个 worker 复制
   tyme-vendor/ziwei-engine 等差异 chunk。

2. **`chunkFileNames: sharedChunkFileNames`**：对 iztro-vendor 使用无哈希文件名
   `assets/iztro-vendor.js`。主线程 build 和 worker build 各自 emit 同名文件，后写覆盖先写，
   因内容相同（同一 CJS 整包）故无风险。其余 chunk 保留 `[name]-[hash].js` 长效缓存。

3. **`inlineDynamicImports: false`**：worker build 显式禁用动态导入内联，确保
   `await import('iztro')` 拆分为独立 chunk。

## 3. 对比

| 指标 | Before (07fb977) | After (thread-h3-iztro) |
|---|---|---|
| iztro chunk 文件数 | 2（`iztro-vendor-[hash].js` + `index-[hash].js`） | **1**（`iztro-vendor.js`） |
| iztro raw 总量 | ~937 KB（463 + 474） | **463 KB** |
| iztro gzip 总量 | ~300 KB（150 + 150） | **150 KB** |
| Worker 动态 import | `./index-[hash].js` | `./iztro-vendor.js`（共享） |
| 消除重复 | — | **~474 KB raw / ~150 KB gzip** |

## 4. 架构限制说明

- iztro@2.5.8 为纯 CommonJS（`lib/index.js`），无 ESM `module`/`exports` 子路径，Rollup
  无法跨子路径 tree-shake；474KB 为整包体积（含 lunar-typescript、dayjs、i18next 等传递依赖）。
- 主线程仍需 iztro 运行时（`runZiweiMainThread` 暖启动 + `getDefaultHoroscopeContext`），
  无法完全移除主线程 iztro 副本。本次方案通过无哈希文件名让 worker 和主线程共用同一个
  物理文件，浏览器只下载一次。
- tyme-vendor、celestine-vendor 等其他 vendor 未做同样处理，因为各 worker 对其使用量
  不同（tree-shake 后体积有 207.89 vs 207.91 KB 差异），无法安全共用无哈希文件名。
- 若未来 iztro 发布 ESM 版本，可进一步通过别名细化导入路径减小 tree-shake 损失。

## 5. 验收

- `pnpm build`：通过
- `pnpm test:api`：107/107 通过
- `pnpm test:prompt`：229/229 通过
