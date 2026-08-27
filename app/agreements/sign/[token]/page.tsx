'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import axios from 'axios';
import api from '@/lib/crm/api';

interface Agreement {
  agreementNumber: string;
  templateName: string;
  templateVersion: number;
  content: string;
  termsAndConditions: string;
  healthDisclaimer: string;
  memberName?: string;
  expiresAt: string;
}

function message(e: unknown) {
  return axios.isAxiosError(e)
    ? String(e.response?.data?.message || 'Unable to open agreement')
    : 'Unable to open agreement';
}

export default function SignAgreementPage() {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<Agreement | null>(null);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [terms, setTerms] = useState(false);
  const [health, setHealth] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [communication, setCommunication] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  useEffect(() => {
    void api
      .get<Agreement>(`/agreements/sign/${token}`)
      .then((r) => {
        setData(r.data);
        setName(r.data.memberName || '');
      })
      .catch((e) => setError(message(e)));
  }, [token]);

  function pointer(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const c = canvas.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#111';
    ctx.lineTo(((e.clientX - r.left) * c.width) / r.width, ((e.clientY - r.top) * c.height) / r.height);
    ctx.stroke();
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    try {
      const signatureDataUrl = canvas.current?.toDataURL('image/png');
      if (!signatureDataUrl) throw new Error();
      await api.post(`/agreements/sign/${token}`, {
        signerName: name,
        signerEmail: email || undefined,
        signatureMethod: 'TOUCHSCREEN',
        signatureDataUrl,
        termsAccepted: terms,
        healthDisclaimerAccepted: health,
        dataProcessingConsent: privacy,
        communicationConsent: communication,
        deviceId: navigator.userAgent.slice(0, 100),
      });
      setDone(true);
    } catch (x) {
      setError(message(x));
    }
  }

  if (error) {
    return (
      <main className="max-w-2xl mx-auto my-12 p-6 text-center" style={{ fontFamily: "'DM Sans','Inter',sans-serif" }}>
        <div className="mb-6 flex justify-center">
          <Image src="/logo.png" alt="FitKalp" width={130} height={45} style={{ height: 32, width: 'auto' }} />
        </div>
        <h1 className="text-2xl font-bold text-red-600 mb-2">Agreement unavailable</h1>
        <p className="text-gray-600">{error}</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="max-w-2xl mx-auto my-12 p-6 text-center" style={{ fontFamily: "'DM Sans','Inter',sans-serif" }}>
        <div className="mb-6 flex justify-center">
          <Image src="/logo.png" alt="FitKalp" width={130} height={45} style={{ height: 32, width: 'auto' }} />
        </div>
        <p className="text-gray-600">Loading secure agreement…</p>
      </main>
    );
  }

  if (done) {
    return (
      <main className="max-w-2xl mx-auto my-12 p-6 text-center" style={{ fontFamily: "'DM Sans','Inter',sans-serif" }}>
        <div className="mb-6 flex justify-center">
          <Image src="/logo.png" alt="FitKalp" width={130} height={45} style={{ height: 32, width: 'auto' }} />
        </div>
        <h1 className="text-2xl font-bold text-green-700 mb-2">Agreement Signed Successfully</h1>
        <p className="text-gray-600">Your signed document and consent evidence have been securely recorded.</p>
      </main>
    );
  }

  const inputStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    padding: '11px 14px',
    border: '1px solid #D1D5DB',
    borderRadius: 8,
    fontSize: 16,
    marginTop: 6,
    boxSizing: 'border-box',
  };

  return (
    <main
      className="max-w-3xl mx-auto my-8 px-4 sm:px-6 py-6"
      style={{ fontFamily: "'DM Sans','Inter',sans-serif", overflowX: 'hidden' }}
    >
      <div className="mb-6">
        <Image src="/logo.png" alt="FitKalp" width={130} height={45} style={{ height: 32, width: 'auto' }} />
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{data.templateName}</h1>
      <p className="text-xs sm:text-sm text-gray-500 mb-6">
        {data.agreementNumber} · Template v{data.templateVersion} · Expires{' '}
        {new Date(data.expiresAt).toLocaleString('en-IN')}
      </p>

      <section className="bg-white p-5 sm:p-7 border border-gray-200 rounded-2xl shadow-sm space-y-4 text-sm sm:text-base leading-relaxed text-gray-800">
        <div className="whitespace-pre-wrap">{data.content}</div>
        
        {data.termsAndConditions && (
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Terms and conditions</h3>
            <div className="whitespace-pre-wrap text-sm text-gray-700">{data.termsAndConditions}</div>
          </div>
        )}

        {data.healthDisclaimer && (
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Health disclaimer</h3>
            <div className="whitespace-pre-wrap text-sm text-gray-700">{data.healthDisclaimer}</div>
          </div>
        )}
      </section>

      <form onSubmit={submit} className="mt-8 space-y-5">
        <div>
          <label className="text-sm font-semibold text-gray-800">
            Signer name *
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
              placeholder="Full legal name"
            />
          </label>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-800">
            Email (optional)
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              placeholder="signer@example.com"
            />
          </label>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-800 block mb-2">
            Draw signature *
          </label>
          <div className="border border-gray-300 rounded-xl overflow-hidden bg-gray-50">
            <canvas
              ref={canvas}
              width={700}
              height={180}
              onPointerDown={(e) => {
                drawing.current = true;
                const c = canvas.current;
                const r = c?.getBoundingClientRect();
                const ctx = c?.getContext('2d');
                if (c && r && ctx) {
                  ctx.beginPath();
                  ctx.moveTo(((e.clientX - r.left) * c.width) / r.width, ((e.clientY - r.top) * c.height) / r.height);
                }
              }}
              onPointerMove={pointer}
              onPointerUp={() => (drawing.current = false)}
              onPointerLeave={() => (drawing.current = false)}
              style={{
                display: 'block',
                width: '100%',
                height: 180,
                touchAction: 'none',
                cursor: 'crosshair',
              }}
            />
          </div>
          <div className="flex justify-end mt-2">
            <button
              type="button"
              onClick={() => canvas.current?.getContext('2d')?.clearRect(0, 0, 700, 180)}
              className="text-xs text-gray-600 hover:text-red-600 font-medium underline"
            >
              Clear signature
            </button>
          </div>
        </div>

        <div className="space-y-3 pt-2 text-sm text-gray-800">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              className="mt-1"
            />
            <span>I accept the terms and conditions.</span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={health}
              onChange={(e) => setHealth(e.target.checked)}
              className="mt-1"
            />
            <span>I accept the health disclaimer.</span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={privacy}
              onChange={(e) => setPrivacy(e.target.checked)}
              className="mt-1"
            />
            <span>I consent to processing my data for membership administration.</span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={communication}
              onChange={(e) => setCommunication(e.target.checked)}
              className="mt-1"
            />
            <span>I consent to membership communications.</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={!terms || !health || !privacy}
          className="btn-primary w-full justify-center py-3.5 text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: '#2B9361', color: '#fff', borderRadius: 10 }}
        >
          Sign Agreement
        </button>
      </form>
    </main>
  );
}
