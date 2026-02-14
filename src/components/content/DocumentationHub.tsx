'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, BookOpen, Lightbulb, PlayCircle, MessageSquare, FileText, MonitorPlay, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQ {
    question: string;
    answer: string;
    category?: 'General' | 'Technical' | 'Usage' | 'Troubleshooting';
}

interface GuideSection {
    title: string;
    content: React.ReactNode;
    icon?: React.ElementType;
}

interface DocumentationHubProps {
    title: string;
    description: string;
    benefits: string[];
    howToSteps: { title: string; desc: string }[];
    faqs: FAQ[];
    videoPlaceholder?: string; // URL or boolean to show placeholder
}

export const DocumentationHub = ({
    title,
    description,
    benefits,
    howToSteps,
    faqs,
    videoPlaceholder = '/placeholder-video.jpg' // Default
}: DocumentationHubProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'guides' | 'faqs'>('guides');
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-full max-w-7xl mx-auto mt-20 p-6 md:p-10 bg-white/50 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[2.5rem] overflow-hidden">

            {/* Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-bold uppercase tracking-wider mb-4 border border-blue-100">
                    <BookOpen size={14} />
                    Documentation Hub
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                    Master the {title}
                </h2>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                    {description}
                </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex justify-center mb-10">
                <div className="bg-gray-100/50 p-1.5 rounded-2xl inline-flex relative">
                    <div className="absolute inset-0 bg-white/50 rounded-2xl shadow-sm opacity-0" />
                    {[
                        { id: 'guides', label: 'Quick Guides', icon: Lightbulb },
                        { id: 'faqs', label: 'Knowledge Base', icon: HelpCircle },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "relative px-8 py-3 rounded-xl flex items-center gap-2.5 font-bold transition-all duration-300",
                                activeTab === tab.id
                                    ? "bg-white text-blue-600 shadow-lg shadow-blue-500/10 scale-105"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                            )}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'guides' ? (
                    <motion.div
                        key="guides"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-12"
                    >
                        {/* Benefits Grid */}
                        <div className="grid md:grid-cols-3 gap-6">
                            {benefits.map((benefit, i) => (
                                <div key={i} className="bg-gradient-to-br from-white to-blue-50/30 p-8 rounded-3xl border border-blue-100/50 shadow-sm hover:shadow-md transition-all group">
                                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <SparklesIcon index={i} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">System Benefit {i + 1}</h3>
                                    <p className="text-gray-600 leading-relaxed font-medium">{benefit}</p>
                                </div>
                            ))}
                        </div>

                        {/* How-To & Video Section */}
                        <div className="grid lg:grid-cols-2 gap-8 items-start">
                            {/* Steps */}
                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                                <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                                    <FileText className="text-blue-500" />
                                    How to Use
                                </h3>
                                <div className="space-y-8">
                                    {howToSteps.map((step, i) => (
                                        <div key={i} className="flex gap-6 group">
                                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-50 border border-gray-200 text-gray-500 font-bold flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors">
                                                {i + 1}
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">{step.title}</h4>
                                                <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Video Placeholder */}
                            <div className="bg-gray-900 rounded-3xl overflow-hidden shadow-2xl relative aspect-video group cursor-pointer">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                                <div className="absolute inset-0 flex items-center justify-center z-20">
                                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <PlayCircle size={40} className="text-white fill-white/20" />
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                                    <div className="flex items-center gap-3 text-white/50 text-sm font-mono mb-2">
                                        <MonitorPlay size={14} />
                                        <span>VIDEO TUTORIAL</span>
                                        <span className="w-1 h-1 bg-white/50 rounded-full" />
                                        <span>02:45</span>
                                    </div>
                                    <h3 className="text-white text-2xl font-bold">Mastering {title} in 3 Minutes</h3>
                                </div>
                                {/* Placeholder Pattern */}
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-50 group-hover:opacity-60 transition-opacity" />
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="faqs"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="max-w-4xl mx-auto"
                    >
                        {/* Search */}
                        <div className="relative mb-10 group">
                            <div className="absolute inset-0 bg-blue-100 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                            <div className="relative bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex items-center px-6 py-4 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                                <Search className="text-gray-400 mr-4" size={24} />
                                <input
                                    type="text"
                                    placeholder="Search the knowledge base..."
                                    className="w-full text-lg outline-none text-gray-700 placeholder:text-gray-400 font-medium"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 border border-gray-100 rounded-md py-1">
                                    CMD + K
                                </div>
                            </div>
                        </div>

                        {/* FAQ List */}
                        <div className="space-y-4">
                            {filteredFaqs.length > 0 ? filteredFaqs.map((faq, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all hover:border-blue-200 hover:shadow-md"
                                >
                                    <button
                                        onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                                        className="w-full flex items-center justify-between p-6 text-left"
                                    >
                                        <span className="text-lg font-bold text-gray-800">{faq.question}</span>
                                        <ChevronDown
                                            className={cn("text-gray-400 transition-transform duration-300", expandedFaq === i && "rotate-180 text-blue-600")}
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
                            )) : (
                                <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                    <MessageSquare className="mx-auto text-gray-300 mb-4" size={48} />
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">No answers found</h3>
                                    <p className="text-gray-500">Try adjusting your search terms or browsing the guides.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer / Community */}
            <div className="mt-16 pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between text-gray-500 text-sm">
                <p>© 2026 Antigravity Systems. Updated weekly.</p>
                <div className="flex items-center gap-6 mt-4 md:mt-0">
                    <button className="hover:text-blue-600 transition-colors font-medium">Join Community</button>
                    <button className="hover:text-blue-600 transition-colors font-medium">Request Tutorial</button>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        System Normal
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper icon
const SparklesIcon = ({ index }: { index: number }) => {
    const icons = [Wand2, Lightbulb, MonitorPlay];
    const Icon = icons[index % icons.length];
    return <Icon size={24} />;
};

import { Wand2 } from 'lucide-react';
