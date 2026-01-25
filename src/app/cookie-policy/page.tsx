import React from 'react';

export const metadata = {
    title: 'Cookie Policy - Dopely Colors',
    description: 'How we use cookies to improve your experience.',
};

export default function CookiePolicyPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-16 px-6">
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 prose prose-gray lg:prose-lg hover:prose-a:text-blue-600">
                <h1>Cookie Policy</h1>
                <p className="lead">
                    Dopely Colors uses cookies to improve your browsing experience.
                </p>

                <h3>What Are Cookies?</h3>
                <p>
                    Cookies are small text files stored on your device when you visit a website.
                </p>

                <h3>Types of Cookies We Use</h3>
                <ul>
                    <li><strong>Essential cookies</strong> – Required for site functionality</li>
                    <li><strong>Analytics cookies</strong> – Help us understand usage and improve tools</li>
                    <li><strong>Advertising cookies</strong> – Used by Google AdSense to show relevant ads</li>
                </ul>

                <h3>Third-Party Cookies</h3>
                <p>
                    Third-party services such as Google may use cookies to display ads based on your visits to this and other websites.
                </p>
                <p>
                    Users may opt out of personalized advertising by visiting Google’s Ads Settings.
                </p>

                <h3>Managing Cookies</h3>
                <p>
                    You can control or delete cookies through your browser settings.
                </p>

                <h3>Consent</h3>
                <p>
                    By using Dopely Colors, you consent to the use of cookies as described in this policy.
                </p>
            </div>
        </div>
    );
}
