# ponytail: T2-02 分支语义库批次——为 branch-definitions 的每个分支由本地 Qwen3.8 起草
# 一条补充语义（全标 draft，禁词门禁），JSONL 断点续传，一批 ≤60 条。
# 管线模式复用 scripts/m2-gen-semantic.py：enable_thinking=false + 限速 + 3 次退避 + slot 礼让。
# 产物：src/data/branch-semantic-library.ts（仅数据资产，供命理顾问终审；不注入 prompt——M3 段保持零 LLM 生成）。
import json, io, re, os, time, urllib.request, msvcrt

_LOCK_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_t2_branch_semantic.lock")
_lockf = open(_LOCK_PATH, "w")
try:
    msvcrt.locking(_lockf.fileno(), msvcrt.LK_NBLCK, 1)
except OSError:
    print("another t2-branch-semantic instance is running, exit.", flush=True)
    raise SystemExit(0)

WT = r"E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统\.temposoul-wt\next-thread2"
DEFS = WT + r"\src\data\branch-definitions.ts"
OUT_TS = WT + r"\src\data\branch-semantic-library.ts"
JSONL = WT + r"\scripts\_t2_branch_semantic.jsonl"
URL = "http://127.0.0.1:8080/v1/chat/completions"
SLOT_URL = "http://127.0.0.1:8080/slots"
MODEL = "Qwen3.8-27B-UD-VLM"
BATCH_CAP = 60

FORBID = re.compile(r"必死|注定|一定会|绝对|大凶|血光|夭折|活不过|必(然|定)(会|将)|百分之百|克夫|克妻|灾祸|稳赚|治好|痊愈")

def wait_slot_idle(max_wait=300):
    t0 = time.time()
    while time.time() - t0 < max_wait:
        try:
            with urllib.request.urlopen(SLOT_URL, timeout=5) as r:
                slots = json.loads(r.read().decode("utf-8"))
            if not any(s.get("is_processing") for s in slots):
                return True
        except Exception:
            return True
        time.sleep(3)
    return False

# 从 branch-definitions.ts 提取分支清单（branch() 助手调用参数序固定：key,term,name,...）
text = open(DEFS, encoding="utf-8").read()
calls = re.findall(
    r"branch\(\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*(\d+)\s*,\s*\{([^}]*)\}\s*,\s*'([^']+)'",
    text,
)
targets = []
for key, term, name, priority, cond, vernacular in calls:
    targets.append({
        "branchKey": f"{key}:{name.split('·')[0]}",
        "archetypeKey": key,
        "termKey": term,
        "branchName": name,
        "vernacularZh": vernacular,
    })
print("targets=%d" % len(targets), flush=True)

done = {}
if os.path.exists(JSONL):
    for line in io.open(JSONL, encoding="utf-8"):
        if line.strip():
            r = json.loads(line)
            if r.get("ok"):
                done[r["branchKey"]] = r["semantic"]

sys_p = (
    "你是命理词库编辑。给出某命理术语在一个具体分支条件下的白话解读，请再写一句 30-60 字的原创中文"
    "语义补充（从能量与状态视角）：说明该分支下能量的流动方式、使用建议、需要注意的状态。"
    "要求：第二人称「你」开头或中性客观均可；只用趋势化措辞（倾向于/可能/往往）；"
    "严禁出现：必死、注定、一定会、绝对、大凶、血光、吉凶断语、任何操作指令；"
    "不要引经据典，不要复述已有白话原文；只输出这一句话，不要解释。"
)

