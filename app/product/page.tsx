import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Users, RefreshCw, CreditCard, Calendar, BarChart2, Download, CheckCircle2,
  MessageCircle, UserCog,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Product - Gym Management CRM',
  description:
    'See everything FitKalp does: member management, automated renewal reminders, payment tracking, WhatsApp integration, GST invoicing, and smart reporting.',
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



const FEATURES = [
  { icon: <Users size={22} color={G.green} />,       title: 'Members & Plans',       desc: 'Add unlimited members. Create custom membership plans: monthly, quarterly, annual, or custom. Track active, expired, and due-soon members at a glance.' },
  { icon: <RefreshCw size={22} color={G.green} />,   title: 'Renewal Reminders',     desc: 'Automatically know who\'s due in the next 7, 14, or 30 days. Send WhatsApp reminders from inside FitKalp with one click.' },
  { icon: <CreditCard size={22} color={G.green} />,  title: 'Payment Tracking',      desc: 'Record UPI, cash, and card payments. See revenue by day/week/month. Auto-generate GST-ready PDF invoices.' },
  { icon: <Calendar size={22} color={G.green} />,    title: 'Attendance',            desc: 'Track daily attendance per member. See who\'s attending regularly and who might be at risk of dropping off.' },
  { icon: <BarChart2 size={22} color={G.green} />,   title: 'Reports & Analytics',   desc: 'Know your revenue, active members, churn rate, and collection rate instantly. Export to Excel for your accountant.' },
  { icon: <Download size={22} color={G.green} />,    title: 'Data Ownership',        desc: 'Your data is yours. Export your full member database and transaction history any time, in any format. No lock-in.' },
  { icon: <MessageCircle size={22} color={G.green} />, title: 'WhatsApp Integration',  desc: 'Send payment receipts, renewal alerts, and birthday wishes directly to members\' WhatsApp numbers instantly.' },
  { icon: <UserCog size={22} color={G.green} />,       title: 'Staff Management',      desc: 'Create secure logins for your trainers and front desk. Control exactly what data they can see, edit, or export.' },
];

const STEPS = [
  { n: '1', title: 'Add your members',         desc: 'Import existing data or add one by one. Set their plan, start date, and fees.' },
  { n: '2', title: 'FitKalp tracks everything', desc: 'Renewals, payments, attendance, and dues are tracked automatically. You see it all on one dashboard.' },
  { n: '3', title: 'You stay in control',       desc: 'Get WhatsApp reminders, produce GST invoices, export your data anytime.' },
];

