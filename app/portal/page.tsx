'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { Calendar, CreditCard, Download, FileSignature, LogOut, Snowflake, User } from 'lucide-react';

const portalApi = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1' });
portalApi.interceptors.request.use(config => { if (typeof window !== 'undefined') { const token = window.localStorage.getItem('fitkalp_member_token'); if (token) config.headers.Authorization = `Bearer ${token}`; } return config; });
const card = { background: '#fff', border: '1px solid #E8EAED', borderRadius: 14, padding: 18 };
const input = { width: '100%', boxSizing: 'border-box' as const, padding: 11, border: '1.5px solid #DDE1E6', borderRadius: 9, fontSize: 16 };
const button = { border: 0, background: '#2B9361', color: '#fff', padding: '10px 16px', borderRadius: 9, cursor: 'pointer', fontWeight: 700, minHeight: 44 };
interface Membership { id: string; status: string; startDate: string; expiryDate: string; amountDue: number; plan?: { name: string } }
interface Invoice { id: string; invoiceNumber: string; invoiceDate: string; totalAmount: number; amountDue: number; status: string }
interface Payment { id: string; paymentNumber: string; amount: number; paymentMethod: string; markedPaidAt: string }
interface GymClass { id: string; name: string; daysOfWeek: number[]; startTime: string; durationMinutes: number; capacity: number }
interface Booking { id: string; classId: string; sessionDateTime: string; status: string; class?: GymClass }
interface Agreement { id: string; agreementNumber: string; templateName: string; status: string; signedAt?: string }
interface FreezeRequest { id: string; status: string; requestedStartDate: string; requestedEndDate: string; reason: string }
interface Overview {
  member: { firstName: string; lastName: string; membershipNumber: string; status: string };
  memberships: Membership[]; invoices: Invoice[]; payments: Payment[]; bookings: Booking[]; agreements: Agreement[]; freezeRequests: FreezeRequest[];
}
function errorMessage(error: unknown) { if (axios.isAxiosError(error)) { const value = error.response?.data?.message; return Array.isArray(value) ? value.join(', ') : value || 'Request failed'; } return 'Request failed'; }

