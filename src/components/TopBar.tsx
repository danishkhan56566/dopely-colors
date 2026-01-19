'use client';

import { Algorithm, usePaletteStore } from '@/store/usePaletteStore';
import { ShareModal } from './ShareModal';
import { Undo, Redo, ChevronDown, Eye, Download, Heart, Palette, Code, Share2 } from 'lucide-react';
import Link from 'next/link';
import { UserButton } from './auth/UserButton';
import clsx from 'clsx';
import { useState } from 'react';
import { useModeStore } from '@/store/useModeStore';

const ALGORITHMS: { id: Algorithm; label: string }[] = [
    { id: 'random', label: '🎲 True Random' },
    { id: 'calm', label: '😌 Calm' },
    { id: 'luxury', label: '💎 Luxury' },
    { id: 'tech', label: '🤖 Tech' },
    { id: 'islamic', label: '🕌 Islamic' },
    { id: 'food', label: '🍔 Food' },
    { id: 'finance', label: '💰 Finance' },
    { id: 'kids', label: '🎈 Kids' },
    { id: 'pastel', label: '🎨 Pastel' },
    { id: 'neon', label: '⚡ Neon' },
    { id: 'dark', label: '🌑 Dark Mode' },
    { id: 'light', label: '☀️ Light Mode' },
];

interface TopBarProps {
    onOpenPreview: () => void;
    onOpenExport: () => void;
    onOpenSystem: () => void;
    viewMode: 'columns' | 'visualize';
    onChangeViewMode: (mode: 'columns' | 'visualize') => void;
}

