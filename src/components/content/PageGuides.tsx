import React from 'react';
import Link from 'next/link';
import { AdUnit } from '@/components/ads/AdUnit';
import { Palette, Zap, Layers, ArrowRight } from 'lucide-react';

// --- Shared Styles ---
const Section = ({ children }: { children: React.ReactNode }) => (
    <section className="max-w-5xl mx-auto py-20 px-6 text-gray-700 bg-white border-t border-gray-100">
        <div className="prose prose-lg prose-indigo max-w-none">
            {children}
        </div>
    </section>
);

const Title = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 tracking-tight text-center">{children}</h2>
);

const Subtitle = ({ children }: { children: React.ReactNode }) => (
    <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed text-center mb-16">{children}</p>
);

// --- 1. Home Page Guide ---
export const HomeGuide = () => (
    <section className="max-w-7xl mx-auto py-32 px-6 relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-50/50 rounded-full blur-[120px] -z-10" />

        <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Perception</span>
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
                Most color tools are broken. They give you 5 random colors that look nice in a stripe but fail in a real UI. We built Dopely to fix that.
            </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Bento Card 1: The Philosophy */}
            <div className="xl:col-span-8 bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                        <Palette size={20} />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-widest text-indigo-600">The Problem</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Why "Math" isn't enough</h3>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                    Computers see color linearly. Humans don't. To a computer, pure yellow (`#FFFF00`) and pure blue (`#0000FF`) share the same saturation value. But to your eye, the yellow screams while the blue recedes.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                    This is why strictly mathematical palettes look "off." Our engine uses <strong>Perceptual Modeling</strong> to adjust for these human quirks, ensuring that "Light Blue" and "Light Yellow" actually <i>feel</i> equally light.
                </p>
                <div className="flex flex-wrap gap-4">
                    <Link href="/generate" className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all">
                        Experience the Difference
                    </Link>
                </div>
            </div>

            {/* Bento Card 2: Micro-Tip */}
            <div className="xl:col-span-4 bg-indigo-600 p-8 md:p-10 rounded-[2.5rem] text-white flex flex-col justify-between">
                <div>
                    <h4 className="text-xl font-bold mb-4 italic">"If you can't read the text, the color is wrong."</h4>
                    <p className="text-indigo-100 leading-relaxed">
                        Accessibility isn't a "nice to have" feature. It's the baseline. If your grey text on a white background has a ratio under 4.5:1, your design is fundamentally broken.
                    </p>
                </div>
                <div className="mt-8 pt-8 border-t border-white/10">
                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-200 opacity-60">Design Wisdom #42</p>
                </div>
            </div>

            {/* Bento Card 3: The Toolkit */}
            <div className="xl:col-span-4 bg-gray-900 p-8 md:p-10 rounded-[2.5rem] text-white flex flex-col">
                <div className="flex items-center gap-3 mb-6 text-emerald-400">
                    <Zap size={20} />
                    <span className="text-sm font-bold uppercase tracking-widest">Logic Tools</span>
                </div>
                <h4 className="text-2xl font-bold mb-6">Core Harmonies</h4>
                <ul className="space-y-4">
                    <li className="flex gap-3 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                        <p className="text-sm text-gray-400"><span className="text-white font-bold">Analogous:</span> Creating serenity through proximity. Perfect for backgrounds.</p>
                    </li>
                    <li className="flex gap-3 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-2 shrink-0" />
                        <p className="text-sm text-gray-400"><span className="text-white font-bold">Complementary:</span> High-tension pairs for CTA dominance.</p>
                    </li>
                    <li className="flex gap-3 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
                        <p className="text-sm text-gray-400"><span className="text-white font-bold">Triadic:</span> Vibrant balance for complex data visualization.</p>
                    </li>
                </ul>
            </div>

            {/* Bento Card 4: Building for Scale */}
            <div className="xl:col-span-8 bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-indigo-50/50 rounded-full blur-3xl -mr-16 -mt-16" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6 text-indigo-600">
                        <Layers size={20} />
                        <span className="text-sm font-bold uppercase tracking-widest">Scalability</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-6">Building Systems, Not Swatches</h3>
                    <p className="text-lg text-gray-600 leading-relaxed mb-8">
                        Picking 5 colors is easy. Building a system that accounts for **hover states, active modes, and semantic feedback** (Success/Warning/Error) is where the real work happens. We help you generate full spectrum tints and shades that maintain legislative accessibility standards without sacrificing style.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="/design-system" className="font-bold text-indigo-600 hover:underline flex items-center gap-2">
                            Build a Design System <ArrowRight size={16} />
                        </Link>
                        <Link href="/contrast" className="font-bold text-gray-400 hover:text-gray-900 flex items-center gap-2 transition-colors">
                            Check Accessibility <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

