import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | RehabPearls',
  description: 'Learn how RehabPearls uses cookies and similar technologies.',
};

export default function CookiePolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Cookie Policy</h1>
      <p className="text-sm text-gray-500 mb-10">Last updated: June 2, 2026</p>

      <section className="prose prose-gray max-w-none space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">1. What Are Cookies?</h2>
          <p>
            Cookies are small text files stored on your device when you visit a website. They help
            websites remember your preferences, keep you logged in, and understand how you use the platform.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">2. How We Use Cookies</h2>
          <p>RehabPearls uses the following types of cookies:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>
              <strong>Essential cookies:</strong> Required for the platform to function — keeping
              you logged in, maintaining your session, and securing your account.
            </li>
            <li>
              <strong>Functional cookies:</strong> Remember your preferences such as selected QBank
              category, display settings, and test configuration.
            </li>
            <li>
              <strong>Analytics cookies:</strong> Help us understand how users interact with the
              platform so we can improve features and content (e.g., page views, session duration).
            </li>
            <li>
              <strong>Performance cookies:</strong> Monitor platform speed and reliability to ensure
              a smooth experience.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">3. Third-Party Cookies</h2>
          <p>
            We may use third-party services such as payment processors and analytics tools that set
            their own cookies. These providers have their own privacy policies governing cookie use.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">4. Managing Cookies</h2>
          <p>
            You can control cookies through your browser settings. Note that disabling essential
            cookies may prevent you from logging in or using core platform features. Most browsers
            allow you to block or delete cookies via the Settings or Privacy menu.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">5. Contact</h2>
          <p>
            Questions about our cookie use? Contact us at{' '}
            <a href="mailto:info@rehabpearls.com" className="text-blue-600 hover:underline">
              info@rehabpearls.com
            </a>.
          </p>
        </div>
      </section>
    </main>
  );
}