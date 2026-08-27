import Link from 'next/link';
import { Globe, Search, Smartphone, Users, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Website Services - Gym Website Design & Build',
  description:
    'FitKalp designs and builds professional websites for gyms and fitness studios in India. Starting at ₹15,000. Get online in 2 weeks.',
};

/* ── Design tokens (Finora system) ──────────────────────── */
const G = {
  green:      '#2B9361',
  greenLight: '#E9F4EE',
  dark:       '#1A1D1F',
  muted:      '#6F767E',
  border:     '#EFEFEF',
  bgWhite:    '#FFFFFF',
  bgAlt:      '#FAFAFA',
  bgWarm:     '#FAF8F4',
};



const WHY_CARDS = [
  { icon: <Search size={20} color={G.green} />,    title: 'Google Findability',      desc: 'When locals search for "gyms near me", you need to show up and look professional, not just rely on map listings.' },
  { icon: <Users size={20} color={G.green} />,     title: 'Online Lead Capture',     desc: 'Capture details of interested prospects directly into your CRM, rather than losing them to scattered DMs.' },
  { icon: <Smartphone size={20} color={G.green} />,title: 'Member Self-Service',     desc: 'Let prospects view class schedules, read FAQs, and check pricing without having to call your front desk.' },
  { icon: <Globe size={20} color={G.green} />,     title: 'Professional Credibility',desc: 'A clean, modern website builds trust instantly and sets you apart from neighbourhood gyms using only WhatsApp.' },
];

const WHATS_INCLUDED = [
  { title: 'Custom Design',         sub: "Tailored to your gym's branding and vibe." },
  { title: 'Mobile-First Approach', sub: 'Looks perfect on phones where 90% of your traffic comes from.' },
  { title: 'SEO-Optimised',         sub: 'Built to rank in local search results.' },
  { title: 'Fast Loading',          sub: 'No sluggish templates. We build for speed.' },
];

const PROCESS_STEPS = [
  { n: '1', title: 'Discovery (Day 1)',      desc: 'We chat to understand your brand, gather photos, logos, and business details. We outline the structure together.' },
  { n: '2', title: 'Design & Build (Week 1)',desc: 'Our team designs and develops your site. We share a live preview for your feedback and make revisions.' },
  { n: '3', title: 'Launch (Week 2)',        desc: 'We connect your domain, optimise for search engines, and your gym is officially live online!' },
];

const PLANS = [
  {
    featured:  true,
    name:      'Build from Scratch',
    desc:      'For gyms starting fresh online.',
    price:     '₹15,000',
    suffix:    '/ one-time',
    cta:       'Request a Quote',
    features: [
      'Full custom design & build',
      'Up to 5 pages',
      'Mobile & SEO optimised',
      'FitKalp CRM integration',
    ],
    footnote: '+ ₹2,000/mo optional managed hosting & maintenance',
  },
  {
    featured:  false,
    name:      'Redesign Existing',
    desc:      'Give your old site a modern facelift.',
    price:     '₹10,000',
    suffix:    '/ one-time',
    cta:       'Request a Quote',
    features: [
      'Modernise current design',
      'Improve mobile experience',
      'Speed optimisation',
      'Keep existing content',
    ],
  },
];