// --- 2. AI Generator Guide ---
export const AIGuide = () => (
    <Section>
        <Title>The Future of Design: Generative Color</Title>
        <Subtitle>How Large Language Models (LLMs) connect semantic meaning to visual color coordinates.</Subtitle>

        <div className="grid xl:grid-cols-3 gap-8 mb-16">
            <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl border border-indigo-100">
                <h3 className="font-bold text-lg mb-2">Semantic Understanding</h3>
                <p className="text-sm text-gray-600">AI doesn't just "see" blue; it understands that "corporate trust" maps to deep navy (`#0f172a`) while "summertime joy" maps to vibrant coral and turquoise.</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-white p-6 rounded-2xl border border-pink-100">
                <h3 className="font-bold text-lg mb-2">Trend Analysis</h3>
                <p className="text-sm text-gray-600">By training on millions of Dribbble and Behance shots, our model suggests combinations that align with current 2024-2026 design aesthetics.</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-2xl border border-emerald-100">
                <h3 className="font-bold text-lg mb-2">Context Awareness</h3>
                <p className="text-sm text-gray-600">Ask for "a dark mode dashboard for finance," and the AI prioritizes contrast ratios and eye-strain reduction over pure aesthetics.</p>
            </div>
        </div>

        <h3 className="text-2xl font-bold mb-4">Prompt Engineering for Color</h3>
        <p className="mb-6">
            To get the best results, be specific about the <strong>mood</strong>, <strong>industry</strong>, and <strong>lighting</strong>. For example, instead of "blue website," try "cyberpunk neo-tokyo street scene with neon blues and hot pinks, high contrast." The AI uses these keywords to triangulate the perfect position in the color space.
        </p>

        <AdUnit slotId="ai-guide-1" label="Design Resources" />

        <p className="text-sm text-gray-500 mt-8">
            Once you have your palette, try testing it with our <Link href="/contrast" className="underline hover:text-indigo-600">Accessibility Contrast Checker</Link> or preview it on real devices using our <Link href="/generate?view=visualize" className="underline hover:text-indigo-600">Visualizer Tool</Link>.
        </p>
    </Section>
);

