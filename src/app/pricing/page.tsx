'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Check, X, Loader2, Sparkles, Building, Zap, Rocket, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

// FAQ Data
const FAQS = [
    {
        q: "Can I cancel my subscription at any time?",
        a: "Yes, absolutely. You can cancel your subscription from your account settings at any time. You'll keep access until the end of your billing period."
    },
    {
        q: "What happens to my palettes if I downgrade?",
        a: "You will keep access to all your existing palettes. However, you won't be able to edit Pro-exclusive features (like advanced tokens) until you resubscribe."
    },
    {
        q: "Is there a student discount available?",
        a: "Yes! We offer 50% off for students and non-profits. Contact our support team with your credentials to get verified."
    },
    {
        q: "How does the 'Team' plan work?",
        a: "The Team plan gives you a shared workspace where you can collaborate on palettes and design systems in real-time. It includes 5 seats by default."
    }
];

export default function PricingPage() {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setUser(session?.user ?? null);
            } catch (error) {
                // Ignore AbortError which can happen during rapid navigation or strict mode
                if (error instanceof Error && error.name === 'AbortError') return;
                console.error('Session check error:', error);
            }
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
            <div className="relative min-h-screen bg-[#FBFBFB] overflow-hidden">
                {/* Immersive Background Blobs */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-200/20 rounded-full blur-[120px] mix-blend-multiply animate-blob" />
                    <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-purple-200/20 rounded-full blur-[120px] mix-blend-multiply animate-blob animation-delay-2000" />
                    <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-pink-200/20 rounded-full blur-[120px] mix-blend-multiply animate-blob animation-delay-4000" />
                </div>

                <div className="relative z-10 py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        {/* Header */}
                        <div className="mx-auto max-w-2xl text-center mb-16">
                            <h2 className="text-base font-semibold leading-7 text-blue-600 uppercase tracking-widest">Pricing</h2>
                            <p className="mt-2 text-4xl font-black tracking-tight text-gray-900 sm:text-6xl text-balance">
                                Unlock your full <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600">
                                    creative potential
                                </span>
                            </p>
                            <p className="mt-6 text-lg leading-8 text-gray-600">
                                Choose the perfect plan for your workflow. <br /> From solo creators to enterprise teams.
                            </p>

                            {/* Toggle */}
                            <div className="mt-10 flex justify-center">
                                <div className="relative flex bg-gray-100 p-1 rounded-full cursor-pointer" onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}>
                                    <div className={clsx(
                                        "absolute top-1 bottom-1 w-[50%] bg-white rounded-full shadow-sm transition-all duration-300 ease-spring",
                                        billingCycle === 'monthly' ? "left-1" : "left-[49%]"
                                    )} />
                                    <button className={clsx("relative z-10 px-6 py-2 text-sm font-bold transition-colors w-32", billingCycle === 'monthly' ? "text-gray-900" : "text-gray-500")}>
                                        Monthly
                                    </button>
                                    <button className={clsx("relative z-10 px-6 py-2 text-sm font-bold transition-colors w-32", billingCycle === 'yearly' ? "text-gray-900" : "text-gray-500")}>
                                        Yearly
                                    </button>
                                </div>
                                <div className="ml-4 flex items-center">
                                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700 ring-1 ring-inset ring-green-600/20 animate-pulse">
                                        Save 20%
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Pricing Cards */}
                        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">

                            {/* Free Plan */}
                            <div className="rounded-[2.5rem] p-8 ring-1 ring-gray-200 bg-white/60 backdrop-blur-xl hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                                <div className="flex items-center justify-between gap-x-4">
                                    <h3 className="text-lg font-bold leading-8 text-gray-900">Hobby</h3>
                                    <div className="rounded-full bg-gray-100 p-2.5">
                                        <Rocket className="h-5 w-5 text-gray-600" />
                                    </div>
                                </div>
                                <p className="mt-4 text-sm leading-6 text-gray-600">Perfect for trying out Dopely Colors.</p>
                                <p className="mt-6 flex items-baseline gap-x-1">
                                    <span className="text-4xl font-bold tracking-tight text-gray-900">$0</span>
                                    <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>
                                </p>
                                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                                    <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-blue-600" /> 1 Project</li>
                                    <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-blue-600" /> Basic Palettes</li>
                                    <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-blue-600" /> CSS Export</li>
                                    <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-blue-600" /> 5 Favorites</li>
                                </ul>
                                <Link
                                    href="/login"
                                    className="mt-8 block rounded-xl bg-gray-50 px-3 py-3 text-center text-sm font-bold text-gray-900 shadow-sm hover:bg-gray-100 ring-1 ring-inset ring-gray-200 transition-all"
                                >
                                    Get Started
                                </Link>
                            </div>

                            {/* Pro Plan */}
                            <div className="relative rounded-[2.5rem] p-8 ring-2 ring-blue-600 bg-white shadow-2xl shadow-blue-900/10 scale-105 z-10">
                                <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-3 py-1 text-center text-xs font-bold text-white shadow-lg">
                                    MOST POPULAR
                                </div>
                                <div className="flex items-center justify-between gap-x-4">
                                    <h3 className="text-lg font-bold leading-8 text-blue-600">Pro</h3>
                                    <div className="rounded-full bg-blue-50 p-2.5">
                                        <Zap className="h-5 w-5 text-blue-600" />
                                    </div>
                                </div>
                                <p className="mt-4 text-sm leading-6 text-gray-600">For serious designers & freelancers.</p>
                                <p className="mt-6 flex items-baseline gap-x-1">
                                    <span className="text-4xl font-bold tracking-tight text-gray-900">
                                        ${billingCycle === 'yearly' ? '12' : '15'}
                                    </span>
                                    <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Billed {billingCycle === 'yearly' ? '$144 yearly' : 'monthly'}
                                </p>

                                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                                    <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-blue-600" /> <strong>Unlimited</strong> Projects</li>
                                    <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-blue-600" /> AI Palette Generator</li>
                                    <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-blue-600" /> Advanced Export (Tailwind, JSON)</li>
                                    <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-blue-600" /> Contrast Checker & Accessibility</li>
                                    <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-blue-600" /> Priority Support</li>
                                </ul>
                                <button
                                    onClick={handleUpgrade}
                                    disabled={loading}
                                    className="mt-8 w-full rounded-xl bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600 bg-[length:200%_auto] animate-gradient px-3 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} className="fill-white/20" />}
                                    Start 14-Day Free Trial
                                </button>
                                <p className="mt-3 text-xs text-center text-gray-400">Cancel anytime. No questions asked.</p>
                            </div>

                            {/* Team Plan */}
                            <div className="rounded-[2.5rem] p-8 ring-1 ring-gray-200 bg-white/60 backdrop-blur-xl hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                                <div className="flex items-center justify-between gap-x-4">
                                    <h3 className="text-lg font-bold leading-8 text-gray-900">Team</h3>
                                    <div className="rounded-full bg-purple-50 p-2.5">
                                        <Building className="h-5 w-5 text-purple-600" />
                                    </div>
                                </div>
                                <p className="mt-4 text-sm leading-6 text-gray-600">For agencies scaling up design.</p>
                                <p className="mt-6 flex items-baseline gap-x-1">
                                    <span className="text-4xl font-bold tracking-tight text-gray-900">
                                        ${billingCycle === 'yearly' ? '49' : '59'}
                                    </span>
                                    <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Billed {billingCycle === 'yearly' ? '$588 yearly' : 'monthly'}
                                </p>

                                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                                    <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-purple-600" /> Everything in Pro</li>
                                    <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-purple-600" /> 5 Team Seats</li>
                                    <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-purple-600" /> Shared Design Libraries</li>
                                    <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-purple-600" /> SSO Authentication</li>
                                    <li className="flex gap-x-3"><Check className="h-6 w-5 flex-none text-purple-600" /> Dedicated Success Manager</li>
                                </ul>
                                <a
                                    href="#"
                                    className="mt-8 block rounded-xl bg-gray-50 px-3 py-3 text-center text-sm font-bold text-gray-900 shadow-sm hover:bg-gray-100 ring-1 ring-inset ring-gray-200 transition-all"
                                >
                                    Contact Sales
                                </a>
                            </div>
                        </div>

                        {/* Comparison Table */}
                        <div className="mt-32 max-w-5xl mx-auto">
                            <h3 className="text-2xl font-bold text-center mb-12">Compare Plans</h3>

                            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white/80 backdrop-blur shadow-sm">
                                <table className="w-full text-left text-sm text-gray-600">
                                    <thead className="bg-gray-50/50">
                                        <tr>
                                            <th className="px-6 py-4 font-bold text-gray-900">Feature</th>
                                            <th className="px-6 py-4 font-bold text-center w-1/4">Free</th>
                                            <th className="px-6 py-4 font-bold text-center text-blue-600 w-1/4 bg-blue-50/30">Pro</th>
                                            <th className="px-6 py-4 font-bold text-center w-1/4">Team</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {[
                                            { name: 'Palettes', free: 'Unlimited', pro: 'Unlimited', team: 'Unlimited' },
                                            { name: 'Export Formats', free: 'CSS, PNG', pro: 'Tailwind, JSON, SCSS', team: 'All Formats' },
                                            { name: 'AI Generation', free: '5 / month', pro: 'Unlimited', team: 'Unlimited' },
                                            { name: 'Design Systems', free: <X className="mx-auto text-gray-300" size={18} />, pro: '1 System', team: 'Unlimited' },
                                            { name: 'Contrast Checker', free: 'Basic', pro: 'Advanced AAA', team: 'Advanced AAA' },
                                            { name: 'Team Collaboration', free: <X className="mx-auto text-gray-300" size={18} />, pro: <X className="mx-auto text-gray-300" size={18} />, team: 'Included' },
                                        ].map((row, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-gray-900">{row.name}</td>
                                                <td className="px-6 py-4 text-center">{row.free}</td>
                                                <td className="px-6 py-4 text-center font-bold text-gray-900 bg-blue-50/10">{row.pro}</td>
                                                <td className="px-6 py-4 text-center">{row.team}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* FAQ */}
                        <div className="mt-32 max-w-3xl mx-auto">
                            <h3 className="text-2xl font-bold text-center mb-12">Frequently Asked Questions</h3>

                            <div className="space-y-4">
                                {FAQS.map((faq, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-all"
                                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    >
                                        <div className="p-6 flex items-center justify-between">
                                            <h4 className="font-bold text-gray-900">{faq.q}</h4>
                                            {openFaq === idx ? <ChevronUp className="text-blue-500" /> : <ChevronDown className="text-gray-400" />}
                                        </div>
                                        <AnimatePresence>
                                            {openFaq === idx && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-6 pb-6 text-gray-600 leading-relaxed text-sm">
                                                        {faq.a}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom CTA */}
                        <div className="mt-32 mb-16 rounded-[3rem] bg-gray-900 text-center py-16 px-6 relative overflow-hidden text-white">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px]" />

                            <h2 className="text-3xl font-black mb-6 relative z-10">Start your creative journey today</h2>
                            <p className="text-gray-400 max-w-md mx-auto mb-8 text-lg relative z-10">
                                Join 10,000+ designers building better products with Dopely.
                            </p>
                            <Link href="/login" className="relative z-10 inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors">
                                Get Started for Free
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
