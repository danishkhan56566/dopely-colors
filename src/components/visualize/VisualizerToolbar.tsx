import { Color } from '@/store/usePaletteStore';
import {
    RefreshCcw,
    Undo,
    Redo,
    Download,
    Share2,
    Type,
    Eye,
    Check
} from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';
import chroma from 'chroma-js';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { VisionSimulation, visionSimulationOptions } from './ColorBlindnessFilters';

interface VisualizerToolbarProps {
    colors: Color[];
    onUpdateColor: (id: string, newHex: string) => void;
    onGenerate: () => void;
    onUndo: () => void;
    onRedo: () => void;
    onExport: () => void;
    onShare: () => void;
    currentFont: string;
    onFontChange: (font: string) => void;
    simulationMode: VisionSimulation;
    onSimulationChange: (mode: VisionSimulation) => void;
    colorMapping?: number[];

    // Style
    isEmbedded?: boolean;
}

const ROLES = [
    { label: 'Text', index: 0 },
    { label: 'Background', index: 1 },
    { label: 'Primary', index: 2 },
    { label: 'Secondary', index: 3 },
    { label: 'Accent', index: 4 },
];

const FONTS = [
    { name: 'Inter', value: 'var(--font-inter)' },
    { name: 'Roboto', value: 'Roboto, sans-serif' },
    { name: 'Playfair Display', value: 'Playfair Display, serif' },
    { name: 'Montserrat', value: 'Montserrat, sans-serif' },
    { name: 'Open Sans', value: 'Open Sans, sans-serif' },
    { name: 'Lato', value: 'Lato, sans-serif' },
];

export const VisualizerToolbar = ({
    colors,
    onUpdateColor,
    onGenerate,
    onUndo,
    onRedo,
    onExport,
    onShare,
    currentFont,
    onFontChange,
    simulationMode,
    onSimulationChange,
    colorMapping,
    isEmbedded = false
}: VisualizerToolbarProps) => {

    // Helper to safely get color at index, respecting mapping if provided
    const getColor = (roleIndex: number) => {
        const actualIndex = colorMapping ? colorMapping[roleIndex] : roleIndex;
        return colors[actualIndex] || colors[0];
    };

    return (
        <div className={clsx(
            "left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-2 bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-2xl rounded-2xl max-w-[95%] overflow-x-auto [&::-webkit-scrollbar]:hidden",
            isEmbedded ? "absolute bottom-6 scale-90 origin-bottom" : "absolute top-6"
        )} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>

            {/* Color Roles Section */}
            <div className="flex items-center gap-1 pr-4 border-r border-gray-200">
                {ROLES.map((role) => {
                    const color = getColor(role.index);
                    const textColor = chroma.contrast(color.hex, 'white') > 4.5 ? 'white' : 'black';

                    return (
                        <div key={role.label} className="relative group">
                            <label className="flex flex-col items-center cursor-pointer">
                                <span
                                    className="w-24 h-12 rounded-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-sm border border-black/5 relative overflow-hidden"
                                    style={{ backgroundColor: color.hex }}
                                >
                                    <span
                                        className="text-xs font-semibold z-10"
                                        style={{ color: textColor }}
                                    >
                                        {role.label}
                                    </span>

                                    {/* Hidden Color Input */}
                                    <input
                                        type="color"
                                        value={color.hex}
                                        onChange={(e) => onUpdateColor(color.id, e.target.value)}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </span>

                                {/* Hex Code on Hover (Optional, strictly nice to have) */}
                                {/* <span className="text-[10px] text-gray-400 font-mono mt-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-full">
                                    {color.hex}
                                </span> */}
                            </label>

                            {/* Checkmark for visual feedback when color changes? Handled by visualizer update. */}
                        </div>
                    );
                })}
            </div>

            {/* Actions Section */}
            <div className="flex items-center gap-2 pl-2">

                {/* Generate */}
                <button
                    onClick={onGenerate}
                    className="p-3 bg-gray-50 hover:bg-primary/10 hover:text-primary text-gray-700 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 tooltip-trigger"
                    title="Generate New Palette (Space)"
                >
                    <RefreshCcw size={20} />
                </button>

                {/* Undo / Redo */}
                <div className="flex items-center bg-gray-50 rounded-xl p-1">
                    <button onClick={onUndo} className="p-2 hover:bg-white hover:text-primary rounded-lg text-gray-600 transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm hover:shadow">
                        <Undo size={18} />
                    </button>
                    <button onClick={onRedo} className="p-2 hover:bg-white hover:text-primary rounded-lg text-gray-600 transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm hover:shadow">
                        <Redo size={18} />
                    </button>
                </div>

                {/* Export */}
                <button
                    onClick={onExport}
                    className="p-3 bg-gray-50 hover:bg-primary/10 hover:text-primary text-gray-700 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
                    title="Export"
                >
                    <Download size={20} />
                </button>

                {/* Share */}
                <button
                    onClick={onShare}
                    className="p-3 bg-gray-50 hover:bg-primary/10 hover:text-primary text-gray-700 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
                    title="Share Link"
                >
                    <Share2 size={20} />
                </button>

                {/* Vision Selector */}
                <Popover>
                    <PopoverTrigger asChild>
                        <button
                            className={clsx(
                                "flex items-center gap-2 px-3 py-3 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95",
                                simulationMode !== 'normal' ? "bg-black text-white hover:bg-gray-800" : "bg-gray-50 hover:bg-primary/10 hover:text-primary text-gray-700"
                            )}
                            title="Simulate Vision"
                        >
                            <Eye size={20} />
                            {simulationMode !== 'normal' && <span className="text-xs font-bold hidden sm:inline ml-1">SIM</span>}
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-2 bg-white rounded-xl shadow-xl border border-gray-100 mb-2">
                        <div className="flex flex-col gap-1">
                            <span className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Accessibility</span>
                            {visionSimulationOptions.map(option => (
                                <button
                                    key={option.id}
                                    onClick={() => onSimulationChange(option.id)}
                                    className={clsx(
                                        "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between",
                                        simulationMode === option.id ? "bg-black text-white" : "hover:bg-gray-50 text-gray-700"
                                    )}
                                >
                                    {option.label}
                                    {simulationMode === option.id && <Check size={14} />}
                                </button>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>

                {/* Font Selector */}
                <Popover>
                    <PopoverTrigger asChild>
                        <button
                            className="flex items-center gap-2 px-3 py-3 bg-gray-50 hover:bg-primary/10 hover:text-primary text-gray-700 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                            title="Change Typography"
                        >
                            <Type size={20} />
                            <span className="text-sm font-medium hidden sm:inline">Fonts</span>
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-2 bg-white rounded-xl shadow-xl border border-gray-100 mb-2">
                        <div className="flex flex-col gap-1">
                            {FONTS.map(font => (
                                <button
                                    key={font.name}
                                    onClick={() => onFontChange(font.value)}
                                    className={clsx(
                                        "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between",
                                        currentFont === font.value ? "bg-black text-white" : "hover:bg-gray-50 text-gray-700"
                                    )}
                                    style={{ fontFamily: font.value }}
                                >
                                    {font.name}
                                    {currentFont === font.value && <Check size={14} />}
                                </button>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>

            </div>
        </div>
    );
};
