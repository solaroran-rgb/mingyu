# WORKLOG · T3 多语言翻译实现与准确性

> 状态标记：✅完成 / 🔄进行中 / ⚠️阻塞 / ❌失败（须写原因与替代路径）
> 接手顺序：本文件 → 任务卡.md → OUTPUT 清单 → 产物目录
> 线程状态：🔄 进行中（S1 ✅ → S2 待启动）

## 2026-09-13 05:06 · S1 现有链路审计 ✅

- 做了什么：
  1. 按任务卡第八节加载项目记忆：8877 memory/query k=5 + corpus/query k=8 + `task_status.md` + 分册主地图；`00_总览与排障速查.md`、`guoxue-overseas/context.md` 实测不存在（与 T1 记录一致）。
  2. 探索代理全量扫描排盘→文案链路（93 次工具调用：packages/core 30 子模块、src/lib/public-api、src/lib/ai、src/i18n、functions/api、前端消费组件）。
  3. 关键证据人工复核：语言参数 grep 三目录 **0 命中**（实测）；Read 抽查 `proxy.ts` / `prompt/types.ts` / `lexicon.ts` / `zh-CN.ts` / handler 行数 / functions 目录。
  4. 产出审计报告（链路图 + 9 断点含 file:line 证据 + S2–S6 输入）；完成 AI 地图里程碑 6 步更新（00_总览缺失，以主地图+更新日志替代）。
- 产物路径：
  - `output\01_翻译链路审计.md`（主交付物）
  - `E:\KnowledgeOS\AI地图\11_国学出海\部署日志\2026-09-13_T3多语言_S1翻译链路审计.md`
  - 分册主地图头部状态行 + `AI地图\_更新日志.md` 修复并追加（见阻塞项 3）
  - 8877 memory：`memory/guoxue-overseas/2026-09-13-t3-s1-翻译链路审计.md`（写入即索引）+ `/corpus/scan`（×2，第二次为编码修复后重索引）
- 关键结论/数据：
  - **排盘内容多语言能力 = 0**；语言参数全链路 0 命中（grep 实测 packages/core/src/prompt + src/lib/public-api + src/lib/ai）
  - system prompt 中文硬编码 `proxy.ts:51`；temperature 0.7 / max_tokens 4096 / 默认 deepseek-chat；无受限翻译模式
  - 全仓无回译/翻译校验（grep translate 仅命中 three.js `cone.translate`，几何变换）
  - lexicon 1180 条（777+403）字段 `{term,pinyin,category,definition,source}` **无译名字段**；唯一消费方 `LexiconPage.tsx:5`；引擎/prompt 链路不引用
  - i18n UI 词典约 136 键×7 类型锁同构（en.ts:1 `import type { Dict }`）；76 条母语复核 0 完成
  - 9 断点：BP1 L0 结构化字段无键化 / BP2 提示词无语言参数 / BP3 API 请求体无 lang / BP4 网关无语言控制 / BP5 无回译 / BP6 术语词典无译名未入链路 / BP7 词典与内容层脱节 / BP8 错误文案中文直出 / BP9 UI 既有债 76 条
- 下一步：S2 「100% 准确」操作化口径定义（产出草案后**需老板确认定稿**）→ S3 7 语言术语表（核心重活 2–3 天，依赖 T2 archetype_key 约定）→ S4 翻译管线方案 → S5 校验体系 → S6 报告收口。
- 阻塞项：
  1. ⚠️ 母语复核需 en/es/ja/ko/th/vi 母语者各 ≥1 人（用户协调）——不阻塞 S2–S4，阻塞最终验收。
  2. ⚠️ `AI地图\00_总览与排障速查.md` 不存在——本次里程碑更新以分册主地图 + `_更新日志.md` 替代，待主控重建。
  3. ✅（已修复）`_更新日志.md` 编码混排问题：真实结构 = 头部 1246 字节 UTF-16LE（仅 09-12 一行）+ 其后 83KB 历次 UTF-8 追加——这才是 T1 报「不可读」的根因，并非单纯 UTF-16LE。其间 global≈2507 有 3 字符历史损坏（1×U+FFFD + 2 个 GBK 乱码，如实保留标注）。已按双段解析修复并统一重写为 UTF-16LE（54558 字符，历史内容全保留），T3·S1 条目追加成功；追加前备份 `.bak_20260913_t3s1`，诊断/修复脚本留档 `output\_diag_changelog.py`、`output\_append_changelog.py`。**后续各端追加本文件一律走 Python `utf-16-le`（禁 bash/cmd echo 直接追加，会再次混排）**。
- 备注：本线程 S1 由 **ZCode** 执行（任务卡原定 Hermes+DSH 席位，老板指令「继续」指派续跑）；纯只读审计 + 文档产出，**未动代码、未建 git 分支**（`thread/t3-i18n-accuracy` 留待 S4 管线实现时启用）。

## 2026-09-13 05:35 · S2 口径定稿 + S3 术语表一期 ✅

