import { NextRequest, NextResponse } from 'next/server';
import { validateReferralCode } from '@/lib/referrals';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code') || '';

  if (!code.trim()) {
    return NextResponse.json({ valid: false, error: 'Please enter a referral code.' }, { status: 400 });
  }

  const result = validateReferralCode(code);
  return NextResponse.json(result);
}
