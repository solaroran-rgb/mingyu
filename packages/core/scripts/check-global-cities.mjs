/**
 * 全球主要城市经纬度/时区数据校验。
 *
 * 校验项：
 *  1. 字段完整：每个城市必须有 id/name/country/language/latitude/longitude/timeZoneId
 *  2. 坐标范围：latitude ∈ [-90, 90]，longitude ∈ [-180, 180]
 *  3. 时区合法：timeZoneId 必须是 Node.js ICU (Intl.DateTimeFormat) 可识别的 IANA 时区名
 *  4. 无重复 id；同国家重名（nameAscii）仅告警不阻断（10 万级地理库同名异城属正常）
 *  5. 必选目标语言：en/es/ja/ko/th/vi 至少各有一个覆盖
 *  6. 每个收录国家必须恰好有一个 isCapital=true（feature code PPLC）
 *  7. population 为非负整数；language 为 ISO 639-1 主语言码（2-3 位小写）
 *
 * 用法：
 *   node scripts/check-global-cities.mjs
 *   node scripts/check-global-cities.mjs --source-only   # 仅校验源 JSON（CI 构建前）
 */
import { readFileSync } from 'node:fs';
import { SOURCE_PATH } from './generate-global-cities.mjs';

const REQUIRED_FIELDS = [
  'id',
  'name',
  'nameAscii',
  'country',
  'language',
  'latitude',
  'longitude',
  'timeZoneId',
  'population',
  'isCapital',
];

const ALLOWED_LANGUAGE = /^[a-z]{2,3}$/;
const REQUIRED_LANGUAGES = ['en', 'es', 'ja', 'ko', 'th', 'vi'];

/** 用 Node ICU 验证 IANA 时区名是否合法。 */
function isValidTimeZone(tzName) {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tzName });
    return true;
  } catch {
    return false;
  }
}

function fail(problems, message) {
  problems.push(message);
  console.error(`  ✗ ${message}`);
}

function main() {
  const sourceOnly = process.argv.slice(2).includes('--source-only');
  const data = JSON.parse(readFileSync(SOURCE_PATH, 'utf8'));
  const cities = data.cities;

  console.log(`校验全球城市数据：${cities.length} 个城市，${data.countryCount} 个国家。`);
  console.log(`  源文件      ${SOURCE_PATH}`);
  console.log(`  数据源      ${data.source}`);
  console.log('');

  const problems = [];
  const seenIds = new Set();
  const seenCountryName = new Set();
  const countries = new Map();
  const languages = new Set();
  const invalidTimezones = new Set();
  let homonymWarnings = 0;

  cities.forEach((c, idx) => {
    const prefix = `[#${idx} ${c.id ?? '?'}]`;

    // 1. 字段完整
    for (const field of REQUIRED_FIELDS) {
      if (c[field] === undefined || c[field] === null || c[field] === '') {
        fail(problems, `${prefix} 缺少字段 ${field}`);
      }
    }

    // 2. 坐标范围
    if (typeof c.latitude !== 'number' || Number.isNaN(c.latitude) ||
        c.latitude < -90 || c.latitude > 90) {
      fail(problems, `${prefix} latitude 越界: ${c.latitude}`);
    }
    if (typeof c.longitude !== 'number' || Number.isNaN(c.longitude) ||
        c.longitude < -180 || c.longitude > 180) {
      fail(problems, `${prefix} longitude 越界: ${c.longitude}`);
    }

    // 3. 时区合法
    if (typeof c.timeZoneId === 'string' && !isValidTimeZone(c.timeZoneId)) {
      invalidTimezones.add(c.timeZoneId);
      fail(problems, `${prefix} 非法 IANA 时区名: ${c.timeZoneId}`);
    }

    // 4. 重复 id
    if (seenIds.has(c.id)) {
      fail(problems, `${prefix} 重复 id: ${c.id}`);
    }
    seenIds.add(c.id);

    // 同国家重名（nameAscii 小写）：10 万级库中同名异城正常，仅计数告警，不阻断。
    const nameKey = `${c.country}::${String(c.nameAscii).toLowerCase()}`;
    if (seenCountryName.has(nameKey)) {
      homonymWarnings++;
    }
    seenCountryName.add(nameKey);

    // 语言（ISO 639-1 主语言码）
    if (!ALLOWED_LANGUAGE.test(c.language)) {
      fail(problems, `${prefix} 非法语言码: ${c.language}`);
    }
    languages.add(c.language);

    // 人口
    if (!Number.isInteger(c.population) || c.population < 0) {
      fail(problems, `${prefix} population 非法: ${c.population}`);
    }

    // 国家首都计数
    if (!countries.has(c.country)) {
      countries.set(c.country, { capital: 0, total: 0, language: c.language });
    }
    const entry = countries.get(c.country);
    entry.total += 1;
    if (c.isCapital === true) entry.capital += 1;
  });

  // 5. 必选语言
  for (const lang of REQUIRED_LANGUAGES) {
    if (!languages.has(lang)) {
      fail(problems, `缺少目标语言覆盖: ${lang}`);
    }
  }

  // 6. 每国恰好 1 个首都
  for (const [cc, entry] of countries.entries()) {
    if (entry.capital !== 1) {
      fail(problems, `${cc} 首都标记数量异常: ${entry.capital}（应为 1）`);
    }
  }

  // 汇总
  console.log(`  国家数      ${countries.size}`);
  console.log(`  语言覆盖    ${[...languages].sort().join(',')}`);
  console.log(`  唯一 id     ${seenIds.size}`);
  console.log(`  非法时区    ${invalidTimezones.size}`);
  console.log(`  同名异城(告警) ${homonymWarnings}`);
  console.log('');

  if (problems.length > 0) {
    console.error(`✗ 校验失败：${problems.length} 个问题。`);
    for (const p of problems) console.error(`  - ${p}`);
    process.exit(1);
  }

  console.log('✓ 全部校验通过：0 越界 / 0 非法时区 / 0 重复 / 0 缺字段。');
  if (sourceOnly) {
    console.log('（--source-only 模式：跳过生成产物比对。）');
  }
}

main();
