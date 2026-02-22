'use client';

import { Check, X, ShieldCheck, Zap, Laptop, Globe } from 'lucide-react';

const COMPARISON_DATA = [
    { feature: 'AI-Powered Generation', dopely: true, coolors: true, adobe: false },
    { feature: 'Accessibility Testing (WCAG)', dopely: true, coolors: true, adobe: true },
    { feature: 'Brand Identity Maker', dopely: true, coolors: false, adobe: false },
    { feature: 'Image extraction (Semantic)', dopely: true, coolors: false, adobe: true },
    { feature: 'Color Psychology Deep-dives', dopely: true, coolors: false, adobe: false },
    { feature: 'Unlimited Palette Collections', dopely: true, coolors: true, adobe: true },
    { feature: 'Export to Code (Tailwind/CSS)', dopely: true, coolors: true, adobe: false },
    { feature: 'Browser Extension Support', dopely: true, coolors: true, adobe: false },
];

export default function ComparisonPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-20 px-6">
            <div className="max-w-6xl mx-auto">
                <header className="text-center mb-20">
                    <span className="inline-block px-4 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest mb-4">
                        Comparison Guide 2026
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                        Best <span className="text-blue-600">Color Palette</span> Generators
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                        Choosing the right tool for your design workflow is critical. We've compared <strong>Dopely Colors</strong> against industry giants like <strong>Adobe Color</strong> and <strong>Coolors</strong> to help you decide.
                    </p>
                </header>

                <div className="overflow-x-auto mb-20">
                    <table className="w-full bg-white dark:bg-slate-900 rounded-[2.5rem] border-separate border-spacing-0 shadow-2xl border border-slate-200 dark:border-slate-800">
                        <thead>
                            <tr>
                                <th className="p-8 text-left text-slate-500 font-bold uppercase tracking-widest text-xs border-b border-slate-100 dark:border-slate-800">Core Features</th>
                                <th className="p-8 text-center border-b border-slate-100 dark:border-slate-800 bg-blue-50/50 dark:bg-blue-900/10">
                                    <div className="flex flex-col items-center">
                                        <span className="text-xl font-black text-slate-900 dark:text-white">Dopely</span>
                                        <span className="text-[10px] text-blue-500 font-bold uppercase">The Winner</span>
                                    </div>
                                </th>
                                <th className="p-8 text-center border-b border-slate-100 dark:border-slate-800 opacity-60">
                                    <span className="text-xl font-black text-slate-900 dark:text-white">Adobe Color</span>
                                </th>
                                <th className="p-8 text-center border-b border-slate-100 dark:border-slate-800 opacity-60">
                                    <span className="text-xl font-black text-slate-900 dark:text-white">Coolors</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {COMPARISON_DATA.map((row, i) => (
                                <tr key={i} className="group">
                                    <td className="p-8 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-50 dark:border-slate-800/50">
                                        {row.feature}
                                    </td>
                                    <td className="p-8 text-center border-b border-slate-50 dark:border-slate-800/50 bg-blue-50/30 dark:bg-blue-900/5">
                                        {row.dopely ? <Check className="w-6 h-6 text-green-500 mx-auto" /> : <X className="w-6 h-6 text-red-500 mx-auto" />}
                                    </td>
                                    <td className="p-8 text-center border-b border-slate-50 dark:border-slate-800/50 opacity-60">
                                        {row.adobe ? <Check className="w-6 h-6 text-green-500 mx-auto" /> : <X className="w-6 h-6 text-red-500 mx-auto" />}
                                    </td>
                                    <td className="p-8 text-center border-b border-slate-50 dark:border-slate-800/50 opacity-60">
                                        {row.coolors ? <Check className="w-6 h-6 text-green-500 mx-auto" /> : <X className="w-6 h-6 text-red-500 mx-auto" />}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg">
                        <ShieldCheck className="w-10 h-10 text-blue-500 mb-6" />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Why Professional Choose Dopely</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                            While Adobe Color is great for basic harmonies, it lacks the AI-intelligence that modern design systems require. Dopely understands the semantic role of each color—assigning them to "Primary", "Background", or "Action" layers automatically.
                        </p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg">
                        <Zap className="w-10 h-10 text-yellow-500 mb-6" />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Speed & Efficiency</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                            Coolors is famous for its spacebar generator, but Dopely takes it further with true prompt-based generation. Tell us "Modern SaaS in Japan" and watch as our engine harvests cultural and technical data to build your perfect set.
                        </p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg">
                        <Laptop className="w-10 h-10 text-purple-500 mb-6" />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Developer Friendly</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                            Adobe lacks native support for modern frameworks. Dopely provides one-click exports for Tailwind CSS, CSS Variables, and even JSON for your design tokens—bridging the gap between Figma and the Frontend.
                        </p>
                    </div>
                </div>

                <section className="mt-32 prose prose-slate dark:prose-invert max-w-4xl mx-auto">
                    <h2 className="text-3xl font-black uppercase">How to Choose the Best Palette Generator</h2>
                    <p>When searching for a color palette generator, you should look for three things: <strong>Math</strong>, <strong>Accessibility</strong>, and <strong>Context</strong>. A good tool doesn't just give you "nice" colors; it gives you colors that work together according to WCAG contrast standards and match the emotional intent of your project.</p>
                    <p>Dopely Colors was built to be the most comprehensive suite on the web, combining the simplicity of a generator with the depth of a color-theory encyclopedia. Whether you're a student learning about primary colors or a senior UX designer building a design system, Dopely provides the technical depth that competitors lack.</p>
                </section>
            </div>
        </main>
    );
}