/* ── Realistic Interactive CRM Dashboard Mockup ─────────── */
function DashboardMockup({ title }: { title: string }) {
  const isOverview = title.toLowerCase().includes('overview');
  const isMembers = title.toLowerCase().includes('members');
  const isPayments = title.toLowerCase().includes('payments');

  return (
    <div style={{ background: '#FFFFFF', border: `1px solid ${G.border}`, borderRadius: 20, overflow: 'hidden', boxShadow: '0 12px 36px -4px rgba(0,0,0,0.08), 0 1px 1px 0 rgba(255,255,255,0.9) inset' }}>
      {/* Browser bar */}
      <div style={{ background: '#F8FAFC', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 6, borderBottom: `1px solid ${G.border}` }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FC5F5A', display: 'inline-block', flexShrink: 0 }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FDBC40', display: 'inline-block', flexShrink: 0 }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#34C84A', display: 'inline-block', flexShrink: 0 }} />
        <span style={{ flex: 1, background: '#FFFFFF', border: `1px solid ${G.border}`, borderRadius: 6, padding: '4px 12px', fontSize: 11, color: G.muted, marginLeft: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left' }}>
          app.fitkalp.com/{title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
        </span>
      </div>

      {/* Content based on title */}
      <div className="p-4 sm:p-6 text-left" style={{ background: '#FAFDFB' }}>
        {isOverview && (
          <div className="flex flex-col gap-4">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              <div style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: 12, border: `1px solid ${G.border}`, boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: 11, color: G.muted, fontWeight: 500 }}>Active Members</div>
                <div style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', fontWeight: 700, color: G.dark, marginTop: 2 }}>348</div>
                <div style={{ fontSize: 10, color: G.green, fontWeight: 600, marginTop: 2 }}>+14 this month</div>
              </div>
              <div style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: 12, border: `1px solid ${G.border}`, boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: 11, color: G.muted, fontWeight: 500 }}>Today&apos;s Collection</div>
                <div style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', fontWeight: 700, color: G.dark, marginTop: 2 }}>₹18,500</div>
                <div style={{ fontSize: 10, color: G.muted, marginTop: 2 }}>UPI &amp; Cash Synced</div>
              </div>
              <div style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: 12, border: `1px solid ${G.border}`, boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: 11, color: G.muted, fontWeight: 500 }}>Renewals Due</div>
                <div style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', fontWeight: 700, color: '#D97706', marginTop: 2 }}>9</div>
                <div style={{ fontSize: 10, color: G.green, fontWeight: 600, marginTop: 2 }}>WhatsApp Ready</div>
              </div>
            </div>

            {/* Live Renewal Alerts */}
            <div style={{ background: '#FFFFFF', borderRadius: 12, border: `1px solid ${G.border}`, padding: '12px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: G.dark }}>Upcoming Renewals &amp; Payments</span>
                <span style={{ fontSize: 10, background: G.greenLight, color: G.green, padding: '2px 8px', borderRadius: 99, fontWeight: 600 }}>Live Feed</span>
              </div>
              {[
                { name: 'Sanjay Verma', plan: 'Gold 3-Month', status: 'Expires in 2 days', mode: 'WhatsApp Alert', c: '#EF4444', bg: '#FEF2F2' },
                { name: 'Ritu Patel', plan: 'Quarterly Cardio', status: 'Paid ₹4,500 via GPay', mode: 'Receipt Sent', c: '#2B9361', bg: '#E9F4EE' },
                { name: 'Amit Desai', plan: 'Annual Membership', status: 'Active (Checked in 07:15)', mode: 'Verified', c: '#2B9361', bg: '#E9F4EE' },
              ].map((row, i, arr) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < arr.length - 1 ? `1px solid ${G.border}` : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: G.greenLight, color: G.green, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                      {row.name[0]}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: G.dark }}>{row.name}</div>
                      <div style={{ fontSize: 10, color: G.muted }}>{row.plan} • {row.status}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 600, color: row.c, background: row.bg, padding: '3px 9px', borderRadius: 99 }}>
                    {row.mode}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {isMembers && (
          <div className="flex flex-col gap-3">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFFFF', padding: '8px 12px', borderRadius: 8, border: `1px solid ${G.border}` }}>
              <span style={{ fontSize: 11, color: G.muted }}>🔍 Search members by name, mobile, or plan...</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: G.green, background: G.greenLight, padding: '2px 8px', borderRadius: 99 }}>348 Total</span>
            </div>
            {[
              { name: 'Rahul Sharma', phone: '+91 98201 •••••', plan: 'Gold 3-Month', status: 'Active', days: '62 days left', c: '#2B9361', bg: '#E9F4EE' },
              { name: 'Priya Singh', phone: '+91 94100 •••••', plan: 'Silver Monthly', status: 'Due in 3 days', days: 'Expires 30 Aug', c: '#D97706', bg: '#FEF3C7' },
              { name: 'Vikram Joshi', phone: '+91 98920 •••••', plan: 'Annual Plan', status: 'Active', days: '210 days left', c: '#2B9361', bg: '#E9F4EE' },
              { name: 'Kavita Rao', phone: '+91 91672 •••••', plan: 'Strength 1-Month', status: 'Expired', days: 'Needs WhatsApp nudge', c: '#EF4444', bg: '#FEF2F2' },
            ].map((m, i, arr) => (
              <div key={i} style={{ background: '#FFFFFF', padding: '10px 12px', borderRadius: 10, border: `1px solid ${G.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: G.greenLight, color: G.green, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                    {m.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: G.dark }}>{m.name}</div>
                    <div style={{ fontSize: 10.5, color: G.muted }}>{m.phone} • {m.plan}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: m.c, background: m.bg, padding: '3px 8px', borderRadius: 99 }}>{m.status}</span>
                  <div style={{ fontSize: 9.5, color: G.muted, marginTop: 2 }}>{m.days}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isPayments && (
          <div className="flex flex-col gap-3">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFFFF', padding: '10px 14px', borderRadius: 10, border: `1px solid ${G.border}` }}>
              <div>
                <div style={{ fontSize: 10.5, color: G.muted }}>Month-to-Date Revenue</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: G.dark }}>₹1,42,800</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10.5, color: G.green, fontWeight: 600 }}>✓ GST Reconciled</div>
                <div style={{ fontSize: 10, color: G.muted }}>Instant CA Excel Export</div>
              </div>
            </div>

            {[
              { id: 'INV-1048', member: 'Rahul Sharma', amount: '₹4,500', method: 'UPI (PhonePe)', status: 'GST Paid', time: 'Today, 10:30 AM' },
              { id: 'INV-1047', member: 'Neha Kapoor', amount: '₹2,500', method: 'Cash Counter', status: 'Logged', time: 'Today, 09:15 AM' },
              { id: 'INV-1046', member: 'Aditya Birla', amount: '₹12,000', method: 'UPI (Google Pay)', status: 'Annual GST Bill', time: 'Yesterday' },
            ].map((tx, i) => (
              <div key={i} style={{ background: '#FFFFFF', padding: '10px 12px', borderRadius: 10, border: `1px solid ${G.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: G.dark }}>{tx.member} <span style={{ fontSize: 10, color: G.muted, fontWeight: 400 }}>({tx.id})</span></div>
                  <div style={{ fontSize: 10, color: G.muted }}>{tx.method} • {tx.time}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: G.green }}>{tx.amount}</div>
                  <span style={{ fontSize: 9.5, color: G.green, background: G.greenLight, padding: '2px 6px', borderRadius: 99, fontWeight: 600 }}>{tx.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductPage() {
  return (
    <main style={{ fontFamily: "'DM Sans','Inter',sans-serif", overflowX: 'hidden' }}>

      {/* ═══ 1. HERO ═══════════════════════════════════════════════ */}
      <section className="pt-28 pb-12 sm:pt-36 sm:pb-20 text-center">
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 16px' }} className="px-4 sm:px-6">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 18px', borderRadius: 999,
              background: G.bgWhite, border: `1px solid ${G.border}`,
              fontSize: 13, fontWeight: 500, color: G.muted,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: G.green, display: 'inline-block' }} />
              The CRM
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(28px,5vw,62px)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            lineHeight: 1.1,
            color: G.dark,
            maxWidth: 760,
            margin: '0 auto 20px',
          }}>
            Everything your gym needs.{' '}
            <span style={{ color: G.green, fontStyle: 'italic' }}>Nothing it doesn&apos;t.</span>
          </h1>

          <p className="text-sm sm:text-base mb-8 sm:mb-12" style={{ fontSize: 16, color: G.muted, maxWidth: 600, margin: '0 auto 36px', lineHeight: 1.7 }}>
            FitKalp is purpose-built for Indian independent gym and studio owners, not adapted from a Western SaaS product. Every feature was designed around how your gym actually works.
          </p>

          {/* Dashboard mockup */}
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <DashboardMockup title="Dashboard Overview" />
          </div>
        </div>
      </section>

      {/* ═══ 2. HOW IT WORKS ═══════════════════════════════════════ */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div style={{ textAlign: 'center' }} className="mb-8 sm:mb-14">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: G.bgWhite, border: `1px solid ${G.border}`, borderRadius: 999, fontSize: 13, fontWeight: 500, color: G.muted, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: G.green, display: 'inline-block' }} />
              Simple to Start
            </div>
            <h2 style={{ fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.18, color: G.dark }}>
              Up and running in{' '}
              <span style={{ color: G.green, fontStyle: 'italic' }}>30 minutes</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5" style={{ maxWidth: 860, margin: '0 auto' }}>
            {STEPS.map((s, i) => (
              <div key={i} className="p-5 sm:p-6" style={{ background: G.bgAlt, border: `1px solid ${G.border}`, borderRadius: 20, textAlign: 'center' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: G.greenLight, border: `2px solid ${G.green}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 17, color: G.green, margin: '0 auto 14px' }}>
                  {s.n}
                </div>
                <h3 style={{ fontSize: 16.5, fontWeight: 700, color: G.dark, marginBottom: 6 }}>{s.title}</h3>
                <p style={{ color: G.muted, fontSize: 13.5, lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 3. FEATURES GRID ══════════════════════════════════════ */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div style={{ textAlign: 'center' }} className="mb-8 sm:mb-14">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: G.bgWhite, border: `1px solid ${G.border}`, borderRadius: 999, fontSize: 13, fontWeight: 500, color: G.muted, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: G.green, display: 'inline-block' }} />
              Smart Features
            </div>
            <h2 style={{ fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.18, color: G.dark }}>
              Everything you need to run your{' '}
              <span style={{ color: G.green, fontStyle: 'italic' }}>gym</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {FEATURES.map((f, i) => (
              <div key={i} className="p-5 sm:p-6" style={{ background: G.bgWhite, border: `1px solid ${G.border}`, borderRadius: 20, transition: 'all 0.3s ease' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: G.greenLight, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 15.5, fontWeight: 700, color: G.dark, marginBottom: 6 }}>{f.title}</h3>
                <p style={{ color: G.muted, fontSize: 13, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4. WALKTHROUGH ════════════════════════════════════════ */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 48 }}>

          {/* Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            <div>
              <h2 style={{ fontSize: 'clamp(22px,3vw,34px)', fontWeight: 700, color: G.dark, marginBottom: 16, lineHeight: 1.2 }}>
                Members, always <span style={{ color: G.green, fontStyle: 'italic' }}>organised</span>
              </h2>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, padding: 0, margin: 0 }}>
                {[
                  'Search for any member by name or phone number instantly.',
                  'See full history: active plans, past payments, and attendance.',
                  'Upload profile photos to easily recognise members at the front desk.',
                ].map((pt, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: G.dark, lineHeight: 1.5 }}>
                    <CheckCircle2 size={17} color={G.green} style={{ flexShrink: 0, marginTop: 2 }} />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
            <DashboardMockup title="Active Members" />
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <DashboardMockup title="Payments & Revenue" />
            </div>
            <div className="order-1 lg:order-2">
              <h2 style={{ fontSize: 'clamp(22px,3vw,34px)', fontWeight: 700, color: G.dark, marginBottom: 16, lineHeight: 1.2 }}>
                Payments without the <span style={{ color: G.green, fontStyle: 'italic' }}>chaos</span>
              </h2>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, padding: 0, margin: 0 }}>
                {[
                  'Log partial payments and easily track outstanding dues.',
                  'Automatically generate professional invoices with GST details.',
                  'Reconcile cash and digital payments at the end of every day.',
                ].map((pt, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: G.dark, lineHeight: 1.5 }}>
                    <CheckCircle2 size={17} color={G.green} style={{ flexShrink: 0, marginTop: 2 }} />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* ═══ 5. CTA ════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
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
          <div style={{ position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)', width: 400, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(43,147,97,0.08) 0%,transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <span style={{ display: 'inline-block', fontSize: 12.5, color: G.green, fontWeight: 600, background: G.greenLight, padding: '5px 16px', borderRadius: 999, marginBottom: 16 }}>
              See It Live
            </span>
            <h2 style={{ fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, letterSpacing: '-0.02em', color: G.dark, marginBottom: 12, lineHeight: 1.18 }}>
              See FitKalp in your gym:{' '}
              <span style={{ color: G.green, fontStyle: 'italic' }}>book a 20-minute demo</span>
            </h2>
            <p className="text-sm sm:text-base" style={{ color: G.muted, fontSize: 15, maxWidth: 480, margin: '0 auto 24px', lineHeight: 1.68 }}>
              We&apos;ll walk you through the features that matter most to your gym, live and in your browser.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/register" className="btn-primary w-full sm:w-auto" style={{ padding: '13px 28px', fontSize: 15, minHeight: 48 }}>
                Book a Demo
              </Link>
              <Link href="/pricing" className="btn-secondary w-full sm:w-auto" style={{ padding: '13px 28px', fontSize: 15, minHeight: 48 }}>
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
