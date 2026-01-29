import React from 'react';

export const AIGeneratorGuide = () => {
    return (
        <section className="max-w-5xl mx-auto py-20 px-6 text-gray-700 bg-white border-t border-gray-100">
            <div className="prose prose-lg prose-indigo max-w-none">
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 tracking-tight text-center">
                    The Neural Design Engine
                </h2>
                <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed text-center mb-16">
                    Turn a simple idea, a brand logo, or even a single color into a production-ready design system for modern web and mobile applications.
                </p>

                {/* Section 1: Introduction */}
                <div className="mb-20">
                    <h3 className="text-3xl font-bold text-gray-900 mb-6">Imagine Your Design System in Seconds</h3>
                    <p className="text-lg leading-relaxed mb-6">
                        Dopely AI helps designers and developers generate accessible, scalable, and platform-ready color systems — without manual guesswork or endless iterations. Whether you’re building a startup MVP or refining an enterprise product, Dopely AI transforms inspiration into a complete visual foundation you can actually ship.
                    </p>
                </div>

                {/* Section 2: How It Works */}
                <div className="grid md:grid-cols-2 gap-12 mb-20">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">🎯 Start With an Idea</h3>
                        <p className="mb-4 text-gray-600">
                            Describe what you’re building, and Dopely AI creates a color ecosystem designed for real products. It understands context, not just keywords.
                        </p>
                        <ul className="space-y-3 bg-gray-50 p-6 rounded-2xl border border-gray-200">
                            <li className="flex gap-2">
                                <span className="text-green-500">✓</span> "A modern fintech app for Gen Z with neon vibes"
                            </li>
                            <li className="flex gap-2">
                                <span className="text-green-500">✓</span> "A minimal SaaS landing page with trust-focused colors"
                            </li>
                            <li className="flex gap-2">
                                <span className="text-green-500">✓</span> "A food delivery app with high-contrast UI"
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">🖼️ Logo Analysis (Brand Intelligence)</h3>
                        <p className="mb-4 text-gray-600">
                            Already have a logo? Upload it and let Dopely AI analyze your brand visually. We extract deep semantic data to ensure consistency.
                        </p>
                        <ul className="space-y-2 text-sm font-medium text-gray-700">
                            <li className="flex gap-2 items-center"><div className="w-2 h-2 rounded-full bg-indigo-500" /> Dominant & Secondary Colors</li>
                            <li className="flex gap-2 items-center"><div className="w-2 h-2 rounded-full bg-indigo-500" /> Semantic Roles (Primary, Accent, Bg)</li>
                            <li className="flex gap-2 items-center"><div className="w-2 h-2 rounded-full bg-indigo-500" /> Contrast & Readability Scores</li>
                            <li className="flex gap-2 items-center"><div className="w-2 h-2 rounded-full bg-indigo-500" /> Brand "Vibe" Analysis</li>
                        </ul>
                    </div>
                </div>

                {/* Section 3: Deep Tech */}
                <div className="mb-20">
                    <h3 className="text-3xl font-bold text-gray-900 mb-8">🎨 Neural Palettes & Accessibility</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-violet-50 to-white p-8 rounded-[2rem] border border-violet-100">
                            <h4 className="text-xl font-bold text-violet-900 mb-3">AI-Generated Systems</h4>
                            <p className="text-sm text-violet-700 leading-relaxed">
                                Our proprietary neural engine generates complete systems, not just random palettes. Each output is balanced for UI components, text hierarchy, and background surfaces.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-[2rem] border border-blue-100">
                            <h4 className="text-xl font-bold text-blue-900 mb-3">Accessible by Default</h4>
                            <p className="text-sm text-blue-700 leading-relaxed">
                                Accessibility is buried into every system. We perform real-time contrast validation and WCAG AA/AAA checks on every single color pair generated.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-emerald-50 to-white p-8 rounded-[2rem] border border-emerald-100">
                            <h4 className="text-xl font-bold text-emerald-900 mb-3">Platform Ready</h4>
                            <p className="text-sm text-emerald-700 leading-relaxed">
                                Ship faster with instant exports. Get CSS Variables, Tailwind Configs, and Material Design Tokens for Web, iOS, and Android.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section 4: Use Cases */}
                <div className="bg-gray-900 text-white p-10 md:p-16 rounded-[3rem] mb-20 text-center">
                    <h3 className="text-3xl font-bold mb-6">Trusted by Builders Worldwide</h3>
                    <div className="grid grid-cols-3 gap-8 mb-10 border-b border-gray-800 pb-10">
                        <div>
                            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-fuchsia-400">1.2M+</div>
                            <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mt-2">Tokens Generated</div>
                        </div>
                        <div>
                            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-teal-400">99.9%</div>
                            <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mt-2">A11y Score</div>
                        </div>
                        <div>
                            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-400 to-orange-400">50k+</div>
                            <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mt-2">Assets Created</div>
                        </div>
                    </div>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        "Dopely AI is built for designers, developers, and founders who want speed without sacrificing quality. It's the design partner that never sleeps."
                    </p>
                </div>

                {/* Section 5: CTA */}
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">✨ Start Designing With Confidence</h3>
                    <p className="mb-8 text-gray-600">
                        Turn inspiration into a complete design system in seconds. Upload a logo, describe your idea, or start from a single color — Dopely AI handles the rest.
                    </p>
                    <div className="inline-block bg-indigo-50 text-indigo-800 px-6 py-4 rounded-xl font-medium border border-indigo-100">
                        <strong>Pro Tip:</strong> Try asking for "A dark mode dashboard for a crypto app" to see the AI's complex reasoning in action.
                    </div>
                </div>
            </div>
        </section>
    );
};
