'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { NeurodiversityGuide } from '@/components/content/AdvancedGuides';
import { Smile, Zap, BookOpen, User, VolumeX, Sun, Sliders, Check, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils'; // Assuming cn utility exists

const PERSONAS = [
    {
        id: 'alex-adhd',
        name: 'Alex',
        tag: 'ADHD',
        desc: 'Struggles with visual clutter and distraction.',
        mode: 'Focus',
        params: { sat: 0.8, contrast: 1.2, noise: 0 }
    },
    {
        id: 'sam-autism',
        name: 'Sam',
        tag: 'Autism',
        desc: 'Sensitive to bright lights and high-contrast vibration.',
        mode: 'Calm',
        params: { sat: 0.5, contrast: 0.8, noise: 0 }
    },
    {
        id: 'mia-dyslexia',
        name: 'Mia',
        tag: 'Dyslexia',
        desc: 'Needs clear fonts and warm, non-white backgrounds.',
        mode: 'Clarity',
        params: { sat: 1, contrast: 1, cream: true }
    }
];

export default function NeurodiversityPage() {
    const [persona, setPersona] = useState(PERSONAS[0]);
    const [stimulation, setStimulation] = useState(50); // 0-100

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-[#FAFAF9] font-sans text-stone-800 pb-20 transition-colors duration-700"
                style={{ backgroundColor: persona.params.cream ? '#FFFBEB' : '#FAFAF9' }}>

                {/* Header: Friendly/Calm */}
                <header className="max-w-5xl mx-auto pt-12 mb-12 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-stone-200/50 rounded-full text-stone-600 font-bold text-xs uppercase tracking-widest mb-6">
                        <Smile size={16} /> Sensory Safe Guard
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-stone-900 mb-6 tracking-tight">
                        Design for <span className="text-stone-500">Every Mind.</span>
                    </h1>
                    <p className="text-xl text-stone-500 max-w-2xl mx-auto leading-relaxed">
                        Neurodivergent users process sensory data differently.
                        Optimize your palette to reduce overload and improve focus.
                    </p>
                </header>

                <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 px-6">

                    {/* Left: Persona Selector */}
                    <div className="md:col-span-4 space-y-8">
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-stone-400 mb-4 ml-2">Select Persona</h3>
                            <div className="space-y-3">
                                {PERSONAS.map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => setPersona(p)}
                                        className={cn(
                                            "w-full p-4 rounded-3xl text-left border-2 transition-all duration-300 relative overflow-hidden group",
                                            persona.id === p.id
                                                ? "bg-white border-stone-800 shadow-xl scale-105"
                                                : "bg-white border-transparent shadow-sm hover:scale-102 hover:shadow-md"
                                        )}
                                    >
                                        <div className="flex items-center gap-4 relative z-10">
                                            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg",
                                                persona.id === p.id ? "bg-stone-800 text-white" : "bg-stone-100 text-stone-400")}>
                                                {p.name[0]}
                                            </div>
                                            <div>
                                                <div className="font-bold text-lg text-stone-900">{p.name}</div>
                                                <div className="text-xs font-bold uppercase tracking-wider text-stone-400">{p.tag}</div>
                                            </div>
                                        </div>
                                        {persona.id === p.id && (
                                            <div className="absolute top-4 right-4 text-stone-800">
                                                <Check size={20} />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sensory Control */}
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-stone-100">
                            <div className="flex items-center gap-3 mb-6">
                                <Activity className="text-stone-400" />
                                <h3 className="font-bold text-lg text-stone-700">Stimulation</h3>
                            </div>
                            <input
                                type="range"
                                min="0" max="100"
                                value={stimulation}
                                onChange={(e) => setStimulation(Number(e.target.value))}
                                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-800 mb-4"
                            />
                            <div className="flex justify-between text-xs font-bold text-stone-400 uppercase tracking-widest">
                                <span>Low (Calm)</span>
                                <span>High (Energetic)</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Adaptive Preview */}
                    <div className="md:col-span-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={persona.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border-[8px] border-white ring-1 ring-stone-100 min-h-[600px] flex flex-col"
                            >
                                {/* Simulated App UI */}
                                <div className="flex-1 p-10 flex flex-col gap-8 transition-colors duration-500"
                                    style={{
                                        backgroundColor: persona.params.cream ? '#FFFBEB' : '#fff',
                                        filter: persona.id === 'sam-autism' ? `saturate(${0.5 + (stimulation / 200)})` : 'none'
                                    }}
                                >
                                    {/* App Header */}
                                    <div className="flex justify-between items-center">
                                        <div className="w-10 h-10 rounded-full bg-stone-900 opacity-10" />
                                        <div className="flex gap-4 text-sm font-bold text-stone-400">
                                            <span>Dashboard</span>
                                            <span className="text-stone-900">Tasks</span>
                                            <span>Settings</span>
                                        </div>
                                    </div>

                                    {/* Hero Message */}
                                    <div className="py-10">
                                        <h2 className="text-4xl font-bold mb-4 text-stone-900 leading-tight">
                                            Good Morning,<br />
                                            {persona.name}.
                                        </h2>
                                        <p className="text-lg text-stone-500 max-w-md">
                                            {persona.desc} This interface adapts to your needs.
                                        </p>
                                    </div>

                                    {/* Sensory Cards */}
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="p-8 rounded-[2rem] bg-stone-100 transition-all hover:scale-105 duration-300 group">
                                            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 text-stone-800 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                                <Zap size={24} />
                                            </div>
                                            <div className="font-bold text-xl text-stone-800 mb-1">Focus Mode</div>
                                            <div className="text-sm text-stone-500">Active</div>
                                        </div>
                                        <div className="p-8 rounded-[2rem] bg-stone-100 transition-all hover:scale-105 duration-300 group">
                                            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 text-stone-800 group-hover:bg-green-500 group-hover:text-white transition-colors">
                                                <BookOpen size={24} />
                                            </div>
                                            <div className="font-bold text-xl text-stone-800 mb-1">Readability</div>
                                            <div className="text-sm text-stone-500">Optimized</div>
                                        </div>
                                    </div>

                                    {/* Info Banner */}
                                    <div className="mt-auto bg-stone-900 text-stone-200 p-6 rounded-2xl flex items-center gap-4">
                                        <div className="p-2 bg-white/10 rounded-full">
                                            <VolumeX size={20} />
                                        </div>
                                        <div className="text-sm font-medium">
                                            <strong>Sensory Guard Active:</strong> Reduced {persona.id === 'alex-adhd' ? 'visual clutter' : persona.id === 'sam-autism' ? 'color vibration' : 'contrast glare'}.
                                        </div>
                                    </div>

                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                </main>

                <div className="max-w-7xl mx-auto px-10 mt-20">
                    <NeurodiversityGuide />
                </div>
            </div>
        </DashboardLayout>
    );
}
