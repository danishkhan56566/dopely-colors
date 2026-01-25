import React from 'react';

export const ContrastGuide = () => {
    return (
        <section className="max-w-5xl mx-auto px-6 py-16 text-gray-700">
            <div className="prose prose-blue max-w-none">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Accessibility Matters in UI Design</h2>

                <p className="text-lg leading-relaxed mb-6">
                    Web accessibility isn't just a legal requirement; it's a moral imperative. Approximately 15% of the world's population lives with some form of disability. Low vision, color blindness, and aging eyes all affect how users perceive your digital products. Dopely Colors' Contrast Checker helps you ensure your text is readable for everyone.
                </p>

                <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-10 shadow-sm">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Understanding WCAG Ratings</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <div className="bg-red-100 text-red-800 font-bold px-3 py-1 rounded inline-block mb-2 text-sm">Fail (Below 3:1)</div>
                            <p className="text-sm text-gray-600">
                                Text blends too much with the background. Unreadable for many users. Avoid for any content.
                            </p>
                        </div>
                        <div>
                            <div className="bg-yellow-100 text-yellow-800 font-bold px-3 py-1 rounded inline-block mb-2 text-sm">AA (Mid-Range)</div>
                            <p className="text-sm text-gray-600">
                                <strong>3.0:1</strong> for large text, <strong>4.5:1</strong> for normal text. The minimum standard for most business websites.
                            </p>
                        </div>
                        <div>
                            <div className="bg-green-100 text-green-800 font-bold px-3 py-1 rounded inline-block mb-2 text-sm">AAA (Gold Standard)</div>
                            <p className="text-sm text-gray-600">
                                <strong>4.5:1</strong> for large text, <strong>7.0:1</strong> for normal text. Required for government sites and highly inclusive design.
                            </p>
                        </div>
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">Common Contrast Mistakes</h3>
                <ul className="list-disc pl-5 space-y-3 mb-8">
                    <li>
                        <strong>Grey Text on White:</strong> Light grey text looks sleek but is often illegible. Ensure your grey is dark enough (e.g., slate-500 or darker).
                    </li>
                    <li>
                        <strong>Button Text:</strong> White text on a bright orange or yellow button often fails. Use dark text for light buttons.
                    </li>
                    <li>
                        <strong>Hover States:</strong> Don't forget to check contrast for hover and focus states, not just the default appearance.
                    </li>
                </ul>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">How to Fix Contrast Issues</h3>
                <p className="mb-6">
                    If your colors fail, you don't need to change your entire brand. Try:
                </p>
                <ol className="list-decimal pl-5 space-y-2 mb-6">
                    <li><strong>Darkening the background</strong> slightly if using white text.</li>
                    <li><strong>Increasing font weight</strong> (Bold text requires lower contrast ratios than thin text).</li>
                    <li><strong>Adding a text shadow</strong> or overlay to improve separation.</li>
                </ol>
            </div>
        </section>
    );
};
