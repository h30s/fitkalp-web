'use client';

import { FormEvent, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, LoaderCircle, Sparkles, MessageCircle, ShieldCheck, Gift } from 'lucide-react';

const G = {
  green: '#2B9361',
  greenLight: '#E9F4EE',
  dark: '#1A1D1F',
  muted: '#6F767E',
  border: '#EFEFEF',
  bgAlt: '#FAFAFA',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: 10,
  border: `1px solid ${G.border}`,
  fontSize: 15,
  color: G.dark,
  background: G.bgAlt,
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};

export default function InquiryForm() {
  const searchParams = useSearchParams();
  const planParam = searchParams.get('plan') || '';
  const intentParam = searchParams.get('intent') || '';
  const serviceParam = searchParams.get('service') || '';
  const sourceParam = searchParams.get('source') || '';
  const refParam = searchParams.get('ref') || searchParams.get('referral') || searchParams.get('code') || '';

  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<Record<string, string>>({});

  const [serviceInterest, setServiceInterest] = useState('CRM');
  const [planInterest, setPlanInterest] = useState('Growth');
  const [referralCode, setReferralCode] = useState(refParam.toUpperCase());

  useEffect(() => {
    if (refParam) {
      setReferralCode(refParam.toUpperCase());
    }
  }, [refParam]);

  useEffect(() => {
    if (serviceParam) {
      if (serviceParam.toLowerCase().includes('website')) setServiceInterest('WEBSITE');
      else if (serviceParam.toLowerCase().includes('both')) setServiceInterest('BOTH');
      else setServiceInterest('CRM');
    }
    if (planParam) {
      if (planParam.toLowerCase().includes('starter')) setPlanInterest('Starter');
      else if (planParam.toLowerCase().includes('scale')) setPlanInterest('Scale');
      else if (planParam.toLowerCase().includes('scratch') || planParam.toLowerCase().includes('redesign')) {
        setServiceInterest('WEBSITE');
        setPlanInterest('Website Design');
      } else {
        setPlanInterest('Growth');
      }
    }
  }, [planParam, serviceParam]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError('');
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    try {
      const payload = {
        ...data,
        type: 'DEMO_LEAD',
        planInterest,
        serviceInterest,
        referralCode: referralCode.trim().toUpperCase(),
        intent: intentParam || 'demo',
        source: sourceParam || (refParam ? `Referral: ${refParam}` : 'Landing Page Form'),
      };

      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Could not submit your inquiry.');

      setSubmittedData(payload);
      setSuccess(true);
      form.reset();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Could not submit your inquiry.');
    } finally {
      setPending(false);
    }
  }

  // WhatsApp follow-up link for direct founder connection
  const gymNameVal = submittedData.gymName || 'my gym';
  const personNameVal = submittedData.contactName || 'there';
  const refText = submittedData.referralCode ? ` (Referred by: ${submittedData.referralCode})` : '';
  const waDirectLink = `https://wa.me/919410004994?text=${encodeURIComponent(
    `Hi Himanshu! I just submitted the FitKalp onboarding form for ${gymNameVal}${refText}. My name is ${personNameVal}. Can we connect for a quick walkthrough?`
  )}`;

  if (success) {
    return (
      <div
        role="status"
        style={{
          padding: '36px 24px',
          textAlign: 'center',
          borderRadius: 20,
          background: G.greenLight,
          border: '1px solid #C6E7D5',
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: G.green,
            color: '#FFFFFF',
            display: 'grid',
            placeItems: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(43,147,97,0.25)',
          }}
        >
          <CheckCircle2 size={32} />
        </div>

        <h3 style={{ color: G.dark, fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
          Details Received Successfully!
        </h3>

        <p style={{ color: G.muted, fontSize: 15, lineHeight: 1.6, maxWidth: 440, margin: '0 auto 24px' }}>
          Thank you, <strong style={{ color: G.dark }}>{personNameVal}</strong>. We have securely received your gym details for{' '}
          <strong style={{ color: G.dark }}>{gymNameVal}</strong>. Himanshu and our team will review your requirements and connect with you personally to schedule your live walkthrough.
        </p>

        {/* WhatsApp Direct Connect Card */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 16,
            padding: '20px',
            border: '1px solid #E5E7EB',
            maxWidth: 440,
            margin: '0 auto 20px',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, color: G.dark, marginBottom: 6 }}>
            Prefer to chat directly?
          </div>
          <p style={{ fontSize: 13, color: G.muted, marginBottom: 14 }}>
            Message Himanshu on WhatsApp to ask questions or share your preferred demo time.
          </p>
          <a
            href={waDirectLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              background: '#25D366',
              color: '#FFFFFF',
              padding: '12px 24px',
              borderRadius: 99,
              fontSize: 14,
              fontWeight: 700,
              textDecoration: 'none',
              width: '100%',
              boxSizing: 'border-box',
              boxShadow: '0 4px 14px rgba(37,211,102,0.3)',
            }}
          >
            <MessageCircle size={18} fill="#FFFFFF" /> Message Himanshu on WhatsApp
          </a>
        </div>

        <button
          type="button"
          onClick={() => setSuccess(false)}
          style={{
            border: 0,
            background: 'transparent',
            color: G.green,
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          ← Submit details for another branch
        </button>
      </div>
    );
  }

  // Dynamic contextual banner
  const isLoginIntent = intentParam === 'login';
  const isTrialIntent = intentParam === 'trial' || Boolean(planParam);
  const isWebsiteIntent = serviceParam === 'WEBSITE' || intentParam === 'quote';

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Honeypot */}
      <div style={{ position: 'absolute', left: -10000 }} aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Referral Banner if URL has code */}
      {refParam && (
        <div
          style={{
            background: '#FEF3C7',
            border: '1px solid #FCD34D',
            color: '#92400E',
            padding: '10px 14px',
            borderRadius: 12,
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontWeight: 500,
          }}
        >
          <Gift size={16} />
          <span>Referred by: <strong>{refParam.toUpperCase()}</strong> (referral applied)</span>
        </div>
      )}

      {/* Context Banner */}
      {isLoginIntent && (
        <div
          style={{
            background: '#EFF6FF',
            border: '1px solid #BFDBFE',
            color: '#1D4ED8',
            padding: '12px 16px',
            borderRadius: 12,
            fontSize: 13,
            lineHeight: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <ShieldCheck size={20} style={{ flexShrink: 0 }} />
          <div>
            <strong>Early Access & Onboarding Request:</strong> We are onboarding gyms in curated cohorts. Fill in your gym details below and we will connect with you directly to set up your account.
          </div>
        </div>
      )}

      {isTrialIntent && !isLoginIntent && (
        <div
          style={{
            background: '#ECFDF5',
            border: '1px solid #A7F3D0',
            color: '#065F46',
            padding: '12px 16px',
            borderRadius: 12,
            fontSize: 13,
            lineHeight: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Sparkles size={18} style={{ flexShrink: 0 }} />
          <div>
            <strong>{planInterest ? `${planInterest} Plan Free Trial` : '14-Day Free Trial'}:</strong> Full live walkthrough and assisted setup. No payment or credit card required.
          </div>
        </div>
      )}

      {isWebsiteIntent && (
        <div
          style={{
            background: '#FAF5FF',
            border: '1px solid #E9D5FF',
            color: '#6B21A8',
            padding: '12px 16px',
            borderRadius: 12,
            fontSize: 13,
            lineHeight: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Sparkles size={18} style={{ flexShrink: 0 }} />
          <div>
            <strong>Custom Gym Website Design:</strong> Share your gym info and our design team will provide a tailored quote and live sample demo.
          </div>
        </div>
      )}

      {/* Section 1: Contact Person */}
      <div style={{ fontSize: 12, fontWeight: 700, color: G.green, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        1. Contact Person
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <div>
          <label htmlFor="contactName" style={labelStyle}>Your Name *</label>
          <input id="contactName" name="contactName" placeholder="Rahul Sharma" required style={inputStyle} />
        </div>
        <div>
          <label htmlFor="contactRole" style={labelStyle}>Your Role</label>
          <select id="contactRole" name="contactRole" style={inputStyle} defaultValue="Owner">
            <option value="Owner">Gym Owner</option>
            <option value="Manager">General Manager</option>
            <option value="Head Trainer">Head Trainer</option>
            <option value="Staff">Front Desk / Staff</option>
            <option value="Partner">Co-founder / Partner</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <div>
          <label htmlFor="phone" style={labelStyle}>Phone / WhatsApp Number *</label>
          <input id="phone" name="phone" type="tel" placeholder="+91 94100 04994" required style={inputStyle} />
        </div>
        <div>
          <label htmlFor="email" style={labelStyle}>Email Address *</label>
          <input id="email" name="email" type="email" placeholder="rahul@gym.com" required style={inputStyle} />
        </div>
      </div>

      {/* Section 2: Gym & Business Details */}
      <div style={{ fontSize: 12, fontWeight: 700, color: G.green, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 6 }}>
        2. Gym & Business Details
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <div>
          <label htmlFor="gymName" style={labelStyle}>Gym / Studio Name *</label>
          <input id="gymName" name="gymName" placeholder="PowerHouse Fitness Club" required style={inputStyle} />
        </div>
        <div>
          <label htmlFor="businessType" style={labelStyle}>Business Type</label>
          <select id="businessType" name="businessType" style={inputStyle} defaultValue="Strength & Cardio Gym">
            <option value="Strength & Cardio Gym">Strength & Cardio Gym</option>
            <option value="CrossFit / MMA Studio">CrossFit / MMA Studio</option>
            <option value="Yoga / Pilates Center">Yoga / Pilates Center</option>
            <option value="Zumba / Dance Studio">Zumba / Dance Studio</option>
            <option value="Personal Training Studio">Personal Training Studio</option>
            <option value="Multi-branch Fitness Chain">Multi-branch Fitness Chain</option>
            <option value="Other">Other Fitness Space</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}>
        <div>
          <label htmlFor="city" style={labelStyle}>City *</label>
          <input id="city" name="city" placeholder="Mumbai / Delhi / Bengaluru" required style={inputStyle} />
        </div>
        <div>
          <label htmlFor="state" style={labelStyle}>State</label>
          <input id="state" name="state" placeholder="Maharashtra" style={inputStyle} />
        </div>
        <div>
          <label htmlFor="currentMemberRange" style={labelStyle}>Current Members *</label>
          <select id="currentMemberRange" name="currentMemberRange" required style={inputStyle} defaultValue="50–150">
            <option value="Under 50">Under 50 members</option>
            <option value="50–150">50–150 members</option>
            <option value="150–400">150–400 members</option>
            <option value="400+">400+ members</option>
          </select>
        </div>
      </div>

      {/* Section 3: Service, Plan & Referral */}
      <div style={{ fontSize: 12, fontWeight: 700, color: G.green, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 6 }}>
        3. Interest & Referral Code
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <div>
          <label htmlFor="serviceInterest" style={labelStyle}>Interested Service *</label>
          <select
            id="serviceInterest"
            name="serviceInterest"
            value={serviceInterest}
            onChange={(e) => setServiceInterest(e.target.value)}
            style={inputStyle}
          >
            <option value="CRM">FitKalp Gym CRM (Member & Payment software)</option>
            <option value="WEBSITE">Custom Gym Website Design & Build</option>
            <option value="BOTH">Complete Bundle (CRM + Custom Website)</option>
          </select>
        </div>

        <div>
          <label htmlFor="planInterest" style={labelStyle}>Interested Plan</label>
          <select
            id="planInterest"
            name="planInterest"
            value={planInterest}
            onChange={(e) => setPlanInterest(e.target.value)}
            style={inputStyle}
          >
            <option value="Starter">Starter Plan (₹599/mo · Up to 100 members)</option>
            <option value="Growth">Growth Plan (₹1,000/mo · WhatsApp + GST + 500 members)</option>
            <option value="Scale">Scale Plan (₹1,299/mo · Unlimited + Multi-branch)</option>
            <option value="Website Design">Website Design (Starting at ₹15,000)</option>
            <option value="Custom">Custom Solution</option>
          </select>
        </div>
      </div>

      {/* Referral Code and Call Time */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <div>
          <label htmlFor="referralCode" style={labelStyle}>
            Referral Code / Referred By (Optional) 🎁
          </label>
          <input
            id="referralCode"
            name="referralCode"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
            placeholder="e.g. Friend's Name or Code"
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="preferredTime" style={labelStyle}>Preferred Call / Contact Time</label>
          <select id="preferredTime" name="preferredTime" style={inputStyle} defaultValue="Flexible">
            <option value="Flexible">Flexible (Any time on business days)</option>
            <option value="Morning (9 AM – 12 PM)">Morning (9 AM – 12 PM)</option>
            <option value="Afternoon (12 PM – 4 PM)">Afternoon (12 PM – 4 PM)</option>
            <option value="Evening (4 PM – 8 PM)">Evening (4 PM – 8 PM)</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="onboardingInformation" style={labelStyle}>
          What challenges or specific features are most important to you?
        </label>
        <textarea
          id="onboardingInformation"
          name="onboardingInformation"
          rows={3}
          maxLength={2000}
          placeholder="e.g. Currently tracking renewals in notebooks/Excel, need WhatsApp automatic reminders, want GST bills, 2 branches..."
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>

      {error ? (
        <div
          role="alert"
          style={{
            padding: '12px 14px',
            borderRadius: 10,
            color: '#991b1b',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            fontSize: 14,
          }}
        >
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        className="btn-primary"
        disabled={pending}
        style={{
          width: '100%',
          padding: '16px 0',
          fontSize: 16,
          fontWeight: 700,
          justifyContent: 'center',
          marginTop: 4,
          opacity: pending ? 0.7 : 1,
          borderRadius: 14,
        }}
      >
        {pending ? (
          <>
            <LoaderCircle size={18} className="animate-spin" /> Submitting Your Details…
          </>
        ) : (
          'Submit Gym Details & Request Walkthrough'
        )}
      </button>

      <div style={{ textAlign: 'center', fontSize: 12, color: G.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <ShieldCheck size={14} color={G.green} />
        <span>100% Free Consultation • No Credit Card Required • We will contact you promptly</span>
      </div>
    </form>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 500,
  color: G.dark,
  marginBottom: 8,
};
