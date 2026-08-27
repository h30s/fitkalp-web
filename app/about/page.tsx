import Link from 'next/link';
import { IndianRupee, Lock, Headset, MapPin, Users, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'About FitKalp - Why We Built This',
  description:
    "FitKalp was built by founders who saw India's gym owners struggling with notebooks and WhatsApp. Here's why we exist and what we stand for.",
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



const PROMISES = [
  {
    icon:  <IndianRupee size={20} color={G.green} />,
    title: 'Clear, published pricing',
    desc:  'No hidden fees, no setup charges, and definitely no surprise price jumps. Our pricing is transparent and accessible: you know exactly what you pay.',
  },
  {
    icon:  <Lock size={20} color={G.green} />,
    title: 'Your data, always yours',
    desc:  'Your member data is yours. Export your entire database at any time with a single click. We provide the tools, you own the business.',
  },
  {
    icon:  <Headset size={20} color={G.green} />,
    title: 'A real human when you call',
    desc:  'When you have an issue, you won\'t be stuck talking to a chatbot. Real phone and WhatsApp support during business hours: a real person who answers.',
  },
  {
    icon:  <MapPin size={20} color={G.green} />,
    title: 'Built for Indian gyms',
    desc:  'From UPI integrations and GST-compliant invoicing to WhatsApp-first communication, every feature is designed for how Indian gyms actually operate.',
  },
];

const STEPS = [
  { n: '1', title: 'Discovery Call',    desc: 'We talk to understand your current setup, challenges, and check if FitKalp is the right fit.' },
  { n: '2', title: 'Setup & Onboarding',desc: 'We help you import your existing members and configure the system - completely free.' },
  { n: '3', title: 'Ongoing Support',   desc: "We're just a WhatsApp message away for training, questions, and continuous improvements." },
];

export default function AboutPage() {
  return (
    <main style={{ fontFamily: "'DM Sans','Inter',sans-serif", overflowX: 'hidden' }}>

      {/* ═══ 1. HERO ═══════════════════════════════════════════════ */}
      <section className="pt-28 pb-10 sm:pt-36 sm:pb-20 text-center">
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 16px' }} className="px-4 sm:px-6">
          {/* Tag pill */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 18px', borderRadius: 999,
              background: G.bgWhite, border: `1px solid ${G.border}`,
              fontSize: 13, fontWeight: 500, color: G.muted,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: G.green, display: 'inline-block' }} />
              Our Story
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(30px,5vw,62px)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            lineHeight: 1.1,
            color: G.dark,
            maxWidth: 820,
            margin: '0 auto 20px',
          }}>
            We built FitKalp because gym owners deserve better than{' '}
            <span style={{ color: G.green, fontStyle: 'italic' }}>WhatsApp</span>
          </h1>

          <p className="text-sm sm:text-base" style={{ fontSize: 16, color: G.muted, maxWidth: 640, margin: '0 auto', lineHeight: 1.7 }}>
            We spent months talking to gym and fitness studio owners across India. The reality was consistent: passionate owners spending hours every week tracking payments in notebooks, sending awkward reminders, and losing track of who was still an active member. We knew there had to be a better way.
          </p>
        </div>
      </section>

      {/* ═══ 2. MISSION ════════════════════════════════════════════ */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 text-center">
        <div 
          className="p-6 sm:p-10"
          style={{ 
            maxWidth: 780, 
            margin: '0 auto',
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: `1px solid ${G.border}`,
            borderRadius: 24,
            boxShadow: '0 8px 32px rgba(0,0,0,0.03)'
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: G.greenLight, borderRadius: 999, fontSize: 13, fontWeight: 600, color: G.green, marginBottom: 20 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: G.green, display: 'inline-block' }} />
            Our Mission
          </div>
          <h2 style={{ fontSize: 'clamp(22px,3.5vw,36px)', fontWeight: 700, letterSpacing: '-0.02em', color: G.dark, lineHeight: 1.25, marginBottom: 18 }}>
            Giving every independent gym in{' '}
            <span style={{ color: G.green, fontStyle: 'italic' }}>India</span> the operational edge that large chains have
          </h2>
          <p className="text-sm sm:text-base" style={{ fontSize: 15.5, color: G.muted, lineHeight: 1.75, margin: 0 }}>
            Without the enterprise price tag or the complexity. Because a neighbourhood gym owner working 14-hour days deserves software that works as hard as they do.
          </p>
        </div>
      </section>

      {/* ═══ 3. FOUR PROMISES ══════════════════════════════════════ */}
      <section className="py-10 sm:py-20 px-4 sm:px-6">
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          {/* Section header */}
          <div style={{ textAlign: 'center' }} className="mb-8 sm:mb-14">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: G.bgWhite, border: `1px solid ${G.border}`, borderRadius: 999, fontSize: 13, fontWeight: 500, color: G.muted, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: G.green, display: 'inline-block' }} />
              Our Commitment
            </div>
            <h2 style={{ fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.18, color: G.dark, marginBottom: 14 }}>
              Four promises we{' '}
              <span style={{ color: G.green, fontStyle: 'italic' }}>don&apos;t break</span>
            </h2>
            <p className="text-sm sm:text-base" style={{ fontSize: 15.5, color: G.muted, maxWidth: 520, margin: '0 auto', lineHeight: 1.68 }}>
              This is what we stand for, and what you can hold us to.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {PROMISES.map((p, i) => (
              <div
                key={i}
                className="glass-card p-5 sm:p-7"
                style={{
                  borderRadius: 22,
                  display: 'flex',
                  gap: 16,
                  textAlign: 'left',
                }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: G.greenLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {p.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: 16.5, fontWeight: 700, color: G.dark, marginBottom: 6, lineHeight: 1.3 }}>{p.title}</h3>
                  <p style={{ color: G.muted, fontSize: 13.5, lineHeight: 1.6 }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4. HOW WE WORK ════════════════════════════════════════ */}
      <section className="py-10 sm:py-20 px-4 sm:px-6">
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          {/* Section header */}
          <div style={{ textAlign: 'center' }} className="mb-8 sm:mb-14">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: G.bgWhite, border: `1px solid ${G.border}`, borderRadius: 999, fontSize: 13, fontWeight: 500, color: G.muted, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: G.green, display: 'inline-block' }} />
              The Process
            </div>
            <h2 style={{ fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.18, color: G.dark, marginBottom: 14 }}>
              How we work{' '}
              <span style={{ color: G.green, fontStyle: 'italic' }}>with you</span>
            </h2>
            <p className="text-sm sm:text-base" style={{ fontSize: 15.5, color: G.muted, maxWidth: 500, margin: '0 auto', lineHeight: 1.68 }}>
              A partnership, not just a software subscription.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5" style={{ maxWidth: 880, margin: '0 auto' }}>
            {STEPS.map((s, i) => (
              <div
                key={i}
                className="glass-card p-5 sm:p-7"
                style={{
                  borderRadius: 22,
                  textAlign: 'center',
                }}
              >
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: G.greenLight, border: `2px solid ${G.green}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 17, color: G.green, margin: '0 auto 14px', boxShadow: '0 4px 12px rgba(43,147,97,0.2)' }}>
                  {s.n}
                </div>
                <h3 style={{ fontSize: 16.5, fontWeight: 700, color: G.dark, marginBottom: 6 }}>{s.title}</h3>
                <p style={{ color: G.muted, fontSize: 13.5, lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5. FOUNDER CREDIBILITY ════════════════════════════════ */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 text-center">
        <div 
          className="p-6 sm:p-10"
          style={{ 
            maxWidth: 720, 
            margin: '0 auto',
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: `1px solid ${G.border}`,
            borderRadius: 24,
            boxShadow: '0 8px 32px rgba(0,0,0,0.03)'
          }}
        >
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: G.greenLight, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', boxShadow: '0 4px 12px rgba(43,147,97,0.15)' }}>
            <Users size={26} color={G.green} />
          </div>
          <h2 style={{ fontSize: 'clamp(22px,3.5vw,34px)', fontWeight: 700, letterSpacing: '-0.02em', color: G.dark, marginBottom: 14 }}>
            Built by people who <span style={{ color: G.green, fontStyle: 'italic' }}>get it</span>
          </h2>
          <p className="text-sm sm:text-base" style={{ fontSize: 15.5, color: G.muted, lineHeight: 1.75, marginBottom: 0 }}>
            Our team brings together experience in software, fitness, and building products for Indian SMBs. We understand the unique challenges of running a local business in India. We use our own product, and we iterate constantly based on feedback from our founding partners.
          </p>
        </div>
      </section>

      {/* ═══ 6. CTA BOX ════════════════════════════════════════════ */}
      <section className="py-10 sm:py-20 px-4 sm:px-6">
        <div
          className="py-10 px-5 sm:py-16 sm:px-8"
          style={{
            maxWidth: 820,
            margin: '0 auto',
            background: G.bgWhite,
            border: `1px solid ${G.border}`,
            borderRadius: 28,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.04)',
          }}
        >
          {/* Green glow */}
          <div style={{ position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)', width: 400, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(43,147,97,0.08) 0%,transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <span style={{ display: 'inline-block', fontSize: 12.5, color: G.green, fontWeight: 600, background: G.greenLight, padding: '5px 16px', borderRadius: 999, marginBottom: 16 }}>
              Let&apos;s build something better together
            </span>
            <h2 style={{ fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, letterSpacing: '-0.02em', color: G.dark, marginBottom: 12, lineHeight: 1.18 }}>
              Talk to the{' '}
              <span style={{ color: G.green, fontStyle: 'italic' }}>founding team</span>
            </h2>
            <p className="text-sm sm:text-base" style={{ color: G.muted, fontSize: 15.5, maxWidth: 480, margin: '0 auto 24px', lineHeight: 1.68 }}>
              Whether you&apos;re ready to switch now or just want to chat about gym operations, we&apos;d love to connect.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/register" className="btn-primary w-full sm:w-auto" style={{ padding: '13px 28px', fontSize: 15, minHeight: 48 }}>
                Book a Demo
              </Link>
              <Link href="/contact" className="btn-secondary w-full sm:w-auto" style={{ padding: '13px 28px', fontSize: 15, minHeight: 48 }}>
                Send a Message <ArrowRight size={16} style={{ display: 'inline', marginLeft: 4 }} />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
