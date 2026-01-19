'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Check, X, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
        };
        checkUser();
    }, []);

    const handleUpgrade = async () => {
        if (!user) {
            router.push('/login');
            return;
        }

        setLoading(true);
        try {
            // Simulate payment processing delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            const { error } = await supabase
                .from('profiles')
                .update({
                    is_pro: true,
                    subscription_tier: 'pro'
                })
                .eq('id', user.id);

            if (error) throw error;

            toast.success("Welcome to Pro!", {
                description: "Your subscription has been activated successfully."
            });
            router.push('/dashboard');
            router.refresh();
        } catch (error: any) {
            console.error('Upgrade Error:', error);
            toast.error("Upgrade failed", {
                description: error.message || "Could not update subscription."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="py-24 sm:py-32 bg-white">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl sm:text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Simple, transparent pricing</h2>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            Start for free, upgrade for power. No hidden fees.
                        </p>
                    </div>

                    <div className="mt-16 flow-root">
                        <div className="isolate -mt-16 grid max-w-sm grid-cols-1 gap-y-16 divide-y divide-gray-100 sm:mx-auto lg:-mx-8 lg:mt-0 lg:max-w-none lg:grid-cols-3 lg:divide-x lg:divide-y-0 xl:-mx-4 bg-white rounded-3xl ring-1 ring-gray-200 shadow-xl overflow-hidden">
                            {/* Free */}
                            <div className="pt-16 lg:px-8 lg:pt-0 xl:px-14 text-center pb-8">
                                <h3 className="text-base font-semibold leading-7 text-gray-900 pt-8">Free</h3>
                                <p className="mt-6 flex items-baseline gap-x-1 justify-center">
                                    <span className="text-5xl font-bold tracking-tight text-gray-900">$0</span>
                                    <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>
                                </p>
                                <p className="mt-3 text-sm leading-6 text-gray-500">Perfect for hobbyists.</p>

                                <ul className="mt-8 space-y-4 text-sm leading-6 text-gray-600 text-left px-8">
                                    <li className="flex gap-x-3"><Check className="text-blue-600 flex-none" size={16} /> Unlimited Palettes</li>
                                    <li className="flex gap-x-3"><Check className="text-blue-600 flex-none" size={16} /> Basic Export (CSS, PNG)</li>
                                    <li className="flex gap-x-3"><Check className="text-blue-600 flex-none" size={16} /> 5 Favorites</li>
                                </ul>

                                <Link href="/login" className="mt-10 block w-full rounded-md bg-white px-3 py-2 text-center text-sm font-semibold text-blue-600 shadow-sm ring-1 ring-inset ring-blue-200 hover:ring-blue-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all">
                                    Get Started
                                </Link>
                            </div>

                            {/* Pro */}
                            <div className="pt-16 lg:px-8 lg:pt-0 xl:px-14 text-center pb-8 bg-gray-50/50 relative">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-b-lg shadow-sm">
                                    MOST POPULAR
                                </div>
                                <h3 className="text-base font-semibold leading-7 text-blue-600 pt-8">Pro</h3>
                                <p className="mt-6 flex items-baseline gap-x-1 justify-center">
                                    <span className="text-5xl font-bold tracking-tight text-gray-900">$12</span>
                                    <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>
                                </p>
                                <p className="mt-3 text-sm leading-6 text-gray-500">For serious designers.</p>

                                <ul className="mt-8 space-y-4 text-sm leading-6 text-gray-600 text-left px-8">
                                    <li className="flex gap-x-3"><Check className="text-blue-600 flex-none" size={16} /> Everything in Free</li>
                                    <li className="flex gap-x-3"><Check className="text-blue-600 flex-none" size={16} /> Advanced Export (Tailwind, JSON)</li>
                                    <li className="flex gap-x-3"><Check className="text-blue-600 flex-none" size={16} /> Unlimited Favorites</li>
                                    <li className="flex gap-x-3"><Check className="text-blue-600 flex-none" size={16} /> Project Management</li>
                                    <li className="flex gap-x-3"><Check className="text-blue-600 flex-none" size={16} /> 4K Export Quality</li>
                                </ul>

                                <button
                                    onClick={handleUpgrade}
                                    disabled={loading}
                                    className="mt-10 w-full rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all flex items-center justify-center gap-2 group"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={16} /> Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={16} className="fill-white/20" /> Start 14-Day Trial
                                        </>
                                    )}
                                </button>
                                <p className="mt-2 text-xs text-gray-400">No credit card required for demo</p>
                            </div>

                            {/* Team */}
                            <div className="pt-16 lg:px-8 lg:pt-0 xl:px-14 text-center pb-8">
                                <h3 className="text-base font-semibold leading-7 text-purple-600 pt-8">Team</h3>
                                <p className="mt-6 flex items-baseline gap-x-1 justify-center">
                                    <span className="text-5xl font-bold tracking-tight text-gray-900">$49</span>
                                    <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>
                                </p>
                                <p className="mt-3 text-sm leading-6 text-gray-500">For agencies & startups.</p>

                                <ul className="mt-8 space-y-4 text-sm leading-6 text-gray-600 text-left px-8">
                                    <li className="flex gap-x-3"><Check className="text-purple-600 flex-none" size={16} /> Everything in Pro</li>
                                    <li className="flex gap-x-3"><Check className="text-purple-600 flex-none" size={16} /> 5 Team Seats</li>
                                    <li className="flex gap-x-3"><Check className="text-purple-600 flex-none" size={16} /> Shared Libraries</li>
                                    <li className="flex gap-x-3"><Check className="text-purple-600 flex-none" size={16} /> SSO Authentication</li>
                                </ul>

                                <a href="#" className="mt-10 block w-full rounded-md bg-white px-3 py-2 text-center text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 hover:ring-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 transition-all">
                                    Contact Sales
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
