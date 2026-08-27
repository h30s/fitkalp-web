import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticatedAdmin } from '@/lib/admin-auth';
import { updateLead, deleteLead, getAllLeads } from '@/lib/leads';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticatedAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { id } = await context.params;
  const lead = getAllLeads().find((l) => l.id === id);

  if (!lead) {
    return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });
  }

  return NextResponse.json({ lead });
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticatedAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const updates = await request.json();
    const updated = updateLead(id, updates);

    if (!updated) {
      return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, lead: updated });
  } catch (error) {
    console.error('[admin/leads/[id]] Update failed:', error);
    return NextResponse.json({ error: 'Failed to update lead.' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticatedAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { id } = await context.params;
  const deleted = deleteLead(id);

  if (!deleted) {
    return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: 'Lead deleted.' });
}
