# -*- coding: utf-8 -*-
"""生成 06_母语复核表.md：术语分层抽样 × 6 语言复核表（Part B）。
Part A（UI 76 条）不重复收录，指向既有清单文件。确定性抽样，可重跑。"""
import csv
import io
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
HERE = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(HERE, 'terms', '7lang-terms.csv')
OUT = os.path.join(HERE, '06_母语复核表.md')

QUOTAS = [('stem', 2), ('branch', 2), ('zodiac', 2), ('wuxing', 2), ('shishen', 4),
          ('pillar', 2), ('jiazi', 3), ('changsheng', 3), ('shensha', 6), ('star', 8),
          ('palace', 4), ('sihua', 2), ('bagua', 2), ('gua', 4), ('jieqi', 3),
          ('term', 3), ('yinyang', 2), ('liuqin', 2), ('school', 1)]
LANGS = [('en', 'English'), ('es-ES', 'Español'), ('ja', '日本語'),
         ('ko-KN', '한국어'), ('th-TH', 'ไทย'), ('vi-VN', 'Tiếng Việt')]
COL = {'en': 'en', 'es-ES': 'es', 'ja': 'ja', 'ko-KN': 'ko', 'th-TH': 'th', 'vi-VN': 'vi'}


def stratified(tier1):
    picked, used = [], set()
    for typ, n in QUOTAS:
        cand = sorted([r for r in tier1
                       if (':%s:' % typ) in r['archetype_key'] and r['zh'] not in used],
                      key=lambda r: r['archetype_key'])
        for r in cand[:n]:
            picked.append(r)
            used.add(r['zh'])
    return picked


rows = list(csv.DictReader(io.open(CSV_PATH, encoding='utf-8-sig')))
tier1 = [r for r in rows if r['status'].startswith('tier1')]
sample = stratified(tier1)

L = []
L.append('# 06 · 母语复核表（T3·S5）\n')
L.append('> 生成：2026-09-13 ｜ 生成脚本：`_gen_review_pack.py`（确定性，可重跑）')
L.append('> 抽样：术语表 tier1 分层抽样 **%d 条**（配额见文末），逐语言复核' % len(sample))
L.append('')
L.append('## 使用说明（复核人必读）\n')
L.append('1. **复核范围**：本表为 Part B（排盘术语译文）。Part A（UI 静态词条 76 条）')
L.append('   直接使用既有清单：`docs/i18n/2026-09-12-native-review-checklist.md`（格式已备好，勿改结构）。')
L.append('2. **硬伤定义**（来自《02_准确性口径定义.md》，任一即判 FAIL，逐条注明）：')
L.append('   - 吉凶方向反转；恐吓化/夸大灾祸；')
L.append('   - 医疗、法律、财务的越界断言；')
L.append('   - 数值/干支/星曜/卦名改变；典故张冠李戴；')
L.append('   - 术语错译（如西方占星词冒充东方术语：metaphysics/synastry 类错误）。')
L.append('3. **填写方式**：每行在「问题」写现象（无问题留空），「修改建议」给出首选译法，')
L.append('   「结论」三选一：`采用现译` / `建议改译` / `保留原文`。')
L.append('4. **优先级**：先扫「结论=建议改译」，再补全空行；单语言预计 30–45 分钟。')
L.append('5. 品牌名「命律 / TempoSoul」不译；拼音类译名（Jia/Ziwei 等）如所在语言有更通行惯例，请给建议。')
L.append('')
for code, name in LANGS:
    L.append('## Part B · %s（%s）\n' % (name, code))
    L.append('| # | 中文源术语 | pinyin | archetype_key | %s 译文 | 问题 | 修改建议 | 结论 |' % name)
    L.append('|---|---|---|---|---|---|---|---|')
    for i, r in enumerate(sample, 1):
        val = r[COL[code]] if r[COL[code]] and r[COL[code]] != '—' else '（本语言待定，跳过本行）'
        L.append('| %d | %s | %s | `%s` | %s |  |  |  |' %
                 (i, r['zh'], r['pinyin'], r['archetype_key'], val))
    L.append('')
L.append('## 附：抽样配额（分层，确定性）\n')
L.append('| 实体类型 | 配额 | 实体类型 | 配额 |')
L.append('|---|---|---|---|')
qs = QUOTAS
for i in range(0, len(qs), 2):
    a = qs[i]
    b = qs[i + 1] if i + 1 < len(qs) else ('', '')
    L.append('| %s | %d | %s | %s |' % (a[0], a[1], b[0], b[1] if b else ''))
L.append('')
L.append('> 已知待定（不在抽样内，勿报错）：64 卦/十二消息卦共 76 条 th 无通行音译，显式待定；')
L.append('> vi 兔=Mèo、牛=Trâu 为越南生肖本地适配，请母语者确认此策略。')

io.open(OUT, 'w', encoding='utf-8').write('\n'.join(L) + '\n')
print('WRITTEN', OUT, 'sample=', len(sample))
