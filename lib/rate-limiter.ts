import { NextRequest } from 'next/server';

interface RateLimitRecord {
  failedAttempts: number;
  firstAttemptTime: number;
  lastAttemptTime: number;
  lockedUntil: number;
}

// In-memory rate limiting cache
const rateLimitStore = new Map<string, RateLimitRecord>();

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes window

/**
 * Clean up old expired entries periodically
 */
function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (record.lockedUntil > 0 && record.lockedUntil < now) {
      rateLimitStore.delete(key);
    } else if (now - record.lastAttemptTime > ATTEMPT_WINDOW_MS && record.lockedUntil === 0) {
      rateLimitStore.delete(key);
    }
  }
}

// Run cleanup every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredEntries, 10 * 60 * 1000);
}

/**
 * Extracts client IP from request headers safely.
 */
export function getClientIp(request: NextRequest): string {
  // Check Cloudflare / Reverse Proxy headers
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp.trim();

  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    const ips = xForwardedFor.split(',');
    if (ips.length > 0 && ips[0].trim()) {
      return ips[0].trim();
    }
  }

  const xRealIp = request.headers.get('x-real-ip');
  if (xRealIp) return xRealIp.trim();

  return '127.0.0.1';
}

/**
 * Check whether a client IP is currently rate limited or locked out.
 */
export function checkRateLimit(ip: string): {
  isBlocked: boolean;
  remainingAttempts: number;
  lockoutRemainingMs: number;
} {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record) {
    return {
      isBlocked: false,
      remainingAttempts: MAX_FAILED_ATTEMPTS,
      lockoutRemainingMs: 0,
    };
  }

  // Check if currently locked out
  if (record.lockedUntil > now) {
    return {
      isBlocked: true,
      remainingAttempts: 0,
      lockoutRemainingMs: record.lockedUntil - now,
    };
  }

  // If lockout expired, reset
  if (record.lockedUntil > 0 && record.lockedUntil <= now) {
    rateLimitStore.delete(ip);
    return {
      isBlocked: false,
      remainingAttempts: MAX_FAILED_ATTEMPTS,
      lockoutRemainingMs: 0,
    };
  }

  // If window has passed since last attempt, reset
  if (now - record.firstAttemptTime > ATTEMPT_WINDOW_MS) {
    rateLimitStore.delete(ip);
    return {
      isBlocked: false,
      remainingAttempts: MAX_FAILED_ATTEMPTS,
      lockoutRemainingMs: 0,
    };
  }

  const remaining = Math.max(0, MAX_FAILED_ATTEMPTS - record.failedAttempts);
  return {
    isBlocked: remaining <= 0,
    remainingAttempts: remaining,
    lockoutRemainingMs: 0,
  };
}

/**
 * Records a failed authentication attempt for a given IP.
 */
export function recordFailedAttempt(ip: string): {
  isBlocked: boolean;
  remainingAttempts: number;
  lockoutRemainingMs: number;
} {
  const now = Date.now();
  let record = rateLimitStore.get(ip);

  if (!record || now - record.firstAttemptTime > ATTEMPT_WINDOW_MS) {
    record = {
      failedAttempts: 1,
      firstAttemptTime: now,
      lastAttemptTime: now,
      lockedUntil: 0,
    };
  } else {
    record.failedAttempts += 1;
    record.lastAttemptTime = now;
  }

  if (record.failedAttempts >= MAX_FAILED_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION_MS;
    rateLimitStore.set(ip, record);
    return {
      isBlocked: true,
      remainingAttempts: 0,
      lockoutRemainingMs: LOCKOUT_DURATION_MS,
    };
  }

  rateLimitStore.set(ip, record);
  const remaining = Math.max(0, MAX_FAILED_ATTEMPTS - record.failedAttempts);

  return {
    isBlocked: false,
    remainingAttempts: remaining,
    lockoutRemainingMs: 0,
  };
}

/**
 * Resets rate limit record on successful login.
 */
export function resetRateLimit(ip: string) {
  rateLimitStore.delete(ip);
}
