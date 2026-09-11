/**
 * TempoSoul·命律 — 吠陀占星证据链构建器
 *
 * 为 generateVedicChart 结果附加 v3.0 四字段证据契约（同 qiZhengEvidence / astrolabeEvidence）：
 *   计算链(computationChain) / 出处(source) / 边界(boundary) / 反证(counterEvidence)
 * + 置信度(confidence) + 深度(depth ≤4)
 *
 * 覆盖 Phase1 四环节：排盘基础（岁差/时刻）→ 星曜位置 → Lagna 与宫位 → 出生宿度
 */
import {
  buildEvidenceTrail,
  type EvidenceItem,
  type EvidenceTrail,
} from '../shared/evidence';
import type { VedicData } from './types';

export function buildVedicEvidenceTrail(result: VedicData): EvidenceTrail {
  const items: EvidenceItem[] = [];

  // 1. 排盘基础（depth 0 主证）：时刻 + Lahiri 岁差
  items.push({
    title: '吠陀排盘基础',
    system: 'vedic',
    computationChain: [
      {
        name: '出生时刻(UT)',
        reference: 'birth.dateTime',
        output: result.birth.dateTime,
      },
      {
        name: 'Lahiri Ayanamsa',
        reference: 'ayanamsa',
        output: {
          degrees: result.ayanamsa.degrees,
          source: result.ayanamsa.source,
        },
      },
      {
        name: '恒星黄经换算',
        reference: 'tropicalToSidereal',
        formula: 'sidereal = tropical − ayanamsa',
      },
    ],
    source: { type: 'classical', name: 'Jyotish / Parashara Hora Shastra（Lahiri 恒星黄道）' },
    boundary: {
      applicableWhen: ['提供出生钟表时间与经纬度', '时区或 IANA 时区名至少一项'],
      cautionWhen: ['真太阳时仅作展示证据，不参与 ASC 求解', '交点模式区分 mean/true'],
    },
    counterEvidence: [
      {
        description: '岁差锚点（Chitra Paksha 与其它 ayanamsa）存在流派差异',
        severity: 'alternative',
      },
    ],
    confidence: 'high',
    depth: 0,
  });

  // 2. 星曜位置（depth 1 辅证）
  if (result.grahas.length > 0) {
    items.push({
      title: '九曜位置',
      system: 'vedic',
      computationChain: [
        {
          name: 'Graha',
          reference: 'grahas',
          output: result.grahas
            .map((g) => `${g.label}:${g.siderealLongitude.toFixed(2)}°/${g.rashi.split(' ')[0]} ${g.pada} Pada`)
            .slice(0, 12),
        },
      ],
      source: { type: 'modern', name: 'astronomy-engine 2.1.19（GeoVector/Ecliptic）' },
      boundary: {
        applicableWhen: ['回归黄经减 Lahiri Ayanamsa 得恒星黄经'],
        cautionWhen: ['Rahu/Ketu 取平均交点时与真交点有偏差'],
      },
      counterEvidence: [
        { description: '星历来源（天文引擎 vs Swiss Ephemeris）存在角秒级差异', severity: 'minor' },
      ],
      confidence: 'high',
      depth: 1,
    });
  }

  // 3. Lagna 与 Whole Sign 宫位（depth 1 辅证）
  items.push({
    title: '上升点与宫位',
    system: 'vedic',
    computationChain: [
      {
        name: 'Lagna',
        reference: 'lagna',
        output: `${result.lagna.label}:${result.lagna.rashi} ${result.lagna.degreeInRashi.toFixed(2)}°（恒星黄经 ${result.lagna.siderealLongitude.toFixed(2)}°）`,
      },
      {
        name: 'Whole Sign 宫位',
        reference: 'wholeSignBhava',
        formula: '以 Lagna 所在 Rashi 为第 1 宫，每宫整宫 30°',
      },
    ],
    source: { type: 'classical', name: 'Whole Sign Bhava（Parashari 通行宫位制）' },
    boundary: {
      applicableWhen: ['以恒星黄经 Rashi 直接定宫'],
      cautionWhen: ['高纬度上升点仍可解，宫位不依赖 Placidus 分点'],
    },
    counterEvidence: [
      { description: '宫位制（Whole Sign 与 Placidus/KP）落宫不同', severity: 'alternative' },
    ],
    confidence: 'high',
    depth: 1,
  });

  // 4. 出生月亮宿度（depth 1 辅证）
  items.push({
    title: '出生 Nakshatra',
    system: 'vedic',
    computationChain: [
      {
        name: '本命宿',
        reference: 'nakshatra.birthMoon',
        output: {
          nakshatra: result.nakshatra.birthMoon.name,
          pada: result.nakshatra.birthMoon.pada,
          lord: result.nakshatra.birthMoon.lordLabel,
          balance: result.nakshatra.birthMoon.balance,
        },
      },
    ],
    source: { type: 'classical', name: '27 Nakshatra / Phaladeepika（每宿 13°20′，各 4 Pada）' },
    boundary: {
      applicableWhen: ['以 Chandra 恒星黄经落宿', 'balance 为本宿已过比例，起运 Dasha 用'],
      cautionWhen: ['宿度交界处需用弧长而非四舍五入判定'],
    },
    counterEvidence: [
      { description: 'Dasha 起运序列与年限为 Parashari 口径，Jaimini 体系不同', severity: 'alternative' },
    ],
    confidence: 'medium',
    depth: 1,
  });

  return buildEvidenceTrail(
    items,
    `吠陀占星证据链（${result.birth.dateTime} · Lahiri）`,
  );
}
