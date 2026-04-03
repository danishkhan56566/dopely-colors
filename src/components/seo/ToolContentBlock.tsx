import React from 'react';
import { CheckCircle2, Lightbulb, HelpCircle, ChevronRight } from 'lucide-react';

export interface ToolContentProps {
    title: string;
    introduction: React.ReactNode;
    howToSteps: { title: string; description: string }[];
    benefits: { title: string; description: string }[];
    proTips: string[];
    faqs: { q: string; a: string }[];
}

export const ToolContentBlock = ({
    title,
    introduction,
    howToSteps,
    benefits,
    proTips,
    faqs
}: ToolContentProps) => {
    return (
        <article className="max-w-4xl mx-auto py-24 px-6 relative z-10 w-full text-left">
            <header className="mb-16">
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
                    {title}
                </h1>
                <div className="prose prose-lg text-gray-600 leading-relaxed max-w-none">
                    {introduction}
                </div>
            </header>

            {/* How to Use Section */}
            <section className="mb-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                    <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">
                        <ChevronRight size={20} />
                    </span>
                    How to Use This Tool
                </h2>
                <div className="grid gap-6 pl-2 md:pl-12">
                    {howToSteps.map((step, index) => (
                        <div key={index} className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-sm mt-1">
                                {index + 1}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg mb-1">{step.title}</h3>
                                <p className="text-gray-600 text-base">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Benefits Section */}
            <section className="mb-16 bg-gray-50 rounded-3xl p-8 md:p-12 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-600 p-2 rounded-lg">
                        <CheckCircle2 size={20} />
                    </span>
                    Benefits for Designers & Developers
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                    {benefits.map((benefit, index) => (
                        <div key={index}>
                            <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Pro Tips Section */}
            <section className="mb-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                    <span className="bg-amber-100 text-amber-600 p-2 rounded-lg">
                        <Lightbulb size={20} />
                    </span>
                    Expert Tips
                </h2>
                <ul className="space-y-4 pl-2 md:pl-12">
                    {proTips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <span className="text-amber-500 mt-1">•</span>
                            <span className="text-gray-600 text-base">{tip}</span>
                        </li>
                    ))}
                </ul>
            </section>

            {/* FAQs Section */}
            <section className="mb-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                        <HelpCircle size={20} />
                    </span>
                    Frequently Asked Questions
                </h2>
                <div className="space-y-6">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border-b border-gray-100 pb-6 last:border-0">
                            <h3 className="font-bold text-gray-900 text-lg mb-2">{faq.q}</h3>
                            <p className="text-gray-600 text-base leading-relaxed">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </section>
        </article>
    );
};
