"use client";

import { useState, useEffect } from "react";
import { fetchSilverRate } from "@/lib/pricing";

/**
 * React hook to fetch and manage current silver rate
 * Auto-refreshes every 6 hours
 */
export function useSilverRate() {
  const [silverRate, setSilverRate] = useState<number>(95.0); // Default fallback
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    async function loadSilverRate() {
      setLoading(true);
      try {
        const rate = await fetchSilverRate();
        setSilverRate(rate);
        setLastUpdated(new Date());
      } catch (error) {
        console.error("Failed to load silver rate:", error);
        setSilverRate(95.0); // Fallback
      } finally {
        setLoading(false);
      }
    }

    loadSilverRate();

    // Refresh every 6 hours
    const interval = setInterval(loadSilverRate, 6 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return { silverRate, loading, lastUpdated };
}
