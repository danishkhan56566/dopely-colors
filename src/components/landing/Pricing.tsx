import { Check } from 'lucide-react';
import Link from 'next/link';

export const Pricing = () => {
    return (
        <section className="py-24 px-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
                    <p className="text-xl text-gray-500">Start designing for free. Upgrade for power.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Free Plan */}
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                        <div className="text-4xl font-bold mb-6">$0<span className="text-lg text-gray-400 font-normal">/mo</span></div>
                        <p className="text-gray-500 mb-8">Perfect for hobbyists and side projects.</p>

                        <ul className="space-y-4 mb-8">
                            {['Unlimited public palettes', 'Basic exports (HEX, CSS)', 'Community access', 'Basic randomizer'].map(feature => (
                                <li key={feature} className="flex items-center gap-3 text-gray-600">
                                    <div className="w-5 h-5 rounded-full bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors flex items-center justify-center">
                                        <Check size={12} />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button className="w-full py-4 rounded-xl border-2 border-gray-100 font-bold hover:border-gray-300 hover:bg-gray-50 transition-all text-gray-700">
                            Generate Palette Free
                        </button>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-gray-900 p-8 rounded-3xl border border-gray-800 shadow-2xl text-white relative overflow-hidden hover:-translate-y-2 transition-all duration-300 group ring-4 ring-transparent hover:ring-blue-500/20">
                        {/* Gradient Glow Behind */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-rainbow" />

                        <div className="absolute top-0 right-0 bg-rainbow text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl shadow-lg">POPULAR</div>

                        <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                            Pro
                            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white font-normal border border-white/10">Everything in Free</span>
                        </h3>
                        <div className="text-5xl font-bold mb-6 tracking-tight">$12<span className="text-lg text-gray-500 font-normal">/mo</span></div>
                        <p className="text-gray-400 mb-8">For professional designers and teams.</p>

                        <ul className="space-y-4 mb-8">
                            {['Unlimited exports (Tailwind, React, etc.)', 'AI-powered generation', 'Accessibility suite', 'Private palettes', 'Team collaboration'].map(feature => (
                                <li key={feature} className="flex items-center gap-3 text-white/90">
                                    <div className="w-5 h-5 rounded-full bg-rainbow text-white flex items-center justify-center shadow-lg shadow-purple-500/30">
                                        <Check size={12} />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <Link
                            href="/checkout?plan=pro"
                            className="block w-full text-center py-4 rounded-xl bg-rainbow font-bold hover:brightness-110 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-white border border-white/10"
                        >
                            Upgrade to Pro
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
