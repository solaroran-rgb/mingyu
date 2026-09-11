/**
 * 从 data/globalCities.json 生成 src/location/global-cities-data.js。
 *
 * 与 generate-china-location-data.mjs 对齐：源 JSON 入库，生成的 .js 不入库
 * （被 .gitignore 忽略），构建时由 build 脚本重新生成。
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const SOURCE_PATH = fileURLToPath(
  new URL('../data/globalCities.json', import.meta.url),
);
export const TARGET_PATHS = [
  fileURLToPath(new URL('../src/location/global-cities-data.js', import.meta.url)),
  fileURLToPath(new URL('../dist/location/global-cities-data.js', import.meta.url)),
];

/**
 * 由源 JSON 构建 global-cities-data.js 的完整源码文本。
 * 生成与校验共用这一份编码逻辑，避免两处实现漂移。
 */
export function buildGlobalCitiesSource() {
  const data = JSON.parse(readFileSync(SOURCE_PATH, 'utf8'));

  if (!data || typeof data !== 'object' || !Array.isArray(data.cities)) {
    throw new Error('globalCities.json 必须包含 cities 数组。');
  }
  if (data.cities.length === 0) {
    throw new Error('globalCities.json 的 cities 数组不能为空。');
  }

  // 紧凑编码：[id, name, nameAscii, country, language, admin1, lat, lon, tz, pop, isCapital]
  const compact = data.cities.map((c) => [
    c.id,
    c.name,
    c.nameAscii,
    c.country,
    c.language,
    c.admin1 ?? null,
    c.latitude,
    c.longitude,
    c.timeZoneId,
    c.population,
    c.isCapital === true,
  ]);

  return `// 由 data/globalCities.json 生成，请勿直接编辑。
// 数据源：GeoNames cities1000 (CC-BY 4.0) — https://download.geonames.org/export/dump/cities1000.zip
// IANA 时区列：GeoNames timezone 字段（越南已归一化为 Asia/Ho_Chi_Minh）。
const COMPACT_GLOBAL_CITIES = ${JSON.stringify(compact)};

const decodeCity = ([
  id,
  name,
  nameAscii,
  country,
  language,
  admin1,
  latitude,
  longitude,
  timeZoneId,
  population,
  isCapital,
]) => ({
  id,
  name,
  nameAscii,
  country,
  language,
  ...(admin1 ? { admin1 } : {}),
  latitude,
  longitude,
  timeZoneId,
  population,
  isCapital,
});

export const GLOBAL_CITIES_META = ${JSON.stringify({
    version: data.version,
    source: data.source,
    sourceUrl: data.sourceUrl,
    timezoneSource: data.timezoneSource,
    generatedAt: data.generatedAt,
    countryCount: data.countryCount,
    cityCount: data.cityCount,
  })};

export const GLOBAL_CITIES = COMPACT_GLOBAL_CITIES.map(decodeCity);
`;
}

/** 把生成结果写入 src 与 dist 两个产物位置。 */
export function writeGlobalCitiesData() {
  const generatedSource = buildGlobalCitiesSource();
  for (const targetPath of TARGET_PATHS) {
    mkdirSync(dirname(targetPath), { recursive: true });
    writeFileSync(targetPath, generatedSource, 'utf8');
  }
  return generatedSource;
}

const isCliEntry =
  Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isCliEntry) {
  writeGlobalCitiesData();
}
