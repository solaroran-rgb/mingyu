# ponytail: M2 全自动批次——214 条 semanticLibrary 由本地 Qwen3.8 生成 + 禁词门禁 + 写回种子
# 断点续传：结果存 scripts/_m2_semantic.jsonl，重跑跳过已完成
# 原则：semanticLibrary 为原创语义（零伪造风险）；l1_status 保持 pending_manual 不变
import json, io, re, os, time, urllib.request, msvcrt

# ---- 实例互斥锁：同一时刻只允许一个批次跑，防重复轰炸 ----
_LOCK_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_m2_semantic.lock")
_lockf = open(_LOCK_PATH, "w")
try:
    msvcrt.locking(_lockf.fileno(), msvcrt.LK_NBLCK, 1)
except OSError:
    print("another m2-gen-semantic instance is running, exit.", flush=True)
    raise SystemExit(0)

SLOT_URL = "http://127.0.0.1:8080/slots"

def wait_slot_idle(max_wait=300):
    """礼让主链路：若 :8080 slot 正被其他客户端（如 Hermes）占用，等它空闲再发请求。"""
    t0 = time.time()
    while time.time() - t0 < max_wait:
        try:
            with urllib.request.urlopen(SLOT_URL, timeout=5) as r:
                slots = json.loads(r.read().decode("utf-8"))
            if not any(s.get("is_processing") for s in slots):
                return True
        except Exception:
            return True  # 探活失败不阻塞批处理
        time.sleep(3)
    return False  # 超时也放行，避免死等

WT = r"E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统\.temposoul-wt\thread-t2-audit"
SEED = WT + r"\src\data\lexicon-translator-seed.ts"
JSONL = WT + r"\scripts\_m2_semantic.jsonl"
URL = "http://127.0.0.1:8080/v1/chat/completions"
MODEL = "Qwen3.8-27B-UD-VLM"

FORBID = re.compile(r"必死|注定|一定会|绝对|大凶|血光|夭折|活不过|必(然|定)(会|将)|百分之百|治好|痊愈|稳赚")

text = open(SEED, encoding="utf-8").read()
data = json.loads(text[text.index("= {") + 2 :].rstrip().rstrip(";"))

done = set()
if os.path.exists(JSONL):
    for line in io.open(JSONL, encoding="utf-8"):
        if line.strip():
            r = json.loads(line)
            if r.get("ok"):
                done.add(r["archetypeKey"])  # 只跳过成功条目，失败的重试

sys_p = (
    "你是命理词库编辑。根据给出的术语信息，写一句 25-45 字的原创中文语义片段（semanticLibrary）："
    "说明该术语的含义、正面/负面征象、解读视角。要求：中性客观；只用趋势化措辞（倾向于/可能/往往）；"
    "严禁出现：必死、注定、一定会、绝对、大凶、血光、任何具体疾病名、任何操作指令；"
    "不要引经据典（不要写《某某书》说）；只输出这一句话，不要解释。"
)

def gen(e):
    kw = ",".join((e.get("positiveKeywords") or []) + (e.get("cautionKeywords") or []))
    user = f"术语：{e['displayZh']}｜体系：{e['system']}｜类别：{e.get('termGroup', e['category'])}｜专业释义：{e['professionalDef']}｜关键词：{kw}"
    body = json.dumps({
        "model": MODEL,
        "messages": [{"role": "system", "content": sys_p}, {"role": "user", "content": user}],
        "max_tokens": 500, "temperature": 0,
        "chat_template_kwargs": {"enable_thinking": False},
    }).encode("utf-8")
    last_err = None
    for attempt in range(3):
        try:
            wait_slot_idle()  # slot 忙则礼让，Hermes/主链路优先
            req = urllib.request.Request(URL, data=body, headers={"Content-Type": "application/json"})
            with urllib.request.urlopen(req, timeout=120) as r:
                d = json.loads(r.read().decode("utf-8"))
            msg = d["choices"][0]["message"]
            out = (msg.get("content") or "").strip()
            out = re.sub(r"\*\*|##|#|^\s*[-·]\s*", "", out).strip()
            time.sleep(2.0)  # 限速 + 留出主链路插空窗口（原 0.5s 曾抢占唯一 slot）
            return out
        except Exception as ex:
            last_err = ex
            time.sleep(3 * (attempt + 1))
    raise last_err

targets = [e for e in data["entries"] if e.get("l1_status") == "pending_manual" and not e.get("semanticLibrary") and e["archetypeKey"] not in done]
print("targets=%d done_before=%d" % (len(targets), len(done)), flush=True)

ok = fail = 0
log = io.open(JSONL, "a", encoding="utf-8")
for i, e in enumerate(targets):
    try:
        out = gen(e)
        if not out or len(out) < 12 or FORBID.search(out) or len(out) > 100:
            fail += 1
            log.write(json.dumps({"archetypeKey": e["archetypeKey"], "ok": False, "out": out[:120]}, ensure_ascii=False) + "\n")
        else:
            e["semanticLibrary"] = out
            log.write(json.dumps({"archetypeKey": e["archetypeKey"], "ok": True, "semanticLibrary": out}, ensure_ascii=False) + "\n")
            ok += 1
    except Exception as ex:
        fail += 1
        log.write(json.dumps({"archetypeKey": e["archetypeKey"], "ok": False, "err": str(ex)[:120]}, ensure_ascii=False) + "\n")
    log.flush()
    if (i + 1) % 20 == 0:
        print("progress %d/%d ok=%d fail=%d" % (i + 1, len(targets), ok, fail), flush=True)
log.close()

# 写回种子（仅成功条目）+ bump dict_version patch
done_ok = 0
for line in io.open(JSONL, encoding="utf-8"):
    if line.strip() and json.loads(line).get("ok"):
        for e in data["entries"]:
            if e["archetypeKey"] == json.loads(line)["archetypeKey"] and not e.get("semanticLibrary"):
                e["semanticLibrary"] = json.loads(line)["semanticLibrary"]
                done_ok += 1
                break
data["meta"]["dict_version"] = "1.2.0"
head = text[: text.index("export const LEXICON_TRANSLATOR_SEED")]
with io.open(SEED, "w", encoding="utf-8", newline="\n") as w:
    w.write(head)
    w.write("export const LEXICON_TRANSLATOR_SEED: { meta: { dict_version: string; source: string; generated: string; count: number; l1_status_note: string }; entries: LexiconTranslatorEntry[] } = ")
    w.write(json.dumps(data, ensure_ascii=False, indent=1))
    w.write(";\n")
print("ALL DONE ok=%d fail=%d written_back=%d" % (ok, fail, done_ok), flush=True)
