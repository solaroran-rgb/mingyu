/**
 * Newsletter 订阅双确认端点三态测试
 * 覆盖：有效 token→confirmed、过期 token→410、重复确认→幂等已确认
 * 另覆盖：签名错误→400、未知订阅者→404
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  onRequest,
  createConfirmToken,
  verifyConfirmToken,
} from '../functions/api/v1/newsletter-confirm';

const SECRET = 'test-auth-secret-0123456789abcdef';
const EMAIL = 'lover@example.com';

interface KV {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
}

/** 内存 KV 桩：模拟 Cloudflare KV get/put */
function createMemoryKV(): { kv: KV; store: Map<string, string> } {
  const store = new Map<string, string>();
  const kv: KV = {
    async get(key: string) {
      return store.has(key) ? (store.get(key) as string) : null;
    },
    async put(key: string, value: string) {
      store.set(key, value);
    },
  };
  return { kv, store };
}

function setPending(store: Map<string, string>, email: string): void {
  store.set(
    `email:${email}`,
    JSON.stringify({ email, source: 'home', ts: '2026-09-11T00:00:00Z', status: 'pending', subscribed: false }),
  );
}

function readStatus(store: Map<string, string>, email: string): { status: string; subscribed: boolean } | null {
  const raw = store.get(`email:${email}`);
  if (!raw) return null;
  return JSON.parse(raw) as { status: string; subscribed: boolean };
}

async function callConfirm(kv: KV, token: string): Promise<Response> {
  const req = new Request(`https://example.com/api/v1/newsletter-confirm?token=${encodeURIComponent(token)}`);
  return onRequest({ request: req, env: { newsletter_emails: kv, AUTH_SECRET: SECRET } });
}

const nowSec = Math.floor(Date.now() / 1000);

test('verifyConfirmToken: 有效 token 解出 email 与 exp', async () => {
  const token = await createConfirmToken(EMAIL, nowSec + 3600, SECRET);
  const r = await verifyConfirmToken(token, SECRET, nowSec);
  assert.equal(r.ok, true);
  if (r.ok) {
    assert.equal(r.email, EMAIL);
    assert.ok(r.exp > nowSec);
  }
});

test('verifyConfirmToken: 错误签名被拒', async () => {
  const token = await createConfirmToken(EMAIL, nowSec + 3600, SECRET);
  const r = await verifyConfirmToken(token, 'wrong-secret', nowSec);
  assert.equal(r.ok, false);
  if (!r.ok) assert.equal(r.reason, 'bad_signature');
});

test('三态①：有效 token + pending → 200 confirmed，KV 翻转', async () => {
  const { kv, store } = createMemoryKV();
  setPending(store, EMAIL);
  const token = await createConfirmToken(EMAIL, nowSec + 3600, SECRET);

  const res = await callConfirm(kv, token);
  assert.equal(res.status, 200);
  const body = (await res.json()) as { ok: boolean; status: string; already?: boolean };
  assert.equal(body.ok, true);
  assert.equal(body.status, 'confirmed');
  assert.equal(body.already, undefined);

  const after = readStatus(store, EMAIL);
  assert.ok(after);
  assert.equal(after?.status, 'confirmed');
  assert.equal(after?.subscribed, true);
});

test('三态②：过期 token → 410 Gone', async () => {
  const { kv, store } = createMemoryKV();
  setPending(store, EMAIL);
  const token = await createConfirmToken(EMAIL, nowSec - 100, SECRET);

  const res = await callConfirm(kv, token);
  assert.equal(res.status, 410);
  const body = (await res.json()) as { error: string };
  assert.equal(body.error, 'token_expired');

  // 过期确认不得改状态
  const after = readStatus(store, EMAIL);
  assert.equal(after?.status, 'pending');
});

test('三态③：重复确认（已 confirmed）→ 幂等 200 already:true', async () => {
  const { kv, store } = createMemoryKV();
  setPending(store, EMAIL);
  const token = await createConfirmToken(EMAIL, nowSec + 3600, SECRET);

  // 第一次：pending → confirmed
  const first = await callConfirm(kv, token);
  assert.equal(first.status, 200);
  const firstConfirmedAt1 = readStatus(store, EMAIL)?.confirmedAt;

  // 第二次：已确认 → 幂等
  const second = await callConfirm(kv, token);
  assert.equal(second.status, 200);
  const body = (await second.json()) as { ok: boolean; status: string; already: boolean };
  assert.equal(body.ok, true);
  assert.equal(body.status, 'confirmed');
  assert.equal(body.already, true);

  // 幂等：confirmedAt 不被覆盖
  assert.equal(readStatus(store, EMAIL)?.confirmedAt, firstConfirmedAt1);
});

test('签名错误 token → 400 invalid_token', async () => {
  const { kv } = createMemoryKV();
  const forged = (await createConfirmToken(EMAIL, nowSec + 3600, 'attacker'));
  const res = await callConfirm(kv, forged);
  assert.equal(res.status, 400);
  const body = (await res.json()) as { error: string };
  assert.equal(body.error, 'invalid_token');
});

test('token 合法但 KV 无记录 → 404 unknown_subscriber', async () => {
  const { kv } = createMemoryKV();
  const token = await createConfirmToken('ghost@example.com', nowSec + 3600, SECRET);
  const res = await callConfirm(kv, token);
  assert.equal(res.status, 404);
});
