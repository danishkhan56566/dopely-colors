'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SeasonalGuide } from '@/components/content/UtilityGuides';
import { Calendar, CloudSnow, Sun, CloudRain, Wind } from 'lucide-react';
import chroma from 'chroma-js';

const SEASONS = [
    { id: 'spring', name: 'Spring', icon: CloudRain, colors: ['#a7f3d0', '#fbcfe8', '#fde047', '#60a5fa'], desc: 'Growth, Renewal, Fresh' },
    { id: 'summer', name: 'Summer', icon: Sun, colors: ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'], desc: 'Energy, Heat, Vibrant' },
    { id: 'autumn', name: 'Autumn', icon: Wind, colors: ['#7c2d12', '#ea580c', '#d97706', '#fcd34d'], desc: 'Harvest, Cozy, Earthy' },
    { id: 'winter', name: 'Winter', icon: CloudSnow, colors: ['#1e3a8a', '#3b82f6', '#93c5fd', '#ffffff'], desc: 'Cold, Silence, Clean' },
];

export default function SeasonalPage() {
    const [season, setSeason] = useState(SEASONS[0]);

    return (
        <DashboardLayout>
            <div
                className="min-h-screen transition-colors duration-700 p-6 md:p-10 flex flex-col items-center"
                style={{ backgroundColor: season.colors[0] }}
            >
                <header className="max-w-4xl mx-auto mb-12 text-center bg-white/80 backdrop-blur p-8 rounded-3xl shadow-lg">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-black/60 text-xs font-bold uppercase tracking-wider mb-4">
                        <Calendar size={14} /> Seasonal Trends
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-2">Seasonal Generator</h1>
                    <p className="text-lg text-gray-500">
                        Sync your palette with the time of year.
                    </p>
                </header>

                <div className="flex gap-4 mb-12 flex-wrap justify-center">
                    {SEASONS.map(s => (
                        <button
                            key={s.id}
                            onClick={() => setSeason(s)}
                            className={`px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl transition-transform hover:scale-105 ${season.id === s.id ? 'bg-white text-black' : 'bg-white/20 text-white hover:bg-white/40'}`}
                        >
                            <s.icon size={20} />
                            {s.name}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-4 gap-8 max-w-4xl w-full">
                    {season.colors.map((c, i) => (
                        <div key={i} className="aspect-[3/4] bg-white rounded-3xl p-4 shadow-2xl rotate-3 transition-transform hover:rotate-0 flex flex-col items-center">
                            <div className="w-full flex-1 rounded-2xl mb-4" style={{ backgroundColor: c }} />
                            <div className="font-mono text-sm font-bold uppercase">{c}</div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-white/80 font-bold text-xl drop-shadow-md">
                    {season.desc}
                </div>

                <SeasonalGuide />
            </div>
        </DashboardLayout>
    );
}
