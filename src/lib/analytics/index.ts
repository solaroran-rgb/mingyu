export type AnalyticsProvider = 'plausible' | 'umami' | 'ga' | 'cf' | 'none';

export type AnalyticsConfig = {
  provider: AnalyticsProvider;
  url?: string;
  siteId?: string;
};

type RuntimeAnalytics = {
  analyticsProvider?: string;
  analyticsUrl?: string;
  analyticsSiteId?: string;
};

let current: AnalyticsConfig = { provider: 'none' };
let initialized = false;

function castWindow(): { __TEMPOSOUL_RUNTIME_CONFIG__?: RuntimeAnalytics } {
  return window as unknown as { __TEMPOSOUL_RUNTIME_CONFIG__?: RuntimeAnalytics };
}

export function initAnalyticsFromRuntime(): void {
  if (initialized) return;
  initialized = true;
  const rt = castWindow().__TEMPOSOUL_RUNTIME_CONFIG__;
  if (rt?.analyticsProvider && rt.analyticsProvider !== 'none') {
    const provider = rt.analyticsProvider as AnalyticsProvider;
    const cfg: AnalyticsConfig = { provider, url: rt.analyticsUrl, siteId: rt.analyticsSiteId };
    current = cfg;
    injectScript(cfg);
  }
}

function injectScript(cfg: AnalyticsConfig): void {
  if (cfg.provider === 'none' || !cfg.url || !cfg.siteId) return;
  if (document.getElementById(`analytics-${cfg.provider}`)) return;

  const s = document.createElement('script');
  s.id = `analytics-${cfg.provider}`;
  s.async = true;
  s.defer = true;

  if (cfg.provider === 'plausible') {
    s.src = cfg.url;
    s.setAttribute('data-domain', cfg.siteId);
  } else if (cfg.provider === 'umami') {
    s.src = cfg.url;
    s.setAttribute('data-website-id', cfg.siteId);
  } else if (cfg.provider === 'ga') {
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(cfg.siteId)}`;
  } else if (cfg.provider === 'cf') {
    // Cloudflare Web Analytics（免费）：beacon.min.js + data-cf-beacon
    s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    s.setAttribute('data-cf-beacon', JSON.stringify({ token: cfg.siteId, spa: true }));
  }
  document.head.appendChild(s);
}

export function trackPageView(path: string): void {
  if (current.provider === 'none' || current.provider === 'cf') return;
  const w = window as unknown as { plausible?: (e: string, o?: unknown) => void; umami?: (e: string, o?: unknown) => void };
  if (current.provider === 'plausible' && w.plausible) {
    w.plausible('pageview', { u: path });
  } else if (current.provider === 'umami' && w.umami) {
    w.umami('pageview', { url: path });
  }
}

export function trackEvent(name: string, props?: Record<string, unknown>): void {
  if (current.provider === 'none' || current.provider === 'cf') return;
  const w = window as unknown as { plausible?: (e: string, o?: unknown) => void; umami?: (e: string, o?: unknown) => void };
  if (current.provider === 'plausible' && w.plausible) {
    w.plausible(name, props);
  } else if (current.provider === 'umami' && w.umami) {
    w.umami('event', { name, props });
  }
}
