/**
 * Newsletter 订阅双确认端点（Cloudflare Pages Functions，边缘运行）
 * 路由：GET /api/v1/newsletter-confirm?token=xxx
 *
 * 机制：
 *   - POST /api/v1/newsletter 创建 pending 记录，并签发确认 token（HMAC-SHA256）。
 *   - 用户点击邮件中的链接 → 本端点校验 token 签名与过期时间 → KV 状态机 pending→confirmed。
 *   - token 格式：<b64url(payload)>.<b64url(hmac)>，payload = `${email}.${expSec}`。
 *   - 签名：HMAC-SHA256(AUTH_SECRET, payload)，base64url（无填充）。
 *
 * 状态机：
 *   - 有效 token 且记录为 pending      → 写 confirmed，200 { status:'confirmed' }
 *   - 有效 token 但记录已 confirmed    → 幂等返回 200 { status:'confirmed', already:true }
 *   - 过期 token（exp <= now）         → 410 Gone
 *   - 签名错误 / 格式错误              → 400 invalid_token
 *   - token 合法但 KV 无对应记录        → 404 unknown_subscriber
 *
 * 安全：AUTH_SECRET 必须从环境变量读取（wrangler secret / Pages 环境变量），禁止硬编码。
 * 邮件发送：暂无邮件通道，sendConfirmationEmail 仅预留函数签名（TODO），不实际发信。
 */

interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(
    key: string,
    value: string,
    opts?: { expirationTtl?: number; metadata?: unknown },
  ): Promise<void>;
}

interface ConfirmEnv {
  newsletter_emails?: KVNamespace;
  AUTH_SECRET?: string;
}

type PagesContext = {
  request: Request;
  env?: ConfirmEnv;
};

/** 确认链接有效期：7 天 */
export const CONFIRM_TOKEN_TTL_SEC = 7 * 24 * 60 * 60;

type RecordStatus = 'pending' | 'confirmed';

interface NewsletterRecord {
  email: string;
  source?: string;
  ts: string;
  status: RecordStatus;
  subscribed?: boolean;
  confirmedAt?: string;
  /** 兼容第一轮直订阅记录（无 status 字段，subscribed:true） */
  [k: string]: unknown;
}

export function bufToB64url(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let str = '';
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function b64urlToBytes(s: string): Uint8Array {
  const pad = s.length % 4 ? 4 - (s.length % 4) : 0;
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '===='.slice(0, pad);
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export async function hmacSign(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return bufToB64url(sig);
}

/**
 * 签发确认 token：HMAC-SHA256(AUTH_SECRET, email + '.' + expSec) → base64url
 * @param email 已归一化（小写、去空格）
 * @param expSec 过期 unix 秒
 */
export async function createConfirmToken(email: string, expSec: number, secret: string): Promise<string> {
  const payload = `${email}.${expSec}`;
  const sig = await hmacSign(payload, secret);
  return `${bufToB64url(new TextEncoder().encode(payload))}.${sig}`;
}

export type VerifyResult =
  | { ok: true; email: string; exp: number }
  | { ok: false; reason: 'malformed' | 'bad_signature' | 'expired' };

/** 校验 token：格式 → 签名 → 过期时间。nowSec 由调用方传入便于测试。 */
export async function verifyConfirmToken(
  token: string,
  secret: string,
  nowSec: number,
): Promise<VerifyResult> {
  const parts = token.split('.');
  if (parts.length !== 2) return { ok: false, reason: 'malformed' };
  const [payloadB64, sigB64] = parts;

  let payload: string;
  try {
    payload = new TextDecoder().decode(b64urlToBytes(payloadB64));
  } catch {
    return { ok: false, reason: 'malformed' };
  }

  const expectedSig = await hmacSign(payload, secret);
  if (expectedSig !== sigB64) return { ok: false, reason: 'bad_signature' };

  const dot = payload.lastIndexOf('.');
  if (dot <= 0) return { ok: false, reason: 'malformed' };
  const email = payload.slice(0, dot);
  const exp = Number(payload.slice(dot + 1));
  if (!email || !Number.isFinite(exp)) return { ok: false, reason: 'malformed' };
  if (exp <= nowSec) return { ok: false, reason: 'expired' };

  return { ok: true, email, exp };
}

/**
 * 邮件发送 hook（预留）。
 * TODO(邮件通道): 接入真实邮件服务（Resend / SendGrid / 腾讯云 SES 等）后在此发送确认邮件，
 *   链接形如 https://<域名>/api/v1/newsletter-confirm?token=<token>。
 * 当前无邮件通道，仅为函数签名占位，绝不实际发信。
 */
export async function sendConfirmationEmail(
  _email: string,
  _token: string,
): Promise<void> {
  // TODO: 接入邮件通道后实现发送；当前故意为空。
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'no-store',
    },
  });
}

function readRecord(raw: string | null): NewsletterRecord | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as NewsletterRecord;
  } catch {
    return null;
  }
}

/** 兼容第一轮直订阅：无 status 但 subscribed:true 视为已确认 */
function isConfirmed(rec: NewsletterRecord): boolean {
  return rec.status === 'confirmed' || (typeof rec.status !== 'string' && rec.subscribed === true);
}

export async function onRequest(ctx: PagesContext): Promise<Response> {
  const method = ctx.request.method.toUpperCase();
  if (method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }
  if (method !== 'GET') {
    return json({ error: 'method_not_allowed' }, 405);
  }

  const kv = ctx.env?.newsletter_emails;
  const secret = ctx.env?.AUTH_SECRET;
  if (!kv || !secret) {
    return json({ error: 'newsletter_unavailable' }, 503);
  }

  const url = new URL(ctx.request.url);
  const token = url.searchParams.get('token') ?? '';
  if (!token) {
    return json({ error: 'missing_token' }, 400);
  }

  const nowSec = Math.floor(Date.now() / 1000);
  const verify = await verifyConfirmToken(token, secret, nowSec);
  if (!verify.ok) {
    if (verify.reason === 'expired') {
      return json({ error: 'token_expired' }, 410);
    }
    return json({ error: 'invalid_token' }, 400);
  }

  const key = `email:${verify.email}`;
  const raw = await kv.get(key);
  const rec = readRecord(raw);
  if (!rec) {
    return json({ error: 'unknown_subscriber' }, 404);
  }

  // 幂等：已确认直接返回，不重复写
  if (isConfirmed(rec)) {
    return json({ ok: true, status: 'confirmed', already: true });
  }

  // pending → confirmed
  const updated: NewsletterRecord = {
    ...rec,
    status: 'confirmed',
    subscribed: true,
    confirmedAt: new Date().toISOString(),
  };
  await kv.put(key, JSON.stringify(updated));
  return json({ ok: true, status: 'confirmed' });
}
