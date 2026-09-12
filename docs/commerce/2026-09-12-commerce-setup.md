# TempoSoul 命律 · 商业化接入配置与激活手册

> 线程 thread/commerce · 2026-09-12
> 基线：`codex/website-basic-settings @ 0ac5808`
> 范围：邮件订阅双确认发信（Resend）+ 订阅支付（主 Lemon Squeezy，备选 PayPal）。
> **本线程不接真实账号、不部署、不合 main、不 bump sw。** 所有密钥 / 域名均以 env 占位。

---

## 1. 选型结论

### 1a. 邮件发送通道 → **Resend**（事务邮件）
- 事务邮件原生、免费 3,000 封/月、Webhook、CF Workers 原生 fetch 即调、零 Node 依赖。
- 否决 Mailchimp：偏营销 CRM，事务能力（Mandrill）需付费附加，对象模型过重。
- 实现：`src/lib/server/mailer.ts`；未配 `RESEND_API_KEY`/`MAIL_FROM` 时静默 no-op。

### 1b. 支付通道 → 主 **Lemon Squeezy**，**PayPal** 为 live 兜底（均已实现）
2026-09 MainAgent 核实政策后拍板：

| 候选 | 结论 | 理由 |
| --- | --- | --- |
| **Lemon Squeezy** | ✅ 主实现 | 个人可注册、无公司要求；MoR 代管全球税务/拒付/订阅；5%+$0.50/笔全包无月费。**实测中国区受限**：Stripe Tax 表单无法设置、激活/KYC 页被重定向回 payouts、商店卡测试模式（见 §5 路径说明）。2024-07 被 Stripe 收购，2026 仍接受新注册 |
| **PayPal** | 🟢 live 兜底（已实现） | 个人必可注册、支持订阅；用户已有可用 PayPal（ferryoran@outlook.com）。费率实际约 7–10%、新号风控严（冻结 ~21 天），但为中国区可收款的现实通道 |
| Stripe 直连 | ❌ 排除 | 中国大陆个人不可注册 |
| Paddle | ❌ 排除 | 资格不确定 |
| 支付宝 | ❌ 排除 | 需企业资质，面向境内，不匹配海外订阅 |

**抽象层**：`src/lib/server/payment.ts` 定义 `PaymentProvider`（`lemonsqueezy|paypal|none`）与
`createCheckoutSession()` / `activatePremium()` / `verifyPaypalWebhook()`；切换通道只改 env `PAYMENT_PROVIDER`，
不改前端、不动组件。端点：`/api/v1/checkout` 统一分发；`/api/v1/ls-webhook`（LS）与
`/api/v1/paypal-webhook`（PayPal）各自验签，共用 `activatePremium` 落库。

---

## 2. 目录结构（本线程新增 / 改动）

```
functions/api/v1/
  newsletter.ts            [改]  POST：写 KV pending → 调 sendConfirmationEmail(Resend)
  newsletter-confirm.ts    [改]  GET：HMAC+KV 状态机 pending→confirmed；sendConfirmationEmail 走 Resend
  checkout.ts              [改]  POST：按 PAYMENT_PROVIDER 创建 checkout，返回 { url }
  ls-webhook.ts            [新]  POST：Lemon Squeezy 签名验签 → 成功事件回写 AUTH_KV premium
  paypal-webhook.ts        [新]  POST：PayPal transmission 验签 → 订阅/付款成功回写 premium
src/lib/server/
  mailer.ts                [新]  Resend 发送封装（零依赖 fetch）+ 降级 no-op
  payment.ts               [新]  支付抽象层：Lemon Squeezy 主实现 + PayPal Subscriptions 实现 + webhook 验签
src/components/
  PremiumGate.tsx          [改]  订阅墙 CTA →「Checkout」按钮 → /api/v1/checkout（未配则降级 /login）
src/i18n/locales/*.ts      [改]  7 语种：新增 premium.checkoutCta；privacy.s5B1 填入联系邮箱
.dev.vars.example          [改]  新增 Resend / Lemon Squeezy env 占位
wrangler.toml              [改]  [vars] 新增非机密变量注释占位
docs/commerce/
  2026-09-12-commerce-setup.md              [本文件]
  2026-09-12-privacy-contact-placeholders.md [隐私联系邮箱待填清单]
```

