/**
 * 支付通道抽象层（Cloudflare Pages Functions，边缘运行，零依赖 fetch）
 *
 * 选型（2026-09 MainAgent 拍板）：
 *   - 主实现：Lemon Squeezy（MoR，个人可注册、无公司要求、5%+$0.50/笔全包，
 *     代管全球税务/拒付/订阅；被 Stripe 收购但 2026 仍接受新注册，长期可迁 Stripe）。
 *   - 备选：PayPal（个人必可注册、支持订阅；费率高约 7-10%、新号风控严）。
 *   - 排除：Stripe 直连（大陆个人不可注册）、Paddle（资格不确定）、支付宝（需企业资质）。
 *
 * 本模块只做「创建 checkout」与「把 userId 置 premium」两类纯函数；
 * 具体 HTTP 入口见 functions/api/v1/checkout.ts 与 ls-webhook.ts。
 * 切换通道只改 env PAYMENT_PROVIDER，不改前端、不动组件。
 *
 * 环境变量占位（严禁硬编码）：
 *   PAYMENT_PROVIDER            lemonsqueezy | paypal | 空(=关闭)
 *   ── Lemon Squeezy（主）──
 *   LEMONSQUEEZY_API_KEY       机密（Bearer，形如 ........）
 *   LEMONSQUEEZY_STORE_ID      数字 store id
 *   LEMONSQUEEZY_VARIANT_ID    数字 variant id（recurring/订阅产品）
 *   LEMONSQUEEZY_WEBHOOK_SECRET 机密（webhook 签名密钥）
 *   LEMONSQUEEZY_API_URL       可选，默认 https://api.lemonsqueezy.com/v1
 *   ── PayPal（备选预留）──
 *   PAYPAL_CLIENT_ID           预留
 *   PAYPAL_CLIENT_SECRET       机密预留
 * 共享：
 *   PUBLIC_SITE_URL            可选，拼成功/取消跳转
 */

export type PaymentProvider = 'lemonsqueezy' | 'paypal' | 'none';

interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>;
}

export interface PaymentEnv {
  PAYMENT_PROVIDER?: string;
  LEMONSQUEEZY_API_KEY?: string;
  LEMONSQUEEZY_STORE_ID?: string;
  LEMONSQUEEZY_VARIANT_ID?: string;
  LEMONSQUEEZY_WEBHOOK_SECRET?: string;
  LEMONSQUEEZY_API_URL?: string;
  PAYPAL_CLIENT_ID?: string;
  PAYPAL_CLIENT_SECRET?: string;
  PAYPAL_WEBHOOK_ID?: string;
  PAYPAL_PLAN_ID?: string;
  /** sandbox | live；默认 sandbox（安全值，避免 live 误收款） */
  PAYPAL_MODE?: string;
  PUBLIC_SITE_URL?: string;
  AUTH_KV?: KVNamespace;
}

export interface CheckoutParams {
  userId: string;
  email?: string;
  /** 请求 origin（PUBLIC_SITE_URL 优先） */
  baseUrl: string;
}

export type CheckoutResult = { ok: true; url: string } | { ok: false; error: string; detail?: string };

const SUB_KEY_PREFIX = 'sub:';

/** 解析当前支付 provider；未配置或未知 → none（前端优雅降级） */
export function resolvePaymentProvider(env: PaymentEnv): PaymentProvider {
  const p = (env.PAYMENT_PROVIDER || '').trim().toLowerCase();
  if (p === 'lemonsqueezy' || p === 'ls') return 'lemonsqueezy';
  if (p === 'paypal') return 'paypal';
  return 'none';
}

function lsConfigured(env: PaymentEnv): boolean {
  return Boolean(env.LEMONSQUEEZY_API_KEY && env.LEMONSQUEEZY_STORE_ID && env.LEMONSQUEEZY_VARIANT_ID);
}

