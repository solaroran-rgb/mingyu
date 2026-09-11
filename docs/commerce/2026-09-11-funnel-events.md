# 商业化漏斗事件 T0-T5 定义与接入

> 线程 thread-g8-commerce · 2026-09-11
> 基础设施：`src/lib/analytics/index.ts`（provider：plausible / umami / ga / cf / none）
> 生产默认 provider = `cf`（Cloudflare Web Analytics，免费）。本线程为 cf provider 补全自定义事件上报通道。

## 1. 总览

| 步骤 | 事件名 | 含义 | 触发代码点 |
| --- | --- | --- | --- |
| T0 | `chart_submit` | 排盘提交（校验通过、跳转结果页） | `src/pages/InputPage.tsx` `handleSubmit` |
| T1 | `chart_result` | 结果生成（结果页加载、排盘渲染） | `src/pages/ResultPage/index.tsx`（mount-once effect） |
| T2 | `ai_interpret` | AI 解读（初次解读 / 追问） | `src/hooks/useAiChat.ts` `analyze` / `ask` |
| T3 | `paywall_view` | 订阅墙触发（免费额度耗尽、升级卡片可见） | `src/components/PremiumGate.tsx`（state=locked） |
| T4 | `signup` | 注册成功 | `src/lib/auth/AuthContext.tsx` `register` |
| T5 | `subscribe` | 订阅（观测到 premium 档位） | `src/components/PremiumGate.tsx`（tier=premium） |

> 说明：任务代号为 T0-T6，本仓库当前显式落地的漏斗步骤为 T0-T5 六个事件；T6 及以后（如支付成功、续费、流失召回）待支付商户接入后再定义，不在本线程编造。

## 2. 上报通道与数据流向

- 统一入口 `trackEvent(name, props)`（`src/lib/analytics/index.ts`）。
- **cf（生产默认）**：`window._cf.push(['event', { name, ...props }])`，由 `beacon.min.js` 接管，进入 Cloudflare Web Analytics 的 Custom events 报表。
- **plausible**：`window.plausible(name, props)`。
- **umami**：`window.umami('event', { name, props })`。
- **none / ga**：none 直接丢弃（合规默认不采集）；ga 分支沿用现状（未在本线程扩展）。
- 漏斗专用包装函数：`trackChartSubmit / trackChartResult / trackAiInterpret / trackPaywallView / trackSignup / trackSubscribe`，常量见 `FUNNEL_EVENTS`。
- 隐私合规：所有事件只带结构化维度（mode / source / quota 等），**不上传手机号、姓名、出生时间等个人数据**；provider=none 时全量静默。

## 3. 各事件字段

### T0 `chart_submit`
- 触发：输入页所有校验通过、即将 `navigate('/result')`。
- 属性：
  - `mode`：`single` | `compatibility`（排盘模式）
  - `trueSolarTime`：是否使用真太阳时（boolean）

### T1 `chart_result`
- 触发：结果页挂载后只上报一次（ref 守卫，避免 SPA 重复进入重复计数）。
- 属性：
  - `mode`：`single` | `compatibility`
  - `promptSource`：`bazi` | `ziwei` | `astrolabe` | `qizheng` | `bazhai` 等

### T2 `ai_interpret`
- 触发：调用 AI 解读（`analyze` 初次解读；`ask` 追问）。
- 属性：
  - `source`：`initial`（初次解读）| `followup`（追问）

### T3 `paywall_view`
- 触发：`PremiumGate` 判定 `state=locked`（今日免费额度耗尽）渲染升级卡片时，每挂载只报一次。
- 属性：
  - `remaining`：触发时剩余免费次数（此时为 0）
  - `quota`：每日免费额度（默认 5）

### T4 `signup`
- 触发：注册接口返回 token+user、写入本地会话后。
- 属性：
  - `method`：注册方式（当前固定 `email`）

### T5 `subscribe`
- 触发：`PremiumGate` 拉取 `/api/v1/subscription` 返回 `tier=premium` 时，每挂载只报一次。
- 属性：
  - `tier`：固定 `premium`
- 备注：当前无支付商户，该事件覆盖「premium 用户回访观测」；未来支付回调（POST `/api/v1/subscription`）应在服务端成功后等价补发一次 `subscribe`，以闭环真实付费转化。

## 4. newsletter 订阅双确认（double opt-in）

与漏斗配套，落地邮件订阅的合法双确认：

- `POST /api/v1/newsletter`：新订阅写入 KV `newsletter_emails`，key=`email:<email>`，初始 `status='pending'`、`subscribed=false`；若环境变量 `AUTH_SECRET` 存在，则签发确认 token 并调用 `sendConfirmationEmail` 预留 hook（当前无邮件通道，hook 为空操作，不实际发信）。
- 确认端点 `GET /api/v1/newsletter-confirm?token=xxx`（`functions/api/v1/newsletter-confirm.ts`）：
  - token = `<b64url(payload)>.<b64url(hmac)>`，payload = `${email}.${expSec}`，签名 = `HMAC-SHA256(AUTH_SECRET, payload)`，base64url 无填充；有效期 7 天。
  - 状态机：`pending → confirmed`（写 `confirmedAt`、`subscribed=true`）。
  - 响应：
    - 有效 token + pending → `200 { ok:true, status:'confirmed' }`
    - 有效 token + 已 confirmed（含第一轮无 status、`subscribed:true` 的历史记录）→ `200 { ok:true, status:'confirmed', already:true }`（幂等，不覆盖 `confirmedAt`）
    - 过期 token（exp ≤ now）→ `410 { error:'token_expired' }`
    - 格式 / 签名错误 → `400 { error:'invalid_token' }`
    - token 合法但 KV 无记录 → `404 { error:'unknown_subscriber' }`
- 安全：`AUTH_SECRET` 仅从环境变量读取（`wrangler secret put AUTH_SECRET` 或 Pages 环境变量），代码中不硬编码。
- 测试：`tests/newsletter-confirm.test.ts`（三态 + 签名错误 + 未知订阅者，共 7 例）。

## 5. 待办（非本线程范围）

- 接入真实邮件通道（Resend / SendGrid / 腾讯 SES）后，实现 `sendConfirmationEmail`，确认链接形如 `/api/v1/newsletter-confirm?token=<token>`。
- 接入支付商户（Stripe / 支付宝）后，在支付回调补发服务端 `subscribe` 事件，并定义 T6+ 事件（如 `checkout_success`、`renew`、`churn`）。
