# 比对测试报告 · ssgw（S5 引擎侧）

> 2026-09-13 ｜ 引擎：@temposoul/core 本地构建 ｜ 网站侧：见 `比对站清单.md`（多数站点抓取受限→人工比对，未造假数据）

| case | 字段 | 期望 | 引擎 | 状态 |
|---|---|---|---|---|
| ssgw-001 | number | 1 | 1 | match |
| ssgw-001 | poolSize | 92 | 92 | match |
| ssgw-001 | shouldThrow | false | "ok" | match |
| ssgw-002 | number | 2 | 2 | match |
| ssgw-002 | poolSize | 92 | 92 | match |
| ssgw-002 | shouldThrow | false | "ok" | match |
| ssgw-003 | number | 23 | 23 | match |
| ssgw-003 | poolSize | 92 | 92 | match |
| ssgw-003 | shouldThrow | false | "ok" | match |
| ssgw-004 | number | 45 | 45 | match |
| ssgw-004 | poolSize | 92 | 92 | match |
| ssgw-004 | shouldThrow | false | "ok" | match |
| ssgw-005 | number | 46 | 46 | match |
| ssgw-005 | poolSize | 92 | 92 | match |
| ssgw-005 | shouldThrow | false | "ok" | match |
| ssgw-006 | number | 88 | 88 | match |
| ssgw-006 | poolSize | 92 | 92 | match |
| ssgw-006 | shouldThrow | false | "ok" | match |
| ssgw-007 | number | 91 | 91 | match |
| ssgw-007 | poolSize | 92 | 92 | match |
| ssgw-007 | shouldThrow | false | "ok" | match |
| ssgw-008 | number | 92 | 92 | match |
| ssgw-008 | poolSize | 92 | 92 | match |
| ssgw-008 | shouldThrow | false | "ok" | match |
| ssgw-009 | number | 0 | — | engine-throw |
| ssgw-009 | poolSize | 92 | — | engine-throw |
| ssgw-009 | shouldThrow | true | "签号需为1至92的整数" | match |
| ssgw-010 | number | 93 | — | engine-throw |
| ssgw-010 | poolSize | 92 | — | engine-throw |
| ssgw-010 | shouldThrow | true | "签号需为1至92的整数" | match |

**统计**：match=26，engine-throw=4
