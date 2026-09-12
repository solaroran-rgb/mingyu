# WORKLOG · T1 排盘规则审计与比对

> 状态标记：✅完成 / 🔄进行中 / ⚠️阻塞 / ❌失败（须写原因与替代路径）
> 接手顺序：本文件 → OUTPUT 清单 → 产物目录（output\）

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
| 规则审计总表+分表 | `output\规则审计_*.md` | 待产出（S2） |
| 比对站清单 | `output\比对站清单.md` | 待产出（S3·豆包） |
| 黄金样例集 | `output\golden-cases\**\*.json` | 待产出（S4） |
| 比对脚本 | `output\compare_vs_sites.py` | 待产出（S5） |
| 比对测试报告 | `output\比对测试报告_*.md` | 待产出（S5-S6） |
| 审计总结 | `output\审计总结.md` | 待产出（S7） |
