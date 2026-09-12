# -*- coding: utf-8 -*-
"""构建 7lang-terms.csv（T3·S3 一期）。
输入：src/data/lexicon.ts + lexicon-extra.ts（1180 条词源）+ tier1_core.py（一期译名）
输出：output/terms/7lang-terms.csv（UTF-8 with BOM，Excel 可直开）+ 终端统计
archetype_key 为 PROPOSED-v1 命名（待 T2 对齐），生成规则：{域}_{无声调拼音连写}，重复加序号。"""
import csv
import os
import re
import sys
import unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from tier1_core import T1  # noqa: E402

REPO = r'E:/KnowledgeOS/项目库/TempoSoul 命律 网站建设系统'
LEX_FILES = [REPO + '/src/data/lexicon.ts', REPO + '/src/data/lexicon-extra.ts']
OUT_CSV = os.path.join(HERE, '7lang-terms.csv')

# 体系:实体类型 映射（对齐 T4 shared/术语键格式.md v1：<体系>:<实体类型>:<实体名> 蛇形）
SYSTEM_MAP = {
    '天干': ('bazi', 'stem'), '地支': ('bazi', 'branch'), '生肖': ('bazi', 'zodiac'),
    '五行': ('bazi', 'wuxing'), '阴阳': ('common', 'yinyang'), '十神': ('bazi', 'shishen'),
    '四柱': ('bazi', 'pillar'), '神煞': ('bazi', 'shensha'), '节气': ('calendar', 'jieqi'),
    '八卦': ('yijing', 'bagua'), '六十四卦': ('yijing', 'gua'), '十二长生': ('bazi', 'changsheng'),
    '十二宫': ('ziwei', 'palace'), '紫微主星': ('ziwei', 'star'), '紫微星曜': ('ziwei', 'star'),
    '星曜': ('ziwei', 'star'), '紫微四化': ('ziwei', 'sihua'), '紫微格局': ('ziwei', 'geju'),
    '六爻': ('liuyao', 'liuqin'), '六兽': ('liuyao', 'liushen'), '六神': ('liuyao', 'liushen'),
    '梅花易数': ('yijing', 'meihua'), '纳音': ('bazi', 'nayin'), '二十八宿': ('astrology', 'xiu28'),
    '九宫': ('fengshui', 'jiugong'), '奇门遁甲': ('qimen', 'term'), '大六壬': ('liuren', 'term'),
    '六壬': ('liuren', 'term'), '风水': ('fengshui', 'term'), '择日': ('calendar', 'zeri'),
    '三元九运': ('fengshui', 'sanyuan'), '二十四山': ('fengshui', 'shan24'), '河洛': ('yijing', 'heluo'),
    '七政四余': ('astrology', 'qizheng'), '三才四象': ('common', 'sancai'),
    '命理流派': ('common', 'school'), '推命体系': ('common', 'school'), '八字格局': ('bazi', 'geju'),
    '十干禄': ('bazi', 'shiganlu'), '地支关系': ('bazi', 'branch_rel'), '干支组合': ('bazi', 'jiazi'),
    '十二消息卦': ('yijing', 'gua'), '基础': ('common', 'term'), '命理典籍': ('common', 'classic'),
    '三合三会': ('bazi', 'sanhe'), '天干五合': ('bazi', 'ganhe'), '北斗七星': ('astrology', 'beidou'),
    '身宫': ('ziwei', 'palace'),
}
# 补录词条（lexicon 缺类）的 键 slug 定制（避免无 pinyin 落到占位符）
SUPP = {
    '鼠': ('bazi', 'zodiac', 'shu'), '牛': ('bazi', 'zodiac', 'niu'), '虎': ('bazi', 'zodiac', 'hu'),
    '兔': ('bazi', 'zodiac', 'tu'), '龙': ('bazi', 'zodiac', 'long'), '蛇': ('bazi', 'zodiac', 'she'),
    '马': ('bazi', 'zodiac', 'ma'), '羊': ('bazi', 'zodiac', 'yang'), '猴': ('bazi', 'zodiac', 'hou'),
    '鸡': ('bazi', 'zodiac', 'ji'), '狗': ('bazi', 'zodiac', 'gou'), '猪': ('bazi', 'zodiac', 'zhu'),
    '阴': ('common', 'yinyang', 'yin'), '阳': ('common', 'yinyang', 'yang'),
    '本命': ('common', 'term', 'ben_ming'), '禄神': ('bazi', 'shensha', 'lu_shen'),
    '父母': ('liuyao', 'liuqin', 'fu_mu'), '兄弟': ('liuyao', 'liuqin', 'xiong_di'),
    '子孙': ('liuyao', 'liuqin', 'zi_sun'), '妻财': ('liuyao', 'liuqin', 'qi_cai'),
    '官鬼': ('liuyao', 'liuqin', 'guan_gui'),
}


