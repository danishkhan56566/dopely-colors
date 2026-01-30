'use client';

import {
    Users, Activity, Palette, Sparkles, Wand2, ArrowRight,
    TrendingUp, Star, Layout as LayoutIcon, Image as ImageIcon, Eye
} from 'lucide-react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function DashboardHome() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        };
        getUser();
    }, []);

    const displayName = user?.email?.split('@')[0] || 'Designer';

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Welcome Section */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {loading ? 'Welcome back...' : `Welcome back, ${displayName}`}
                    </h1>
                    <p className="text-gray-500 mt-1">Here's what's happening with your palettes today.</p>
                </div>

                {/* Usage Stats (Free vs Pro) */}
                <div className="grid md:grid-cols-4 gap-4">
                    <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <Palette size={20} />
                            </div>
                            <span className="text-sm font-bold text-gray-500">Palettes</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">12</div>
                        <div className="text-xs text-gray-400 mt-1">Limited plan (Max 50)</div>
                    </div>
                    <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                <Sparkles size={20} />
                            </div>
                            <span className="text-sm font-bold text-gray-500">AI Credits</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900">8/10</div>
                        <div className="text-xs text-gray-400 mt-1">Resets in 2 days</div>
                    </div>

                    {/* Upgrade Banner */}
                    <div className="md:col-span-2 p-6 bg-black text-white rounded-2xl shadow-xl flex items-center justify-between relative overflow-hidden group">
                        <div className="absolute inset-0 bg-rainbow opacity-20 group-hover:opacity-30 transition-opacity"></div>
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold">Go Unlimited Pro</h3>
                            <p className="text-sm text-gray-300 mt-1">Remove limits on AI and Export.</p>
                        </div>
                        <Link href="/pricing" className="relative z-10 px-5 py-2.5 bg-white text-black font-bold rounded-xl text-sm hover:scale-105 transition-transform flex items-center gap-2">
                            Upgrade <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>

                {/* Quick Actions */}
                <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Create New</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <Link
                            href="/generate"
                            className="p-6 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all group"
                        >
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Wand2 size={24} />
                            </div>
                            <h4 className="font-bold text-gray-900 mb-1">Visual Palette</h4>
                            <p className="text-sm text-gray-500">Manually tweak and visualize colors on real UIs.</p>
                        </Link>
                        <Link
                            href="/ai"
                            className="p-6 bg-white rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all group"
                        >
                            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Sparkles size={24} />
                            </div>
                            <h4 className="font-bold text-gray-900 mb-1">AI Generator</h4>
                            <p className="text-sm text-gray-500">Generate palettes from text prompts and moods.</p>
                        </Link>
                        <Link
                            href="/design-system"
                            className="p-6 bg-white rounded-2xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all group"
                        >
                            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <LayoutIcon size={24} />
                            </div>
                            <h4 className="font-bold text-gray-900 mb-1">Design System</h4>
                            <p className="text-sm text-gray-500">Build a full token system with typography.</p>
                        </Link>
                    </div>
                </div>

                {/* Explore More Tools */}
                <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Explore Tools</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Link href="/image" className="group relative overflow-hidden rounded-2xl h-40 flex items-end p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-orange-50 group-hover:scale-105 transition-transform duration-500"></div>
                            <div className="relative z-10 w-full">
                                <div className="p-2 bg-white/80 backdrop-blur-sm rounded-lg w-fit mb-3 shadow-sm">
                                    <ImageIcon size={20} className="text-pink-500" />
                                </div>
                                <h4 className="font-bold text-gray-900">Extract from Image</h4>
                                <p className="text-xs text-gray-500 mt-1">Get colors from your photos instantly.</p>
                            </div>
                        </Link>
                        <Link href="/contrast" className="group relative overflow-hidden rounded-2xl h-40 flex items-end p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 group-hover:scale-105 transition-transform duration-500"></div>
                            <div className="relative z-10 w-full">
                                <div className="p-2 bg-white/80 backdrop-blur-sm rounded-lg w-fit mb-3 shadow-sm">
                                    <Eye size={20} className="text-blue-500" />
                                </div>
                                <h4 className="font-bold text-gray-900">Contrast Checker</h4>
                                <p className="text-xs text-gray-500 mt-1">Ensure accessibility and readability.</p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Pro Inspiration Banner */}
                <div className="p-8 rounded-3xl bg-gray-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold flex items-center gap-2">
                            Need inspiration? <Sparkles size={20} className="text-yellow-400" />
                        </h3>
                        <p className="text-gray-400 mt-2 max-w-md">Browse thousands of community-made palettes and trending color combinations.</p>
                    </div>
                    <Link href="/explore" className="relative z-10 px-8 py-4 bg-white text-black font-bold rounded-2xl hover:scale-105 transition-transform flex items-center gap-2 whitespace-nowrap">
                        Explore Popular <ArrowRight size={18} />
                    </Link>
                </div>

            </div>
        </DashboardLayout>
    );
}
