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
