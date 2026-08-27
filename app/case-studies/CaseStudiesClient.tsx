'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Clock,
  TrendingUp,
  Users,
  CreditCard,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  HeartHandshake,
  Layers,
  Activity,
  Check,
} from 'lucide-react';

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

/* ── Core Tracked Vitals Data ────────────────────────────── */
const TRACKED_VITALS = [
  {
    icon: <Clock size={24} color={G.green} />,
    title: 'Admin Hours Saved',
    baseline: '8 – 15 hrs / week',
    baselineDesc: 'Manual paper registers, spreadsheet upkeep & WhatsApp typing',
    target: '< 2 hrs / week',
    targetDesc: 'Automated 1-click check-ins, auto-receipts & live summaries',
    tag: 'Operational Efficiency',
  },
  {
    icon: <TrendingUp size={24} color={G.green} />,
    title: 'On-Time Renewals',
    baseline: '15 – 25% revenue leakage',
    baselineDesc: 'Missed expiry tracking & forgotten follow-ups',
    target: '90%+ on-time renewal',
    targetDesc: 'Automated 7-day & 1-day WhatsApp reminders with UPI links',
    tag: 'Cash Flow & Revenue',
  },
  {
    icon: <Users size={24} color={G.green} />,
    title: 'Inactivity Detection',
    baseline: '0 early warning',
    baselineDesc: 'Members quietly drop off; noticed only when they stop paying',
    target: 'Day 7 proactive alert',
    targetDesc: 'Automated notification so trainers can reach out in time',
    tag: 'Member Retention',
  },
  {
    icon: <CreditCard size={24} color={G.green} />,
    title: 'Billing & GST Clarity',
    baseline: 'Days of CA stress',
    baselineDesc: 'Unsorted UPI screenshots, cash memos & missing invoices',
    target: '1-click export',
    targetDesc: 'Instant GST-ready invoices & automated reconciliation',
    tag: 'Accounting & Compliance',
  },
];

/* ── Transformation Blueprints Data ──────────────────────── */
const BLUEPRINTS = [
  {
    id: 'renewals',
    title: 'Membership Renewals & Cash Flow',
    subtitle: 'From forgotten dates and awkward reminders to seamless WhatsApp payments',
    icon: <TrendingUp size={18} />,
    problem: {
      title: 'The Manual Register Trap',
      points: [
        'Gym owners flip through paper registers daily to spot expiring plans.',
        'Staff sends awkward manual WhatsApp messages or waits until members walk in.',
        'Members forget to pay or promise "tomorrow," leading to 15–25% revenue leakage.',
      ],
    },
    solution: {
      title: 'The FitKalp Automated Renewal Engine',
      points: [
        'Automated friendly WhatsApp reminders sent 7 days and 1 day before expiry.',
        'Includes an instant UPI/card payment link, so members renew in 20 seconds from their couch.',
        'Membership validity is automatically extended upon payment confirmation.',
      ],
    },
    vitalHighlight: 'Zero awkward money conversations & immediate renewal turnaround',
  },
  {
    id: 'operations',
    title: 'Front Desk & Daily Administration',
    subtitle: 'From chaotic peak-hour registers to instant digital check-ins and receipts',
    icon: <Layers size={18} />,
    problem: {
      title: 'The Morning & Evening Rush Bottleneck',
      points: [
        'Members crowd the front desk waiting to sign manual attendance registers.',
        'Front-desk staff spends hours writing paper receipts and calculating monthly dues.',
        'High risk of unauthorized visits and expired members working out unnoticed.',
      ],
    },
    solution: {
      title: 'Streamlined Digital Front-Desk Flow',
      points: [
        '1-tap digital member check-in with live active status indicators.',
        'Instant GST-ready PDF invoices generated and dispatched to WhatsApp automatically.',
        'Owners can check daily footfall, revenue, and pending dues from their phone.',
      ],
    },
    vitalHighlight: '75%+ reduction in repetitive front-desk administrative work',
  },
  {
    id: 'retention',
    title: 'Member Inactivity & Drop-off Prevention',
    subtitle: 'From unnoticed drop-outs to proactive trainer re-engagement alerts',
    icon: <Activity size={18} />,
    problem: {
      title: 'The Silent Churn Phenomenon',
      points: [
        'Members gradually lose motivation and stop attending after week two or three.',
        'Gym owners have no easy way to track who hasn\'t visited in the last 10 days.',
        'By the time the renewal date arrives, the member has already quit.',
      ],
    },
    solution: {
      title: 'Proactive Early Inactivity Flagging',
      points: [
        'FitKalp automatically flags members who miss 7 consecutive scheduled days.',
        'Front-desk or personal trainers receive a simple prompt to check in warmly.',
        'Re-engages members before fitness habits break and prevents preventable cancellations.',
      ],
    },
    vitalHighlight: 'Identify and salvage disengaged members before they cancel',
  },
];