export const TopBar = ({ onOpenPreview, onOpenExport, onOpenSystem, viewMode, onChangeViewMode }: TopBarProps) => {
    const { mode, setMode } = useModeStore();
    const {
        undo, redo, historyIndex, history,
        algorithm, setAlgorithm, generatePalette,
        colors, savedPalettes, toggleFavorite
    } = usePaletteStore();
    const [isAlgoMenuOpen, setIsAlgoMenuOpen] = useState(false);

    // Undo is available if index > 0
    const canUndo = historyIndex > 0;
    // Redo is available if index < length - 1
    const canRedo = historyIndex < history.length - 1;
    const [shareOpen, setShareOpen] = useState(false);

    // Check if current colors match any saved palette
    const currentHexStr = colors.map(c => c.hex).join('-');
    const savedPalette = savedPalettes.find(p => p.colors.join('-') === currentHexStr);
    const isSaved = !!savedPalette;

    return (
        <header className="w-full h-16 bg-white/90 backdrop-blur-md grid grid-cols-[1fr_auto_1fr] items-center px-4 md:px-6 z-30 border-b border-gray-100 shadow-sm relative gap-4">
            {/* Left Section */}
            <div className="flex items-center gap-2 md:gap-4 justify-start min-w-0">
                {/* Mode Switcher */}
                <div className="flex bg-gray-100 p-1 rounded-xl shrink-0">
                    <button
                        onClick={() => setMode('designer')}
                        className={clsx(
                            "flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                            mode === 'designer' ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        <Palette size={16} />
                        <span className="hidden lg:inline">Designer</span>
                    </button>
                    <button
                        onClick={() => setMode('developer')}
                        className={clsx(
                            "flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                            mode === 'developer' ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        <Code size={16} />
                        <span className="hidden lg:inline">Developer</span>
                    </button>
                </div>

                <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block" />

            </div>

            {/* Center Section - View Switcher */}
            <div className="flex items-center justify-center min-w-0">
                <div className="flex items-center bg-gray-100 p-1 rounded-lg shadow-sm border border-gray-200/50 hidden md:flex">
                    {mode === 'designer' ? (
                        <div className="flex">
                            <button
                                onClick={() => onChangeViewMode('columns')}
                                className={clsx(
                                    "px-3 lg:px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap",
                                    viewMode === 'columns' ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-900"
                                )}
                            >
                                Columns
                            </button>
                            <button
                                onClick={() => onChangeViewMode('visualize')}
                                className={clsx(
                                    "px-3 lg:px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap",
                                    viewMode === 'visualize' ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-900"
                                )}
                            >
                                Visualize
                            </button>
                        </div>
                    ) : (
                        <span className="px-4 py-1.5 text-sm font-medium text-gray-500">Developer Mode</span>
                    )}

                    {/* Tokens Button (System) */}
                    <div className="w-px h-4 bg-gray-300 mx-1" />
                    <button
                        onClick={onOpenSystem}
                        className="px-3 lg:px-4 py-1.5 rounded-md text-sm font-medium transition-all text-gray-600 hover:text-gray-900 hover:bg-white/50"
                        title="View Design Tokens & Scales"
                    >
                        Tokens
                    </button>
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 md:gap-3 justify-end min-w-0">
                {/* Mobile: Show View Switcher here instead of center */}
                <div className="md:hidden flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => onChangeViewMode(viewMode === 'columns' ? 'visualize' : 'columns')}
                        className="p-1.5"
                    >
                        {viewMode === 'columns' ? <Eye size={18} /> : <Palette size={18} />}
                    </button>
                </div>

                {/* Algo Selector */}
                <div className="relative hidden xl:block">
                    <button
                        onClick={() => setIsAlgoMenuOpen(!isAlgoMenuOpen)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 text-sm font-medium transition-colors border border-transparent hover:border-gray-200"
                    >
                        {ALGORITHMS.find(a => a.id === algorithm)?.label}
                        <ChevronDown size={14} />
                    </button>

                    {isAlgoMenuOpen && (
                        <div className="absolute top-full mt-2 right-0 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 flex flex-col gap-1 z-50 max-h-[400px] overflow-y-auto">
                            {ALGORITHMS.map((algo) => (
                                <button
                                    key={algo.id}
                                    className={clsx(
                                        "text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors",
                                        algorithm === algo.id ? "text-blue-600 font-semibold" : "text-gray-700"
                                    )}
                                    onClick={() => {
                                        setAlgorithm(algo.id);
                                        generatePalette();
                                        setIsAlgoMenuOpen(false);
                                    }}
                                >
                                    {algo.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="w-px h-6 bg-gray-200 mx-1 hidden xl:block" />

                {/* Save / Favorite */}
                <button
                    onClick={() => toggleFavorite()}
                    className={clsx(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap",
                        isSaved ? "bg-red-50 text-red-500 hover:bg-red-100" : "hover:bg-primary/5 hover:text-primary text-gray-700"
                    )}
                    title={isSaved ? "Remove from Favorites" : "Save to Favorites"}
                >
                    <Heart size={18} className={clsx(isSaved && "fill-current")} />
                    <span className="hidden 2xl:inline">{isSaved ? 'Saved' : 'Save'}</span>
                </button>

                <button
                    onClick={onOpenExport}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-primary/5 hover:text-primary text-gray-700 text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap"
                    title="Export Palette"
                >
                    <Download size={18} />
                    <span className="hidden 2xl:inline">Export</span>
                </button>

                <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block" />

                {/* History Controls */}
                <div className="hidden sm:flex gap-1">
                    <button
                        onClick={undo}
                        disabled={!canUndo}
                        className="p-2 rounded-full hover:bg-primary/10 hover:text-primary disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400 text-gray-600 transition-all duration-200 hover:scale-110 active:scale-90"
                        title="Undo (Ctrl+Z)"
                    >
                        <Undo size={18} />
                    </button>
                    <button
                        onClick={redo}
                        disabled={!canRedo}
                        className="p-2 rounded-full hover:bg-primary/10 hover:text-primary disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400 text-gray-600 transition-all duration-200 hover:scale-110 active:scale-90"
                        title="Redo (Ctrl+Shift+Z)"
                    >
                        <Redo size={18} />
                    </button>
                </div>

                {/* User Auth - Fixed Alignment */}
                <div className="flex items-center pl-3 ml-2 border-l border-slate-200 h-8">
                    <UserButton />
                </div>
            </div>
            {savedPalette && (
                <ShareModal
                    isOpen={shareOpen}
                    onClose={() => setShareOpen(false)}
                    palette={savedPalette}
                />
            )}
        </header>
    );
};
