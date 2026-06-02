import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | RehabPearls',
  description: 'Learn how RehabPearls collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-10">Last updated: June 2, 2026</p>

      <section className="prose prose-gray max-w-none space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
          <p>
            When you create an account or use RehabPearls, we collect information you provide directly,
            such as your name, email address, and payment details. We also automatically collect usage
            data including questions answered, test sessions, performance scores, and time spent on the platform.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Provide and personalize your QBank experience</li>
            <li>Track your progress and generate performance analytics</li>
            <li>Process payments and manage your subscription</li>
            <li>Send important account and product updates</li>
            <li>Improve our question bank and platform features</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">3. Data Sharing</h2>
          <p>
            We do not sell your personal information. We may share data with trusted service providers
            (such as payment processors and hosting providers) solely to operate the platform. We may
            disclose information if required by law.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">4. Cookies</h2>
          <p>
            We use cookies and similar technologies to keep you logged in, remember your preferences,
            and analyze platform usage. See our <a href="/cookie-policy" className="text-blue-600 hover:underline">Cookie Policy</a> for details.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">5. Data Retention</h2>
          <p>
            We retain your account data for as long as your account is active. You may request deletion
            of your data at any time by contacting us. Anonymized usage data may be retained for
            platform improvement purposes.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">6. Your Rights</h2>
          <p>
            Depending on your location, you may have rights to access, correct, or delete your personal
            data, or to opt out of certain processing. To exercise these rights, contact us at{' '}
            <a href="mailto:support@rehabpearls.com" className="text-blue-600 hover:underline">
              support@rehabpearls.com
            </a>.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">7. Security</h2>
          <p>
            We use industry-standard security measures including encryption in transit and at rest to
            protect your data. However, no system is 100% secure, and we encourage you to use a strong,
            unique password for your account.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">8. Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. We will notify you of significant changes via
            email or a notice on the platform. Continued use after changes constitutes acceptance.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">9. Contact</h2>
          <p>
            Questions about this policy? Reach us at{' '}
            <a href="mailto:info@rehabpearls.com" className="text-blue-600 hover:underline">
              info@rehabpearls.com
            </a>.
          </p>
        </div>
      </section>
    </main>
  );
}