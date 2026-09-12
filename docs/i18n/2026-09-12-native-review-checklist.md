# 7 语言母语人工校对清单（Native Review Checklist）

- 线程：thread/i18n-review
- 日期：2026-09-12
- 基线：`codex/website-basic-settings` @ 0ac5808
- 范围：`src/i18n/locales/` 7 语言（`zh-CN` / `en` / `es-ES` / `ja` / `ko-KN` / `th-TH` / `vi-VN`）
- 前置：占位符 / key 对齐 / 品牌名 / 长度溢出问题已由前一轮 `2026-09-12-i18n-audit.md` 清零；本清单**只列机翻质量问题**，供各语言母语者人工勾选核对，不做自动修改。
- 使用方式：母语者逐条核对，在 `[ ]` 内打勾并在文末「处置记录」栏写结论（采用现译 / 建议改译 / 保留）。每条均给出真实 key 路径与当前机翻译文原文。

> 叶子 key 总数：**136**（以 `zh-CN` 为基准，7 语言 key 树已对齐，无缺漏）。`privacy.disclaimerNote` 7 语言统一保留英文原文（既有设计，不在本清单范围）。

---

## 一、总览表

| 语言（locale） | 总 key 数 | 疑似问题条数 | 优先级最高的 5 条 |
|---|---|---|---|
| zh-CN（源文） | 136 | 0 | 源文，作为对照基准，无需校对 |
| en | 136 | 15 | ① `tagline` ② `lexicon.title`（metaphysics 误用）③ `premium.perks[1]`（synastry）④ `tutorial.mode2B3`（compromise 误译「磨合」）⑤ `analytics.notice`/`auth.serviceUnavailable`（deploy jargon） |
| es-ES | 136 | 16 | ① `tutorial.*` 全簇「提示词」误作 `indicación` ② `tutorial.mode2B3`（afinamiento）③ `auth.welcome`（语法性别）④ `lexicon.title`（metafísica）⑤ `premium.perks[1]`（sinastría） |
| ja | 136 | 13 | ① `newsletter.subscribe`/`success`（登録 vs 購読）② `tutorial.step2Desc`（八字・紫微汉字直读）③ `tutorial.step3Desc`（豆包未片假名化）④ `appName`（品牌策略 H1）⑤ `auth.serviceUnavailable`（デプロイ） |
| ko-KN | 136 | 10 | ① `tutorial.step2Desc`/`mode2B2`（반면 同音歧义）② `auth.*` 敬语语体不一（하세요/주세요）③ `tutorial.mode3B2`（육효·매화·태을 文化陌生）④ `common.optional`（선택）⑤ `privacy.*`（귀하/당신） |
| th-TH | 136 | 11 | ① `tutorial.step2Desc`（ปาจื่อ/จื่อเหวย 音译）② `premium.perks[1]`（คู่ดาว）③ `tutorial.mode1Title`/`mode3Title`（ดูดวง/ทำนาย 同义重叠）④ `tutorial.mode3B2`（หลิ่วเยา 簇）⑤ 长句词间距/分词通读 |
| vi-VN | 136 | 11 | ① `tutorial.step2Desc`/`mode1B1`（Tử Bình 误译「八字」，应为 Bát Tự）② `newsletter.subscribe`（Đăng ký 与注册同词）③ `theme.label`（Giao diện 误译「主题」）④ `auth.nickname`（Biệt danh）⑤ `lexicon.title`（Huyền học） |

合计待母语复核：**76 条**（zh-CN 0 条为源文基准）。

---

## 二、English（en）

> 整体可读性较好，主要问题集中在：①把东方命理术语套上西方占星/哲学术语（metaphysics / synastry）；②个别直译腔与开发术语泄漏。

- [ ] **`tagline`** — 当前：`Follow the Tempo, Navigate your Soul`
  类型：直译腔 / 品牌标语。核对方向：「循律而生，向心而行」是双关品牌名 TempoSoul，现译把 Tempo/Soul 拆成两句、且大小写不一（Tempo 大写 soul 小写）。母语者判断是否更自然、更像 slogan（如 "Follow the rhythm, navigate your soul"）。

