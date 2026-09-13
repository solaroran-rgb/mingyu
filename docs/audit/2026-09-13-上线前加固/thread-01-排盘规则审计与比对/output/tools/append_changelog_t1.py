# -*- coding: utf-8 -*-
"""T1 收口：向 AI地图/_更新日志.md（UTF-16LE）追加条目（禁 echo，按计划书指示用 Python）。"""
import io
import os

P = r"E:\KnowledgeOS\AI地图\_更新日志.md"
ENTRY = (
    "- 2026-09-13 **T1 排盘审计 S1-S7 全程收口（ZCode）**：S1 映射表(63端点↔21+1体系↔148测试文件)；"
    "S2 规则审计 22/22 全覆盖(唯一实锤 ssgw 证据链出处已修)；S3 比对站清单(白皮书基准卜易居/元亨利贞/灵棋排盘+竞品缓存+开源参照+典籍四类源)；"
    "S4 黄金样例 50 组(5 优先体系×10，L1独立算式/L2假设/L3基线三级)；"
    "S5 引擎侧 186 字段 diff 全过 0 mismatch(独立算式交叉验证：干支纪年/素问岁运司天在泉/元会运世/太乙72局)；"
    "S6 台账闭环(A1 ssgw出处+H2死数据+H3恒真断言已修 @ef0cb90/cecba86；H1/H4 移交；B类口径声明 B1-B10；D类裁决请求 D1-D5)；"
    "S7 回归 api 108/108、prompt 229/229、core 1538/1540(2失败=T3 i18n useI18nProvider 基线继承，T1 零回归)；"
    "分支 thread/t1-paipan-audit 待主控合并，未部署线上；更新日志首条由 UTF-16LE Python 追加打通\r\n"
)


def main():
    with io.open(P, "rb") as f:
        data = f.read()
    if data[:2] == b"\xff\xfe":
        text = data[2:].decode("utf-16-le")
    else:
        text = data.decode("utf-16-le")
    lines = text.split("\r\n")
    insert_at = 0
    for i, ln in enumerate(lines):
        if ln.startswith("- "):
            insert_at = i
            break
    lines.insert(insert_at, ENTRY.rstrip("\r\n"))
    out = "\r\n".join(lines)
    with io.open(P, "wb") as f:
        f.write(b"\xff\xfe" + out.encode("utf-16-le"))
    print("changelog appended at line", insert_at)


main()