export default function PortalPage() {
  const [token, setToken] = useState(() => typeof window === 'undefined' ? '' : window.localStorage.getItem('fitkalp_member_token') || '');
  const [overview, setOverview] = useState<Overview | null>(null);
  const [classes, setClasses] = useState<GymClass[]>([]);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [tenantSlug, setTenantSlug] = useState('');
  const [membershipNumber, setMembershipNumber] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [sessionDates, setSessionDates] = useState<Record<string, string>>({});
  const [freeze, setFreeze] = useState({ membershipId: '', startDate: '', endDate: '', reason: '' });
  const [showFreeze, setShowFreeze] = useState(false);

  async function load() {
    setLoading(true);
    try { const [me, schedule] = await Promise.all([portalApi.get<Overview>('/member-portal/me'), portalApi.get<GymClass[]>('/member-portal/classes')]); setOverview(me.data); setClasses(schedule.data); setError(''); }
    catch (loadError) { setError(errorMessage(loadError)); if (axios.isAxiosError(loadError) && loadError.response?.status === 401) logout(); }
    finally { setLoading(false); }
  }
  useEffect(() => {
    if (!token) return;
    let active = true;
    void Promise.all([portalApi.get<Overview>('/member-portal/me'), portalApi.get<GymClass[]>('/member-portal/classes')])
      .then(([me, schedule]) => { if (active) { setOverview(me.data); setClasses(schedule.data); } })
      .catch(loadError => { if (active) setError(errorMessage(loadError)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [token]);
  async function login(event: FormEvent) {
    event.preventDefault(); setError('');
    try { const { data } = await portalApi.post<{ access_token: string }>('/member-portal/login', { tenantSlug, membershipNumber, accessCode }); window.localStorage.setItem('fitkalp_member_token', data.access_token); setToken(data.access_token); setLoading(true); }
    catch (loginError) { setError(errorMessage(loginError)); }
  }
  function logout() { window.localStorage.removeItem('fitkalp_member_token'); setToken(''); setOverview(null); }
  async function book(classId: string) {
    const sessionDate = sessionDates[classId]; if (!sessionDate) { setError('Choose a session date first.'); return; }
    try { const { data } = await portalApi.post<{ status: string; waitlistPosition?: number }>('/member-portal/bookings', { classId, sessionDate }); setNotice(data.status === 'WAITLISTED' ? `Waitlisted at position ${data.waitlistPosition}.` : 'Class booked.'); await load(); }
    catch (bookingError) { setError(errorMessage(bookingError)); }
  }
  async function cancelBooking(id: string) { try { await portalApi.post(`/member-portal/bookings/${id}/cancel`); setNotice('Booking cancelled.'); await load(); } catch (cancelError) { setError(errorMessage(cancelError)); } }
  async function requestFreeze(event: FormEvent) {
    event.preventDefault();
    try { await portalApi.post('/member-portal/freeze-requests', freeze); setShowFreeze(false); setNotice('Freeze request sent for staff approval.'); await load(); }
    catch (freezeError) { setError(errorMessage(freezeError)); }
  }
  async function downloadAgreement(id: string) {
    try { const response = await portalApi.get(`/member-portal/agreements/${id}/document`, { responseType: 'blob' }); const url = URL.createObjectURL(response.data); const anchor = document.createElement('a'); anchor.href = url; anchor.download = `agreement-${id}.pdf`; anchor.click(); URL.revokeObjectURL(url); }
    catch (downloadError) { setError(errorMessage(downloadError)); }
  }
  async function downloadInvoice(id: string) {
    try { const response = await portalApi.get(`/member-portal/invoices/${id}/document`, { responseType: 'blob' }); const url = URL.createObjectURL(response.data); const anchor = document.createElement('a'); anchor.href = url; anchor.download = `invoice-${id}.pdf`; anchor.click(); URL.revokeObjectURL(url); }
    catch (failure) { setError(errorMessage(failure)); }
  }

  if (!token) return <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 18, background: '#F4F7F5' }}><form onSubmit={login} style={{ ...card, width: 'min(420px,100%)', display: 'grid', gap: 14 }}><div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><Image src="/Icon.png" alt="FitKalp" width={48} height={48} style={{ width: 44, height: 44, objectFit: 'contain' }} /><div><h1 style={{ margin: 0, fontSize: 22 }}>Member portal</h1><p style={{ margin: 0, color: '#6F767E', fontSize: 13 }}>FitKalp Member Access</p></div></div><p style={{ margin: 0, color: '#6F767E', fontSize: 14 }}>Use the gym slug, membership number, and private access code issued by your gym.</p>{error && <div style={{ color: '#B91C1C', background: '#FEF2F2', padding: 10, borderRadius: 8 }}>{error}</div>}<input required placeholder="Gym slug" value={tenantSlug} onChange={event => setTenantSlug(event.target.value)} style={input} /><input required placeholder="Membership number" value={membershipNumber} onChange={event => setMembershipNumber(event.target.value)} style={input} /><input required type="password" minLength={8} placeholder="Access code" value={accessCode} onChange={event => setAccessCode(event.target.value)} style={input} /><button style={button}>Sign in</button></form></main>;
  if (loading && !overview) return <main style={{ padding: 40 }}>Loading your account…</main>;
  if (!overview) return <main style={{ padding: 40 }}>{error || 'Account could not be loaded.'} <button onClick={logout}>Sign out</button></main>;
  const activeMembership = overview.memberships.find(item => item.status === 'ACTIVE') || overview.memberships[0];
  return <main style={{ minHeight: '100vh', background: '#F4F7F5', color: '#1A1D1F' }}>
    <header style={{ background: '#fff', borderBottom: '1px solid #E8EAED', padding: '14px max(18px,calc((100% - 1080px)/2))', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Image src="/logo.png" alt="FitKalp" width={130} height={45} style={{ height: 32, width: 'auto', objectFit: 'contain' }} /><span style={{ fontSize: 11, background: '#E9F4EE', color: '#2B9361', padding: '3px 8px', borderRadius: 99, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Member</span></div><button onClick={logout} style={{ border: 0, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#6F767E', fontSize: 14 }}><LogOut size={16} /> Sign out</button></header>
    <div style={{ maxWidth: 1080, margin: 'auto' }} className="px-4 sm:px-6 py-6">
      <h1 className="text-2xl sm:text-3xl font-bold">Hi, {overview.member.firstName}</h1>
      <p style={{ color: '#6F767E' }}>{overview.member.membershipNumber} · {overview.member.status}</p>
      {error && <div style={{ color: '#B91C1C', background: '#FEF2F2', padding: 10, borderRadius: 8, marginBottom: 12 }}>{error} <button onClick={() => setError('')}>×</button></div>}
      {notice && <div style={{ color: '#166534', background: '#F0FDF4', padding: 10, borderRadius: 8, marginBottom: 12 }}>{notice} <button onClick={() => setNotice('')}>×</button></div>}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <Summary icon={<User />} label="Current plan" value={activeMembership?.plan?.name || 'No active plan'} />
        <Summary icon={<Calendar />} label="Expiry" value={activeMembership ? new Date(activeMembership.expiryDate).toLocaleDateString('en-IN') : '-'} />
        <Summary icon={<CreditCard />} label="Amount due" value={`₹${Number(activeMembership?.amountDue || 0).toLocaleString('en-IN')}`} />
        <Summary icon={<Snowflake />} label="Freeze requests" value={String(overview.freezeRequests.filter(item => item.status === 'PENDING').length)} />
      </div>

      <section style={{ ...card, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 className="text-xl font-bold">Class schedule</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {classes.map(item => (
            <div key={item.id} style={{ border: '1px solid #E8EAED', borderRadius: 10, padding: 12 }}>
              <strong>{item.name}</strong>
              <div style={{ color: '#6F767E', fontSize: 13, margin: '5px 0' }}>
                Days {item.daysOfWeek.join(', ')} · {item.startTime.slice(0, 5)} · {item.durationMinutes} min
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <input aria-label={`Session date for ${item.name}`} type="date" value={sessionDates[item.id] || ''} onChange={event => setSessionDates(current => ({ ...current, [item.id]: event.target.value }))} style={{ ...input, padding: 7 }} />
                <button style={{ ...button, padding: '7px 12px' }} onClick={() => void book(item.id)}>Book</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ ...card, marginBottom: 16 }}>
        <h2 className="text-xl font-bold mb-3">Your bookings</h2>
        {overview.bookings.length === 0 ? (
          <p className="text-gray-500 text-sm">No bookings yet.</p>
        ) : (
          overview.bookings.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid #F0F1F2' }}>
              <span>
                <strong>{item.class?.name || 'Class'}</strong>
                <br />
                <small className="text-gray-500">{new Date(item.sessionDateTime).toLocaleString('en-IN')} · {item.status}</small>
              </span>
              {['BOOKED', 'CONFIRMED', 'WAITLISTED'].includes(item.status) && (
                <button onClick={() => void cancelBooking(item.id)} style={{ border: '1px solid #FCA5A5', color: '#B91C1C', background: '#fff', borderRadius: 8, padding: '4px 10px', fontSize: 13, cursor: 'pointer' }}>
                  Cancel
                </button>
              )}
            </div>
          ))
        )}
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section style={card}>
          <h2 className="text-xl font-bold mb-3">Invoices &amp; payments</h2>
          {overview.invoices.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F0F1F2' }}>
              <span className="text-sm">{item.invoiceNumber} · ₹{Number(item.totalAmount).toLocaleString('en-IN')} · {item.status}</span>
              <button onClick={() => void downloadInvoice(item.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 8px', fontSize: 12, border: '1px solid #D1D5DB', borderRadius: 6, background: '#fff', cursor: 'pointer' }}>
                <Download size={13} /> PDF
              </button>
            </div>
          ))}
          {overview.payments.map(item => (
            <div key={item.id} style={{ padding: '8px 0', color: '#166534', fontSize: 13, fontWeight: 500 }}>
              Paid ₹{Number(item.amount).toLocaleString('en-IN')} via {item.paymentMethod}
            </div>
          ))}
        </section>

        <section style={card}>
          <h2 className="text-xl font-bold mb-3">Signed agreements</h2>
          {overview.agreements.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F0F1F2' }}>
              <span className="text-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <FileSignature size={14} /> {item.templateName} · {item.status}
              </span>
              {item.status === 'SIGNED' && (
                <button onClick={() => void downloadAgreement(item.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 8px', fontSize: 12, border: '1px solid #D1D5DB', borderRadius: 6, background: '#fff', cursor: 'pointer' }}>
                  <Download size={13} /> PDF
                </button>
              )}
            </div>
          ))}
        </section>
      </div>

      <section style={{ ...card, marginTop: 16 }}>
        <h2 className="text-xl font-bold mb-1">Membership freeze</h2>
        <p style={{ color: '#6F767E', fontSize: 14, marginBottom: 12 }}>
          Requests go to gym staff for approval; your plan is not changed until approved.
        </p>
        <button
          style={button}
          disabled={!activeMembership}
          onClick={() => {
            if (activeMembership) {
              setFreeze(current => ({ ...current, membershipId: activeMembership.id }));
              setShowFreeze(true);
            }
          }}
        >
          Request freeze
        </button>
        {overview.freezeRequests.map(item => (
          <div key={item.id} style={{ padding: '8px 0', fontSize: 13, color: '#4B5563' }}>
            {new Date(item.requestedStartDate).toLocaleDateString('en-IN')} – {new Date(item.requestedEndDate).toLocaleDateString('en-IN')} · {item.status}
          </div>
        ))}
      </section>
    </div>
    {showFreeze && (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', display: 'grid', placeItems: 'center', padding: 16, zIndex: 200 }}>
        <form onSubmit={requestFreeze} style={{ ...card, width: 'min(460px,100%)', display: 'grid', gap: 12 }}>
          <h2 className="text-xl font-bold">Request membership freeze</h2>
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">Start Date</label>
            <input required type="date" style={input} value={freeze.startDate} onChange={event => setFreeze(current => ({ ...current, startDate: event.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">End Date</label>
            <input required type="date" style={input} value={freeze.endDate} onChange={event => setFreeze(current => ({ ...current, endDate: event.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">Reason</label>
            <textarea required placeholder="Reason for pause (e.g. Travel, Injury)" style={{ ...input, resize: 'vertical' }} rows={3} value={freeze.reason} onChange={event => setFreeze(current => ({ ...current, reason: event.target.value }))} />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
            <button type="button" onClick={() => setShowFreeze(false)} style={{ padding: '8px 16px', background: '#F3F4F6', border: 0, borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>Close</button>
            <button style={button}>Submit request</button>
          </div>
        </form>
      </div>
    )}
  </main>;
}
function Summary({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div style={card}><div style={{ color: '#2B9361' }}>{icon}</div><small style={{ color: '#6F767E' }}>{label}</small><div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>{value}</div></div>; }
