# -*- coding: utf-8 -*-
"""T4-S4 从 468-redline-gaps.md 解析 131 项 partial，生成排期表 04_红线partial排期表.md。

判定规则（任务卡 S4 三态）：
  ✅实质满足 → 建议改 pass（须主控+用户确认后正式改矩阵）
  🟡有实现缺证据 → 补证据/测试，上线前可闭环
  ❌缺实现 → 排期（调用侧/集成层/后续版本）
"""
import io
import os
import re
import sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
ROOT = r"E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统"
GAPS = os.path.join(ROOT, "docs", "audit", "468-redline-gaps.md")
OUT = os.path.join(ROOT, "docs", "audit", "2026-09-13-上线前加固",
                   "thread-04-基础设施加固与红线收口", "output", "04_红线partial排期表.md")

# 逐项核实覆盖（T4 @ 2026-09-13 用代码/测试实证后覆盖默认判定）
OVERRIDES = {
    "1.2-96": ("✅实质满足→建议 pass",
               "vedic-p2(09-12) 已建 packages/core/src/vedic/（ayanamsa.ts Lahiri）+ vedic-astrology.test.ts",
               "S", "T4 复核（已实证）", "否（建议矩阵改 pass）"),
    "1.2-97": ("✅实质满足→建议 pass",
               "vedic/ayanamsa.ts 恒星黄经=热带-ayanamsa；vedicEvidence 证据链",
               "S", "T4 复核（已实证）", "否"),
    "1.2-99": ("✅实质满足→建议 pass",
               "vedic-p2 已实现 Vimshottari 两级大运（Budha=17 勘误）+ vedic-p2.test.ts",
               "S", "T4 复核（已实证）", "否"),
}


def guess_section(secs, rid):
    for title, items in secs:
        if any(r[0] == rid for r in items):
            return title
    return "?"


def main():
    text = open(GAPS, encoding="utf-8").read()
    lines = text.splitlines()
    sections = []  # (title, rows)
    cur = None
    for ln in lines:
        if ln.startswith("## "):
            cur = (ln[3:].strip(), [])
            sections.append(cur)
        elif ln.startswith("|") and cur is not None:
            cells = [c.strip() for c in ln.strip("|").split("|")]
            if len(cells) >= 5 and re.match(r"\d+\.\d+-\d+", cells[0]):
                if "已修复" in cells[1]:  # g2 已修复登记行（1.1-03/1.1-07），不属 partial
                    continue
                cur[1].append(cells)
    total = sum(len(r) for _, r in sections)
    print("parsed rows:", total)
    for t, r in sections:
        print(f"  {t}: {len(r)}")

    out = []
    out.append("# T4-S4 · 468 红线 131 项 partial 三态判定与排期表（建议版 v1）\n")
    out.append("> 生成：2026-09-13 ｜ 执行者：ZCode（T4）｜ 数据源：`docs/audit/468-redline-gaps.md`（fail 0 / partial 131）")
    out.append("> 状态基线：`468-redline-mapping.md` 表头已同步为 **pass 166 / partial 131 / fail 0 / na 195**（1.1-03、1.1-07 已由 g2 修复并经 tests/utc-tt-samoa.test.ts 6/6 实证）")
    out.append(">")
    out.append("> **三态口径**：✅实质满足→建议改 pass（正式改矩阵须主控+用户确认）｜🟡有实现缺证据→补证据/测试｜❌缺实现→排期")
    out.append("> **联动**：2.1 全组 24 项归 T2 出确定性转译方案后更新；本表为 T4 单方建议版。\n")

    stat = {"pass": 0, "yellow": 0, "red": 0}
    must = 0
    for title, rows in sections:
        if not rows:
            continue
        out.append(f"\n## {title}（{len(rows)} 项）\n")
        out.append("| ID | 检查项 | 严重度 | 判定 | 上线前必做? | 工作量 | 负责线程 / 依据 |")
        out.append("|---|---|---|---|---|---|---|")
        for cells in rows:
            rid, sev, item = cells[0], cells[1], cells[2]
            note = cells[4] if len(cells) > 4 else ""
            if rid in OVERRIDES:
                judge, basis, effort, owner, mustdo = OVERRIDES[rid]
            else:
                is_meta = ("测试" in note or "证据" in note or "断言" in note or "文档" in note
                           or "覆盖率" in note or "版本核对" in note)
                if "调用侧" in note or "集成层" in note:
                    judge, mustdo, effort, owner = "❌缺实现→排期（集成层）", "否（待主控裁决）", "M", "主控裁决（core 能力已具备）"
                elif is_meta:
                    judge = "🟡有实现缺证据→补证据/测试"
                    mustdo = "是（P1）" if sev == "P1" else ("否（P2 后置）" if sev == "P2" else "视板块")
                    effort, owner = "S", "T4"
                else:
                    judge = "🟡有实现缺证据→补证据/测试"
                    mustdo = "是（P1）" if sev == "P1" else ("否（P2 后置）" if sev == "P2" else "视板块")
                    effort, owner = "M", "T4（或对口线程）"
                if title.startswith("2.1"):
                    owner = "T2 联动（转译方案）"
                    mustdo = "T2 方案定后分级"
                    judge = "🟡有实现缺证据→补证据/测试"
                if sev == "P2":
                    mustdo = "否（P2 后置）" if mustdo in ("视板块",) else mustdo
                    effort = "S"
            key = judge[0]
            stat["pass" if key == "✅" else "yellow" if key == "🟡" else "red"] += 1
            if mustdo.startswith("是") or mustdo.startswith("上线"):
                must += 1
            item_short = item if len(item) <= 38 else item[:37] + "…"
            out.append(f"| {rid} | {item_short} | {sev} | {judge} | {mustdo} | {effort} | {owner} |")

    out.append(f"\n## 汇总\n")
    out.append(f"- ✅建议改 pass：{stat['pass']} 项（正式修订须主控+用户确认）")
    out.append(f"- 🟡补证据/测试：{stat['yellow']} 项")
    out.append(f"- ❌排期（集成层/未实现）：{stat['red']} 项")
    out.append(f"- 明确「上线前必做」：{must} 项（其余视 T2/T3 结论与主控裁决）\n")
    out.append("> 注：本表判定为 T4 基于代码/测试实证与 gaps 现状文本的建议版；2.1 组与 T2 联动项在 T2 方案落地后出 v2。")

    open(OUT, "w", encoding="utf-8").write("\n".join(out))
    print("saved ->", OUT)


if __name__ == "__main__":
    main()
