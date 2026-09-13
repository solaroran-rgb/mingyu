# M4 覆盖率看板（468 红线 2.1 节视角）：词库/模板/语言 × 红线项矩阵 → markdown 看板
# 用法: python scripts/coverage-dashboard.py > docs/audit/.../output/coverage-dashboard.md
import json, re, sys, io
from collections import Counter

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
SEED = "src/data/lexicon-translator-seed.ts"
text = open(SEED, encoding="utf-8").read()
data = json.loads(text[text.index("= {") + 2 :].rstrip().rstrip(";"))
entries = data["entries"]

# ---------- 词库覆盖 ----------
n = len(entries)
l1 = Counter(e.get("l1_status", "pending_manual") for e in entries)
semantic = sum(1 for e in entries if e.get("semanticLibrary"))
transl = sum(1 for e in entries if any((e.get("translations") or {}).get(l) for l in ("zh", "en", "es", "ar", "th", "pt")))
by_system = Counter(e["system"] for e in entries)
l1_by_system = {}
for e in entries:
    s = e["system"]
    l1_by_system.setdefault(s, Counter())[e.get("l1_status", "pending_manual")] += 1

# ---------- 模板覆盖（prompt 生成端锚定注入状态）----------
TEMPLATE_COVER = {
    "八字（aiPrompts.buildPromptFromConfig）": "✅ 已注入（M3：原型法理锚定段）",
    "紫微（buildZiweiPromptDocument）": "🟡 未接入（术语口径经 proxy 通用注入；锚定段待扩展）",
    "占卜（buildDivinationPromptDocument）": "🟡 未接入（同上）",
    "AI 代理运行时（proxy）": "✅ 合规铁律+敏感域+术语口径+双层熔断（M1/M4）",
}

# ---------- 语言覆盖 ----------
LANG_UI = 7
LANG_CONTENT = sum(1 for e in entries[:1] for l in (e.get("translations") or {}) if (e.get("translations") or {}).get(l))
lang_keys = Counter()
for e in entries:
    for l, v in (e.get("translations") or {}).items():
        if v:
            lang_keys[l] += 1

# ---------- 红线 2.1 映射矩阵 ----------
matrix = [
    ("2.1-01 L1 古籍锚定", f"draft {l1.get('draft',0)}/{n}", "🟡 部分" if l1.get("draft", 0) else "❌"),
    ("2.1-02 L2 注疏/语义库", f"semanticLibrary {semantic}/{n}", "✅ 全量（原创语义）" if semantic == n else "🟡"),
    ("2.1-03 L3 通用白话", f"translations.zh {lang_keys.get('zh',0)}/{n}", "✅" if lang_keys.get("zh", 0) == n else "🟡"),
    ("2.1-04 L4/L5 矩阵", "0/318", "❌（M4 后续批次）"),
    ("2.1-06 熔断器", "双层：FUSE 5 组 + WARN 4 组", "🟡 关键词级就绪/语义级待建"),
    ("2.1-08 多语言脱敏", f"transl 语言数 {len(lang_keys)}（UI {LANG_UI}）", "🟡 zh/en 有，es/ar/th/pt 缺"),
    ("2.1-09 版本化", f"dict_version {data['meta']['dict_version']} + meta 事件", "🟡 部分（报告级落盘待建）"),
    ("2.1-15 术语口径查表", "buildTermHints 318 条可用", "🟡 部分（未核验）"),
]

print("# 转译覆盖率看板（T2 · 自动生成）")
print(f"> 生成：scripts/coverage-dashboard.py ｜ dict_version：{data['meta']['dict_version']} ｜ 数据：lexicon-translator-seed（{n} 条）")
print()
print("## 一、词库分层覆盖")
print(f"- L1 古籍引文：**draft {l1.get('draft',0)}/{n}（{round(l1.get('draft',0)*100/n)}%）**｜verified 0（诚实：未经人核）｜pending {l1.get('pending_manual',0)}")
print(f"- L2 语义库（原创）：{semantic}/{n}")
print(f"- L3 白话（translations.zh）：{lang_keys.get('zh',0)}/{n}")
print(f"- 多语言转译：{len(lang_keys)} 语言（zh={lang_keys.get('zh',0)} en={lang_keys.get('en',0)} es={lang_keys.get('es',0)} ar={lang_keys.get('ar',0)} th={lang_keys.get('th',0)} pt={lang_keys.get('pt',0)}）")
print()
print("## 二、分体系 L1 状态")
print("| 体系 | 条数 | draft | pending |")
print("|---|---|---|---|")
for s, c in sorted(by_system.items(), key=lambda x: -x[1]):
    lc = l1_by_system.get(s, Counter())
    print(f"| {s} | {c} | {lc.get('draft',0)} | {lc.get('pending_manual',0)} |")
print()
print("## 三、prompt 链路锚定注入")
print("| 链路 | 状态 |")
print("|---|---|")
for k, v in TEMPLATE_COVER.items():
    print(f"| {k} | {v} |")
print()
print("## 四、红线 2.1 映射（工程视角，申报终裁权在主控+用户）")
print("| 红线项 | 数据 | 工程状态 |")
print("|---|---|---|")
for row, val, st in matrix:
    print(f"| {row} | {val} | {st} |")
print()
print("## 五、核验清单（遗留数据问题）")
print("- [x] bazi.dizhi.si si_snake→巳（已修）")
print("- [x] bazi.shensha.xuetang_yima→tianluodiwang 键核正（资产线源+网站仓同步）")
print("- [ ] 紫微/择日/大六壬/奇门 96 条引文为「通行赋文意引」，待命理顾问逐条核验升 verified")
print("- [ ] 称骨 12/风水 12/七政 12/太乙 12 置信不足未起草（下批：需古籍原文录入）")
print("- [ ] 塔罗/吠陀/西洋 70 条无中文古籍对象，建议红线口径改判 na 或按原典引文处理")
