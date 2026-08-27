import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticatedAdmin } from '@/lib/admin-auth';
import {
  getAllReferralCodes,
  createReferralCode,
  getReferralCodesWithStats,
  generateStandardCode,
} from '@/lib/referrals';

export async function GET(request: NextRequest) {
  if (!isAuthenticatedAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const referralStats = getReferralCodesWithStats();
  return NextResponse.json({
    referrals: referralStats,
    totalCount: referralStats.length,
  });
}

export async function POST(request: NextRequest) {
  if (!isAuthenticatedAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (!body.referrerName || !body.referrerName.trim()) {
      return NextResponse.json({ error: 'Referrer Name is required.' }, { status: 400 });
    }

    const newCode = createReferralCode({
      referrerName: body.referrerName,
      code: body.code,
      referrerPhone: body.referrerPhone,
      referrerEmail: body.referrerEmail,
      notes: body.notes,
      rewardNotes: body.rewardNotes,
    });

    return NextResponse.json({ success: true, referral: newCode });
  } catch (error) {
    console.error('[admin/referrals] Create referral failed:', error);
    return NextResponse.json({ error: 'Failed to create referral code.' }, { status: 500 });
  }
}
