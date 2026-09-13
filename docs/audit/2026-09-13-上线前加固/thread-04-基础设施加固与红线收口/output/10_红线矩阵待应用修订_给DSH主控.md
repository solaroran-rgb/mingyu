# 468 红线矩阵 · 待应用修订（移交 DSH + 主控终裁）

> 备料：ZCode（队 4）@ 2026-09-13 ｜ 状态修订属 DSH+主控职权，队 4 只备好可直接粘贴的行文本
> 依据：`packages/core/src/vedic/`（vedic-p2 @ 09-12 合并：ayanamsa.ts / vimshottari.ts / tables.ts）+ `tests/vedic-astrology.test.ts` + `tests/vedic-p2.test.ts`（本轮回归全绿内含）

## A. 468-redline-mapping.md（1.2 节）——应用后建议改 pass

| ID | 现行行 | 建议替换为 |
|---|---|---|
| 1.2-96 | `\| 1.2-96 \| Ayanamsa 锁定：默认 Lahiri Ayanamsa（年度更新，印度天文…） \| partial \| 吠陀占星（Jaimini/分盘）未见独立算法模块；astrolabe 为西洋盘，吠陀 Lahiri ayanamsha / 分盘体系在 core 内未独立实现 \|` | `\| 1.2-96 \| Ayanamsa 锁定：默认 Lahiri Ayanamsa（年度更新） \| pass（T4 建议 @ 2026-09-13，待终裁） \| packages/core/src/vedic/ayanamsa.ts（Lahiri；vedic-p2 @ 09-12）；tests/vedic-astrology.test.ts \|` |
| 1.2-97 | 恒星黄道计算 … partial（同 1.2-96） | `\| 1.2-97 \| 恒星黄道计算：热带黄经 - Ayanamsa = 恒星黄经 \| pass（T4 建议 @ 2026-09-13，待终裁） \| packages/core/src/vedic/ayanamsa.ts（sidereal = tropical − ayanamsa）+ vedicEvidence 证据链；tests/vedic-astrology.test.ts \|` |
| 1.2-99 | Vimshottari Dasha … partial（同 1.2-96） | `\| 1.2-99 \| Vimshottari Dasha：120 年大运周期 \| pass（T4 建议 @ 2026-09-13，待终裁） \| packages/core/src/vedic/vimshottari.ts（两级大运，Budha=17 年勘误 @ vedic-p2）；tests/vedic-p2.test.ts \|` |

同步动作：三行状态改后，1.2 节小计 `pass 108 / partial 12 / fail 0` → `pass 111 / partial 9 / fail 0`；总览行与分体系表 1.2 行同步（pass 166→169，partial 131→128）。**此为终裁后才执行的算术，勿提前改。**

## B. gaps 文档（468-redline-gaps.md）——现状文本刷新（不涉状态）

1.2-96/97/98/99 的「现状」列均写于 vedic-p2 之前（如「吠陀占星未见独立算法模块」），建议统一改为：
> `已由 vedic-p2（2026-09-12）实现 packages/core/src/vedic/（ayanamsa/vimshottari/tables）+ vedic-astrology/vedic-p2 双测试；T4 建议 pass（待终裁）`

1.2-98（27 Nakshatra）：`vedic/tables.ts` 疑似含星宿表但队 4 未逐项核对边界（13°20'×27），**维持 partial 待复核**，勿并入 A 组。

## C. 终裁后收尾

- 正式改矩阵 → 跑 `python output/gen_schedule.py` 重新生成 04 排期表（OVERRIDES 移除该 3 项即自然归入正式 pass，不计入 partial 统计）。
- 更新日志追加一条（python 脚本 utf-16 插入，禁 echo）。
