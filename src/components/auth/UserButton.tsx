'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Settings, LogOut, ChevronDown, LayoutDashboard, Crown, Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const UserButton = () => {
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);

            if (session?.user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();
                setProfile(data);
            }
            setLoading(false);
        };

        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();
                setProfile(data);
            } else {
                setProfile(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    if (loading) return null; // Or a skeleton

    if (!user) {
        return (
            <Link
                href="/login"
                className="px-5 py-2 rounded-xl bg-black text-white font-bold text-sm hover:bg-gray-800 transition-all shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
            >
                Log In
            </Link>
        );
    }

    const initials = user.email?.slice(0, 2).toUpperCase() || 'US';
    const isPro = profile?.is_pro === true;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-1 pr-3 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors bg-white shadow-sm"
            >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold border-2 border-white ring-1 ring-gray-100">
                    {initials}
                </div>
                {isPro && <Crown size={14} className="text-yellow-500 fill-yellow-500" />}
                <ChevronDown size={14} className="text-gray-400" />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20 py-2 animate-in fade-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-gray-50 mb-1 bg-gray-50/50">
                            <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                            <div className="flex items-center gap-1.5 mt-1">
                                {isPro ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-100 to-yellow-50 text-[10px] font-bold text-yellow-700 border border-yellow-200">
                                        <Crown size={10} className="fill-yellow-600" /> PRO PLAN
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-[10px] font-bold text-gray-500 border border-gray-200">
                                        FREE PLAN
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Pro Actions */}
                        {isPro ? (
                            <div className="px-2 py-1">
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-white bg-black rounded-lg hover:bg-gray-800 transition-colors mb-1"
                                >
                                    <LayoutDashboard size={16} /> Go to Dashboard
                                </Link>
                            </div>
                        ) : (
                            <div className="px-2 py-1">
                                <Link
                                    href="/pricing"
                                    className="w-full flex items-center justify-between gap-3 px-3 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-lg hover:brightness-110 transition-all shadow-md group"
                                >
                                    <div className="flex items-center gap-2">
                                        <Sparkles size={16} className="fill-white/20" /> Upgrade to Pro
                                    </div>
                                </Link>
                            </div>
                        )}

                        <div className="h-px bg-gray-100 my-1 mx-2" />

                        {/* Menu Items */}
                        <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium">
                            <User size={16} className="text-gray-400" /> My Profile
                        </Link>
                        <Link href="/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium">
                            <Settings size={16} className="text-gray-400" /> Settings
                        </Link>

                        <div className="h-px bg-gray-100 my-1 mx-2" />

                        <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                        >
                            <LogOut size={16} /> Sign Out
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

