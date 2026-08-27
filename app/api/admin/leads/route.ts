import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticatedAdmin } from '@/lib/admin-auth';
import { getAllLeads, getLeadStats, createLead, getReferralLeaderboard } from '@/lib/leads';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  if (!isAuthenticatedAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const status = searchParams.get('status');
  const search = (searchParams.get('search') || '').toLowerCase();
  const service = searchParams.get('service');
  const ref = (searchParams.get('ref') || '').toUpperCase();

  let leads = getAllLeads();

  if (type && type !== 'ALL') {
    leads = leads.filter((l) => l.type === type);
  }

  if (status && status !== 'ALL') {
    leads = leads.filter((l) => l.status === status);
  }

  if (service && service !== 'ALL') {
    leads = leads.filter((l) => (l.serviceInterest || '').toUpperCase() === service.toUpperCase());
  }

  if (ref && ref !== 'ALL') {
    leads = leads.filter((l) => (l.referralCode || '').toUpperCase() === ref);
  }

  if (search) {
    leads = leads.filter(
      (l) =>
        l.contactName.toLowerCase().includes(search) ||
        l.gymName.toLowerCase().includes(search) ||
        l.phone.toLowerCase().includes(search) ||
        l.email.toLowerCase().includes(search) ||
        l.city.toLowerCase().includes(search) ||
        (l.referralCode || '').toLowerCase().includes(search) ||
        (l.onboardingInformation || '').toLowerCase().includes(search)
    );
  }

  const stats = getLeadStats();
  const referralLeaderboard = getReferralLeaderboard();

  return NextResponse.json({
    leads,
    stats,
    referrals: referralLeaderboard,
    totalCount: leads.length,
  });
}

export async function POST(request: NextRequest) {
  if (!isAuthenticatedAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const newLead = createLead({
      ...body,
      source: body.source || 'Admin Manual Entry',
      status: body.status || 'NEW',
    });

    return NextResponse.json({ success: true, lead: newLead });
  } catch (error) {
    console.error('[admin/leads] Create lead failed:', error);
    return NextResponse.json({ error: 'Failed to create lead.' }, { status: 500 });
  }
}