// --- 3. Image Extractor Guide ---
export const ImageGuide = () => (
    <Section>
        <Title>Extracting the Essence of an Image</Title>
        <Subtitle>How pixel quantization turns complex photography into usable color palettes.</Subtitle>

        <p className="mb-8">
            Photos often contain millions of distinct colors. To reduce an image (like a sunset photo) down to a usable 5-color palette, we don't just pick "random pixels." We use a machine learning algorithm called <strong>K-Means Clustering</strong>.
        </p>

        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8">
            <h4 className="font-bold text-gray-900 mb-2">How it works under the hood:</h4>
            <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                <li><strong>Downsampling:</strong> We first resize the image internally to speed up processing, ensuring we aren't analyzing noise.</li>
                <li><strong>Quantization:</strong> We map every pixel to a 3D color space (RGB).</li>
                <li><strong>Centroid Discovery:</strong> The algorithm drops "seeds" into this 3D space and moves them to the densest clusters of dots.</li>
                <li><strong>Filtering:</strong> Finally, we ignore muddy browns/grays (unless you ask for them) to find the "soul" of the image.</li>
            </ol>
        </div>

        <AdUnit slotId="image-guide-1" />

        <h3 className="text-2xl font-bold mb-4">Best Practices for Extraction</h3>
        <ul className="list-disc pl-6 mb-8 space-y-2">
            <li><strong>Lighting Matters:</strong> Avoid photos with heavy shadows if you want clean UI colors. Shadows often extract as muddy grays, which look great in a photo but bad on a button.</li>
            <li><strong>Focus on Subject:</strong> If you're extracting for a brand, choose images where the brand product is the dominant focal point.</li>
            <li><strong>Vibrancy vs. Accuracy:</strong> Sometimes the mathematically dominant color is a boring beige background. Our "Vibrant" mode filters these out to find the accent colors that truly pop.</li>
        </ul>

        <h3 className="text-2xl font-bold mb-4">From Moodboard to Production</h3>
        <p className="mb-4">
            Interior designers and brand strategists have used this technique for decades ("Moodboarding"). By pulling colors directly from inspirational imagery, you ensure your design captures the exact *feeling* of the source material.
        </p>
        <p className="mb-4">
            <strong>Pro Tip:</strong> After extracting, take your new hex codes to the <Link href="/contrast" className="text-indigo-600 font-bold hover:underline">Contrast Auditor</Link>. A color might look great in a photo, but fail WCAG testing when used as text.
        </p>
    </Section>
);

// --- 4. Contrast Checker Guide ---
export const ContrastGuide = () => (
    <Section>
        <Title>Web Accessibility Guidelines (WCAG)</Title>
        <Subtitle>Why contrast ratios are legal requirements, not just design suggestions.</Subtitle>

        <div className="grid xl:grid-cols-2 gap-12 mb-12">
            <div>
                <h3 className="text-2xl font-bold mb-4">Understanding AA vs AAA</h3>
                <p className="mb-4">
                    The Web Content Accessibility Guidelines (WCAG) define two levels of compliance:
                </p>
                <div className="space-y-4">
                    <div className="border border-green-200 bg-green-50 p-4 rounded-xl">
                        <div className="font-bold text-green-800">Level AA (Minimum)</div>
                        <p className="text-sm text-green-700">Requires a ratio of <strong>4.5:1</strong> for normal text. This ensures readability for people with moderately low vision.</p>
                    </div>
                    <div className="border border-blue-200 bg-blue-50 p-4 rounded-xl">
                        <div className="font-bold text-blue-800">Level AAA (Enhanced)</div>
                        <p className="text-sm text-blue-700">Requires a ratio of <strong>7:1</strong>. This is the gold standard for long-form content and high-priority information.</p>
                    </div>
                </div>
            </div>
            <div>
                <h3 className="text-2xl font-bold mb-4">The Impact of Compliance</h3>
                <p className="mb-4">
                    Accessibility benefits everyone, not just those with visual impairments. High contrast improves readability on mobile screens. If you want to see how these ratios affect actual UI, try our <Link href="/generate?view=visualize" className="text-indigo-600 font-bold underline">Design Visualizer</Link>.
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-6">
                    <li>Mobile screens in bright sunlight</li>
                    <li>Low-quality projectors in meeting rooms</li>
                    <li>Devices with "Night Mode" or dim brightness</li>
                </ul>
                <p className="text-sm text-gray-500 italic">
                    *Legal Note: Many jurisdictions, including the EU and parts of the US (Section 508), legally require government and public sector sites to meet WCAG AA standards.
                </p>
            </div>
        </div>

        <AdUnit slotId="contrast-guide-1" label="Accessibility Tools" />

        <p className="text-center">
            Need to build a full accessible color system? Try our <Link href="/tailwind" className="text-indigo-600 font-bold underline">Tailwind Scale Generator</Link> or our <Link href="/design-system" className="text-indigo-600 font-bold underline">Design System Builder</Link>.
        </p>
    </Section>
);

