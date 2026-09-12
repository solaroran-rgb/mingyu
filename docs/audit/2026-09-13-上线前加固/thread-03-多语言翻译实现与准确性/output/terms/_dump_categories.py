# -*- coding: utf-8 -*-
"""Dump lexicon 各 category 的实际词条名，用于建立 tier1 别名映射。只读。"""
import re

REPO = r'E:/KnowledgeOS/项目库/TempoSoul 命律 网站建设系统'
pat = re.compile(r"term:\s*'([^']+)'\s*,\s*pinyin:\s*'([^']*)'\s*,\s*category:\s*'([^']+)'")
bycat = {}
for f in [REPO + '/src/data/lexicon.ts', REPO + '/src/data/lexicon-extra.ts']:
    for m in pat.finditer(open(f, encoding='utf-8').read()):
        bycat.setdefault(m.group(3), []).append(m.group(1))

for cat in ['生肖', '基础', '六十四卦', '十二消息卦', '十神', '五行', '神煞', '六兽', '六爻',
            '十二宫', '紫微星曜', '八卦', '节气', '十二长生', '干支组合']:
    terms = bycat.get(cat, [])
    print('== %s (%d): %s' % (cat, len(terms), '、'.join(terms[:70])))
