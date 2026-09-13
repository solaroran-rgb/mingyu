# 上线前四线程加固计划・总览与共享规范

> 创建：2026-09-13 ｜ 主控：豆包（MainAgent） ｜ 状态：🏁 四线程代码侧收口（2026-09-13，余项与部署指引见《总体收口报告.md》）
> 背景：用户判定「后端还不坚固」，须在上线前完成排盘准确性、三级转译、多语言翻译三大块深度审计，并同步加固基础设施与红线收口。
> 原则：
>
> **诚实第一、先诊断后动手、完成即审计、交接零断点**
>
> 。

## 一、四线程架构



| 线程 | 名称            | 对应需求                                                                               | 建议执行者                    | 状态     |
| -- | ------------- | ---------------------------------------------------------------------------------- | ------------------------ | ------ |
| T1 | 排盘规则审计与比对测试   | 用户第一步：(a) 每板块规则 / 公式 / 代码逻辑审计；(b) 与排名前 5 对应网站同数据比对；(c) 目标：排盘 100% 准确               | Codex（代码对勘）+ 豆包（在线比对核验）  | ✅ S1-S7 完成：引擎侧比对 186/186、22/22 体系审计、A1/H2/H3 已修；余项=网站侧人工比对（豆包）、H1/H4（Codex）、B8/B10/D1-D5（主控/专家） |
| T2 | 排盘结果三级转译审计与方案 | 用户第二步：(a) 现状排查（部署阶段 / 质量）；(b) 深度审计 + 下一步执行方案                                       | Codex（代码实证）+ DSH（审计）     | ✅ S1-S6 审计完成 + M1 运行时约束已部署上线（4de2841d，sw v6）+ M2（dict 1.3.1，L1 draft 200/318）/M3 桥接层/M4 代码侧完成；余项=M3 全量接入（T1 结论已交付解锁）、verified 人工核验 |
| T3 | 多语言翻译实现与准确性   | 用户第三步：文言文翻译难点、排盘结果及三次转译的多语言 100% 准确路径                                              | Hermes（审计）+ DSH（复核）+ 母语者 | ✅ S1-S6 审计 + M0-M4 实施完成（八字+紫微全链 L0 查表、lang 全链贯通、nightly CI；13/13 新测试）；BP1 已由 T1 签署；余项=母语复核 6 人、回译 ≥98% 实测 |
| T4 | 基础设施加固与红线收口   | 主控规划剩余项：Worker 503/Error 1102 修复、468 红线 2 fail + 131 partial 判定、黄金样例库 / 评测集规范、全量回归 | Codex（修复）+ DSH（回归）       | ✅ 代码侧完成：503 实锤=Worker CPU 超限（懒加载两片 34da981/165a81f）、500→400 修复（98cad2a）、红线 fail=0（131 partial 排期表）、shared 三件套、部署 Runbook；余项=主控按 Runbook 合并+sw v7+部署+3×100 验收 |

## 二、统一输出目录（交接唯一落点）



```
E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统\docs\audit\2026-09-13-上线前加固\\

├── README.md                        # 本文件：总览 + 共享规范

├── thread-01-排盘规则审计与比对\     # T1：任务卡.md + WORKLOG.md + 产物

├── thread-02-三级转译审计与方案\     # T2

├── thread-03-多语言翻译实现与准确性\ # T3

└── thread-04-基础设施加固与红线收口\ # T4
```

**硬规则**：



1. 所有产物只落各自线程目录，禁止散落到临时目录或项目根；线上 / 引擎改动一律走 git 分支 + commit。

2. 每线程目录维护 `WORKLOG.md`（见模板），每完成一步立即写入，不攒批。

3. 共享产物归 T4 归口（黄金样例库 / 评测集 / 红线矩阵），其余线程只读引用；跨线程引用必须在 WORKLOG 标注来源路径。

4. 任务中断时，接手者第一步：读 README → 读该线程 `任务卡.md` → 读 `WORKLOG.md` → 从「下一步」续跑。

### WORKLOG.md 模板



```
\# WORKLOG · <线程名>

\> 状态标记：✅完成 / 🔄进行中 / ⚠️阻塞 / ❌失败（须写原因与替代路径）

\> 接手顺序：本文件 → OUTPUT 清单 → 产物目录

\## \<YYYY-MM-DD HH:mm>

\- 做了什么：

\- 产物路径：

\- 关键结论/数据：

\- 下一步：

\- 阻塞项：
```

## 三、共享规范（每张任务卡独立重申，此处为总纲）

### A. AI 地图查询方法（三级检索漏斗，≤4000 token）



1. **一级・结构化索引（必做）**：

* Read `E:\KnowledgeOS\AI地图\00_总览与排障速查.md`（全局视图 / 端口 / 最近变更）

