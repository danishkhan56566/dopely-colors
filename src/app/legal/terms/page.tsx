import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Dopely Colors',
  description: 'Our rules and guidelines for using the Dopely Colors platform.',
  robots: { index: true, follow: true },
};

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 bg-black text-white selection:bg-purple-500/30">
      <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Terms of Service
      </h1>
      <p className="text-gray-400 mb-8 italic">Last Updated: April 3, 2026</p>

      <section className="space-y-8 text-gray-300 leading-relaxed">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using dopelycolors.com (&quot;Dopely Colors&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
          <p>
            Dopely Colors provides a suite of tools for color inspiration, including color palettes, color information datasets, and AI-driven design tools. All features are provided &quot;as is&quot; and are subject to change without notice.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">3. User Conduct</h2>
          <p>
            You agree not to use Dopely Colors for any unlawful purposes, including but not limited to:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li><strong>Automated Access:</strong> Using bots or scrapers to access the site without permission.</li>
            <li><strong>Infrastructure Stress:</strong> Intentionally overloading our servers.</li>
            <li><strong>Content Misuse:</strong> Attempting to reverse engineer our proprietary algorithms.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">4. Intellectual Property</h2>
          <p>
            All content, including tools, logic, and curated palettes, is the intellectual property of Dopely Colors. You are granted a limited license to use individual palettes for your design projects, but you may not republish our dataset wholesale.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">5. Disclaimer of Warranties</h2>
          <p>
            Dopely Colors provides no warranties, express or implied, regarding the accuracy or availability of our tools. We are not liable for any design decisions made using our platform.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">6. Limitation of Liability</h2>
          <p>
            In no event shall Dopely Colors be liable for any indirect, incidental, or consequential damages resulting from your use of the service.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">7. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of Pakistan.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">8. Contact Details</h2>
          <p>
            For legal inquiries, contact <span className="text-white">legal@dopelycolors.com</span>.
          </p>
        </div>
      </section>
    </div>
  );
}
