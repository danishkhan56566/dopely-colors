import { Color } from '@/store/usePaletteStore';
import { Lock, Unlock, Copy, Check } from 'lucide-react';
import chroma from 'chroma-js';
import clsx from 'clsx';
import { useState } from 'react';

interface ColorColumnProps {
    color: Color;
    onLock: (id: string) => void;
    onChange: (id: string, newHex: string) => void;
    label?: string;
}

export const ColorColumn = ({ color, onLock, onChange, label }: ColorColumnProps) => {
    // Determine text color based on background luminance for accessibility
    const textColor = chroma(color.hex).luminance() > 0.5 ? 'black' : 'white';
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(color.hex);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1000);
    };

    return (
        <div
            className="h-full w-full flex flex-col items-center justify-center relative group transition-all duration-100 ease-linear"
            style={{ backgroundColor: color.hex, color: textColor }}
        >
            {/* Role Label - Top Positioned */}
            {label && (
                <span className="hidden md:block absolute top-[15%] text-sm font-bold uppercase tracking-[0.2em] opacity-40">
                    {label}
                </span>
            )}

            {/* Main Hex Code - Centered */}
            <div className="relative z-10 flex flex-col items-center gap-4">
                <button
                    onClick={handleCopy}
                    className="group/text focus:outline-none flex flex-col items-center gap-2"
                    title="Click to copy"
                >
                    <h2 className={clsx(
                        "text-3xl md:text-5xl font-black uppercase tracking-wider transition-transform duration-200",
                        "hover:scale-110 active:scale-95 cursor-pointer"
                    )}>
                        {color.hex.replace('#', '')}
                    </h2>

                    {/* Hover Copy Indicator */}
                    <span className="text-xs font-bold uppercase tracking-widest opacity-0 group-hover/text:opacity-60 transition-opacity">
                        {isCopied ? 'Copied!' : 'Copy Hex'}
                    </span>
                </button>
            </div>

            {/* Action Buttons - Bottom Positioned */}
            <div className="absolute bottom-[15%] flex flex-col items-center gap-6 z-20">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        onLock(color.id);
                    }}
                    className={clsx(
                        "p-3 rounded-xl transition-all duration-300 hover:scale-110 active:scale-90 border-2",
                        color.isLocked
                            ? "bg-white text-black border-white shadow-lg"
                            : "bg-transparent border-current opacity-40 hover:opacity-100 hover:bg-black/5"
                    )}
                    aria-label={color.isLocked ? "Unlock color" : "Lock color"}
                >
                    {color.isLocked ? <Lock size={20} /> : <Unlock size={20} />}
                </button>
            </div>

            {/* Mobile: Show Label nicely on mobile too */}
            <span className="md:hidden absolute top-4 left-4 text-xs font-bold uppercase tracking-widest opacity-40">
                {label}
            </span>
        </div>
    );
};
