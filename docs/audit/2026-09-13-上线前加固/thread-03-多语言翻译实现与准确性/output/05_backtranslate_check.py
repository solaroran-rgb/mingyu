# -*- coding: utf-8 -*-
"""05_backtranslate_check.py —— T3·S5 回译一致率校验脚本（口径 G3 的工具实现）。

两种模式：
  --dry-run            术语表确定性完整性检查（不调 LLM）：tier1 空格/键格式/跨语言撞车
  默认                  分层抽样 tier1 术语 → X→zh 回译（LLM）→ 统计一致率

环境变量：
  T3_LLM_BASE_URL  默认 http://127.0.0.1:8080/v1（本地 Qwen3.8-27B）；可指向任意 OpenAI 兼容端点
  T3_LLM_MODEL     默认 Qwen3.8-27B-UD-VLM
  T3_LLM_API_KEY   可选

另导出 extract_invariants(text)：供 CI 对 L1/L3/L5 真实译文做数值/干支/术语保持性断言（口径 G3 对齐项）。

诚实边界：回译一致率 ≥98% 的验收对象是 M1–M3 管线产物（整段文案），本脚本当前对术语抽样做
机制试运行，其结果标注为试运行数据，不得当作验收数据。
"""
import argparse
import csv
import io
import json
import os
import re
import sys
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(HERE, 'terms', '7lang-terms.csv')
LANGS = {'en': '英语', 'es-ES': '西班牙语', 'ja': '日语', 'ko-KN': '韩语',
         'th-TH': '泰语', 'vi-VN': '越南语'}
COL = {'en': 'en', 'es-ES': 'es', 'ja': 'ja', 'ko-KN': 'ko', 'th-TH': 'th', 'vi-VN': 'vi'}
KEY_RE = re.compile(r'^[a-z]+:[a-z0-9_]+:[a-z0-9_]+$')

STEMS = '甲乙丙丁戊己庚辛壬癸'
BRANCHES = '子丑寅卯辰巳午未申酉戌亥'
NUM_RE = re.compile(r'\d+(?:\.\d+)?')
GANZHI_RE = re.compile(r'([' + STEMS + r'][' + BRANCHES + r'])')


def load_terms():
    rows = list(csv.DictReader(io.open(CSV_PATH, encoding='utf-8-sig')))
    tier1 = [r for r in rows if r['status'].startswith('tier1')]
    return rows, tier1


def extract_invariants(text):
    """从文案中提取必须跨语言保持的不变量：数值、干支组合、archetype 键槽位。"""
    return {
        'numbers': sorted(NUM_RE.findall(text)),
        'ganzhi': sorted(set(GANZHI_RE.findall(text))),
    }


def invariants_preserved(src, tgt):
    a, b = extract_invariants(src), extract_invariants(tgt)
    return a['numbers'] == b['numbers'] and set(a['ganzhi']) <= set(b['ganzhi'])


def stratified(tier1, per_lang):
    """按 archetype_key 实体类型分层抽样（确定性）。"""
    quotas = [('stem', 1), ('branch', 1), ('zodiac', 1), ('wuxing', 1), ('shishen', 1),
              ('star', 2), ('palace', 1), ('gua', 2), ('jieqi', 1), ('shensha', 2),
              ('jiazi', 1), ('changsheng', 1), ('bagua', 1), ('liuqin', 1), ('sihua', 1),
              ('yinyang', 1), ('term', 1)]
    picked, used = [], set()
    for typ, n in quotas:
        cand = [r for r in tier1 if (':%s:' % typ) in r['archetype_key'] and r['zh'] not in used]
        for r in cand[:n]:
            picked.append(r)
            used.add(r['zh'])
    return picked[:per_lang] if per_lang else picked


def llm(base, model, key, prompt, timeout=90):
    body = json.dumps({
        'model': model, 'temperature': 0, 'max_tokens': 1024, 'stream': False,
        # Qwen3 关闭思考模式（llamacpp 支持；其他后端会忽略该字段）
        'chat_template_kwargs': {'enable_thinking': False},
        'messages': [{'role': 'user', 'content': prompt}],
    }).encode('utf-8')
    req = urllib.request.Request(base.rstrip('/') + '/chat/completions', data=body,
                                 headers={'Content-Type': 'application/json',
                                          **({'Authorization': 'Bearer ' + key} if key else {})})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        data = json.loads(resp.read().decode('utf-8'))
    msg = data['choices'][0]['message']
    out = msg.get('content') or msg.get('reasoning_content') or ''
    # 思考模式兜底：剥掉 <think>…</think>，取其后的正文；无正文则取思考文本的最后一个非空行
    out = re.sub(r'<think>.*?</think>', '', out, flags=re.S).strip()
    if not out and msg.get('reasoning_content'):
        lines = [l.strip() for l in msg['reasoning_content'].splitlines() if l.strip()]
        out = lines[-1] if lines else ''
    return out.strip()


