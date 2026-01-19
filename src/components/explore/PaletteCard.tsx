'use client';

import { Heart, Calendar, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import chroma from 'chroma-js';
import clsx from 'clsx';

interface PaletteCardProps {
    colors: string[];
    likes: number;
    date: string;
}

export const PaletteCard = ({ colors, likes: initialLikes, date }: PaletteCardProps) => {
    const [likes, setLikes] = useState(initialLikes);
    const [isLiked, setIsLiked] = useState(false);

    // Parse colors to remove potential hash for URL
    const urlHash = colors.map(c => c.replace('#', '')).join('-');

    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsLiked(!isLiked);
        setLikes(prev => isLiked ? prev - 1 : prev + 1);
    };

    return (
        <div className="block group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 relative">
            {/* Main Link Overlay for the visual part */}
            <Link
                href={`/palette/${urlHash}`}
                className="block"
            >
                {/* Visual Palette Strip */}
                <div className="h-40 flex">
                    {colors.map((color, i) => (
                        <div
                            key={i}
                            className="flex-1 h-full relative group/strip"
                            style={{ backgroundColor: color }}
                        >
                            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-mono text-white/90 opacity-0 group-hover/strip:opacity-100 bg-black/20 px-1 rounded backdrop-blur-sm transition-opacity">
                                {color}
                            </span>
                        </div>
                    ))}
                </div>
            </Link>

            {/* Meta Content */}
            <div className="p-4 flex items-center justify-between relative">
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleLike}
                        className={clsx(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors hover:bg-red-50 hover:border-red-200 hover:text-red-500",
                            isLiked ? "bg-red-50 border-red-200 text-red-500" : "bg-white border-gray-200 text-gray-600"
                        )}
                    >
                        <Heart size={14} className={clsx(isLiked && "fill-current")} />
                        <span>{likes}</span>
                    </button>
                    <span className="text-xs text-gray-400 font-medium">{date}</span>
                </div>

                <Link
                    href={`/palette/${urlHash}`}
                    className="p-2 rounded-full bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors"
                >
                    <ArrowUpRight size={16} />
                </Link>
            </div>
        </div>
    );
};
