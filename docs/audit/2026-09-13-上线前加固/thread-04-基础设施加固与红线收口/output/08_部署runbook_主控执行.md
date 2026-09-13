# T4 部署 Runbook（主控执行手册 · 队 4 备料）

> 备料：ZCode（队 4）@ 2026-09-13 ｜ 分支 `thread/t4-infra`（4 commits，见下）｜ **本手册所有命令仅主控执行**
> 前置事实：合并预检干净（`git merge-tree` T4↔基线零冲突；T2 分支亦零冲突）；T2 分支已占 sw v6 → 本部署 bump **v7**；T4 分支 sw 保持 v5 未动（避免与 T2 的 v6 改动冲突）。

## 0. 分支与 commit 清单

```
thread/t4-infra（基于 codex/website-basic-settings @ 8a1f7ae）：
  98cad2a  fix(core,api): 时区冲突/回拨歧义/跳时缺口 500→400 + isMingyuCoreError 跨副本判别 + 回归测试
  34da981  perf(api): 元学八体系端点内动态加载（第一片）
  165a81f  perf(api): 紫微+占卜十一术端点内动态加载（第二片）
  cf55d43  docs(t4): T4 产物落盘 + 468 矩阵表头同步（fail 0）
```

## 1. 合并

```powershell
cd "E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统"
# 注意：工作区有他人未提交改动（package.json/pnpm-lock.yaml 的 three.js sky 线、src/App.tsx 等）。
# 合并前勿 checkout 切换；建议在独立 worktree 执行（.temposoul-wt 惯例）或先 stash。
git checkout codex/website-basic-settings
git merge --no-ff thread/t4-infra -m "Merge branch 'thread/t4-infra' (T4 上线前加固: 1102 懒加载+500→400+红线收口)"
$env:CI="true"; pnpm install   # 无 TTY 坑
pnpm test:core; pnpm test:api; pnpm test:prompt   # 应为 1539 / 108 / 229 全绿
pnpm build                     # core build + vite build（产物 dist/）
```

## 2. bump sw v5→v7（v6 已被 T2 分支占用，跳过防撞车）

`public/sw.js` 仅两行：

```js
const STATIC_CACHE  = 'temposoul-static-v5';   // → 'temposoul-static-v7'
const RUNTIME_CACHE = 'temposoul-runtime-v5';  // → 'temposoul-runtime-v7'
```

改后重新 `pnpm build`（sw.js 在 public/ 随构建拷贝进 dist/）。若合并结果中该文件已是 v6（T2 已并入），同样改两处 v6→v7。
commit：`chore(sw): bump cache v7（v6 预留给 thread/t2-translation-audit）`

## 3. 部署

```powershell
npx wrangler pages deploy dist --project-name temposoul --branch main
```

## 4. 线上验收（判据：0×5xx）

```powershell
cd "docs\audit\2026-09-13-上线前加固\thread-04-基础设施加固与红线收口\output"
python repro_503.py --rounds 3          # 5 端点×10 样例×2 次×3 轮 = 300 请求
# 期望输出：VERDICT PASS（5xx=0）；原始数据自动追加进 _raw_503_repro.json
```

另抽查 500→400 线上复测（应返回 400 + 结构化错误码，不再 500）：

```powershell
curl.exe -s -X POST "https://www.temposoul.com/api/v1/bazi/calculate" -H "Content-Type: application/json" -H "User-Agent: Mozilla/5.0" -d "{\"gender\":\"male\",\"year\":1991,\"month\":7,\"day\":4,\"dateType\":\"solar\",\"birthHour\":9,\"birthMinute\":15,\"birthPlace\":\"New York\",\"birthLongitude\":-74.006,\"timezone\":8,\"timeZoneId\":\"America/New_York\",\"useTrueSolarTime\":true}" | findstr "TIMEZONE_OFFSET_CONFLICT"
```

**FAIL 处置**：仍有零星 1102 → 记录 `repro_503.py` 输出中 1102 的端点分布 → 评估启动第三片懒加载（见 `09_第三片评估.md`）→ 或升 CF 套餐（见 §5）。

## 5. CF 套餐确认（需用户在控制台操作）

1. Cloudflare Dashboard → Workers & Pages → temposoul → 右侧「Plan」。
2. 记录档位：Free（约 10ms CPU/请求）或 Paid（30s CPU/请求）。
3. 判读：部署后 3×300 请求若仍有 <1% 零星 1102 且集中在冷启动（首次访问），即「免费档 + 冷启动残余」特征 → 建议升付费档（$5/月起）后复测；若升档后归零即闭环。
4. 结论回填本文件 §5 与 WORKLOG。

## 6. 回滚预案

- 代码级（不回滚部署）：`git revert 165a81f 34da981`（逆序执行）→ 重新 build/deploy；或直接 `git reset --hard 8a1f7ae` 重建分支。
- 完整方案与影响面：`03_修复记录.md`（三处 commit 各自独立可 revert，业务计算零改动）。
- 部署级：CF Pages → temposoul → Deployments → 回滚到上一成功版本（一键）。

## 7. 收尾（部署成功后）

1. 本目录 WORKLOG 追加「部署+验收」条目（贴 VERDICT 行）。
2. 部署日志 `AI地图\11_国学出海\部署日志\2026-09-13_T4加固_*.md` 补「已部署 + 验收数据」。
3. `POST http://127.0.0.1:8877/memory/write`（`[来源: 主控 @ …]`）+ `/corpus/scan`。
