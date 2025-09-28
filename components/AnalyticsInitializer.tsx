"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { ANALYTICS_EVENTS, initAnalytics, trackEvent } from "@/lib/analytics";

export function AnalyticsInitializer() {
  const params = useSearchParams();

  useEffect(() => {
    initAnalytics();
    const payload: Record<string, string | null> = {
      utm_source: params.get("utm_source"),
      utm_medium: params.get("utm_medium"),
      utm_campaign: params.get("utm_campaign"),
    };
    trackEvent(ANALYTICS_EVENTS.PAGE_VIEW, payload);
  }, [params]);

  return null;
}
