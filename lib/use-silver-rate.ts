"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_LABOUR_PER_GRAM,
  FALLBACK_SILVER_RATE_PER_GRAM,
  isPlausibleRate,
} from "@/lib/pricing";

/**
 * The current silver rate and labour charge, for the few places that need them
 * in the browser: the rate badge and the live price preview in the admin form.
 *
 * The fallback used to be ₹95/g, which is under half the real market rate, so a
 * failed fetch quietly halved every price shown. It now shares the same
 * constant as the server.
 *
 * updatedAt is whatever the server reports, not the moment the fetch returned.
 * Stamping it with the current time made a week-old rate look freshly updated,
 * which is exactly the situation someone needs to be able to see.
 */
export function useSilverRate() {
  const [silverRate, setSilverRate] = useState(FALLBACK_SILVER_RATE_PER_GRAM);
  const [labourPerGram, setLabourPerGram] = useState(DEFAULT_LABOUR_PER_GRAM);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/silver-rate");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        if (cancelled) return;

        if (isPlausibleRate(data.ratePerGram)) {
          setSilverRate(data.ratePerGram);
        }
        if (typeof data.labourPerGram === "number" && data.labourPerGram > 0) {
          setLabourPerGram(data.labourPerGram);
        }
        setLastUpdated(data.updatedAt ? new Date(data.updatedAt) : null);
      } catch (error) {
        console.error("[silver-rate] Could not load the rate:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    const interval = setInterval(load, 6 * 60 * 60 * 1000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return { silverRate, labourPerGram, loading, lastUpdated };
}
