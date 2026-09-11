/**
 * 邮件订阅 API（Cloudflare Pages Functions，边缘运行）
 * 路由：POST /api/v1/newsletter
 * 存储：newsletter_emails（Cloudflare KV）
 * 说明：免费订阅邮件捕获（P3 商业化 · 邮件捕获首刀）
 */

interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>;
}

interface NewsletterEnv {
  newsletter_emails?: KVNamespace;
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
    subscribed: true,
  };
  await kv.put(key, JSON.stringify(record));

  return json({ ok: true });
}
