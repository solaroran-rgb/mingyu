/**
 * 认证共享工具（auth/[[path]].ts 与 charts.ts 共用，单一来源——H1 双份表教训）
 * 安全：PBKDF2-SHA256 口令哈希 + HMAC-SHA256 JWT（AUTH_SECRET 签名）
 */

export interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
  list(query: { prefix: string; limit?: number }): Promise<{ keys: Array<{ name: string }> }>;
}

export interface AuthEnv {
  AUTH_KV?: KVNamespace;
  AUTH_SECRET?: string;
}

export const SESSION_TTL = 60 * 60 * 24 * 7; // 7 天（秒）

export function bufToB64url(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let str = '';
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlToBytes(s: string): Uint8Array {
  const pad = s % 4 === 0 ? 0 : 4 - (s.length % 4);
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '===='.slice(0, pad);
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function b64url(obj: unknown): string {
  return bufToB64url(new TextEncoder().encode(JSON.stringify(obj)));
}

async function hmac(message: string, secret: string): Promise<string> {
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

export async function signJwt(payload: Record<string, unknown>, secret: string): Promise<string> {
  const header = b64url({ alg: 'HS256', typ: 'JWT' });
  const body = b64url(payload);
  const data = `${header}.${body}`;
  const sig = await hmac(data, secret);
  return `${data}.${sig}`;
}

export async function verifyJwt(token: string, secret: string): Promise<Record<string, unknown> | null> {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [h, b, s] = parts;
  const expected = await hmac(`${h}.${b}`, secret);
  if (expected !== s) return null;
  try {
    return JSON.parse(new TextDecoder().decode(b64urlToBytes(b)));
  } catch {
    return null;
  }
}

export async function hashPassword(password: string, salt: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: new TextEncoder().encode(salt),
      iterations: 100_000,
      hash: 'SHA-256',
    },
    key,
    256,
  );
  return bufToB64url(bits);
}

export function newSessionId(): string {
  return bufToB64url(crypto.getRandomValues(new Uint8Array(24)));
}

/**
 * 从 Authorization: Bearer 提取并校验会话。
 * 返回 null = 未认证（无效 token / 会话已注销）；成功返回 { email, sid, kv, secret }。
 */
export async function authenticate(
  request: Request,
  env: AuthEnv | undefined,
): Promise<{ email: string; sid: string; kv: KVNamespace; secret: string } | null> {
  if (!env?.AUTH_KV || !env?.AUTH_SECRET) return null;
  const auth = request.headers.get('Authorization') ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return null;
  const payload = await verifyJwt(token, env.AUTH_SECRET);
  if (!payload?.sid || typeof payload.sub !== 'string') return null;
  // 会话必须在 KV 白名单内（logout 后即失效）
  if (!(await env.AUTH_KV.get(`session:${String(payload.sid)}`))) return null;
  return { email: payload.sub, sid: String(payload.sid), kv: env.AUTH_KV, secret: env.AUTH_SECRET };
}

export function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export function corsPreflight(): Response {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST,GET,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    },
  });
}
