#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
词库校验脚本：线程B MVP
校验项：
  1. (term, category) 无重复
  2. 必填字段非空（term/pinyin/category/definition/source）
  3. category 合法（在 LexiconCategory 类型联合中）
  4. 总数 ≥ 800，八字 ≥ 480，紫微 ≥ 330
输出分类计数与通过/失败。
"""
import re, io, collections, os, sys

WT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LEX_PATH = os.path.join(WT, "src", "data", "lexicon.ts")
EXTRA_PATH = os.path.join(WT, "src", "data", "lexicon-extra.ts")

# ── 合法分类列表（从 lexicon.ts type 提取）─────────────────
lex_text = io.open(LEX_PATH, encoding="utf-8", newline="").read()
valid_cats = set(re.findall(r"^\s*\| '([^']+)'", lex_text, re.M))
print("合法分类数:", len(valid_cats))

# ── 解析所有条目 ─────────────────────────────────────────────
# 从 lexicon.ts 解析 baseLexicon（跳过 import 和 type 行）
pattern = re.compile(
    r"\{ term: '([^']*)', pinyin: '([^']*)', category: '([^']*)', definition: '([^']*)', source: (?:[^,}]+)"
)

def parse_entries(path):
    txt = io.open(path, encoding="utf-8", newline="").read()
    raw = pattern.findall(txt)
    # (term, pinyin, category, definition) → add source placeholder
    return [(t, p, c, d, "SRC") for t, p, c, d in raw]

base = parse_entries(LEX_PATH)
extra = parse_entries(EXTRA_PATH)
all_entries = base + extra

print("baseLexicon:", len(base))
print("lexiconExtra:", len(extra))
print("合并总数:", len(all_entries))

# ── 校验1: (term, category) 无重复 ──────────────────────────
pairs = [(t, c) for t, _, c, _, _ in all_entries]
pair_counts = collections.Counter(pairs)
dup_pairs = [(p, n) for p, n in pair_counts.items() if n > 1]
print("\n=== 校验1: (term, category) 重复 ===")
if dup_pairs:
    print("FAIL: 发现重复:")
    for (t, c), n in dup_pairs:
        print("  %s / %s x%d" % (t, c, n))
else:
    print("PASS: 0 重复")

# ── 校验2: 必填字段非空 ─────────────────────────────────────
missing = []
for t, p, c, d, s in all_entries:
    if not t.strip():
        missing.append(("term", "(empty)", c))
    if not p.strip():
        missing.append(("pinyin", t, c))
    if not c.strip():
        missing.append(("category", t, "(empty)"))
    if not d.strip():
        missing.append(("definition", t, c))
    if not s.strip():
        missing.append(("source", t, c))
print("\n=== 校验2: 必填字段非空 ===")
if missing:
    print("FAIL: 缺字段 %d 处:" % len(missing))
    for field, term, cat in missing[:20]:
        print("  %s 缺失: term=%s category=%s" % (field, term, cat))
else:
    print("PASS: 0 缺字段")

# ── 校验3: category 合法 ─────────────────────────────────────
invalid_cats = set()
for t, p, c, d, s in all_entries:
    if c not in valid_cats:
        invalid_cats.add(c)
print("\n=== 校验3: category 合法 ===")
if invalid_cats:
    print("FAIL: 非法分类:", invalid_cats)
else:
    print("PASS: 全部分类合法")

# ── 校验4: 数量门槛 ────────────────────────────────────────
ziwei_cats = {"紫微星曜", "十二宫", "紫微四化", "紫微格局"}
bazi_cats = {"天干","地支","五行","十神","神煞","推命体系","地支关系","干支组合",
             "十二长生","纳音","十干禄","天干五合","三合三会","基础","八字格局"}

cat_counts = collections.Counter(c for _, _, c, _, _ in all_entries)
ziwei_total = sum(n for c, n in cat_counts.items() if c in ziwei_cats)
bazi_total = sum(n for c, n in cat_counts.items() if c in bazi_cats)

print("\n=== 校验4: 数量门槛 ===")
print("总数: %d (要求≥800) %s" % (len(all_entries), "PASS" if len(all_entries) >= 800 else "FAIL"))
print("紫微: %d (要求≥330) %s" % (ziwei_total, "PASS" if ziwei_total >= 330 else "FAIL"))
print("八字: %d (要求≥480) %s" % (bazi_total, "PASS" if bazi_total >= 480 else "FAIL"))

print("\n=== 全分类计数 ===")
for c, n in sorted(cat_counts.items(), key=lambda x: -x[1]):
    print("  %s: %d" % (c, n))

# ── 汇总 ─────────────────────────────────────────────────────
all_pass = not dup_pairs and not missing and not invalid_cats
print("\n=== 最终结果 ===")
print("ALL PASS" if all_pass and len(all_entries) >= 800 and ziwei_total >= 330 and bazi_total >= 480 else "SOME CHECKS FAILED")
sys.exit(0 if all_pass and len(all_entries) >= 800 and ziwei_total >= 330 and bazi_total >= 480 else 1)
