'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';

/* ── Design tokens (Finora system) ──────────────────────── */
const G = {
  green:      '#2B9361',
  greenHover: '#227a4f',
  greenLight: '#E9F4EE',
  dark:       '#1A1D1F',
  muted:      '#6F767E',
  border:     '#EFEFEF',
  bgWhite:    '#FFFFFF',
  bgAlt:      '#FAFAFA',
  bgWarm:     '#FAF8F4',
};



const PLANS = [
  {
    name:     'Starter',
    price:    '₹599',
    desc:     'For small studios and solo trainers just getting started.',
    cta:      'Start Free Trial',
    ctaHref:  '/register?plan=Starter&intent=trial',
    featured: false,
    features: [
      'Up to 100 members',
      'Member management & profiles',
      'Renewal tracking',
      'Payment recording',
      'Basic reporting',
      'Email support',
    ],
  },
  {
    name:     'Growth',
    price:    '₹1,000',
    desc:     'For growing gyms that need smarter tools and automation.',
    cta:      'Start Free Trial',
    ctaHref:  '/register?plan=Growth&intent=trial',
    featured: true,
    features: [
      'Up to 500 members',
      'Everything in Starter',
      'WhatsApp renewal reminders',
      'GST-ready PDF invoices',
      'Attendance tracking',
      'Advanced reports & export',
      'Phone + WhatsApp support',
    ],
  },
  {
    name:     'Scale',
    price:    '₹1,299',
    desc:     'For large gyms and multi-branch fitness businesses.',
    cta:      'Book a Demo',
    ctaHref:  '/register?plan=Scale&intent=demo',
    featured: false,
    features: [
      'Unlimited members',
      'Everything in Growth',
      'Multiple staff logins',
      'Multiple branch support',
      'Priority support',
      'Dedicated onboarding',
      'Custom feature requests',
    ],
  },
];

const FAQS = [
  { q: 'Is there a free trial?',                    a: 'Yes, every plan comes with a 14-day free trial. No credit card required.' },
  { q: 'Can I cancel anytime?',                     a: 'Yes. Cancel anytime from inside your account. No cancellation fees.' },
  { q: 'What happens to my data if I cancel?',      a: 'You can export your full member database and payment history before cancelling. Your data is always yours.' },
  { q: 'Do you support UPI and cash payments?',     a: 'Yes. FitKalp tracks all payment modes: UPI, cash, card, and bank transfer.' },
  { q: 'Is GST invoicing included?',                a: 'Yes, GST-ready PDF invoices are included in the Growth and Scale plans.' },
];

