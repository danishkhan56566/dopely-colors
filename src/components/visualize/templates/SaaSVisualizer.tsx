'use client';

import { Color } from '@/store/usePaletteStore';
import { BarChart3, Users, DollarSign, Activity, Search, Bell, Settings, MoreVertical } from 'lucide-react';
import clsx from 'clsx';

interface TemplateProps {
    colors: Color[];
}

export const SaaSVisualizer = ({ colors }: TemplateProps) => {
    // Map colors to semantic roles
    const bg = colors[0].hex; // Background
    const surface = colors[1].hex; // Cards/Sidebar
    const text = colors[4].hex; // Text
    const accent = colors[2].hex; // Primary Actions
    const secondary = colors[3].hex; // Secondary elements

    // Determine contrast for text
    const isDark = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return (r * 299 + g * 587 + b * 114) / 1000 < 128;
    };

    const textColor = (bgHex: string) => isDark(bgHex) ? '#ffffff' : '#111827';
    const mutedColor = (bgHex: string) => isDark(bgHex) ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)';
    const borderColor = (bgHex: string) => isDark(bgHex) ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';

    return (
        <div className="w-full h-full flex overflow-hidden" style={{ backgroundColor: bg, color: textColor(bg) }}>
            {/* Sidebar */}
            <div className="w-64 flex-shrink-0 flex flex-col border-r" style={{ backgroundColor: surface, borderColor: borderColor(surface) }}>
                <div className="p-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-lg" style={{ backgroundColor: accent }}>
                            D
                        </div>
                        <span className="font-bold text-lg" style={{ color: textColor(surface) }}>Dashboard</span>
                    </div>
                </div>

                <div className="flex-1 px-4 space-y-1">
                    {['Overview', 'Analytics', 'Customers', 'Products', 'Finance'].map((item, i) => (
                        <div
                            key={item}
                            className={clsx(
                                "px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-colors flex items-center gap-3",
                                i === 0 ? "bg-opacity-10" : "hover:bg-black/5"
                            )}
                            style={{
                                backgroundColor: i === 0 ? accent : 'transparent',
                                color: i === 0 ? accent : mutedColor(surface)
                            }}
                        >
                            {i === 0 && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />}
                            <span style={{ color: i === 0 ? accent : mutedColor(surface) }}>{item}</span>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t" style={{ borderColor: borderColor(surface) }}>
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200" />
                        <div className="text-xs">
                            <div className="font-bold" style={{ color: textColor(surface) }}>Admin User</div>
                            <div style={{ color: mutedColor(surface) }}>admin@company.com</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Header */}
                <header className="h-16 flex items-center justify-between px-8 border-b" style={{ backgroundColor: surface, borderColor: borderColor(surface) }}>
                    <h1 className="font-bold text-xl" style={{ color: textColor(surface) }}>Overview</h1>
                    <div className="flex items-center gap-4">
                        <Search size={20} style={{ color: mutedColor(surface) }} />
                        <Bell size={20} style={{ color: mutedColor(surface) }} />
                        <div className="h-8 w-px bg-gray-200" style={{ backgroundColor: borderColor(surface) }}></div>
                        <button className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90" style={{ backgroundColor: accent }}>
                            + New Report
                        </button>
                    </div>
                </header>

                {/* Body */}
                <div className="flex-1 overflow-auto p-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-6 mb-8">
                        {[
                            { label: 'Total Revenue', value: '$45,231.89', change: '+20.1%', icon: DollarSign },
                            { label: 'Active Users', value: '+2350', change: '+180.1%', icon: Users },
                            { label: 'Sales', value: '+12,234', change: '+19%', icon: Activity },
                            { label: 'Active Now', value: '+573', change: '+201', icon: BarChart3 }
                        ].map((stat, i) => (
                            <div key={i} className="p-6 rounded-2xl border shadow-sm" style={{ backgroundColor: surface, borderColor: borderColor(surface) }}>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm font-medium" style={{ color: mutedColor(surface) }}>{stat.label}</span>
                                    <stat.icon size={16} style={{ color: mutedColor(surface) }} />
                                </div>
                                <div className="text-2xl font-bold mb-1" style={{ color: textColor(surface) }}>{stat.value}</div>
                                <div className="text-xs" style={{ color: mutedColor(surface) }}>{stat.change} from last month</div>
                            </div>
                        ))}
                    </div>

                    {/* Charts Area */}
                    <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-2 p-6 rounded-2xl border shadow-sm" style={{ backgroundColor: surface, borderColor: borderColor(surface) }}>
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="font-bold" style={{ color: textColor(surface) }}>Revenue Overview</h3>
                                <MoreVertical size={16} style={{ color: mutedColor(surface) }} />
                            </div>
                            <div className="h-64 flex items-end justify-between gap-2 px-2">
                                {[40, 70, 45, 90, 65, 80, 50, 60, 75, 55, 95, 85].map((h, i) => (
                                    <div
                                        key={i}
                                        className="w-full rounded-t-sm transition-all hover:opacity-80"
                                        style={{
                                            height: `${h}%`,
                                            backgroundColor: i % 2 === 0 ? accent : secondary,
                                            opacity: i % 2 === 0 ? 1 : 0.6
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl border shadow-sm" style={{ backgroundColor: surface, borderColor: borderColor(surface) }}>
                            <h3 className="font-bold mb-6" style={{ color: textColor(surface) }}>Recent Sales</h3>
                            <div className="space-y-6">
                                {[1, 2, 3, 4, 5].map((_, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ backgroundColor: i % 2 === 0 ? accent : secondary, color: '#fff' }}>
                                            {['JD', 'AS', 'WK', 'LM', 'PR'][i]}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm font-medium" style={{ color: textColor(surface) }}>Olivia Martin</div>
                                            <div className="text-xs" style={{ color: mutedColor(surface) }}>olivia.martin@email.com</div>
                                        </div>
                                        <div className="text-sm font-bold" style={{ color: textColor(surface) }}>+$1,999.00</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
