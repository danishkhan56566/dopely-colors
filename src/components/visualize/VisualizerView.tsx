import { Color } from '@/store/usePaletteStore';
import { useState, useMemo } from 'react';
import { WebsiteMockup } from './WebsiteMockup';
import { AllDevicesMockup } from './templates/AllDevicesMockup';
import { MobileMockup } from './templates/MobileMockup';
import { SaaSVisualizer } from './templates/SaaSVisualizer';
import { EcommerceVisualizer } from './templates/EcommerceVisualizer';
import { IslamicVisualizer } from './templates/IslamicVisualizer';
import { TemplateSelector } from './TemplateSelector';
import { VisualizerToolbar } from './VisualizerToolbar';
import { ColorBlindnessFilters, VisionSimulation } from './ColorBlindnessFilters';

interface VisualizerViewProps {
    colors: Color[];
    onGenerate: () => void;
    onToggleLock: (id: string) => void;
    onUpdateColor: (id: string, newHex: string) => void;
    onUndo: () => void;
    onRedo: () => void;
    onExport: () => void;
    onShare: () => void;
    // Optional external control for Landing Page demo
    externalTemplate?: string;
}

export const VisualizerView = ({
    colors,
    onGenerate,
    onToggleLock,
    onUpdateColor,
    onUndo,
    onRedo,
    onExport,
    onShare,
    externalTemplate
}: VisualizerViewProps) => {
    const [localActiveTemplate, setLocalActiveTemplate] = useState<string>('all');
    const [currentFont, setCurrentFont] = useState<string>('var(--font-inter)');
    const [simulationMode, setSimulationMode] = useState<VisionSimulation>('normal');

    // Use external if provided, otherwise local
    const activeTemplate = externalTemplate || localActiveTemplate;

    // Mapping of color indices for shuffle
    const [colorMapping, setColorMapping] = useState<number[]>([0, 1, 2, 3, 4]);

    // Shuffle the mapping
    const handleShuffle = () => {
        const newMapping = [...colorMapping];
        for (let i = newMapping.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newMapping[i], newMapping[j]] = [newMapping[j], newMapping[i]];
        }
        setColorMapping(newMapping);
    };

    // Derived shuffled colors
    const mappedColors = useMemo(() => {
        return colorMapping.map(index => colors[index] || colors[0]);
    }, [colors, colorMapping]);

    const renderTemplate = () => {
        switch (activeTemplate) {
            case 'all':
                return <AllDevicesMockup colors={mappedColors} />;
            case 'mobile':
                return <MobileMockup colors={mappedColors} />;
            case 'saas':
                return <SaaSVisualizer colors={mappedColors} />;
            case 'ecommerce':
                return <EcommerceVisualizer colors={mappedColors} />;
            case 'islamic':
                return <IslamicVisualizer colors={mappedColors} />;
            case 'website':
            default:
                return <WebsiteMockup colors={mappedColors} isInteractive />;
        }
    };

    return (
        <div
            className="relative z-10 w-full min-h-[85vh] bg-gray-50 flex items-center justify-center overflow-hidden py-12"
            style={{
                fontFamily: currentFont,
                filter: simulationMode !== 'normal' ? `url('#${simulationMode}')` : 'none'
            }}
        >
            <ColorBlindnessFilters />

            {/* Template Selection Sidebar - Hide if controlled externally (Landing Page) */}
            {!externalTemplate && (
                <TemplateSelector activeTemplate={activeTemplate} onSelectTemplate={setLocalActiveTemplate} />
            )}

            {/* Main Mockup Area */}
            <div className="w-full h-full relative">
                {renderTemplate()}
            </div>

            {/* New Toolbar */}
            <VisualizerToolbar
                colors={colors}
                onUpdateColor={onUpdateColor}
                onGenerate={() => {
                    handleShuffle(); // Keymapped to Dice
                    onGenerate();
                }}
                onUndo={onUndo}
                onRedo={onRedo}
                onExport={onExport}
                onShare={onShare}
                currentFont={currentFont}
                onFontChange={setCurrentFont}
                simulationMode={simulationMode}
                onSimulationChange={setSimulationMode}
                colorMapping={colorMapping}
                isEmbedded={!!externalTemplate}
            />
        </div>
    );
};
