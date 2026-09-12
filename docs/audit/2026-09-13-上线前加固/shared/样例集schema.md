# 共享规范 · 黄金样例集 schema（T1 用）

> 版本 v1 ｜ 2026-09-13 ｜ T4 出品 ｜ T1/T2/T3 共用，改动须经四线程确认

## 样例文件格式（JSON，单样例单文件）

```jsonc
{
  "id": "01_normal",                    // 唯一 ID：序号_场景slug
  "scene": "normal|early_zi|late_zi|lichun|solar_term|dst|leap_day|leap_month|extreme_longitude|overseas",
  "desc": "普通白天·北京",
  "input": { /* 公开 API 契约入参（见 /api/v1/openapi.json），含 gender/year/month/day/dateType/birthHour/birthMinute/birthPlace/birthLongitude/timezone|timeZoneId/useTrueSolarTime */ },
  "expect": {                            // 黄金断言（与引擎输出同构，逐字段可判等）
    "bazi":  { "pillars": { "year": "庚午", "month": "壬午", "day": "辛亥", "hour": "癸巳" } },
    "ziwei": { "soul": "巨门", "body": "火星", "fiveElementsClass": "火六局" },
    "...":   "其余体系按板块补齐；T1 比对 top5 权威站后回填"
  },
  "source": { "authority": "问问八字/其他", "url": "", "retrievedAt": "2026-09-13" }
}
```

## 硬规则

1. `expect` 只写**可判等的确定性字段**（四柱/安星/宫位/局数）；解读类文本不入黄金样例（归 T2 评测指标）。
2. 边界场景必须覆盖：晚子时、立春交接 ±15min、夏令时 1986-1991、闰年 2/29、农历闰月、乌鲁木齐经度、海外 IANA 时区、萨摩亚跳日、回拨歧义时刻、无效日期（期望 400）。
3. 期望值变更 = 规则变更，须在样例 `source` 注明权威依据并知会其他线程。
4. 目录约定：`_audit_20260912/cases/<id>.json`（由现有 10 组扩展）；比对结果只落各线程 output 目录。

## 现状基线

- `run_local.mjs` 10 组已验证 4 体系（bazi/ziwei/astrolabe/qizheng）全 OK——可直接转为前 10 个黄金样例（T1 回填权威比对列）。
- `run_temposoul.py` 有两处契约 bug（qizheng 参数名、case10 农历传参）——**移交 T1 修正**（见 thread-04/output/01_503复现记录.md §三）。
