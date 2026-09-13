# WORKLOG · T1 排盘规则审计与比对

> 状态标记：✅完成 / 🔄进行中 / ⚠️阻塞 / ❌失败（须写原因与替代路径）
> 接手顺序：本文件 → OUTPUT 清单 → 产物目录（output\）

## 2026-09-13 07:05 ｜ 总体收口（四线程）✅

- 做了什么：重读 README + 逐条核对 T2/T3/T4 WORKLOG 实态；**T1 席位签署 BP1 键化会签**（thread-03 output\07 材料加 §四意见：5 项范围全签+单一来源/一致性断言/语境边界/口径提示 4 条件）；写《总体收口报告.md》落加固根目录（四线程终态表/用户三步验收对照/交接矩阵/发布状态/遗留按 owner/风险登记）；README 状态表刷新（四线程 ✅ 代码侧+头部收口标记）；主地图/更新日志/memory/corpus 同步。
- 关键结论：四线程代码侧全部收口，跨线程依赖全打通；M1 已实际部署上线（4de2841d/sw v6）；剩余全部为外部输入型事项（主控部署验收/豆包在线比对/母语复核/L1 终审/专家裁决）。
- 产物路径：`..\总体收口报告.md`（加固根）；README.md（状态表）；thread-03\output\07（T1 签署）。
- 下一步：主控按 T4 Runbook 08 执行部署验收；README/收口报告两处共享文档改动待主控 commit（当前共享 HEAD 归 T3，勿混入其功能提交）。
- 阻塞项：无。

## 2026-09-13 06:35 ｜ S3-S7 收口（清单/样例/比对/卫生修复/回归）✅

