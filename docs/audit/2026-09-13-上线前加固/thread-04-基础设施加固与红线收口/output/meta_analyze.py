# -*- coding: utf-8 -*-
"""T4 第三片评估：解析 wrangler build metafile，量化剩余静态模块图。"""
import collections
import io
import json
import os
import sys
import tempfile

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
meta_path = os.path.join(tempfile.gettempdir(), "t4_meta2.json")
m = json.load(open(meta_path, encoding="utf-8"))
ins = m.get("inputs", {})
b = collections.Counter()
for path, meta in ins.items():
    n = meta.get("bytes", 0)
    p = path.lower().replace("\\", "/")
    if "/dist/bazi" in p or "/dist/calendar" in p or "/dist/ganzhi" in p:
        b["bazi+calendar/ganzhi（静态·第三片候选）"] += n
    elif "/dist/prompt" in p:
        b["prompt 文本（静态·第三片候选）"] += n
    elif "/dist/location" in p or "location-data" in p or "global-cities" in p:
        b["location 数据"] += n
    elif any(k in p for k in ("ba_zhai", "qi_zheng", "taiyi", "xuan_kong", "wuyun",
                              "huangji", "zodiac", "residential")):
        b["八体系（已懒加载）"] += n
    elif "/dist/ziwei" in p or "iztro" in p:
        b["ziwei/iztro（已懒加载）"] += n
    elif "/dist/divination" in p:
        b["占卜组（已懒加载）"] += n
    elif "/src/lib/public-api" in p or "handler" in p:
        b["handler 自身"] += n
    else:
        b["其它（node_modules/工具）"] += n
tot = sum(b.values())
print(f"bundle bytes in output: {tot} ({tot/1024:.0f} KB)")
for k, v in b.most_common():
    print(f"  {k}: {v/1024:.0f} KB ({v/tot:.0%})")