- 做了什么：
  1. S2：`output\02_准确性口径定义.md` **定稿**（老板 2026-09-13 批复「确认口径，直接开始继续 S2→S3」）——字段三分法：A 确定性字段 100% 机器断言 / B 术语字段 100% 查表命中 / C 语义字段分级（忠实度 ≥4.5 + 回译一致率 ≥98% + 母语复核 0 硬伤）+ 门禁 G1–G5 并入 T4 回归；未达标一律「未翻译/需人工」占位，禁静默降级。
  2. S3 一期：先实测 lexicon 实际命名（`terms\_dump_categories.py`），再建 `terms\tier1_core.py`（234 条手工编纂译名，ja/ko/vi 用汉字文化圈定读）+ `terms\build_terms_csv.py`（64 卦全名等 68 条别名映射 + 60 甲子构成式生成）→ 产出 `terms\7lang-terms.csv`（1201 行，UTF-8 BOM，Excel 可直开）。
  3. `output\03_术语表审计.md`：覆盖率/缺口/方法论/文化适配注记。
- 产物路径：`output\02_准确性口径定义.md` ｜ `output\terms\7lang-terms.csv` ｜ `output\terms\tier1_core.py` ｜ `output\terms\build_terms_csv.py`（幂等可重跑）｜ `output\03_术语表审计.md`
- 关键结论/数据：1201 行 = lexicon 1180（正则解析精确 1180，零丢失）+ 补录 21（生肖 12/阴阳 2/六爻六亲 5/本命/禄神——lexicon 缺类）；**tier1 已填 355（29.6%），其中 L0 确定性核心全集 7 语言 100%**（天干 10/10、地支 12/12、八卦 8/8、节气 24/24、十二长生 12/12、六十四卦 64/64、六十甲子 60/60、十二宫 12/13、十神核心 10/10、紫微主星+六吉六煞+四化全）；待定 846 条逐行显式 `tier2_pending`（格局名/纳音/杂曜/神煞长尾），无编造；64 卦 th 无通行音译全置 `—`。
- 下一步：S4 翻译管线方案（`PromptBuildOptions.language` + L0 查表渲染 + L1/L3/L5 受限翻译；此时启用分支 `thread/t3-i18n-accuracy`）→ S5 回译校验脚本 + 母语复核表（UI 76 条 + 术语 tier1 抽样合并交付）→ S6 报告收口。
- 阻塞项：同 S1（母语者人工项；00_总览缺失）；~~T2 archetype_key 待对齐~~ → **已解决：T4 于 shared/术语键格式.md 落 v1 三段格式（`<体系>:<实体类型>:<实体名>`），本表键已当日迁移对齐**（`bazi:stem:jia` 等；slug 为 pinyin 去声调连写，分词风格出入待四线程会签，见 03 审计 §六.2）。另：T2/T4 已在并行会话完成（T2 推荐混合管线与本线程 S4 方向一致；T4 实锤 503=Worker CPU 超限），S4 撰写时须引用 thread-02/thread-04 产物。

## 2026-09-13 06:40 · S4 管线方案 + S5 校验与复核表 + S6 报告收口 ✅（代码侧任务全部完成）

- 做了什么：
  1. **S4** `output\04_翻译管线方案.md`：老板拍板 T2 决策 A（确定性词库+LLM 受限生成）落地方案——双轨架构（L0 前端查表确定性轨 / L1-L3-L5 后端受限生成轨）、管线位置推荐（PromptBuildOptions.language + API lang 字段，含备选否决理由）、M0–M4 里程碑 ≈8.5 人日（M1 与 T2 M1 同点位需协同）、五级降级策略。
  2. **S5** `output\05_backtranslate_check.py` + `05_校验脚本说明.md`：G3 工具实现（dry-run 确定性检查 + LLM 回译 + `extract_invariants` 数值/干支断言器）；`06_母语复核表.md` 由 `_gen_review_pack.py` 生成（53 术语×6 语言分层抽样 + UI 76 条指引）。
  3. **S6** `output\审计报告_多语言翻译现状与执行方案.md`：现状结论/方案汇总/任务卡验收对照/依赖风险/诚实边界。
  4. 试运行（本地 8080 Qwen3.8-27B）：dry-run 硬伤 0/撞车预警 97（拼音结构性，键消歧）/待定 76 显式化；回译 6 语言×6 术语=33/36 exact——**th 音译错译风险被实测捕获**（比肩→偏印）；修复 Qwen3 thinking 空输出坑。为此引入 `tier1_partial` 状态（64 卦/消息卦 th 76 条不进门禁断言集），03 审计数字已同步修正。
  5. git：建分支 `thread/t3-i18n-accuracy` 提交本线程 S1–S6 全部产物并推送 solaroran-rgb。
- 产物路径：`output\04_翻译管线方案.md`、`output\05_backtranslate_check.py`、`output\05_校验脚本说明.md`、`output\06_母语复核表.md`、`output\_gen_review_pack.py`、`output\terms\_backtranslate_results.json`、`output\审计报告_多语言翻译现状与执行方案.md`
- 关键结论/数据：术语表终态 **1201 行 = filled 258 + partial 76 + supplement 21 + tier2 846**；试运行 en/es/ja/ko 6/6、th 4/6、vi 5/6（91.7% exact，非验收数据）；M0–M4 ≈8.5 人日。
- 下一步（实施阶段，非本审计线程）：M0 术语表代码生成+lang 字段 → M1 语言分支（与 T2 协同）→ M2 引擎键化+L0 渲染 → M3 受限翻译+门禁 → M4 回译入 CI。母语复核表已交付，待老板安排 6 语言复核人。
- 阻塞项：①母语复核人员（用户拍板后置）；②≥98% 验收数据需 M4 后按整段文案实测（当前仅有术语级试运行）；③M1 与 T2 在 proxy.ts 同点位施工，需主控合并排期。
