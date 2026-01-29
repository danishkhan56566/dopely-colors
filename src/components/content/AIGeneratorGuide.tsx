import React from 'react';

export const AIGeneratorGuide = () => {
    return (
        <section className="max-w-5xl mx-auto py-20 px-6 text-gray-700 bg-white border-t border-gray-100">
            <div className="prose prose-lg prose-indigo max-w-none">
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 tracking-tight text-center">
                    The Neural Design Engine
                </h2>
                <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed text-center mb-16">
                    Turn abstract concepts into production-ready design systems. We built this engine because standard random generators don't understand <i>context</i>—but LLMs do.
                </p>

                {/* Section 1: Introduction */}
                <div className="mb-20">
                    <h3 className="text-3xl font-bold text-gray-900 mb-6">Why we trained a model on "Vibe"</h3>
                    <p className="text-lg leading-relaxed mb-6">
                        Most color generators use simple math: "Pick a color, then rotate the hue 180 degrees." This creates mathematically correct but often soulless palettes.
                    </p>
                    <p className="text-lg leading-relaxed mb-6">
                        We took a different approach. We fed our model thousands of award-winning UI designs, movie posters, and art history records. Why? Because when you ask for "Cyberpunk," you don't just want neon pink; you want the <i>specific</i> dirty low-light blue-greys that make the neons pop. That's the difference between a math formula and a semantic understanding.
                    </p>
                </div>

                {/* Section 2: How It Works */}
                <div className="grid md:grid-cols-2 gap-12 mb-20">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">🎯 How to Speak Color</h3>
                        <p className="mb-4 text-gray-600">
                            The AI works best when given constraints. Think like an art director, not a programmer.
                        </p>
                        <ul className="space-y-4 bg-gray-50 p-6 rounded-2xl border border-gray-200">
                            <li className="flex gap-3">
                                <span className="text-red-500 font-bold">Don't say:</span>
                                <span className="text-gray-500 line-through">"A blue finance app"</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-green-600 font-bold">Do say:</span>
                                <span className="text-gray-900">"A trustworthy fintech dashboard for older users, relying on deep navies and high-contrast gold accents for readability."</span>
                            </li>
                            <li className="text-sm text-gray-500 italic mt-2 border-t border-gray-200 pt-2">
                                Notice the difference? The second prompt gives the AI clues about <strong>contrast</strong> (readability) and <strong>mood</strong> (trustworthy).
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">🖼️ Visual Intelligence</h3>
                        <p className="mb-4 text-gray-600">
                            If you upload a logo, the AI doesn't just grab the hex code. It analyzes the <strong>saturation density</strong>.
                        </p>
                        <p className="mb-4 text-gray-600">
                            It asks: "Is this a pastel brand or a neon brand?" Then, it builds a supporting cast of colors that share that underlying DNA, ensuring your secondary buttons don't clash with your primary logo.
                        </p>
                        <div className="bg-indigo-50 p-4 rounded-xl text-indigo-900 text-sm font-medium">
                            It's easier to verify a good palette than to generate one from scratch. Use this tool to get 90% of the way there, then tweak the final 10% manually.
                        </div>
                    </div>
                </div>

                {/* Section 3: Deep Tech */}
                <div className="mb-20">
                    <h3 className="text-3xl font-bold text-gray-900 mb-8">Not Just Random Colors</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-[2rem] border border-gray-200 shadow-sm">
                            <h4 className="text-xl font-bold text-gray-900 mb-3">1. Semantic Mapping</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                We map words like "warm," "trust," and "danger" to specific coordinate regions in the CIELAB color space.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] border border-gray-200 shadow-sm">
                            <h4 className="text-xl font-bold text-gray-900 mb-3">2. Contrast Cleanup</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                After the AI makes a "creative" guess, a second algorithm runs a "sanity check" to ensure text will be readable on the background colors.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] border border-gray-200 shadow-sm">
                            <h4 className="text-xl font-bold text-gray-900 mb-3">3. Tokenization</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Finally, we assign roles. The darkest color becomes `surface-900`, the brightest `surface-50`. This prepares the palette for code export immediately.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section 5: CTA */}
                <div className="text-center bg-gray-900 text-white rounded-[2rem] p-12">
                    <h3 className="text-2xl font-bold mb-4">Ready to experiment?</h3>
                    <p className="mb-8 text-gray-400 max-w-xl mx-auto">
                        There's no cost to play. Generate ten variations, pick the best one, and export it to your CSS.
                    </p>
                    <div className="inline-block bg-white/10 text-indigo-300 px-6 py-3 rounded-full text-sm font-medium backdrop-blur-md">
                        <strong>Pro Tip:</strong> Try asking for "A dark mode dashboard for a crypto app" to see the engine's reasoning in action.
                    </div>
                </div>
            </div>
        </section>
    );
};
