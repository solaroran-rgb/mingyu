/**
 * 云端排盘记录 API（T1-02）
 * 路由：/api/charts  GET=列表 | POST=保存 | DELETE ?id= 删除单条
 * 隐私铁律（部署计划书 5.5 脱敏规范）：白名单制——服务端只保留
 *   {id,name,system,gender,birth{year,month,day,calendarType,isLeapMonth},ganzhi{year,month,day,hour},summary,savedAt}
 * 出生时分/秒、经纬度、时区、真太阳时标记等任何可逆推字段一律不收不存。
 * 配额：每用户 ≤50 条、单条 ≤4KB（KV 成本护栏）。
 */
import {
  authenticate,
  corsPreflight,
  jsonResponse,
  type AuthEnv,
  type KVNamespace,
} from './_auth-shared';

type PagesContext = {
  request: Request;
  env?: AuthEnv;
};

const CHART_LIMIT = 50;
const MAX_SUMMARY = 500;
const MAX_NAME = 40;
const MAX_GANZHI = 4; // 一柱干支两个汉字

interface SavedChart {
  id: string;
  name: string;
  savedAt: number;
  system: string;
  gender: string;
  birth: { year: number; month: number; day: number; calendarType?: string; isLeapMonth?: boolean };
  ganzhi?: Record<string, string>;
  summary?: string;
}

function chartKey(email: string, id: string): string {
  return `chart:${email}:${id}`;
}

function clampStr(v: unknown, max: number): string {
  return typeof v === 'string' ? v.slice(0, max) : '';
}

function intInRange(v: unknown, min: number, max: number): number | undefined {
  const n = typeof v === 'number' ? Math.round(v) : NaN;
  return Number.isFinite(n) && n >= min && n <= max ? n : undefined;
}

/**
 * 白名单净化：从客户端 payload 提取允许的字段，其余（时分秒/经纬度/时区/
 * trueSolarTime/timeZoneId 等）一律丢弃。返回 null = 无有效出生日期。
 */
export function sanitizeChart(input: Record<string, unknown>): Omit<SavedChart, 'id' | 'savedAt'> | null {
  const birthRaw = (input.birth ?? {}) as Record<string, unknown>;
  const year = intInRange(birthRaw.year, 1900, 2100);
  const month = intInRange(birthRaw.month, 1, 12);
  const day = intInRange(birthRaw.day, 1, 31);
  if (year === undefined || month === undefined || day === undefined) return null;

  const calendarType = birthRaw.calendarType === 'lunar' ? 'lunar' : 'solar';
  const genderRaw = typeof input.gender === 'string' ? input.gender : '';
  const gender = ['male', 'female', 'unspecified'].includes(genderRaw) ? genderRaw : 'unspecified';

  const ganzhiRaw = (input.ganzhi ?? {}) as Record<string, unknown>;
  const ganzhi: Record<string, string> = {};
  for (const pillar of ['year', 'month', 'day', 'hour']) {
    const gz = clampStr(ganzhiRaw[pillar], MAX_GANZHI);
    if (gz) ganzhi[pillar] = gz;
  }

  return {
    name: clampStr(input.name, MAX_NAME) || '未命名排盘',
    system: clampStr(input.system, 20) || 'bazi',
    gender,
    birth: {
      year,
      month,
      day,
      ...(calendarType === 'lunar' ? { calendarType } : {}),
      ...(birthRaw.isLeapMonth === true ? { isLeapMonth: true } : {}),
    },
    ...(Object.keys(ganzhi).length ? { ganzhi } : {}),
    ...(typeof input.summary === 'string' && input.summary ? { summary: clampStr(input.summary, MAX_SUMMARY) } : {}),
  };
}

export async function onRequest(ctx: PagesContext): Promise<Response> {
  const method = ctx.request.method.toUpperCase();
  if (method === 'OPTIONS') return corsPreflight();

  const session = await authenticate(ctx.request, ctx.env);
  if (!session) return jsonResponse({ error: 'unauthorized' }, 401);
  const { email, kv } = session as { email: string; kv: KVNamespace };

  if (method === 'GET') {
    const listed = await kv.list({ prefix: `chart:${email}:`, limit: CHART_LIMIT + 1 });
    if (listed.keys.length > CHART_LIMIT) {
      return jsonResponse({ error: 'chart_limit_reached', limit: CHART_LIMIT }, 400);
    }
    const charts: Array<SavedChart> = [];
    for (const key of listed.keys) {
      const raw = await kv.get(key.name);
      if (raw) charts.push(JSON.parse(raw) as SavedChart);
    }
    charts.sort((a, b) => b.savedAt - a.savedAt);
    return jsonResponse({ charts });
  }

  if (method === 'POST') {
    let body: Record<string, unknown> = {};
    try {
      body = (await ctx.request.json()) as Record<string, unknown>;
    } catch {
      return jsonResponse({ error: 'invalid_json' }, 400);
    }
    const chart = sanitizeChart((body.chart ?? body) as Record<string, unknown>);
    if (!chart) return jsonResponse({ error: 'invalid_birth' }, 400);

    const listed = await kv.list({ prefix: `chart:${email}:`, limit: CHART_LIMIT + 1 });
    const idRaw = typeof body.id === 'string' && body.id ? body.id : '';
    const exists = idRaw ? listed.keys.some((k) => k.name === chartKey(email, idRaw)) : false;
    if (!exists && listed.keys.length >= CHART_LIMIT) {
      return jsonResponse({ error: 'chart_limit_reached', limit: CHART_LIMIT }, 400);
    }
    const id = exists ? idRaw : crypto.randomUUID();
    const record: SavedChart = { ...chart, id, savedAt: Date.now() };
    const serialized = JSON.stringify(record);
    if (serialized.length > 4096) return jsonResponse({ error: 'chart_too_large' }, 400);
    await kv.put(chartKey(email, id), serialized);
    return jsonResponse({ ok: true, chart: record });
  }

  if (method === 'DELETE') {
    const id = new URL(ctx.request.url).searchParams.get('id') ?? '';
    if (!/^[0-9a-fA-F-]{8,64}$/.test(id)) return jsonResponse({ error: 'invalid_id' }, 400);
    await kv.delete(chartKey(email, id));
    return jsonResponse({ ok: true });
  }

  return jsonResponse({ error: 'not_found' }, 404);
}
