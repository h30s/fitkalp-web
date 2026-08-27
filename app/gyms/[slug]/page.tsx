'use client';
import { useEffect, useState, type FormEvent } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import api from '@/lib/crm/api';

interface Site {
  slug: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  primaryColor: string;
  headline: string;
  description: string;
  services: string[];
}

function message(e: unknown) {
  return axios.isAxiosError(e)
    ? String(e.response?.data?.message || 'Unable to submit enquiry')
    : 'Unable to submit enquiry';
}

export default function GymSite() {
  const { slug } = useParams<{ slug: string }>();
  const [site, setSite] = useState<Site | null>(null);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [startedAt] = useState(() => Date.now());
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    interests: '',
    message: '',
    whatsappConsent: true,
    emailConsent: false,
    website: '',
  });

  useEffect(() => {
    let active = true;
    void api
      .get<Site>(`/gym-websites/${slug}`)
      .then((r) => {
        if (active) setSite(r.data);
      })
      .catch(() => {
        if (active) setError('This gym website is not available.');
      });
    return () => {
      active = false;
    };
  }, [slug]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    try {
      await api.post(`/gym-websites/${slug}/enquiries`, { ...form, startedAt });
      setSent(true);
      setError('');
    } catch (x) {
      setError(message(x));
    }
  }

  if (!site) {
    return (
      <main className="min-h-screen pt-36 px-6 text-center" style={{ fontFamily: 'sans-serif', color: '#18201b' }}>
        {error || 'Loading gym…'}
      </main>
    );
  }

  const fieldStyle: React.CSSProperties = {
    padding: '12px 14px',
    border: '1px solid #d1d5db',
    borderRadius: 8,
    fontSize: 16,
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  };

  return (
    <main style={{ fontFamily: 'sans-serif', color: '#18201b', overflowX: 'hidden' }}>
      <header className="py-4 px-4 sm:px-8 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200">
        <strong style={{ fontSize: 20, color: site.primaryColor }}>{site.name}</strong>
        <span className="text-sm font-medium text-gray-600">{site.phone}</span>
      </header>

      <section
        className="py-12 sm:py-20 px-4 sm:px-8"
        style={{ background: `linear-gradient(135deg, ${site.primaryColor}18, #fff)` }}
      >
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 60px)', fontWeight: 800, lineHeight: 1.15, marginBottom: 16 }}>
            {site.headline}
          </h1>
          <p className="text-base sm:text-lg" style={{ maxWidth: 700, lineHeight: 1.65, color: '#4b5563' }}>
            {site.description}
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-16 px-4 sm:px-8">
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 className="text-2xl font-bold mb-6">What we offer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {site.services.map((service) => (
              <div key={service} style={{ padding: 18, border: '1px solid #e5e7eb', borderRadius: 12, fontWeight: 600 }}>
                {service}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-16 px-4 sm:px-8 bg-[#f7f8f7]">
        <div style={{ maxWidth: 650, margin: '0 auto' }}>
          <h2 className="text-2xl font-bold mb-6">Start your fitness journey</h2>
          {sent ? (
            <p style={{ padding: 18, background: '#dcfce7', borderRadius: 10, color: '#166534', fontWeight: 500 }}>
              Thanks! Your enquiry is now in {site.name}&apos;s CRM. Their team will contact you shortly.
            </p>
          ) : (
            <form onSubmit={submit} style={{ display: 'grid', gap: 14 }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  required
                  placeholder="First name *"
                  style={fieldStyle}
                  value={form.firstName}
                  onChange={(e) => setForm((v) => ({ ...v, firstName: e.target.value }))}
                />
                <input
                  required
                  placeholder="Last name *"
                  style={fieldStyle}
                  value={form.lastName}
                  onChange={(e) => setForm((v) => ({ ...v, lastName: e.target.value }))}
                />
              </div>

              <input
                required
                type="tel"
                placeholder="Phone number *"
                style={fieldStyle}
                value={form.phone}
                onChange={(e) => setForm((v) => ({ ...v, phone: e.target.value }))}
              />

              <input
                type="email"
                placeholder="Email address (Optional)"
                style={fieldStyle}
                value={form.email}
                onChange={(e) => setForm((v) => ({ ...v, email: e.target.value }))}
              />

              <input
                placeholder="What are you interested in? (e.g. Strength, Weight Loss)"
                style={fieldStyle}
                value={form.interests}
                onChange={(e) => setForm((v) => ({ ...v, interests: e.target.value }))}
              />

              <textarea
                placeholder="Message or question..."
                rows={4}
                style={{ ...fieldStyle, resize: 'vertical' }}
                value={form.message}
                onChange={(e) => setForm((v) => ({ ...v, message: e.target.value }))}
              />

              <input
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: 'absolute', left: -10000 }}
                value={form.website}
                onChange={(e) => setForm((v) => ({ ...v, website: e.target.value }))}
              />

              <div className="flex flex-col gap-2 text-sm text-gray-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.whatsappConsent}
                    onChange={(e) => setForm((v) => ({ ...v, whatsappConsent: e.target.checked }))}
                  />{' '}
                  I agree to receive WhatsApp replies about this enquiry.
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.emailConsent}
                    onChange={(e) => setForm((v) => ({ ...v, emailConsent: e.target.checked }))}
                  />{' '}
                  I agree to receive email replies.
                </label>
              </div>

              {error && <p style={{ color: '#b91c1c', fontSize: 14 }}>{error}</p>}

              <button
                type="submit"
                style={{
                  padding: '14px 20px',
                  border: 0,
                  borderRadius: 8,
                  background: site.primaryColor || '#2B9361',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 15,
                  minHeight: 48,
                  cursor: 'pointer',
                }}
              >
                Send enquiry
              </button>
            </form>
          )}
        </div>
      </section>

      <footer className="py-6 px-4 sm:px-8 text-center text-sm text-gray-500 border-t border-gray-200">
        {site.address}, {site.city}, {site.state} · {site.email}
      </footer>
    </main>
  );
}
