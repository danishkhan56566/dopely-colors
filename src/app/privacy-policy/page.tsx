import React from 'react';

export const metadata = {
    title: 'Privacy Policy - Dopely Colors',
    description: 'How we collect, use, and protect your information.',
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-16 px-6">
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 prose prose-gray lg:prose-lg hover:prose-a:text-blue-600">
                <h1>Privacy Policy</h1>
                <p className="lead">
                    Your privacy is important to us. This policy explains how <strong>Dopely Colors</strong> collects and uses information.
                </p>

                <h2>Information We Collect</h2>
                <p>We may collect:</p>
                <ul>
                    <li>Email address (if you create an account or join a waitlist)</li>
                    <li>Usage data (pages visited, tools used)</li>
                    <li>Technical data (browser, device, IP address)</li>
                </ul>

                <h2>How We Use Information</h2>
                <p>We use your information to:</p>
                <ul>
                    <li>Provide and improve our services</li>
                    <li>Maintain user accounts</li>
                    <li>Analyze website performance</li>
                    <li>Communicate important updates</li>
                </ul>

                <h2>Data Sharing</h2>
                <p>
                    We do <strong>not sell</strong> or rent user data.
                    We may share limited data with trusted services such as:
                </p>
                <ul>
                    <li>Analytics providers</li>
                    <li>Hosting services</li>
                    <li>Advertising platforms (e.g. Google AdSense)</li>
                </ul>

                <h2>Cookies & Tracking</h2>
                <p>We use cookies for:</p>
                <ul>
                    <li>Authentication</li>
                    <li>Analytics</li>
                    <li>Performance optimization</li>
                </ul>

                <h2>Data Security</h2>
                <p>
                    We take reasonable measures to protect your data, but no system is 100% secure.
                </p>

                <h2>Your Rights</h2>
                <p>You may:</p>
                <ul>
                    <li>Request access to your data</li>
                    <li>Request deletion of your account</li>
                    <li>Contact us for privacy-related questions</li>
                </ul>

                <h2>Changes</h2>
                <p>This policy may be updated periodically.</p>
            </div>
        </div>
    );
}