def snake(p):
    t = unicodedata.normalize('NFD', p)
    t = ''.join(c for c in t if not unicodedata.combining(c))
    t = re.sub(r'[^a-zA-Z ]', '', t).strip().lower()
    return re.sub(r'\s+', '_', t)


# lexicon 实际命名 → tier1 键 的别名映射（依据 _dump_categories.py 实测）
ALIAS = {
    '乾为天': '乾卦', '坤为地': '坤卦', '水雷屯': '屯卦', '山水蒙': '蒙卦', '水天需': '需卦',
    '天水讼': '讼卦', '地水师': '师卦', '水地比': '比卦', '风天小畜': '小畜卦', '天泽履': '履卦',
    '地天泰': '泰卦', '天地否': '否卦', '天火同人': '同人卦', '火天大有': '大有卦',
    '地山谦': '谦卦', '雷地豫': '豫卦', '泽雷随': '随卦', '山风蛊': '蛊卦', '地泽临': '临卦',
    '风地观': '观卦', '火雷噬嗑': '噬嗑卦', '山火贲': '贲卦', '山地剥': '剥卦', '地雷复': '复卦',
    '天雷无妄': '无妄卦', '山天大畜': '大畜卦', '山雷颐': '颐卦', '泽风大过': '大过卦',
    '坎为水': '坎卦', '离为火': '离卦', '泽山咸': '咸卦', '雷风恒': '恒卦', '天山遁': '遁卦',
    '雷天大壮': '大壮卦', '火地晋': '晋卦', '地火明夷': '明夷卦', '风火家人': '家人卦',
    '火泽睽': '睽卦', '水山蹇': '蹇卦', '雷水解': '解卦', '山泽损': '损卦', '风雷益': '益卦',
    '泽天夬': '夬卦', '天风姤': '姤卦', '泽地萃': '萃卦', '地风升': '升卦', '泽水困': '困卦',
    '水风井': '井卦', '泽火革': '革卦', '火风鼎': '鼎卦', '震为雷': '震卦', '艮为山': '艮卦',
    '风山渐': '渐卦', '雷泽归妹': '归妹卦', '雷火丰': '丰卦', '火山旅': '旅卦', '巽为风': '巽卦',
    '兑为泽': '兑卦', '风水涣': '涣卦', '水泽节': '节卦', '风泽中孚': '中孚卦',
    '雷山小过': '小过卦', '水火既济': '既济卦', '火水未济': '未济卦',
    '天德': '天德贵人', '月德': '月德贵人', '魁罡格': '魁罡', '螣蛇': '腾蛇',
}
STEMS = '甲乙丙丁戊己庚辛壬癸'
BRANCHES = '子丑寅卯辰巳午未申酉戌亥'


def parse_lexicon():
    pat = re.compile(r"term:\s*'([^']+)'\s*,\s*pinyin:\s*'([^']*)'\s*,\s*category:\s*'([^']+)'")
    seen, entries = set(), []
    for f in LEX_FILES:
        src = open(f, encoding='utf-8').read()
        for m in pat.finditer(src):
            term, pinyin, cat = m.group(1), m.group(2).strip(), m.group(3)
            k = (term, cat)
            if k in seen:
                continue
            seen.add(k)
            entries.append({'zh': term, 'pinyin': pinyin, 'category': cat})
    return entries


