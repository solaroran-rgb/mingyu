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

## 2026-09-13 · ZCode（M1 运行时约束落地——老板批示「按最完美方案执行下一步」后启动）

- 做了什么：执行 05 方案 M1（运行时约束先行，468 红线 2.1-03/05/06/15/16/18/19、2.2-01 服务端落地第一步）：
  1. `src/data/lexicon-translator-seed.ts`（新增）：国学资产线 lexicon 统一 Schema 318 条合并种子（dict_version 1.0.0，license 全 public_domain），evidenceQuote/语义库/L3 释义/多语言白话全量保留
  2. `src/lib/ai/compliance.ts`（新增）：确定性合规逻辑集中——解读铁律（COMPLIANCE_RULES）、敏感领域注入（健康/法律/财务/生死 4 域检测，不改写用户问题零误杀）、术语口径查表（buildTermHints，≥2 字术语子串匹配，注入 professionalDef+白话，上限 12 条）、输出流内熔断（OutputFuse，5 组高危正则：生死/医疗/金融指令/法律指令/宿命论）、FUSED_NOTICE 安全收尾
  3. `src/lib/ai/proxy.ts`（改造）：temperature 0.7→**0**（确定性锁）；合规约束全部并入 system message（**user 内容零改动**，不破坏调用方契约与既有测试断言）；SSE 流首 meta 事件（compliance/dict_version/model_version 三元组）；转发循环接入熔断（截断+安全收尾+meta.fused 标记+上游 reader.cancel）
  4. `tests/ai-proxy-compliance.test.ts`（新增 7 用例）：temperature=0/铁律/user 原样/敏感注入正反例/术语注入/meta 事件/熔断行为/正常转发回归——**7/7 全绿**
- 回归：core 1539/1539 ✅（与基线一致）；主仓 tests 1777/1777 ✅（基线 1770+新增 7）
- 产物路径：上述 4 个代码文件（分支 thread/t2-translation-audit @ 4b9e4d2，已推 solaroran-rgb）；worktree .temposoul-wt\thread-t2-audit
- ⚠️ 部署边界：**代码仅就绪未部署未合并**——部署/合并/bump sw 权在主控；改动面仅 src/lib/ai/* + src/data + 新测试，无线上环境变量需求
- 已知边界（诚实声明）：①SSE 已转发内容无法撤回，熔断为「截断+安全收尾」形态；②报告级三元组完整落盘待报告存储功能存在时补齐（当前以 meta 事件形式送达）；③术语单字（干支）不注入避免误命中
- 下一步（等待主控）：①合并/部署 M1（本分支可 review）；②M2 词库升级（68 条 L1/L2 迁移校验 + 15 体系 L1 补齐）；③M3 引擎 archetype_key 对接（依赖 T1）
- 阻塞项：无

## 2026-09-13 · ZCode（老板批示三步连做：①合并/部署 M1 → ②M2 词库升级 → ③M3 前置）

- 做了什么：
  **① 合并/部署 M1 ✅ 完整完成**
  - 拓扑确认：远程 main @ 0ac5808（09-12 五线程合并态）为 t2 分支祖先，fast-forward 干净；CF Pages 为 direct upload 模式（Git Provider=No）；最近生产部署 1 天前无覆盖风险
  - sw v5→v6 bump（public/sw.js 两行，dc86ea1）；pnpm build 15.28s 通过；worktree 合规 7/7
  - push main（0ac5808→dc86ea1）+ `wrangler pages deploy dist --branch main` → **Deployment 4de2841d**
  - 线上验证：sw.js=v6 ✓ / 首页 200 ✓ / /api/v1/health ok ✓ / /api/v1/ai/analyze 403 AI_SERVER_NOT_ENABLED（内置 AI 默认关=隐私铁律，与部署前一致；M1 约束对 custom AI 用户已生效）
  **② M2 词库升级 ✅ 第一批完成（约 40%）**
  - `scripts/validate-lexicon-translator.py` 门禁：archetypeKey 唯一性/格式/必填字段/licenseTier/semver/L1 一致性——318 条全过
  - L1 补齐 36 条（六爻 23 + 梅花 13）：《说卦传》八卦性情逐字原文、《卜筮正宗》六亲/六神/世应、《梅花易数》先天卦数与体用总诀——**全部标 draft（AI 依通行本起草，待人工核验），不标 verified，不伪造出处**
  - 存量 68 条标 draft；214 条 pending_manual；dict_version 1.0.0→1.1.0；interface 补 l1_status 字段
  - 数据修正：`bazi.dizhi.si` displayZh/classicalTerm `si_snake`→`巳`；`天罗地网/xuetang_yima` key 错位记入核验清单（待对照资产线源数据）
  **③ M3 前置 ✅ 桥接层落地（全量接入依赖 T1）**
  - `src/lib/ai/archetype-bridge.ts`：extractTenGodKeys（日主×四柱天干生克自算，**provisional 待 T1 核验后回填**）/extractShenShaKeys/extractGanZhiKeys/lookupArchetype/buildArchetypeSection（L1 引文+L3 白话口径注入段，确定性查表）/toHyphenKey（点分↔连字符规范互转）
  - `tests/archetype-bridge.test.ts` 7 用例全绿
- 验证：M2/M3 各 7 用例 + 合规 7/7 + build 通过；生产部署未再触发（M2 数据变更攒到完成批，避免频繁 sw 更新）
- git：dc86ea1（sw bump+合并部署）/ a01cf58（M2 第一批）/ aaa1161（M3 前置）已推 solaroran-rgb，远程 main @ dc86ea1
- 下一步：M2 剩余 214 条 L1（需古籍人工核验/录入，AI 起草批次可继续但须控制伪造风险）；M3 全量接入（buildBaziPrompt 集成 buildArchetypeSection）待 T1 十神/格局审计结论；M4 熔断矩阵与覆盖率看板
- 阻塞项：M2 verified 状态依赖人工核验资源（命理顾问）；M3 全量依赖 T1 结论

## 2026-09-13 · ZCode（全自动追问落地：本地模型实证 + M2 全自动批次完成）

- 做了什么：
  1. **AI key 问答**：本机无付费 key；发现本地 Qwen3.8-27B-UD-VLM @ 8080（OpenAI 兼容）可零成本全自动
  2. **输出端动态抽测（07 报告）**：A 组（M1 约束）0/6 禁词 vs B 组（旧管线）同题「离婚」输出倾向性断言——M1 实证有效；附带发现推理模型 reasoning 吃 max_tokens 与禁词正则语义盲区（M4 语义熔断必要性佐证）
  3. **M2 全自动批次**：214 条 semanticLibrary 由本地模型生成（318/318 全覆盖，平均 42 字，禁词 0）——三轮迭代排障：①reasoning 吃 token 致 content 空→enable_thinking=false；②服务过载 80% 失败→限速 0.5s+3 次重试→193/193 全成功；③体系码直译错字 成骨→称骨
- 工程沉淀（scripts/m2-gen-semantic.py）：enable_thinking 参数 + 限速重试 + JSONL 断点续传 + 禁词门禁，可复用于未来数据生产
- git：d5048d2（07 报告）/ e5d9cd5（M2 全自动批次，dict_version 1.2.0）已推
- 部署决策：M2 数据暂不部署（semanticLibrary 尚无运行时消费方，buildTermHints 用 professionalDef；部署攒到 M3 全量接入时一次生效）
- 下一步：M2 剩余 214 条 L1 古籍引文（AI 起草 draft 批次可全自动，verified 需人核）；M3 全量接入（待 T1）；M4 语义熔断+覆盖率看板
- 阻塞项：无





