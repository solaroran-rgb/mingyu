/**
 * T1-02/T1-03 测试：云端排盘记录（脱敏白名单/限额/CRUD）+ 账号删除级联清理
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { onRequest as authOnRequest } from '../functions/api/auth/[[path]].ts';
import { onRequest as chartsOnRequest, sanitizeChart } from '../functions/api/charts.ts';
import type { KVNamespace } from '../functions/api/_auth-shared';

const SECRET = 'test-auth-secret-0123456789abcdef';

/** 内存 KV 桩：get/put/delete/list(prefix) */
function createMemoryKV(): { kv: KVNamespace; store: Map<string, string> } {
  const store = new Map<string, string>();
  const kv: KVNamespace = {
    async get(key) {
      return store.has(key) ? (store.get(key) as string) : null;
    },
    async put(key, value) {
      store.set(key, value);
    },
    async delete(key) {
      store.delete(key);
    },
    async list(query) {
      const names = [...store.keys()].filter((k) => k.startsWith(query.prefix)).map((name) => ({ name }));
      return { keys: query.limit ? names.slice(0, query.limit) : names };
    },
  };
  return { kv, store };
}

type Env = { AUTH_KV: KVNamespace; AUTH_SECRET: string };

async function registerAndLogin(env: Env, email = 'u1@example.com'): Promise<string> {
  const reg = await authOnRequest({
    request: new Request('https://x.com/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'password123' }),
    }),
    env,
  });
  assert.equal(reg.status, 200);
  const login = await authOnRequest({
    request: new Request('https://x.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'password123' }),
    }),
    env,
  });
  assert.equal(login.status, 200);
  const body = (await login.json()) as { token: string };
  return body.token;
}

function authed(url: string, method: string, token: string, payload?: unknown): Request {
  return new Request(url, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    ...(payload === undefined ? {} : { body: JSON.stringify(payload) }),
  });
}

test('charts：保存→列表→删除全链，含脱敏（时分/经纬度/时区不入库）', async () => {
  const { kv, store } = createMemoryKV();
  const env: Env = { AUTH_KV: kv, AUTH_SECRET: SECRET };
  const token = await registerAndLogin(env);

  // 恶意/冗余字段一并提供
  const res = await chartsOnRequest({
    request: authed('https://x.com/api/charts', 'POST', token, {
      chart: {
        name: '晚子时案例',
        system: 'bazi',
        gender: 'male',
        birth: {
          year: 1995, month: 11, day: 22,
          hour: 23, minute: 45, second: 30, // 禁存字段
          longitude: 113.264, latitude: 23.129, timeZoneId: 'Asia/Shanghai', trueSolarTime: '23:41', // 禁存
        },
        ganzhi: { year: '乙亥', month: '丁亥', day: '甲子', hour: '甲子' },
        summary: '晚子时 forward 口径案例',
      },
    }),
    env,
  });
  assert.equal(res.status, 200);
  const saved = (await res.json()) as { chart: { id: string } };

  // KV 原文层级断言：任何可逆推字段不得落库
  const raw = [...store.values()].find((v) => v.includes('晚子时案例')) ?? '';
  for (const forbidden of ['"hour":23', '"minute"', 'longitude', 'latitude', 'timeZoneId', 'trueSolarTime', '23.129']) {
    assert.ok(!raw.includes(forbidden), `禁存字段泄漏: ${forbidden}`);
  }
  assert.ok(raw.includes('"hour":"甲子"'), '时柱干支字符串应保留（排盘结果非逆推输入）');

  const list = await chartsOnRequest({ request: authed('https://x.com/api/charts', 'GET', token), env });
  assert.equal(list.status, 200);
  const listBody = (await list.json()) as { charts: Array<{ id: string; name: string; birth: { hour?: number } }> };
  assert.equal(listBody.charts.length, 1);
  assert.equal(listBody.charts[0].name, '晚子时案例');
  assert.equal(listBody.charts[0].birth.hour, undefined, 'birth.hour 数字字段不得出现');

  const del = await chartsOnRequest({
    request: authed(`https://x.com/api/charts?id=${saved.chart.id}`, 'DELETE', token),
    env,
  });
  assert.equal(del.status, 200);
  const list2 = await chartsOnRequest({ request: authed('https://x.com/api/charts', 'GET', token), env });
  assert.equal(((await list2.json()) as { charts: unknown[] }).charts.length, 0);
});