* Read `E:\KnowledgeOS\memory\_PROJECTS.md`（项目 slug 与目录）

* Read `E:\KnowledgeOS\AI地图\11_国学出海\主地图.md`（分册主地图）

1. **二级・滚动上下文（按需）**：

* Read `E:\KnowledgeOS\memory\guoxue-overseas\context.md`

* Glob `E:\KnowledgeOS\memory\guoxue-overseas\*.md`，Read 最近 3 个日期文件

* Read `E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统\task_status.md`

1. **三级・语义检索（8877，curl.exe，PowerShell 单行）**：



```
curl.exe -s -X POST http://127.0.0.1:8877/memory/query -H "Content-Type: application/json" -d "{\\"query\\":\\"<关键词>\\",\\"k\\":5}"

curl.exe -s -X POST http://127.0.0.1:8877/corpus/query -H "Content-Type: application/json" -d "{\\"query\\":\\"<关键词>\\",\\"k\\":8}"

curl.exe -s -X POST http://127.0.0.1:8877/tools/query -H "Content-Type: application/json" -d "{\\"query\\":\\"<关键词>\\",\\"k\\":3}"

curl.exe -s -X POST http://127.0.0.1:8877/instructions/query -H "Content-Type: application/json" -d "{\\"query\\":\\"<关键词>\\",\\"k\\":3}"
```

（8877 不可用时降级：Read 直读 + Glob/Grep 本地搜索；禁止全库 Glob）



1. 检索后必须一句话汇报：「已加载 <项目> 记忆（N 条），最近状态：…」。

### B. AI 地图更新要求（重要部署全 6 步；里程碑至少 1+5+6）



1. 写分册部署日志：`E:\KnowledgeOS\AI地图\11_国学出海\部署日志\YYYY-MM-DD_<线程名>_<标题>.md`（背景 / 变更 / 结果 / 回滚 / 关联文件 / 关联端口）

2. 更新分册主地图 `E:\KnowledgeOS\AI地图\11_国学出海\主地图.md` 相关章节

3. 更新 `E:\KnowledgeOS\AI地图\00_总览与排障速查.md`（最后更新时间 / 最近变更 / 分册索引 / 最近部署日志）

4. 追加 `E:\KnowledgeOS\AI地图\_更新日志.md` 一条

5. 写 memory 集合：



```
curl.exe -s -X POST http://127.0.0.1:8877/memory/write -H "Content-Type: application/json" -d "{\\"text\\":\\"\[来源: <线程名> @ 2026-09-13 HH:mm] <摘要>\\",\\"session\_id\\":\\"guoxue-overseas\\",\\"user\\":\\"doubao\\",\\"type\\":\\"note\\"}"
```



1. 触发增量索引：`curl.exe -s -X POST http://127.0.0.1:8877/corpus/scan -H "Content-Type: application/json" -d "{}"`

* 敏感内容（密钥 / 隐私）绝不写入 memory 与 AI 地图。

### C. 交接防断点规范



* 产物唯一落点（见二）；每步写入 WORKLOG；接手先读 README→任务卡→WORKLOG。

* 关键结论用状态标记；⚠️阻塞必须写「尝试了什么 / 需要什么输入 / 谁可解锁」。

* 不无限重试：同一动作失败 2 次即换通道，向主控报告。

## 四、共享事实底座（各线程默认已知）



* 仓库：`E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统`，分支 `codex/website-basic-settings`，基线 core 1539 /api 107 /prompt 229 全绿

* 线上：[https://www.temposoul.com](https://www.temposoul.com)（CF Pages 项目 temposoul，生产分支 main；sw v5，再部署须 bump v6）

* 排盘审计既有产物：`_audit_20260912\`（10 组八字对勘 + 12 板块 JSON 落盘 + 脚本 cross\_check.py/run\_temposoul.py/run\_local.mjs/probe\_site.py）

* 468 红线矩阵：`docs/audit/468-redline-mapping.md`（492 检查点：pass 164 /partial 131 /fail 2 /na 195）；缺口清单 `docs/audit/468-redline-gaps.md`（2.1-06 越界熔断器 P2 待补）

* 词库：`src/data/lexicon.ts` + `lexicon-extra.ts`（1180 条，术语词典，非分支转译库）

* i18n：`src/i18n/locales/{zh-CN,en,ja,ko-KN,es-ES,th-TH,vi-VN}.ts`，UI 134×7；母语复核清单 `docs/i18n/2026-09-12-native-review-checklist.md`（76 条）

* 关键已知缺陷：**ziwei/calculate 全 503**；晚子时 / 立春边界触发 Worker Error 1102（资源超限）

* 白皮书权威口径：`网站搭建方案代码部分0830.md` 3.6（L0–L7 转译分层、800 条 MVP、归属专家 C）、2.1（证据型输出 /archetype\_key 命名）