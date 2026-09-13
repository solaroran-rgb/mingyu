# -*- coding: utf-8 -*-
"""T4-S1 线上 503/1102 系统复现脚本（亦为部署验收脚本）。

用法：
  python repro_503.py                     # 5 端点 × 10 样例 × 2 次 = 100 请求（复现口径）
  python repro_503.py --rounds 3          # 验收口径：跑 3 轮（每轮 100 请求），输出 PASS/FAIL
  python repro_503.py --endpoints ziwei/calculate,bazi/calculate

PASS 判据：全部请求 0 个 5xx（503/1102/500）。
产物：同目录 _raw_503_repro.json（追加模式，含 rounds 字段）。
"""
import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.request

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_raw_503_repro.json")
sys.stdout.reconfigure(encoding="utf-8")


def post(path, payload, timeout=40):
    data = json.dumps(payload).encode()
    req = urllib.request.Request(
        f"{BASE}/{path}", data=data, method="POST",
        headers={
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
            "Accept": "application/json",
            "Origin": "https://www.temposoul.com",
            "Referer": "https://www.temposoul.com/",
        })
    t0 = time.time()
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            r.read()
            return r.status, int((time.time() - t0) * 1000), ""
    except urllib.error.HTTPError as e:
        body = e.read()[:80].decode("utf-8", "replace")
        return e.code, int((time.time() - t0) * 1000), body
    except Exception as e:  # noqa: BLE001
        return -1, int((time.time() - t0) * 1000), str(e)[:80]


def p(gender, year, month, day, hour, minute, place, lon, **kw):
    d = dict(gender=gender, year=year, month=month, day=day, dateType="solar",
             birthHour=hour, birthMinute=minute, birthPlace=place,
             birthLongitude=lon, timezone=8, useTrueSolarTime=True)
    d.update(kw)
    return d


CASES = [
    ("01_normal", p("male", 1990, 6, 15, 10, 30, "北京", 116.407)),
    ("02_early_zi", p("female", 1988, 3, 8, 0, 30, "上海", 121.473)),
    ("03_late_zi", p("male", 1995, 11, 22, 23, 45, "广州", 113.264)),
    ("04_lichun", p("female", 1992, 2, 4, 21, 30, "成都", 104.066)),
    ("05_dongzhi", p("male", 2000, 12, 21, 8, 15, "哈尔滨", 126.534)),
    ("06_dst", p("female", 1987, 6, 15, 14, 20, "西安", 108.940)),
    ("07_leap", p("male", 1984, 2, 29, 16, 40, "武汉", 114.305)),
    ("08_urumqi", p("female", 1993, 8, 8, 12, 0, "乌鲁木齐", 87.617)),
    ("09_newyork", p("male", 1991, 7, 4, 9, 15, "New York", -74.006,
                     timeZoneId="America/New_York")),
    ("10_lunar_leap", dict(gender="female", year=1987, month=7, day=30,
                           dateType="lunar", isLeapMonth=True, birthHour=6,
                           birthMinute=0, birthPlace="北京",
                           birthLongitude=116.407, timezone=8,
                           useTrueSolarTime=True)),
]

# 重点端点：ziwei(已知重) + qimen/liuren(全量计算) + qizheng(星历) + bazi(对照)
ENDPOINTS = [
    "ziwei/calculate",
    "divination/qimen",
    "divination/liuren",
    "metaphysics/qizheng/calculate",
    "bazi/calculate",
]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("base", nargs="?", default="https://www.temposoul.com/api/v1")
    parser.add_argument("--rounds", type=int, default=1)
    parser.add_argument("--endpoints", default="")
    args = parser.parse_args()
    global BASE
    BASE = args.base
    endpoints = [e for e in args.endpoints.split(",") if e] or ENDPOINTS

    runs = []
    for round_no in range(1, args.rounds + 1):
        print(f"===== ROUND {round_no}/{args.rounds} =====", flush=True)
        for ep in endpoints:
            for cid, payload in CASES:
                for attempt in (1, 2):
                    code, ms, body = post(ep, payload)
                    rec = {"round": round_no, "ep": ep, "case": cid, "try": attempt,
                           "http": code, "ms": ms}
                    if body:
                        rec["body"] = body
                    runs.append(rec)
                    print(rec, flush=True)
                    time.sleep(0.3)
    total = len(runs)
    ok = sum(1 for r in runs if r["http"] == 200)
    err5xx = [r for r in runs if 500 <= r["http"] < 600]
    print(f"TOTAL {ok}/{total} 200rate={ok/total:.0%} 5xx={len(err5xx)}")
    verdict = "PASS" if not err5xx else "FAIL"
    print(f"VERDICT {verdict}  （判据：5xx=0；1102 body 特征：'error code: 1102'）")
    if err5xx:
        seen = {}
        for r in err5xx:
            key = (r["ep"], r["http"])
            seen[key] = seen.get(key, 0) + 1
        for (ep, code), n in sorted(seen.items()):
            print(f"  {ep} http={code} x{n}")
    prev = {"runs": []}
    if os.path.exists(OUT):
        try:
            prev = json.load(open(OUT, encoding="utf-8"))
        except Exception:
            prev = {"runs": []}
    json.dump({"ts": time.strftime("%Y-%m-%d %H:%M:%S"), "base": BASE,
               "rounds": args.rounds,
               "verdict": verdict,
               "runs": prev.get("runs", []) + runs},
              open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("saved ->", OUT)


if __name__ == "__main__":
    main()
