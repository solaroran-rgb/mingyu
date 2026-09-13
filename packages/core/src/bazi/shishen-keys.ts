/**
 * @file BP1 引擎键化 · 十神键表
 * @description 依据 BP1 键化会签第二项（T1 签署）：十神枚举加三段式键 `bazi:shishen:<拼音连写>`，
 * 命名基准 = terms/7lang-terms.csv（10 键已用 tools/bp1_key_check.py 核对 0 分歧）。
 * 只新增映射，不改动 baziUtils 十神矩阵与既有导出。
 */

/** 十神标准序（比肩→正印） */
export const SHISHEN_ORDER = [
  '比肩',
  '劫财',
  '食神',
  '伤官',
  '偏财',
  '正财',
  '七杀',
  '正官',
  '偏印',
  '正印',
] as const;

export type ShiShenTerm = (typeof SHISHEN_ORDER)[number];

/** 十神拼音连写（顺序与 SHISHEN_ORDER 一致） */
export const SHISHEN_KEYS = [
  'bijian',
  'jiecai',
  'shishen',
  'shangguan',
  'piancai',
  'zhengcai',
  'qisha',
  'zhengguan',
  'pianyin',
  'zhengyin',
] as const;

/** 十神中文名 → 三段式键 */
export const SHISHEN_KEY_MAP: Record<string, string> = Object.fromEntries(
  SHISHEN_ORDER.map((zh, i) => [zh, `bazi:shishen:${SHISHEN_KEYS[i]}`]),
);

/** 未知十神（含「偏官」别名不在此表）返回 null，不猜键；别名归一由调用方处理。 */
export function getShiShenKey(name: string): string | null {
  return SHISHEN_KEY_MAP[name] ?? null;
}