/* ── 90-Day Milestone Journey ────────────────────────────── */
const MILESTONES = [
  {
    phase: 'Phase 1',
    timeline: 'Days 1 – 14',
    title: 'Setup & Baseline Audit',
    desc: 'We assist with a free migration of your existing registers, configure custom membership plans, and calibrate your WhatsApp sender identity.',
    deliverables: [
      'Clean member data import (zero manual retyping)',
      'Custom pricing tiers & duration plans setup',
      'Staff logins & role permissions assigned',
    ],
  },
  {
    phase: 'Phase 2',
    timeline: 'Days 15 – 45',
    title: 'Automated Velocity',
    desc: 'Your first automated billing cycle takes over. Renewal reminders fire on schedule, digital receipts dispatch instantly, and daily attendance is logged smoothly.',
    deliverables: [
      'First automated WhatsApp renewal cycles dispatched',
      'Real-time UPI & cash collection recording',
      'Daily active vs. inactive attendance tracking',
    ],
  },
  {
    phase: 'Phase 3',
    timeline: 'Days 46 – 90',
    title: 'Full Operational Clarity',
    desc: 'Complete operational visibility achieved. Detailed churn analytics, member retention alerts, and 1-click GST reconciliation for your CA.',
    deliverables: [
      'Quantified admin hours saved review',
      'At-risk member retention interventions',
      'Monthly GST & revenue reports ready for accounting',
    ],
  },
];

/* ── Founding Partner Benefits ────────────────────────────── */
const PARTNER_BENEFITS = [
  {
    icon: <HeartHandshake size={22} color={G.green} />,
    title: 'Free White-Glove Onboarding',
    desc: 'Our team personally imports your Excel spreadsheets or paper records so you can start clean without spending weekends re-entering data.',
  },
  {
    icon: <Sparkles size={22} color={G.green} />,
    title: 'Direct Product Builder Access',
    desc: 'Join a dedicated WhatsApp group directly with our founding engineers to request custom workflows that fit your gym\'s unique needs.',
  },
  {
    icon: <ShieldCheck size={22} color={G.green} />,
    title: 'Founder Pricing Guarantee',
    desc: 'Lock in special early-partner subscription rates for the entire life of your account. No surprise price hikes as we grow.',
  },
  {
    icon: <TrendingUp size={22} color={G.green} />,
    title: 'Featured Verified Case Study',
    desc: 'Receive an audited performance review after 90 days and get your gym prominently spotlighted as a technology leader in the fitness industry.',
  },
];

/* ── FAQs ─────────────────────────────────────────────────── */
const FAQS = [
  {
    q: 'Why are specific gym names and revenue numbers not listed yet?',
    a: 'FitKalp is launching in 2026. We refuse to publish fake testimonials, stock photography, or fabricated case studies. We are actively onboarding our first Founding Partner Cohort across India, and verified before-and-after operational data will be published here as 90-day pilot cycles complete.',
  },
  {
    q: 'How does my gym join the 2026 Founding Partner Cohort?',
    a: 'Simply book a 20-minute live demo. We\'ll walk you through the platform, understand your gym\'s setup, and if FitKalp is the right fit, we\'ll provide free white-glove onboarding and enroll your gym into our 2026 partner cohort.',
  },
  {
    q: 'Will my gym\'s financial and member data remain private?',
    a: '100% yes. Your member database and financial transactions belong exclusively to you. Case studies are published strictly with explicit owner consent and can be anonymized or framed in percentage improvements according to your preference.',
  },
  {
    q: 'What types of fitness facilities are eligible to participate?',
    a: 'Any independent fitness business in India, including traditional gyms, strength & conditioning clubs, CrossFit boxes, yoga studios, and multi-branch chains with 50 to 1,000+ members.',
  },
];

