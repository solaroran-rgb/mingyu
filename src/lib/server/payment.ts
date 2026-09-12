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

/** PayPal 备选实现：接口预留。切换 PAYMENT_PROVIDER=paypal 后在此接入 PayPal Orders API。
 *  现阶段返回未配置错误，保持类型/调用面一致，便于后续挂入。 */
async function createPayPalCheckout(_env: PaymentEnv, _params: CheckoutParams): Promise<CheckoutResult> {
  return { ok: false, error: 'paypal_not_implemented', detail: 'PayPal 备选实现待接入：POST /v2/checkout/orders → HATEOAS approve link' };
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