- [ ] **`common.optional`** — 当前：`optional`
  类型：大小写不一致。核对方向：同级 `required` 同为小写，而兄弟字段（back/save/cancel…）首字母大写；表单标签语境是否统一为 `Optional`/`Required`。

- [ ] **`common.required`** — 当前：`required`（同上）。

- [ ] **`lexicon.title`** — 当前：`Metaphysics Lexicon`
  类型：术语 / 文化不适配。核对方向：「命理」并非西方哲学 metaphysics（形而上学）。母语者判断用 "Chinese Astrology" / "Destiny Terms" / "BaZi & ZiWei Lexicon" 等是否更准。

- [ ] **`lexicon.subtitle`** — 当前：`Eastern astronomy & metaphysics term search (MVP)`
  类型：同上 metaphysics 误用；另 `(MVP)` 是开发术语，面向终端用户是否保留。

- [ ] **`newsletter.subtitle`** — 当前：`Weekly divination tips and feature updates, straight to your inbox.`
  类型：术语偏差。核对方向：源文「排盘技巧」是 charting/reading tips，现译 `divination tips` 偏「占卜」，与实际产品（排盘为主）是否吻合。

- [ ] **`premium.desc`** — 当前：`Unlock unlimited AI deep readings and pro-grade reports`
  类型：搭配生硬。核对方向：`deep readings` 非地道搭配，母语者判断 `in-depth readings` 是否更自然。

- [ ] **`premium.perks[1]`** — 当前：`Pro-level synastry & date selection reports`
  类型：文化不适配。核对方向：`synastry` 是西方占星「合盘」专有词，套在东方八字/紫微产品上是否突兀；考虑 `compatibility` / `couple chart`。

- [ ] **`analytics.notice`** — 当前：`...disabled by default and can be enabled at deploy time.`
  类型：开发术语泄漏。核对方向：`at deploy time` 是工程黑话，终端用户无感知；改为 `can be turned on later` 类。

- [ ] **`auth.serviceUnavailable`** — 当前：`Auth service will be enabled after deployment`
  类型：开发术语泄漏。核对方向：`deployment` 同上，面向用户应说 `after launch` / `when the service goes live`。

- [ ] **`tutorial.step1Desc`** — 当前：`Charting for a personal chart or home; synastry for two people; divination for a question; date selection for timing.`
  类型：直译腔 + synastry。核对方向：`date selection for timing` 语义残缺；四句排比是否地道。

- [ ] **`tutorial.step2Desc`** — 当前：`...switch to Bazi or Ziwei when you want to view the chart.`
  类型：文化适配。核对方向：`Bazi`/`Ziwei` 直接拼音未加注释，普通英语用户是否需要括注（如 `your BaZi (Four Pillars) chart`）。

- [ ] **`tutorial.step3Desc`** — 当前：`...prefer expert mode, deep thinking or deep reasoning when available.`
  类型：直译腔。核对方向：`prefer ... when available` 是「优先打开」的直译，是否更自然地说 `turn on expert/deep-thinking mode if available`。

- [ ] **`tutorial.mode2B3`** — 当前：`Often used for romance, partnership and compromise`
  类型：误译。核对方向：源文「感情、合作、磨合」，`磨合` 是「相处磨合/适配」，现译 `compromise`（妥协）语义偏差；建议 `adjustment` / `getting along`。

- [ ] **`tutorial.mode3B2`** — 当前：`Choose from Liuyao, Meihua, Taiyi, Tarot and more`
  类型：文化适配。核对方向：`Liuyao/Meihua/Taiyi` 拼音无注释，又与西方 `Tarot` 并列，英语用户是否看得懂；考虑加简短释义。

---

## 三、Español（es-ES）

> 主要问题：①「提示词」全簇误译为 `indicación`（应为 `prompt`）；②个别西语语法性别/搭配；③与英语同源的 metaphysics/sinastría 术语问题。

- [ ] **`tagline`** — 当前：`Sigue el Tempo, guía tu Alma`
  类型：直译腔 / 大小写。核对方向：`Alma` 大写突兀；品牌双关是否自然。