存储沿用现有 CF KV（无新数据库）：`newsletter_emails`（订阅）、`AUTH_KV`（档位 `sub:<userId>`）。

---

## 3. 环境变量清单（全部占位，严禁硬编码）

### 3.1 已有（沿用）
`AUTH_SECRET`（secret）、KV 绑定 `newsletter_emails` / `AUTH_KV`。

### 3.2 邮件（Resend）
| 变量 | 类型 | 示例 | 必填 |
| --- | --- | --- | --- |
| `RESEND_API_KEY` | secret | `re_...` | 发信才需要；留空则只收集不发信 |
| `MAIL_FROM` | vars | `TempoSoul <noreply@your-domain.com>` | 是（须在 Resend 验证发信域名） |
| `MAIL_FROM_NAME` | vars | `TempoSoul 命律` | 否 |
| `PUBLIC_SITE_URL` | vars | `https://your-domain.com` | 否（缺省取请求 origin） |

### 3.3 支付（Lemon Squeezy 主）
| 变量 | 类型 | 示例 | 必填 |
| --- | --- | --- | --- |
| `PAYMENT_PROVIDER` | vars | `lemonsqueezy` | 是（空=关闭支付） |
| `LEMONSQUEEZY_API_KEY` | secret | `...` | 是 |
| `LEMONSQUEEZY_STORE_ID` | vars | 数字 store id（LS Dashboard → Settings → Stores） | 是 |
| `LEMONSQUEEZY_VARIANT_ID` | vars | `1356751`（TempoSoul Pro，**已定，非保密**；当前 Draft，定价待定） | 是（已在 wrangler.toml 写为默认值） |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | secret | `...` | 是（webhook 回写 premium） |
| `LEMONSQUEEZY_API_URL` | vars | `https://api.lemonsqueezy.com/v1` | 否 |

### 3.4 PayPal（live 兜底，已实现）
| 变量 | 类型 | 示例 | 必填 |
| --- | --- | --- | --- |
| `PAYPAL_MODE` | vars | `sandbox`（**默认安全值**）\| `live` | 否（默认 sandbox） |
| `PAYPAL_CLIENT_ID` | secret | REST app client id | 是 |
| `PAYPAL_CLIENT_SECRET` | secret | REST app secret | 是 |
| `PAYPAL_WEBHOOK_ID` | vars | webhook 注册 ID | 是（验签用） |
| `PAYPAL_PLAN_ID` | vars | `P-XXXX`（billing plan，月/年订阅计划） | 是（checkout 用） |

> 切到 PayPal：`PAYMENT_PROVIDER=paypal`。代码已实现 OAuth token → `/v1/billing/subscriptions`
> 创建订阅 → 返回 approve 链接；webhook 走 PayPal `/v1/notifications/verify-webhook-signature` 服务端验签。

> 机密：本地写 `.dev.vars`（已 gitignore）；生产 `wrangler pages secret put <NAME>` 或 CF Pages Dashboard。
> 非机密可写 `wrangler.toml [vars]`。

---

## 4. 端到端链路（代码已就绪）

### 4a. 邮件双确认
```
POST /api/v1/newsletter → KV pending → createConfirmToken(HMAC) → Resend 发确认邮件
用户点链接 → GET /api/v1/newsletter-confirm?token=... → 验签/过期 → KV pending→confirmed
```

### 4b. 订阅支付（Lemon Squeezy）
```
订阅墙额度耗尽 → PremiumGate「Checkout」
  → POST /api/v1/checkout（JWT 取 userId 作 custom_data.user_id）
  → createCheckoutSession → Lemon Squeezy 创建 checkout → 返回托管收银台 URL → 前端 redirect
付款成功 → LS 回调 POST /api/v1/ls-webhook
  → X-Signature = HMAC-SHA256(secret, rawBody) 验签
  → 成功事件(subscription_* / order_created) → AUTH_KV 写 sub:<userId> = { tier:'premium', source:'lemonsqueezy' }
回访 → GET /api/v1/subscription → tier=premium 解锁
```
未配 `PAYMENT_PROVIDER` → 503，前端降级 `/login`。

