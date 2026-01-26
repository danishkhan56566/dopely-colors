'use client';

import {
    Users, Activity, Palette, Sparkles, Wand2, ArrowRight,
    TrendingUp, Star, Layout as LayoutIcon
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

                {/* Recent Activity Section */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Recent Activity</h3>
                        <Link href="/library" className="text-sm font-bold text-blue-600 hover:underline">View Library</Link>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="p-4 border-b border-gray-50 hover:bg-gray-50 flex items-center gap-4 transition-colors">
                                <div className="w-16 h-12 rounded-lg bg-gradient-to-r from-blue-400 to-purple-400"></div>
                                <div className="flex-1">
                                    <div className="font-bold text-gray-900 text-sm">Neon Cyberpunk V2</div>
                                    <div className="text-xs text-gray-400">Edited 2 hours ago • 5 Colors</div>
                                </div>
                                <button className="p-2 text-gray-400 hover:text-gray-900">
                                    <Star size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
}
