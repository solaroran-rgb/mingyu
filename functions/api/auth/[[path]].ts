/**
 * 认证 API（Cloudflare Pages Functions，边缘运行）
 * 路由：/api/auth/register | login | logout | me | delete-account
 * 存储：AUTH_KV（Cloudflare KV）；共享工具见 ../_auth-shared.ts（单一来源）
 * 本地 vite dev 不执行本函数：认证端点返回 503，客户端优雅降级。
 */
import {
  authenticate,
  corsPreflight,
  hashPassword,
  jsonResponse,
  newSessionId,
  SESSION_TTL,
  signJwt,
  verifyJwt,
  type AuthEnv,
} from '../_auth-shared';

type PagesContext = {
  request: Request;
  env?: AuthEnv;
  params?: { path?: string | string[] };
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function segment(ctx: PagesContext): string {
  const p = ctx.params?.path;
  if (Array.isArray(p)) return (p[0] ?? '').toString();
  if (typeof p === 'string') return p.split('/')[0];
  const m = new URL(ctx.request.url).pathname.match(/\/api\/auth\/([^/]+)/);
  return m ? m[1] : '';
}

async function readJson(req: Request): Promise<Record<string, unknown>> {
  try {
    return (await req.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

/** 账号级联清理：用户记录 + 当前会话 + 该账号全部云端排盘记录。 */
async function purgeAccount(email: string, sid: string, kv: NonNullable<AuthEnv['AUTH_KV']>): Promise<number> {
  let removed = 0;
  const listed = await kv.list({ prefix: `chart:${email}:`, limit: 1000 });
  for (const key of listed.keys) {
    await kv.delete(key.name);
    removed++;
  }
  await kv.delete(`user:${email}`);
  await kv.delete(`session:${sid}`);
  return removed;
}

export async function onRequest(ctx: PagesContext): Promise<Response> {
  const seg = segment(ctx);
  const method = ctx.request.method.toUpperCase();

  if (method === 'OPTIONS') return corsPreflight();

  if (!ctx.env?.AUTH_KV || !ctx.env?.AUTH_SECRET) {
    return jsonResponse({ error: 'auth_unavailable' }, 503);
  }
  const kv = ctx.env.AUTH_KV;
  const secret = ctx.env.AUTH_SECRET;

  if (seg === 'register' && method === 'POST') {
    const body = await readJson(ctx.request);
    const email = String(body.email ?? '').trim().toLowerCase();
    const password = String(body.password ?? '');
    const nickname = String(body.nickname ?? '').trim() || email.split('@')[0];
    if (!EMAIL_RE.test(email) || password.length < 8) return jsonResponse({ error: 'invalid_input' }, 400);
    if (await kv.get(`user:${email}`)) return jsonResponse({ error: 'email_taken' }, 409);
    const salt = newSessionId();
    const pwHash = await hashPassword(password, salt);
    await kv.put(`user:${email}`, JSON.stringify({ email, nickname, salt, pwHash, createdAt: Date.now() }));
    return jsonResponse({ ok: true });
  }

  if (seg === 'login' && method === 'POST') {
    const body = await readJson(ctx.request);
    const email = String(body.email ?? '').trim().toLowerCase();
    const password = String(body.password ?? '');
    const raw = await kv.get(`user:${email}`);
    if (!raw) return jsonResponse({ error: 'invalid_credentials' }, 401);
    const user = JSON.parse(raw) as { email: string; nickname: string; salt: string; pwHash: string };
    if ((await hashPassword(password, user.salt)) !== user.pwHash) {
      return jsonResponse({ error: 'invalid_credentials' }, 401);
    }
    const sid = newSessionId();
    const token = await signJwt({ sub: email, sid, exp: Date.now() + SESSION_TTL * 1000 }, secret);
    await kv.put(`session:${sid}`, email, { expirationTtl: SESSION_TTL });
    return jsonResponse({ token, user: { email: user.email, nickname: user.nickname } });
  }

  if (seg === 'logout' && method === 'POST') {
    const auth = ctx.request.headers.get('Authorization') ?? '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    const payload = token ? await verifyJwt(token, secret) : null;
    if (payload?.sid) await kv.delete(`session:${String(payload.sid)}`);
    return jsonResponse({ ok: true });
  }

  if (seg === 'me' && method === 'GET') {
    const session = await authenticate(ctx.request, ctx.env);
    if (!session) return jsonResponse({ user: null });
    const raw = await kv.get(`user:${session.email}`);
    if (!raw) return jsonResponse({ user: null });
    const user = JSON.parse(raw) as { email: string; nickname: string };
    return jsonResponse({ user: { email: user.email, nickname: user.nickname } });
  }

  // T1-03 账号删除（GDPR 最小合规）：不可逆，级联清空用户/会话/云端排盘记录
  if (seg === 'delete-account' && method === 'POST') {
    const session = await authenticate(ctx.request, ctx.env);
    if (!session) return jsonResponse({ error: 'unauthorized' }, 401);
    const removedCharts = await purgeAccount(session.email, session.sid, kv);
    return jsonResponse({ ok: true, removedCharts });
  }

  return jsonResponse({ error: 'not_found' }, 404);
}
