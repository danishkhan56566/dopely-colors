'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CulturalGuide } from '@/components/content/UtilityGuides';
import { Globe2, Map } from 'lucide-react';

const CULTURES = [
    {
        id: 'china',
        name: 'China',
        colors: { red: 'Luck, Joy, Celebration', white: 'Mourning, Death', yellow: 'Royalty, Power' },
        palette: ['#ff0000', '#ffffff', '#ffff00']
    },
    {
        id: 'west',
        name: 'Western (US/EU)',
        colors: { red: 'Danger, Love, Passion', white: 'Purity, Peace', black: 'Sophistication, Mourning' },
        palette: ['#ff0000', '#ffffff', '#000000']
    },
    {
        id: 'india',
        name: 'India',
        colors: { saffron: 'Sacred, Courage', green: 'Harvest, Hope', red: 'Purity, Marriage' },
        palette: ['#FF9933', '#138808', '#ff0000']
    }
];

export default function CulturalPage() {
    const [active, setActive] = useState(CULTURES[0]);

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-amber-50 p-6 md:p-10">
                <header className="max-w-4xl mx-auto mb-12 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-200 text-amber-900 text-xs font-bold uppercase tracking-wider mb-4">
                        <Globe2 size={14} /> Global Context
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-4">Cultural Advisor</h1>
                    <p className="text-lg text-gray-600">
                        Colors mean different things in different places. Check your palette for international safety.
                    </p>
                </header>

                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

                    <div className="md:col-span-1 space-y-2">
                        {CULTURES.map(c => (
                            <button
                                key={c.id}
                                onClick={() => setActive(c)}
                                className={`w-full p-4 rounded-xl text-left font-bold transition-all ${active.id === c.id ? 'bg-white shadow text-amber-900' : 'bg-transparent text-gray-500 hover:bg-amber-100'}`}
                            >
                                {c.name}
                            </button>
                        ))}
                    </div>

                    <div className="md:col-span-2 bg-white p-8 rounded-3xl shadow-sm">
                        <h2 className="text-3xl font-black mb-6">{active.name} Color Semantics</h2>

                        <div className="space-y-6">
                            {Object.entries(active.colors).map(([colorName, meaning]) => (
                                <div key={colorName} className="flex gap-4 items-start pb-4 border-b border-gray-100 last:border-0">
                                    <div className="w-16 h-16 rounded-2xl shadow-inner shrink-0"
                                        style={{ backgroundColor: colorName === 'saffron' ? '#FF9933' : colorName }}
                                    />
                                    <div>
                                        <h3 className="font-bold text-lg capitalize">{colorName}</h3>
                                        <p className="text-gray-500">{meaning}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 p-4 bg-blue-50 text-blue-800 rounded-xl text-sm">
                            <strong>Note:</strong> While valid, color meanings are evolving. Always check contemporary usage contexts.
                        </div>
                    </div>

                </div>
                <CulturalGuide />
                <CulturalGuide />
            </div>
        </DashboardLayout>
    );
}