---

## 5. 账号到位后的逐步激活手册

### A. 邮件（Resend）
1. Resend → Domains → Add Domain，DNS 加 SPF/DKIM/MX 并验证。
2. Resend → API Keys → 建 sending key，复制 `re_...`。
3. 生产：`wrangler pages secret put RESEND_API_KEY`；`wrangler.toml [vars]` 加 `MAIL_FROM`、`MAIL_FROM_NAME`、`PUBLIC_SITE_URL`。
4. 本地 `.dev.vars` 填同值 → `pnpm dev` → 提交 newsletter 订阅 → 收信 → 点链接确认 KV 翻 `confirmed`。

### B. 支付（Lemon Squeezy，主）

> **⚠️ 提现前置条件（中国大陆区用户必读）**：Lemon Squeezy 对中国大陆区 **不支持 Stripe payouts，也不支持银行 payouts**，
> 唯一提现通道是**连接一个 PayPal 账户**。在 live 正式收款之前，**必须**由你本人在 LS 后台
>（Dashboard → Settings → Payments → Payouts）连接 PayPal 并完成 KYC / 账户激活——这一步只能你本人操作，
> 代码与部署都无法代办。未连 PayPal 时即便能收款，资金也无法提现。建议在首次 live 收款前完成。

1. 注册 Lemon Squeezy（个人即可，无需公司）→ Dashboard 设置店铺。
2. Dashboard → Products → 新建**订阅 recurring** 产品，记下其 **store id**；
   订阅变体 **TempoSoul Pro = `1356751`（已定，非保密）**，当前 Draft、CN¥9.99/年（定价待对齐，见 §7）。
3. Dashboard → Settings → API → Create API token，复制 `LEMONSQUEEZY_API_KEY`。
4. 配变量：
   - `wrangler pages secret put LEMONSQUEEZY_API_KEY`
   - `wrangler pages secret put LEMONSQUEEZY_WEBHOOK_SECRET`（步骤 5 创建 webhook 后拿）
   - `wrangler.toml [vars]`：`PAYMENT_PROVIDER="lemonsqueezy"`、`LEMONSQUEEZY_STORE_ID`；
     `LEMONSQUEEZY_VARIANT_ID="1356751"` 已在本文件写为默认值，无需再改。
5. Dashboard → Settings → Webhooks → Add endpoint：
   - URL：`https://<域名>/api/v1/ls-webhook`
   - 订阅事件：`subscription_created`、`subscription_payment_success`、`order_created`
   - 复制 Signing Secret → 写入 `LEMONSQUEEZY_WEBHOOK_SECRET`。
6. 走一笔测试：Checkout → 付款成功 → 回访 `/api/v1/subscription` 应返回 `tier=premium`。
7. 长期：若 LS 迁到 Stripe Managed Payments，仅替换 `src/lib/server/payment.ts` 内实现，前端与 webhook 契约不变。

### C. 两条 live 路径（中国区现状）

> **LS 中国区实测受限**：Stripe Tax 表单无法设置；账户激活 / KYC 页被重定向回 payouts；
> 商店卡在测试模式。提现见 §B 前置条件（中国区只能连 PayPal）。

**路径 A — 联系 Lemon Squeezy 支持开中国区激活**
1. 用 LS 测试 key（`LEMONSQUEEZY_*` sandbox/test）先把链路联调通（步骤 B 全流程）。
2. 邮件 LS support（reply 工单 / chat）申请人工审核中国区激活、开启 live 收款；
   提供 PayPal 作为提现账户。
3. 审核通过后 `PAYMENT_PROVIDER=lemonsqueezy` 直接 live，享 MoR 5%+$0.50 低费率。
4. env：同 §3.3（`LEMONSQUEEZY_API_KEY/STORE_ID/VARIANT_ID/WEBHOOK_SECRET`）。

