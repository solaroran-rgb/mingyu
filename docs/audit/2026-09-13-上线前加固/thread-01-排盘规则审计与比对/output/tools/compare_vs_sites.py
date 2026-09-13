# -*- coding: utf-8 -*-
r"""T1-S5 比对器：黄金样例 expected（独立算式）vs 引擎结果 vs 比对站。
网站侧：抓取受限/需登录 → 登记「人工比对」，不造假（任务卡 S5 红线）。
产出：比对结果\<体系>-diff.json、比对测试报告_<体系>.md、_comparison_summary.json
"""
import json
import os
import re

BASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
CASES = os.path.join(BASE, "golden-cases")
RAW = os.path.join(BASE, "engine_results_raw")
OUTD = os.path.join(BASE, "比对结果")
os.makedirs(OUTD, exist_ok=True)


def deep_find(obj, key):
    """BFS 找第一个名为 key 的值（引擎字段路径未知的兜底）。"""
    if isinstance(obj, dict):
        if key in obj:
            return obj[key]
        for v in obj.values():
            r = deep_find(v, key)
            if r is not None:
                return r
    elif isinstance(obj, list):
        for v in obj:
            r = deep_find(v, key)
            if r is not None:
                return r
    return None


def engine_get(result, key):
    """点路径优先取引擎值，失败回退 BFS 按键名找。"""
    cur = result
    for part in key.split("."):
        if isinstance(cur, dict) and part in cur:
            cur = cur[part]
        else:
            return deep_find(result, key.split(".")[-1])
    return cur


def norm(s):
    if isinstance(s, str):
        return re.sub(r"[\s（）()【】\[\]·]", "", s)
    return s


def compare(expected, engine):
    if engine is None:
        return "missing"
    if isinstance(expected, str) and isinstance(engine, str):
        return "match" if norm(expected) == norm(engine) else (
            "fuzzy-match" if norm(engine).startswith(norm(expected)) or norm(expected) in norm(engine) else "mismatch")
    if isinstance(expected, bool) or isinstance(engine, bool):
        return "match" if bool(expected) == bool(engine) else "mismatch"
    if isinstance(expected, (int, float)) and isinstance(engine, (int, float)):
        return "match" if expected == engine else "mismatch"
    return "match" if expected == engine else "mismatch"


summary = {}
for sys_ in sorted(os.listdir(CASES)):
    cdir = os.path.join(CASES, sys_)
    rdir = os.path.join(RAW, sys_)
    if not os.path.isdir(cdir):
        continue
    rows = []
    stats = {}
    for f in sorted(os.listdir(cdir)):
        if not f.endswith(".json"):
            continue
        case = json.load(open(os.path.join(cdir, f), encoding="utf-8"))
        rpath = os.path.join(rdir, f)
        rec = json.load(open(rpath, encoding="utf-8")) if os.path.exists(rpath) else None

        def bump(st):
            stats[st] = stats.get(st, 0) + 1
            return st

        for key, exp in case["expected"].items():
            row = {"case": case["caseId"], "field": key, "expected": exp}
            if rec is not None and not rec.get("ok"):
                # 引擎抛错：shouldThrow=True 期望抛错=match；否则 engine-throw
                if key == "shouldThrow" and exp is True:
                    row["status"] = bump("match")
                    row["engine"] = rec.get("error")
                else:
                    row["status"] = bump("engine-throw")
                    row["engine"] = None
                    row["note"] = "引擎抛错: " + str(rec.get("error"))[:120]
            elif exp is None:
                row["status"] = bump("null")
                row["engine"] = engine_get(rec.get("result"), key) if rec and rec.get("ok") else None
                row["note"] = "期望待推演（S3 双源回填）；引擎值已留档"
            elif key == "shouldThrow" and exp is False:
                row["status"] = bump("match" if rec and rec.get("ok") else "mismatch")
                row["engine"] = "ok"
            else:
                engine = engine_get(rec.get("result"), key) if rec and rec.get("ok") else None
                st = compare(exp, engine)
                if st == "mismatch" and key in ("bureau", "accumulatedYears") and case.get("expectedAssumption"):
                    st = "assumption-mismatch"
                    row["note"] = "L2 口径假设不符——先核 expectedAssumption 再判引擎"
                row["status"] = bump(st)
                row["engine"] = engine
            rows.append(row)
    json.dump(rows, open(os.path.join(OUTD, sys_ + "-diff.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=2)
    lines = ["# 比对测试报告 · %s（S5 引擎侧）" % sys_, "",
             "> 2026-09-13 ｜ 引擎：@temposoul/core 本地构建 ｜ 网站侧：见 `比对站清单.md`（多数站点抓取受限→人工比对，未造假数据）",
             "", "| case | 字段 | 期望 | 引擎 | 状态 |", "|---|---|---|---|---|"]
    for r in rows:
        lines.append("| %s | %s | %s | %s | %s |" % (
            r["case"], r["field"], json.dumps(r["expected"], ensure_ascii=False),
            json.dumps(r.get("engine"), ensure_ascii=False)[:60] if r.get("engine") is not None else "—",
            r["status"]))
    lines += ["", "**统计**：" + "，".join("%s=%d" % kv for kv in stats.items()), ""]
    open(os.path.join(BASE, "比对测试报告_%s.md" % sys_), "w", encoding="utf-8").write("\n".join(lines))
    summary[sys_] = stats

json.dump(summary, open(os.path.join(OUTD, "_comparison_summary.json"), "w", encoding="utf-8"),
          ensure_ascii=False, indent=2)
print(json.dumps(summary, ensure_ascii=False))
