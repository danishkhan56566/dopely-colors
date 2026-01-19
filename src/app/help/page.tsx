'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-gray-100 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-6 text-left group"
            >
                <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{question}</span>
                {isOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
            </button>
            <div className={clsx("overflow-hidden transition-all duration-300 ease-in-out text-gray-600", isOpen ? "max-h-96 pb-6" : "max-h-0")}>
                {answer}
            </div>
        </div>
    );
};

export default function HelpPage() {
    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto px-6 py-12 md:py-24">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold mb-4">How can we help?</h1>
                    <div className="relative max-w-lg mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-2">
                        <FAQItem
                            question="Is Dopley Colors free?"
                            answer="Yes! We have a generous free tier that includes unlimited palette generation and basic exports. Our Pro tier offers advanced features like Team Libraries and Tailwind Exports."
                        />
                        <FAQItem
                            question="How do I use the generated colors in CSS?"
                            answer="You can export your palette directly to CSS variables, Tailwind config, or SASS/SCSS. Just click the 'Export' button in the toolbar."
                        />
                        <FAQItem
                            question="Can I restore a previous palette?"
                            answer="Yes, as long as you haven't closed the tab, you can use the Undo/Redo buttons. Logged-in users can also save palettes to their Favorites to access them later."
                        />
                        <FAQItem
                            question="What do the accessibility scores mean?"
                            answer="We use the WCAG 2.1 standard to calculate contrast ratios. AA is the minimum standard for readable text, while AAA is the gold standard for high contrast."
                        />
                        <FAQItem
                            question="Does Dopley support CMYK?"
                            answer="Yes, our Color Picker supports CMYK input and conversion, though the web visualizer primarily operates in RGB/HCL color spaces."
                        />
                    </div>
                </div>

                <div className="mt-12 text-center text-gray-500">
                    Still need help? <a href="/contact" className="text-blue-600 font-semibold hover:underline">Contact Support</a>
                </div>
            </div>
        </DashboardLayout>
    );
}
