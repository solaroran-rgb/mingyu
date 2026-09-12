# -*- coding: utf-8 -*-
"""抽样校验 7lang-terms.csv 关键行。"""
import csv
import io
import sys

sys.stdout.reconfigure(encoding='utf-8')
P = (r'E:/KnowledgeOS/项目库/TempoSoul 命律 网站建设系统/docs/audit/'
     r'2026-09-13-上线前加固/thread-03-多语言翻译实现与准确性/output/terms/7lang-terms.csv')
rows = list(csv.DictReader(io.open(P, encoding='utf-8-sig')))
print('rows=', len(rows))
want = ['乾为天', '甲子', '兔', '立春', '天乙贵人', '七杀', '命宫', '己亥']
for zh in want:
    hit = [r for r in rows if r['zh'] == zh]
    for r in hit[:2]:
        print(r['zh'], '|', r['archetype_key'], '|', r['en'], '|', r['ja'], '|',
              r['ko'], '|', r['th'], '|', r['vi'], '|', r['status'])
    if not hit:
        print(zh, 'MISSING')
# 状态计数核对
from collections import Counter
print(Counter(r['status'] for r in rows))
