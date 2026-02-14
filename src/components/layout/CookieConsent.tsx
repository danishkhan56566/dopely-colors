'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            // Show after a small delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const accept = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 z-50 animate-in slide-in-from-bottom-10 duration-500">
            <div className="max-w-4xl mx-auto bg-gray-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-white/10 p-5 md:p-6 flex flex-col md:flex-row items-center gap-5 md:gap-8">
                <div className="flex-1 text-center md:text-left">
                    <h3 className="font-bold text-lg mb-1">We value your privacy</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                        We use cookies to enhance your experience, analyze site traffic, and serve relevant advertisements via Google AdSense.
                        By continuing, you agree to our <Link href="/cookie-policy" className="underline hover:text-white">Cookie Policy</Link>.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={accept}
                        className="px-6 py-2.5 bg-white text-gray-900 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors shadow-lg active:scale-95"
                    >
                        Accept All
                    </button>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="p-2.5 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}