/** Lemon Squeezy：创建 checkout，返回托管收银台 URL */
async function createLemonSqueezyCheckout(env: PaymentEnv, params: CheckoutParams): Promise<CheckoutResult> {
  if (!lsConfigured(env)) return { ok: false, error: 'commerce_unavailable' };
  const apiBase = (env.LEMONSQUEEZY_API_URL || 'https://api.lemonsqueezy.com/v1').replace(/\/+$/, '');
  const origin = (env.PUBLIC_SITE_URL || params.baseUrl || '').replace(/\/+$/, '');
  const storeId = env.LEMONSQUEEZY_STORE_ID!;
  const variantId = env.LEMONSQUEEZY_VARIANT_ID!;

  // Lemon Squeezy checkout API（JSON:API）
  const payload = {
    type: 'checkouts',
    attributes: {
      store_id: storeId,
      variant_id: variantId,
      custom_data: { user_id: params.userId },
      checkout_data: params.email ? { email: params.email } : undefined,
      product_options: {
        redirect_url: `${origin}/account?checkout=success`,
        receipt_link_url: `${origin}/?checkout=success`,
      },
    },
    relationships: {
      store: { data: { type: 'stores', id: storeId } },
      variant: { data: { type: 'variants', id: variantId } },
    },
  };

  try {
    const res = await fetch(`${apiBase}/checkouts`, {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        Authorization: `Bearer ${env.LEMONSQUEEZY_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });
    const data = (await res.json().catch(() => ({}))) as {
      data?: { attributes?: { url?: string } };
      error?: { message?: string };
    };
    const url = data.data?.attributes?.url;
    if (!res.ok || !url) {
      return { ok: false, error: 'ls_error', detail: (data.error?.message || '').slice(0, 200) };
    }
    return { ok: true, url };
  } catch (e) {
    return { ok: false, error: 'ls_unreachable', detail: e instanceof Error ? e.message : '' };
  }
}

function paypalBase(env: PaymentEnv): string {
  return (env.PAYPAL_MODE || 'sandbox').trim().toLowerCase() === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';
}

function paypalConfigured(env: PaymentEnv): boolean {
  return Boolean(env.PAYPAL_CLIENT_ID && env.PAYPAL_CLIENT_SECRET && env.PAYPAL_PLAN_ID);
}

/** PayPal OAuth2 client_credentials → access token（200/5min 级，每次调用自取） */
async function getPayPalAccessToken(env: PaymentEnv): Promise<string | null> {
  try {
    const basic = btoa(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`);
    const res = await fetch(`${paypalBase(env)}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { access_token?: string };
    return data.access_token ?? null;
  } catch {
    return null;
  }
}

/** PayPal Subscriptions：创建订阅，返回 HATEOAS approve 链接供前端跳转 */
async function createPayPalCheckout(env: PaymentEnv, params: CheckoutParams): Promise<CheckoutResult> {
  if (!paypalConfigured(env)) return { ok: false, error: 'commerce_unavailable' };
  const origin = (env.PUBLIC_SITE_URL || params.baseUrl || '').replace(/\/+$/, '');
  const token = await getPayPalAccessToken(env);
  if (!token) return { ok: false, error: 'paypal_auth_failed' };

  try {
    const res = await fetch(`${paypalBase(env)}/v1/billing/subscriptions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plan_id: env.PAYPAL_PLAN_ID,
        custom_id: params.userId,
        subscriber: params.email ? { email_address: params.email } : undefined,
        application_context: {
          brand_name: 'TempoSoul',
          user_action: 'SUBSCRIBE_NOW',
          payment_method: { payer_preference: 'PAYPAL' },
          return_url: `${origin}/account?checkout=success`,
          cancel_url: `${origin}/?checkout=canceled`,
        },
      }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      links?: Array<{ href: string; rel: string }>;
      name?: string;
      message?: string;
    };
    const approve = (data.links ?? []).find((l) => l.rel === 'approve')?.href;
    if (!res.ok || !approve) {
      return { ok: false, error: 'paypal_error', detail: (data.message || data.name || '').slice(0, 200) };
    }
    return { ok: true, url: approve };
  } catch (e) {
    return { ok: false, error: 'paypal_unreachable', detail: e instanceof Error ? e.message : '' };
  }
}

/** PayPal webhook 服务端验签（调 PayPal /v1/notifications/verify-webhook-signature）。
 *  按 PayPal transmission-id/cert 官方推荐方式；返回 verification_status === 'SUCCESS'。 */
export async function verifyPaypalWebhook(
  env: PaymentEnv,
  headers: { authAlgo?: string; certUrl?: string; transmissionId?: string; transmissionSig?: string; transmissionTime?: string },
  rawBody: string,
): Promise<boolean> {
  if (!env.PAYPAL_WEBHOOK_ID) return false;
  try {
    const token = await getPayPalAccessToken(env);
    if (!token) return false;
    const event = JSON.parse(rawBody) as unknown;
    const res = await fetch(`${paypalBase(env)}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_algo: headers.authAlgo,
        cert_url: headers.certUrl,
        transmission_id: headers.transmissionId,
        transmission_sig: headers.transmissionSig,
        transmission_time: headers.transmissionTime,
        webhook_id: env.PAYPAL_WEBHOOK_ID,
        webhook_event: event,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as { verification_status?: string };
    return res.ok && data.verification_status === 'SUCCESS';
  } catch {
    return false;
  }
}

/** 统一创建 checkout：按 PAYMENT_PROVIDER 分发 */
export async function createCheckoutSession(env: PaymentEnv, params: CheckoutParams): Promise<CheckoutResult> {
  const provider = resolvePaymentProvider(env);
  if (provider === 'lemonsqueezy') return createLemonSqueezyCheckout(env, params);
  if (provider === 'paypal') return createPayPalCheckout(env, params);
  return { ok: false, error: 'commerce_unavailable' };
}

/** 支付成功后把 userId 置 premium（写 AUTH_KV，与 /api/v1/subscription 同库同 key） */
export async function activatePremium(authKv: KVNamespace, userId: string, source: string): Promise<void> {
  await authKv.put(
    `${SUB_KEY_PREFIX}${userId}`,
    JSON.stringify({ tier: 'premium', ts: new Date().toISOString(), source }),
  );
}