export default function CaseStudiesClient() {
  const [activeBlueprint, setActiveBlueprint] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main style={{ fontFamily: "'DM Sans','Inter',sans-serif", overflowX: 'hidden' }}>

      {/* ═══ 1. HERO SECTION ═══════════════════════════════════════ */}
      <section className="pt-28 pb-8 sm:pt-36 sm:pb-14 text-center">
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
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: G.green, display: 'inline-block' }} />
              Case Studies &amp; Benchmarks
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(30px,5vw,58px)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            lineHeight: 1.1,
            color: G.dark,
            maxWidth: 820,
            margin: '0 auto 18px',
          }}>
            Transparent impact, measured in{' '}
            <span style={{ color: G.green, fontStyle: 'italic' }}>real numbers</span>
          </h1>

          <p className="text-sm sm:text-base mb-6 sm:mb-8" style={{ fontSize: 16, color: G.muted, maxWidth: 660, margin: '0 auto 28px', lineHeight: 1.7 }}>
            We believe in radical honesty. As we launch our 2026 Founding Partner Cohort across India, we are tracking authentic operational transformations, not publishing fabricated marketing statistics.
          </p>

          {/* Launch Transparency Card */}
          <div
            className="p-4 sm:p-7"
            style={{
              maxWidth: 780,
              margin: '0 auto',
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: `1px solid ${G.border}`,
              borderRadius: 20,
              textAlign: 'left',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{
                background: G.greenLight,
                color: G.green,
                padding: '4px 12px',
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}>
                <Sparkles size={13} />
                2026 Founding Cohort Active
              </span>
              <span style={{ fontSize: 13, color: G.muted, fontWeight: 500 }}>
                Pilot Data Collection &amp; Benchmark Tracking Underway
              </span>
            </div>
            <p className="text-xs sm:text-sm" style={{ fontSize: 13.5, color: G.dark, lineHeight: 1.6, margin: 0 }}>
              FitKalp is currently onboarding our founding cohort of gym owners across Bengaluru, Pune, Delhi NCR, Hyderabad, and Mumbai. This page details the operational benchmarks we measure, before-and-after blueprints, and how early partners can shape the future of Indian gym software.
            </p>
          </div>

        </div>
      </section>

      {/* ═══ 2. CORE TRACKED VITALS (METRIC BENCHMARKS) ═══════════ */}
      <section className="py-8 sm:py-16 px-4 sm:px-6">
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center' }} className="mb-8 sm:mb-14">
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', background: G.greenLight,
              borderRadius: 999, fontSize: 13, fontWeight: 500,
              color: G.green, marginBottom: 16,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: G.green, display: 'inline-block' }} />
              Measurable Performance
            </div>
            <h2 style={{ fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 700, letterSpacing: '-0.02em', color: G.dark, marginBottom: 12, lineHeight: 1.2 }}>
              The 4 operational vitals we measure for every gym
            </h2>
            <p className="text-sm sm:text-base" style={{ fontSize: 15.5, color: G.muted, maxWidth: 620, margin: '0 auto', lineHeight: 1.68 }}>
              Every fitness business deserves clear visibility into these foundational metrics. Here is how we benchmark before and after implementing FitKalp.
            </p>
          </div>

          {/* Vitals Grid */}
          {/* Vitals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TRACKED_VITALS.map((vital, idx) => (
              <div
                key={idx}
                className="glass-card"
                style={{
                  borderRadius: 22,
                  padding: '22px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: G.greenLight,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {vital.icon}
                  </div>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: G.muted,
                    background: 'rgba(255, 255, 255, 0.9)',
                    padding: '4px 10px',
                    borderRadius: 999,
                    border: `1px solid ${G.border}`,
                  }}>
                    {vital.tag}
                  </span>
                </div>

                <h3 style={{ fontSize: 17, fontWeight: 700, color: G.dark, marginBottom: 14 }}>
                  {vital.title}
                </h3>

                {/* Baseline vs Target */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 'auto' }}>
                  <div style={{
                    background: 'rgba(254, 242, 242, 0.7)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid #FEE2E2',
                    borderRadius: 12,
                    padding: '10px 12px',
                  }}>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: '#C53030', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>
                      Baseline (Manual Setup)
                    </div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: G.dark }}>
                      {vital.baseline}
                    </div>
                    <div style={{ fontSize: 11.5, color: G.muted, marginTop: 2, lineHeight: 1.4 }}>
                      {vital.baselineDesc}
                    </div>
                  </div>

                  <div style={{
                    background: 'rgba(233, 244, 238, 0.75)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(43,147,97,0.2)',
                    borderRadius: 12,
                    padding: '10px 12px',
                  }}>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: G.green, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>
                      Target with FitKalp
                    </div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: G.dark }}>
                      {vital.target}
                    </div>
                    <div style={{ fontSize: 11.5, color: G.muted, marginTop: 2, lineHeight: 1.4 }}>
                      {vital.targetDesc}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 24, fontSize: 12.5, color: G.muted }}>
            * Baseline benchmarks established during initial gym onboarding; audited cohort figures will be published during 2026.
          </div>

        </div>
      </section>

      {/* ═══ 3. TRANSFORMATION BLUEPRINTS (BEFORE VS FITKALP) ═════ */}
      <section className="py-8 sm:py-16 px-4 sm:px-6">
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          
          {/* Section Header */}
          <div style={{ textAlign: 'center' }} className="mb-8 sm:mb-12">
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', background: G.bgWhite,
              border: `1px solid ${G.border}`, borderRadius: 999,
              fontSize: 13, fontWeight: 500, color: G.muted,
              marginBottom: 16,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: G.green, display: 'inline-block' }} />
              Operational Blueprints
            </div>
            <h2 style={{ fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 700, letterSpacing: '-0.02em', color: G.dark, marginBottom: 12, lineHeight: 1.2 }}>
              How FitKalp solves real gym bottlenecks
            </h2>
            <p className="text-sm sm:text-base" style={{ fontSize: 15.5, color: G.muted, maxWidth: 620, margin: '0 auto', lineHeight: 1.68 }}>
              Deep-dive into the exact workflow shifts we implement to turn chaotic daily gym management into an automated, predictable business.
            </p>
          </div>

          {/* Blueprint Selector Tabs */}
          <div
            className="flex justify-start sm:justify-center gap-2 overflow-x-auto pb-2 hide-scrollbar mb-7"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {BLUEPRINTS.map((bp, idx) => (
              <button
                key={bp.id}
                onClick={() => setActiveBlueprint(idx)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 16px',
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  border: activeBlueprint === idx ? `1px solid ${G.green}` : `1px solid ${G.border}`,
                  background: activeBlueprint === idx ? G.green : 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(8px)',
                  color: activeBlueprint === idx ? '#FFFFFF' : G.muted,
                  boxShadow: activeBlueprint === idx ? '0 4px 14px rgba(43,147,97,0.25)' : '0 2px 6px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s ease',
                }}
              >
                {bp.icon}
                {bp.title}
              </button>
            ))}
          </div>

          {/* Active Blueprint Comparison Card */}
          {(() => {
            const current = BLUEPRINTS[activeBlueprint];
            return (
              <div
                className="p-4 sm:p-8"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: `1px solid ${G.border}`,
                  borderRadius: 24,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ marginBottom: 24, borderBottom: `1px solid ${G.border}`, paddingBottom: 16 }}>
                  <h3 style={{ fontSize: 'clamp(18px,2.5vw,24px)', fontWeight: 700, color: G.dark, marginBottom: 6 }}>
                    {current.title}
                  </h3>
                  <p className="text-sm sm:text-base" style={{ fontSize: 14.5, color: G.muted }}>
                    {current.subtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
                  {/* Before */}
                  <div style={{
                    background: 'rgba(254, 242, 242, 0.75)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid #FEE2E2',
                    borderRadius: 18,
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: '#C53030',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      marginBottom: 12,
                    }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#E53E3E' }} />
                      The Problem (Manual Way)
                    </div>
                    <h4 style={{ fontSize: 15.5, fontWeight: 700, color: G.dark, marginBottom: 12 }}>
                      {current.problem.title}
                    </h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, margin: 0, padding: 0 }}>
                      {current.problem.points.map((pt, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13.5, color: G.dark, lineHeight: 1.45 }}>
                          <span style={{ color: '#E53E3E', fontWeight: 700, flexShrink: 0 }}>✕</span>
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* With FitKalp */}
                  <div style={{
                    background: 'rgba(233, 244, 238, 0.8)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(43,147,97,0.25)',
                    borderRadius: 18,
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: G.green,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      marginBottom: 12,
                    }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: G.green }} />
                      The Solution (With FitKalp)
                    </div>
                    <h4 style={{ fontSize: 15.5, fontWeight: 700, color: G.dark, marginBottom: 12 }}>
                      {current.solution.title}
                    </h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, margin: 0, padding: 0 }}>
                      {current.solution.points.map((pt, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13.5, color: G.dark, lineHeight: 1.45 }}>
                          <CheckCircle2 size={15} color={G.green} style={{ flexShrink: 0, marginTop: 2 }} />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{
                  marginTop: 20,
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 12,
                  border: `1px solid ${G.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: G.dark,
                }}>
                  <Sparkles size={15} color={G.green} />
                  <span>Key Impact: {current.vitalHighlight}</span>
                </div>
              </div>
            );
          })()}

        </div>
      </section>

      {/* ═══ 4. THE 90-DAY MILESTONE ROADMAP ═══════════════════════ */}
      <section className="py-8 sm:py-16 px-4 sm:px-6">
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center' }} className="mb-8 sm:mb-14">
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', background: G.greenLight,
              borderRadius: 999, fontSize: 13, fontWeight: 500,
              color: G.green, marginBottom: 16,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: G.green, display: 'inline-block' }} />
              Onboarding &amp; Measurement
            </div>
            <h2 style={{ fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 700, letterSpacing: '-0.02em', color: G.dark, marginBottom: 12, lineHeight: 1.2 }}>
              The 90-day operational transformation journey
            </h2>
            <p className="text-sm sm:text-base" style={{ fontSize: 15.5, color: G.muted, maxWidth: 620, margin: '0 auto', lineHeight: 1.68 }}>
              Here is how we guide every founding gym from day one setup to fully automated, calm operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
            {MILESTONES.map((m, idx) => (
              <div
                key={idx}
                className="glass-card"
                style={{
                  borderRadius: 22,
                  padding: '24px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  textAlign: 'left',
                }}
              >
                {/* Timeline badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: 999,
                    background: G.greenLight,
                    color: G.green,
                    fontSize: 11.5,
                    fontWeight: 700,
                  }}>
                    {m.phase}
                  </span>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: G.muted }}>
                    {m.timeline}
                  </span>
                </div>

                <h3 style={{ fontSize: 18, fontWeight: 700, color: G.dark, marginBottom: 8 }}>
                  {m.title}
                </h3>

                <p style={{ fontSize: 13.5, color: G.muted, lineHeight: 1.55, marginBottom: 18 }}>
                  {m.desc}
                </p>

                <div style={{ marginTop: 'auto', borderTop: `1px solid ${G.border}`, paddingTop: 14 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: G.dark, textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 8 }}>
                    Milestones Delivered:
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6, padding: 0, margin: 0 }}>
                    {m.deliverables.map((del, dIdx) => (
                      <li key={dIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12.5, color: G.dark, lineHeight: 1.4 }}>
                        <Check size={14} color={G.green} style={{ flexShrink: 0, marginTop: 2 }} />
                        {del}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ═══ 5. FOUNDING PARTNER PROGRAM ═══════════════════════════ */}
      <section className="py-8 sm:py-16 px-4 sm:px-6">
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center' }} className="mb-8 sm:mb-14">
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', background: G.bgWhite,
              border: `1px solid ${G.border}`, borderRadius: 999,
              fontSize: 13, fontWeight: 500, color: G.muted,
              marginBottom: 16,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: G.green, display: 'inline-block' }} />
              2026 Partner Program
            </div>
            <h2 style={{ fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 700, letterSpacing: '-0.02em', color: G.dark, marginBottom: 12, lineHeight: 1.2 }}>
              Why join as a founding partner gym?
            </h2>
            <p className="text-sm sm:text-base" style={{ fontSize: 15.5, color: G.muted, maxWidth: 620, margin: '0 auto', lineHeight: 1.68 }}>
              We are working closely with select gym owners across India to build the absolute best gym software on the market.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PARTNER_BENEFITS.map((ben, idx) => (
              <div
                key={idx}
                className="glass-card"
                style={{
                  borderRadius: 20,
                  padding: '22px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'left',
                }}
              >
                <div style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: G.greenLight,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 14,
                }}>
                  {ben.icon}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: G.dark, marginBottom: 6 }}>
                  {ben.title}
                </h3>
                <p style={{ fontSize: 13.5, color: G.muted, lineHeight: 1.55, margin: 0 }}>
                  {ben.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ═══ 6. FREQUENTLY ASKED QUESTIONS ══════════════════════════ */}
      <section className="py-8 sm:py-16 px-4 sm:px-6">
        <div style={{ maxWidth: 840, margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center' }} className="mb-8 sm:mb-12">
            <h2 style={{ fontSize: 'clamp(22px,3.5vw,36px)', fontWeight: 700, letterSpacing: '-0.02em', color: G.dark, marginBottom: 10, lineHeight: 1.2 }}>
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base" style={{ fontSize: 15, color: G.muted }}>
              Common questions regarding our 2026 launch and case study benchmarking.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(12px)',
                    border: `1px solid ${G.border}`,
                    borderRadius: 16,
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: 15,
                      fontWeight: 600,
                      color: G.dark,
                      gap: 14,
                    }}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={18} color={G.muted} /> : <ChevronDown size={18} color={G.muted} />}
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 20px 18px', fontSize: 13.5, color: G.muted, lineHeight: 1.7, borderTop: `1px solid ${G.border}`, paddingTop: 12 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ═══ 7. BOTTOM CTA SECTION ═════════════════════════════════ */}
      <section className="py-8 sm:py-16 px-4 sm:px-6">
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div
            className="py-10 px-5 sm:py-14 sm:px-8"
            style={{
              background: 'linear-gradient(135deg, #1A1D1F 0%, #242B27 100%)',
              borderRadius: 28,
              textAlign: 'center',
              color: '#FFFFFF',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
            }}
          >
            {/* Subtle glow */}
            <div style={{
              position: 'absolute',
              top: '-30%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '400px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(43, 147, 97, 0.3) 0%, transparent 70%)',
              filter: 'blur(50px)',
              pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', zIndex: 1, maxWidth: 680, margin: '0 auto' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '5px 14px',
                borderRadius: 999,
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                fontSize: 12,
                fontWeight: 600,
                color: '#E9F4EE',
                marginBottom: 18,
              }}>
                <Sparkles size={14} color="#34D399" />
                Founding Partner Cohort 2026
              </div>

              <h2 style={{
                fontSize: 'clamp(24px,4vw,42px)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                marginBottom: 14,
              }}>
                Ready to transform your gym&apos;s operations in 2026?
              </h2>

              <p className="text-sm sm:text-base" style={{
                fontSize: 15.5,
                color: 'rgba(255, 255, 255, 0.75)',
                lineHeight: 1.7,
                marginBottom: 28,
              }}>
                See how FitKalp automates member renewals, eliminates front-desk chaos, and keeps your cash flow predictable. Book a personalized 20-minute walkthrough today.
              </p>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link
                  href="/register"
                  className="btn-primary w-full sm:w-auto"
                  style={{
                    padding: '13px 28px',
                    fontSize: 15,
                    fontWeight: 600,
                    textDecoration: 'none',
                    minHeight: 48,
                  }}
                >
                  Book a 20-Minute Demo
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/pricing"
                  className="btn-secondary w-full sm:w-auto"
                  style={{
                    padding: '13px 28px',
                    fontSize: 15,
                    fontWeight: 600,
                    textDecoration: 'none',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    minHeight: 48,
                  }}
                >
                  View Pricing Plans
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
