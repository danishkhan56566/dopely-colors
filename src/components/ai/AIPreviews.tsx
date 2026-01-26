'use client';

import { motion } from 'framer-motion';
import { ShoppingCart, User, Bell, Search, LayoutGrid, Heart, Star, MapPin, Smartphone, Monitor, Store } from 'lucide-react';

import { DesignState } from '@/lib/ai-assistant';

interface PreviewProps {
    colors: string[]; // [primary, secondary, accent, bg, text]
    type: string;
    design?: DesignState | null;
}

// --- Platform Specific Mockup Components ---

const AndroidPreviewMockup = ({ design }: { design?: DesignState | null }) => {
    // In a real app, we would overlay the colors on this image using SVG masks or CSS mix-blend-mode
    // For this demo, we show the premium asset to represent the "Goal" state 
    // and use CSS blend modes to tint it with the user's palette.

    // Fallback if no system generated yet
    const mat = design?.system?.platforms.android_material;
    const primary = design?.brand_colors.primary || '#6200ea';

    return (
        <div className="w-[300px] h-[600px] bg-black rounded-[3rem] border-8 border-gray-900 overflow-hidden relative shadow-2xl mx-auto group">
            {/* The Base Image */}
            <div className="absolute inset-0 bg-gray-100">
                <img
                    src="/images/android_mockup.png"
                    alt="Android Design"
                    className="w-full h-full object-cover"
                // Fallback to a placehold if image not yet saved, but we will save it.
                // For now, let's look at the generated asset path strategy.
                // Ideally, we'd use the actual generated artifacts. 
                // Since I cannot host the artifact URL directly here easily without upload, 
                // I will use a robust CSS layout that mimics the generated image structure closely 
                // BUT heavily upgraded with "Glassmorphism" and "Mesh Gradients" as requested 
                // if I can't hot-link the generated image.
                //
                // WAIT: I can't put the local file path from the "generate_image" tool into the browser source reliably 
                // unless I move it to public. 
                //
                // Strategy Switch: I will BUILD the "10x UI" using highly advanced CSS 
                // derived from the inspiration of those images, because I cannot blindly 
                // link valid URLs to the local file system in a web app context easily.
                // 
                // I will create a <HighFidelityAndroid> component.
                />
            </div>

            {/* Dynamic Overlay using the User's Palette */}
            <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-60" style={{ backgroundColor: primary }}></div>

            {/* Interactive elements on top to prove it's code? No, user wants VISUALS. */}
            <div className="absolute bottom-10 inset-x-0 text-center text-white/80 text-xs font-medium">
                Note: Color tint applied to premium mockup
            </div>
        </div>
    );
};
// REVERTING: I will actually build the 10x CSS version because broken images are worse. 
// I will use the "inspiration" from the generated images to write better CSS Code below.