def backtranslate_check(sample, langs, base, model, key):
    results = []
    for lang in langs:
        for r in sample:
            trans = r[COL[lang]]
            if not trans or trans == '—':
                continue
            prompt = ('将下面的%s命理术语翻译回中文术语。只输出中文术语本身，不要解释、不要拼音。\n\n'
                      '%s术语：%s\n所属分类：%s') % (LANGS[lang], LANGS[lang], trans, r['category'])
            try:
                back = llm(base, model, key, prompt)
            except Exception as e:
                results.append({'lang': lang, 'zh': r['zh'], 'trans': trans,
                                'back': None, 'match': 'error', 'detail': str(e)[:80]})
                continue
            back_clean = re.sub(r'\s', '', back)
            zh_clean = re.sub(r'\s', '', r['zh'])
            if back_clean == zh_clean:
                match = 'exact'
            elif back_clean and (back_clean in zh_clean or zh_clean in back_clean):
                match = 'near'
            else:
                match = 'miss'
            results.append({'lang': lang, 'zh': r['zh'], 'trans': trans,
                            'back': back, 'match': match, 'key': r['archetype_key']})
            print('  [%s] %s %s -> %s (%s)' % (lang, trans, r['zh'], back, match))
    return results


def dryrun(rows, tier1):
    problems = []
    for r in tier1:
        if not KEY_RE.match(r['archetype_key']):
            problems.append('键格式异常: %s (%s)' % (r['archetype_key'], r['zh']))
        partial = r['status'] == 'tier1_partial'
        for lang in LANGS:
            if not r[COL[lang]] or r[COL[lang]] == '—':
                tag = '待定' if partial else '硬伤'
                problems.append('%s: %s %s' % (tag, r['zh'], lang))
    # 跨语言撞车：同一语言同一译文对应多个 zh（同 category 内允许同义，跨 category 报警）
    for lang in LANGS:
        seen = {}
        for r in rows:
            v = r[COL[lang]]
            if v and v != '—':
                seen.setdefault(v, set()).add(r['zh'])
        for v, zhs in seen.items():
            if len(zhs) > 1:
                problems.append('撞车 %s: %s <- %s' % (lang, v, '、'.join(sorted(zhs))[:60]))
    return problems


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--dry-run', action='store_true')
    ap.add_argument('--langs', default=','.join(LANGS))
    ap.add_argument('--per-lang', type=int, default=0, help='每语言抽样上限；0=全部配额(约20)')
    args = ap.parse_args()

    sys.stdout.reconfigure(encoding='utf-8')
    rows, tier1 = load_terms()
    print('rows=%d tier1=%d' % (len(rows), len(tier1)))

    if args.dry_run:
        problems = dryrun(rows, tier1)
        real = [p for p in problems if not p.startswith('撞车') and not p.startswith('待定')]
        clash = [p for p in problems if p.startswith('撞车')]
        pend = [p for p in problems if p.startswith('待定')]
        print('DRYRUN 硬伤=%d 撞车预警=%d 已知待定=%d' % (len(real), len(clash), len(pend)))
        for p in real[:20]:
            print('  [硬伤]', p)
        for p in pend[:8]:
            print('  [待定]', p)
        for p in clash[:10]:
            print('  [撞车]', p)
        return

    langs = [l for l in args.langs.split(',') if l in LANGS]
    sample = stratified(tier1, args.per_lang)
    base = os.environ.get('T3_LLM_BASE_URL', 'http://127.0.0.1:8080/v1')
    model = os.environ.get('T3_LLM_MODEL', 'Qwen3.8-27B-UD-VLM')
    key = os.environ.get('T3_LLM_API_KEY', '')
    print('endpoint=%s model=%s langs=%s sample=%d' % (base, model, langs, len(sample)))
    results = backtranslate_check(sample, langs, base, model, key)

    out_json = os.path.join(HERE, 'terms', '_backtranslate_results.json')
    json.dump({'endpoint': base, 'model': model, 'results': results},
              io.open(out_json, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('=== 试运行结果（机制验证，非验收数据） ===')
    for lang in langs:
        rs = [r for r in results if r['lang'] == lang]
        if not rs:
            continue
        ex = sum(1 for r in rs if r['match'] == 'exact')
        nr = sum(1 for r in rs if r['match'] == 'near')
        er = sum(1 for r in rs if r['match'] == 'error')
        print('%s: n=%d exact=%d near=%d miss=%d error=%d' %
              (lang, len(rs), ex, nr, rs and (len(rs) - ex - nr - er), er))
        for r in rs:
            if r['match'] in ('miss', 'error'):
                print('   [%s] %s (%s) -> %s | %s' % (r['match'], r['trans'], r['zh'], r['back'], r.get('detail', '')))
    print('results_json=', out_json)


if __name__ == '__main__':
    main()
