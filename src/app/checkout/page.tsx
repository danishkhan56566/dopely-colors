'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ArrowLeft, CreditCard, Lock, Check } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

export default function CheckoutPage() {
    const searchParams = useSearchParams();
    const plan = searchParams.get('plan') || 'pro';
    const router = useRouter();

    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handlePay = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            setTimeout(() => {
                router.push('/dashboard?pro=true');
            }, 2000);
        }, 1500);
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8">

                    {/* Order Summary */}
                    <div className="bg-gray-900 text-white p-8 rounded-3xl flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-rainbow blur-[100px] opacity-20 pointer-events-none" />

                        <div>
                            <Link href="/pricing" className="text-gray-400 hover:text-white flex items-center gap-2 mb-8 transition-colors">
                                <ArrowLeft size={16} /> Back
                            </Link>

                            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Order Summary</h2>
                            <div className="text-4xl font-bold mb-1">Dopely Pro</div>
                            <div className="text-xl text-gray-400 mb-8">Monthly Subscription</div>

                            <div className="text-5xl font-bold mb-4">$12<span className="text-lg text-gray-500 font-normal">/mo</span></div>

                            <ul className="space-y-3 mb-8">
                                {['Unlimited Exports', 'AI Generation', 'Private Palettes', 'Team Collaboration', 'Priority Support'].map(feature => (
                                    <li key={feature} className="flex items-center gap-3 text-gray-300">
                                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                                            <Check size={12} className="text-white" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="text-sm text-gray-500">
                            Billed monthly. Cancel anytime.<br />
                            30-day money-back guarantee.
                        </div>
                    </div>

                    {/* Payment Form */}
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
                            <div className="flex gap-2 text-gray-400">
                                <CreditCard size={24} />
                                <Lock size={24} />
                            </div>
                        </div>

                        {isSuccess ? (
                            <div className="h-64 flex flex-col items-center justify-center text-center animate-fade-in">
                                <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4">
                                    <Check size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
                                <p className="text-gray-500">Redirecting to dashboard...</p>
                            </div>
                        ) : (
                            <form onSubmit={handlePay} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="John Doe"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="0000 0000 0000 0000"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="MM / YY"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="123"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className={clsx(
                                        "w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2",
                                        isProcessing ? "bg-gray-400 cursor-not-allowed" : "bg-rainbow hover:brightness-110 shadow-xl hover:shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98]"
                                    )}
                                >
                                    {isProcessing ? 'Processing...' : `Pay $12.00`}
                                </button>

                                <div className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                                    <Lock size={12} />
                                    Payments range secured by Stripe
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
