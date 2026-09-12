# WORKLOG · T2 三级转译审计与方案

> 状态标记：✅完成 / 🔄进行中 / ⚠️阻塞 / ❌失败（须写原因与替代路径）
> 接手顺序：本文件 → OUTPUT 清单 → 产物目录

## 2026-09-13 · ZCode（任务前检索 + S1 + S2 搜证）

- 做了什么：
  1. 任务前检索：_PROJECTS（guoxue-overseas）/ 11_国学出海主地图 / task_status / 09-13 加固计划书 / 8877 memory query（词库 1180 条来源确认）；⚠️ README 引用的 `AI地图\00_总览与排障速查.md` 与 `memory\guoxue-overseas\context.md` 不存在（文件名过时），已降级直读替代。
  2. S1 定义还原：读 468 红线原文 2.1 节全部 24 项完整定义（`国学网站建设\准确性核验清单审计标准 V5.0-网站各板块.md` L1171-1411）+ 白皮书《网站搭建方案代码部分0830.md》2.1/2.3 契约（archetype_key 格式、证据型输出四件套、词库 MVP 800 条）。
  3. S2 全仓实证（关键证据）：
     - prompt 生成端 17 文件：「白话/文言/转译/禁止/医疗/法律/宿命」**全零命中**；「古籍」仅 2 处（divination.ts:351、divination-enhanced.ts:593，占卜 classicalRules 书名级）
     - 词库 `src/data/lexicon.ts`：LexiconEntry 仅 {term,pinyin,category,definition,source}，**source 全部为占位串『命律词库（扩充版种子数据）』**，无 L1 出处/分层/archetype_key
     - `src/lib/ai/proxy.ts:140`：**temperature=0.7**、max_tokens=4096、system prompt 仅一句话——纯透传代理，无禁用词表/脱敏/越界检测
     - `dict_version/model_version/engine_version` 全仓 **0 命中**（2.1-09 无三元组）
     - 红线矩阵声称的测试证据 prompt-evidence.test.ts（测证据展示格式化）/ prompt-page-rules.test.ts（测 UI 布局）**与转译无关**，属证据映射错误；1.4-05/1.4-12 的 pass 证据同源，同样不成立
     - guidance.ts：各体系流派指引含书名级 sources（最接近 L1 的现存物，但无卷·页·原文引用）
     - synthesis/index.ts 存在但无 conflict/裁决树（2.1-14 无实现）
     - 免责声明全站 7 语言有（App.tsx + locales）；AI 错误消息用户友好化（proxy.ts）但无解读安全回复预设
- 产物路径：output\01、output\02（见下）
- 关键结论：三级转译（L1→L3→L5）**无确定性实现实体**，词库是术语词典非分支转译库，AI 链路是「盘面 prompt + temperature 0.7 透传」，468 矩阵 2.1 节证据映射张冠李戴（24 partial 实质多为 fail/na）。
- 下一步：S3 部署阶段判定 → S4 抽测 50 条 → S5 方案 → S6 报告
- 阻塞项：无

## 2026-09-13 · ZCode（S1-S6 全部完成，线程交付）

- 做了什么：S1-S6 全部完成并入库。
  - output\01_三级转译定义与计划口径.md（24 项原计划口径提炼）
  - output\02_24项红线实证矩阵.md（逐项三态判定：❌13 / 🟡6 / 建议改判 na 5；现行矩阵证据映射勘误——prompt-evidence/prompt-page-rules 测试与转译无关，1.4-05/1.4-12 pass 建议降级）
  - output\03_部署阶段判定.md（三问作答：L0-L5 本体 0%；09-11 线程 B「词库 800 转译库→1180 词典」口径静默漂移已记录）
  - output\04_转译质量抽测.md（53 条真实 prompt 静态审计：盘面证据 53/53、古籍锚定达标 0/53、合规约束 2/53；失败模式 A-E 归类；附带发现 ziwei prompt 空值 undefined 泄漏缺陷）
  - output\05_执行方案.md（推荐决策 A 混合管线：确定性原型词库 + LLM 受限生成；五里程碑 ≈40 人日；M1 运行时约束 6 人日可立即启动；T3 接口 = archetype_key + L3 白话源文本）
  - output\审计报告_三级转译现状与方案.md（汇总）+ output\_samples_53.json（黄金样例初始资产，可复现脚本路径已注明）
- 产物路径：上述 7 件 + WORKLOG
- git：worktree `.temposoul-wt\thread-t2-audit`，分支 `thread/t2-translation-audit`，commit 8601a0b（任务卡+WORKLOG）+ fb9b899（output 7 件，-f 绕过 .gitignore `output/` 规则误伤），已推 solaroran-rgb
- 关键结论：转译不是做得差而是没被做；内容合规是当前最大风险敞口；A/B 路线决策（转译体系要不要存在）待主控+用户裁决
- 下一步：主控裁决决策 A/B → 若 A：M1 运行时约束可立即开工（不依赖 T1）；输出端 LLM 实测（需 AI key）可补跑
- 阻塞项：无（输出端动态抽测依赖 AI_API_KEY，已列为可选补跑项）

## 2026-09-13 · ZCode（追加检索：E 盘 L1/L2 部署存在性排查，应老板问）

- 做了什么：定向排查 5 落点——旗舰引擎 temposoul-core（0.2.0 线上）、前身副本 mingyu-core（E:\Agent OS\projects）、PoC 三合一、国学资产线 `__资产基础设施__`、主仓 packages/core 复核。
- 关键发现：**国学资产线有 L1/L2 性质的真实数据部署**——`_meta\contracts\lexicon-schema.ts`（archetypeKey/evidenceQuote 古籍引文/semanticLibrary 语义库/professionalDef L3/translations 多语言白话；manifest 原则 P5_l1l4_static「L1-L4 静态化、运行期只查表零 LLM」）；19 个词库 JSON 共 318 条，其中八字 3 文件 68 条 100% 填 evidenceQuote（真实原文如「《渊海子平》：比肩者，兄弟也，同我者也。」）+ classicalTerm + semanticLibrary；318/318 填 professionalDef + translations + version。**但消费方为零**——无任何程序读取，数据已建程序未接。
- 对主审计的修订：①2.1-01 判定 ❌ 不变但证据细化（主仓另有 10 处 @古籍依据 卷次级注释；资产线 68 条为数据级雏形）；②外围替身由 2 项扩为 3 项；③**M2 词库升级不必从零**——schema 与 PrototypeEntry 同构，68 条可迁移，工作量重心转为对齐 schema + 补 15 体系 L1 + 建消费程序。
- 产物路径：output\06_补充检索_E盘L1L2部署排查.md
- git：随 branch thread/t2-translation-audit 追加提交
- 阻塞项：无


