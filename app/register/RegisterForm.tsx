'use client';

import { FormEvent, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  LoaderCircle,
  Sparkles,
  MessageCircle,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

const PLAN_OPTIONS = [
  { id: 'Starter', name: 'Starter', price: '₹599/mo', desc: 'Up to 100 members' },
  { id: 'Growth', name: 'Growth', price: '₹1,000/mo', desc: 'WhatsApp + GST + 500 members', popular: true },
  { id: 'Scale', name: 'Scale', price: '₹1,299/mo', desc: 'Unlimited + Multi-branch' },
  { id: 'Website Design', name: 'Website Design', price: '₹15,000 one-time', desc: 'Custom gym website' },
];

export default function RegisterForm() {
  const searchParams = useSearchParams();
  const planParam = searchParams.get('plan') || '';
  const intentParam = searchParams.get('intent') || '';
  const serviceParam = searchParams.get('service') || '';
  const sourceParam = searchParams.get('source') || '';
  const refParam = searchParams.get('ref') || searchParams.get('referral') || searchParams.get('code') || '';

  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<Record<string, string>>({});

  const [serviceInterest, setServiceInterest] = useState('CRM');
  const [selectedPlan, setSelectedPlan] = useState('Growth');
  const [referralCode, setReferralCode] = useState(refParam ? refParam.toUpperCase().trim() : '');

  useEffect(() => {
    if (refParam) {
      setReferralCode(refParam.toUpperCase().trim());
    }
  }, [refParam]);

  useEffect(() => {
    if (serviceParam) {
      if (serviceParam.toLowerCase().includes('website')) setServiceInterest('WEBSITE');
      else if (serviceParam.toLowerCase().includes('both')) setServiceInterest('BOTH');
      else setServiceInterest('CRM');
    }
    if (planParam) {
      if (planParam.toLowerCase().includes('starter')) setSelectedPlan('Starter');
      else if (planParam.toLowerCase().includes('scale')) setSelectedPlan('Scale');
      else if (
        planParam.toLowerCase().includes('scratch') ||
        planParam.toLowerCase().includes('redesign') ||
        planParam.toLowerCase().includes('website')
      ) {
        setServiceInterest('WEBSITE');
        setSelectedPlan('Website Design');
      } else {
        setSelectedPlan('Growth');
      }
    }
  }, [planParam, serviceParam]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError('');
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    try {
      const cleanRefCode = referralCode.trim().toUpperCase();

      const payload = {
        ...data,
        type: 'DEMO_LEAD',
        planInterest: selectedPlan,
        serviceInterest,
        referralCode: cleanRefCode,
        intent: intentParam || 'register',
        source: sourceParam || (cleanRefCode ? `Referral: ${cleanRefCode}` : 'Registration Page'),
      };

      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Could not submit your registration.');

      setSubmittedData(payload);
      setSuccess(true);
      form.reset();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Could not submit your details. Please try again.');
    } finally {
      setPending(false);
    }
  }

  // WhatsApp link for founder chat
  const gymNameVal = submittedData.gymName || 'my gym';
  const personNameVal = submittedData.contactName || 'there';
  const waDirectLink = `https://wa.me/919410004994?text=${encodeURIComponent(
    `Hi Himanshu! I just submitted the FitKalp registration form for ${gymNameVal}. My name is ${personNameVal}. Can we connect for a quick walkthrough?`
  )}`;

  if (success) {
    return (
      <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-emerald-50/70 border border-emerald-200/80 text-center">
        <div className="w-14 h-14 rounded-full bg-brand-green text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-600/20">
          <CheckCircle2 size={32} />
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-brand-dark mb-2">
          Registration Details Received!
        </h3>

        <p className="text-brand-muted text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-6">
          Thank you, <strong className="text-brand-dark">{personNameVal}</strong>. We have saved your gym details for{' '}
          <strong className="text-brand-dark">{gymNameVal}</strong>. Himanshu and our team will review your requirements and reach out to you personally to schedule your live walkthrough and setup.
        </p>

        {/* WhatsApp Direct Connect Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 max-w-md mx-auto mb-6 text-center shadow-sm">
          <div className="text-sm font-bold text-brand-dark mb-1">
            Prefer to connect right away?
          </div>
          <p className="text-xs sm:text-sm text-brand-muted mb-4 leading-relaxed">
            Message Himanshu on WhatsApp with any specific question or your preferred meeting time.
          </p>
          <a
            href={waDirectLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-3 rounded-full text-sm font-bold no-underline w-full shadow-md shadow-emerald-500/20 transition-transform active:scale-[0.98]"
          >
            <MessageCircle size={18} fill="#FFFFFF" /> Message Himanshu on WhatsApp
          </a>
        </div>

        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="text-brand-green font-semibold text-sm hover:underline bg-transparent border-0 cursor-pointer"
        >
          ← Submit details for another gym
        </button>
      </div>
    );
  }

  const isLoginIntent = intentParam === 'login';
  const isTrialIntent = intentParam === 'trial' || Boolean(planParam);
  const isWebsiteIntent = serviceParam === 'WEBSITE' || intentParam === 'quote';

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      {/* Honeypot for spam bots */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Dynamic Context Header Banner */}
      {isLoginIntent && (
        <div className="bg-blue-50 border border-blue-200 text-blue-900 px-4 py-3 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 leading-relaxed">
          <ShieldCheck size={18} className="text-blue-600 shrink-0 mt-0.5" />
          <div>
            <strong>Early Access & Onboarding Request:</strong> We are onboarding gyms in curated cohorts. Fill in your details below and we will connect with you directly to set up your account.
          </div>
        </div>
      )}

      {isTrialIntent && !isLoginIntent && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 leading-relaxed">
          <Sparkles size={18} className="text-brand-green shrink-0 mt-0.5" />
          <div>
            <strong>{selectedPlan ? `${selectedPlan} Plan Registration` : '14-Day Free Trial'}:</strong> Full live walkthrough and assisted setup. No payment or credit card required.
          </div>
        </div>
      )}

      {isWebsiteIntent && (
        <div className="bg-purple-50 border border-purple-200 text-purple-900 px-4 py-3 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 leading-relaxed">
          <Sparkles size={18} className="text-purple-600 shrink-0 mt-0.5" />
          <div>
            <strong>Custom Gym Website Design:</strong> Share your gym info and our design team will provide a tailored quote and consultation.
          </div>
        </div>
      )}

      {/* ─── SECTION 1: CONTACT PERSON ────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-brand-green uppercase tracking-wider">
          <span className="w-5 h-5 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center text-xs">
            1
          </span>
          Contact Person
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contactName" className="block text-xs sm:text-sm font-semibold text-brand-dark mb-1.5">
              Your Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="contactName"
              name="contactName"
              type="text"
              required
              placeholder="e.g. Rahul Sharma"
              className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50/70 text-brand-dark text-sm sm:text-base focus:bg-white focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
            />
          </div>

          <div>
            <label htmlFor="contactRole" className="block text-xs sm:text-sm font-semibold text-brand-dark mb-1.5">
              Your Role at Gym
            </label>
            <select
              id="contactRole"
              name="contactRole"
              defaultValue="Owner"
              className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50/70 text-brand-dark text-sm sm:text-base focus:bg-white focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all cursor-pointer"
            >
              <option value="Owner">Gym Owner / Founder</option>
              <option value="Manager">General Manager</option>
              <option value="Head Trainer">Head Trainer / Coach</option>
              <option value="Staff">Front Desk / Staff</option>
              <option value="Partner">Co-founder / Partner</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-xs sm:text-sm font-semibold text-brand-dark mb-1.5">
              WhatsApp / Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="+91 94100 04994"
              className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50/70 text-brand-dark text-sm sm:text-base focus:bg-white focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-brand-dark mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="rahul@powerhousegym.in"
              className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50/70 text-brand-dark text-sm sm:text-base focus:bg-white focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* ─── SECTION 2: GYM & LOCATION ────────────────────────────── */}
      <div className="flex flex-col gap-4 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2 text-xs font-bold text-brand-green uppercase tracking-wider">
          <span className="w-5 h-5 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center text-xs">
            2
          </span>
          Gym & Location Details
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="gymName" className="block text-xs sm:text-sm font-semibold text-brand-dark mb-1.5">
              Gym / Studio Name <span className="text-red-500">*</span>
            </label>
            <input
              id="gymName"
              name="gymName"
              type="text"
              required
              placeholder="PowerHouse Fitness Club"
              className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50/70 text-brand-dark text-sm sm:text-base focus:bg-white focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
            />
          </div>

          <div>
            <label htmlFor="businessType" className="block text-xs sm:text-sm font-semibold text-brand-dark mb-1.5">
              Business Type
            </label>
            <select
              id="businessType"
              name="businessType"
              defaultValue="Strength & Cardio Gym"
              className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50/70 text-brand-dark text-sm sm:text-base focus:bg-white focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all cursor-pointer"
            >
              <option value="Strength & Cardio Gym">Strength & Cardio Gym</option>
              <option value="CrossFit / MMA Studio">CrossFit / MMA Studio</option>
              <option value="Yoga / Pilates Center">Yoga / Pilates Center</option>
              <option value="Zumba / Dance Studio">Zumba / Dance Studio</option>
              <option value="Personal Training Studio">Personal Training Studio</option>
              <option value="Multi-branch Fitness Chain">Multi-branch Fitness Chain</option>
              <option value="Other">Other Fitness Space</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-1">
            <label htmlFor="city" className="block text-xs sm:text-sm font-semibold text-brand-dark mb-1.5">
              City <span className="text-red-500">*</span>
            </label>
            <input
              id="city"
              name="city"
              type="text"
              required
              placeholder="Mumbai / Delhi / Pune"
              className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50/70 text-brand-dark text-sm sm:text-base focus:bg-white focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
            />
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="state" className="block text-xs sm:text-sm font-semibold text-brand-dark mb-1.5">
              State / Region
            </label>
            <input
              id="state"
              name="state"
              type="text"
              placeholder="Maharashtra"
              className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50/70 text-brand-dark text-sm sm:text-base focus:bg-white focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
            />
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="currentMemberRange" className="block text-xs sm:text-sm font-semibold text-brand-dark mb-1.5">
              Current Members <span className="text-red-500">*</span>
            </label>
            <select
              id="currentMemberRange"
              name="currentMemberRange"
              required
              defaultValue="50–150"
              className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50/70 text-brand-dark text-sm sm:text-base focus:bg-white focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all cursor-pointer"
            >
              <option value="Under 50">Under 50 members</option>
              <option value="50–150">50–150 members</option>
              <option value="150–400">150–400 members</option>
              <option value="400+">400+ members</option>
            </select>
          </div>
        </div>
      </div>

      {/* ─── SECTION 3: PLAN, SERVICE & REFERRAL ───────────────────── */}
      <div className="flex flex-col gap-4 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2 text-xs font-bold text-brand-green uppercase tracking-wider">
          <span className="w-5 h-5 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center text-xs">
            3
          </span>
          Plan Selection & Referral Code
        </div>

        {/* Plan Selection Cards */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-brand-dark mb-2">
            Select Your Plan Interest
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {PLAN_OPTIONS.map((plan) => {
              const active = selectedPlan === plan.id;
              return (
                <button
                  type="button"
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative p-3 rounded-xl text-left border transition-all cursor-pointer ${
                    active
                      ? 'border-brand-green bg-emerald-50/60 ring-2 ring-brand-green/20'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-2 right-2 bg-brand-green text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Popular
                    </span>
                  )}
                  <div className="font-bold text-sm text-brand-dark">{plan.name}</div>
                  <div className="text-xs font-bold text-brand-green mt-0.5">{plan.price}</div>
                  <div className="text-[11px] text-brand-muted mt-1 leading-snug">{plan.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="serviceInterest" className="block text-xs sm:text-sm font-semibold text-brand-dark mb-1.5">
              Service Bundle
            </label>
            <select
              id="serviceInterest"
              name="serviceInterest"
              value={serviceInterest}
              onChange={(e) => setServiceInterest(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50/70 text-brand-dark text-sm sm:text-base focus:bg-white focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all cursor-pointer"
            >
              <option value="CRM">FitKalp Gym CRM (Member & Payment Software)</option>
              <option value="WEBSITE">Custom Gym Website Design & Build</option>
              <option value="BOTH">Complete Bundle (CRM + Custom Website)</option>
            </select>
          </div>

          <div>
            <label htmlFor="referralCode" className="block text-xs sm:text-sm font-semibold text-brand-dark mb-1.5">
              Referral Code (Optional)
            </label>
            <input
              id="referralCode"
              name="referralCode"
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
              placeholder="e.g. FK-CODE"
              className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50/70 text-brand-dark text-sm sm:text-base focus:bg-white focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="preferredTime" className="block text-xs sm:text-sm font-semibold text-brand-dark mb-1.5">
              Preferred Call Time
            </label>
            <select
              id="preferredTime"
              name="preferredTime"
              defaultValue="Flexible"
              className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50/70 text-brand-dark text-sm sm:text-base focus:bg-white focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all cursor-pointer"
            >
              <option value="Flexible">Flexible (Any time on business days)</option>
              <option value="Morning (9 AM – 12 PM)">Morning (9 AM – 12 PM)</option>
              <option value="Afternoon (12 PM – 4 PM)">Afternoon (12 PM – 4 PM)</option>
              <option value="Evening (4 PM – 8 PM)">Evening (4 PM – 8 PM)</option>
            </select>
          </div>

          <div>
            <label htmlFor="source" className="block text-xs sm:text-sm font-semibold text-brand-dark mb-1.5">
              How did you hear about us?
            </label>
            <select
              id="source"
              name="source"
              defaultValue="Website"
              className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50/70 text-brand-dark text-sm sm:text-base focus:bg-white focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all cursor-pointer"
            >
              <option value="Website">Google / Search Engine</option>
              <option value="Friend / Gym Colleague">Friend / Gym Owner Recommendation</option>
              <option value="WhatsApp">WhatsApp Group / Community</option>
              <option value="Instagram">Instagram / Social Media</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="onboardingInformation" className="block text-xs sm:text-sm font-semibold text-brand-dark mb-1.5">
            What challenges or specific features do you need help with?
          </label>
          <textarea
            id="onboardingInformation"
            name="onboardingInformation"
            rows={3}
            maxLength={2000}
            placeholder="e.g. Currently tracking renewals in notebooks/Excel, need WhatsApp automatic reminders, want GST bills, 2 branches..."
            className="w-full px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50/70 text-brand-dark text-sm sm:text-base focus:bg-white focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 outline-none transition-all resize-y"
          />
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="p-3.5 rounded-xl text-red-800 bg-red-50 border border-red-200 text-sm font-medium"
        >
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={pending}
        className="w-full py-4 px-6 rounded-2xl bg-brand-green hover:bg-brand-green-dark text-white font-bold text-base sm:text-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all transform active:scale-[0.99] disabled:opacity-70 cursor-pointer border-0"
      >
        {pending ? (
          <>
            <LoaderCircle size={20} className="animate-spin" /> Submitting Your Gym Details…
          </>
        ) : (
          <>
            Submit Gym Details &amp; Request Walkthrough <ArrowRight size={18} />
          </>
        )}
      </button>

      <div className="text-center text-xs text-brand-muted flex items-center justify-center gap-2 font-medium">
        <ShieldCheck size={15} className="text-brand-green shrink-0" />
        <span>100% Free Consultation • No Credit Card Required • We will contact you promptly</span>
      </div>
    </form>
  );
}
