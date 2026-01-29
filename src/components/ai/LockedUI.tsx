'use client';

import { motion } from 'framer-motion';
import { Sparkles, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export function LockedUI() {
    return (
        <DashboardLayout>
            <div className="min-h-screen bg-neutral-50 p-4 md:p-8 flex items-center justify-center">
                <div className="max-w-2xl w-full">
                    {/* Premium Locked UI */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 relative"
                    >
                        {/* Pro Badge */}
                        <div className="absolute top-6 right-6 z-10">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-900 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg">
                                <Sparkles size={12} className="text-yellow-400 fill-yellow-400" />
                                Pro Feature
                            </span>
                        </div>

                        <div className="p-12 md:p-16 text-center space-y-8 relative z-0">
                            {/* Visual Icon */}
                            <div className="w-24 h-24 bg-gradient-to-tr from-violet-100 to-fuchsia-100 rounded-3xl mx-auto flex items-center justify-center mb-6 relative group">
                                <div className="absolute inset-0 bg-white/50 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                <Lock size={48} className="text-violet-600 relative z-10" strokeWidth={1.5} />
                            </div>

                            <div className="space-y-4">
                                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-[1.1]">
                                    Unlock the <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">AI Generator</span>
                                </h1>
                                <p className="text-lg text-gray-500 max-w-lg mx-auto leading-relaxed">
                                    Sign in to generate unlimited production-ready color systems, export to Figma, and sync your palettes to the cloud.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                                <Link href="/login?next=/ai" className="w-full sm:w-auto">
                                    <button className="w-full sm:w-auto px-8 py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group">
                                        Sign In to Continue
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </Link>
                                <Link href="/tools" className="w-full sm:w-auto">
                                    <button className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-gray-100 text-gray-600 hover:text-gray-900 hover:border-gray-200 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all">
                                        Explore Free Tools
                                    </button>
                                </Link>
                            </div>

                            <p className="text-xs text-gray-400 mt-8 font-medium">
                                No credit card required for free account.
                            </p>
                        </div>

                        {/* Decorative Background */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500" />
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl" />
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-fuchsia-500/5 rounded-full blur-3xl" />
                    </motion.div>
                </div>
            </div>
        </DashboardLayout>
    );
}
