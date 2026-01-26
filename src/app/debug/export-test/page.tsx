
'use client';

import { AIExportCard } from '@/components/ai/AIExportCard';
import { DesignState } from '@/lib/ai-assistant';

import { DesignSystemGenerator } from '@/lib/design-system-generator';

export default function ExportTestPage() {

    const generator = new DesignSystemGenerator('#6C5CE7');
    const system = generator.generateAll('Test Brand');

    // 1. Mock Design State
    const mockDesign: DesignState = {
        brand_colors: {
            primary: '#6C5CE7',
            secondary: '#0984E3',
            accent: '#A29BFE',
            background: '#1E272E',
            text: '#FFFFFF'
        },
        system: system,
        mode: 'dark',
        vibe: 'Modern',
        brightness_level: 0,
        saturation_level: 0,
        history: [],
        version_id: 'v1.0-test',
        explanation: 'Test explanation'
    };

    return (
        <div className="p-12 max-w-xl mx-auto space-y-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-black text-gray-900">Export System Test Room</h1>
            <p className="text-gray-500">
                This page isolates the AIExportCard to verify UI interactions and styling correctness directly.
            </p>

            {/* The Component Under Test */}
            <AIExportCard design={mockDesign} />

            <div className="mt-12 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                <strong>Test Checklist:</strong>
                <ul className="list-disc ml-5 mt-2 space-y-1">
                    <li>Select "Figma" &rarr; Click Download &rarr; Check for .json</li>
                    <li>Select "CSS" &rarr; Click Download &rarr; Check for .css</li>
                    <li>Select "Tailwind" &rarr; Click Download &rarr; Check for .js</li>
                    <li>Click Copy icons &rarr; Verify toast success</li>
                </ul>
            </div>
        </div>
    );
}
