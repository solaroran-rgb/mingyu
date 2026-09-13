// M3 前置桥接层：排盘结果 → archetype_key → 词库 L1/L3 查表。
// ✅ T1 审计结论已回填（docs/audit/2026-09-13-上线前加固/thread-01-排盘规则审计与比对/
//    output/规则审计/bazi-ziwei.md）：
//  - 十神：core 为本地 10×10 矩阵（baziUtils.ts L107-127），地支十神取藏干主气，测试锁全矩阵。
//    本文件 tenGodOf 按五行生克+阴阳同异实现同一矩阵，与 core 口径一致（仅作展示层查表，
//    排盘主链仍以 core 输出为准）。
//  - 旺衰：三倾向多数表决（月令合看司令/地支通根/成局+明透结构）输出七级
//    （极强/身强/偏强/中和/偏弱/身弱/极弱），score/commanderScore 标 @deprecated 不参与判定。
//  - 格局取用：扶抑 4 条 → 调候覆盖 → 司令重排 → 病药优先（baziUsefulGodStrategy.ts）。
//  - 合化：地支六合永不作成化（harmonyTransform isTransformed 恒 false）。
// key 规范：点分 `bazi.shishen.bijian`（与国学资产线 lexicon-schema 实际数据一致）；
// 白皮书 2.3 的连字符 `bazi-shishen-qisha-001` 形态由 toHyphenKey() 归一输出；
// T4 v1 三段式冒号形态 `bazi:shishen:qisha` 由分支定义层（src/data/branch-definitions.ts）使用。

import {
  LEXICON_TRANSLATOR_SEED,
  type LexiconTranslatorEntry,
} from '../../data/lexicon-translator-seed';

const ENTRY_BY_KEY = new Map<string, LexiconTranslatorEntry>(
  LEXICON_TRANSLATOR_SEED.entries.map((e) => [e.archetypeKey, e]),
);
const ENTRY_BY_DISPLAY = new Map<string, LexiconTranslatorEntry>(
  LEXICON_TRANSLATOR_SEED.entries.map((e) => [e.displayZh, e]),
);

/** 点分 key ↔ 白皮书契约连字符形态互转（variant 段缺省时不补 001）。 */
export function toHyphenKey(dotKey: string): string {
  return dotKey.replace(/\./g, '-');
}

// ---------- 十神（与 core 10×10 矩阵同口径：五行生克 × 阴阳同异；T1 审计已核） ----------

const GAN_ELEMENT: Record<string, { element: string; yang: boolean }> = {
  甲: { element: '木', yang: true },
  乙: { element: '木', yang: false },
  丙: { element: '火', yang: true },
  丁: { element: '火', yang: false },
  戊: { element: '土', yang: true },
  己: { element: '土', yang: false },
  庚: { element: '金', yang: true },
  辛: { element: '金', yang: false },
  壬: { element: '水', yang: true },
  癸: { element: '水', yang: false },
};

const TEN_GOD_KEY: Record<string, string> = {
  比肩: 'bazi.shishen.bijian',
  劫财: 'bazi.shishen.jiecai',
  食神: 'bazi.shishen.shishen',
  伤官: 'bazi.shishen.shangguan',
  偏财: 'bazi.shishen.piancai',
  正财: 'bazi.shishen.zhengcai',
  七杀: 'bazi.shishen.qisha',
  正官: 'bazi.shishen.zhengguan',
  偏印: 'bazi.shishen.pianyin',
  正印: 'bazi.shishen.zhengyin',
};

function tenGodOf(dayGan: string, targetGan: string): string | null {
  const me = GAN_ELEMENT[dayGan];
  const other = GAN_ELEMENT[targetGan];
  if (!me || !other) return null;
  const samePolarity = me.yang === other.yang;
  if (me.element === other.element) return samePolarity ? '比肩' : '劫财';
  const generatesMe = GENERATES[other.element] === me.element;
  const iControl = CONTROLS[me.element] === other.element;
  if (generatesMe) return samePolarity ? '偏印' : '正印';
  if (iControl) return samePolarity ? '偏财' : '正财';
  const controlsMe = CONTROLS[other.element] === me.element;
  if (controlsMe) return samePolarity ? '七杀' : '正官';
  return samePolarity ? '食神' : '伤官';
}

