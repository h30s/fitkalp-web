export const metadata = {
  title: 'Terms of Service - FitKalp',
  description: 'Terms and conditions for using the FitKalp gym management software.'
};

export default function TermsPage() {
  return (
    <main className="min-h-screen pt-28 pb-16 sm:pt-36 sm:pb-24" style={{ fontFamily: "'DM Sans','Inter',sans-serif" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Terms of Service</h1>
          <p className="text-gray-500 text-sm sm:text-base">Last updated: July 2026</p>
        </div>

        <article className="prose prose-lg prose-green max-w-none text-gray-700">
          <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">1. What FitKalp Provides</h2>
          <p className="mb-6">
            FitKalp is a cloud-based Customer Relationship Management (CRM) software designed specifically for gym owners in India. We provide tools for member management, attendance tracking, payment recording, and automated communications.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">2. Subscription Terms</h2>
          <p className="mb-6">
            FitKalp is offered on a subscription basis, billed either monthly or annually. Your subscription will automatically renew at the end of each billing cycle unless cancelled prior to the renewal date. You can manage your subscription from your account dashboard.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">3. Payment Terms</h2>
          <p className="mb-6">
            All prices are listed and charged in Indian Rupees (INR). We use Razorpay as our primary payment gateway to process all transactions securely. By subscribing, you authorize FitKalp to charge your selected payment method for the subscription fees and any applicable taxes (such as GST).
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">4. Acceptable Use</h2>
          <p className="mb-4">By using FitKalp, you agree not to:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Use the service for any illegal or unauthorized purpose.</li>
            <li>Send unsolicited spam messages through our communication channels.</li>
            <li>Attempt to hack, destabilize, or adapt the FitKalp platform.</li>
            <li>Upload malicious code or viruses.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">5. Data Ownership</h2>
          <p className="mb-6">
            You retain full ownership of all data you input into FitKalp, including member details and financial records. FitKalp claims no ownership rights over your gym's data. We simply host it and provide tools for you to manage it effectively.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">6. Cancellation and Refund Policy</h2>
          <p className="mb-6">
            We offer a 14-day free trial for you to evaluate the software. You can cancel your subscription at any time. However, we do not offer refunds for payments already processed after the trial period, unless there is a documented, prolonged product failure that prevents you from using the core features of the service.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">7. Limitation of Liability</h2>
          <p className="mb-6">
            To the maximum extent permitted by law, FitKalp shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your access to or use of the service.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4">8. Governing Law</h2>
          <p className="mb-6">
            These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these Terms or your use of FitKalp shall be subject to the exclusive jurisdiction of the courts located in India.
          </p>

          <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-100">
            <p className="mb-0 text-sm">
              If you have any questions about these Terms, please contact us at <a href="mailto:fitkalp.gym@gmail.com" className="text-green-600 hover:underline">fitkalp.gym@gmail.com</a>.
            </p>
          </div>
        </article>

      </div>
    </main>
  );
}