export default function PricingClient() {
  const [openFaq, setOpenFaq]   = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "'DM Sans','Inter',sans-serif", overflowX: 'hidden' }}>

      {/* ── JSON-LD ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />

      {/* ═══ 1. HERO ═══════════════════════════════════════════════ */}
      <section className="pt-28 pb-8 sm:pt-36 sm:pb-16 text-center">
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 16px' }} className="px-4 sm:px-6">
          {/* Tag pill */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 18px', borderRadius: 999,
              background: G.bgWhite, border: `1px solid ${G.border}`,
              fontSize: 13, fontWeight: 500, color: G.muted,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: G.green, display: 'inline-block', animation: 'pulse-dot 2s ease-in-out infinite' }} />
              Transparent Pricing
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(30px,5vw,62px)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            lineHeight: 1.1,
            color: G.dark,
            marginBottom: 16,
          }}>
            Simple pricing.{' '}
            <span style={{ color: G.green, fontStyle: 'italic' }}>No surprises.</span>
          </h1>

          <p className="text-sm sm:text-base mb-6 sm:mb-8" style={{ fontSize: 16, color: G.muted, maxWidth: 560, margin: '0 auto 28px', lineHeight: 1.7 }}>
            Every plan includes your full data export rights. We publish what you pay, with no hidden fees, ever.
          </p>

          {/* Trust pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
            {['No hidden fees', 'Cancel anytime', 'Your data is always yours', 'Made in India'].map((t) => (
              <span key={t} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '5px 14px', borderRadius: 999,
                background: G.bgWhite, border: `1px solid ${G.border}`,
                fontSize: 12, fontWeight: 500, color: G.dark,
              }}>
                <CheckCircle2 size={13} color={G.green} />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 2. PRICING CARDS ═══════════════════════════════════════ */}
      <section className="py-8 sm:py-16 px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch" style={{ maxWidth: 1020, margin: '0 auto' }}>
          {PLANS.map((plan, i) => (
            <div
              key={i}
              className="p-6 sm:p-8"
              style={{
                background: plan.featured ? '#FFFFFF' : 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: plan.featured ? `2px solid ${G.green}` : `1px solid ${G.border}`,
                borderRadius: 24,
                position: 'relative',
                boxShadow: plan.featured ? '0 12px 36px -4px rgba(43,147,97,0.18), 0 1px 1px 0 rgba(255,255,255,0.9) inset' : '0 4px 20px -2px rgba(0,0,0,0.03)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'left',
              }}
            >
              {plan.featured && (
                <div style={{
                  position: 'absolute',
                  top: -12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: G.green,
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 700,
                  padding: '4px 16px',
                  borderRadius: 999,
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.02em',
                  boxShadow: '0 4px 12px rgba(43,147,97,0.3)',
                }}>
                  Most Popular
                </div>
              )}

              <h3 style={{ fontSize: 20, fontWeight: 700, color: G.dark, marginBottom: 6 }}>{plan.name}</h3>
              <p style={{ fontSize: 13.5, color: G.muted, marginBottom: 18, lineHeight: 1.5, minHeight: 38 }}>{plan.desc}</p>

              {/* Price block */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                  <span style={{ fontSize: 38, fontWeight: 700, color: G.green, letterSpacing: '-0.02em' }}>
                    {plan.price}
                  </span>
                  <span style={{ fontSize: 13, color: G.muted }}>/&nbsp;month</span>
                </div>
              </div>

              {/* CTA */}
              <Link
                href={plan.ctaHref}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '12px 0',
                  marginBottom: 22,
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: 600,
                  background: plan.featured ? G.green : G.dark,
                  color: '#fff',
                  textDecoration: 'none',
                  boxShadow: plan.featured ? '0 4px 16px rgba(43,147,97,0.25)' : 'none',
                  transition: 'opacity 0.2s, transform 0.2s',
                  minHeight: 46,
                }}
              >
                {plan.cta}
              </Link>

              {/* Features */}
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, padding: 0, margin: 0, marginTop: 'auto' }}>
                {plan.features.map((feat, fi) => (
                  <li key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13.5, color: G.dark, lineHeight: 1.45 }}>
                    <CheckCircle2 size={15} color={G.green} style={{ flexShrink: 0, marginTop: 2 }} />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 3. WEBSITE SERVICES ADD-ON ════════════════════════════ */}
      <section className="py-8 sm:py-16 px-4 sm:px-6">
        <div
          className="p-6 sm:p-10"
          style={{ maxWidth: 740, margin: '0 auto', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: `1px solid ${G.border}`, borderRadius: 28, textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.04)' }}
        >
          {/* Tag pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', background: G.greenLight, borderRadius: 999, fontSize: 12, fontWeight: 600, color: G.green, marginBottom: 16 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: G.green, display: 'inline-block' }} />
            Add-on Service
          </div>
          <h2 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 700, letterSpacing: '-0.02em', color: G.dark, marginBottom: 12, lineHeight: 1.25 }}>
            Need a gym website too?
          </h2>
          <p className="text-sm sm:text-base" style={{ fontSize: 15, color: G.muted, marginBottom: 24, lineHeight: 1.65, maxWidth: 500, margin: '0 auto 24px' }}>
            FitKalp also builds and redesigns custom gym websites. Starting at ₹15,000 one-time.
          </p>
          <Link href="/website-services" className="btn-secondary w-full sm:w-auto" style={{ padding: '12px 28px', fontSize: 14, minHeight: 46 }}>
            Learn More <ArrowRight size={15} style={{ display: 'inline', marginLeft: 4 }} />
          </Link>
        </div>
      </section>

      {/* ═══ 4. FAQ ═════════════════════════════════════════════════ */}
      <section className="py-8 sm:py-16 px-4 sm:px-6">
        <div style={{ maxWidth: 740, margin: '0 auto' }}>
          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', background: G.bgWhite, border: `1px solid ${G.border}`, borderRadius: 999, fontSize: 12, fontWeight: 600, color: G.muted, marginBottom: 16 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: G.green, display: 'inline-block' }} />
              FAQ
            </div>
            <h2 style={{ fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, letterSpacing: '-0.02em', color: G.dark, marginBottom: 12, lineHeight: 1.2 }}>
              Frequently asked{' '}
              <span style={{ color: G.green, fontStyle: 'italic' }}>questions</span>
            </h2>
            <p className="text-sm sm:text-base" style={{ fontSize: 15, color: G.muted, maxWidth: 480, margin: '0 auto', lineHeight: 1.65 }}>
              Your questions answered with clarity, security, and transparency.
            </p>
          </div>

          {FAQS.map((faq, i) => (
            <div
              key={i}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: `1px solid ${openFaq === i ? G.green : G.border}`,
                borderRadius: 16,
                marginBottom: 10,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: openFaq === i ? '0 4px 16px rgba(43,147,97,0.08)' : '0 2px 6px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ padding: '15px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <span style={{ fontWeight: 600, color: G.dark, fontSize: 14.5, lineHeight: 1.45 }}>{faq.q}</span>
                <span style={{
                  width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                  background: openFaq === i ? G.green : G.bgAlt,
                  color: openFaq === i ? '#fff' : G.muted,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, fontWeight: 300,
                  transform: openFaq === i ? 'rotate(45deg)' : 'none',
                  transition: 'all 0.25s ease',
                }}>+</span>
              </div>
              {openFaq === i && (
                <div style={{ padding: '0 18px 16px', color: G.muted, fontSize: 13.5, lineHeight: 1.7, borderTop: `1px solid ${G.border}`, paddingTop: 12 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 5. TRUST BAR ════════════════════════════════════════════ */}
      <section className="py-8 px-4 text-center">
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <p style={{ fontSize: 13.5, color: G.muted, fontWeight: 500, marginBottom: 18 }}>
            Bank-grade security · DPDPA-compliant data handling · Made in India 🇮🇳
          </p>
          <Link href="/register" className="btn-primary w-full sm:w-auto" style={{ padding: '12px 28px', fontSize: 14, minHeight: 46 }}>
            Book a Demo
          </Link>
        </div>
      </section>

    </div>
  );
}