// --- 5. Color Picker Guide ---
export const PickerGuide = () => (
    <Section>
        <Title>Navigating Color Spaces</Title>
        <Subtitle>RGB, HSL, CMYK, and LAB: Which model should you use?</Subtitle>

        <div className="overflow-x-auto mb-12">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className="py-4 font-bold">Space</th>
                        <th className="py-4 font-bold">Best For</th>
                        <th className="py-4 font-bold">Description</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    <tr className="border-b border-gray-100">
                        <td className="py-4 font-mono font-bold text-indigo-600">HEX</td>
                        <td className="py-4">Web Dev</td>
                        <td className="py-4">The standard for CSS. Compact and widely supported, but hard to "read" by humans.</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                        <td className="py-4 font-mono font-bold text-indigo-600">RGB</td>
                        <td className="py-4">Screens</td>
                        <td className="py-4">Additive color model (Red, Green, Blue). How your monitor pixels actually light up.</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                        <td className="py-4 font-mono font-bold text-indigo-600">HSL</td>
                        <td className="py-4">Designers</td>
                        <td className="py-4">Hue, Saturation, Lightness. The most intuitive way to perform color adjustments (e.g., "make it lighter").</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                        <td className="py-4 font-mono font-bold text-indigo-600">CMYK</td>
                        <td className="py-4">Print</td>
                        <td className="py-4">Subtractive model (Ink). Crucial if your brand needs to look good on business cards.</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <h3 className="text-2xl font-bold mb-4">Why HSL is King for UI</h3>
        <p className="mb-8">
            We prioritize HSL (Hue, Saturation, Lightness) in our tools because it decouples the *color* (Hue) from its *intensity* (Saturation/Lightness). This allows you to generate consistent design systems by keeping the Hue constant while varying Lightness to create hover states and backgrounds. You can check these values in our <Link href="/picker" className="text-indigo-600 font-bold hover:underline">Professional Color Picker</Link>.
        </p>

        <p className="text-sm bg-gray-50 p-4 rounded-lg border border-gray-200">
            <strong>Pro Tip:</strong> Once you've picked a base color, put it into our <Link href="/design-system" className="text-indigo-600 font-bold">Design System Builder</Link> to generate a full UI kit.
        </p>
    </Section>
);

// --- 6. Tailwind Guide ---
export const TailwindGuide = () => (
    <Section>
        <Title>Utility-First Color Architecture</Title>
        <Subtitle>Why Tailwind's 50-950 scale has become the industry standard.</Subtitle>

        <p className="mb-8">
            Tailwind CSS revolutionized web styling by promoting a predefined scale of colors. Instead of arbitrary hex codes scattered through CSS files, Tailwind enforces a **Design System** approach. A standard scale usually includes 11 steps (50 to 950), offering a perfect range for backgrounds (50-100), decorative borders (200-300), body text (400-600), and headings (700-900). Create your own scale using our <Link href="/tailwind" className="text-indigo-600 font-bold hover:underline">Tailwind Generator</Link>.
        </p>

        <AdUnit slotId="tailwind-guide-1" label="Developer Tools" />

        <div className="grid xl:grid-cols-2 gap-8 mb-12 mt-8">
            <div className="p-6 bg-slate-900 text-white rounded-2xl">
                <h4 className="font-bold mb-4 text-emerald-400">Stop Hardcoding Hexes</h4>
                <p className="text-sm text-slate-300 mb-4">
                    The biggest mistake junior devs make is naming colors "blue-500". What happens when the CEO wants to rebrand to purple? You have to find/replace 500 files.
                </p>
                <p className="text-sm text-slate-300 mb-4">
                    Instead, map your primitive scale to <strong>semantic tokens</strong>.
                </p>
                <code className="text-xs bg-black/50 p-2 rounded block">
                    primary: colors.indigo,<br />
                    success: colors.emerald,<br />
                    warning: colors.amber
                </code>
            </div>
            <div>
                <h4 className="font-bold mb-4 mt-2">Exporting Config</h4>
                <p className="mb-4">
                    Our generator creates a ready-to-paste `tailwind.config.js` object. It automatically calculates the interim steps using cubic-bezier interpolation, ensuring that the jump from 400 to 500 feels perceptually identical to the jump from 500 to 600.
                </p>
            </div>
        </div>

        <p>
            Ready to see these colors in action? Use the <Link href="/design-system" className="text-indigo-600 font-bold underline">Design System Builder</Link> to preview them on real UI components.
        </p>
    </Section>
);

