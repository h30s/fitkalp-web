'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ClipboardX,
  Wallet,
  MessageCircle,
  PieChart,
  IndianRupee,
  Lock,
  Headset,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Users,
  CreditCard,
  BarChart3,
  ArrowUpRight,
  Zap,
  Calendar,
  Fingerprint,
  Sparkles,
  FileText,
  ShieldCheck,
  HeartHandshake,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────────────────────────── */
const G = {
  green:      '#2B9361',
  greenLight: '#E9F4EE',
  dark:       '#1A1D1F',
  muted:      '#6F767E',
  border:     '#EFEFEF',
  bgWhite:    'rgba(255, 255, 255, 0.65)',
  bgAlt:      '#FAFAFA',
  bgWarm:     '#FAF8F4',
};

/* ─────────────────────────────────────────────────────────────────
   SHARED LAYOUT PRIMITIVES
───────────────────────────────────────────────────────────────── */

/** Full-width section wrapper with consistent vertical padding */
function Sect({
  id,
  bg = 'transparent',
  children,
  noPad = false,
}: {
  id?: string;
  bg?: string;
  children: React.ReactNode;
  noPad?: boolean;
}) {
  return (
    <section
      id={id}
      className={noPad ? '' : 'py-12 sm:py-16 md:py-24'}
      style={{
        width: '100%',
        background: bg,
      }}
    >
      <div
        style={{
          maxWidth: 1140,
          margin: '0 auto',
          padding: '0 16px',
          width: '100%',
          boxSizing: 'border-box',
        }}
        className="px-4 sm:px-6"
      >
        {children}
      </div>
    </section>
  );
}

/** Centered section title block */
function SectionHeader({
  tag,
  h2,
  sub,
}: {
  tag?: string;
  h2: React.ReactNode;
  sub?: string;
}) {
  return (
    <div style={{ textAlign: 'center' }} className="mb-8 sm:mb-12 md:mb-16">
      {tag && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '5px 14px',
            background: G.bgWhite,
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: `1px solid ${G.border}`,
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 600,
            color: G.muted,
            marginBottom: 16,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: G.green,
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          {tag}
        </div>
      )}

      <h2
        style={{
          fontSize: 'clamp(24px,3.5vw,40px)',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          lineHeight: 1.18,
          color: G.dark,
          marginBottom: sub ? 14 : 0,
        }}
      >
        {h2}
      </h2>

      {sub && (
        <p
          style={{
            fontSize: 15,
            color: G.muted,
            maxWidth: 620,
            margin: '0 auto',
            lineHeight: 1.68,
          }}
          className="text-sm sm:text-base"
        >
          {sub}
        </p>
      )}
    </div>
  );
}

/** Green italic highlight span */
function Hi({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ color: G.green, fontStyle: 'italic' }}>{children}</span>
  );
}

/* ─────────────────────────────────────────────────────────────────
   PAGE DATA - 100% HONEST, HUMAN, AND SEO-FRIENDLY
───────────────────────────────────────────────────────────────── */

const GYM_TYPES = [
  { icon: '🏋️‍♂️', name: 'Neighbourhood Strength Gyms' },
  { icon: '🥊', name: 'CrossFit & MMA Studios' },
  { icon: '🧘‍♀️', name: 'Yoga & Pilates Centers' },
  { icon: '💃', name: 'Zumba & Dance Studios' },
  { icon: '🏃‍♂️', name: 'Personal Trainers & Coaches' },
];

const PROBLEMS = [
  {
    icon: <ClipboardX size={22} color="#EF4444" />,
    bg: '#FEF2F2',
    title: 'Renewals slip through quietly',
    desc: "Without a clear alert system, memberships expire without you noticing. You only realize someone is overdue after they have already stopped showing up.",
  },
  {
    icon: <Wallet size={22} color="#F97316" />,
    bg: '#FFF7ED',
    title: 'Payments are scattered across apps',
    desc: 'Google Pay on your personal phone, cash in the front desk drawer, and Paytm QR on the wall. By month-end, matching who paid what takes hours.',
  },
  {
    icon: <MessageCircle size={22} color="#EF4444" />,
    bg: '#FEF2F2',
    title: 'WhatsApp chats get buried',
    desc: "Fee reminders, freeze requests, and payment screenshots get lost inside hundreds of daily personal messages. Important member requests get forgotten.",
  },
  {
    icon: <PieChart size={22} color="#F97316" />,
    bg: '#FFF7ED',
    title: 'You never know your real numbers',
    desc: 'How many active members do you have today? How much did you collect this week? If you have to count notebook pages to find out, you cannot plan ahead.',
  },
  {
    icon: <Users size={22} color="#EF4444" />,
    bg: '#FEF2F2',
    title: 'Members stop coming without warning',
    desc: "When nobody tracks attendance regularly, you don't notice when someone skips gym for two weeks. By the time you call them, they have already lost their habit.",
  },
  {
    icon: <Zap size={22} color="#F97316" />,
    bg: '#FFF7ED',
    title: 'Admin work eats your personal evenings',
    desc: 'After working 14 hours on the gym floor, you spend your quiet time at night cross-checking UPI screenshots, updating Excel files, and sending manual reminders.',
  },
];

