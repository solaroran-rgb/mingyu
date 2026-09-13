# -*- coding: utf-8 -*-
"""诊断 _更新日志.md 及其两个备份的编码构成。只读，不改文件。"""
import re

BASE = r'E:/KnowledgeOS/AI地图/'
FILES = [BASE + '_更新日志.md.bak_20260913_t3s1',
         BASE + '_更新日志.md.bak_20260913_round2',
         BASE + '_更新日志.md']

for path in FILES:
    raw = open(path, 'rb').read()
    zeros = [i for i, b in enumerate(raw) if b == 0]
    print('==', path.split('/')[-1], 'size=', len(raw),
          'zeros=', len(zeros), 'first_zero=', zeros[:3],
          'last_zero=', zeros[-3:] if zeros else None)
    print('   head24=', repr(raw[:24]))
    print('   tail24=', repr(raw[-24:]))
    for enc in ('utf-16-le', 'utf-8', 'gbk'):
        try:
            t = raw.decode(enc)
            cjk = sum(1 for c in t if '\u4e00' <= c <= '\u9fff')
            print('   decode', enc, 'OK chars=', len(t), 'cjk=', cjk)
        except Exception as e:
            print('   decode', enc, 'FAIL', str(e)[:70])

raw = open(BASE + '_更新日志.md.bak_20260913_t3s1', 'rb').read()
print('\n-- 换行风格事件分布（t3s1）--')
events = [(m.start(), 'u16' if m.group() == b'\r\x00\n\x00' else 'u8')
          for m in re.finditer(rb'\r\x00\n\x00|\r\n', raw)]
print('total_events=', len(events), 'u16=', sum(1 for _, k in events if k == 'u16'),
      'u8=', sum(1 for _, k in events if k == 'u8'))
# 压缩输出：连续同型区段
runs = []
for pos, kind in events:
    if runs and runs[-1][2] == kind:
        runs[-1][1] = pos
    else:
        runs.append([pos, pos, kind])
print('runs(连续同型):', [(a, b, k) for a, b, k in runs][:40])
print('hex@1180-1320:', raw[1180:1320].hex(' '))
