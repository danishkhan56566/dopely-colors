import { AlertTriangle, CheckCircle } from 'lucide-react';
import clsx from 'clsx';
import chroma from 'chroma-js';

interface ContrastBadgeProps {
    color1: string;
    color2: string;
    isVertical?: boolean; // For mobile layout later if needed
}

export const ContrastBadge = ({ color1, color2 }: ContrastBadgeProps) => {
    const ratio = chroma.contrast(color1, color2);
    const isPass = ratio >= 4.5;
    const grade = ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'Fail';

    // We only show visual warning if it fails, but maybe strictly showing the badge always is useful?
    // Requirements said: "If the ratio is < 4.5:1, automatically display a small 'Low Contrast' warning icon"

    if (isPass) return null; // Only render on fail per specs, or valid choice? 
    // Specs: "If the ratio is < 4.5:1"

    return (
        <div className="absolute top-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center pointer-events-none">
            {/* Position logic handled by parent usually, but here we assume it sits on the divider. 
           We'll use negative margins or absolute positioning in parent. 
           Actually, let's make this a tooltip trigger. */}

            <div className="group relative pointer-events-auto">
                <div className="bg-white text-red-600 rounded-full p-1.5 shadow-md border border-red-100 cursor-help hover:scale-110 transition-transform">
                    <AlertTriangle size={16} />
                </div>

                {/* Tooltip */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-32 bg-gray-900 text-white text-xs rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center shadow-xl">
                    <div className="font-bold mb-1">Low Contrast</div>
                    <div className="flex justify-between border-b border-gray-700 pb-1 mb-1">
                        <span>Score</span>
                        <span className="font-mono">{ratio.toFixed(2)}</span>
                    </div>
                    <div className="text-red-300 font-bold">{grade}</div>
                </div>
            </div>
        </div>
    );
};
