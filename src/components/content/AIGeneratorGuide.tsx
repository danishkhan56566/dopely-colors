import React from 'react';

export const AIGeneratorGuide = () => {
    return (
        <section className="max-w-4xl mx-auto px-6 py-16 text-gray-700">
            <div className="prose prose-blue max-w-none">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">How to Generate Perfect Color Palettes with AI</h2>

                <p className="text-lg leading-relaxed mb-6">
                    Color selection is often the most challenging part of the design process. Dopely Colors uses advanced artificial intelligence to bridge the gap between abstract concepts and visual reality. Whether you're building a fintech dashboard, a wellness app, or a retro-gaming site, our AI understands the <em>semantic meaning</em> behind your words.
                </p>

                <div className="grid md:grid-cols-2 gap-8 my-10">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Understanding Color Psychology</h3>
                        <p className="text-sm text-gray-600">
                            Our algorithms don't just pick random colors. They analyze color psychology principles. For example, keywords like "Trust" or "Secure" often trigger deep blues and slate grays, while "Energetic" hints at vibrants oranges and acidic greens.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Accessibility First</h3>
                        <p className="text-sm text-gray-600">
                            A beautiful palette is useless if it's not accessible. Dopely Colors prioritizes WCAG-compliant contrast ratios ensuring your generated text colors are readable against their backgrounds.
                        </p>
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">Tips for Better Prompts</h3>
                <ul className="list-disc pl-5 space-y-2 mb-8">
                    <li><strong>Be Specific about Industry:</strong> Mention "Medical", "Real Estate", or "Gaming" to set the tone.</li>
                    <li><strong>Include Mood Keywords:</strong> Words like "Calm", "Chaotic", "Minimalist", or "Luxurious" heavily influence saturation and brightness.</li>
                    <li><strong>Reference Art Styles:</strong> Try prompts like "Bauhaus style", "Cyberpunk neon", or "Pastel watercolor".</li>
                </ul>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">Who is this tool for?</h3>
                <p className="mb-6">
                    <strong>UI/UX Designers</strong> use this to break out of creative ruts. <strong>Developers</strong> use it to generate Tailwind-ready themes without needing a designer. <strong>Brand Managers</strong> use it to ensure consistency across marketing materials.
                </p>

                <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl mt-8">
                    <h4 className="font-bold text-blue-900 mb-2">Ready to export?</h4>
                    <p className="text-blue-800 text-sm">
                        Once you've found a palette you love, click "Edit" to fine-tune it in our advanced editor, or export it directly to CSS, SCSS, JSON, or Tailwind config.
                    </p>
                </div>
            </div>
        </section>
    );
};
