'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Smartphone, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CrossPlatformPage() {
    const [primary, setPrimary] = useState('#007AFF'); // iOS Blue default
    const [bg, setBg] = useState('#F2F2F7'); // iOS Gray default

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-100 p-6 md:p-10">
                <header className="max-w-4xl mx-auto mb-10 text-center">
                    <h1 className="text-3xl font-black text-gray-900 mb-4">Cross-Platform Consistency</h1>
                    <p className="text-gray-500">
                        Check how your colors adapt to system-native components on iOS and Android.
                    </p>
                </header>

                <div className="flex justify-center mb-8 gap-4">
                    <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm">
                        <div className="w-8 h-8 rounded-full" style={{ backgroundColor: primary }} />
                        <input type="color" value={primary} onChange={(e) => setPrimary(e.target.value)} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">

                    {/* iOS Simulation */}
                    <div className="flex flex-col items-center">
                        <div className="mb-4 font-bold text-gray-500 uppercase flex items-center gap-2"><Smartphone size={16} /> iOS Style</div>
                        <div className="w-[320px] h-[600px] bg-white rounded-[48px] border-[8px] border-black overflow-hidden shadow-2xl relative">
                            {/* StatusBar */}
                            <div className="h-8 w-full bg-white/80 backdrop-blur flex justify-between px-6 items-center text-[10px] font-bold z-10 relative">
                                <span>9:41</span>
                                <div className="w-16 h-4 bg-black rounded-full absolute left-1/2 -translate-x-1/2 -top-2" />
                                <span>5G</span>
                            </div>

                            {/* Nav Bar */}
                            <div className="bg-white/80 backdrop-blur border-b border-gray-200 p-4">
                                <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                            </div>

                            <div className="bg-[#F2F2F7] h-full p-4 space-y-4">
                                <div className="bg-white rounded-xl overflow-hidden">
                                    <div className="p-3 flex items-center justify-between border-b border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-md flex items-center justify-center text-white" style={{ backgroundColor: primary }}>A</div>
                                            <span className="text-sm font-medium">Appearance</span>
                                        </div>
                                        <span className="text-gray-400">›</span>
                                    </div>
                                    <div className="p-3 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-md flex items-center justify-center text-white" style={{ backgroundColor: primary }}>N</div>
                                            <span className="text-sm font-medium">Notifications</span>
                                        </div>
                                        <span className="text-gray-400">›</span>
                                    </div>
                                </div>
                                <button className="w-full py-3 rounded-xl text-white font-bold text-sm" style={{ backgroundColor: primary }}>
                                    Save Changes
                                </button>
                            </div>

                            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-black rounded-full" />
                        </div>
                    </div>

                    {/* Android Simulation */}
                    <div className="flex flex-col items-center">
                        <div className="mb-4 font-bold text-gray-500 uppercase flex items-center gap-2"><Smartphone size={16} /> Android Style</div>
                        <div className="w-[320px] h-[600px] bg-white rounded-[24px] border-[8px] border-black overflow-hidden shadow-2xl relative">
                            {/* StatusBar */}
                            <div className="h-6 w-full flex justify-between px-4 items-center text-[10px] font-bold text-white z-10 relative" style={{ backgroundColor: primary }}>
                                <span>10:00</span>
                                <span>100%</span>
                            </div>

                            {/* AppBar */}
                            <div className="h-14 flex items-center px-4 shadow-md text-white font-bold text-lg" style={{ backgroundColor: primary }}>
                                Settings
                            </div>

                            <div className="bg-[#f5f5f5] h-full p-4 space-y-4">
                                <div className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: primary }}>
                                        A
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-gray-800">Appearance</div>
                                        <div className="text-xs text-gray-500">Theme, wallpaper</div>
                                    </div>
                                </div>

                                <div className="absolute bottom-8 right-6 w-14 h-14 rounded-2xl shadow-lg flex items-center justify-center text-white text-2xl" style={{ backgroundColor: primary }}>
                                    +
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
}