export default function WebsiteServicesPage() {
  return (
    <main style={{ fontFamily: "'DM Sans','Inter',sans-serif", overflowX: 'hidden' }}>

      {/* ═══ 1. HERO ═══════════════════════════════════════════════ */}
      <section className="pt-28 pb-8 sm:pt-36 sm:pb-16 text-center">
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 16px' }} className="px-4 sm:px-6">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 18px', borderRadius: 999,
              background: G.bgWhite, border: `1px solid ${G.border}`,
              fontSize: 13, fontWeight: 500, color: G.muted,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: G.green, display: 'inline-block' }} />
              Website Services
            </span>
          </div>
          <h1 style={{
            fontSize: 'clamp(30px,5vw,62px)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            lineHeight: 1.1,
            color: G.dark,
            maxWidth: 760,
            margin: '0 auto 18px',
          }}>
            Your gym deserves a website that{' '}
            <span style={{ color: G.green, fontStyle: 'italic' }}>actually converts</span>
          </h1>
          <p className="text-sm sm:text-base mb-6 sm:mb-8" style={{ fontSize: 16, color: G.muted, maxWidth: 560, margin: '0 auto 28px', lineHeight: 1.7 }}>
            Stop relying solely on Instagram or JustDial. Own your online presence with a fast, professional website designed specifically for Indian fitness businesses.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register?service=WEBSITE&plan=Build%20from%20Scratch&intent=quote" className="btn-primary w-full sm:w-auto" style={{ padding: '13px 28px', fontSize: 15, minHeight: 48 }}>
              Build from Scratch
            </Link>
            <Link href="/register?service=WEBSITE&plan=Redesign%20Existing&intent=quote" className="btn-secondary w-full sm:w-auto" style={{ padding: '13px 28px', fontSize: 15, minHeight: 48 }}>
              Redesign Existing Site
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ 2. WHY YOU NEED A WEBSITE ═════════════════════════════ */}
      <section className="py-8 sm:py-16 px-4 sm:px-6">
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div style={{ textAlign: 'center' }} className="mb-8 sm:mb-14">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: G.bgWhite, border: `1px solid ${G.border}`, borderRadius: 999, fontSize: 13, fontWeight: 500, color: G.muted, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: G.green, display: 'inline-block' }} />
              Why It Matters
            </div>
            <h2 style={{ fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.18, color: G.dark, marginBottom: 12 }}>
              A website works for you{' '}
              <span style={{ color: G.green, fontStyle: 'italic' }}>24/7</span>
            </h2>
            <p className="text-sm sm:text-base" style={{ fontSize: 15.5, color: G.muted, maxWidth: 500, margin: '0 auto', lineHeight: 1.68 }}>
              Turning local searches into paying members, even while you sleep.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {WHY_CARDS.map((c, i) => (
              <div key={i} className="glass-card p-5 sm:p-6" style={{ borderRadius: 20, textAlign: 'left' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: G.greenLight, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  {c.icon}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: G.dark, marginBottom: 6 }}>{c.title}</h3>
                <p style={{ color: G.muted, fontSize: 13.5, lineHeight: 1.6 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 3. WHAT'S INCLUDED & PROCESS ══════════════════════════ */}
      <section className="py-8 sm:py-16 px-4 sm:px-6">
        <div style={{ maxWidth: 1000, margin: '0 auto' }} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">

          {/* What's included */}
          <div>
            <h2 style={{ fontSize: 'clamp(22px,3vw,34px)', fontWeight: 700, letterSpacing: '-0.02em', color: G.dark, marginBottom: 20, lineHeight: 1.2 }}>
              What&apos;s <span style={{ color: G.green, fontStyle: 'italic' }}>included</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
              {WHATS_INCLUDED.map((w, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <CheckCircle2 size={18} color={G.green} style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontWeight: 600, color: G.dark, fontSize: 14.5 }}>{w.title}</div>
                    <div style={{ color: G.muted, fontSize: 13, marginTop: 2 }}>{w.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pages included */}
            <div style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(12px)', border: `1px solid ${G.border}`, borderRadius: 16, padding: '16px 18px', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: G.dark, marginBottom: 10 }}>📄 Standard pages included:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {['Home', 'About Us', 'Classes/Services', 'Pricing', 'Contact'].map((p) => (
                  <span key={p} style={{ padding: '4px 12px', background: G.greenLight, borderRadius: 999, fontSize: 12.5, fontWeight: 500, color: G.green }}>
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Process */}
          <div>
            <h2 style={{ fontSize: 'clamp(22px,3vw,34px)', fontWeight: 700, letterSpacing: '-0.02em', color: G.dark, marginBottom: 20, lineHeight: 1.2 }}>
              The <span style={{ color: G.green, fontStyle: 'italic' }}>process</span>
            </h2>
            <div style={{ position: 'relative', paddingLeft: 30 }}>
              {/* Vertical line */}
              <div style={{ position: 'absolute', left: 12, top: 0, bottom: 0, width: 2, background: G.greenLight }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {PROCESS_STEPS.map((s, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: -30, top: 0, width: 26, height: 26, borderRadius: '50%', background: G.green, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, boxShadow: '0 2px 8px rgba(43,147,97,0.3)' }}>
                      {s.n}
                    </div>
                    <h3 style={{ fontSize: 15.5, fontWeight: 700, color: G.dark, marginBottom: 4 }}>{s.title}</h3>
                    <p style={{ color: G.muted, fontSize: 13.5, lineHeight: 1.6 }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 4. PRICING ════════════════════════════════════════════ */}
      <section className="py-8 sm:py-16 px-4 sm:px-6">
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div style={{ textAlign: 'center' }} className="mb-8 sm:mb-14">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: G.bgWhite, border: `1px solid ${G.border}`, borderRadius: 999, fontSize: 13, fontWeight: 500, color: G.muted, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: G.green, display: 'inline-block' }} />
              Transparent Pricing
            </div>
            <h2 style={{ fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.18, color: G.dark, marginBottom: 12 }}>
              Simple, transparent{' '}
              <span style={{ color: G.green, fontStyle: 'italic' }}>pricing</span>
            </h2>
            <p className="text-sm sm:text-base" style={{ fontSize: 15.5, color: G.muted, maxWidth: 460, margin: '0 auto', lineHeight: 1.68 }}>
              No confusing retainer fees for things you don&apos;t need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-8 items-stretch">
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
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'left',
                }}
              >
                {plan.featured && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: G.green, color: '#fff', fontSize: 12, fontWeight: 700, padding: '4px 16px', borderRadius: 999, whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(43,147,97,0.3)' }}>
                    Most Popular
                  </div>
                )}
                <h3 style={{ fontSize: 20, fontWeight: 700, color: G.dark, marginBottom: 6 }}>{plan.name}</h3>
                <p style={{ fontSize: 13.5, color: G.muted, marginBottom: 18, paddingBottom: 16, borderBottom: `1px solid ${G.border}`, lineHeight: 1.55 }}>{plan.desc}</p>
                <div style={{ marginBottom: 18 }}>
                  <span style={{ fontSize: 36, fontWeight: 700, color: G.green, letterSpacing: '-0.02em' }}>{plan.price}</span>
                  <span style={{ fontSize: 13.5, color: G.muted }}> {plan.suffix}</span>
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20, padding: 0 }}>
                  {plan.features.map((feat, fi) => (
                    <li key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13.5, color: G.dark, lineHeight: 1.45 }}>
                      <CheckCircle2 size={15} color={G.green} style={{ flexShrink: 0, marginTop: 2 }} />
                      {feat}
                    </li>
                  ))}
                </ul>
                {plan.footnote && (
                  <p style={{ fontSize: 12, color: G.muted, marginBottom: 18 }}>{plan.footnote}</p>
                )}
                <Link
                  href={`/register?service=WEBSITE&plan=${encodeURIComponent(plan.name)}&intent=quote`}
                  className={plan.featured ? 'btn-primary' : 'btn-secondary'}
                  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '12px 0', fontSize: 14.5, width: '100%', minHeight: 46, marginTop: 'auto' }}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', fontSize: 13.5, color: G.muted, fontStyle: 'italic' }}>
            Portfolio under construction - building with founding partners now.
          </p>
        </div>
      </section>

      {/* ═══ 5. CTA ════════════════════════════════════════════════ */}
      <section className="py-8 sm:py-16 px-4 sm:px-6 text-center">
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(22px,3.5vw,36px)', fontWeight: 700, letterSpacing: '-0.02em', color: G.dark, marginBottom: 16, lineHeight: 1.2 }}>
            Ready to upgrade your gym&apos;s{' '}
            <span style={{ color: G.green, fontStyle: 'italic' }}>online presence</span>?
          </h2>
          <Link href="/register?service=WEBSITE&intent=quote" className="btn-primary w-full sm:w-auto" style={{ padding: '13px 28px', fontSize: 15, minHeight: 48 }}>
            Request a Quote
            <ArrowRight size={16} style={{ display: 'inline', marginLeft: 8 }} />
          </Link>
        </div>
      </section>

    </main>
  );
}
