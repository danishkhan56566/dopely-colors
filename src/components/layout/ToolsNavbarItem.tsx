'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowRight, Sparkles, Image, Eye, Layers, Grid, Wand2, Palette } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ALL_TOOLS } from '@/data/tools';

export const ToolsNavbarItem = () => {
    // Select popular tools manually or filter from ALL_TOOLS
    const popularTools = [
        ALL_TOOLS.find(c => c.category === 'Generators')?.items.find(t => t.name === 'AI Palette Generator'),
        ALL_TOOLS.find(c => c.category === 'Color Analysis')?.items.find(t => t.name === 'Image Color Picker'),
        ALL_TOOLS.find(c => c.category === 'Color Analysis')?.items.find(t => t.name === 'Contrast Checker'),
        ALL_TOOLS.find(c => c.category === 'Generators')?.items.find(t => t.name === 'Gradient Generator'),
    ].filter(Boolean) as typeof ALL_TOOLS[0]['items'];

    // Also maybe specific tools the user mentioned or key ones
    // Let's just hardcode a nice selection if finding is brittle
    const FEATURED_TOOLS = [
        { name: 'Color Wheel', icon: Palette, desc: 'Interactive harmony explorer', href: '/color-wheel' },
        { name: 'Color Mixer', icon: Grid, desc: 'Physics-based pigment mixing', href: '/color-mixer' },
        { name: 'Compare Generators', icon: ArrowRight, desc: 'Dopely vs Adobe vs Coolors', href: '/compare-generators' },
        { name: 'Blindness Sim', icon: Eye, desc: 'Test WCAG accessibility', href: '/color-blindness-simulator' },
        { name: 'AI Generator', icon: Sparkles, desc: 'Text to color', href: '/ai' },
        { name: 'Gallery Lens', icon: Image, desc: 'Extract mood from photos', href: '/tools/art-extractor' },
    ];

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors">
                Tools
                <ChevronDown size={14} className="opacity-60" />
            </button>
        );
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors group">
                    Tools
                    <ChevronDown size={14} className="group-data-[state=open]:rotate-180 transition-transform duration-200 opacity-60" />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-[320px] p-2 bg-white rounded-2xl shadow-xl border border-gray-100 mt-2" align="start" sideOffset={8}>
                <div className="grid grid-cols-1 gap-1 p-1">
                    {FEATURED_TOOLS.map((tool) => (
                        <Link
                            key={tool.name}
                            href={tool.href}
                            className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                        >
                            <div className="mt-0.5 p-2 bg-gray-100 rounded-lg text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                <tool.icon size={18} />
                            </div>
                            <div>
                                <div className="font-bold text-sm text-gray-900">{tool.name}</div>
                                <div className="text-xs text-gray-500 font-medium">{tool.desc}</div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="p-1 mt-1 border-t border-gray-50">
                    <Link
                        href="/tools"
                        className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-gray-50 text-sm font-bold text-gray-900 group"
                    >
                        View All Tools
                        <ArrowRight size={16} className="text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </PopoverContent>
        </Popover>
    );
};
