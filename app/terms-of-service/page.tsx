import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | RehabPearls',
  description: 'Read the terms and conditions governing your use of the RehabPearls platform.',
};

export default function TermsOfServicePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-10">Last updated: June 2, 2026</p>

      <section className="prose prose-gray max-w-none space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using RehabPearls (&quot;the Platform&quot;), you agree to be bound by these
            Terms of Service. If you do not agree, please do not use the Platform.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">2. Eligibility</h2>
          <p>
            You must be at least 18 years old and capable of forming a binding contract to use
            RehabPearls. By registering, you confirm that the information you provide is accurate and complete.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">3. Platform Use</h2>
          <p>RehabPearls grants you a limited, non-exclusive, non-transferable license to access the
          platform for your personal educational use. You agree not to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Share, sell, or redistribute any platform content or your account credentials</li>
            <li>Copy, reproduce, or scrape questions, explanations, or any proprietary content</li>
            <li>Use automated tools (bots, scrapers) to access the platform</li>
            <li>Attempt to reverse engineer or tamper with the platform</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">4. Subscriptions & Payments</h2>
          <p>
            Some features require a paid subscription. By subscribing, you authorize us to charge
            your payment method on a recurring basis according to your selected plan. Prices may
            change with notice. See our <a href="/refund-policy" className="text-blue-600 hover:underline">Refund Policy</a> for cancellation terms.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">5. Educational Disclaimer</h2>
          <p>
            RehabPearls is designed for educational purposes and board exam preparation only. Content
            on the platform does not constitute clinical advice and should not be used as a substitute
            for professional judgment in patient care settings.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">6. Intellectual Property</h2>
          <p>
            All content on RehabPearls — including questions, explanations, case studies, and
            platform design — is owned by RehabPearls and protected by copyright law. Unauthorized
            reproduction is strictly prohibited.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">7. Termination</h2>
          <p>
            We reserve the right to suspend or terminate your account for violation of these terms,
            chargebacks, or fraudulent activity, without refund.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">8. Limitation of Liability</h2>
          <p>
            RehabPearls is provided &quot;as is&quot; without warranties of any kind. We are not liable for
            exam outcomes, interruptions of service, or indirect damages arising from platform use.
            Our total liability is limited to the amount paid in the last 3 months.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">9. Governing Law</h2>
          <p>
            These terms are governed by the laws of the United States. Disputes will be resolved
            through binding arbitration, not class actions, unless prohibited by law.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">10. Contact</h2>
          <p>
            Questions?{' '}
            <a href="mailto:info@rehabpearls.com" className="text-blue-600 hover:underline">
              info@rehabpearls.com
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}