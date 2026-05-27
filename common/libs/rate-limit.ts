/**
 * Simple in-memory rate limiter for Next.js API routes.
 * For production at scale, replace with Redis-backed solution.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean expired entries every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) store.delete(key);
  }
}, 5 * 60 * 1000);

interface RateLimitOptions {
  /** Max requests per window */
  limit: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

/**
 * Get client IP from request headers (Vercel-compatible).
 */
export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

/**
 * Check if the given IP has exceeded the rate limit.
 * Returns `{ limited: false }` if allowed, or `{ limited: true, retryAfter }` if blocked.
 */
export function checkRateLimit(
  key: string,
  options: RateLimitOptions
): { limited: false } | { limited: true; retryAfter: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    // First request or window expired — reset counter
    store.set(key, { count: 1, resetAt: now + options.windowMs });
    return { limited: false };
  }

  if (entry.count >= options.limit) {
    return { limited: true, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count++;
  return { limited: false };
}

/**
 * Predefined rate limit presets.
 */
export const RATE_LIMITS = {
  /** Strict limit for AI/LLM endpoints */
  ai: { limit: 20, windowMs: 60 * 1000 },
  /** Contact & email forms */
  contact: { limit: 3, windowMs: 15 * 60 * 1000 },
  /** Guestbook submissions */
  guestbook: { limit: 5, windowMs: 60 * 1000 },
  /** General public API */
  general: { limit: 60, windowMs: 60 * 1000 },
} as const;
