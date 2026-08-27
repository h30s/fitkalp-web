import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticatedAdmin } from '@/lib/admin-auth';
import { getAllLeads, generateLeadsCsv } from '@/lib/leads';

export async function GET(request: NextRequest) {
  if (!isAuthenticatedAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const leads = getAllLeads();
  const csv = generateLeadsCsv(leads);
  const dateStr = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="fitkalp-leads-${dateStr}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