def gen(t):
    user = f"术语：{t['termKey']}｜分支：{t['branchName']}｜已有白话：{t['vernacularZh']}"
    body = json.dumps({
        "model": MODEL,
        "messages": [{"role": "system", "content": sys_p}, {"role": "user", "content": user}],
        "max_tokens": 500, "temperature": 0,
        "chat_template_kwargs": {"enable_thinking": False},
    }).encode("utf-8")
    last_err = None
    for attempt in range(3):
        try:
            wait_slot_idle()
            req = urllib.request.Request(URL, data=body, headers={"Content-Type": "application/json"})
            with urllib.request.urlopen(req, timeout=120) as r:
                d = json.loads(r.read().decode("utf-8"))
            msg = d["choices"][0]["message"]
            out = (msg.get("content") or "").strip()
            out = re.sub(r"\*\*|##|#|^\s*[-·]\s*", "", out).strip()
            time.sleep(2.0)
            return out
        except Exception as ex:
            last_err = ex
            time.sleep(3 * (attempt + 1))
    raise last_err

pending = [t for t in targets if t["branchKey"] not in done][:BATCH_CAP]
print("pending=%d done_before=%d" % (len(pending), len(done)), flush=True)

ok = fail = 0
log = io.open(JSONL, "a", encoding="utf-8")
for i, t in enumerate(pending):
    try:
        out = gen(t)
        if not out or len(out) < 15 or FORBID.search(out) or len(out) > 120:
            fail += 1
            log.write(json.dumps({"branchKey": t["branchKey"], "ok": False, "out": out[:120]}, ensure_ascii=False) + "\n")
        else:
            done[t["branchKey"]] = out
            log.write(json.dumps({"branchKey": t["branchKey"], "ok": True, "semantic": out}, ensure_ascii=False) + "\n")
            ok += 1
    except Exception as ex:
        fail += 1
        log.write(json.dumps({"branchKey": t["branchKey"], "ok": False, "err": str(ex)[:120]}, ensure_ascii=False) + "\n")
    log.flush()
    if (i + 1) % 10 == 0:
        print("progress %d/%d ok=%d fail=%d" % (i + 1, len(pending), ok, fail), flush=True)
log.close()

# 写回 TS 数据文件（仅成功条目；全标 draft）
by_key = {}
for t in targets:
    if t["branchKey"] in done:
        by_key[t["branchKey"]] = done[t["branchKey"]]
entries = []
for t in targets:
    sem = by_key.get(t["branchKey"])
    if not sem:
        continue
    entries.append({
        "branchKey": t["branchKey"],
        "archetypeKey": t["archetypeKey"],
        "termKey": t["termKey"],
        "branchName": t["branchName"],
        "semanticZh": sem,
        "status": "draft",
    })
data = {
    "meta": {
        "version": "branch-semantic.1",
        "source": "T2-02 本地 Qwen3.8-27B@8080 起草（禁词门禁+断点续传），待命理顾问终审",
        "generated": "2026-09-13",
        "model": MODEL,
        "count": len(entries),
        "status_note": "全部 draft；不注入 AI prompt（M3 段保持零 LLM 生成），仅作终审内容资产",
    },
    "entries": entries,
}
head = (
    "// T2-02 分支语义库（由 scripts/t2-branch-semantic.py 生成，勿手改；重跑脚本再生）。\n"
    "// 全部 draft：本地模型起草、禁词门禁通过、未经命理顾问终审。\n\n"
    "export interface BranchSemanticEntry {\n"
    "  branchKey: string;\n"
    "  archetypeKey: string;\n"
    "  termKey: string;\n"
    "  branchName: string;\n"
    "  semanticZh: string;\n"
    "  status: 'draft';\n"
    "}\n\n"
    "export const BRANCH_SEMANTIC_LIBRARY: { meta: { version: string; source: string; generated: string; model: string; count: number; status_note: string }; entries: BranchSemanticEntry[] } = "
)
with io.open(OUT_TS, "w", encoding="utf-8", newline="\n") as w:
    w.write(head)
    w.write(json.dumps(data, ensure_ascii=False, indent=1))
    w.write(";\n")
print("ALL DONE ok=%d fail=%d written=%d" % (ok, fail, len(entries)), flush=True)
