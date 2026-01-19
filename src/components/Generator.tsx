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
import { RefreshCcw } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

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
    const [viewMode, setViewMode] = useState<'columns' | 'visualize'>(() => {
        return searchParams.get('view') === 'visualize' ? 'visualize' : 'columns';
    });

    // ... (rest of useEffects - keep them)
    // We don't prefer useRouter for replaceState to avoid server roundtrips/suspense boundaries if possible, 
    // but let's stick to window.history for purely client-side feeling updates if we are already mounted.

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
        const newPath = `/generate/${hexString}`; // Note: This drops query params if not carefully handled?

        // Preserve query params (like ?view=visualize)
        const currentSearch = window.location.search;
        const fullPath = newPath + currentSearch;

        // Only replace if different to avoid loops (though colors change deps handles this)
        if (!window.location.pathname.endsWith(hexString)) {
            window.history.replaceState(null, '', fullPath);
        }
    }, [colors, isHydrated]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.code === 'Space') {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
            e.preventDefault();
            generatePalette();
        }
        if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
            e.preventDefault();
            if (e.shiftKey) {
                redo();
            } else {
                undo();
            }
        }
    }, [generatePalette, undo, redo]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return (
        <DashboardLayout>
            <div className="flex flex-col h-[calc(100vh-64px)] md:h-screen relative">
                <TopBar
                    onOpenPreview={() => setIsPreviewOpen(true)}
                    onOpenExport={() => setIsExportOpen(true)}
                    onOpenSystem={() => setIsSystemOpen(true)}
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

                {/* Legacy Modal Preview - Keeping just in case or we can remove since we have Visualize Mode */}
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
                                            <div key={color.id} className="flex-1 min-h-[15vh] md:min-h-auto w-full relative flex items-center">
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

                </div>
            </div>
        </DashboardLayout>
    );
}
