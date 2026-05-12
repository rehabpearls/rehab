export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Top Footer */}
        <div className="grid md:grid-cols-5 gap-10">

          {/* Brand Info */}
          <div className="md:col-span-2">
            <h3 className="text-white text-2xl font-bold mb-3">
              RehabPearls
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Evidence-based rehabilitation exam practice and clinical case learning for therapists and clinicians worldwide.
            </p>
            <p className="text-xs text-gray-500">
              Registered Trademark © RehabPearls.com
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-semibold mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/qbank" className="hover:text-white">QBank</a></li>
              <li><a href="/cases" className="hover:text-white">Clinical Cases</a></li>
              <li><a href="/dashboard" className="hover:text-white">Dashboard</a></li>
              <li><a href="/analytics" className="hover:text-white">Analytics</a></li>
              <li><a href="/performance" className="hover:text-white">Performance Tracking</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/blog" className="hover:text-white">Blog</a></li>
              <li><a href="/guides" className="hover:text-white">Study Guides</a></li>
              <li><a href="/faq" className="hover:text-white">FAQ</a></li>
              <li><a href="/support" className="hover:text-white">Support Center</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/privacy-policy" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="/terms-of-service" className="hover:text-white">Terms of Service</a></li>
              <li><a href="/cookie-policy" className="hover:text-white">Cookie Policy</a></li>
              <li><a href="/refund-policy" className="hover:text-white">Refund Policy</a></li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-12 mb-6"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} RehabPearls.com. All rights reserved.</p>

          <div className="flex gap-4 mt-3 md:mt-0">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              Facebook
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              Twitter
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              LinkedIn
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              Instagram
            </a>
          </div>
        </div>

      </div>
    </footer>
  )
}

