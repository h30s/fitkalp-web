import { NextRequest, NextResponse } from 'next/server';
import { createLead, Lead } from '@/lib/leads';
import { validateReferralCode, normalizeReferralCode } from '@/lib/referrals';

export async function POST(request: NextRequest) {
  try {
    const contentLength = Number(request.headers.get('content-length') ?? 0);
    if (contentLength > 50_000) {
      return NextResponse.json({ error: 'Request payload is too large.' }, { status: 413 });
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid inquiry data submitted.' }, { status: 400 });
    }

    // Honeypot spam check
    if (body.website && String(body.website).trim() !== '') {
      // Silently accept spam bot submissions without storing
      return NextResponse.json({ success: true, message: 'Inquiry received.' });
    }

    const contactName = String(body.contactName || body.name || '').trim();
    const phone = String(body.phone || body.contactWhatsapp || '').trim();
    const gymName = String(body.gymName || body.businessName || '').trim();
    const email = String(body.email || '').trim();

    if (!phone && !email) {
      return NextResponse.json(
        { error: 'Please provide at least a phone number or email so we can reach you.' },
        { status: 400 }
      );
    }

    const ipAddress = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'unknown';
    const userAgent = request.headers.get('user-agent') ?? 'unknown';

    // Standardize referral code format
    let standardizedReferral = '';
    if (body.referralCode && String(body.referralCode).trim()) {
      const validation = validateReferralCode(String(body.referralCode));
      if (validation.valid && validation.code) {
        standardizedReferral = validation.code;
      } else {
        standardizedReferral = normalizeReferralCode(String(body.referralCode));
      }
    }

    const isContactQuery =
      body.type === 'CONTACT_QUERY' ||
      body.intent === 'contact' ||
      body.serviceInterest === 'CONTACT' ||
      (body.source && String(body.source).toLowerCase().includes('contact'));

    // Save lead locally in our persistent store with distinct type
    const leadData: Partial<Lead> = {
      type: isContactQuery ? 'CONTACT_QUERY' : 'DEMO_LEAD',
      contactName: contactName || (isContactQuery ? 'Anonymous Sender' : 'Gym Owner'),
      contactRole: body.contactRole || (isContactQuery ? 'General Inquirer' : 'Owner / Manager'),
      email: email || '',
      phone: phone || '',
      gymName:
        gymName ||
        (isContactQuery
          ? (contactName ? `${contactName} (Contact Message)` : 'General / Business Inquiry')
          : (contactName ? `${contactName}'s Gym` : 'Fitness Studio')),
      businessType: body.businessType || (isContactQuery ? 'General Inquiry' : 'Gym / Fitness Studio'),
      address: body.address || '',
      city: body.city || (isContactQuery ? 'India' : 'India'),
      state: body.state || '',
      postalCode: body.postalCode || '',
      websiteUrl: body.websiteUrl || '',
      currentMemberRange: body.currentMemberRange || (isContactQuery ? '-' : '50–150'),
      serviceInterest: body.serviceInterest || (isContactQuery ? 'General Contact' : 'CRM'),
      planInterest: body.planInterest || body.plan || '',
      onboardingInformation: body.onboardingInformation || body.message || '',
      preferredTime: body.preferredTime || 'Flexible',
      source:
        body.source ||
        (isContactQuery
          ? 'Contact Page Form'
          : (standardizedReferral ? `Referral: ${standardizedReferral}` : 'Website Lead Form')),
      referralCode: standardizedReferral,
      intent: body.intent || (isContactQuery ? 'contact' : 'demo'),
      ipAddress,
      userAgent,
    };

    const newLead = createLead(leadData);

    // Asynchronously attempt to notify or sync with external CRM if configured
    const crmUrl = process.env.CRM_SERVER_URL ?? process.env.NEXT_PUBLIC_CRM_URL;
    if (crmUrl && crmUrl !== 'http://localhost:3001') {
      try {
        fetch(`${crmUrl}/api/inquiries`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          cache: 'no-store',
        }).catch((err) => {
          console.warn('[inquiries] Async CRM sync notice:', err?.message);
        });
      } catch {
        // CRM sync failure is non-blocking
      }
    }

    return NextResponse.json({
      success: true,
      leadId: newLead.id,
      type: newLead.type,
      referralCode: standardizedReferral,
      message: isContactQuery
        ? 'Thank you! We received your message and our team will get back to you shortly.'
        : 'Thank you! We received your gym details and will contact you promptly.',
    });
  } catch (error) {
    console.error('[inquiries] Failed to save lead:', error);
    return NextResponse.json(
      { error: 'Could not process your request right now. Please try again or WhatsApp us directly.' },
      { status: 500 }
    );
  }
}
