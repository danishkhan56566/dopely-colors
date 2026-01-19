'use client';

import { Color } from '@/store/usePaletteStore';
import { WebsiteMockup } from '../WebsiteMockup';
import { MobileMockup } from './MobileMockup';

interface AllDevicesMockupProps {
    colors: Color[];
}

export const AllDevicesMockup = ({ colors }: AllDevicesMockupProps) => {
    return (
        <div className="w-full h-full flex items-center justify-center gap-8 p-8 overflow-hidden bg-gray-50/50">
            {/* Desktop View Container */}
            <div className="hidden md:flex flex-1 h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden border-[8px] border-gray-800 relative flex-col">
                {/* Fake Browser Top Bar */}
                <div className="h-6 bg-gray-100 border-b flex items-center gap-2 px-4 shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                {/* Website Content */}
                <div className="flex-1 overflow-hidden relative">
                    {/* Scale down the website mockup slightly to fit better if needed, or just let it scroll */}
                    <div className="absolute inset-0 w-[120%] h-[120%] origin-top-left transform scale-[0.833]"> {/* ~5/6 scale */}
                        <WebsiteMockup colors={colors} isInteractive={false} />
                    </div>
                </div>
            </div>

            {/* Mobile View Container */}
            <div className="transform scale-[0.8] md:scale-90 origin-center shrink-0">
                <MobileMockup colors={colors} />
            </div>
        </div>
    );
};