- [ ] **`common.optional`** — 当前：`opcional` / **`common.required`** — `obligatorio`
  类型：大小写。核对方向：表单标签是否首字母大写（`Opcional`/`Obligatorio`）。

- [ ] **`lexicon.title`** — 当前：`Léxico de Metafísica`
  类型：术语。核对方向：`metafísica`=形而上学，「命理」是否改用 `astrología china` / `destino`。

- [ ] **`tutorial.intro`** — 当前：`...copiar la indicación y envíala a una IA en línea...`
  类型：术语误译。核对方向：`indicación`=指示/提示，AI 语境的「提示词」通用西语是 `prompt`；本簇共 6 处统一核对。

- [ ] **`tutorial.step2Title`** — 当前：`Empieza por la indicación`（同 indicación）。

- [ ] **`tutorial.step2Desc`** — 当前：`...abre por defecto la pestaña «Indicación»...`（同 indicación，标签名尤其要改）。

- [ ] **`tutorial.headTips`** — 当前：`Cómo enviar la indicación`（同 indicación）。

- [ ] **`tutorial.tip1`** — 当前：`...envía la indicación completa entera.`（同 indicación）。

- [ ] **`tutorial.tip3`** — 当前：`Este proyecto se centra en generar indicaciones completas...`（同 indicaciones）。

- [ ] **`tutorial.mode2B3`** — 当前：`Usado para amor, colaboración y afinamiento`
  类型：搭配生硬。核对方向：「磨合」译 `afinamiento`（调音）不自然；建议 `adaptación` / `encaje` / `compaginación`。

- [ ] **`auth.welcome`** — 当前：`Bienvenido, `
  类型：语法性别。核对方向：西语应性别中立或对女性用 `Bienvenida`；建议 `Bienvenido/a, ` 或中性改写。

- [ ] **`newsletter.success`** — 当前：`¡Suscripción exitosa! Gracias por tu confianza.`
  类型：机器腔。核对方向：`Suscripción exitosa` 生硬，母语更常说 `¡Te has suscrito!`。

- [ ] **`premium.perks[1]`** — 当前：`Informes profesionales de sinastría y fechas`
  类型：文化不适配。核对方向：`sinastría` 为西方占星词；「择日」译 `fechas` 过泛，建议 `selección de fechas`。

- [ ] **`privacy.disclaimerHead`** — 当前：`Aviso legal`
  类型：语域。核对方向：源文「免责声明」对应 disclaimer，西站页脚法律区常叫 `Aviso legal`；请确认与 `disclaimerBody` 是否同一语境、是否需 `Cláusula de exención`。

- [ ] **`auth.serviceUnavailable`** — 当前：`...se activará tras el despliegue`
  类型：开发术语泄漏。核对方向：`tras el despliegue`（部署后）终端用户无感知，建议 `cuando se lance el servicio`。

- [ ] **`tutorial.faq1A`** — 当前：`...el shichen (período de dos horas)...`
  类型：文化适配。核对方向：`shichen` 未西语化；母语者判断是否保留拼音括注即可。

---

## 四、日本語（ja）

> 主要问题：①「订阅」误用「登録」与账户注册撞词；②中国命理术语直接写汉字、日语读者无法正确读音；③开发术语与敬语语体。

- [ ] **`appName`** — 当前：`命律（テンポソウル）`
  类型：品牌策略（前序 H1，未自动改）。核对方向：ja 是否统一为 TempoSoul，还是保留汉字「命律」作为正式品牌（deliberate）。

- [ ] **`tagline`** — 当前：`律に従い、魂を導く`
  类型：直译腔。核对方向：「循律而生，向心而行」译为「律に従い」略生硬，是否更自然的标语。

- [ ] **`newsletter.subscribe`** — 当前：`登録`
  类型：术语不一致。核对方向：源文「订阅（邮件）」，日语邮件订阅惯用语是 `購読`；现译与 `nav.register`/`auth.registerSubmit` 的 `登録`（注册账户）撞词，易混淆。

- [ ] **`newsletter.success`** — 当前：`登録しました！信頼いただきありがとうございます。`
  类型：同上，订阅成功却用「登録しました」。

