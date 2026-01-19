import { Color } from '@/store/usePaletteStore';
import { Lock, Unlock, Edit2 } from 'lucide-react';
import chroma from 'chroma-js';
import clsx from 'clsx';
import { useRef } from 'react';

interface ColorColumnProps {
    color: Color;
    onLock: (id: string) => void;
    onChange: (id: string, newHex: string) => void;
}

export const ColorColumn = ({ color, onLock, onChange, label }: ColorColumnProps & { label?: string }) => {
    // Determine text color based on background luminance for accessibility
    const textColor = chroma(color.hex).luminance() > 0.5 ? 'black' : 'white';
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div
            className="h-full flex flex-col items-center justify-center relative group transition-all duration-100 ease-linear"
            style={{ backgroundColor: color.hex, color: textColor }}
        >
            {/* Role Label */}
            {label && (
                <span className="absolute top-8 md:top-12 text-xs md:text-sm font-semibold uppercase tracking-widest opacity-50">
                    {label}
                </span>
            )}

            {/* Hidden Color Input */}
            <input
                ref={inputRef}
                type="color"
                value={color.hex}
                onChange={(e) => onChange(color.id, e.target.value)}
                className="absolute opacity-0 pointer-events-none"
            />

            <div className="flex flex-col items-center gap-4 group/item">
                <button
                    onClick={() => inputRef.current?.click()}
                    className="flex items-center gap-2 group/text focus:outline-none"
                    title="Click to edit color"
                >
                    <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-widest cursor-pointer group-hover/text:scale-105 transition-transform">
                        {color.hex.replace('#', '')}
                    </h2>
                    <Edit2 size={16} className="opacity-0 group-hover/text:opacity-50 transition-opacity" />
                </button>

                <button
                    onClick={(e) => {
                        e.preventDefault();
                        onLock(color.id);
                    }}
                    className={clsx(
                        "p-2 rounded-full transition-all duration-200 hover:bg-black/10 hover:scale-110 active:scale-95",
                        color.isLocked ? "opacity-100" : "opacity-0 group-hover:opacity-100 focus:opacity-100"
                    )}
                    aria-label={color.isLocked ? "Unlock color" : "Lock color"}
                >
                    {color.isLocked ? <Lock size={24} /> : <Unlock size={24} />}
                </button>
            </div>
        </div>
    );
};
