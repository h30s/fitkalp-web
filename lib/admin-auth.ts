import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const COOKIE_NAME = 'fitkalp_admin_session';
const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Dynamically parse .env.local on disk so local edits take effect immediately
 * even if the dev server was started earlier without a restart.
 */
function readEnvLocal(): Record<string, string> {
  const envMap: Record<string, string> = {};
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      content.split('\n').forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const idx = trimmed.indexOf('=');
          const key = trimmed.substring(0, idx).trim();
          let val = trimmed.substring(idx + 1).trim();
          // Remove wrapping quotes if present
          if (
            (val.startsWith('"') && val.endsWith('"')) ||
            (val.startsWith("'") && val.endsWith("'"))
          ) {
            val = val.slice(1, -1);
          }
          envMap[key] = val;
        }
      });
    }
  } catch {
    // ignore
  }
  return envMap;
}

/**
 * Fetches the active admin authentication credentials dynamically.
 * Prioritizes direct file read (.env.local) for instant local updates, then falls back to process.env.
 */
export function getAdminConfig() {
  const localEnv = readEnvLocal();
  const p1 = (localEnv.ADMIN_PASSWORD_1 || process.env.ADMIN_PASSWORD_1 || '').trim();
  const p2 = (localEnv.ADMIN_PASSWORD_2 || process.env.ADMIN_PASSWORD_2 || '').trim();
  const p3 = (localEnv.ADMIN_PASSWORD_3 || process.env.ADMIN_PASSWORD_3 || '').trim();
  const secret = (localEnv.ADMIN_SECRET_KEY || process.env.ADMIN_SECRET_KEY || '').trim();

  return { p1, p2, p3, secret };
}

/**
 * Checks if the 3-password authentication system is properly configured in environment variables.
 */
export function isAdminConfigured(): boolean {
  const { p1, p2, p3, secret } = getAdminConfig();
  return Boolean(p1 && p2 && p3 && secret);
}

/**
 * Validates all 3 passwords simultaneously using constant-time hashing & comparison.
 * Returns true ONLY if all 3 passwords match the configured environment variables.
 */
export function verifyTriplePassword(p1?: string, p2?: string, p3?: string): boolean {
  const config = getAdminConfig();

  if (!config.p1 || !config.p2 || !config.p3 || !config.secret) {
    console.error('[admin-auth] Admin passwords or AUTH_SECRET not configured in environment variables.');
    return false;
  }

  if (typeof p1 !== 'string' || typeof p2 !== 'string' || typeof p3 !== 'string') {
    return false;
  }

  const cleanP1 = p1.trim();
  const cleanP2 = p2.trim();
  const cleanP3 = p3.trim();

  // Use SHA-256 digests to ensure fixed 32-byte buffers for timingSafeEqual
  const h1Input = crypto.createHash('sha256').update(cleanP1).digest();
  const h1Target = crypto.createHash('sha256').update(config.p1).digest();
  const match1 = crypto.timingSafeEqual(h1Input, h1Target);

  const h2Input = crypto.createHash('sha256').update(cleanP2).digest();
  const h2Target = crypto.createHash('sha256').update(config.p2).digest();
  const match2 = crypto.timingSafeEqual(h2Input, h2Target);

  const h3Input = crypto.createHash('sha256').update(cleanP3).digest();
  const h3Target = crypto.createHash('sha256').update(config.p3).digest();
  const match3 = crypto.timingSafeEqual(h3Input, h3Target);

  // Must match all three simultaneously
  return match1 && match2 && match3;
}

/**
 * Creates a cryptographically signed session token for authenticated admin sessions.
 */
export function createAdminToken(): string {
  const { secret } = getAdminConfig();
  if (!secret) {
    throw new Error('ADMIN_SECRET_KEY is not configured.');
  }
  const timestamp = Date.now().toString();
  const hmac = crypto.createHmac('sha256', secret).update(`admin:${timestamp}`).digest('hex');
  return `${timestamp}.${hmac}`;
}

/**
 * Verifies the authenticity and expiration of an admin session token in constant time.
 */
export function verifyAdminToken(token?: string | null): boolean {
  const { secret } = getAdminConfig();
  if (!token || typeof token !== 'string' || !secret) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [timestampStr, providedHmac] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  // Enforce session expiration (24 hours)
  if (Date.now() - timestamp > SESSION_MAX_AGE_MS || timestamp > Date.now() + 60000) {
    return false;
  }

  const expectedHmac = crypto.createHmac('sha256', secret).update(`admin:${timestampStr}`).digest('hex');

  const providedHash = crypto.createHash('sha256').update(providedHmac).digest();
  const expectedHash = crypto.createHash('sha256').update(expectedHmac).digest();

  try {
    return crypto.timingSafeEqual(providedHash, expectedHash);
  } catch {
    return false;
  }
}

/**
 * Validates request authorization strictly via signed session token (Cookie or Bearer token).
 * Raw passwords and query string parameters are strictly rejected.
 */
export function isAuthenticatedAdmin(request: NextRequest): boolean {
  if (!isAdminConfigured()) {
    return false;
  }

  // 1. Check HTTP-only cookie
  const cookieToken = request.cookies.get(COOKIE_NAME)?.value;
  if (cookieToken && verifyAdminToken(cookieToken)) {
    return true;
  }

  // 2. Check Authorization Bearer header (signed token only)
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const bearerToken = authHeader.substring(7).trim();
    if (verifyAdminToken(bearerToken)) {
      return true;
    }
  }

  // 3. Check custom header (signed token only)
  const adminKey = request.headers.get('x-admin-key');
  if (adminKey && verifyAdminToken(adminKey.trim())) {
    return true;
  }

  return false;
}

/**
 * Sets secure HTTP-only admin session cookie.
 */
export function setAdminCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 24 * 60 * 60, // 24 hours
  });
}

/**
 * Clears the admin session cookie on logout.
 */
export function clearAdminCookie(response: NextResponse) {
  response.cookies.set({
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}
