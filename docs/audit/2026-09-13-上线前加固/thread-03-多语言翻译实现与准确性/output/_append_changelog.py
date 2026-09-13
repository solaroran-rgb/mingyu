# -*- coding: utf-8 -*-
"""精确扫描 UTF-8 尾段的坏点并修复重写 _更新日志.md。
文件真实结构（t3s1 备份证实）：raw[:1246] = UTF-16LE 单行；raw[1246:] = 历次 UTF-8 追加（含未知坏点）。
策略：头段 utf-16-le；尾段 utf-8 增量解码，坏点处尝试 GBK 小窗解码，仍失败则记 U+FFFD；
统一重写为 UTF-16LE（主维护方 PowerShell 追加口径），追加 T3·S1 条目。"""
import sys

BASE = r'E:/KnowledgeOS/AI地图/'
BAK = BASE + '_更新日志.md.bak_20260913_t3s1'
P = BASE + '_更新日志.md'
LINE = ('\n- [来源: ZCode T3多语言 @ 2026-09-13 05:06] T3·S1 翻译链路审计完成：'
        '排盘→文案全链路 0 语言参数/0 回译，9 断点落盘（i18n 仅 UI 约136×7；lexicon 1180 条无译名字段未入链路）；'
        '产物 docs/audit/2026-09-13-上线前加固/thread-03/output/01_翻译链路审计.md'
        '\n- [来源: ZCode T3多语言 @ 2026-09-13 05:54] T3·S2 口径定稿（字段三分法+门禁 G1–G5，老板确认）+ '
        'S3 术语表一期：7lang-terms.csv 1201 行（lexicon 1180+补录 21），键已对齐 T4 术语键 v1 三段格式，'
        'L0 确定性核心 7 语言 100% 覆盖（tier1 355 条；tier2 846 显式待定，无编造）；'
        '产物 docs/audit/2026-09-13-上线前加固/thread-03/output/（02、03、terms/）')

raw = open(BAK, 'rb').read()
head, tail = raw[:1246], raw[1246:]
head_text = head.decode('utf-16-le')
print('HEAD_TEXT=', head_text[:80], '...')

# 增量扫描尾段坏点
parts, badspots = [], []
i = 0
while i < len(tail):
    try:
        parts.append(tail[i:].decode('utf-8'))
        i = len(tail)
        break
    except UnicodeDecodeError as e:
        bad = i + e.start
        badspots.append(bad)
        parts.append(tail[i:bad].decode('utf-8'))
        print('BADSPOT global=', 1246 + bad, 'hex_ctx=',
              tail[max(0, bad - 6):bad + 8].hex(' '))
        g = None
        for L in range(1, 9):
            try:
                g = tail[bad:bad + L].decode('gbk')
                break
            except Exception:
                continue
        if g is None:
            parts.append('\ufffd')
            print('   -> U+FFFD（GBK 亦不可解）')
            i = bad + 1
        else:
            parts.append(g)
            print('   -> GBK 解出:', repr(g))
            i = bad + L
tail_text = ''.join(parts)
print('TAIL chars=', len(tail_text), 'badspots=', len(badspots),
      'replacement=', tail_text.count('\ufffd'))
print('TAIL_TAIL=', repr(tail_text[-120:]))
if len(badspots) > 10 or tail_text.count('\ufffd') > 4:
    print('TOO_MANY_BADSPOTS，中止写入，需人工判读')
    sys.exit(1)

open(P, 'wb').write((head_text + tail_text + LINE).encode('utf-16-le'))
back = open(P, 'rb').read().decode('utf-16-le')
print('VERIFY_OK chars=', len(back), 'crlf_end=', repr(back[-8:]))
