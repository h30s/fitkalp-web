import { Suspense } from 'react';
import { Metadata } from 'next';
import { CheckCircle2, ShieldCheck, MessageCircle, PhoneCall, Sparkles, ArrowRight, HeartHandshake } from 'lucide-react';
import RegisterForm from './RegisterForm';

export const metadata: Metadata = {
  title: 'Register Your Gym - FitKalp Gym Software',
  description:
    'Register your gym for FitKalp: Request a 14-day free trial, book a 20-minute live walkthrough, or join our early onboarding cohort.',
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen pt-28 pb-16 sm:pt-36 sm:pb-24 px-4 sm:px-6 lg:px-8 font-dm">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ─── LEFT COLUMN: VALUE PROPOSITION & BRAND PROMISE ─── */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-28">
            
            {/* Tag Pill */}
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs sm:text-sm font-semibold text-brand-muted shadow-sm">
                <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                FitKalp Gym Onboarding
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-dark tracking-tight leading-[1.15]">
              Set up your gym on FitKalp in{' '}
              <span className="text-brand-green italic">20 minutes</span>
            </h1>

            {/* Subhead */}
            <p className="text-brand-muted text-sm sm:text-base leading-relaxed">
              We know your time is valuable. Share a few details about your gym and our founding team will personally help you migrate your members, configure your plans, and get everything running smoothly.
            </p>

            {/* Benefits List */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm flex flex-col gap-4">
              <h3 className="text-sm font-bold text-brand-dark uppercase tracking-wider text-brand-green">
                What happens after you register:
              </h3>
              
              <ul className="flex flex-col gap-3 text-xs sm:text-sm text-brand-dark">
                <li className="flex items-start gap-3 leading-relaxed">
                  <CheckCircle2 size={18} className="text-brand-green shrink-0 mt-0.5" />
                  <span>
                    <strong>1-on-1 Walkthrough:</strong> Live screen-share demo tailored to your exact gym workflow.
                  </span>
                </li>
                <li className="flex items-start gap-3 leading-relaxed">
                  <CheckCircle2 size={18} className="text-brand-green shrink-0 mt-0.5" />
                  <span>
                    <strong>Free Data Migration:</strong> We help import your existing member records from Excel or notebooks.
                  </span>
                </li>
                <li className="flex items-start gap-3 leading-relaxed">
                  <CheckCircle2 size={18} className="text-brand-green shrink-0 mt-0.5" />
                  <span>
                    <strong>WhatsApp &amp; GST Setup:</strong> Automatic payment receipts and renewal alerts configured for your phone.
                  </span>
                </li>
                <li className="flex items-start gap-3 leading-relaxed">
                  <CheckCircle2 size={18} className="text-brand-green shrink-0 mt-0.5" />
                  <span>
                    <strong>Zero Lock-in:</strong> 14-day free trial with no credit card required. Your data always belongs to you.
                  </span>
                </li>
              </ul>
            </div>

            {/* Founder Direct Connect Card */}
            <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-5 text-brand-dark shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-full bg-brand-green text-white flex items-center justify-center font-bold text-sm">
                  HS
                </div>
                <div>
                  <div className="text-sm font-bold text-brand-dark">Himanshu Soni</div>
                  <div className="text-xs text-brand-muted">Founder &amp; Product Lead</div>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-brand-muted leading-relaxed mb-3">
                &ldquo;We built FitKalp specifically for Indian gym owners who are tired of notebook chaos and WhatsApp clutter. Have a quick question before registering? Message me directly.&rdquo;
              </p>
              <a
                href="https://wa.me/919410004994?text=Hi%20Himanshu,%20I%20have%20a%20question%20about%20FitKalp"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-green hover:underline"
              >
                <MessageCircle size={15} /> Chat directly on WhatsApp (+91 94100 04994) →
              </a>
            </div>

          </div>

          {/* ─── RIGHT COLUMN: INTERACTIVE FORM CARD ────────────── */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/90 shadow-xl shadow-slate-200/40">
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-dark tracking-tight">
                  Tell us about your gym
                </h2>
                <p className="text-brand-muted text-xs sm:text-sm mt-1">
                  Fill in your details below to register your gym, request a walkthrough, or claim your 14-day free trial.
                </p>
              </div>

              <Suspense fallback={<div className="p-12 text-center text-brand-muted text-sm">Loading registration form…</div>}>
                <RegisterForm />
              </Suspense>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
