import React from 'react';

type AdUnitProps = {
    slotId?: string;
    format?: 'auto' | 'rectangle' | 'horizontal';
    label?: string;
    className?: string;
};

export const AdUnit = ({ slotId = "1234567890", format = 'auto', label = "Advertisement", className }: AdUnitProps) => {
    return (
        <div className={`my-12 w-full flex flex-col items-center justify-center ${className}`}>
            {/* Visual Placeholder for Dev/Preview */}
            <div className="w-full bg-gray-100 border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-gray-400 min-h-[250px] relative overflow-hidden group">
                <span className="text-xs font-bold uppercase tracking-widest bg-white px-2 py-1 rounded mb-2 z-10">{label}</span>
                <span className="text-sm z-10">Responsive Ad Placeholder</span>
                <div className="text-xs mt-2 opacity-50 font-mono z-10">slot: {slotId}</div>

                {/* Pattern for visual interest in placeholder */}
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
            </div>

            {/* Actual AdSense Code (Commented out until ID is provided) */}
            {/* 
            <ins className="adsbygoogle"
                 style={{ display: 'block' }}
                 data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                 data-ad-slot={slotId}
                 data-ad-format={format}
                 data-full-width-responsive="true"></ins>
            <script>
                 (adsbygoogle = window.adsbygoogle || []).push({});
            </script> 
            */}
        </div>
    );
};
