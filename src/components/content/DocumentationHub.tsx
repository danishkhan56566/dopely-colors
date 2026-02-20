'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQ {
    question: string;
    answer: string;
    category?: 'General' | 'Technical' | 'Usage' | 'Troubleshooting';
}

interface DocumentationHubProps {
    title: string;
    description: string;
    benefits: string[];
    howToSteps: { title: string; desc: string }[];
    faqs: FAQ[];
    videoPlaceholder?: string; // Kept for interface compatibility
    extraSections?: { title: string; content: React.ReactNode }[];
}

export const DocumentationHub = ({
    title,
    description,
    benefits,
    howToSteps,
    faqs,
    extraSections = []
}: DocumentationHubProps) => {
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    return (
        <section className="max-w-5xl mx-auto py-20 px-6 text-gray-700">
            <div className="prose prose-lg prose-indigo max-w-none">

                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">The Ultimate Guide to {title}</h2>
                    <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* Benefits Section */}
                {benefits.length > 0 && (
                    <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Why {title} Matters</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                In modern interface design, {title.toLowerCase()} serves as a powerful functional tool that guides user attention, establishes hierarchy, and creates a unique brand identity.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                By leveraging this system, you can ensure consistency, accessibility, and high visual impact across all your digital products or creative workflows.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-3xl border border-indigo-100">
                            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">✓</span>
                                Key Benefits
                            </h4>
                            <ul className="space-y-3 m-0 p-0 list-none">
                                {benefits.map((benefit, i) => (
                                    <li key={i} className="flex gap-3 text-sm font-medium text-gray-700 m-0 p-0 before:hidden">
                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 shrink-0"></span>
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Workflow / How To Steps */}
                {howToSteps.length > 0 && (
                    <>
                        <h3 className="text-3xl font-bold text-gray-900 mb-8 mt-12">Understanding the Workflow</h3>
                        <div className="grid md:grid-cols-3 gap-8 mb-16">
                            {howToSteps.map((step, i) => (
                                <div key={i} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow bg-white">
                                    <div className="h-24 rounded-xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 mb-4 shadow-inner flex items-center justify-center border border-indigo-100/50">
                                        <span className="text-4xl font-black text-indigo-300 shadow-indigo-500/20 drop-shadow-sm">{i + 1}</span>
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h4>
                                    <p className="text-sm text-gray-600 m-0 leading-relaxed">
                                        {step.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Extra Sections */}
                {extraSections && extraSections.map((section, idx) => {
                    if (idx % 2 === 0) {
                        // Dark Pro Tip Style
                        return (
                            <div key={idx} className="bg-gray-900 text-white rounded-3xl p-8 md:p-12 mb-16 relative overflow-hidden">
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-bold mb-4 text-white">Pro Tip: {section.title}</h3>
                                    <div className="prose prose-invert prose-lg max-w-2xl text-gray-300 leading-relaxed">
                                        {section.content}
                                    </div>
                                </div>
                                <div className="absolute top-[-50%] right-[-10%] w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>
                            </div>
                        );
                    } else {
                        // Left bordered Callout Style
                        return (
                            <div key={idx} className="mb-16 mt-12">
                                <h3 className="text-3xl font-bold text-gray-900 mb-6">{section.title}</h3>
                                <div className="border-l-4 border-indigo-500 pl-6 py-4 bg-indigo-50/50 rounded-r-xl">
                                    <div className="prose prose-indigo text-indigo-900 max-w-none">
                                        {section.content}
                                    </div>
                                </div>
                            </div>
                        );
                    }
                })}

                {/* FAQs */}
                {faqs.length > 0 && (
                    <div className="mt-20">
                        <h3 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h3>
                        <div className="space-y-4 mb-20">
                            {faqs.map((faq, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all hover:border-indigo-200 hover:shadow-md"
                                >
                                    <button
                                        onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                                        className="w-full flex items-center justify-between p-6 text-left"
                                        aria-expanded={expandedFaq === i}
                                    >
                                        <span className="text-lg font-bold text-gray-800">{faq.question}</span>
                                        <ChevronDown
                                            className={cn("text-gray-400 transition-transform duration-300", expandedFaq === i && "rotate-180 text-indigo-600")}
                                        />
                                    </button>
                                    <AnimatePresence>
                                        {expandedFaq === i && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-50 pt-4"
                                            >
                                                {faq.answer}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer simple mark */}
                <div className="mt-16 pt-10 border-t border-gray-100 text-center text-gray-400 text-sm font-medium">
                    <p>© {new Date().getFullYear()} Dopely Colors. Continuous Integration.</p>
                </div>
            </div>
        </section>
    );
};