const FEATURES = [
  {
    title: 'Member Directory & Profiles',
    desc:  'Keep all your members organized in one clear list. Search any member by name or phone in two seconds, check their plan, and see their full payment history.',
    icon:  <Users size={18} color={G.green} />,
    visual: (
      <div style={{ width: '84%', background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: `1px solid ${G.border}`, borderRadius: 12, padding: 14, textAlign: 'left', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontSize: 11, color: G.muted, fontWeight: 600 }}>Member Directory</div>
          <div style={{ fontSize: 10, color: G.green, background: G.greenLight, padding: '2px 8px', borderRadius: 99, fontWeight: 600 }}>Search ready</div>
        </div>
        {[
          { name: 'Rahul Sharma', plan: 'Gold 3-Month', status: 'Active', c: '#2B9361', bg: '#E9F4EE' },
          { name: 'Priya Singh', plan: 'Silver Monthly', status: 'Due in 3 days', c: '#D97706', bg: '#FEF3C7' },
          { name: 'Amit Kumar', plan: 'Annual Plan', status: 'Active', c: '#2B9361', bg: '#E9F4EE' },
        ].map((m, i, arr) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: i < arr.length - 1 ? `1px solid ${G.border}` : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: G.greenLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: G.green, flexShrink: 0 }}>{m.name[0]}</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: G.dark }}>{m.name}</div>
                <div style={{ fontSize: 10, color: G.muted }}>{m.plan}</div>
              </div>
            </div>
            <span style={{ fontSize: 10, fontWeight: 600, color: m.c, background: m.bg, padding: '3px 8px', borderRadius: 99 }}>{m.status}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: '1-Click WhatsApp Reminders',
    desc:  'See who is due to renew this week. Send friendly, personalized WhatsApp reminders with payment details in one tap, no awkward calls or manual typing.',
    icon:  <MessageCircle size={18} color={G.green} />,
    visual: (
      <div style={{ width: '84%', background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: `1px solid ${G.border}`, borderRadius: 12, padding: 14, textAlign: 'left', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
        <div style={{ fontSize: 11, color: G.muted, marginBottom: 10, fontWeight: 600 }}>Renewals Due This Week</div>
        {[
          { name: 'Sanjay Gupta', days: 'Expires in 2 days', c: '#EF4444', bg: '#FEF2F2' },
          { name: 'Kavita Rao', days: 'Expires in 4 days', c: '#F97316', bg: '#FFF7ED' },
        ].map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, padding: '6px 8px', background: '#F8FAFC', borderRadius: 8 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: G.dark }}>{m.name}</div>
              <div style={{ fontSize: 10, color: m.c, fontWeight: 500 }}>{m.days}</div>
            </div>
            <div style={{ background: '#25D366', color: '#fff', fontSize: 10, fontWeight: 600, padding: '4px 10px', borderRadius: 99, display: 'flex', alignItems: 'center', gap: 4 }}>
              <MessageCircle size={10} /> Send Reminder
            </div>
          </div>
        ))}
        <div style={{ fontSize: 10, color: G.muted, textAlign: 'center', marginTop: 6 }}>Pre-filled friendly message template</div>
      </div>
    ),
  },
  {
    title: 'UPI, Cash & Digital Payments',
    desc:  'Record every rupee the second it is paid. Separate cash and online UPI payments cleanly so your daily cash drawer always matches your records.',
    icon:  <CreditCard size={18} color={G.green} />,
    visual: (
      <div style={{ width: '84%', background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: `1px solid ${G.border}`, borderRadius: 12, padding: 14, textAlign: 'left', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <div><div style={{ fontSize: 10, color: G.muted }}>Today&apos;s Collection</div><div style={{ fontSize: 16, fontWeight: 700, color: G.dark }}>₹14,500</div></div>
          <div style={{ textAlign: 'right' }}><div style={{ fontSize: 10, color: G.muted }}>Pending Dues</div><div style={{ fontSize: 16, fontWeight: 700, color: '#D97706' }}>₹4,200</div></div>
        </div>
        {[
          { label: 'UPI (GPay / PhonePe / QR)', amount: '₹9,500', pct: 65, color: G.green },
          { label: 'Cash at Counter', amount: '₹5,000', pct: 35, color: '#94A3B8' },
        ].map((row, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginBottom: 3 }}>
              <span style={{ color: G.dark, fontWeight: 500 }}>{row.label}</span>
              <span style={{ fontWeight: 600, color: G.dark }}>{row.amount}</span>
            </div>
            <div style={{ height: 5, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${row.pct}%`, background: row.color, borderRadius: 99 }} />
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: 'Clear Daily Dashboard',
    desc:  'Open your phone in the morning and see everything that matters today: new inquiries, today’s check-ins, upcoming renewals, and daily revenue.',
    icon:  <BarChart3 size={18} color={G.green} />,
    visual: (
      <div style={{ width: '84%', background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: `1px solid ${G.border}`, borderRadius: 12, padding: 14, textAlign: 'left', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
        {[
          { label: 'Active Members', value: 'Live Tracker', detail: 'Clean status list', icon: <Users size={13} color={G.green} /> },
          { label: 'Monthly Revenue', value: 'Auto Calculated', detail: 'UPI + Cash synced', icon: <IndianRupee size={13} color={G.green} /> },
          { label: 'Renewals This Week', value: 'Ready to Message', detail: 'WhatsApp 1-click', icon: <MessageCircle size={13} color={G.green} /> },
        ].map((s, i, arr) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < arr.length - 1 ? `1px solid ${G.border}` : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              {s.icon}
              <span style={{ fontSize: 11, color: G.muted }}>{s.label}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: G.dark }}>{s.value}</div>
              <div style={{ fontSize: 9, color: G.green }}>{s.detail}</div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: 'Easy Attendance Tracking',
    desc:  'Mark member check-ins fast. Instantly spot members who have not visited in over a week so you or your trainers can reach out before they drop off.',
    icon:  <CheckCircle2 size={18} color={G.green} />,
    visual: (
      <div style={{ width: '84%', background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: `1px solid ${G.border}`, borderRadius: 12, padding: 14, textAlign: 'left', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' }}>
          <div style={{ fontSize: 11, color: G.muted, fontWeight: 600 }}>Daily Workout Attendance</div>
          <div style={{ fontSize: 9, background: G.greenLight, color: G.green, padding: '2px 8px', borderRadius: 99, fontWeight: 600 }}>Quick Mark</div>
        </div>
        {[
          { name: 'Aditya Singh', time: '07:15 AM', status: 'Checked in' },
          { name: 'Neha Sharma', time: '07:45 AM', status: 'Checked in' },
          { name: 'Vikram Joshi', time: 'Inactive 10 days', status: 'Needs nudge' },
        ].map((m, i, arr) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: i < arr.length - 1 ? `1px solid ${G.border}` : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={13} color={i === 2 ? '#D97706' : G.green} />
              <span style={{ fontSize: 11, fontWeight: 600, color: G.dark }}>{m.name}</span>
            </div>
            <span style={{ fontSize: 9, color: i === 2 ? '#D97706' : G.muted }}>{m.time}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: 'GST Invoices & CA Reports',
    desc:  'Create neat, professional PDF invoices with your gym name and GST number. Download a full summary for your accountant in Excel whenever you need.',
    icon:  <FileText size={18} color={G.green} />,
    visual: (
      <div style={{ width: '84%', background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: `1px solid ${G.border}`, borderRadius: 12, padding: 14, textAlign: 'left', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: G.greenLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={14} color={G.green} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: G.dark }}>Tax Invoice #FK-1042</div>
            <div style={{ fontSize: 9, color: G.muted }}>GST Ready • PDF Generated</div>
          </div>
        </div>
        <div style={{ background: '#F8FAFC', padding: '8px 10px', borderRadius: 8, fontSize: 10, color: G.dark, lineHeight: 1.5 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Gym Membership (3M)</span>
            <span style={{ fontWeight: 600 }}>₹4,500</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: G.muted, marginTop: 2 }}>
            <span>GST (18%)</span>
            <span>Included</span>
          </div>
        </div>
        <div style={{ fontSize: 9, color: G.green, textAlign: 'center', marginTop: 8, fontWeight: 600 }}>
          ✓ 1-Click Excel Export for CA
        </div>
      </div>
    ),
  },
];

const INTEGRATIONS = [
  { name: 'WhatsApp', desc: 'Direct message alerts & receipts', icon: <MessageCircle size={22} color="#25D366" />, color: '#25D366' },
  { name: 'UPI & QR Payments', desc: 'GPay, PhonePe, Paytm, BHIM', icon: <CreditCard size={22} color="#6366F1" />, color: '#6366F1' },
  { name: 'Biometric Machines', desc: 'Fingerprint & RFID ready', icon: <Fingerprint size={22} color="#F59E0B" />, color: '#F59E0B' },
  { name: 'GST & Invoicing', desc: 'Auto tax calculations & PDF bills', icon: <FileText size={22} color="#10B981" />, color: '#10B981' },
  { name: 'Excel & Tally Sync', desc: 'Download sheets for your CA', icon: <PieChart size={22} color="#EC4899" />, color: '#EC4899' },
  { name: 'Class Scheduling', desc: 'Batches, trainers & timings', icon: <Calendar size={22} color="#3B82F6" />, color: '#3B82F6' },
  { name: 'Staff Permissions', desc: 'Trainer & front desk access', icon: <Users size={22} color="#8B5CF6" />, color: '#8B5CF6' },
  { name: 'Data Security', desc: 'Daily backups & private records', icon: <Lock size={22} color="#64748B" />, color: '#64748B' },
];

const PROMISES = [
  { icon: <IndianRupee size={20} color={G.green} />, title: 'Clear, published pricing', desc: 'No hidden setup fees. No surprise price hikes. We publish exactly what you pay in rupees.' },
  { icon: <Lock size={20} color={G.green} />,        title: 'Your data is 100% yours', desc: 'Export your complete member list and payment history to Excel whenever you want. Zero lock-in, ever.' },
  { icon: <Headset size={20} color={G.green} />,     title: 'A real human on the phone', desc: 'Direct WhatsApp and phone support during gym hours. You speak with a real person in India who helps you solve issues quickly.' },
  { icon: <MapPin size={20} color={G.green} />,      title: 'Built for Indian gym realities', desc: 'Designed around UPI payments, WhatsApp culture, cash counters, and GST invoicing - not a foreign corporate copy.' },
  { icon: <CheckCircle2 size={20} color={G.green} />, title: 'Free member data import', desc: 'Moving from notebooks or Excel? Share your list with us on WhatsApp, and our team will format and upload all your members for free.' },
  { icon: <ArrowUpRight size={20} color={G.green} />, title: 'We build what you ask for', desc: 'As an early gym partner, your feedback directly shapes our product. If your gym needs a specific workflow, we build it.' },
];

const PLANS = [
  {
    name:     'Starter',
    price:    '₹599',
    desc:     'Best for personal trainers, small studios, and newly opened gyms.',
    features: ['Up to 100 active members', 'Member directory & profiles', 'Payment tracking (UPI, cash, card)', 'Membership expiry alerts', 'Mobile & computer access', 'Email & WhatsApp support'],
    featured: false,
  },
  {
    name:     'Growth',
    price:    '₹1,000',
    desc:     'Best for active gyms ready to automate renewals and save hours each week.',
    features: ['Up to 500 active members', '1-Click WhatsApp renewal reminders', 'GST-ready PDF invoice generation', 'Daily attendance tracking', 'Financial reports & Excel exports', '2 Staff logins with permission controls'],
    featured: true,
  },
  {
    name:     'Scale',
    price:    '₹1,299',
    desc:     'For large gyms, multi-floor fitness centers, or multi-branch facilities.',
    features: ['Unlimited active members', 'Everything in Growth plan', 'Multi-branch management', 'Unlimited staff logins', 'Biometric sync assistance', 'Priority 1-on-1 founder onboarding'],
    featured: false,
  },
];

const FAQS = [
  {
    q: 'What is FitKalp and how does it help my gym?',
    a: 'FitKalp is a simple gym management software (CRM) designed specifically for Indian gym and fitness studio owners. It helps you manage your member list, send WhatsApp renewal reminders, track UPI and cash payments, and see your daily revenue, without the headache of paper notebooks or confusing spreadsheets.',
  },
  {
    q: 'Do I need a computer or can I use it on my smartphone?',
    a: 'You can use FitKalp on any smartphone, tablet, laptop, or desktop computer. It is optimized to work smoothly in any web browser, so you can easily mark attendance or log a payment right from the gym floor on your phone.',
  },
  {
    q: 'How do I bring my existing members into FitKalp?',
    a: 'We make it completely effortless for you. You do not have to type hundreds of members manually. You can simply share your current Excel sheet or even clear photos of your paper register with us on WhatsApp. Our team will format and import all your members into your account for free.',
  },
  {
    q: 'How do WhatsApp renewal reminders work?',
    a: 'FitKalp automatically identifies which memberships are due to expire in the coming days (e.g., in 3, 5, or 7 days). With one tap, you can send a polite, professional WhatsApp message directly to the member with their renewal details, making payment easy and comfortable.',
  },
  {
    q: 'Can I track both UPI and cash payments separately?',
    a: 'Yes, absolutely. Whenever you record a payment, you can select whether it was received via Google Pay, PhonePe, Paytm, cash, card, or bank transfer. FitKalp maintains a clean ledger so your daily cash drawer and bank statements always reconcile perfectly.',
  },
  {
    q: 'Is my member data safe and private?',
    a: '100% safe. Your data is stored on secure, encrypted cloud servers with daily automated backups. Most importantly, you own your data completely. You can export your full member list, contact details, and payment history to Excel at any time with a single click.',
  },
  {
    q: 'Are there any setup fees or hidden charges?',
    a: 'None at all. There are zero setup fees, zero onboarding fees, and no hidden transaction commissions. You only pay the transparent monthly plan you select.',
  },
  {
    q: 'How does the 14-day free trial work?',
    a: 'When you sign up, you get full access to all FitKalp features for 14 days without paying anything. We do not ask for any credit card or bank details. If FitKalp saves you time and makes your gym easier to run, you can choose a plan to continue. If not, there is no cost and no commitment.',
  },
];

/* ─────────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────────── */
export default function HomePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.08 }
    );
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <main style={{ fontFamily: "'DM Sans','Inter',sans-serif", overflowX: 'hidden' }}>

      {/* ── JSON-LD Structured Data for SEO / Rich Snippets ── */}
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

      {/* ═══════════════════════════════════════════════════════
          1. HERO SECTION
      ═══════════════════════════════════════════════════════ */}
      <section
        style={{
          width: '100%',
          background: 'transparent',
          paddingTop: 110,
          paddingBottom: 64,
          textAlign: 'center',
        }}
        className="pt-28 pb-12 sm:pt-36 sm:pb-20"
      >
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 16px' }} className="px-4 sm:px-6">

          {/* Launch Badge */}
          <div
            className="reveal"
            style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}
          >
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 999,
              background: G.bgWhite, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: `1px solid ${G.border}`,
              fontSize: 12, fontWeight: 600, color: G.muted,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              textAlign: 'center',
              lineHeight: 1.4,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: G.green, display: 'inline-block', flexShrink: 0, animation: 'pulse-dot 2s ease-in-out infinite' }} />
              ✨ Officially Launching in India • Free Early Access &amp; Assisted Setup
            </span>
          </div>

          {/* Headline */}
          <h1
            className="reveal"
            style={{
              fontSize: 'clamp(30px,5vw,60px)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              lineHeight: 1.12,
              color: G.dark,
              maxWidth: 860,
              margin: '0 auto 18px',
            }}
          >
            Stop Running Your Gym on{' '}
            <Hi>WhatsApp</Hi>{' '}
            and Paper Registers
          </h1>

          {/* Subheadline */}
          <p
            className="reveal text-sm sm:text-base mb-6 sm:mb-8"
            style={{ fontSize: 16, color: G.muted, maxWidth: 620, margin: '0 auto 32px', lineHeight: 1.7 }}
          >
            FitKalp is the simple, stress-free gym management software built for Indian gym owners. Track members, collect UPI and cash payments on time, and send polite WhatsApp renewal reminders, all in one place.
          </p>

          {/* CTAs */}
          <div
            className="reveal"
            style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}
          >
            <Link href="/register?intent=trial" className="btn-primary w-full sm:w-auto" style={{ padding: '13px 28px', fontSize: 15, minHeight: 48 }}>
              Start 14-Day Free Trial
            </Link>
            <Link href="/register" className="btn-secondary w-full sm:w-auto" style={{ padding: '13px 28px', fontSize: 15, minHeight: 48 }}>
              Book a 15-Minute Demo
            </Link>
          </div>

          {/* Honest Launch Cohort Trust Bar (No fake reviews) */}
          <div
            className="reveal mb-8 sm:mb-14"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              marginBottom: 48,
              flexWrap: 'wrap',
              fontSize: 13,
              color: G.muted,
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={16} color={G.green} />
              <span>14-day free trial</span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={16} color={G.green} />
              <span>No credit card needed</span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={16} color={G.green} />
              <span>Free member data import</span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={16} color={G.green} />
              <span>Personal founder setup</span>
            </div>
          </div>

          {/* ── Hero visual (Clean interactive product preview) ── */}
          <div
            className="reveal"
            style={{
              position: 'relative',
              maxWidth: 960,
              margin: '0 auto',
              borderRadius: 24,
              background: 'linear-gradient(140deg,#152b1e 0%,#1e5c3a 45%,#0f3321 100%)',
              boxShadow: '0 30px 60px rgba(43,147,97,0.22)',
              overflow: 'hidden',
            }}
          >
            {/* Background grid */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              backgroundSize: '40px 40px',
              backgroundImage:
                'linear-gradient(to right,rgba(255,255,255,0.04) 1px,transparent 1px),' +
                'linear-gradient(to bottom,rgba(255,255,255,0.04) 1px,transparent 1px)',
            }} />

            {/* Desktop and Tablet Viewport Container */}
            <div className="relative min-h-[360px] sm:min-h-[420px] md:min-h-[440px] flex flex-col justify-center items-center p-6 sm:p-8">
              {/* Centre title */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1, gap: 4 }}>
                <div style={{ fontSize: 64, lineHeight: 1, fontWeight: 800, color: 'rgba(255,255,255,0.08)' }}>₹</div>
                <div style={{ fontSize: 'clamp(20px, 3.5vw, 26px)', fontWeight: 700, color: '#fff', marginTop: -6 }}>FitKalp Gym CRM</div>
                <div style={{ fontSize: 'clamp(12px, 2vw, 14px)', color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>Everything your gym needs on one screen</div>
              </div>

              {/* Mobile Grid Preview (Visible under 768px) */}
              <div className="grid md:hidden grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-md mt-6 relative z-10 text-left">
                <div style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, border: `1px solid ${G.border}` }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: G.greenLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CreditCard size={15} color={G.green} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: G.dark }}>Payment Recorded</div>
                    <div style={{ fontSize: 11, color: G.muted }}>₹3,000 via UPI (GPay)</div>
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, border: `1px solid ${G.border}` }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#E9F4EE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MessageCircle size={15} color="#25D366" />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: G.dark }}>1-Click WhatsApp</div>
                    <div style={{ fontSize: 11, color: G.muted }}>Auto renewal alert</div>
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, border: `1px solid ${G.border}` }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: G.greenLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Users size={15} color={G.green} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: G.dark }}>Member Directory</div>
                    <div style={{ fontSize: 11, color: G.muted }}>Search in 2 seconds</div>
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, border: `1px solid ${G.border}` }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: G.greenLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <IndianRupee size={15} color={G.green} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: G.dark }}>Today&apos;s Summary</div>
                    <div style={{ fontSize: 11, color: G.green, fontWeight: 600 }}>₹14,500 Collected</div>
                  </div>
                </div>
              </div>

              {/* Float card - top-left: Payment Logged (Desktop only) */}
              <div className="hidden md:flex animate-float-1" style={{ position: 'absolute', top: '14%', left: '4%', background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: 14, boxShadow: '0 16px 40px rgba(0,0,0,0.15)', padding: '12px 16px', alignItems: 'center', gap: 12, zIndex: 4, border: `1px solid ${G.border}` }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: G.greenLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CreditCard size={16} color={G.green} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: G.dark }}>Payment Recorded</div>
                  <div style={{ fontSize: 11, color: G.muted }}>₹3,000 via UPI (Google Pay)</div>
                </div>
              </div>

              {/* Float card - bottom-left: Revenue Overview (Desktop only) */}
              <div className="hidden md:flex animate-float-2" style={{ position: 'absolute', bottom: '12%', left: '4%', background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: 14, boxShadow: '0 16px 40px rgba(0,0,0,0.15)', padding: '12px 16px', zIndex: 4, border: `1px solid ${G.border}`, textAlign: 'left' }}>
                <div style={{ fontSize: 11, color: G.muted, fontWeight: 500, marginBottom: 4 }}>Today&apos;s Summary</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: G.dark }}>₹14,500</div>
                  <span style={{ fontSize: 10, color: G.green, fontWeight: 600 }}>All UPI &amp; Cash Tracked</span>
                </div>
                <div style={{ fontSize: 10, color: G.muted, marginTop: 4 }}>
                  Instant report for your CA
                </div>
              </div>

              {/* Float card - top-right: Member Overview (Desktop only) */}
              <div className="hidden md:flex animate-float-3" style={{ position: 'absolute', top: '14%', right: '4%', background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: 14, boxShadow: '0 16px 40px rgba(0,0,0,0.15)', padding: '12px 16px', zIndex: 4, border: `1px solid ${G.border}`, textAlign: 'left' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: G.dark, marginBottom: 6 }}>Member Profiles</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: G.green }} />
                  <span style={{ fontSize: 11, color: G.dark, fontWeight: 500 }}>Active &amp; Expiring Plans</span>
                </div>
                <div style={{ fontSize: 10, color: G.muted }}>Search any member in 2 seconds</div>
              </div>

              {/* Float card - bottom-right: WhatsApp reminder (Desktop only) */}
              <div className="hidden md:flex animate-float-1" style={{ position: 'absolute', bottom: '12%', right: '4%', background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderRadius: 14, boxShadow: '0 16px 40px rgba(0,0,0,0.15)', padding: '12px 16px', alignItems: 'center', gap: 12, zIndex: 4, border: `1px solid ${G.border}` }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#E9F4EE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MessageCircle size={16} color="#25D366" />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: G.dark }}>Renewals Due Soon</div>
                  <div style={{ fontSize: 11, color: G.muted }}>1-Click WhatsApp reminder</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          2. WHO FITKALP IS BUILT FOR (Honest category strip)
      ═══════════════════════════════════════════════════════ */}
      <section style={{ width: '100%', background: 'transparent', padding: '16px 0 32px' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 16px', textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: G.muted, fontWeight: 600, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Built specifically for independent fitness businesses across India
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            {GYM_TYPES.map((g) => (
              <span
                key={g.name}
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  color: G.dark,
                  background: G.bgWhite,
                  border: `1px solid ${G.border}`,
                  padding: '7px 15px',
                  borderRadius: 999,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                }}
              >
                <span>{g.icon}</span> {g.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          3. THE PROBLEM (Heart-to-heart empathy)
      ═══════════════════════════════════════════════════════ */}
      <Sect id="problem">
        <SectionHeader
          tag="The Daily Reality"
          h2={<>You opened a gym to coach people, not to become a <Hi>full-time accountant</Hi></>}
          sub="Running a gym in India is hard work. When you're managing members by memory or notebooks, the same avoidable headaches happen every single month."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {PROBLEMS.map((p, i) => (
            <div
              key={i}
              className="reveal glass-card p-5 sm:p-7"
              style={{
                borderRadius: 22,
                textAlign: 'left',
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                {p.icon}
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: G.dark, marginBottom: 8, lineHeight: 1.3 }}>{p.title}</h3>
              <p style={{ color: G.muted, fontSize: 13.5, lineHeight: 1.65 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </Sect>

      {/* ═══════════════════════════════════════════════════════
          4. FEATURES (Clear, human, practical)
      ═══════════════════════════════════════════════════════ */}
      <Sect id="features">
        <SectionHeader
          tag="How FitKalp Helps"
          h2={<>Everything you need to run your gym, <Hi>made simple</Hi></>}
          sub="No complicated training required. No 50-step setup. Just clear, practical tools that take the daily stress out of managing members, payments, and renewals."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="reveal glass-card p-5 sm:p-6"
              style={{
                borderRadius: 22,
                textAlign: 'center',
              }}
            >
              {/* Feature visual box */}
              <div
                style={{
                  background: G.bgAlt,
                  border: `1px solid ${G.border}`,
                  borderRadius: 14,
                  height: 190,
                  marginBottom: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundSize: '20px 20px',
                  backgroundImage:
                    'linear-gradient(to right,rgba(0,0,0,0.03) 1px,transparent 1px),' +
                    'linear-gradient(to bottom,rgba(0,0,0,0.03) 1px,transparent 1px)',
                }}
              >
                {f.visual}
              </div>

              {/* Icon + title */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: G.greenLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 16.5, fontWeight: 700, color: G.dark, margin: 0 }}>{f.title}</h3>
              </div>

              <p style={{ color: G.muted, fontSize: 13.5, lineHeight: 1.6, maxWidth: 300, margin: '0 auto' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </Sect>

      {/* ═══════════════════════════════════════════════════════
          5. INTEGRATIONS & EVERYDAY TOOLS
      ═══════════════════════════════════════════════════════ */}
      <Sect>
        <SectionHeader
          tag="Everyday Ecosystem"
          h2={<>Works with the tools you <Hi>already use</Hi></>}
          sub="You don't need to change how you work. FitKalp fits smoothly into the everyday apps and payment systems Indian gyms use."
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 max-w-5xl mx-auto">
          {INTEGRATIONS.map((ig, i) => (
            <div
              key={i}
              className="reveal glass-card p-4 sm:p-5"
              style={{
                borderRadius: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: `${ig.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {ig.icon}
              </div>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ fontSize: 14.5, fontWeight: 700, color: G.dark, margin: '0 0 2px 0' }}>{ig.name}</h4>
                <p style={{ fontSize: 12, color: G.muted, margin: 0, lineHeight: 1.4 }}>{ig.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Sect>

      {/* ═══════════════════════════════════════════════════════
          6. OUR STORY & FOUNDING PARTNER INVITATION (Honest & Human)
      ═══════════════════════════════════════════════════════ */}
      <Sect id="story">
        <div
          className="reveal p-5 sm:p-8 md:p-12"
          style={{
            maxWidth: 920,
            margin: '0 auto',
            background: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${G.border}`,
            borderRadius: 28,
            boxShadow: '0 12px 40px -6px rgba(0,0,0,0.06), 0 1px 1px 0 rgba(255,255,255,0.9) inset',
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', background: G.greenLight, borderRadius: 999, fontSize: 12, fontWeight: 600, color: G.green, marginBottom: 18 }}>
            <Sparkles size={14} /> An Open Letter to Gym Owners
          </div>

          <h2 style={{ fontSize: 'clamp(22px,3.2vw,34px)', fontWeight: 700, color: G.dark, marginBottom: 18, lineHeight: 1.25 }}>
            Why we built FitKalp - and why we are doing things <Hi>differently</Hi>
          </h2>

          <div style={{ color: G.dark, fontSize: 14.5, lineHeight: 1.75, display: 'flex', flexDirection: 'column', gap: 14 }} className="text-sm sm:text-base">
            <p>
              When we started building FitKalp, we spent weeks talking to local gym owners across India. We met owners who wake up at 5:00 AM, train members with genuine care, and stay open until 10:00 PM, only to spend another hour late at night checking paper registers and matching UPI screenshots.
            </p>
            <p>
              Existing gym software on the market was either outdated, overpriced, or built for foreign corporate gym chains with confusing menus you never need.
            </p>
            <p>
              <strong>We built FitKalp to change that.</strong> We are officially launching now with a clear promise: to give Indian gym owners the cleanest, easiest, and most honest tool to manage their business.
            </p>
            <p>
              Because we are launching, we do not have corporate layers or call centers. When you sign up as one of our founding gym partners, you get our direct WhatsApp number. We will personally help you set up your account, import your existing members for free, and build the features your gym actually needs.
            </p>
          </div>

          {/* Founding Partner Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#EFEFEF]">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <HeartHandshake size={20} color={G.green} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: G.dark }}>Direct Founder Line</div>
                <div style={{ fontSize: 12, color: G.muted, marginTop: 2 }}>WhatsApp directly with the creators whenever you need help.</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <FileText size={20} color={G.green} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: G.dark }}>100% Free Data Import</div>
                <div style={{ fontSize: 12, color: G.muted, marginTop: 2 }}>Send us your Excel sheet or register photos; we set it all up.</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <ShieldCheck size={20} color={G.green} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: G.dark }}>Zero Lock-in Guarantee</div>
                <div style={{ fontSize: 12, color: G.muted, marginTop: 2 }}>Export your full member and financial data anytime in 1 click.</div>
              </div>
            </div>
          </div>
        </div>
      </Sect>

      {/* ═══════════════════════════════════════════════════════
          7. CORE PROMISES
      ═══════════════════════════════════════════════════════ */}
      <Sect>
        <SectionHeader
          tag="Our Commitments"
          h2={<>Core promises we <Hi>don&apos;t break</Hi></>}
          sub="We want to earn your long-term trust. Here is what you can always count on from us:"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {PROMISES.map((p, i) => (
            <div
              key={i}
              className="reveal glass-card p-5 sm:p-6"
              style={{
                borderRadius: 20,
                display: 'flex',
                gap: 14,
              }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 12, background: G.greenLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {p.icon}
              </div>
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ fontSize: 15.5, fontWeight: 700, color: G.dark, marginBottom: 4, lineHeight: 1.3 }}>{p.title}</h3>
                <p style={{ color: G.muted, fontSize: 13, lineHeight: 1.6 }}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Sect>

      {/* ═══════════════════════════════════════════════════════
          8. PRICING
      ═══════════════════════════════════════════════════════ */}
      <Sect id="pricing">
        <SectionHeader
          tag="Simple &amp; Fair Pricing"
          h2={<>Honest pricing with <Hi>zero hidden fees</Hi></>}
          sub="Start with a 14-day free trial. No credit card required. Pick a straightforward plan that fits your gym."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 max-w-4xl mx-auto mb-10 items-stretch">
          {PLANS.map((plan, i) => (
            <div
              key={i}
              className="reveal p-6 sm:p-8"
              style={{
                background: plan.featured ? '#FFFFFF' : 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: plan.featured ? `2px solid ${G.green}` : `1px solid ${G.border}`,
                borderRadius: 24,
                position: 'relative',
                boxShadow: plan.featured ? '0 12px 36px -4px rgba(43,147,97,0.18), 0 1px 1px 0 rgba(255,255,255,0.9) inset' : '0 4px 20px -2px rgba(0,0,0,0.03)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {plan.featured && (
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: G.green, color: '#fff', fontSize: 12, fontWeight: 700, padding: '4px 16px', borderRadius: 99, whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(43,147,97,0.3)' }}>
                  Most Popular for Gyms
                </div>
              )}
              <h3 style={{ fontSize: 19, fontWeight: 700, color: G.dark, marginBottom: 6 }}>{plan.name}</h3>
              <p style={{ fontSize: 13, color: G.muted, marginBottom: 18, minHeight: 38, lineHeight: 1.5 }}>{plan.desc}</p>
              
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 20 }}>
                <span style={{ fontSize: 38, fontWeight: 700, color: G.green, letterSpacing: '-0.02em' }}>{plan.price}</span>
                <span style={{ fontSize: 13.5, color: G.muted }}>/ month</span>
              </div>

              <Link
                href={`/register?plan=${encodeURIComponent(plan.name)}&intent=trial`}
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
                  transition: 'opacity 0.2s',
                  minHeight: 46,
                }}
              >
                Start 14-Day Free Trial
              </Link>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, padding: 0, margin: 0, marginTop: 'auto' }}>
                {plan.features.map((feat, fi) => (
                  <li key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: G.dark, lineHeight: 1.4 }}>
                    <CheckCircle2 size={15} color={G.green} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link
            href="/pricing"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: G.green, fontWeight: 600, textDecoration: 'none', fontSize: 15 }}
          >
            See full plan comparison &amp; FAQs <ArrowRight size={16} />
          </Link>
          <p style={{ fontSize: 13, color: G.muted, marginTop: 8 }}>14-day free trial · Free data import · Cancel anytime · Your data is always yours</p>
        </div>
      </Sect>

      {/* ═══════════════════════════════════════════════════════
          9. FAQ (High search intent & helpful answers)
      ═══════════════════════════════════════════════════════ */}
      <Sect id="faq">
        <SectionHeader
          tag="Got Questions?"
          h2={<>Everything you need to <Hi>know</Hi></>}
          sub="Clear, straightforward answers about how FitKalp works and how we help your gym."
        />
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          {FAQS.map((faq, i) => (
            <div
              key={i}
              onClick={() => setActiveFaq(activeFaq === i ? null : i)}
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: `1px solid ${activeFaq === i ? G.green : G.border}`,
                borderRadius: 16,
                marginBottom: 10,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                textAlign: 'left',
                boxShadow: activeFaq === i ? '0 4px 16px rgba(43,147,97,0.08)' : '0 2px 6px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <span style={{ fontWeight: 600, color: G.dark, fontSize: 14.5, lineHeight: 1.4 }}>{faq.q}</span>
                <span style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  flexShrink: 0,
                  background: activeFaq === i ? G.green : G.bgAlt,
                  color: activeFaq === i ? '#fff' : G.muted,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 17,
                  fontWeight: 300,
                  transform: activeFaq === i ? 'rotate(45deg)' : 'none',
                  transition: 'all 0.25s ease',
                }}>+</span>
              </div>
              {activeFaq === i && (
                <div style={{ padding: '0 18px 18px', color: G.muted, fontSize: 13.5, lineHeight: 1.7, borderTop: `1px solid ${G.border}`, paddingTop: 12 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </Sect>

      {/* ═══ 10. FINAL BOTTOM CTA BANNER ═══════════════════════════ */}
      <Sect id="cta">
        <div
          className="py-10 px-5 sm:py-16 sm:px-8"
          style={{
            background: G.bgWhite,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${G.border}`,
            borderRadius: 28,
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0,0,0,0.04)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle green glow */}
          <div style={{ position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)', width: 400, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(43,147,97,0.08) 0%,transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <span style={{ display: 'inline-block', fontSize: 12.5, color: G.green, fontWeight: 600, background: G.greenLight, padding: '5px 16px', borderRadius: 99, marginBottom: 18 }}>
              Launch Cohort Now Open
            </span>
            <h2 style={{ fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, letterSpacing: '-0.02em', color: G.dark, marginBottom: 14, lineHeight: 1.15 }}>
              Ready to take the stress out of <Hi>Running Your Gym?</Hi>
            </h2>
            <p className="text-sm sm:text-base" style={{ color: G.muted, fontSize: 15.5, maxWidth: 540, margin: '0 auto 28px', lineHeight: 1.68 }}>
              Try FitKalp free for 14 days. We will personally help you import your members, configure your plans, and get everything running smoothly.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/register?intent=trial" className="btn-primary w-full sm:w-auto" style={{ padding: '13px 30px', fontSize: 15, minHeight: 48 }}>
                Start Free 14-Day Trial
              </Link>
              <Link href="/register" className="btn-secondary w-full sm:w-auto" style={{ padding: '13px 30px', fontSize: 15, minHeight: 48 }}>
                Schedule a 15-Minute Demo
              </Link>
            </div>
            <p style={{ fontSize: 12, color: G.muted, marginTop: 16 }}>
              No credit card required · Free member data migration · Direct founder assistance
            </p>
          </div>
        </div>
      </Sect>

    </main>
  );
}
