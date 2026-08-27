import { NextRequest, NextResponse } from 'next/server';
import {
  verifyTriplePassword,
  createAdminToken,
  isAuthenticatedAdmin,
  isAdminConfigured,
  setAdminCookie,
  clearAdminCookie,
} from '@/lib/admin-auth';
import {
  getClientIp,
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
} from '@/lib/rate-limiter';

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);

    // 1. Enforce Rate Limiting & Lockout
    const rateLimit = checkRateLimit(clientIp);
    if (rateLimit.isBlocked) {
      const minutesRemaining = Math.ceil(rateLimit.lockoutRemainingMs / (60 * 1000));
      return NextResponse.json(
        {
          error: `Too many failed attempts. Access is locked. Please try again in ${minutesRemaining} minute(s).`,
          isLocked: true,
          lockoutRemainingMs: rateLimit.lockoutRemainingMs,
          remainingAttempts: 0,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil(rateLimit.lockoutRemainingMs / 1000)),
          },
        }
      );
    }

    // 2. Check if server environment variables are configured
    if (!isAdminConfigured()) {
      return NextResponse.json(
        {
          error: 'Admin authentication is not configured in server environment variables (ADMIN_PASSWORD_1, ADMIN_PASSWORD_2, ADMIN_PASSWORD_3, ADMIN_SECRET_KEY).',
          isConfigured: false,
        },
        { status: 503 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const p1 = body.password1 ?? body.passwordOne ?? '';
    const p2 = body.password2 ?? body.passwordTwo ?? '';
    const p3 = body.password3 ?? body.passwordThree ?? '';

    // 3. Verify all 3 passwords simultaneously
    const isValid = verifyTriplePassword(p1, p2, p3);

    if (!isValid) {
      const failure = recordFailedAttempt(clientIp);
      if (failure.isBlocked) {
        const minutesRemaining = Math.ceil(failure.lockoutRemainingMs / (60 * 1000));
        return NextResponse.json(
          {
            error: `Maximum attempts exceeded. Access locked for ${minutesRemaining} minutes.`,
            isLocked: true,
            lockoutRemainingMs: failure.lockoutRemainingMs,
            remainingAttempts: 0,
          },
          {
            status: 429,
            headers: {
              'Retry-After': String(Math.ceil(failure.lockoutRemainingMs / 1000)),
            },
          }
        );
      }

      return NextResponse.json(
        {
          error: 'Invalid administrator credentials. All three keys must match.',
          remainingAttempts: failure.remainingAttempts,
          isLocked: false,
        },
        { status: 401 }
      );
    }

    // 4. Success -> Reset rate limit for this IP
    resetRateLimit(clientIp);

    const token = createAdminToken();
    const response = NextResponse.json({
      success: true,
      token,
      message: 'Admin credentials verified. Access granted.',
    });

    setAdminCookie(response, token);
    return response;
  } catch (error) {
    console.error('[admin/auth] POST error:', error);
    return NextResponse.json({ error: 'Authentication failed.' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(clientIp);
  const isAuth = isAuthenticatedAdmin(request);
  const configured = isAdminConfigured();

  return NextResponse.json({
    authenticated: isAuth,
    isConfigured: configured,
    isLocked: rateLimit.isBlocked,
    remainingAttempts: rateLimit.remainingAttempts,
    lockoutRemainingMs: rateLimit.lockoutRemainingMs,
  });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully.' });
  clearAdminCookie(response);
  return response;
}
