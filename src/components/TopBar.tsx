'use client';

import { Algorithm, usePaletteStore, ALGORITHMS } from '@/store/usePaletteStore';
import { ShareModal } from './ShareModal';
import { Undo, Redo, ChevronDown, Eye, Download, Heart, Palette, Code, Share2, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { UserButton } from './auth/UserButton';
import clsx from 'clsx';
import { useState } from 'react';
import { useModeStore } from '@/store/useModeStore';

interface TopBarProps {
    onOpenPreview: () => void;
    onOpenExport: () => void;
    onOpenSystem: () => void;
    onOpenHelp: () => void;
    viewMode: 'columns' | 'visualize';
    onChangeViewMode: (mode: 'columns' | 'visualize') => void;
}

export const TopBar = ({ onOpenPreview, onOpenExport, onOpenSystem, onOpenHelp, viewMode, onChangeViewMode }: TopBarProps) => {
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
        <header className="w-full h-16 bg-white/90 backdrop-blur-md flex items-center gap-4 px-4 md:px-6 z-30 border-b border-gray-100 shadow-sm relative">
            {/* Left Section: Mode Switcher */}
            <div className="flex items-center shrink-0">
                <div className="flex bg-gray-100/50 p-1 rounded-xl border border-gray-200/50">
                    <button
                        onClick={() => setMode('designer')}
                        className={clsx(
                            "flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-lg text-sm font-bold transition-all",
                            mode === 'designer' ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        <Palette size={16} />
                        <span className="hidden lg:inline">Designer</span>
                    </button>
                    <button
                        onClick={() => setMode('developer')}
                        className={clsx(
                            "flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-lg text-sm font-bold transition-all",
                            mode === 'developer' ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        <Code size={16} />
                        <span className="hidden lg:inline">Developer</span>
                    </button>
                </div>
            </div>

            {/* Center Section: View | Tokens | Algorithm */}
            {/* Using flex-1 and justify-center to prevent overlap with Left/Right sections */}
            <div className="flex-1 hidden xl:flex items-center justify-center min-w-0">
                <div className="flex items-center bg-gray-100/50 p-1 rounded-xl border border-gray-200/50 shadow-sm max-w-full">
                    {/* View Switcher */}
                    {mode === 'designer' ? (
                        <div className="flex shrink-0">
                            <button
                                onClick={() => onChangeViewMode('columns')}
                                className={clsx(
                                    "px-4 py-1.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap",
                                    viewMode === 'columns' ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-900"
                                )}
                            >
                                Columns
                            </button>
                            <button
                                onClick={() => onChangeViewMode('visualize')}
                                className={clsx(
                                    "px-4 py-1.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap",
                                    viewMode === 'visualize' ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-900"
                                )}
                            >
                                Visualize
                            </button>
                        </div>
                    ) : (
                        <span className="px-4 py-1.5 text-sm font-medium text-gray-500 shrink-0">Developer Mode</span>
                    )}

                    {/* Divider */}
                    <div className="w-px h-5 bg-gray-300 mx-2 shrink-0" />

                    {/* Tokens */}
                    <button
                        onClick={onOpenSystem}
                        className="px-3 py-1.5 rounded-lg text-sm font-bold text-gray-600 hover:text-gray-900 hover:bg-white/50 transition-all flex items-center gap-2 shrink-0"
                    >
                        Tokens
                    </button>

                    {/* Divider */}
                    <div className="w-px h-5 bg-gray-300 mx-2 shrink-0" />

                    {/* Algorithm Selector */}
                    <div className="relative shrink-0">
                        <button
                            onClick={() => setIsAlgoMenuOpen(!isAlgoMenuOpen)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/50 text-sm font-bold text-gray-700 transition-all min-w-[120px] justify-between"
                        >
                            <span className="truncate">{ALGORITHMS.find(a => a.id === algorithm)?.label}</span>
                            <ChevronDown size={14} className="opacity-50 shrink-0" />
                        </button>

                        {isAlgoMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsAlgoMenuOpen(false)} />
                                <div className="absolute top-full mt-2 left-0 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 flex flex-col gap-1 z-50 max-h-[300px] overflow-y-auto">
                                    {ALGORITHMS.map((algo) => (
                                        <button
                                            key={algo.id}
                                            className={clsx(
                                                "text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors font-medium",
                                                algorithm === algo.id ? "text-blue-600 font-bold bg-blue-50" : "text-gray-700"
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
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Section: Actions + User */}
            {/* Added ml-auto ensure it pushes right if center section is hidden or shrunk */}
            <div className="flex items-center justify-end gap-3 shrink-0 ml-auto xl:ml-0">
                {/* Mobile View Switcher */}
                <div className="xl:hidden flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => onChangeViewMode(viewMode === 'columns' ? 'visualize' : 'columns')}
                        className="p-1.5"
                    >
                        {viewMode === 'columns' ? <Eye size={18} /> : <Palette size={18} />}
                    </button>
                </div>

                {/* Save/Favorite */}
                <button
                    onClick={() => toggleFavorite()}
                    className={clsx(
                        "p-2 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 border",
                        isSaved ? "bg-red-50 border-red-100 text-red-500" : "bg-transparent border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                    )}
                    title={isSaved ? "Remove from Favorites" : "Save to Favorites"}
                >
                    <Heart size={20} className={clsx(isSaved && "fill-current")} />
                </button>

                {/* Export */}
                <button
                    onClick={onOpenExport}
                    className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all duration-200 hover:scale-105 active:scale-95"
                    title="Export Palette"
                >
                    <Download size={20} />
                </button>

                {/* Help Pill - Hidden on mobile */}
                <button
                    onClick={onOpenHelp}
                    className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition-all font-bold text-xs uppercase tracking-wide"
                >
                    <HelpCircle size={16} />
                    <span className="hidden lg:inline">How it Works</span>
                </button>

                {/* Separator */}
                <div className="w-px h-8 bg-gray-200 mx-1 hidden md:block" />

                {/* History */}
                <div className="hidden lg:flex gap-1">
                    <button onClick={undo} disabled={!canUndo} className="p-2 text-gray-400 hover:text-gray-700 disabled:opacity-20"><Undo size={18} /></button>
                    <button onClick={redo} disabled={!canRedo} className="p-2 text-gray-400 hover:text-gray-700 disabled:opacity-20"><Redo size={18} /></button>
                </div>

                {/* User */}
                <div className="pl-1 md:pl-2 hidden md:block">
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
