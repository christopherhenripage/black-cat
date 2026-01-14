/**
 * Simple in-memory rate limiting for serverless environments
 *
 * LIMITATIONS:
 * - State is not shared across serverless instances
 * - Memory is cleared on cold starts
 * - Not suitable for high-traffic production use
 * - For production, consider using Redis, Upstash, or similar
 *
 * This implementation provides best-effort rate limiting that works
 * well enough for low-to-medium traffic sites on Vercel.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries periodically (every 100 requests)
let requestCount = 0;
const CLEANUP_INTERVAL = 100;

function cleanup() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}

export interface RateLimitConfig {
  maxRequests: number; // Maximum requests per window
  windowMs: number; // Window size in milliseconds
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = { maxRequests: 5, windowMs: 60000 } // 5 requests per minute
): RateLimitResult {
  const now = Date.now();

  // Periodic cleanup
  requestCount++;
  if (requestCount >= CLEANUP_INTERVAL) {
    cleanup();
    requestCount = 0;
  }

  const entry = rateLimitStore.get(identifier);

  // No existing entry or expired
  if (!entry || entry.resetTime < now) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(identifier, newEntry);
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetTime: newEntry.resetTime,
    };
  }

  // Entry exists and not expired
  if (entry.count >= config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment count
  entry.count++;
  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Get a rate limit identifier from request headers
 * Falls back to a generic identifier if no IP is available
 */
export function getRateLimitIdentifier(headers: Headers): string {
  // Try various headers that might contain the client IP
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback - less secure but better than nothing
  return "unknown-client";
}
