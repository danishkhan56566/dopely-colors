'use client';

import { useRef } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataStoryGuide } from '@/components/content/UtilityGuides';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { BarChart3, PieChart, TrendingUp, ArrowDown } from 'lucide-react';
import Link from 'next/link';

const SECTIONS = [
    {
        id: 'intro',
        title: 'The Quarterly Report',
        subtitle: 'A story told in Blue & Gold',
        bg: '#0f172a',
        text: '#f8fafc',
        accent: '#3b82f6'
    },
    {
        id: 'growth',
        title: 'User Growth',
        subtitle: 'Explosive expansion in Q3',
        bg: '#1e3a8a',
        text: '#bfdbfe',
        accent: '#60a5fa'
    },
    {
        id: 'revenue',
        title: 'Revenue Streams',
        subtitle: 'Diversified income models',
        bg: '#172554',
        text: '#93c5fd',
        accent: '#2563eb'
    },
    {
        id: 'forecast',
        title: 'Future Outlook',
        subtitle: 'Projecting into 2027',
        bg: '#0B1120',
        text: '#ffffff',
        accent: '#fbbf24'
    }
];

function ChartSection({ section, index }: { section: typeof SECTIONS[0], index: number }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { margin: "-30% 0px -30% 0px" });

    return (
        <section
            ref={ref}
            className="h-screen flex items-center justify-center sticky top-0"
            style={{ backgroundColor: section.bg, color: section.text }}
        >
            <div className="max-w-4xl w-full p-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="text-sm font-bold uppercase tracking-widest mb-4 opacity-70" style={{ color: section.accent }}>
                        Chapter 0{index + 1}
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                        {section.title}
                    </h2>
                    <p className="text-xl opacity-80 leading-relaxed">
                        {section.subtitle}. Data visualization isn't just about numbers; it's about the feeling of progress.
                    </p>
                </motion.div>

                {/* Animated Viz */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative aspect-square"
                >
                    {/* Dynamic Graphic based on index */}
                    {index === 0 && (
                        <div className="w-full h-full rounded-full border-[20px] flex items-center justify-center p-12" style={{ borderColor: section.accent }}>
                            <div className="text-center">
                                <TrendingUp size={64} className="mx-auto mb-4" />
                                <div className="text-6xl font-bold">+127%</div>
                            </div>
                        </div>
                    )}

                    {index === 1 && (
                        <div className="w-full h-full flex items-end gap-4 p-8 bg-black/20 rounded-3xl backdrop-blur-sm">
                            {[40, 65, 30, 85, 55, 95].map((h, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={isInView ? { height: `${h}%` } : { height: 0 }}
                                    transition={{ duration: 1, delay: i * 0.1, type: 'spring' }}
                                    className="flex-1 rounded-t-lg opacity-90"
                                    style={{ backgroundColor: section.accent }}
                                />
                            ))}
                        </div>
                    )}

                    {index === 2 && (
                        <div className="w-full h-full relative p-8">
                            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                <motion.circle
                                    cx="50" cy="50" r="40"
                                    fill="transparent"
                                    stroke={section.accent}
                                    strokeWidth="20"
                                    strokeDasharray="251.2"
                                    initial={{ strokeDashoffset: 251.2 }}
                                    animate={isInView ? { strokeDashoffset: 50 } : { strokeDashoffset: 251.2 }}
                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                />
                                <motion.circle
                                    cx="50" cy="50" r="40"
                                    fill="transparent"
                                    stroke="#ffffff"
                                    strokeWidth="20"
                                    strokeDasharray="251.2"
                                    strokeDashoffset="200" // Static part
                                    className="opacity-20"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold">
                                82%
                            </div>
                        </div>
                    )}

                    {index === 3 && (
                        <div className="w-full h-full grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                                    transition={{ delay: i * 0.2 }}
                                    className="rounded-3xl flex items-center justify-center text-2xl font-bold text-black"
                                    style={{ backgroundColor: i === 3 ? section.accent : 'rgba(255,255,255,0.1)', color: i === 3 ? 'black' : 'white' }}
                                >
                                    {2024 + i}
                                </motion.div>
                            ))}
                        </div>
                    )}

                </motion.div>

            </div>
        </section>
    );
}

export default function DataStoryPage() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <DashboardLayout>
            <div className="bg-black min-h-screen">

                {/* Progress Bar */}
                <motion.div
                    className="fixed top-0 left-0 right-0 h-2 bg-blue-500 origin-left z-50"
                    style={{ scaleX }}
                />

                <div className="relative">
                    {SECTIONS.map((section, index) => (
                        <ChartSection key={section.id} section={section} index={index} />
                    ))}
                </div>

                {/* Footer/CTA */}
                <section className="h-[50vh] bg-black flex flex-col items-center justify-center text-white p-10 text-center">
                    <h2 className="text-4xl font-bold mb-6">Tell Your Story</h2>
                    <p className="text-gray-400 max-w-lg mb-8">
                        Color helps data speak. Use our tools to ensure your message is heard, felt, and understood.
                    </p>
                    <Link href="/generate">
                        <button className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-transform">
                            Start Creating
                        </button>
                    </Link>
                </section>

                <DataStoryGuide />
            </div>
        </DashboardLayout>
    );
}
