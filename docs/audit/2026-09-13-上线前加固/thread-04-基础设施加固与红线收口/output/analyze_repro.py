# -*- coding: utf-8 -*-
"""T4-S1 复现数据解析：case×endpoint 矩阵 + 非200/503 明细。"""
import io
import json
import os
import sys

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
HERE = os.path.dirname(os.path.abspath(__file__))
d = json.load(open(os.path.join(HERE, "_raw_503_repro.json"), encoding="utf-8"))
runs = d["runs"]
EPS = ["ziwei/calculate", "bazi/calculate", "divination/qimen", "divination/liuren"]

print("ts:", d["ts"])
print("case          | " + " | ".join(e.split("/")[-1][:8] for e in EPS))
for cid in sorted({r["case"] for r in runs}):
    row = []
    for ep in EPS:
        codes = [r["http"] for r in runs if r["case"] == cid and r["ep"] == ep]
        row.append("/".join(map(str, codes)))
    print(f"{cid:13s} | " + " | ".join(row))

print("\n--- 非 200/503 明细 ---")
for r in runs:
    if r["http"] not in (200, 503):
        print(r["ep"], r["case"], "try" + str(r["try"]), "http=" + str(r["http"]),
              r.get("body", "")[:160])

print("\n--- 503 body 抽样 ---")
seen = set()
for r in runs:
    if r["http"] == 503 and r.get("body", "") not in seen:
        seen.add(r.get("body", ""))
        print(repr(r.get("body", ""))[:80])

ms200 = sorted(r["ms"] for r in runs if r["http"] == 200)
ms503 = sorted(r["ms"] for r in runs if r["http"] == 503)
print(f"\n200 耗时: min={ms200[0]} max={ms200[-1]} median={ms200[len(ms200)//2]} (n={len(ms200)})")
print(f"503 耗时: min={ms503[0]} max={ms503[-1]} median={ms503[len(ms503)//2]} (n={len(ms503)})")
