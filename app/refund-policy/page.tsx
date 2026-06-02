import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy | RehabPearls',
  description: 'RehabPearls refund and cancellation policy for subscriptions.',
};

export default function RefundPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Refund Policy</h1>
      <p className="text-sm text-gray-500 mb-10">Last updated: June 2, 2026</p>

      <section className="prose prose-gray max-w-none space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">1. Subscription Cancellations</h2>
          <p>
            You may cancel your RehabPearls subscription at any time from your account settings.
            Cancellation takes effect at the end of your current billing period — you will retain
            full access until that date.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">2. Refund Eligibility</h2>
          <p>
            We offer a <strong>7-day money-back guarantee</strong> for first-time subscribers. If
            you are not satisfied within the first 7 days of your initial subscription, contact us
            for a full refund — no questions asked.
          </p>
          <p className="mt-2">
            After the 7-day window, subscriptions are non-refundable. Partial-period refunds are
            not issued for mid-cycle cancellations.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">3. Exceptions</h2>
          <p>Refunds outside the 7-day window may be considered in exceptional circumstances, such as:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>A technical issue caused by RehabPearls that prevented access for an extended period</li>
            <li>Duplicate charges due to a billing error</li>
          </ul>
          <p className="mt-2">To request an exception, contact us with your account details and a description of the issue.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">4. How to Request a Refund</h2>
          <p>
            Email{' '}
            <a href="mailto:info@rehabpearls.com" className="text-blue-600 hover:underline">
              info@rehabpearls.com
            </a>{' '}
            with your name, account email, and reason for the refund request. We will respond within
            2 business days. Approved refunds are processed to your original payment method within
            5–10 business days.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">5. Contact</h2>
          <p>
            Still have questions?{' '}
            <a href="mailto:info@rehabpearls.com" className="text-blue-600 hover:underline">
              info@rehabpearls.com
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}