const HighFidelityAndroid = ({ design, type }: { design?: DesignState | null, type?: string }) => {
    const mat = design?.system?.platforms.android_material;
    const primary = design?.brand_colors.primary || '#6200ea';
    const surface = mat?.surface || '#fffbfe';
    const primaryContainer = mat?.primary_container || '#eaddff';
    const onPrimaryContainer = mat?.on_primary_container || '#21005d';

    // Content Switcher
    const isFood = type === 'food' || type === 'restaurant';
    const isTech = type === 'tech' || type === 'finance' || type === 'modern';
    const isIslamic = type === 'islamic';

    const headerTitle = isFood ? <>Delicious<br />Favorites</> : isTech ? <>Your<br />Finances</> : isIslamic ? <>Ramadan<br />Mubarak</> : <>Discover<br />The World</>;
    const chip1 = isFood ? 'Burgers' : isTech ? 'Cards' : isIslamic ? 'Prayers' : 'Flights';
    const chip2 = isFood ? 'Pizza' : isTech ? 'Savings' : isIslamic ? 'Dua' : 'Hotels';

    // Card
    const cardTitle = isFood ? 'Order #242' : isTech ? 'Total Balance' : isIslamic ? 'Next Prayer' : 'My Trips';
    const cardSub = isFood ? 'Arriving in 15 mins' : isTech ? '$12,450.00' : isIslamic ? 'Asr - 15:30' : '2 Upcoming flights';

    return (
        <div className="relative mx-auto">
            {/* Pixel Frame - Outer */}
            <div className="w-[340px] h-[700px] bg-[#1a1a1a] rounded-[3rem] p-[10px] shadow-2xl relative mx-auto border-4 border-[#333]">

                {/* Power Button */}
                <div className="absolute right-[-6px] top-32 w-1.5 h-10 bg-[#444] rounded-r-md"></div>
                {/* Volume Buttons */}
                <div className="absolute right-[-6px] top-48 w-1.5 h-20 bg-[#444] rounded-r-md"></div>

                {/* Inner Bezel & Screen */}
                <div className="w-full h-full bg-black rounded-[2.5rem] overflow-hidden relative border border-gray-800">

                    {/* Camera Punch Hole */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-50 ring-1 ring-gray-800"></div>

                    {/* Actual Content */}
                    <div className="h-full w-full bg-white relative flex flex-col" style={{ backgroundColor: surface }}>

                        {/* Header Image Area with Mesh Gradient */}
                        <div className="h-72 relative p-6 pt-12 flex flex-col justify-end text-white overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black z-0"></div>
                            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] opacity-60 blur-3xl rounded-full"
                                style={{ background: `radial-gradient(circle, ${primary}, transparent 70%)` }}></div>

                            <div className="relative z-10">
                                <span className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2 block">Explore</span>
                                <h2 className="text-4xl font-bold leading-tight mb-2">{headerTitle}</h2>
                                <div className="flex gap-2 mt-4">
                                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-medium">{chip1}</span>
                                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-medium">{chip2}</span>
                                </div>
                            </div>
                        </div>

                        {/* Cards Container */}
                        <div className="flex-1 -mt-6 relative z-20 bg-transparent px-4 pb-4 space-y-4 overflow-y-auto no-scrollbar">

                            {/* Featured Card */}
                            <div className="p-5 rounded-3xl shadow-lg relative overflow-hidden group" style={{ backgroundColor: primaryContainer }}>
                                <div className="absolute top-0 right-0 p-5 opacity-20">
                                    <MapPin size={48} color={onPrimaryContainer} />
                                </div>
                                <h3 className="text-xl font-bold mb-1" style={{ color: onPrimaryContainer }}>{cardTitle}</h3>
                                <p className="text-sm opacity-70 mb-4" style={{ color: onPrimaryContainer }}>{cardSub}</p>
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-300" />)}
                                </div>
                            </div>

                            {/* List */}
                            <div className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="p-3 flex items-center gap-4 hover:bg-gray-50 rounded-2xl transition-colors">
                                        <div className="w-12 h-12 rounded-2xl bg-gray-100 flex-shrink-0" />
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 text-sm">Item #{i}02</h4>
                                            <p className="text-xs text-gray-500">Details about this item...</p>
                                        </div>
                                        <button className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-100">
                                            <span className="text-gray-400">➜</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* FAB */}
                        <div className="absolute bottom-6 right-6 w-16 h-16 rounded-[1.2rem] shadow-xl shadow-gray-300/50 flex items-center justify-center text-white text-3xl transition-transform hover:scale-110 active:scale-95 cursor-pointer z-50" style={{ backgroundColor: primary }}>
                            +
                        </div>

                        {/* Android Navigation Bar */}
                        <div className="absolute bottom-1 left-0 right-0 h-4 flex justify-center items-center">
                            <div className="w-32 h-1 rounded-full bg-gray-300/50"></div>
                        </div>

                        {/* Bottom Bar */}
                        <div className="h-16 bg-white border-t border-gray-50 flex justify-around items-center px-2">
                            <div className="p-2 opacity-100 text-gray-900"><LayoutGrid size={24} color={primary} /></div>
                            <div className="p-2 opacity-40"><Search size={24} /></div>
                            <div className="p-2 opacity-40"><User size={24} /></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const HighFidelityIOS = ({ design, type }: { design?: DesignState | null, type?: string }) => {
    const ios = design?.system?.platforms.ios_hig;
    const sysBlue = ios?.systemPrimary.light || '#007AFF';
    const bg = ios?.systemGroupedBackground.light || '#F2F2F7';

    // Content Switcher
    const isFood = type === 'food' || type === 'restaurant';
    const isTech = type === 'tech' || type === 'finance' || type === 'modern';

    const settingsTitle = isFood ? 'My Profile' : isTech ? 'Account' : 'Settings';
    const group1 = isFood ? ['Order History', 'Payment Methods', 'Addresses'] : isTech ? ['Security', 'Limits', 'Statements'] : ['General', 'Accessibility', 'Privacy'];

    return (
        <div className="relative mx-auto">
            {/* iPhone 15 Pro Frame - Outer */}
            <div className="w-[340px] h-[700px] bg-[#2a2a2a] rounded-[3.5rem] p-[10px] shadow-2xl relative mx-auto border-[6px] border-[#1a1a1a] ring-1 ring-[#000]">

                {/* Side Buttons */}
                <div className="absolute left-[-8px] top-28 w-1 h-8 bg-[#2a2a2a] rounded-l-md"></div>
                <div className="absolute left-[-8px] top-40 w-1 h-16 bg-[#2a2a2a] rounded-l-md"></div>
                <div className="absolute left-[-8px] top-60 w-1 h-16 bg-[#2a2a2a] rounded-l-md"></div>
                <div className="absolute right-[-8px] top-40 w-1 h-24 bg-[#2a2a2a] rounded-r-md"></div>

                {/* Inner Bezel & Screen */}
                <div className="w-full h-full bg-black rounded-[3rem] overflow-hidden relative border-[6px] border-black">

                    {/* Screen Content */}
                    <div className="w-full h-full bg-gray-50 rounded-[2rem] overflow-hidden flex flex-col relative" style={{ backgroundColor: bg }}>

                        {/* Dynamic Island */}
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[120px] h-[35px] bg-black rounded-full z-50 flex items-center justify-between px-3 transition-all hover:w-[200px] cursor-pointer group">
                            <div className="w-8 h-8 rounded-full bg-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            </div>
                            <div className="w-10 h-1 rounded-full bg-gray-800/50"></div>
                        </div>

                        {/* Large Title Header */}
                        <div className="pt-16 pb-2 px-6 bg-white/80 backdrop-blur-xl sticky top-0 z-40 border-b border-gray-200/50">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-blue-500 text-lg" style={{ color: sysBlue }}>Edit</span>
                                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                                    {/* User Avatar Placeholder */}
                                </div>
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900">{settingsTitle}</h1>
                        </div>

                        {/* Content - Inset Grouped */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6">

                            {/* Hero Card like Apple ID */}
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-sm">
                                <div className="w-16 h-16 rounded-full bg-gray-200 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-gray-300 to-gray-100"></div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-gray-900">John User</h3>
                                    <p className="text-sm text-gray-500">Apple ID, iCloud, Media</p>
                                </div>
                            </div>

                            {/* Group 1 */}
                            <div className="bg-white rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100">
                                {group1.map((item, i) => (
                                    <div key={item} className="p-3.5 flex items-center justify-between active:bg-gray-50 transition-colors cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm`} style={{ backgroundColor: i === 0 ? 'gray' : i === 1 ? sysBlue : '#3b82f6' }}>
                                                <div className="w-4 h-4 bg-white/20 rounded-sm"></div>
                                            </div>
                                            <span className="font-medium text-[15px]">{item}</span>
                                        </div>
                                        <span className="text-gray-300">›</span>
                                    </div>
                                ))}
                            </div>

                            {/* Group 2 - Toggles */}
                            <div className="bg-white rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100">
                                <div className="p-3.5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center text-white" style={{ backgroundColor: '#34c759' }}>
                                            W
                                        </div>
                                        <span className="font-medium text-[15px]">Wi-Fi</span>
                                    </div>
                                    <span className="text-gray-400 text-sm">Home Network</span>
                                </div>
                                <div className="p-3.5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white" style={{ backgroundColor: sysBlue }}>
                                            B
                                        </div>
                                        <span className="font-medium text-[15px]">Bluetooth</span>
                                    </div>
                                    <div className="w-12 h-7 bg-green-500 rounded-full relative shadow-inner" style={{ backgroundColor: '#34c759' }}>
                                        <div className="absolute right-0.5 top-0.5 w-6 h-6 bg-white rounded-full shadow-md"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tab Bar */}
                        <div className="h-20 bg-white/80 backdrop-blur-xl border-t border-gray-200 flex justify-around items-start pt-3 shrink-0">
                            <div className="flex flex-col items-center gap-1">
                                <div className="w-6 h-6 rounded bg-current" style={{ color: sysBlue }}></div>
                                <span className="text-[10px] font-medium" style={{ color: sysBlue }}>{isFood ? 'Home' : 'Settings'}</span>
                            </div>
                            <div className="flex flex-col items-center gap-1 opacity-40">
                                <div className="w-6 h-6 rounded bg-current"></div>
                                <span className="text-[10px] font-medium">Search</span>
                            </div>
                        </div>

                        {/* Home Indicator */}
                        <div className="absolute bottom-1 left-0 right-0 h-1 flex justify-center">
                            <div className="w-32 h-1 rounded-full bg-black"></div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

const WebPreviewMockup = ({ design }: { design?: DesignState | null }) => {
    const web = design?.system?.platforms.web;
    const primary = web?.['primary-600'] || '#2563EB';
    const bg = web?.['neutral-50'] || '#F8FAFC';

    return (
        <div className="w-full h-[500px] bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col">
            {/* Navbar */}
            <div className="h-16 border-b border-gray-100 flex items-center justify-between px-8 bg-white">
                <div className="font-bold text-xl tracking-tight">Brand</div>
                <div className="flex gap-6 text-sm font-medium text-gray-500">
                    <span>Product</span>
                    <span>Solutions</span>
                    <span>Pricing</span>
                </div>
                <button className="px-4 py-2 rounded-lg text-white text-sm font-bold" style={{ backgroundColor: primary }}>Get Started</button>
            </div>

            {/* Hero */}
            <div className="flex-1 flex items-center justify-center text-center p-12 bg-gray-50" style={{ backgroundColor: bg }}>
                <div className="max-w-md">
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-4 block" style={{ color: primary }}>Web Dashboard</span>
                    <h1 className="text-4xl font-black text-gray-900 mb-6 leading-tight">Scale your business with AI</h1>
                    <p className="text-gray-500 mb-8 leading-relaxed">Everything you need to build faster, ship better, and scale harder.</p>
                    <div className="flex gap-4 justify-center">
                        <button className="px-6 py-3 rounded-lg text-white font-bold shadow-lg shadow-blue-500/20" style={{ backgroundColor: primary }}>Start Free Trial</button>
                        <button className="px-6 py-3 rounded-lg bg-white border border-gray-200 font-bold text-gray-700 hover:bg-gray-50">View Demo</button>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="h-32 bg-white border-t border-gray-100 grid grid-cols-3 divide-x divide-gray-100">
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center justify-center p-8">
                        <div className="text-center">
                            <div className="text-2xl font-black text-gray-900">10k+</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wide font-bold">Active Users</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 🍔 FOOD APP PREVIEW
export const FoodAppPreview = ({ colors, type }: PreviewProps) => {
    const [primary, secondary, accent, bg, text] = colors;

    return (
        <div className="w-full max-w-sm mx-auto bg-white rounded-[2rem] overflow-hidden shadow-2xl border-4 border-gray-100" style={{ backgroundColor: bg }}>
            {/* Header */}
            <div className="p-6 pb-2 flex justify-between items-center">
                <div className="bg-gray-100 p-2 rounded-full" style={{ color: text }}><LayoutGrid size={20} /></div>
                <div className="flex flex-col items-center">
                    <span className="text-xs font-bold uppercase tracking-widest opacity-50" style={{ color: text }}>Current Location</span>
                    <div className="flex items-center gap-1 font-bold" style={{ color: primary }}>
                        <MapPin size={12} /> New York, NY
                    </div>
                </div>
                <div className="relative">
                    <div className="bg-gray-100 p-2 rounded-full" style={{ color: text }}><User size={20} /></div>
                    <div className="absolute top-0 right-0 w-3 h-3 rounded-full border-2 border-white" style={{ backgroundColor: accent }} />
                </div>
            </div>

            {/* Hero / Promo */}
            <div className="px-6 py-4">
                <div className="rounded-2xl p-6 text-white relative overflow-hidden shadow-lg" style={{ backgroundColor: primary }}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full translate-x-10 -translate-y-10" />
                    <h3 className="text-2xl font-black mb-2 relative z-10">30% OFF</h3>
                    <p className="text-sm opacity-90 mb-4 relative z-10">On your first order today!</p>
                    <button className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide bg-white shadow-sm" style={{ color: primary }}>Order Now</button>
                </div>
            </div>

            {/* Categories */}
            <div className="px-6 overflow-x-auto flex gap-4 pb-4 no-scrollbar">
                {['Burger', 'Pizza', 'Sushi', 'Vegan'].map((cat, i) => (
                    <div key={cat} className={`flex flex-col items-center gap-2 min-w-[60px] ${i === 0 ? 'opacity-100' : 'opacity-50'}`}>
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${i === 0 ? 'text-white' : 'bg-white'}`} style={{ backgroundColor: i === 0 ? secondary : '#fff', color: i === 0 ? '#fff' : text }}>
                            {i === 0 ? '🍔' : i == 1 ? '🍕' : i == 2 ? '🍣' : '🥗'}
                        </div>
                        <span className="text-[10px] font-bold" style={{ color: text }}>{cat}</span>
                    </div>
                ))}
            </div>

            {/* Popular Items */}
            <div className="px-6 py-2">
                <h4 className="font-bold text-lg mb-4" style={{ color: text }}>Popular Now</h4>
                <div className="space-y-4">
                    {[1, 2].map(i => (
                        <div key={i} className="bg-white p-3 rounded-2xl shadow-sm flex gap-4 items-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-xl" />
                            <div className="flex-1">
                                <h5 className="font-bold mb-1" style={{ color: text }}>Classic Burger</h5>
                                <p className="text-xs opacity-50 mb-2" style={{ color: text }}>Cheddar, onions, lettuce</p>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold" style={{ color: primary }}>$12.99</span>
                                    <button className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md" style={{ backgroundColor: primary }}>+</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tab Bar */}
            <div className="bg-white px-8 py-4 flex justify-between items-center shadow-[0_-5px_20px_rgba(0,0,0,0.05)] rounded-t-[2rem]">
                <div style={{ color: primary }}><LayoutGrid size={24} /></div>
                <div className="opacity-30" style={{ color: text }}><Heart size={24} /></div>
                <div className="w-12 h-12 -mt-8 rounded-full flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: secondary }}>
                    <ShoppingCart size={20} />
                </div>
                <div className="opacity-30" style={{ color: text }}><Bell size={24} /></div>
                <div className="opacity-30" style={{ color: text }}><User size={24} /></div>
            </div>
        </div>
    );
};

// 💳 FINANCE / TECH PREVIEW
export const TechAppPreview = ({ colors, type }: PreviewProps) => {
    const [primary, secondary, accent, bg, text] = colors;

    return (
        <div className="w-full max-w-sm mx-auto bg-white rounded-[2rem] overflow-hidden shadow-2xl border-4 border-gray-100" style={{ backgroundColor: bg }}>
            {/* Header */}
            <div className="p-8 pb-4 flex justify-between items-center">
                <div>
                    <p className="text-sm opacity-60" style={{ color: text }}>Total Balance</p>
                    <h2 className="text-3xl font-black" style={{ color: text }}>$24,562</h2>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-200" />
            </div>

            {/* Cards */}
            <div className="px-6 py-4 overflow-hidden relative">
                <div className="w-full aspect-[1.6] rounded-2xl p-6 text-white relative shadow-xl z-10" style={{ backgroundColor: primary }}>
                    <div className="flex justify-between items-start mb-8">
                        <span className="opacity-80">Debit Card</span>
                        <span className="font-bold italic">VISA</span>
                    </div>
                    <div className="font-mono text-lg tracking-widest mb-4">**** **** **** 4289</div>
                    <div className="flex justify-between opacity-80 text-sm">
                        <span>Card Holder</span>
                        <span>Expires</span>
                    </div>
                    <div className="flex justify-between font-bold">
                        <span>John Doe</span>
                        <span>12/25</span>
                    </div>

                    <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white opacity-10 blur-2xl" />
                    <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white opacity-10 blur-xl" />
                </div>
                {/* Stack efffect */}
                <div className="absolute top-8 left-10 right-10 h-full rounded-2xl opacity-40 z-0 transform translate-y-4 scale-95" style={{ backgroundColor: secondary }} />
            </div>

            {/* Actions */}
            <div className="px-6 py-6 flex justify-between gap-4">
                {['Send', 'Request', 'Top-up', 'More'].map((action, i) => (
                    <div key={action} className="flex flex-col items-center gap-2">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm hover:shadow-md transition-shadow" style={{ backgroundColor: '#fff', color: primary }}>
                            <div className="w-6 h-6 rounded bg-current opacity-20" />
                        </div>
                        <span className="text-xs font-medium" style={{ color: text }}>{action}</span>
                    </div>
                ))}
            </div>

            {/* Recent Trans */}
            <div className="bg-white rounded-t-[2.5rem] p-8 shadow-lg min-h-[200px]">
                <div className="flex justify-between mb-6">
                    <h4 className="font-bold text-lg text-gray-900">Transactions</h4>
                    <span className="text-sm font-bold cursor-pointer" style={{ color: secondary }}>See All</span>
                </div>
                <div className="space-y-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: bg }}>
                                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: secondary }} />
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900">Netflix</div>
                                    <div className="text-xs text-gray-400">Subscription</div>
                                </div>
                            </div>
                            <div className="font-bold text-gray-900">-$15.99</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// 🕌 ISLAMIC APP PREVIEW
export const IslamicAppPreview = ({ colors, type }: PreviewProps) => {
    const [primary, secondary, accent, bg, text] = colors;

    return (
        <div className="w-full max-w-sm mx-auto bg-white rounded-[2rem] overflow-hidden shadow-2xl border-4 border-gray-100" style={{ backgroundColor: bg }}>
            {/* Header / Date */}
            <div className="p-6 pb-2 text-center">
                <p className="text-xs font-bold tracking-widest uppercase opacity-60" style={{ color: text }}>14 Ramadan 1447</p>
                <div className="flex justify-center items-center gap-2 mt-1">
                    <MapPin size={12} style={{ color: primary }} />
                    <span className="text-sm font-bold" style={{ color: text }}>Mecca, Saudi Arabia</span>
                </div>
            </div>

            {/* Prayer Hero */}
            <div className="px-6 py-4">
                <div className="rounded-3xl p-8 text-white relative overflow-hidden shadow-lg flex flex-col items-center justify-center text-center" style={{ backgroundColor: primary }}>
                    {/* Decorative Arch Background */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 50% 120%, white 40%, transparent 45%)' }} />
                    <div className="absolute top-0 w-full h-full opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 0L20 10L10 20L0 10z' fill='%23ffffff' fill-opacity='1'/%3E%3C/svg%3E")` }} />

                    <span className="text-sm opacity-80 mb-1 relative z-10">Next Prayer</span>
                    <h2 className="text-4xl font-black mb-2 relative z-10">Maghrib</h2>
                    <h3 className="text-6xl font-black mb-4 relative z-10 opacity-90">18:45</h3>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold">
                        <span>-02:14:32</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="px-6 py-2">
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { icon: '📖', label: 'Quran', bg: secondary },
                        { icon: '🧭', label: 'Qibla', bg: accent },
                        { icon: '🤲', label: 'Dua', bg: text },
                        { icon: '📿', label: 'Tasbih', bg: primary }
                    ].map((item, i) => (
                        <div key={item.label} className="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center gap-3 border border-gray-50 group hover:shadow-md transition-all">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm" style={{ backgroundColor: `${item.bg}20` }}>
                                {item.icon}
                            </div>
                            <span className="text-sm font-bold" style={{ color: text }}>{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Daily Verse */}
            <div className="px-6 py-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="absolute right-0 top-0 p-4 opacity-5">
                        <Star size={64} fill={secondary} color={secondary} />
                    </div>
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: secondary }}>Verse of the Day</h4>
                    <p className="font-serif italic text-lg leading-relaxed mb-3 opacity-80" style={{ color: text }}>
                        "Verily, with hardship comes ease."
                    </p>
                    <p className="text-xs font-bold opacity-50" style={{ color: text }}>Surah Ash-Sharh [94:6]</p>
                </div>
            </div>

            {/* Nav */}
            <div className="mt-4 border-t border-gray-100 bg-white p-4 flex justify-around items-center">
                <div style={{ color: primary }}><LayoutGrid size={24} /></div>
                <div className="opacity-30" style={{ color: text }}><Search size={24} /></div>
                <div className="opacity-30" style={{ color: text }}><User size={24} /></div>
            </div>
        </div>
    );
};

const HighFidelityDashboard = ({ design, type }: { design?: DesignState | null, type?: string }) => {
    const web = design?.system?.platforms.web;
    // Default blue for web
    const primary = web?.['primary-600'] || '#2563EB';

    // Gradient computation for 10x look
    const primaryLight = web?.['primary-400'] || '#60a5fa';

    // Content
    const isFood = type === 'food' || type === 'restaurant';
    const isTech = type === 'tech' || type === 'finance' || type === 'modern';

    const dashboardTitle = isFood ? 'Restaurant Admin' : isTech ? 'SaaS Overview' : 'Dashboard';
    const stat1 = isFood ? 'Orders' : 'Total Revenue';
    const menuItems = isFood ? ['Orders', 'Menu', 'Customers'] : ['Overview', 'Analytics', 'Customers'];

    return (
        <div className="w-full h-[600px] bg-white rounded-xl shadow-2xl relative border border-gray-200/50 flex flex-col overflow-hidden ring-1 ring-black/5 mx-auto max-w-[800px]">

            {/* MacOS Title Bar */}
            <div className="h-9 bg-[#f3f3f5] border-b border-[#e5e5e5] flex items-center px-4 justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#fa605c] border border-[#d6413d] hover:brightness-110"></div>
                    <div className="w-3 h-3 rounded-full bg-[#fdbc2d] border border-[#d8a023] hover:brightness-110"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27ca40] border border-[#23ab36] hover:brightness-110"></div>
                </div>

                {/* Fake Address Bar */}
                <div className="flex-1 max-w-sm mx-4 bg-white border border-[#e5e5e5] h-6 rounded flex items-center justify-center text-[10px] text-gray-500 font-medium shadow-sm">
                    <div className="w-3 h-3 mr-1 opacity-50"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></div>
                    app.dopely.ai/dashboard
                </div>

                <div className="w-16"></div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar (Dark Mode) */}
                <div className="w-64 border-r border-gray-800 bg-[#0B0C15] flex flex-col p-4 shrink-0">
                    <div className="h-8 w-24 bg-white/10 rounded mb-8"></div>
                    <div className="space-y-1">
                        {menuItems.map((item, i) => (
                            <div key={item}
                                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-3 transition-all cursor-pointer ${i === 0 ? 'bg-gradient-to-r from-gray-800 to-transparent text-white border-l-2' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                                style={i === 0 ? { borderColor: primary } : {}}
                            >
                                <div className="w-4 h-4 rounded bg-current opacity-50"></div>
                                {item}
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto p-4 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700">
                        <div className="w-8 h-8 rounded-lg mb-3 flex items-center justify-center text-white" style={{ backgroundColor: primary }}>⚡</div>
                        <p className="text-xs text-gray-400 mb-2">Upgrade to Pro</p>
                        <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full w-2/3 rounded-full" style={{ backgroundColor: primary }}></div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-white relative overflow-hidden flex flex-col">

                    {/* Top Bar */}
                    <div className="h-16 border-b border-gray-100 flex items-center justify-between px-8 bg-white/80 backdrop-blur z-20 sticky top-0">
                        <div className="text-xl font-bold text-gray-900">{dashboardTitle}</div>
                        <div className="flex items-center gap-4">
                            <div className="px-3 py-1.5 rounded-full bg-gray-100 text-xs font-medium text-gray-600">v2.4.0</div>
                            <div className="w-8 h-8 rounded-full bg-gray-900 border-2 border-white shadow-sm"></div>
                        </div>
                    </div>

                    {/* Dashboard Body */}
                    <div className="p-8 overflow-y-auto z-10 space-y-8 no-scrollbar bg-gray-50/50 h-full">

                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-6">
                            {[
                                { label: stat1, val: isFood ? '1,240' : '$48,290', grow: '+12%', color: primary },
                                { label: 'Active Users', val: '2,400', grow: '+8%', color: '#10b981' },
                                { label: 'Bounce Rate', val: '14.2%', grow: '-2%', color: '#f59e0b' }
                            ].map(stat => (
                                <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">{stat.label}</p>
                                    <div className="flex items-end justify-between">
                                        <h3 className="text-3xl font-black text-gray-900">{stat.val}</h3>
                                        <span className="text-xs font-bold px-2 py-1 rounded bg-gray-50" style={{ color: stat.color }}>{stat.grow}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Chart Area */}
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                            <div className="flex justify-between mb-8">
                                <h3 className="font-bold text-lg">Performance</h3>
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: primary }}></div>
                                    <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                                </div>
                            </div>

                            {/* CSS Line Chart simulation */}
                            <div className="h-48 w-full flex items-end gap-4 relative">
                                {/* Grid lines */}
                                <div className="absolute inset-0 flex flex-col justify-between opacity-10 pointer-events-none">
                                    {[1, 2, 3, 4].map(i => <div key={i} className="w-full h-px bg-gray-900"></div>)}
                                </div>

                                {/* Bars */}
                                {[40, 65, 45, 80, 55, 90, 70, 85].map((h, i) => (
                                    <div key={i} className="flex-1 rounded-t-lg opacity-80 hover:opacity-100 transition-all hover:scale-105 origin-bottom relative group" style={{ height: `${h}%`, backgroundColor: i % 2 === 0 ? primary : primaryLight }}>
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            ${h}k
                                        </div>
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

const HighFidelityStorefront = ({ design }: { design?: DesignState | null }) => {
    const web = design?.system?.platforms.web;
    const primary = web?.['primary-600'] || '#2563EB';
    const bg = web?.['neutral-50'] || '#F8FAFC';

    return (
        <div className="w-full h-[600px] bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xl flex flex-col mx-auto max-w-[800px]">
            {/* Navbar */}
            <div className="h-16 border-b border-gray-100 flex items-center justify-between px-8 bg-white/90 backdrop-blur sticky top-0 z-50">
                <div className="font-black text-xl tracking-tight flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-gray-900" style={{ backgroundColor: primary }} />
                    Brand
                </div>
                <div className="flex gap-6 text-sm font-medium text-gray-500">
                    <span className="hover:text-gray-900 cursor-pointer">Product</span>
                    <span className="hover:text-gray-900 cursor-pointer">Solutions</span>
                    <span className="hover:text-gray-900 cursor-pointer">Pricing</span>
                </div>
                <button className="px-5 py-2 rounded-full text-white text-sm font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all" style={{ backgroundColor: primary }}>Get Started</button>
            </div>

            {/* Hero */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="flex flex-col items-center justify-center text-center p-16 bg-gray-50 relative overflow-hidden" style={{ backgroundColor: bg }}>
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                    <div className="max-w-xl relative z-10">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-100 text-[10px] font-bold uppercase tracking-widest mb-6 shadow-sm" style={{ color: primary }}>
                            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: primary }} />
                            New Release
                        </span>
                        <h1 className="text-5xl font-black text-gray-900 mb-6 leading-[1.1] tracking-tight">Scale your business with <span style={{ color: primary }}>AI Power</span></h1>
                        <p className="text-lg text-gray-500 mb-8 leading-relaxed max-w-md mx-auto">Everything you need to build faster, ship better, and scale harder. The ultimate platform for modern teams.</p>
                        <div className="flex gap-4 justify-center">
                            <button className="px-8 py-4 rounded-xl text-white font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all" style={{ backgroundColor: primary }}>Start Free Trial</button>
                            <button className="px-8 py-4 rounded-xl bg-white border border-gray-200 font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">View Demo</button>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="bg-white border-t border-gray-100 grid grid-cols-3 divide-x divide-gray-100">
                    {[
                        { label: 'Active Users', val: '10k+' },
                        { label: 'Countries', val: '120+' },
                        { label: 'Uptime', val: '99.9%' }
                    ].map(stat => (
                        <div key={stat.label} className="flex flex-col items-center justify-center p-12 hover:bg-gray-50 transition-colors group">
                            <div className="text-3xl font-black text-gray-900 group-hover:scale-110 transition-transform">{stat.val}</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wide font-bold mt-2">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const FeaturePreview = (props: PreviewProps & { activeTab?: string, onTabChange?: (tab: string) => void }) => {

    const [internalTab, setInternalTab] = React.useState('android');
    const { type } = props;

    // Use prop if available, otherwise internal state
    const activeView = props.activeTab || internalTab;

    const handleTabChange = (tab: string) => {
        setInternalTab(tab);
        if (props.onTabChange) props.onTabChange(tab);
    };

    // Helper to scroll to export section or trigger action
    const handleSelect = () => {
        // Find the export section or just alert nicely for this demo
        const exportSection = document.getElementById('export-section');
        if (exportSection) {
            exportSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            // If strictly wanting to "Select" as an action:
            alert(`Selected ${activeView.toUpperCase()} System! Scroll down to export options.`);
        }
    };

    return (
        <div className="w-full flex flex-col items-center">
            {/* Tabs Pilled Switcher - Only show if NO external control is provided, 
                OR we can show it always and just let it sync? 
                The user requested "switable bar in this page". 
                If we hide it when controlled, we rely on the parent (AIAssistant sidebar) to have buttons. 
                I will ADD buttons to AIAssistant sidebar in next step. 
                So hiding here when activeTab matches is cleaner.
                Actually, let's keep it visible for now unless props.activeTab is set, to act as default behavior.
            */}
            {/* Tabs Pilled Switcher - Always Visible */}
            <div className="inline-flex items-center p-1.5 bg-gray-100/80 backdrop-blur rounded-full mb-8 shadow-inner border border-gray-200 gap-1">
                {[
                    { id: 'android', label: 'Android', icon: Smartphone },
                    { id: 'ios', label: 'iOS', icon: Smartphone },
                    { id: 'web', label: 'Web', icon: Monitor },
                ].map(tab => {
                    const isActive = activeView === tab.id;
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${isActive
                                ? 'bg-gray-900 text-white shadow-md scale-100'
                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
                                }`}
                        >
                            <Icon size={16} />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            <div className="w-full transition-all duration-500">
                {/* Animate opacity for transition effect if feasible, or just switch */}
                {activeView === 'android' && <HighFidelityAndroid design={props.design} type={type} />}
                {activeView === 'ios' && <HighFidelityIOS design={props.design} type={type} />}
                {activeView === 'web' && <HighFidelityDashboard design={props.design} type={type} />}
            </div>

            <div className="mt-8 text-center flex flex-col items-center gap-4">
                <p className="text-xs text-gray-400 font-medium">
                    Showing real-time generated preview based on your tokens.
                </p>
            </div>
        </div>
    );
};

// React import needed if not global
import React from 'react';


// --- Component Previews (Buttons, Alerts) ---
// --- Component Previews (Buttons, Alerts) ---
export const DesignTokensPreview = ({ colors, design }: PreviewProps) => {
    const [primary, secondary, accent, bg, text] = colors;

    // Access advanced tokens if available
    const mat = design?.system?.platforms.android_material;

    // Use token or fallback
    const primaryContainer = mat?.primary_container || `${primary}20`;
    const onPrimaryContainer = mat?.on_primary_container || primary;
    const errorColor = mat?.error_40 || '#ef4444';
    const errorContainer = mat?.error_90 || '#fee2e2';

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h4 className="text-sm font-bold uppercase text-gray-400 mb-4 tracking-wider">Buttons (Material 3)</h4>
                <div className="space-y-4">
                    <button className="w-full py-3 rounded-full font-bold text-white shadow-md transition-transform active:scale-95" style={{ backgroundColor: primary }}>
                        Filled Button ({mat ? 'P-40' : 'Primary'})
                    </button>
                    <button className="w-full py-3 rounded-full font-bold shadow-sm transition-transform active:scale-95" style={{ backgroundColor: primaryContainer, color: onPrimaryContainer }}>
                        Tonal Button ({mat ? 'P-90/P-10' : 'Container'})
                    </button>
                    <button className="w-full py-3 rounded-full font-bold shadow-sm transition-transform active:scale-95 border border-gray-300" style={{ color: primary, backgroundColor: 'transparent' }}>
                        Outlined Button
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h4 className="text-sm font-bold uppercase text-gray-400 mb-4 tracking-wider">Messaging</h4>
                <div className="space-y-3">
                    <div className="p-4 rounded-xl flex items-center gap-3" style={{ backgroundColor: primaryContainer }}>
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: onPrimaryContainer }} />
                        <span className="text-sm font-medium" style={{ color: onPrimaryContainer }}>System Update Available</span>
                    </div>
                    <div className="p-4 rounded-xl flex items-center gap-3" style={{ backgroundColor: errorContainer }}>
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: errorColor }} />
                        <span className="text-sm font-medium" style={{ color: mat?.error_10 || '#7f1d1d' }}>Critical Security Alert</span>
                    </div>
                    <div className="p-4 rounded-xl flex items-center gap-3 bg-gray-50 border border-gray-200">
                        <span className="text-sm font-medium text-gray-600">Neutral Helper Text</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
