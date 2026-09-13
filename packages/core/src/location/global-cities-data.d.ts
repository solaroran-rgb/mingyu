/** 全球主要城市条目（由 data/globalCities.json 生成）。 */
export interface GlobalCity {
  /** 稳定 ID，形如 `geoname:<geonameid>`。 */
  id: string;
  /** 本地语言名（UTF-8）。 */
  name: string;
  /** ASCII 名（用于搜索/排序）。 */
  nameAscii: string;
  /** ISO 3166-1 alpha-2 国家代码。 */
  country: string;
  /** 该国主语言代码（ISO 639-1，原 7 目标语言 en|es|ja|ko|th|vi 全量保留并新增 fr 等）。 */
  language: string;
  /** ISO 3166-2 一级区划代码（可空）。 */
  admin1?: string;
  /** 纬度（WGS84）。 */
  latitude: number;
  /** 经度（WGS84）。 */
  longitude: number;
  /** IANA 时区名（如 `Asia/Tokyo`）。 */
  timeZoneId: string;
  /** 人口（0 表示未知）。 */
  population: number;
  /** 是否该国首都。 */
  isCapital: boolean;
}

export interface GlobalCitiesMeta {
  version: string;
  source: string;
  sourceUrl: string;
  timezoneSource: string;
  generatedAt: string;
  countryCount: number;
  cityCount: number;
}

export const GLOBAL_CITIES_META: GlobalCitiesMeta;
export const GLOBAL_CITIES: readonly GlobalCity[];
