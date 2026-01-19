'use client';

import { Color } from '@/store/usePaletteStore';
import { Battery, Wifi, Signal, Bell, Home, User, Settings, Search, Heart, Mail } from 'lucide-react';
import chroma from 'chroma-js';

interface MobileMockupProps {
    colors: Color[];
}

export const MobileMockup = ({ colors }: MobileMockupProps) => {
    // 0: Text, 1: Background, 2: Primary, 3: Secondary, 4: Accent
    const cText = colors[0].hex;
    const cBg = colors[1].hex;
    const cPrim = colors[2].hex;
    const cSec = colors[3].hex;
    const cAcc = colors[4].hex;

    const textOnPrim = chroma.contrast(cPrim, '#ffffff') > 3 ? '#ffffff' : '#000000';

    return (
        <div className="w-full h-full flex items-center justify-center p-8 bg-gray-50/50 backdrop-blur-sm overflow-hidden">
            {/* Phone Frame */}
            <div
                className="w-[320px] h-[640px] rounded-[40px] border-[8px] bg-white relative shadow-2xl overflow-hidden flex flex-col"
                style={{ borderColor: '#1f2937' }} // Dark bezel
            >
                {/* Status Bar */}
                <div className="h-8 flex items-center justify-between px-6 pt-2 shrink-0" style={{ backgroundColor: cBg, color: cText }}>
                    <span className="text-xs font-medium">9:41</span>
                    <div className="flex gap-1.5 opacity-80">
                        <Signal size={12} />
                        <Wifi size={12} />
                        <Battery size={12} />
                    </div>
                </div>

                {/* App Content */}
                <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col" style={{ backgroundColor: cBg, color: cText }}>
                    {/* Header */}
                    <div className="px-5 pt-4 pb-2 flex justify-between items-center">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: chroma(cSec).alpha(0.1).css(), color: cSec }}>
                            <Settings size={16} />
                        </div>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center relative" style={{ backgroundColor: chroma(cSec).alpha(0.1).css(), color: cSec }}>
                            <Bell size={16} />
                            <div className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white" style={{ backgroundColor: cAcc }} />
                        </div>
                    </div>

                    {/* Greeting */}
                    <div className="px-5 py-4">
                        <h2 className="text-2xl font-bold leading-tight">Hello, <br /><span style={{ color: cPrim }}>Designer</span></h2>
                    </div>

                    {/* Search */}
                    <div className="px-5 mb-6">
                        <div className="h-12 rounded-2xl flex items-center px-4 gap-3" style={{ backgroundColor: chroma(cText).alpha(0.05).css() }}>
                            <Search size={18} className="opacity-40" />
                            <span className="text-sm opacity-40">Search for vibes...</span>
                        </div>
                    </div>

                    {/* Featured Card */}
                    <div className="px-5 mb-8">
                        <div className="w-full h-40 rounded-3xl p-5 flex flex-col justify-between shadow-lg relative overflow-hidden" style={{ backgroundColor: cPrim, color: textOnPrim }}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider opacity-80">Premium</span>
                                <h3 className="text-xl font-bold mt-1">Upgrade your <br />Workflow</h3>
                            </div>
                            <button className="self-start px-4 py-2 rounded-xl text-xs font-bold bg-white/20 backdrop-blur-md">
                                Get Started
                            </button>
                        </div>
                    </div>

                    {/* Categories / Items */}
                    <div className="px-5 mb-4 flex justify-between items-center">
                        <h3 className="font-bold">Recent Projects</h3>
                        <span className="text-xs font-medium opacity-60">See All</span>
                    </div>

                    <div className="px-5 space-y-4 pb-20">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-2xl" style={{ backgroundColor: chroma(cText).alpha(0.03).css() }}>
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold" style={{ backgroundColor: i === 1 ? cSec : i === 2 ? cAcc : chroma(cPrim).alpha(0.5).css(), color: '#fff' }}>
                                    {i === 1 ? 'Ui' : i === 2 ? '3d' : 'Br'}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm">Project {i}</h4>
                                    <p className="text-xs opacity-50">Updated 2m ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Nav */}
                <div className="h-16 shrink-0 flex items-center justify-around px-2 border-t" style={{ backgroundColor: cBg, borderColor: chroma(cText).alpha(0.1).css() }}>
                    <div className="p-2 rounded-xl" style={{ color: cPrim }}><Home size={22} /></div>
                    <div className="p-2 rounded-xl opacity-40"><Heart size={22} /></div>
                    <div className="p-2 rounded-xl opacity-40"><Mail size={22} /></div>
                    <div className="p-2 rounded-xl opacity-40"><User size={22} /></div>
                </div>

                {/* Home Indicator */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full bg-black/20" />
            </div>
        </div>
    );
};
