import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Dopely Colors',
  description: 'Our commitment to your privacy and data protection at Dopely Colors.',
  robots: { index: true, follow: true },
};

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 bg-black text-white selection:bg-purple-500/30">
      <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
        Privacy Policy
      </h1>
      <p className="text-gray-400 mb-8 italic">Last Updated: April 3, 2026</p>

      <section className="space-y-8 text-gray-300 leading-relaxed">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
          <p>
            Welcome to Dopely Colors (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We respect your privacy and are committed to protecting the personal data we collect during your use of dopelycolors.com. This Privacy Policy explains how we collect, use, and safeguard your information to comply with global standards, including the GDPR and CCPA.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">2. Data We Collect</h2>
          <p className="mb-4">We collect minimal information to provide a better user experience:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Usage Data:</strong> Anonymous analytics about your browser type, IP address, and pages visited.</li>
            <li><strong>Cookies:</strong> Small files used to store your preferences (e.g., dark mode settings, saved palettes).</li>
            <li><strong>User Account Details:</strong> If you create an account, we store your email and nickname securely.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">3. Third-Party Services (Google AdSense)</h2>
          <p>
            We use Google AdSense to serve advertisements on our site. Google use cookies (DART cookies) to serve ads based on your visit to this and other sites on the Internet. You may opt-out of the use of the DART cookie by visiting the <a href="https://policies.google.com/technologies/ads" className="text-purple-400 hover:underline">Google Ad and Content Network Privacy Policy</a>.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">4. Data Security</h2>
          <p>
            We implement industry-standard security measures, including SSL encryption, to protect your data from unauthorized access, alteration, or disclosure. However, no method of transmission over the Internet is 100% secure.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">5. Your Rights</h2>
          <p>
            Depending on your location, you have the right to access, correct, or delete your personal data. To exercise these rights, please contact us at the details provided below.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">6. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please reach out to us at:
            <br />
            <strong>Email:</strong> <span className="text-white">legal@dopelycolors.com</span>
            <br />
            <strong>Address:</strong> Islamabad, Pakistan
          </p>
        </div>
      </section>
    </div>
  );
}
