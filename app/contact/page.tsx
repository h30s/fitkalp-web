'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { CheckCircle2, LoaderCircle, MessageCircle, Mail, PhoneCall } from 'lucide-react';

/* ── Design tokens ──────────────────────────────────────── */
const G = {
  green: '#2B9361',
  greenLight: '#E9F4EE',
  dark: '#1A1D1F',
  muted: '#6F767E',
  border: '#EFEFEF',
  bgWhite: '#FFFFFF',
  bgAlt: '#FAFAFA',
  bgWarm: '#FAF8F4',
};

const CONTACT_CARDS = [
  {
    emoji: '💬',
    title: 'WhatsApp',
    sub: 'Direct founder connection',
    value: '+91 94100 04994',
    href: 'https://wa.me/919410004994?text=Hi%20Himanshu,%20I%20have%20a%20question%20about%20FitKalp',
  },
  {
    emoji: '📧',
    title: 'Email',
    sub: 'Response within 2 hours',
    value: 'fitkalp.gym@gmail.com',
    href: 'mailto:fitkalp.gym@gmail.com',
  },
  {
    emoji: '📅',
    title: 'Book a Call / Demo',
    sub: 'See it live in action',
    value: 'Schedule a demo →',
    href: '/register?intent=call',
  },
];

export default function ContactPage() {
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get('contactName') || '');
    const phone = String(formData.get('contactWhatsapp') || '');
    const email = String(formData.get('email') || '');
    const gymName = String(formData.get('gymName') || '');
    const message = String(formData.get('message') || '');

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'CONTACT_QUERY',
          contactName: name,
          contactRole: 'General Inquirer',
          phone,
          email,
          gymName: gymName || '',
          serviceInterest: 'General Contact',
          onboardingInformation: message,
          source: 'Contact Page Form',
          intent: 'contact',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message.');

      setSuccess(true);
      form.reset();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setPending(false);
    }
  }

  return (
    <main style={{ fontFamily: "'DM Sans','Inter',sans-serif", overflowX: 'hidden' }}>
      {/* ═══ 1. HERO ═══════════════════════════════════════════════ */}
      <section className="pt-28 pb-8 sm:pt-36 sm:pb-12 text-center">
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 16px' }} className="px-4 sm:px-6">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 18px',
                borderRadius: 999,
                background: G.bgWhite,
                border: `1px solid ${G.border}`,
                fontSize: 13,
                fontWeight: 500,
                color: G.muted,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: G.green, display: 'inline-block' }} />
              Get in Touch
            </span>
          </div>
          <h1
            style={{
              fontSize: 'clamp(30px,5vw,62px)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
              color: G.dark,
              maxWidth: 720,
              margin: '0 auto 18px',
            }}
          >
            A real <span style={{ color: G.green, fontStyle: 'italic' }}>person</span> answers.
          </h1>
          <p className="text-sm sm:text-base" style={{ fontSize: 16, color: G.muted, maxWidth: 540, margin: '0 auto', lineHeight: 1.7 }}>
            Whether you have a question about features, pricing, or need a live walkthrough, our founding team is ready to help.
          </p>
        </div>
      </section>

      {/* ═══ 2. CONTACT CARDS ══════════════════════════════════════ */}
      <section className="py-6 sm:py-10 px-4 sm:px-6">
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-5"
          style={{
            maxWidth: 880,
            margin: '0 auto',
          }}
        >
          {CONTACT_CARDS.map((c, i) => (
            <div
              key={i}
              className="glass-card p-6"
              style={{
                borderRadius: 22,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>{c.emoji}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: G.dark, marginBottom: 4 }}>{c.title}</h3>
              <p style={{ fontSize: 13, color: G.muted, marginBottom: 14 }}>{c.sub}</p>
              <a
                href={c.href}
                style={{ fontSize: 14.5, fontWeight: 600, color: G.green, textDecoration: 'none', wordBreak: 'break-word', marginTop: 'auto' }}
              >
                {c.value}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 3. CONTACT FORM ═══════════════════════════════════════ */}
      <section className="py-8 sm:py-14 px-4 sm:px-6">
        <div style={{ maxWidth: 660, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h2
              style={{
                fontSize: 'clamp(22px,3.5vw,36px)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: G.dark,
                marginBottom: 8,
                lineHeight: 1.2,
              }}
            >
              Send us a <span style={{ color: G.green, fontStyle: 'italic' }}>message</span>
            </h2>
            <p className="text-sm sm:text-base" style={{ fontSize: 15, color: G.muted, lineHeight: 1.65 }}>
              We&apos;ll get back to you within 2 hours on business days.
            </p>
          </div>

          <div
            className="p-6 sm:p-8 md:p-10"
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: `1px solid ${G.border}`,
              borderRadius: 28,
              boxShadow: '0 12px 40px -6px rgba(0,0,0,0.06), 0 1px 1px 0 rgba(255,255,255,0.9) inset',
            }}
          >
            {success ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <CheckCircle2 size={48} color={G.green} style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: 20, fontWeight: 700, color: G.dark, marginBottom: 8 }}>
                  Message Sent Successfully!
                </h3>
                <p style={{ fontSize: 15, color: G.muted, lineHeight: 1.6, marginBottom: 24 }}>
                  Thanks for reaching out! Himanshu and our team will review your note and get back to you shortly.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  style={{
                    border: 'none',
                    background: G.greenLight,
                    color: G.green,
                    fontWeight: 600,
                    padding: '10px 20px',
                    borderRadius: 99,
                    cursor: 'pointer',
                  }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label htmlFor="contactName" style={labelStyle}>
                    Your Name *
                  </label>
                  <input
                    id="contactName"
                    name="contactName"
                    required
                    placeholder="Rahul Sharma"
                    style={inputStyle}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contactWhatsapp" style={labelStyle}>
                      WhatsApp / Phone Number *
                    </label>
                    <input
                      id="contactWhatsapp"
                      name="contactWhatsapp"
                      type="tel"
                      required
                      placeholder="+91 94100 04994"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" style={labelStyle}>
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="rahul@example.com"
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="gymName" style={labelStyle}>
                    Gym / Studio Name (Optional)
                  </label>
                  <input
                    id="gymName"
                    name="gymName"
                    placeholder="PowerHouse Fitness"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label htmlFor="message" style={labelStyle}>
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    placeholder="How can we help your gym? Ask any question about features, pricing, or custom setup..."
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>

                {error && (
                  <div
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
                )}

                <button
                  type="submit"
                  disabled={pending}
                  className="btn-primary w-full"
                  style={{
                    padding: '13px 0',
                    fontSize: 15,
                    justifyContent: 'center',
                    borderRadius: 12,
                    opacity: pending ? 0.7 : 1,
                    minHeight: 48,
                  }}
                >
                  {pending ? (
                    <>
                      <LoaderCircle size={18} className="animate-spin" /> Sending…
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            )}
          </div>

          <p style={{ textAlign: 'center', fontSize: 13, color: G.muted, marginTop: 18 }}>
            📍 Remote-first team serving fitness businesses across India
          </p>
        </div>
      </section>

      {/* ═══ 4. CTA BOX ════════════════════════════════════════════ */}
      <section className="py-8 sm:py-16 px-4 sm:px-6">
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <h2
            style={{
              fontSize: 'clamp(22px,3.5vw,36px)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: G.dark,
              marginBottom: 12,
              lineHeight: 1.2,
            }}
          >
            Rather see it <span style={{ color: G.green, fontStyle: 'italic' }}>live</span>?
          </h2>
          <p className="text-sm sm:text-base" style={{ fontSize: 15.5, color: G.muted, marginBottom: 24, lineHeight: 1.68 }}>
            Book a free 20-minute demo and we&apos;ll walk you through FitKalp in your browser.
          </p>
          <Link href="/register" className="btn-primary w-full sm:w-auto" style={{ padding: '13px 30px', fontSize: 15, minHeight: 48 }}>
            Book a Demo
          </Link>
        </div>
      </section>
    </main>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 500,
  color: G.dark,
  marginBottom: 8,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: 10,
  border: `1px solid ${G.border}`,
  fontSize: 16,
  color: G.dark,
  background: G.bgAlt,
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};
