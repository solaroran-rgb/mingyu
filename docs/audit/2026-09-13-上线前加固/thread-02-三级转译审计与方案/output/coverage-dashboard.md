# 转译覆盖率看板（T2 · 自动生成）
> 生成：scripts/coverage-dashboard.py ｜ dict_version：1.3.1 ｜ 数据：lexicon-translator-seed（318 条）

## 一、词库分层覆盖
- L1 古籍引文：**draft 200/318（63%）**｜verified 0（诚实：未经人核）｜pending 118
- L2 语义库（原创）：318/318
- L3 白话（translations.zh）：318/318
- 多语言转译：2 语言（zh=318 en=22 es=0 ar=0 th=0 pt=0）

## 二、分体系 L1 状态
| 体系 | 条数 | draft | pending |
|---|---|---|---|
| bazi | 68 | 68 | 0 |
| ziwei | 60 | 60 | 0 |
| western | 46 | 0 | 46 |
| liuyao | 23 | 23 | 0 |
| meihua | 13 | 13 | 0 |
| chenggu | 12 | 0 | 12 |
| daliuren | 12 | 12 | 0 |
| fengshui | 12 | 0 | 12 |
| qimen | 12 | 12 | 0 |
| qizheng | 12 | 0 | 12 |
| taiyi | 12 | 0 | 12 |
| tarot | 12 | 0 | 12 |
| vedic | 12 | 0 | 12 |
| zeri | 12 | 12 | 0 |

## 三、prompt 链路锚定注入
| 链路 | 状态 |
|---|---|
| 八字（aiPrompts.buildPromptFromConfig） | ✅ 已注入（M3：原型法理锚定段） |
| 紫微（buildZiweiPromptDocument） | 🟡 未接入（术语口径经 proxy 通用注入；锚定段待扩展） |
| 占卜（buildDivinationPromptDocument） | 🟡 未接入（同上） |
| AI 代理运行时（proxy） | ✅ 合规铁律+敏感域+术语口径+双层熔断（M1/M4） |

## 四、红线 2.1 映射（工程视角，申报终裁权在主控+用户）
| 红线项 | 数据 | 工程状态 |
|---|---|---|
| 2.1-01 L1 古籍锚定 | draft 200/318 | 🟡 部分 |
| 2.1-02 L2 注疏/语义库 | semanticLibrary 318/318 | ✅ 全量（原创语义） |
| 2.1-03 L3 通用白话 | translations.zh 318/318 | ✅ |
| 2.1-04 L4/L5 矩阵 | 0/318 | ❌（M4 后续批次） |
| 2.1-06 熔断器 | 双层：FUSE 5 组 + WARN 4 组 | 🟡 关键词级就绪/语义级待建 |
| 2.1-08 多语言脱敏 | transl 语言数 2（UI 7） | 🟡 zh/en 有，es/ar/th/pt 缺 |
| 2.1-09 版本化 | dict_version 1.3.1 + meta 事件 | 🟡 部分（报告级落盘待建） |
| 2.1-15 术语口径查表 | buildTermHints 318 条可用 | 🟡 部分（未核验） |

## 五、核验清单（遗留数据问题）
- [x] bazi.dizhi.si si_snake→巳（已修）
- [x] bazi.shensha.xuetang_yima→tianluodiwang 键核正（资产线源+网站仓同步）
- [ ] 紫微/择日/大六壬/奇门 96 条引文为「通行赋文意引」，待命理顾问逐条核验升 verified
- [ ] 称骨 12/风水 12/七政 12/太乙 12 置信不足未起草（下批：需古籍原文录入）
- [ ] 塔罗/吠陀/西洋 70 条无中文古籍对象，建议红线口径改判 na 或按原典引文处理
