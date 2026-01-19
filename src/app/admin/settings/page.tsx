'use client';

import { useState } from 'react';
import { Save, Globe, Lock, DollarSign, Image as ImageIcon } from 'lucide-react';
import clsx from 'clsx';

export default function AdminSettings() {
    const [isLoading, setIsLoading] = useState(false);
    const [settings, setSettings] = useState({
        siteName: 'Dopely Colors',
        metaTitle: 'Dopely Colors - Advanced Palette Generator & Design System Tool',
        metaDescription: 'Generate beautiful color palettes, visualize design systems, and export code for Tailwind, React, and more.',
        maintenanceMode: false,
        adsEnabled: true,
        proPrice: 12
    });

    const handleSave = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            alert('Settings saved successfully!');
        }, 1000);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Global Settings</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage site configuration, SEO, and system status.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className={clsx(
                        "flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all shadow-lg",
                        isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                    )}
                >
                    <Save size={18} />
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="space-y-6">

                {/* General Settings */}
                <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Globe size={18} />
                        </div>
                        <h2 className="font-bold text-gray-900">General Information</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Site Name</label>
                            <input
                                type="text"
                                value={settings.siteName}
                                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                            />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Logo</label>
                                <div className="h-32 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50 transition-all cursor-pointer">
                                    <ImageIcon size={24} className="mb-2" />
                                    <span className="text-xs font-semibold">Upload New Logo</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Favicon</label>
                                <div className="h-32 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50 transition-all cursor-pointer">
                                    <ImageIcon size={24} className="mb-2" />
                                    <span className="text-xs font-semibold">Upload Favicon</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SEO Settings */}
                <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                            <Globe size={18} />
                        </div>
                        <h2 className="font-bold text-gray-900">SEO Defaults</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Default Meta Title</label>
                            <input
                                type="text"
                                value={settings.metaTitle}
                                onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Default Meta Description</label>
                            <textarea
                                value={settings.metaDescription}
                                onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                                className="w-full h-24 px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all resize-none"
                            />
                        </div>
                    </div>
                </section>

                {/* Monetization & System */}
                <div className="grid md:grid-cols-2 gap-6">
                    <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                            <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                                <DollarSign size={18} />
                            </div>
                            <h2 className="font-bold text-gray-900">Monetization</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="font-bold text-gray-700">Enable AdSense</label>
                                <button
                                    onClick={() => setSettings({ ...settings, adsEnabled: !settings.adsEnabled })}
                                    className={clsx(
                                        "w-12 h-6 rounded-full transition-colors relative",
                                        settings.adsEnabled ? "bg-green-500" : "bg-gray-200"
                                    )}
                                >
                                    <div className={clsx("absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm", settings.adsEnabled ? "left-7" : "left-1")} />
                                </button>
                            </div>
                            <div className="pt-4 border-t border-gray-100">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Pro Monthly Price ($)</label>
                                <input
                                    type="number"
                                    value={settings.proPrice}
                                    onChange={(e) => setSettings({ ...settings, proPrice: Number(e.target.value) })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                                />
                            </div>
                        </div>
                    </section>

                    <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                                <Lock size={18} />
                            </div>
                            <h2 className="font-bold text-gray-900">System</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="font-bold text-gray-700 block">Maintenance Mode</label>
                                    <p className="text-xs text-gray-500">Disable access for non-admins</p>
                                </div>
                                <button
                                    onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                                    className={clsx(
                                        "w-12 h-6 rounded-full transition-colors relative",
                                        settings.maintenanceMode ? "bg-red-500" : "bg-gray-200"
                                    )}
                                >
                                    <div className={clsx("absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm", settings.maintenanceMode ? "left-7" : "left-1")} />
                                </button>
                            </div>
                        </div>
                    </section>
                </div>

            </div>
        </div>
    );
}
