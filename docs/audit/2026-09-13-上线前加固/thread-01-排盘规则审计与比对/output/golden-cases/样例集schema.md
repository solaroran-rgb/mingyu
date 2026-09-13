# 黄金样例集 Schema（thread-01 定义 · 待 T4 归口收敛）

> T1-S4 ｜ 2026-09-13 ｜ 说明：任务卡要求遵守 `shared\样例集schema.md`，该文件尚不存在（T4 未建）。本 schema 为 thread-01 先行定义，T4 建共享规范后按其收敛（字段超集，收敛成本≈0）。

## 文件位置与命名

```
thread-01-排盘规则审计与比对\output\golden-cases\<体系>\<体系>-NNN.json
```

## 字段契约

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| caseId | string | ✅ | `<体系>-NNN` |
| system | string | ✅ | 体系 id（与 capability id 一致） |
| desc | string | ✅ | 人读描述 |
| input | object | ✅ | 引擎/HTTP 入参（与公开 API 字段对齐） |
| expected | object | ✅ | 独立期望值；**值可为 null = 待推演/待参照**，键为引擎结果字段（点路径） |
| expectedAssumption | string | ✅ | 期望值的算式假设/口径声明（无假设写「无」） |
| source | object | ✅ | `{type: 典籍推演\|开源参照\|官方签谱\|引擎基线锁定, note}` |
| boundaryTags | string[] | ✅ | 边界标签（晚子时/立春/闰月/夏令时/会界/边界…） |
| yearRange | string | ✅ | 有效年份域（边界支持范围声明：排盘域 1900-2100） |

## 期望值独立性分级

- **L1 独立算式**（典籍/数学推导，与引擎无关）：zodiac 干支、wuyun 岁运/司天在泉、huangji 元会运世 → 引擎不一致即嫌疑真 bug。
- **L2 口径假设算式**（源自适应口径，假设已标注）：taiyi 积年/局数 → 不一致先查假设。
- **L3 引擎基线锁定**（无独立参照，仅锁回归）：ssgw 签文内容、taiyi 16 神位置等 → 仅防漂移。
- **null**：待 S3 双源（Kintaiyi 等开源参照）推演后回填。

## S5 对接

`engine_runner.mjs` 产 `engine_results_raw\<caseId>.json`（引擎全量结果）→ `compare_vs_sites.py` 按 expected 键（点路径）抽引擎值做归一化 diff，产出 `比对结果\<体系>-diff.json` 与 `比对测试报告_<体系>.md`；网站侧字段由各站 adapter 登记 URL+抓取时间，抓取受限记「人工比对」。
