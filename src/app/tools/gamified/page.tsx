'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GamifiedGuide } from '@/components/content/UtilityGuides';
import { Gamepad2, Trophy, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GamifiedPage() {
    const [level, setLevel] = useState(1);
    const [theme, setTheme] = useState('platformer'); // platformer, rpg, puzzle

    // Themes
    const THEMES: Record<string, string[]> = {
        'platformer': ['#FFD700', '#32CD32', '#00BFFF', '#FF4500'], // Bright, Primary
        'rpg': ['#8B4513', '#2F4F4F', '#DAA520', '#800000'], // Earthy, Medieval
        'puzzle': ['#FF69B4', '#9370DB', '#00FA9A', '#FFFF00'], // Candy, Pop
    };

    const colors = THEMES[theme];

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-900 border-b-8 border-gray-800 p-6 md:p-10 flex flex-col items-center">

                <header className="max-w-2xl text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400 text-black text-xs font-black uppercase tracking-wider mb-4 border-2 border-black shadow-[4px_4px_0px_0px_bg-black]">
                        <Gamepad2 size={16} /> Game Dev Mode
                    </div>
                    <h1 className="text-5xl font-black text-white mb-4 tracking-tight drop-shadow-md">
                        Gamified Palette
                    </h1>
                    <p className="text-xl text-gray-400">
                        Design for engagement. High-energy, dopamine-inducing color schemes for apps and games.
                    </p>
                </header>

                {/* Game Console */}
                <div className="max-w-4xl w-full bg-gray-800 rounded-[40px] p-4 shadow-2xl border-4 border-gray-700">
                    <div className="bg-black rounded-[32px] overflow-hidden relative min-h-[400px] flex">

                        {/* Sidebar */}
                        <div className="w-1/4 bg-gray-900/50 p-6 border-r border-white/10 flex flex-col gap-4">
                            <label className="text-xs font-bold text-gray-500 uppercase">Select Genre</label>
                            {Object.keys(THEMES).map(t => (
                                <button
                                    key={t}
                                    onClick={() => setTheme(t)}
                                    className={`p-3 rounded-xl font-bold uppercase text-sm text-left transition-all ${theme === t ? 'bg-white text-black translate-x-2' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                                >
                                    {t}
                                </button>
                            ))}

                            <div className="mt-auto">
                                <label className="text-xs font-bold text-gray-500 uppercase">Current Level</label>
                                <div className="text-4xl font-black text-white">{level}</div>
                            </div>
                        </div>

                        {/* Game Area */}
                        <div className="flex-1 p-8 relative overflow-hidden" style={{ backgroundColor: theme === 'platformer' ? '#87CEEB' : theme === 'rpg' ? '#1a1a1a' : '#2b2b2b' }}>

                            {/* Scene Content */}
                            {theme === 'platformer' && (
                                <>
                                    <div className="absolute bottom-0 inset-x-0 h-16" style={{ backgroundColor: colors[1] }} /> {/* Ground */}
                                    <div className="absolute bottom-16 left-20 w-12 h-12 rounded-lg" style={{ backgroundColor: colors[3] }} /> {/* Player */}
                                    <div className="absolute top-20 right-20 w-16 h-16 rounded-full animate-bounce" style={{ backgroundColor: colors[0], boxShadow: `0 0 20px ${colors[0]}` }} /> {/* Coin */}
                                    <div className="absolute bottom-32 left-60 w-32 h-8 rounded-full" style={{ backgroundColor: colors[2] }} /> {/* Cloud */}
                                </>
                            )}

                            {theme === 'rpg' && (
                                <>
                                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent z-10" />
                                    <div className="absolute center inset-0 flex items-center justify-center">
                                        <div className="w-64 h-80 rounded text-center border-4" style={{ backgroundColor: '#2a2a2a', borderColor: colors[2] }}>
                                            <div className="p-2 border-b-2 text-white font-bold uppercase" style={{ backgroundColor: colors[3], borderColor: colors[2] }}>Inventory</div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* UI Overlay */}
                            <div className="absolute top-6 left-6 flex gap-4">
                                <div className="bg-black/50 backdrop-blur rounded-full px-4 py-2 flex items-center gap-2 text-white font-bold border-2" style={{ borderColor: colors[0] }}>
                                    <Star size={16} fill={colors[0]} stroke={colors[0]} />
                                    <span>2400</span>
                                </div>
                                <div className="bg-black/50 backdrop-blur rounded-full px-4 py-2 flex items-center gap-2 text-white font-bold border-2" style={{ borderColor: colors[1] }}>
                                    <Trophy size={16} fill={colors[1]} stroke={colors[1]} />
                                    <span>Rank #1</span>
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* Controls Bottom */}
                    <div className="p-6 flex justify-between items-center text-gray-400">
                        <div className="flex gap-2">
                            {colors.map((c, i) => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-700" style={{ backgroundColor: c }} />
                            ))}
                        </div>
                        <div className="font-mono text-xs uppercase opacity-50">Press Start</div>
                    </div>
                </div>

                <GamifiedGuide />
            </div>
        </DashboardLayout>
    );
}