- 做了什么（按队伍执行计划书 v2）：
  - S3 `output\比对站清单.md`：21 体系×5 源（白皮书基准+竞品缓存索引+开源参照+典籍；口径核对清单）；**在线可达性核验归豆包**。
  - S4 `output\golden-cases\` 50 组（zodiac/ssgw/taiyi/huangji/wuyun ×10）+ `样例集schema.md`（shared schema 缺失已自建，待 T4 收敛）。
  - S5 `tools\engine_runner.mjs` + `tools\compare_vs_sites.py`：**引擎侧 186 字段级 diff 全过 0 mismatch**（zodiac 30/30、wuyun 50/50、huangji 50/50、taiyi 30/30、ssgw 32 项含越界抛错）；`比对结果\`+报告×5；网站侧只记人工比对。
  - S6 H2+H3 @ **cecba86**（隔离 worktree 提交）：删 ssgw signs-01/02/03 死数据（零引用验证）+ 六爻恒真断言改实断言；定向 140/140。H1/H4 移交（指引完备）；B 类 `B类口径声明.md`（附 DST 史源闭环）；D 类 `D类专家裁决请求.md`；总表升 v3。
  - S7 `审计总结.md`：api **108/108**、prompt **229/229** 全绿；core **1538/1540**——2 失败 `useI18n must be used within I18nProvider` 为 **T3 i18n 基线继承**（diff 证明 T1 零八字层改动），移交 T3 修 bazi-chart-board 测试。
- 产物路径：见 OUTPUT 清单 + `审计总结.md`。
- 关键结论/数据：**独立算式与引擎 186/186 一致**（干支纪年/素问岁运司天在泉/元会运世含会界/太乙 72 局 Kintaiyi 口径证实）——「排盘 100% 准确」引擎侧实证完成；修复 commit 链 ef0cb90→a8485aa→cecba86。
- 执行环境：主工作区 HEAD 被 T3 占用（thread/t3-i18n-accuracy），全部 git 操作走隔离 worktree `.temposoul-wt\t1-audit-verify`，主区零干扰；主区 stash@{0} 为 T1 制作的 T2/T3 脏文件冗余备份（内容已实时在盘，可复核后 drop）。
- 下一步：①豆包按 S3 清单做在线核验+人工比对（口径不同标 B 类不判错）；②T3 修 useI18nProvider 两用例；③H1/H4→Codex；④B8/B10 修复选项待主控拍板；⑤D1-D5 待专家裁决；⑥主控合并 thread/t1-paipan-audit（与当前集成分支 ssgw/metadata 无重叠，预期零冲突）。
- 阻塞项：无新阻塞（更新日志 UTF-16 已用 Python 追加打通）。

## 2026-09-13 05:55 ｜ S2 批次2 全量规则审计 + 两修复落地 + 边界范围决策 ✅

- 做了什么（用户授权三件事全部执行）：
  1. **两修复**（分支 thread/t1-paipan-audit @ ef0cb90）：ssgw 证据链出处观音灵签→三山国王签谱（ssgwEvidence.ts:36,92）+ metadata.ts 补登 jinkoujue 两端点；加回归断言两处（ssgw 出处不得混入观音/关帝/吕祖；manifest 含 jinkoujue）。验证：ssgw-evidence-trail+public-api+public-api-docs 三文件 **112/112 全绿**（含 core 重建）。
  2. **边界范围决策**：按「文档声明支持范围」拍板（1900-2100 排盘域/1900-2200 天文/太乙五运六气 year 1-9999/皇极 epochYear 自由/无公元前），产物 `output\边界支持范围声明.md`，含 S3/S4/产品文案传播动作。
  3. **批次2 四路取证**（bazi+ziwei / 六壬卦类六体系 / tarot+lenormand+almanac+astrolabe / 风水三系+vedic）——**S2 至此 22/22 体系全覆盖**，总表升 v2。
- 产物路径：`output\规则审计\bazi-ziwei.md`、`六壬卦类六体系.md`、`tarot-lenormand-almanac-astrolabe.md`、`风水三系-vedic.md`；`规则审计总表.md` v2（S6 台账 A/B/D/E/H 五类）；WORKLOG/映射表/zodiac-ssgw 修复状态已回写。
- 关键结论/数据：
  - 批次2 **新增 A 类 0 条**——22 体系无未解计算 bug；A1（ssgw 出处）是全场唯一实锤且已修。
  - B 类新增：B6 占卜域第二套时间口径（本地民用时+东八区+零点换日+晚子归当日，timeManager.ts:192-233，与排盘域真太阳时口径并存须明示）；B8 玄空运界立春未生效（@soul-atelier 引擎自注，跨运年 1-2 月误差）；B7 梅花农历正一换年 vs 八字立春双口径、六爻时间起卦实为种子三钱。
  - 能力边界实锤（对外禁宣称）：玄空无替卦/城门诀、八宅无大运年、住宅风水无形峦、vedic yogas/doshas 恒空、紫微 84 退役格不执行、合盘无配对评分、almanac 无评分/首选时辰。
  - 任务卡口径差：**塔罗实为 10 牌阵（任务卡写 15）**。
  - 工程卫生 H1-H4：贵人表双份复制、ssgw 死数据双源、六爻恒真断言、lunar.ts 机器时区依赖——移交 Codex 批。
- 下一步：S3 比对站清单（豆包在线，附口径核对清单）；S4 黄金样例集（优先 zodiac/ssgw/taiyi/huangji/wuyun，边界限 1900-2100）；S5 比对脚本（本地引擎）；S6 台账逐项闭环；S7 全量回归。修复分支待主控合并。
- 阻塞项：`_更新日志.md` UTF-16LE 仍未追加（同前）。

## 2026-09-13 05:05 ｜ S2 批次1 规则审计（基础层+薄测五体系）✅

- 做了什么：三路 Explore 取证（基础层 / zodiac+ssgw / taiyi+huangji+wuyun-liuqi）+ ZCode 抽查复核两条承重论断（均实证）；产出审计总表 + 分表 3 张；S6 差异分类预判（A1 / B1-B5 / D1-D3）。
- 产物路径：`output\规则审计总表.md`、`output\规则审计\基础层.md`、`output\规则审计\zodiac-ssgw.md`、`output\规则审计\taiyi-huangji-wuyunliuqi.md`；部署日志已写 AI 地图。
- 关键结论/数据：
  - **A 类 bug 1 条（实锤）**：ssgw 证据链出处写「观音灵签（第一百签）体系」（ssgwEvidence.ts:36,92），与三山国王 92 签不符——抽查原文证实，移交修复清单。
  - B 类口径 5 条：zodiac 2/10 探针（zodiac\index.ts:246-249 抽查证实）、EoT 精度声明矛盾（±1s vs 不宣称观测级，且仅整日 0h UT 无日内插值）、五运六气大寒起运单口径、太乙积年 10153917 流派差异、dayDivide 默认 forward。
  - D 类争议 3 条：刑太岁两支/三支口径、太乙阴遁死代码（yinYang 恒阳遁）、同天符 6 年名单靠测试硬编码。
  - 共性问题：引擎钳制 1900-2100 → 任务卡「公元前/5000 年」不可达，需产品拍板；文献型体系无 top5 网站可比 → S3 改「开源参照+典籍推演」双源。
  - 基础层边界实证良好：子时双口径/立春/闰月/DST 1986-91/时区±14/萨摩亚跳日均有专测，真太阳时有 Meeus ±1s 红线测试。
- 下一步：①批次2（bazi+ziwei → 占卜十法 → 风水三系+vedic）待主控确认排期；②A1+metadata F1 两处一行级修复移交 Codex，修后回归；③S3 比对站清单（豆包）注意：皇极经世比对须锁同一 epochYear，文献型体系用开源参照。
- 阻塞项：`_更新日志.md` UTF-16LE 编码仍未追加（同 S1，待主控转码）。

## 2026-09-13 04:40 ｜ S1 端点与实现盘点 ✅

- 做了什么：
  - 任务前检索 SOP：_PROJECTS.md、memory/guoxue-overseas 最近 3 日期文件（09-13 计划书 / 09-12 收口 / h3-iztro）、task_status.md、主地图头部；context.md 与 00_总览与排障速查.md 不存在（见 F7）。
  - 盘点 `metadata.ts` 61 条登记端点 + `handler.ts` 实际 63 条分发；`capabilities/index.ts` 27 个 capability id；核对「21 体系」口径（27−calendar×5−bazi-ziwei-synthesis=21）。
  - 盘点仓库根 `tests/` 148 个测试文件并按体系归集；确认 core 套件机制（run-core-tests.mjs 按 import 选择）。
  - 核对 vedic（无公开端点）与 jinkoujue（已实现但 metadata 漏登）两个疑点。
- 产物路径：`output\映射表.md`（主交付）；`output\tools\count_tests.bat` + `output\_tests_dump.txt`（复现工具与原始清单）。
- 关键结论/数据：63 端点 ↔ 21+1 体系 ↔ 148 测试文件映射完成；发现 F1-F7 共 7 条（详见映射表第三节），其中 F1 jinkoujue 漏登、F2 vedic 无公开端点为新发现；zodiac/ssgw/taiyi/huangji/wuyun-liuqi 测试最薄。
- 下一步：
  - S2 规则审计（Codex 代码对勘）：按薄测优先顺序产出《规则审计表_*》；基础层 calendar/foundation 先行。
  - S3 比对站清单（豆包在线核验）：注意 vedic 走本地口径、jinkoujue 线上可调。
  - S4 黄金样例集：可与 S2 并行起步。
- 阻塞项：
  - ⚠️ `E:\KnowledgeOS\AI地图\_更新日志.md` 为 UTF-16LE 编码（PowerShell 重定向产物），Read/Edit 工具不可读，本轮未追加条目（避免盲写破坏）；需主控统一转 UTF-8 或由可处理该编码的端补一条「2026-09-13 T1-S1 盘点」。
  - F4 ziwei 503 / Error 1102 归 T4（S5 比对先走本地引擎）。

## OUTPUT 清单

| 产物 | 路径 | 状态 |
|---|---|---|
| 体系-代码-测试映射表 | `output\映射表.md` | ✅ 2026-09-13 |
| 测试盘点工具 | `output\tools\count_tests.bat` | ✅ |
| 测试文件原始清单（148） | `output\_tests_dump.txt` | ✅ |
| 规则审计总表 | `output\规则审计总表.md` | ✅ v2（批次1+2，22/22 全覆盖） |
| 规则审计分表 ×7 | `output\规则审计\*.md` | ✅ 批次1×3 + 批次2×4 |
| 边界支持范围声明 | `output\边界支持范围声明.md` | ✅ 2026-09-13 |
| 修复 commit | thread/t1-paipan-audit @ ef0cb90 | ✅ 修复+回归 112/112 |
| 比对站清单 | `output\比对站清单.md` | 待产出（S3·豆包） |
| 黄金样例集 | `output\golden-cases\**\*.json` | 待产出（S4） |
| 比对脚本 | `output\compare_vs_sites.py` | 待产出（S5） |
| 比对测试报告 | `output\比对测试报告_*.md` | 待产出（S5-S6） |
| 审计总结 | `output\审计总结.md` | 待产出（S7） |
