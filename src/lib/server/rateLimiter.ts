/**
 * In-memory sliding window rate limiter for production API protection.
 * Protects AI endpoints, Code Execution, and Submissions from spam & DoS.
 */

interface RateLimitRecord {
  timestamps: number[];
}

class SlidingWindowRateLimiter {
  private requests: Map<string, RateLimitRecord> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Periodically clean up stale client entries every 5 minutes to prevent memory leak
    if (typeof setInterval !== 'undefined') {
      this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
      if (this.cleanupInterval.unref) {
        this.cleanupInterval.unref();
      }
    }
  }

  /**
   * Checks if an IP or identifier has exceeded the allowed limit in the given window.
   * @param key Client IP or User ID
   * @param limit Max requests allowed
   * @param windowSeconds Window length in seconds (default 60s)
   */
  public check(
    key: string,
    limit: number = 60,
    windowSeconds: number = 60
  ): {
    allowed: boolean;
    remaining: number;
    resetInSeconds: number;
    total: number;
  } {
    const now = Date.now();
    const windowMs = windowSeconds * 1000;
    const windowStart = now - windowMs;

    let record = this.requests.get(key);
    if (!record) {
      record = { timestamps: [] };
      this.requests.set(key, record);
    }

    // Filter out timestamps outside the active window
    record.timestamps = record.timestamps.filter(ts => ts > windowStart);

    if (record.timestamps.length >= limit) {
      const oldestInWindow = record.timestamps[0];
      const resetInSeconds = Math.max(1, Math.ceil((oldestInWindow + windowMs - now) / 1000));
      return {
        allowed: false,
        remaining: 0,
        resetInSeconds,
        total: record.timestamps.length,
      };
    }

    // Record this request
    record.timestamps.push(now);
    const remaining = Math.max(0, limit - record.timestamps.length);

    return {
      allowed: true,
      remaining,
      resetInSeconds: windowSeconds,
      total: record.timestamps.length,
    };
  }

  private cleanup(): void {
    const now = Date.now();
    const threshold = now - 10 * 60 * 1000; // 10 minutes ago
    for (const [key, record] of this.requests.entries()) {
      record.timestamps = record.timestamps.filter(ts => ts > threshold);
      if (record.timestamps.length === 0) {
        this.requests.delete(key);
      }
    }
  }
}

// Global singleton across serverless invokes in the same process
declare global {
  // eslint-disable-next-line no-var
  var __globalRateLimiter__: SlidingWindowRateLimiter | undefined;
}

export const globalRateLimiter =
  globalThis.__globalRateLimiter__ || (globalThis.__globalRateLimiter__ = new SlidingWindowRateLimiter());

/**
 * Extracts best guess client IP from Next.js request headers
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  const cfIp = req.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();
  return '127.0.0.1';
}