const GENERATES: Record<string, string> = { 木: '火', 火: '土', 土: '金', 金: '水', 水: '木' };
const CONTROLS: Record<string, string> = { 木: '土', 土: '水', 水: '火', 火: '金', 金: '木' };

/** 从四柱天干提取十神 archetype_key（不含日主自身柱的天干同字）。 */
export function extractTenGodKeys(dayGan: string, pillarGans: readonly string[]): string[] {
  const keys: string[] = [];
  for (const gan of pillarGans) {
    if (gan === dayGan) continue;
    const god = tenGodOf(dayGan, gan);
    const key = god ? TEN_GOD_KEY[god] : null;
    if (key && !keys.includes(key)) keys.push(key);
  }
  return keys;
}

// ---------- 神煞 / 干支 / 长生（displayZh 直查） ----------

const SHENSHA_ALIASES: Record<string, string> = {
  天乙贵人: '天乙贵人',
  天德贵人: '天德贵人',
  月德贵人: '月德贵人',
  文昌贵人: '文昌贵人',
  禄神: '禄神',
  羊刃: '羊刃',
  桃花: '桃花',
  驿马: '驿马',
  华盖: '华盖',
  红鸾: '红鸾',
  天喜: '天喜',
  孤辰: '孤辰',
  寡宿: '寡宿',
  魁罡: '魁罡',
  空亡: '空亡',
  劫煞: '劫煞',
  灾煞: '灾煞',
  亡神: '亡神',
  金舆: '金舆',
  金神: '金神',
  流霞: '流霞',
  学堂: '学堂',
  将星: '将星',
};

/** 从四柱神煞名列表提取可查词条 key（词库未收录的跳过）。 */
export function extractShenShaKeys(shenShaNames: readonly string[]): string[] {
  const keys: string[] = [];
  for (const name of shenShaNames) {
    const display = SHENSHA_ALIASES[name];
    if (!display) continue;
    const entry = ENTRY_BY_DISPLAY.get(display);
    if (entry && !keys.includes(entry.archetypeKey)) keys.push(entry.archetypeKey);
  }
  return keys;
}

/** 天干/地支单字词条 key。 */
export function extractGanZhiKeys(gans: readonly string[], zhis: readonly string[]): string[] {
  const keys: string[] = [];
  for (const ch of [...gans, ...zhis]) {
    const entry = ENTRY_BY_DISPLAY.get(ch);
    if (entry && !keys.includes(entry.archetypeKey)) keys.push(entry.archetypeKey);
  }
  return keys;
}

// ---------- 查表与 prompt 段构建 ----------

export function lookupArchetype(key: string): LexiconTranslatorEntry | undefined {
  return ENTRY_BY_KEY.get(key);
}

/** L1 锚定 + L3 白话口径段：注入 AI prompt 的原型证据（确定性查表，零生成）。 */
export function buildArchetypeSection(keys: readonly string[], max = 8): string {
  const lines: string[] = [];
  for (const key of keys.slice(0, max)) {
    const e = lookupArchetype(key);
    if (!e) continue;
    if (e.evidenceQuote) {
      lines.push(`· ${e.displayZh}｜${e.evidenceQuote}`);
      lines.push(`  白话口径：${e.translations?.zh ?? e.professionalDef}`);
    } else {
      lines.push(`· ${e.displayZh}｜${e.professionalDef}`);
    }
  }
  if (lines.length === 0) return '';
  return ['【原型法理锚定与白话口径】（解释下述术语时以此为准，不得超出此范畴）：', ...lines].join('\n');
}
