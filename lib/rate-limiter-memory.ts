// lib/rate-limiter-memory.ts
// Simple in-memory rate limiter for development/fallback

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyPrefix?: string;
}

export interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

const stores = new Map<string, Map<string, RateLimitEntry>>();

export function createRateLimiter(config: RateLimitConfig): RateLimiter {
  const { windowMs, maxRequests, keyPrefix = "rl" } = config;
  const store = new Map<string, RateLimitEntry>();
  stores.set(keyPrefix, store);

  return {
    check: (key: string): RateLimitResult => {
      const fullKey = `${keyPrefix}:${key}`;
      const now = Date.now();
      const entry = store.get(fullKey);

      if (!entry || now > entry.resetTime) {
        const resetTime = now + windowMs;
        store.set(fullKey, { count: 1, resetTime });
        return { allowed: true, remaining: maxRequests - 1, resetTime };
      }

      if (entry.count >= maxRequests) {
        return { allowed: false, remaining: 0, resetTime: entry.resetTime };
      }

      entry.count++;
      store.set(fullKey, entry);
      return { allowed: true, remaining: maxRequests - entry.count, resetTime: entry.resetTime };
    },

    cleanup: () => {
      const now = Date.now();
      for (const [key, entry] of store.entries()) {
        if (now > entry.resetTime) store.delete(key);
      }
    },

    reset: (key: string) => {
      store.delete(`${keyPrefix}:${key}`);
    },
  };
}

export interface RateLimiter {
  check: (key: string) => RateLimitResult;
  cleanup: () => void;
  reset: (key: string) => void;
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

// Pre-configured limiters (used as fallback)
export const chatRateLimiter = createRateLimiter({
  windowMs: 60_000,
  maxRequests: 10,
  keyPrefix: "chat",
});

export const summaryRateLimiter = createRateLimiter({
  windowMs: 60_000,
  maxRequests: 5,
  keyPrefix: "summary",
});

export const compatibilityRateLimiter = createRateLimiter({
  windowMs: 60_000,
  maxRequests: 5,
  keyPrefix: "compatibility",
});

export const generateKundaliRateLimiter = createRateLimiter({
  windowMs: 60_000,
  maxRequests: 3,
  keyPrefix: "kundali",
});

export const authRateLimiter = createRateLimiter({
  windowMs: 60_000,
  maxRequests: 5,
  keyPrefix: "auth",
});