- [ ] **`premium.desc`** — 当前：`無制限の AI 解釈と専門級レポートを解放`
  类型：动词搭配。核对方向：`〜を解放`（解锁）作他动词略生硬；惯用 `アンロック` / `解除`。

- [ ] **`lexicon.count`** — 当前：`件`
  类型：量词。核对方向：「条术语」只译 `件` 单独成词不自然，建议 `件の用語` 或 `語`。

- [ ] **`tutorial.step2Desc`** — 当前：`...盤面を見たいときは八字または紫微に切り替えてください。`
  类型：文化适配/读音。核对方向：直接写汉字「八字」「紫微」，日语读者易误读；日本命理界惯用 `四柱推命` / `紫微斗数（しびとすう）`，请确认写法与读音。

- [ ] **`tutorial.step3Desc`** — 当前：`DeepSeek・Qwen・豆包などのオンライン AI に送り...`
  类型：罗马字不一致。核对方向：DeepSeek/Qwen 拉丁化，唯独「豆包」写汉字；日语应统一片假名 `ドウバオ` 或 `Doubao`。

- [ ] **`tutorial.mode3B2`** — 当前：`六爻・梅花・太乙・タロットなどを選択可能`
  类型：文化适配。核对方向：`六爻・梅花・太乙` 为中国术语，日语用户认知度低；确认是否加注或改用和式称呼。

- [ ] **`tutorial.mode2B3`** — 当前：`恋愛、仕事の組み合い、関係の調整に`
  类型：直译腔。核对方向：「合作、磨合」译 `仕事の組み合い`/`関係の調整` 是否自然。

- [ ] **`auth.serviceUnavailable`** — 当前：`認証サービスはデプロイ後に有効になります`
  类型：开发术语泄漏。核对方向：`デプロイ`（部署）面向用户，建议 `公開後` / `サービス開始後`。

- [ ] **`analytics.notice`** — 当前：`...既定で無効、デプロイ時に有効化可能です。`
  类型：用词。核对方向：`既定で`（默认）惯用 `デフォルトで` / `既定値で`；`デプロイ時` 同上。

- [ ] **`privacy.*` 长段落（如 `s1B1`/`s5B1`）** — 当前：以 `あなた` 为主语、です・ます调
  类型：敬语/语体一致性。核对方向：隐私政策面向韩国/日本用户宜统一敬语体；现混用 `あなた` 与丁宁语，请母语者确认语体一致与自然度。

---

## 五、한국어（ko-KN）

> 备注：locale 代码 `ko-KN` 本身非标准（标准为 `ko-KR`），属工程命名问题、非译文问题，仅在此提示，不在逐条清单内。译文主要问题：반면 同音歧义、敬语语体、中国术语文化陌生。

- [ ] **`common.optional`** — 当前：`선택`
  类型：UI 用词。核对方向：表单「选填」韩语惯用 `(선택)` / `선택 입력`；单词 `선택`（选择）单独像按钮「选择」，请确认。

- [ ] **`lexicon.count`** — 当前：`개 용어`
  类型：量词语序。核对方向：「条术语」`개 용어` 语序/量词搭配是否自然（惯用 `용어 N개`）。

- [ ] **`tutorial.step2Desc`** — 当前：`반면을 보고 싶을 때 팔자나 자미로 전환하세요.`
  类型：同音歧义。核对方向：`반면`（盤面）与韩语常用语 `반면에`（另一方面）同形，可能造成阅读歧义；确认 `반차`/`차트` 等更清晰写法。

- [ ] **`tutorial.mode2B2`** — 当前：`두 사람의 반면을 보여줍니다`（同 반면 歧义）。

- [ ] **`tutorial.mode3B2`** — 当前：`육효, 매화, 태을, 타로 등 선택 가능`
  类型：文化适配。核对方向：韩国本土主流为 사주/팔자，`육효(六爻)·매화(梅花)·태을(太乙)` 认知度低；确认韩国命理用户是否熟悉或需加注。

- [ ] **`auth.loginFailed`** — 当前：`...이메일과 비밀번호를 확인하세요.`
  类型：语体不一致。核对方向：此处 `확인하세요`，而 `registerFailed` 用 `다시 시도해 주세요`；하세요 与 주세요 尊敬阶混用，请统一。

