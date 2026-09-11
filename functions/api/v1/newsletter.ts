/**
 * 邮件订阅 API（Cloudflare Pages Functions，边缘运行）
 * 路由：POST /api/v1/newsletter
 * 存储：newsletter_emails（Cloudflare KV）
 * 说明：P3 商业化 · 邮件捕获（双确认框架）
 *   - 新订阅写入 status:pending 记录，并签发确认 token、调用 sendConfirmationEmail 预留 hook；
 *   - 用户点击邮件链接后由 /api/v1/newsletter-confirm 完成 pending→confirmed。
 *   - 邮件通道未接入前，hook 为空操作，记录保持 pending（不实际发信）。
 */

import { CONFIRM_TOKEN_TTL_SEC, createConfirmToken, sendConfirmationEmail } from './newsletter-confirm';

interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>;
}

interface NewsletterEnv {
  newsletter_emails?: KVNamespace;
  AUTH_SECRET?: string;
}

type PagesContext = {
  request: Request;
  env?: NewsletterEnv;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LEN = 254;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'no-store',
    },
  });
}

async function readJson(req: Request): Promise<Record<string, unknown>> {
  try {
    return (await req.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export async function onRequest(ctx: PagesContext): Promise<Response> {
  const method = ctx.request.method.toUpperCase();

  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (method !== 'POST') {
    return json({ error: 'method_not_allowed' }, 405);
  }

  const kv = ctx.env?.newsletter_emails;
  if (!kv) {
    return json({ error: 'newsletter_unavailable' }, 503);
  }

  const body = await readJson(ctx.request);
  const raw = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!EMAIL_RE.test(raw) || raw.length > MAX_EMAIL_LEN) {
    return json({ error: 'invalid_email' }, 400);
  }

  const key = `email:${raw}`;
  const existing = await kv.get(key);
  if (existing) {
    return json({ ok: true, already: true });
  }

  const record = {
    email: raw,
    source: typeof body.source === 'string' && body.source.length <= 64 ? body.source : 'website',
    ts: new Date().toISOString(),
    status: 'pending',
    subscribed: false,
  };
  await kv.put(key, JSON.stringify(record));

  // 双确认：签发确认 token 并预留邮件发送 hook（无邮件通道，hook 当前为空操作）
  const secret = ctx.env?.AUTH_SECRET;
  if (secret) {
    const exp = Math.floor(Date.now() / 1000) + CONFIRM_TOKEN_TTL_SEC;
    const token = await createConfirmToken(raw, exp, secret);
    await sendConfirmationEmail(raw, token);
  }

  return json({ ok: true, status: 'pending', pendingConfirmation: true });
}
