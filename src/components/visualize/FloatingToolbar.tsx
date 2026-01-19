'use client';

import { Color } from '@/store/usePaletteStore';
import { RefreshCcw, Lock, Unlock, Shuffle } from 'lucide-react';
import clsx from 'clsx';

interface FloatingToolbarProps {
    colors: Color[];
    onGenerate: () => void;
    onToggleLock: (id: string) => void;
    onUpdateColor: (id: string, newHex: string) => void;
    onShuffle?: () => void;
}

export const FloatingToolbar = ({ colors, onGenerate, onToggleLock, onUpdateColor, onShuffle }: FloatingToolbarProps) => {
    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 p-2 bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-2xl rounded-2xl max-w-[90vw] overflow-x-auto">

            {/* Shuffle Button */}
            {onShuffle && (
                <button
                    onClick={onShuffle}
                    className="p-4 bg-white text-black border border-gray-100 rounded-xl shadow-sm hover:bg-gray-50 active:scale-95 transition-all flex-shrink-0"
                    title="Shuffle Colors (Randomize Positions)"
                >
                    <Shuffle size={20} />
                </button>
            )}

            <div className="w-px h-10 bg-gray-200 flex-shrink-0" />

            {/* Generator Button */}

            {/* Color Circles */}
            <div className="flex items-center gap-2 md:gap-4">
                {colors.map((color) => (
                    <div key={color.id} className="relative group">
                        {/* Hidden Color Input */}
                        <input
                            type="color"
                            value={color.hex}
                            onChange={(e) => onUpdateColor(color.id, e.target.value)}
                            className="absolute opacity-0 inset-0 w-full h-full cursor-pointer z-20"
                            title="Click to edit color"
                        />

                        <div
                            className={clsx(
                                "w-10 h-10 md:w-12 md:h-12 rounded-full border-2 transition-all shadow-sm flex items-center justify-center relative",
                                color.isLocked ? "border-blue-500 scale-105" : "border-gray-100 group-hover:scale-110"
                            )}
                            style={{ backgroundColor: color.hex }}
                        >
                            {/* Lock Icon Overlay */}
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation(); // Prevent opening color picker
                                    onToggleLock(color.id);
                                }}
                                className={clsx(
                                    "absolute -top-1 -right-1 p-1 rounded-full bg-white shadow-md transition-all z-30",
                                    color.isLocked ? "scale-100 opacity-100" : "scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100"
                                )}
                            >
                                {color.isLocked ? <Lock size={10} className="text-blue-500" /> : <Unlock size={10} className="text-gray-400" />}
                            </button>
                        </div>

                        {/* Tooltip hint */}
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white px-1.5 py-0.5 rounded pointer-events-none whitespace-nowrap z-40">
                            {color.hex}
                        </div>
                    </div>
                ))}
            </div>

            <div className="w-px h-10 bg-gray-200 flex-shrink-0 hidden md:block" />

            <div className="hidden md:flex items-center gap-2 text-xs text-gray-400 font-medium px-2">
                <span>Press Space to Generate</span>
            </div>

        </div>
    );
};