- [ ] **`premium.desc`** — 当前：`무제한 AI 해석과 전문가급 보고서 잠금 해제`
  类型：直译腔。核对方向：`잠금 해제`（unlock）字面直译，母语者判断是否自然。

- [ ] **`analytics.notice`** — 当前：`개인정보 친화적 분석을 사용하며...`
  类型：直译腔。核对方向：`개인정보 친화적 분석` 是 privacy-friendly 的逐字译，韩语惯用 `개인정보 보호 중심 분석` 等，请判断。

- [ ] **`privacy.*` 长段落（`principle1`/`s1B1` 等）** — 当前：`귀하` 与 `당신` 混用
  类型：敬语一致性 / PIPA 语气。核对方向：韩国个人정보 처리방침 语体应统一；`귀하`（书面敬称）与 `당신` 混用请统一为规范书面体。

- [ ] **`tutorial.step1Desc`** — 当前：`...택일은 시간을 선택합니다.`
  类型：语义简化。核对方向：源文「择日选时间」，现译 `택일은 시간을 선택합니다` 是否把「择日」说清楚。

---

## 六、ไทย（th-TH）

> 主要问题：①中国术语音译（ปาจื่อ/หลิ่วเยา 等）泰国用户未必认得；②西方占星词 คู่ดาว；③ดูดวง/ทำนาย 同义重叠；④泰文分词空格通读。

- [ ] **`premium.perks[1]`** — 当前：`รายงานคู่ดาว·เลือกวันระดับมืออาชีพ`
  类型：文化不适配。核对方向：「合盘」译 `คู่ดาว`（star-couple，接近西方 synastry），东方命理是否该用 `ดวงคู่`/`ดูดวงคู่`；间隔号 `·` 泰文排版是否合适。

- [ ] **`tutorial.step2Desc`** — 当前：`...อยากดูแผนดวงค่อยสลับไปปาจื่อหรือจื่อเหวย`
  类型：音译适配（前序 H3）。核对方向：八字/紫微音译 `ปาจื่อ`/`จื่อเหวย`，泰国命理用户是否熟悉此写法，还是应改用泰式占星对应词。

- [ ] **`tutorial.mode1B1`** — 当前：`ปาจื่อ / จื่อเหวย กรอกข้อมูลเกิด`（同音译问题）。

- [ ] **`tutorial.mode3B2`** — 当前：`เลือกได้ เช่น หลิ่วเยา เหม่ยฮัว ไท่อี้ ทาโรต์`
  类型：音译 + 文化混用。核对方向：六爻/梅花/太乙音译 `หลิ่วเยา/เหม่ยฮัว/ไท่อี้` 与西方 `ทาโรต์`（塔罗）并列；泰国用户是否可读。

- [ ] **`lexicon.title`** — 当前：`พจนานุกรมโหราศาสตร์`
  类型：术语。核对方向：「命理词库」译 `โหราศาสตร์`（占星学）框架；泰国本土有 โหราศาสตร์ไทย，确认是否会误导为泰式/西洋占星。

- [ ] **`tutorial.mode1Title`** — 当前：`โหมดดูดวง`（排盘模式） vs **`tutorial.mode3Title`** — `โหมดทำนาย`（占卜模式）
  类型：术语重叠。核对方向：`ดูดวง`（算命/占星）与 `ทำนาย`（预测）语义高度重叠，四个模式难以区分；请母语者给出彼此区分的模式命名。

- [ ] **`auth.serviceUnavailable`** — 当前：`บริการยืนยันตัวตนจะเปิดใช้งานหลังการเผยแพร่`
  类型：开发术语泄漏。核对方向：`หลังการเผยแพร่`（发布后）= deployment，终端用户是否易懂。

- [ ] **`newsletter.subtitle`** — 当前：`เคล็ดลับการพยากรณ์และอัปเดตฟีเจอร์รายสัปดาห์`
  类型：夹用英文词。核对方向：`ฟีเจอร์`（feature）外来词；泰文 UI 是否有更地道说法（`คุณสมบัติ`）。

