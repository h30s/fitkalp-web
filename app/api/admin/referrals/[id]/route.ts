import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticatedAdmin } from '@/lib/admin-auth';
import { updateReferralCode, deleteReferralCode } from '@/lib/referrals';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  if (!isAuthenticatedAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { id } = await context.params;
  try {
    const body = await request.json();
    const updated = updateReferralCode(id, body);

    if (!updated) {
      return NextResponse.json({ error: 'Referral code not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, referral: updated });
  } catch (error) {
    console.error('[admin/referrals/id] Update failed:', error);
    return NextResponse.json({ error: 'Failed to update referral code.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  if (!isAuthenticatedAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { id } = await context.params;
  const deleted = deleteReferralCode(id);

  if (!deleted) {
    return NextResponse.json({ error: 'Referral code not found.' }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: 'Referral code deleted.' });
}
