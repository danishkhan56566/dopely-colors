import React from 'react';

export const metadata = {
    title: 'Terms of Service - Dopely Colors',
    description: 'Terms and conditions for using Dopely Colors services.',
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-16 px-6">
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 prose prose-gray lg:prose-lg hover:prose-a:text-blue-600">
                <h1>Terms of Service</h1>
                <p className="lead">
                    Welcome to <strong>Dopely Colors</strong>. By accessing or using our website, tools, or services, you agree to the following terms.
                </p>

                <h3>1. Use of Service</h3>
                <p>
                    Dopely Colors provides online tools for generating and managing color palettes, gradients, and design systems. You agree to use the service only for lawful purposes.
                </p>

                <h3>2. User Accounts</h3>
                <ul>
                    <li>You are responsible for maintaining the confidentiality of your account</li>
                    <li>You must provide accurate information</li>
                    <li>You are responsible for all activity under your account</li>
                </ul>

                <h3>3. Free & Future Features</h3>
                <p>
                    Some features are free to use. Advanced features may be introduced in the future. Availability and limits may change without notice.
                </p>

                <h3>4. Prohibited Activities</h3>
                <p>You may not:</p>
                <ul>
                    <li>Attempt to hack, reverse engineer, or disrupt the service</li>
                    <li>Upload malicious code or harmful content</li>
                    <li>Use the platform to violate any laws or regulations</li>
                </ul>

                <h3>5. Service Availability</h3>
                <p>
                    We strive to keep Dopely Colors available at all times, but we do not guarantee uninterrupted access.
                </p>

                <h3>6. Termination</h3>
                <p>
                    We reserve the right to suspend or terminate accounts that violate these terms.
                </p>

                <h3>7. Disclaimer</h3>
                <p>
                    The service is provided “as is” without warranties of any kind. We are not liable for design decisions or outcomes based on generated colors.
                </p>

                <h3>8. Changes to Terms</h3>
                <p>
                    These terms may be updated at any time. Continued use means acceptance of changes.
                </p>
            </div>
        </div>
    );
}
