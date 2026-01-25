import React from 'react';

export const metadata = {
    title: 'License Agreement - Dopely Colors',
    description: 'Usage rights and ownership details for Dopely Colors tools and generated assets.',
};

export default function LicensePage() {
    return (
        <div className="min-h-screen bg-gray-50 py-16 px-6">
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 prose prose-gray lg:prose-lg hover:prose-a:text-blue-600">
                <h1>License Agreement</h1>
                <p className="lead">
                    All content, tools, designs, code, and features available on <strong>Dopely Colors</strong> are the intellectual property of Dopely Colors unless otherwise stated.
                </p>

                <h2>Usage Rights</h2>
                <p>You are allowed to:</p>
                <ul>
                    <li>Use the tools and features for personal and commercial projects</li>
                    <li>Generate palettes, gradients, and design assets for your own work</li>
                    <li>Export generated outputs for use in websites, apps, and designs</li>
                </ul>

                <p>You are <strong>not allowed</strong> to:</p>
                <ul>
                    <li>Resell, redistribute, or sublicense Dopely Colors tools or services</li>
                    <li>Copy or clone the website, tools, or core functionality</li>
                    <li>Use automated systems to scrape or overload the platform</li>
                </ul>

                <h2>Ownership</h2>
                <p>
                    All generated outputs belong to the user.
                    The platform, algorithms, UI, and system design remain the property of Dopely Colors.
                </p>

                <h2>Changes</h2>
                <p>We reserve the right to update or modify this license at any time.</p>
            </div>
        </div>
    );
}