- [ ] **`disclaimer`** — 当前：`...เพื่อความบันเทิงและการทบทวนตนเองเท่านั้น...`
  类型：用词。核对方向：「自我觉察」译 `การทบทวนตนเอง`（自我回顾），确认是否贴合。

- [ ] **`tutorial.faq1A`** — 当前：`...ให้ปิดเวลาดวงอาทิตย์จริงแล้วเลือกชั่วยามโดยตรง...`
  类型：术语。核对方向：「真太阳时」译 `เวลาดวงอาทิตย์จริง`，泰国天文/命理界惯用说法是否如此。

- [ ] **`privacy.*` / `tutorial.*` 长句（如 `s1B1`、`step1Desc`）** — 当前：整段泰文
  类型：分词/空格通读。核对方向：泰文词间不空格，机翻易出现断词不当；请母语者通读长句词间距与语序自然度。

---

## 七、Tiếng Việt（vi-VN）

> 主要问题：①「八字」误作 Tử Bình（应为 Bát Tự）；②「订阅」与「注册」同词 Đăng ký；③「主题」误作 Giao diện。

- [ ] **`tutorial.step2Desc`** — 当前：`...muốn xem bàn thì chuyển qua Tử Bình hoặc Tử Vi.`
  类型：术语误译（前序 H2）。核对方向：源文「八字或紫微」；越南语「八字」通用名为 **Bát Tự（tứ trụ）**，`Tử Bình`（子平）是另一流派，疑似误译。

- [ ] **`tutorial.mode1B1`** — 当前：`Tử Bình / Tử Vi nhập thông tin khai sinh`
  类型：同上，此处「八字」亦应核对是否为 Bát Tự（两处需统一改）。

- [ ] **`newsletter.subscribe`** — 当前：`Đăng ký`
  类型：术语不一致。核对方向：源文「订阅（邮件）」，与 `nav.register`/`auth.registerSubmit` 的 `Đăng ký`（注册账户）撞词；邮件订阅惯用 `Đăng ký nhận tin` / `Theo dõi`。

- [ ] **`newsletter.success`** — 当前：`Đăng ký thành công!`（同上，订阅成功与注册成功同词）。

- [ ] **`theme.label`** — 当前：`Giao diện`
  类型：误译。核对方向：源文「主题」（浅色/深色主题切换）；`Giao diện`=界面，其他语言均为 Theme/テーマ/테마/ธีม/Tema；应作 `Chủ đề`。

- [ ] **`tagline`** — 当前：`Theo nhịp thời gian, dẫn dắt tâm hồn`
  类型：直译腔。核对方向：「循律而生，向心而行」译 `nhịp thời gian`（时间节奏）是否贴合品牌 TempoSoul。

- [ ] **`common.optional`** — 当前：`tùy chọn` / **`common.required`** — `bắt buộc`
  类型：大小写（表单标签）。

- [ ] **`auth.nickname`** — 当前：`Biệt danh`
  类型：UI 用词。核对方向：账户「昵称」越南 UI 更常 `Tên hiển thị`（显示名）；`Biệt danh`=绰号，确认。

- [ ] **`tutorial.mode3B2`** — 当前：`Chọn Lục Hào, Mai Hoa, Thái Ất, Tarot…`
  类型：文化适配。核对方向：Lục Hào/Mai Hoa/Thái Ất 为汉越音，越南术数界确有使用；请母语者确认认知度与写法。

- [ ] **`disclaimer`** — 当前：`...chỉ dành cho mục đích giải trí và tự chiêm nghiệm...`
  类型：用词。核对方向：「自我觉察」译 `tự chiêm nghiệm`（自省），确认是否准确。

- [ ] **`tutorial.faq1A`** — 当前：`...tắt giờ mặt trời thật và chọn thẳng thời thần...`
  类型：术语。核对方向：「真太阳时」译 `giờ mặt trời thật`、「时辰」译 `thời thần`，越南术数惯用说法是否如此。

---

## 八、处置记录（母语者填写）

| 日期 | 语言 | key | 结论（采用/建议改译/保留） | 改后译文 | 校对人 |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

> 本清单为纯文档交付，不修改任何 `src/i18n/locales/*.ts`。母语者确认改译后，另开提交统一替换译文。
