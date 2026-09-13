# -*- coding: utf-8 -*-
"""T1 产物同步：主树 output -> worktree output（为在 thread/t1-paipan-audit 分支上提交）。"""
import shutil
import os

BASE = r"E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统"
MO = os.path.join(BASE, r"docs\audit\2026-09-13-上线前加固\thread-01-排盘规则审计与比对\output")
WO = os.path.join(BASE, r".temposoul-wt\t1-audit-verify\docs\audit\2026-09-13-上线前加固\thread-01-排盘规则审计与比对\output")

dirs = ["golden-cases", "比对结果"]
files = [
    "比对站清单.md", "审计总结.md", "B类口径声明.md", "D类专家裁决请求.md",
    "比对测试报告_huangji-jingshi.md", "比对测试报告_ssgw.md", "比对测试报告_taiyi.md",
    "比对测试报告_wuyun-liuqi.md", "比对测试报告_zodiac.md",
]
tools = ["gen_golden_cases.py", "engine_runner.mjs", "compare_vs_sites.py", "probe_exports.mjs", "append_changelog_t1.py"]

n = 0
for d in dirs:
    src, dst = os.path.join(MO, d), os.path.join(WO, d)
    if os.path.isdir(src):
        shutil.copytree(src, dst, dirs_exist_ok=True)
        n += sum(len(f) for _, _, f in os.walk(dst))
for f in files:
    shutil.copy2(os.path.join(MO, f), os.path.join(WO, f)); n += 1
for f in tools:
    shutil.copy2(os.path.join(MO, "tools", f), os.path.join(WO, "tools", f)); n += 1
print("synced entries:", n)
for d in sorted(os.listdir(WO)):
    print(" ", d)
