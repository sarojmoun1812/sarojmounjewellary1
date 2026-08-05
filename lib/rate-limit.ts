import { NextRequest, NextResponse } from "next/server";

/**
 * A small in-memory sliding-window limiter for the public write endpoints.
 *
 * Deliberately simple: state lives in the process, so it resets on deploy and
 * is not shared between serverless instances. That is enough to stop a script
 * filling the database with junk orders or guessing an admin password, which is
 * the actual risk at this shop's traffic. Move to a shared store (Upstash,
 * Redis) if the site ever runs more than one instance under real load.
 */

type Bucket = { hits: number[]; };

const buckets = new Map<string, Bucket>();

/** Stop the map growing without bound on a long-lived process. */
const MAX_TRACKED_KEYS = 10_000;

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): RateLimitResult {
  const now = Date.now();
  const cutoff = now - windowMs;

  if (buckets.size > MAX_TRACKED_KEYS) {
    buckets.clear();
  }

  const bucket = buckets.get(key) ?? { hits: [] };
  const hits = bucket.hits.filter((time) => time > cutoff);

  if (hits.length >= limit) {
    const oldest = hits[0];
    buckets.set(key, { hits });
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((oldest + windowMs - now) / 1000)),
    };
  }

  hits.push(now);
  buckets.set(key, { hits });

  return {
    allowed: true,
    remaining: limit - hits.length,
    retryAfterSeconds: 0,
  };
}

/**
 * Returns a 429 response when the caller has exceeded the limit, or null when
 * the request should proceed.
 */
export function enforceRateLimit(
  request: NextRequest,
  scope: string,
  options: { limit: number; windowMs: number; message?: string }
): NextResponse | null {
  const result = rateLimit(`${scope}:${getClientIp(request)}`, options);

  if (result.allowed) return null;

  return NextResponse.json(
    {
      error:
        options.message ?? "Too many requests. Please wait a moment and try again.",
    },
    {
      status: 429,
      headers: { "Retry-After": String(result.retryAfterSeconds) },
    }
  );
}
