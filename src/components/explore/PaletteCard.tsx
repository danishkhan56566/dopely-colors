'use client';

import { Heart, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import clsx from 'clsx';
import { usePaletteStore } from '@/store/usePaletteStore';

interface PaletteCardProps {
    id: string;
    colors: string[];
    likes: number;
}

export const PaletteCard = ({ id, colors, likes: initialLikes }: PaletteCardProps) => {
    const { toggleFavoritePalette, savedPalettes } = usePaletteStore();
    const isLiked = savedPalettes.some(p => p.id === id);
    const [likes, setLikes] = useState(initialLikes);

    // Parse colors to remove potential hash for URL
    const urlHash = colors.map(c => c.replace('#', '')).join('-');

    const handleLike = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Optimistic UI handled by store now for "isLiked" status
        // But for the count number, we just optimistically bump it locally
        setLikes(prev => isLiked ? prev - 1 : prev + 1);

        // Call Store
        await toggleFavoritePalette(id, colors);
    };

    return (
        <div className="block group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 relative">
            {/* Main Link Overlay for the visual part */}
            <Link
                href={`/palette/${urlHash}`}
                className="block"
            >
                {/* Visual Palette Strip */}
                <div className="h-48 flex relative"> {/* Increased height slightly for better visual focus */}
                    {colors.map((color, i) => (
                        <div
                            key={i}
                            className="flex-1 h-full relative group/strip"
                            style={{ backgroundColor: color }}
                        />
                    ))}

                    {/* Centered View Button specific to User Request */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/10 backdrop-blur-[1px]">
                        <div className="bg-white text-gray-900 px-5 py-2.5 rounded-full font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all flex items-center gap-2 text-sm">
                            View Palette <ArrowUpRight size={14} />
                        </div>
                    </div>
                </div>
            </Link>

            {/* Minimal Interactions Overlay (Only Like & Open) */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link
                    href={`/palette/${urlHash}`}
                    className="p-2.5 rounded-full bg-white/90 text-gray-600 shadow-sm hover:text-blue-600 backdrop-blur-sm transition-colors"
                >
                    <ArrowUpRight size={16} />
                </Link>
            </div>

            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={handleLike}
                    className={clsx(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors shadow-sm backdrop-blur-md",
                        isLiked
                            ? "bg-red-500 text-white"
                            : "bg-white/90 text-gray-600 hover:bg-white hover:text-red-500"
                    )}
                >
                    <Heart size={14} className={clsx(isLiked && "fill-current")} />
                    <span>{likes}</span>
                </button>
            </div>
        </div>
    );
};
