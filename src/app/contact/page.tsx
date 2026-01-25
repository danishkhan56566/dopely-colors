'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Mail, MessageCircle, Twitter, Loader2, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { submitContactForm } from './actions';

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const result = await submitContactForm(formData);

        if (result.success) {
            toast.success('Message sent successfully!', {
                description: "We'll get back to you as soon as possible."
            });
            (e.target as HTMLFormElement).reset();
        } else {
            toast.error('Failed to send message', {
                description: result.error
            });
        }

        setIsSubmitting(false);
    };

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto px-6 py-12 md:py-24 grid md:grid-cols-2 gap-12 lg:gap-24">

                {/* Left: Info */}
                <div>
                    <h1 className="text-4xl font-bold mb-6">Get in touch</h1>
                    <p className="text-xl text-gray-500 mb-12">
                        Have a question or just want to say hi? We'd love to hear from you.
                    </p>

                    <div className="space-y-8">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                                <MessageCircle size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Chat Support</h3>
                                <p className="text-gray-500">Our team is available Mon-Fri 9am-5pm EST.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Email Us</h3>
                                <p className="text-gray-500">Support@dopelycolors.com</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-sky-50 text-sky-500 rounded-xl flex items-center justify-center shrink-0">
                                <Twitter size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Twitter</h3>
                                <p className="text-gray-500">@DopleyColors</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Form */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-900">First name</label>
                                <input name="firstName" type="text" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Jane" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-900">Last name</label>
                                <input name="lastName" type="text" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Doe" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-900">Email <span className="text-red-500">*</span></label>
                            <input name="email" type="email" required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="you@example.com" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-900">Message <span className="text-red-500">*</span></label>
                            <textarea name="message" required rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="How can we help?"></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={18} />}
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>

            </div>
        </DashboardLayout>
    );
}
