# -*- coding: utf-8 -*-
"""T1-S4 黄金样例集生成器（5 优先体系 × 10 组）
独立期望值来源：
- zodiac/wuyun-liuqi: 干支纪年与《素问》运气规则独立算式（与引擎实现无关，交叉验证）
- huangji-jingshi: 元会运世纯算式（假设已标注，S5 对勘校准）
- taiyi: Kintaiyi 口径积年算式（假设已标注）+ 实现事实（阳遁恒真）
- ssgw: manual 模式确定性（签号回代 + 池 92）+ 越界拒绝
期望值字段为 null 时表示「待推演/待参照」，S5 引擎值落盘后锁定基线。
"""
import json
import os

STEMS = "甲乙丙丁戊己庚辛壬癸"
BRANCHES = "子丑寅卯辰巳午未申酉戌亥"
ZODIAC = dict(zip(BRANCHES, ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"]))
# 《素问·天元纪大论》: 丁壬木/戊癸火/甲己土/乙庚金/丙辛水；阳干太过阴干不及
YUN_MAP = {"甲": ("土", "太过"), "己": ("土", "不及"), "乙": ("金", "不及"), "庚": ("金", "太过"),
           "丙": ("水", "太过"), "辛": ("水", "不及"), "丁": ("木", "不及"), "壬": ("木", "太过"),
           "戊": ("火", "太过"), "癸": ("火", "不及")}
# 六气: 支对 → 气名；司天支对序 [厥阴巳亥, 少阴子午, 太阴丑未, 少阳寅申, 阳明卯酉, 太阳辰戌]，在泉=司天+3
QI = [("厥阴风木", "巳亥"), ("少阴君火", "子午"), ("太阴湿土", "丑未"),
      ("少阳相火", "寅申"), ("阳明燥金", "卯酉"), ("太阳寒水", "辰戌")]
BRANCH_PAIR = {}
for i, (name, pair) in enumerate(QI):
    BRANCH_PAIR[pair[0]] = i
    BRANCH_PAIR[pair[1]] = i


def ganzhi(year):
    idx = (year - 1984) % 60
    return STEMS[idx % 10] + BRANCHES[idx % 12]


def qi_for(branch):
    i = BRANCH_PAIR[branch]
    return QI[i][0], QI[(i + 3) % 6][0]


OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "golden-cases")


def write_case(system, case_id, desc, source, input_, expected, note, tags):
    d = os.path.join(OUT, system)
    os.makedirs(d, exist_ok=True)
    case = {
        "caseId": case_id, "system": system, "desc": desc,
        "input": input_, "expected": expected,
        "expectedAssumption": note, "source": source,
        "boundaryTags": tags, "yearRange": "1900-2100",
    }
    with open(os.path.join(d, case_id + ".json"), "w", encoding="utf-8") as f:
        json.dump(case, f, ensure_ascii=False, indent=2)


src_classical = {"type": "典籍推演", "note": "干支纪年 (year-1984)%60 独立算式；与引擎 tyme4ts 立春界年柱交叉验证"}
src_suwen = {"type": "典籍推演", "note": "《素问·天元纪大论/五运行大论》七篇独立算式；大寒起运口径按引擎声明仅锁岁运/司天在泉"}
src_kintaiyi = {"type": "开源参照", "note": "Kintaiyi@9842d8f 太乙统宗积年口径，算式假设见 expectedAssumption；局数待 S5 对勘锁定"}
src_math = {"type": "典籍推演", "note": "《皇极经世》元会运世换算（1元=129600/会=10800/运=360/世=30），epochYear=1984 约定"}
src_sign = {"type": "官方签谱", "note": "三山国王签谱 92 签官方版本；manual 签号回代确定性，签题内容属引擎数据回归锁定"}

# ---- zodiac ×10 ----
for i, year in enumerate([1984, 1985, 1999, 2000, 2008, 2017, 2024, 2025, 2100, 1900], 1):
    gz = ganzhi(year)
    z = ZODIAC[gz[1]]
    write_case("zodiac", "zodiac-%03d" % i, "%d 年 %s 流年干支" % (year, z),
               src_classical, {"zodiac": z, "year": year},
               {"yearGanZhi": gz, "zodiac": z, "yearBranch": gz[1]},
               "年柱探针 2/10 依赖立春≤2/5；期望值按标准干支纪年（立春界，年中一致）",
               ["年界"] if year in (1900, 1984) else [])

# ---- wuyun-liuqi ×10 ----
for i, year in enumerate([1984, 1985, 1986, 1988, 1991, 2000, 2020, 2024, 2026, 2043], 1):
    gz = ganzhi(year)
    yun, tb = YUN_MAP[gz[0]]
    sitian, zaiquan = qi_for(gz[1])
    write_case("wuyun-liuqi", "wuyun-%03d" % i, "%d 年（%s）岁运与司天在泉" % (year, gz),
               src_suwen, {"year": year},
               {"yearGanZhi": gz, "annualMovement.element": yun, "annualMovement.strength": tb,
                "sitian.name": sitian, "zaiquan.name": zaiquan},
               "交司以大寒起运为引擎现行口径（B3）；本样例只锁岁运五行/太少与司天在泉名",
               [] if year != 1984 else ["甲子起点"])

# ---- huangji-jingshi ×10（epochYear=1984 约定）----
for i, year in enumerate([1984, 1985, 1999, 2000, 2024, 2084, 2384, 12784, 12785, 15000], 1):
    elapsed = year - 1984
    r = elapsed % 129600
    pos = {"position.yuan.indexFromEpoch": elapsed // 129600 + 1, "position.hui.indexInYuan": r // 10800 + 1,
           "position.yun.indexInHui": r % 10800 // 360 + 1, "position.shi.indexInYun": r % 360 // 30 + 1,
           "position.year.indexInShi": r % 30 + 1}
    write_case("huangji-jingshi", "huangji-%03d" % i, "epochYear=1984 下 %d 年的元会运世坐标" % year,
               src_math, {"epochYear": 1984, "year": year},
               pos,
               "算式假设：elapsed=year-epochYear（不含当年）、各层序号一基；与引擎差一边界时以 S5 对勘为准（huangji-007/008 专测会界）",
               ["会界"] if year in (12784, 12785) else [])

# ---- taiyi ×10 ----
BASE = 10153917
for i, year in enumerate([1, 1984, 2000, 2004, 2024, 2026, 2084, 2100, 5000, 9999], 1):
    acc = BASE + year
    bureau = acc % 72 or 72
    write_case("taiyi", "taiyi-%03d" % i, "%d 年年计太乙（阳遁第 %d 局·算式假设）" % (year, bureau),
               src_kintaiyi, {"year": year},
               {"yinYang": "阳遁", "bureau": bureau, "accumulatedYears": acc},
               "算式假设：accumulated=10153917+year、余0作72；若引擎为 BASE+year-1 或余0取舍不同，S5 对勘后修正本表",
               ["公元1年"] if year == 1 else [])

# ---- ssgw ×10（manual 确定性 + 越界拒绝）----
for i, n in enumerate([1, 2, 23, 45, 46, 88, 91, 92, 0, 93], 1):
    valid = 1 <= n <= 92
    write_case("ssgw", "ssgw-%03d" % i,
               ("manual 抽第 %d 签" % n) if valid else ("manual 越界签号 %d 应拒绝" % n),
               src_sign, {"number": n},
               {"number": n, "poolSize": 92, "shouldThrow": not valid},
               "manual 模式无随机；签题/签诗内容以 signs-full（官方版本）为回归基线，权威站比对转人工",
               ["边界"] if n in (1, 92, 0, 93) else [])

total = sum(len(files) for _, _, files in os.walk(OUT))
print("golden cases written, total files:", total)
for sys_ in sorted(os.listdir(OUT)):
    p = os.path.join(OUT, sys_)
    if os.path.isdir(p):
        print(" ", sys_, len(os.listdir(p)))
