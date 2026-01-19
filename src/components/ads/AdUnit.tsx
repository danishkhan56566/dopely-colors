'use client';

import { useEffect, useRef } from 'react';

interface AdUnitProps {
    slotId: string;
    format?: 'auto' | 'fluid' | 'rectangle';
    className?: string;
    label?: string;
}

export const AdUnit = ({ slotId, format = 'auto', className, label = 'ADVERTISEMENT' }: AdUnitProps) => {
    const adRef = useRef<HTMLModElement>(null);

    // Initial load logic would go here (pushing to window.adsbygoogle)
    useEffect(() => {
        try {
            // @ts-ignore
            if (typeof window !== 'undefined' && window.adsbygoogle) {
                // @ts-ignore
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
        } catch (err) {
            console.error('AdSense error', err);
        }
    }, [slotId]);

    // In development or if not approved yet, show a placeholder
    const isDev = process.env.NODE_ENV === 'development';

    if (isDev) {
        return (
            <div className={`flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-4 text-gray-400 font-mono text-xs ${className}`}>
                {label} (SLOT: {slotId})
            </div>
        );
    }

    return (
        <div className={`overflow-hidden ${className}`}>
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-XXXXXXXXXXXXXXX" // Replace with real ID
                data-ad-slot={slotId}
                data-ad-format={format}
                data-full-width-responsive="true"
            />
        </div>
    );
};
