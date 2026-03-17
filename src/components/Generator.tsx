'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { usePaletteStore } from '@/store/usePaletteStore';
import { useModeStore } from '@/store/useModeStore';
import { CodePanel } from '@/components/developer/CodePanel';
import { ColorColumn } from '@/components/ColorColumn';
import { TopBar } from '@/components/TopBar';
import { ContrastBadge } from '@/components/ContrastBadge';
import { ExportModal } from '@/components/ExportModal';
import { ContextPreview } from '@/components/ContextPreview';
import { HowItWorksModal } from '@/components/HowItWorksModal';
import { RefreshCcw } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PaletteDetailsFAQ } from '@/components/content/PageFAQs';

import clsx from 'clsx';
import { VisualizerView } from '@/components/visualize/VisualizerView';
import { SystemBuilder } from '@/components/system/SystemBuilder';

export default function Generator() {
    const { colors, generatePalette, toggleLock, undo, redo, initFromUrl, updateColor } = usePaletteStore();
    const { mode } = useModeStore();
    const initialized = useRef(false);
    const [isHydrated, setIsHydrated] = useState(false);
    const searchParams = useSearchParams();

    const [isExportOpen, setIsExportOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isSystemOpen, setIsSystemOpen] = useState(false);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'columns' | 'visualize'>(() => {
        return searchParams.get('view') === 'visualize' ? 'visualize' : 'columns';
    });

    // Hydrate from URL on mount
    useEffect(() => {
        // Check if we are on a generate path
        if (window.location.pathname.includes('/generate/')) {
            const hash = window.location.pathname.split('/generate/')[1];
            if (hash && hash.includes('-')) {
                const hexCodes = hash.split('-');
                if (hexCodes.length === 5) {
                    initFromUrl(hexCodes);
                }
            }
        }
        initialized.current = true;
        setIsHydrated(true);
    }, [initFromUrl]);

    // Sync URL when colors change
    useEffect(() => {
        if (!initialized.current || !isHydrated) return;

        const hexString = colors.map(c => c.hex.replace('#', '')).join('-');
        const newPath = `/generate/${hexString}`;

        // Preserve query params (like ?view=visualize)
        const currentSearch = window.location.search;
        const fullPath = newPath + currentSearch;

        // Only replace if different to avoid loops (though colors change deps handles this)
        if (!window.location.pathname.endsWith(hexString)) {
            window.history.replaceState(null, '', fullPath);
        }
    }, [colors, isHydrated]);

    const [hoveredColorId, setHoveredColorId] = useState<string | null>(null);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

        // Space: Generate
        if (e.code === 'Space') {
            e.preventDefault();
            generatePalette();
        }

        // L: Lock Hovered
        if (e.key.toLowerCase() === 'l' && hoveredColorId) {
            e.preventDefault();
            toggleLock(hoveredColorId);
        }

        // C: Toggle Contrast/Preview
        if (e.key.toLowerCase() === 'c') {
            e.preventDefault();
            setIsPreviewOpen(prev => !prev);
        }

        // E: Open Export
        if (e.key.toLowerCase() === 'e') {
            e.preventDefault();
            setIsExportOpen(true);
        }

        // V: Toggle View Mode
        if (e.key.toLowerCase() === 'v') {
            e.preventDefault();
            setViewMode(prev => prev === 'columns' ? 'visualize' : 'columns');
        }

        // Undo/Redo
        if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
            e.preventDefault();
            if (e.shiftKey) {
                redo();
            } else {
                undo();
            }
        }
    }, [generatePalette, undo, redo, hoveredColorId, toggleLock]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return (
        <DashboardLayout showUserInfo={false}>
            {/* Main Tool Container - Fixed height to fill viewport */}
            <div className="flex flex-col h-[calc(100vh-64px)] md:h-screen relative bg-white">
                <TopBar
                    onOpenPreview={() => setIsPreviewOpen(true)}
                    onOpenExport={() => setIsExportOpen(true)}
                    onOpenSystem={() => setIsSystemOpen(true)}
                    onOpenHelp={() => setIsHelpOpen(true)}
                    viewMode={viewMode}
                    onChangeViewMode={setViewMode}
                />

                <ExportModal
                    isOpen={isExportOpen}
                    onClose={() => setIsExportOpen(false)}
                    colors={colors}
                />

                <SystemBuilder
                    isOpen={isSystemOpen}
                    onClose={() => setIsSystemOpen(false)}
                    colors={colors}
                />

                <HowItWorksModal
                    isOpen={isHelpOpen}
                    onClose={() => setIsHelpOpen(false)}
                />

                <ContextPreview
                    isOpen={isPreviewOpen}
                    onClose={() => setIsPreviewOpen(false)}
                    colors={colors}
                />

                <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden">
                    {!isHydrated ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                    ) : mode === 'developer' ? (
                        <CodePanel colors={colors} />
                    ) : (
                        // Designer Mode
                        <>
                            {viewMode === 'columns' ? (
                                <>
                                    <div className="md:hidden fixed bottom-8 right-8 z-40">
                                        <button
                                            onClick={generatePalette}
                                            className="p-4 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-colors"
                                            aria-label="Generate Palette"
                                        >
                                            <RefreshCcw size={24} />
                                        </button>
                                    </div>

                                    {colors.map((color, index) => {
                                        const labels = ['Text', 'Background', 'Primary', 'Secondary', 'Accent'];
                                        return (
                                            <div
                                                key={color.id}
                                                className="flex-1 min-h-[15vh] md:min-h-auto w-full relative flex items-center"
                                                onMouseEnter={() => setHoveredColorId(color.id)}
                                                onMouseLeave={() => setHoveredColorId(null)}
                                            >
                                                <ColorColumn
                                                    color={color}
                                                    onLock={toggleLock}
                                                    onChange={updateColor}
                                                    label={labels[index]}
                                                />

                                                {/* Contrast Badge between this col and next (Desktop) */}
                                                {index < colors.length - 1 && (
                                                    <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20">
                                                        <ContrastBadge color1={color.hex} color2={colors[index + 1].hex} />
                                                    </div>
                                                )}

                                                {/* Contrast Badge between this col and next (Mobile - Bottom) */}
                                                {index < colors.length - 1 && (
                                                    <div className="md:hidden absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20">
                                                        <ContrastBadge color1={color.hex} color2={colors[index + 1].hex} />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </>
                            ) : (
                                // Visualize Mode
                                <VisualizerView
                                    colors={colors}
                                    onGenerate={generatePalette}
                                    onToggleLock={toggleLock}
                                    onUpdateColor={updateColor}
                                    onUndo={undo}
                                    onRedo={redo}
                                    onExport={() => setIsExportOpen(true)}
                                    onShare={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        // Maybe show toast? Use existing toast logic if any or simple alert for now
                                        alert('Link copied to clipboard!');
                                    }}
                                />
                            )}
                        </>
                    )}


                    {/* Desktop Hint */}
                    {viewMode === 'columns' && !isSystemOpen && !isPreviewOpen && (
                        <div className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                            <span className="bg-white/90 backdrop-blur-md text-gray-500 px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl border border-gray-100 flex gap-6 items-center">
                                <span><code className="bg-gray-100 px-1.5 py-0.5 rounded mr-2 text-black">Space</code> Generate</span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                <span><code className="bg-gray-100 px-1.5 py-0.5 rounded mr-2 text-black">L</code> Lock Color</span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                <span><code className="bg-gray-100 px-1.5 py-0.5 rounded mr-2 text-black">C</code> Contrast</span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                <span><code className="bg-gray-100 px-1.5 py-0.5 rounded mr-2 text-black">E</code> Export</span>
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Content Area - Scrolls below the tool */}
            <div className="bg-white border-t border-gray-100 relative z-20">
                <PaletteDetailsFAQ />
            </div>
        </DashboardLayout>
    );
}