// --- 7. Design System Guide ---
export const DesignSystemGuide = () => (
    <Section>
        <Title>Atomic Design Consistency</Title>
        <Subtitle>From Tokens to Components: Scaling your visual language.</Subtitle>

        <div className="mb-12">
            <h3 className="text-2xl font-bold mb-4">What are Design Tokens?</h3>
            <p className="mb-6">
                Design Tokens are the "atoms" of a design system. They are the smallest pieces of UI information—colors, typography sizes, spacing units—stored as variables. By using tokens instead of hardcoded values, you create a system that is:
            </p>
            <ul className="grid xl:grid-cols-3 gap-4 text-center">
                <li className="bg-gray-50 p-4 rounded-xl border border-gray-200 font-bold">Maintainable</li>
                <li className="bg-gray-50 p-4 rounded-xl border border-gray-200 font-bold">Scalable</li>
                <li className="bg-gray-50 p-4 rounded-xl border border-gray-200 font-bold">Themeable</li>
            </ul>
        </div>

        <AdUnit slotId="ds-guide-1" label="Design Tools" />

        <h3 className="text-2xl font-bold mb-4">Building a Palette Hierarchy</h3>
        <p className="mb-4">
            A professional system separates colors into three categories:
        </p>
        <div className="space-y-4 mb-8">
            <div className="flex gap-4 items-start">
                <span className="font-bold text-indigo-600 min-w-[120px]">Brand Colors:</span>
                <span>The 1-3 core colors that define your identity. Used sparingly for high-impact moments (buttons, logos).</span>
            </div>
            <div className="flex gap-4 items-start">
                <span className="font-bold text-gray-600 min-w-[120px]">Neutrals:</span>
                <span>The workhorses. Text, backgrounds, borders. Usually cool grays or warm slates. Checkout our <Link href="/tailwind" className="text-indigo-600 font-bold hover:underline">Tailwind Generator</Link> for scaling neutrals.</span>
            </div>
            <div className="flex gap-4 items-start">
                <span className="font-bold text-red-600 min-w-[120px]">Feedback:</span>
                <span>Universal indicators for system state: Success (Green), Warning (Yellow), Error (Red), Info (Blue).</span>
            </div>
        </div>

        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 flex items-center justify-between">
            <div>
                <h4 className="font-bold text-indigo-900">Need inspiration?</h4>
                <p className="text-sm text-indigo-700">Explore popular palettes to kickstart your system.</p>
            </div>
            <Link href="/explore" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition">Explore</Link>
        </div>

        <div className="mt-8">
            <AdUnit slotId="ds-guide-2" label="Advertisement" />
        </div>
    </Section>
);

// --- 8. Favorites / Collections Guide ---
export const FavoritesGuide = () => (
    <Section>
        <Title>Curating Your Visual Library</Title>
        <Subtitle>Organize, refine, and export your inspiration.</Subtitle>

        <p className="mb-8">
            Great designers steal—or rather, they curate. Maintaining a library of saved palettes allows you to build mood boards faster. When starting a <Link href="/generate" className="text-indigo-600 font-bold">New Project</Link>, don't start from scratch; browsing your "Favorites" list can spark the initial idea that defines the direction of the product.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-2xl mb-8">
            <h4 className="font-bold text-yellow-900 mb-2">Pro Tip: Project-Based Collections</h4>
            <p className="text-yellow-800 text-sm">
                Don't just save colors you like. Save potential combinations for specific use cases. Tag your favorites mentally as "Corporate," "Playful," or "Dark Mode" to make retrieval easier. You can use our <Link href="/ai" className="text-indigo-600 font-bold hover:underline">AI Tool</Link> to find more specific vibes.
            </p>
        </div>

        <AdUnit slotId="favorites-guide-1" label="Inspiration" />
    </Section>
);
