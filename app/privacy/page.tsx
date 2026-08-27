export const metadata = {
  title: 'Privacy Policy - FitKalp',
  description: 'Learn how FitKalp collects, uses, and protects your data. Fully compliant with DPDPA 2023.'
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen pt-28 pb-16 sm:pt-36 sm:pb-24" style={{ fontFamily: "'DM Sans','Inter',sans-serif" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Privacy Policy</h1>
          <p className="text-gray-500 text-sm sm:text-base">Last updated: July 2026</p>
        </div>

        <article className="prose prose-lg prose-green max-w-none text-gray-700">
          <p className="lead text-xl text-gray-600 mb-8">
            At FitKalp, we take your privacy and the privacy of your gym members seriously. This Privacy Policy outlines how we collect, use, and protect your data.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">1. Data We Collect</h2>
          <p className="mb-4">When you use FitKalp, we collect the following types of information:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Account Information:</strong> Your name, email address, phone number, and gym details provided during signup.</li>
            <li><strong>Gym Data:</strong> Information about your members, their attendance, membership plans, and communications.</li>
            <li><strong>Payment Data:</strong> We process subscription payments securely via Razorpay. We do not store your full credit card or UPI details on our servers.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">2. How We Use Your Data</h2>
          <p className="mb-4">We use your data strictly to provide and improve the FitKalp service. Specifically, we use it to:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Operate your CRM dashboard and manage your gym's operations.</li>
            <li>Send automated WhatsApp and email reminders to your members on your behalf.</li>
            <li>Provide customer support and respond to your inquiries.</li>
            <li>Generate analytics and reports for your gym's performance.</li>
          </ul>
          <p className="font-semibold text-gray-900 bg-gray-50 p-4 rounded-lg border border-gray-100">We do not, and will never, sell your personal data or your members' data to third parties.</p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">3. Data Storage and Security</h2>
          <p className="mb-6">
            We store your data securely on cloud servers located in India to ensure compliance with local regulations and to provide the fastest possible service. We employ industry-standard encryption protocols (SSL/TLS) for data in transit and at rest.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">4. DPDPA 2023 Compliance</h2>
          <p className="mb-6">
            FitKalp is fully committed to complying with the Digital Personal Data Protection Act (DPDPA) 2023 of India. We act as a Data Fiduciary for your account information and a Data Processor for your gym members' information. We ensure all necessary consent mechanisms and data protection safeguards are in place as required by the Act.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">5. Data Export and Deletion Rights</h2>
          <p className="mb-6">
            You own your data. You can export your member lists and financial reports at any time directly from the FitKalp dashboard. If you choose to close your account, you have the right to request full deletion of your data. Upon verified request, we will permanently delete your account and associated data within 30 days, except where retention is required by law (e.g., for accounting purposes).
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">6. Contact Us</h2>
          <p className="mb-6">
            If you have any questions or concerns about this Privacy Policy or our data practices, please contact our team at:
            <br />
            <a href="mailto:fitkalp.gym@gmail.com" className="text-green-600 hover:underline">fitkalp.gym@gmail.com</a>
          </p>
        </article>

      </div>
    </main>
  );
}