**路径 B — PayPal 直连收款（当前推荐的 live 兜底，代码已就绪）**
1. 用已有 PayPal（ferryoran@outlook.com）→ Developer Dashboard 建 REST app，拿 `CLIENT_ID`/`SECRET`。
2. 建 billing plan（月付 / 年付各一个 plan），记下 `PAYPAL_PLAN_ID`。
3. 建 Webhook：URL `https://<域名>/api/v1/paypal-webhook`，订阅
   `BILLING.SUBSCRIPTION.ACTIVATED` / `BILLING.SUBSCRIPTION.RENEWED` / `PAYMENT.SALE.COMPLETED`，记 `PAYPAL_WEBHOOK_ID`。
4. 配变量：`PAYMENT_PROVIDER=paypal`、`PAYPAL_MODE=sandbox`（先测）→ 测通改 `live`；
   `wrangler pages secret put PAYPAL_CLIENT_SECRET`；其余非机密写 `[vars]`。
5. 注意：PayPal 费率 ~7–10%、新号有冻结/风控期，先 sandbox 跑通再切 live。

> **当前推荐**：先用 **LS 测试模式**（test key）联调 Checkout→webhook→premium 全链路；
> live 阶段若 LS 中国区激活仍被卡，直接切 **路径 B PayPal 直连** 兜底收款。两条路同一套前端与落库逻辑。

### D. 隐私联系邮箱（已落地）
- 已在 7 个语种 `privacy.s5B1` 写入 `ferryoran@outlook.com`，见
  `2026-09-12-privacy-contact-placeholders.md`。

---

## 6. 安全与合规
- 全部密钥走 env/secret，仓库零硬编码（已 grep 复核）。
- 确认邮件只含收件人本人邮箱与确认链接；支付 webhook 常量时间验签。
- 未登录下单（anonymous）不回写账户档位。
- 本线程不部署、不合 main、不 bump sw；push 仅到 `solaroran-rgb` 的 `thread/commerce`。

---

## 7. 定价建议（仅结论，不改线上定价）

**解锁内容**（`src/components/PremiumGate.tsx` perks）：① 无限次 AI 深度解读；② 专业级合盘 / 择日报告；
③ 新体系优先体验。本质是**取消每日 5 次免费 AI 额度、无限 AI 对话**——核心可变成本是 AI 推理 token。

**为什么 ¥9.99/年 过低**：
- ¥9.99/年 ≈ **US$1.4/年**。LS 抽成 5% + $0.50/笔 ≈ $0.57，年净收入仅 ~$0.83。
- 一次 AI 深度解读的 token 成本约 US$0.02–0.10（视模型/长度），重度用户一周内（20+ 次）就会烧掉全年收入；
  「无限」在这个价位上是**成本套利漏洞**，而非福利。
- 此外未覆盖任何支持 / 客服 / 退款 / 拒付成本，也远低于同类占星订阅锚点（Co-Star / Sanctuary 等多在 $10–30/年或 $5–15/月）。

**建议锚点（美元锚定、LS 作为 MoR 代扣全球税）**：
| 档 | 建议价 | 说明 |
| --- | --- | --- |
| **年付锚点** | **US$29/年**（≈ ¥210） | 折合约 $2.4/月，对标行业 $30/年档略低获客；扣费后年净 ~$27，可覆盖合理 AI token 与支持成本 |
| **月付锚点** | **US$9.99/月**（≈ ¥72） | 给犹豫用户低门槛试用；年付相当于月付的 ~29%，强引导年付 |

**落地动作（账号/运营侧，非代码）**：live 前在 LS Dashboard 把 variant `1356751` 从 Draft 的 ¥9.99/年
改为上述 USD 价（或新建一个 US$9.99/月的月付 variant，`LEMONSQUEEZY_VARIANT_ID` 换为该月付 variant 即可切档；
代码与 webhook 无需改动）。当前 ¥9.99/年仅作占位，**不建议以此价格 live**。