def main():
    entries = parse_lexicon()
    print('parsed_entries=', len(entries))

    used_keys, rows = set(), []
    t1_matched = set()
    for e in entries:
        zh, pinyin, cat = e['zh'], e['pinyin'], e['category']
        t1key = ALIAS.get(zh, zh)
        if t1key in T1:
            t1_matched.add(t1key)
            vals, status, basis = T1[t1key], 'tier1_filled', \
                'Sino-xenic 定读(ja/ko/vi)+pinyin 通行(en/es)+th 音译或意译；待母语复核'
        elif (cat == '干支组合' and len(zh) == 2 and zh[0] in STEMS and zh[1] in BRANCHES):
            s, b = T1[zh[0]], T1[zh[1]]
            vals = ('%s %s' % (s[0], b[0]), '%s %s' % (s[1], b[1]), '%s%s' % (s[2], b[2]),
                    '%s%s' % (s[3], b[3]), '%s%s' % (s[4], b[4]), '%s %s' % (s[5], b[5]))
            status, basis = 'tier1_filled', '干支组合=天干+地支译名按位组合（构成式，确定性）'
        else:
            vals, status, basis = ('—',) * 6, 'tier2_pending', ''
        if status == 'tier1_filled' and any(v == '—' for v in vals):
            status = 'tier1_partial'  # 个别语言无通行译法（如 64 卦 th），该语言不进门禁断言集
        sysname, typ = SYSTEM_MAP.get(cat, ('common', 'term'))
        slug = snake(pinyin) or ('t%d' % (len(rows) + 1))
        key = '%s:%s:%s' % (sysname, typ, slug)
        n = 2
        while key in used_keys:
            key = '%s:%s:%s_%d' % (sysname, typ, slug, n)
            n += 1
        used_keys.add(key)
        rows.append([key, zh, pinyin, cat, *vals, basis, status])

    # tier1 中未在 lexicon 命中的词条 → 补充行（保证确定性 L0 全集入表）
    supplement = [t for t in T1 if t not in t1_matched]
    for t in sorted(supplement):
        vals = T1[t]
        sysname, typ, slug = SUPP.get(t, ('common', 'term', 'supp%d' % (len(rows) + 1)))
        key = '%s:%s:%s' % (sysname, typ, slug)
        rows.append([key, t, '', '__补充未入lexicon__', *vals,
                     '同 tier1 依据；缺 pinyin 待补', 'tier1_supplement'])

    with open(OUT_CSV, 'w', newline='', encoding='utf-8-sig') as f:
        w = csv.writer(f)
        w.writerow(['archetype_key', 'zh', 'pinyin', 'category',
                    'en', 'es', 'ja', 'ko', 'th', 'vi', 'basis', 'status'])
        w.writerows(rows)

    # 统计
    t1_rows = [r for r in rows if r[-1].startswith('tier1')]
    print('total_rows=', len(rows), 'tier1=', len(t1_rows),
          'tier2_pending=', len(rows) - len(t1_rows), 'supplement=', len(supplement))
    print('tier1_unmatched_in_lexicon=', supplement if supplement else '无（全部命中）')
    bycat = {}
    for r in rows:
        bycat.setdefault(r[3], [0, 0])
        bycat[r[3]][0] += 1
        if r[-1].startswith('tier1'):
            bycat[r[3]][1] += 1
    print('category_coverage(total,tier1):')
    for c in sorted(bycat, key=lambda x: -bycat[x][0]):
        print('  %s: %d/%d' % (c, bycat[c][1], bycat[c][0]))
    # 关键集合完整性检查
    for name, terms in [('64卦', [t for t in T1 if t.endswith('卦') and len(t) > 1]),
                        ('节气', [t for t in T1 if t in ('立春', '冬至', '大寒')])]:
        hit = sum(1 for t in terms if t in t1_matched)
        print('setcheck %s: %d/%d matched' % (name, hit, len(terms)))
    print('CSV_WRITTEN=', OUT_CSV)


if __name__ == '__main__':
    main()