test('charts：未认证 401、缺出生日期 400、配额 50 拒绝第 51 条', async () => {
  const { kv } = createMemoryKV();
  const env: Env = { AUTH_KV: kv, AUTH_SECRET: SECRET };

  const anon = await chartsOnRequest({
    request: new Request('https://x.com/api/charts', { method: 'GET' }),
    env,
  });
  assert.equal(anon.status, 401);

  const token = await registerAndLogin(env, 'quota@example.com');
  const bad = await chartsOnRequest({
    request: authed('https://x.com/api/charts', 'POST', token, { chart: { name: 'x' } }),
    env,
  });
  assert.equal(bad.status, 400);

  for (let i = 0; i < 50; i++) {
    const r = await chartsOnRequest({
      request: authed('https://x.com/api/charts', 'POST', token, {
        chart: { name: `c${i}`, system: 'bazi', birth: { year: 1990, month: 6, day: 15 } },
      }),
      env,
    });
    assert.equal(r.status, 200, `第 ${i + 1} 条应成功`);
  }
  const over = await chartsOnRequest({
    request: authed('https://x.com/api/charts', 'POST', token, {
      chart: { name: 'over', system: 'bazi', birth: { year: 1990, month: 6, day: 15 } },
    }),
    env,
  });
  assert.equal(over.status, 400);
  assert.equal(((await over.json()) as { error: string }).error, 'chart_limit_reached');
});

test('T1-03 账号删除：级联清空 user/session/charts，旧 token 即刻失效', async () => {
  const { kv, store } = createMemoryKV();
  const env: Env = { AUTH_KV: kv, AUTH_SECRET: SECRET };
  const token = await registerAndLogin(env, 'bye@example.com');

  await chartsOnRequest({
    request: authed('https://x.com/api/charts', 'POST', token, {
      chart: { name: 'keep?no', system: 'bazi', birth: { year: 1984, month: 2, day: 29 } },
    }),
    env,
  });
  assert.ok([...store.keys()].some((k) => k.startsWith('chart:bye@example.com:')), '删除前应有云端记录');

  const del = await authOnRequest({
    request: authed('https://x.com/api/auth/delete-account', 'POST', token),
    env,
  });
  assert.equal(del.status, 200);
  const delBody = (await del.json()) as { ok: boolean; removedCharts: number };
  assert.equal(delBody.ok, true);
  assert.equal(delBody.removedCharts, 1);

  assert.ok(![...store.keys()].some((k) => k.startsWith('chart:bye@example.com:')), 'charts 应级联清空');
  assert.ok(![...store.keys()].some((k) => k.startsWith('user:bye@example.com')), '用户记录应删除');
  assert.ok(![...store.keys()].some((k) => k.startsWith('session:')), '会话应删除');

  const after = await chartsOnRequest({ request: authed('https://x.com/api/charts', 'GET', token), env });
  assert.equal(after.status, 401, '旧 token 在删除后必须失效');
});

test('sanitizeChart：无有效出生日期返回 null；字段边界裁剪', () => {
  assert.equal(sanitizeChart({ name: 'x' }), null);
  const c = sanitizeChart({
    name: 'n'.repeat(100),
    system: 'bazi',
    birth: { year: 1899, month: 13, day: 0 },
  });
  assert.equal(c, null, '1899 越界年应拒绝');
  const ok = sanitizeChart({
    name: 'n'.repeat(100),
    birth: { year: 1990, month: 6, day: 15 },
    summary: 's'.repeat(1000),
  });
  assert.ok(ok);
  assert.equal(ok.name.length, 40, '名称裁到 40');
  assert.equal(ok.summary?.length, 500, '摘要裁到 500');
});
