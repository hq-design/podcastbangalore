import posthog from "posthog-js";

export const ANALYTICS_EVENTS = {
  PAGE_VIEW: "page_view",
  HERO_CTA: "cta_hero_click",
  FAB_CTA: "cta_fab_click",
  SECTION_VIEW: "section_view",
  BOOKING_OPENED: "booking_opened",
  BOOKING_COMPLETED: "booking_completed",
  QUOTE_CALCULATED: "quote_calculated",
  AUDIO_SAMPLE_PLAYED: "audio_sample_played",
  GALLERY_OPENED: "gallery_opened",
  AVAILABILITY_REFRESH: "availability_refresh",
  CONTACT_SUBMITTED: "contact_submitted",
  CONTACT_FAILED: "contact_failed",
} as const;

type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

let initialized = false;

export function initAnalytics() {
  if (initialized || typeof window === "undefined") return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;
  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com",
    capture_pageview: false,
  });
  initialized = true;
}

export function trackEvent(event: AnalyticsEvent, properties?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (!initialized) {
    initAnalytics();
  }
  posthog.capture(event, properties);
}

export function identifyUser(distinctId: string, properties?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (!initialized) {
    initAnalytics();
  }
  posthog.identify(distinctId, properties);
}
