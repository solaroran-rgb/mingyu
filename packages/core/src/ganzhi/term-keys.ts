/**
 * @file BP1 引擎键化 · 干支/生肖/五行/六十甲子键表
 * @description
 * 依据 2026-09-13 BP1 键化会签（thread-03/output/07 材料第一、五项，T1 签署）生成：
 * 三段式键 `{体系}:{实体}:{拼音连写}`，命名基准 = terms/7lang-terms.csv 现行 355 键
 * （bazi:stem / bazi:branch / bazi:zodiac / bazi:wuxing / bazi:jiazi 五类共 99 键，
 * 已用 tools/bp1_key_check.py 与 CSV 逐键核对 0 分歧）。
 * 只新增键常量，不改动既有数据导出（旧消费者零感知）。
 */

import { EARTHLY_BRANCHES, HEAVENLY_STEMS, ZODIACS } from './data';

/** 十天干拼音（顺序与 HEAVENLY_STEMS 一致） */
export const HEAVENLY_STEM_KEYS = [
  'jia',
  'yi',
  'bing',
  'ding',
  'wu',
  'ji',
  'geng',
  'xin',
  'ren',
  'gui',
] as const;

/** 十二地支拼音（顺序与 EARTHLY_BRANCHES 一致） */
export const EARTHLY_BRANCH_KEYS = [
  'zi',
  'chou',
  'yin',
  'mao',
  'chen',
  'si',
  'wu',
  'wei',
  'shen',
  'you',
  'xu',
  'hai',
] as const;

/** 十二生肖拼音（顺序与 ZODIACS 一致） */
export const ZODIAC_KEYS = [
  'shu',
  'niu',
  'hu',
  'tu',
  'long',
  'she',
  'ma',
  'yang',
  'hou',
  'ji',
  'gou',
  'zhu',
] as const;

/** 五行拼音（木火土金水） */
export const WUXING_KEY_ORDER = ['mu', 'huo', 'tu', 'jin', 'shui'] as const;

/** 中文名 → 三段式键映射。值恒为 `bazi:<实体>:<拼音>`。 */
export const STEM_KEY_MAP: Record<string, string> = Object.fromEntries(
  HEAVENLY_STEMS.map((zh, i) => [zh, `bazi:stem:${HEAVENLY_STEM_KEYS[i]}`]),
);

export const BRANCH_KEY_MAP: Record<string, string> = Object.fromEntries(
  EARTHLY_BRANCHES.map((zh, i) => [zh, `bazi:branch:${EARTHLY_BRANCH_KEYS[i]}`]),
);

export const ZODIAC_KEY_MAP: Record<string, string> = Object.fromEntries(
  ZODIACS.map((zh, i) => [zh, `bazi:zodiac:${ZODIAC_KEYS[i]}`]),
);

export const WUXING_KEY_MAP: Record<string, string> = Object.fromEntries(
  ['木', '火', '土', '金', '水'].map((zh, i) => [zh, `bazi:wuxing:${WUXING_KEY_ORDER[i]}`]),
);

/**
 * 六十甲子键（甲子起，癸亥止）：由天干键+地支键拼音连写程序生成，
 * 与 terms CSV 命名一致（甲子=bazi:jiazi:jiazi、己巳=bazi:jiazi:jisi）。
 */
export const SIXTY_JIAZI_KEYS: readonly string[] = Array.from(
  { length: 60 },
  (_, index) =>
    `bazi:jiazi:${HEAVENLY_STEM_KEYS[index % 10]}${EARTHLY_BRANCH_KEYS[index % 12]}`,
);

/** 六十甲子干支名 → 键。未知干支返回 null（不猜键）。 */
export function getJiaziKey(ganZhi: string): string | null {
  const index = Array.from({ length: 60 }, (_, i) => `${HEAVENLY_STEMS[i % 10]}${EARTHLY_BRANCHES[i % 12]}`).indexOf(ganZhi);
  return index === -1 ? null : SIXTY_JIAZI_KEYS[index];
}
