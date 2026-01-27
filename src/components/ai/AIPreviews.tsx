'use client';

import { motion } from 'framer-motion';
import {
    ShoppingCart, User, Bell, Search, LayoutGrid, Heart, Star, MapPin, Smartphone, Monitor, Store,
    ShoppingBag, Cloud, Users, Upload, Folder, Settings, Camera, FileText, Video, Mic, Image as ImageIcon, Music, MoreHorizontal, Plus
} from 'lucide-react';

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
    const primary = design?.brand_colors.primary || '#007AFF';
    const secondary = design?.brand_colors.secondary || '#5856D6';
    const tertiary = design?.system?.base_colors.tertiary || '#FF2D55';
    const surface = ios?.systemGroupedBackground.light || '#F2F2F7';

    // Content Switcher - defaulting to a Shopping/General App structure as per reference
    const isFood = type === 'food';

    return (
        <div className="relative mx-auto">
            {/* iPhone 15 Pro Frame */}
            <div className="w-[340px] h-[700px] bg-[#2a2a2a] rounded-[3.5rem] p-[10px] shadow-2xl relative mx-auto border-[6px] border-[#1a1a1a] ring-1 ring-[#000]">
                {/* Buttons */}
                <div className="absolute left-[-8px] top-28 w-1 h-8 bg-[#2a2a2a] rounded-l-md"></div>
                <div className="absolute left-[-8px] top-40 w-1 h-16 bg-[#2a2a2a] rounded-l-md"></div>
                <div className="absolute right-[-8px] top-40 w-1 h-24 bg-[#2a2a2a] rounded-r-md"></div>

                {/* Screen */}
                <div className="w-full h-full bg-black rounded-[3rem] overflow-hidden relative border-[6px] border-black">
                    <div className="w-full h-full bg-gray-50 flex flex-col relative" style={{ backgroundColor: '#fff' }}>

                        {/* Dynamic Island Area */}
                        <div className="h-14 w-full flex justify-center items-end pb-2 px-6">
                            <div className="w-[120px] h-[35px] bg-black rounded-full absolute top-2 left-1/2 -translate-x-1/2 z-50"></div>
                            <div className="w-full flex justify-between items-center text-xs font-bold pt-2">
                                <span>9:41</span>
                                <div className="flex gap-1.5 items-center">
                                    <div className="w-4 h-2.5 bg-black rounded-[2px]" />
                                    <div className="w-3 h-3 bg-black rounded-full" />
                                </div>
                            </div>
                        </div>

                        {/* App Header */}
                        <div className="px-6 py-2 flex items-center justify-between">
                            <div className="p-2 bg-gray-100 rounded-full"><LayoutGrid size={20} /></div>
                            <div className="p-2 bg-gray-100 rounded-full"><ShoppingCart size={20} /></div>
                        </div>

                        {/* Search Bar */}
                        <div className="px-6 mb-6">
                            <div className="bg-gray-100 h-12 rounded-2xl flex items-center px-4 gap-3 text-gray-400">
                                <Search size={20} />
                                <span className="text-sm font-medium">Search products...</span>
                            </div>
                        </div>

                        {/* Scroll Content */}
                        <div className="flex-1 overflow-y-auto no-scrollbar pb-24">

                            {/* Promo Banner (Pink/Purple gradient reference) */}
                            <div className="px-6 mb-8">
                                <div className="w-full h-40 rounded-[2rem] relative overflow-hidden flex items-center p-6 text-white shadow-lg"
                                    style={{ background: `linear-gradient(135deg, ${secondary} 0%, ${tertiary} 100%)` }}>
                                    <div className="relative z-10">
                                        <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-lg backdrop-blur-md">Special Offer!</span>
                                        <h2 className="text-3xl font-black mt-2">45% <span className="text-lg font-bold">OFF</span></h2>
                                        <button className="mt-3 bg-white text-black px-4 py-2 rounded-xl text-xs font-bold shadow-sm">Redeem</button>
                                    </div>
                                    <div className="absolute right-[-20px] bottom-[-20px] w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
                                </div>
                            </div>

                            {/* Section Title */}
                            <div className="px-6 flex justify-between items-end mb-4">
                                <h3 className="text-xl font-bold text-gray-900">Best Selling</h3>
                                <span className="text-xs font-bold text-gray-400">See All</span>
                            </div>

                            {/* Horizontal Cards */}
                            <div className="pl-6 flex gap-4 overflow-x-auto no-scrollbar mb-8">
                                {[1, 2].map(i => (
                                    <div key={i} className="min-w-[160px] p-3 bg-white rounded-3xl shadow-[0_5px_20px_rgba(0,0,0,0.05)] border border-gray-50">
                                        <div className="w-full h-32 rounded-2xl bg-gray-100 mb-3 relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-gray-200" style={{ backgroundColor: i === 1 ? `${secondary}20` : `${primary}20` }}></div>
                                            <div className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm"><Heart size={12} color={tertiary} /></div>
                                        </div>
                                        <h4 className="font-bold text-gray-900 text-sm mb-1">Item Name</h4>
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-lg" style={{ color: primary }}>$95.50</span>
                                            <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs">+</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Vertical List */}
                            <div className="px-6 space-y-4">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Explore</h3>
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex gap-4 items-center p-3 bg-white rounded-2xl shadow-sm border border-gray-50">
                                        <div className="w-16 h-16 rounded-xl bg-gray-100" style={{ backgroundColor: i === 1 ? `${primary}20` : `${tertiary}20` }}></div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-sm">Minimal Chair</h4>
                                            <p className="text-xs text-gray-400">Furniture</p>
                                        </div>
                                        <span className="font-bold text-sm">$45.00</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom Tab Bar */}
                        <div className="absolute bottom-0 w-full bg-white h-20 rounded-t-[2rem] shadow-[0_-5px_30px_rgba(0,0,0,0.05)] flex justify-between items-center px-8 pb-4">
                            <div style={{ color: primary }}><LayoutGrid size={24} fill="currentColor" className="opacity-20" /></div>
                            <div className="text-gray-300"><Heart size={24} /></div>
                            <div className="w-14 h-14 bg-gray-900 rounded-full text-white flex items-center justify-center -mt-8 shadow-xl shadow-gray-900/30"
                                style={{ backgroundColor: primary }}>
                                <ShoppingBag size={24} />
                            </div>
                            <div className="text-gray-300"><Bell size={24} /></div>
                            <div className="text-gray-300"><User size={24} /></div>
                        </div>

                        {/* Home Indicator */}
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full bg-gray-200"></div>
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
    const primary = design?.brand_colors.primary || '#2563EB';
    const secondary = design?.brand_colors.secondary || '#4F46E5';
    const tertiary = design?.system?.base_colors.tertiary || '#EC4899';
    const neutral = design?.system?.base_colors.neutral || '#64748B';

    // Menu Items per reference
    const sidebarItems = [
        { icon: Cloud, label: 'My cloud', active: true },
        { icon: Users, label: 'Shared files' },
        { icon: Star, label: 'Favorites' },
        { icon: Upload, label: 'Upload files' }
    ];

    return (
        <div className="w-[1024px] h-[768px] bg-white rounded-xl shadow-2xl relative border border-gray-200/50 flex flex-col overflow-hidden ring-1 ring-black/5 mx-auto font-sans">
            {/* MacOS Title Bar */}
            <div className="h-10 bg-[#f3f3f5] border-b border-[#e5e5e5] flex items-center px-4 justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#fa605c] border border-[#d6413d]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#fdbc2d] border border-[#d8a023]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27ca40] border border-[#23ab36]"></div>
                </div>
                <div className="text-xs text-gray-500 font-medium">Cloud Dashboard</div>
                <div className="w-16"></div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* 1. Sidebar (Dark Blue Material) */}
                <div className="w-56 flex flex-col py-6 px-4 shrink-0" style={{ backgroundColor: '#0F172A', color: 'white' }}>
                    <div className="flex items-center gap-3 mb-10 px-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border-2 border-white/20">
                            {/* User Avatar */}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 px-2">Categories</div>
                        {sidebarItems.map((item, i) => (
                            <div key={item.label}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${item.active ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                                <item.icon size={18} />
                                {item.label}
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 space-y-1">
                        <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 px-2">Files</div>
                        {['Work', 'Personal', 'School', 'Archive'].map(f => (
                            <div key={f} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer">
                                <div className="w-4 h-4 rounded bg-white/10 flex items-center justify-center opacity-50"><Folder size={10} /></div>
                                {f}
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto flex items-center gap-2 text-xs text-gray-500 px-2">
                        <Settings size={14} /> Settings
                    </div>
                </div>

                {/* 2. Main Content (Light) */}
                <div className="flex-1 bg-gray-50 p-8 overflow-y-auto no-scrollbar relative">
                    <div className="max-w-3xl mx-auto">
                        {/* Search */}
                        <div className="bg-white rounded-2xl p-4 shadow-sm mb-8 flex items-center justify-between">
                            <div className="flex items-center gap-3 text-gray-400">
                                <Search size={20} />
                                <span className="text-sm">Search</span>
                            </div>
                        </div>

                        {/* Recent Categories Widgets */}
                        <div className="mb-6">
                            <h3 className="font-bold text-gray-800 mb-4">Categories</h3>
                            <div className="grid grid-cols-4 gap-4">
                                {/* Pictures - Purple */}
                                <div className="bg-white p-4 rounded-3xl shadow-sm flex flex-col items-center gap-3 hover:-translate-y-1 transition-transform cursor-pointer">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: primary }}>
                                        <Camera size={20} />
                                    </div>
                                    <div className="text-center">
                                        <div className="font-bold text-sm text-gray-900">Pictures</div>
                                        <div className="text-[10px] text-gray-400">480 files</div>
                                    </div>
                                </div>
                                {/* Documents - Teal */}
                                <div className="bg-white p-4 rounded-3xl shadow-sm flex flex-col items-center gap-3 hover:-translate-y-1 transition-transform cursor-pointer">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: secondary }}>
                                        <FileText size={20} />
                                    </div>
                                    <div className="text-center">
                                        <div className="font-bold text-sm text-gray-900">Docs</div>
                                        <div className="text-[10px] text-gray-400">190 files</div>
                                    </div>
                                </div>
                                {/* Videos - Pink */}
                                <div className="bg-white p-4 rounded-3xl shadow-sm flex flex-col items-center gap-3 hover:-translate-y-1 transition-transform cursor-pointer">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: tertiary }}>
                                        <Video size={20} />
                                    </div>
                                    <div className="text-center">
                                        <div className="font-bold text-sm text-gray-900">Videos</div>
                                        <div className="text-[10px] text-gray-400">30 files</div>
                                    </div>
                                </div>
                                {/* Audio - Blue */}
                                <div className="bg-white p-4 rounded-3xl shadow-sm flex flex-col items-center gap-3 hover:-translate-y-1 transition-transform cursor-pointer">
                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: '#0EA5E9' }}>
                                        <Mic size={20} />
                                    </div>
                                    <div className="text-center">
                                        <div className="font-bold text-sm text-gray-900">Audio</div>
                                        <div className="text-[10px] text-gray-400">80 files</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Files List */}
                        <div>
                            <h3 className="font-bold text-gray-800 mb-4">Recent files</h3>
                            <div className="bg-white rounded-3xl p-2 shadow-sm space-y-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-colors group cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                                                {i === 1 ? <ImageIcon size={18} /> : i === 2 ? <Video size={18} /> : <Music size={18} />}
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm text-gray-900">IMG_100{i}.png</div>
                                                <div className="text-[10px] text-gray-400">PNG file • 5 MB</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="px-2 py-1 bg-gray-100 rounded text-[10px] font-bold text-gray-500">{i === 1 ? 'Work' : 'Personal'}</div>
                                            <MoreHorizontal size={16} className="text-gray-300" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Right Panel (Storage) */}
                <div className="w-64 bg-white border-l border-gray-100 p-6 flex flex-col shrink-0">
                    <div className="w-full aspect-square bg-gray-50 rounded-3xl mb-8 flex items-center justify-center relative">
                        <div className="text-center relative z-10">
                            <div className="text-3xl font-black text-gray-900">75<span className="text-sm align-top">%</span></div>
                            <div className="text-xs text-gray-400 font-bold uppercase">Used</div>
                        </div>
                        <svg className="absolute inset-0 w-full h-full -rotate-90 p-4" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                            <circle cx="50" cy="50" r="40" fill="none" stroke={primary} strokeWidth="8" strokeDasharray="251" strokeDashoffset="60" strokeLinecap="round" />
                        </svg>

                        <div className="absolute bottom-4 text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded">25% Left</div>
                    </div>

                    <h4 className="font-bold text-sm text-gray-900 mb-4">Storage Details</h4>
                    <div className="space-y-3 mb-8">
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 text-gray-500"><div className="w-2 h-2 rounded-full bg-blue-500" style={{ backgroundColor: primary }} /> Documents</div>
                            <span className="font-bold">128 GB</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 text-gray-500"><div className="w-2 h-2 rounded-full bg-indigo-500" style={{ backgroundColor: secondary }} /> Media</div>
                            <span className="font-bold">96 GB</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 text-gray-500"><div className="w-2 h-2 rounded-full bg-gray-300" /> Other</div>
                            <span className="font-bold">42 GB</span>
                        </div>
                    </div>

                    <div className="mt-auto bg-gray-50 rounded-2xl p-4 text-center">
                        <div className="w-10 h-10 bg-white shadow-sm rounded-xl mx-auto flex items-center justify-center mb-2" style={{ color: primary }}><Plus size={20} /></div>
                        <div className="text-xs font-bold text-gray-900">Add New Files</div>
                        <div className="text-[10px] text-gray-400">Drag and drop here</div>
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

            <div className="w-full transition-all duration-500 flex justify-center">
                {/* Android Stage */}
                {activeView === 'android' && (
                    <div className="transform scale-90 origin-top">
                        <HighFidelityAndroid design={props.design} type={type} />
                    </div>
                )}

                {/* iOS Stage */}
                {activeView === 'ios' && (
                    <div className="transform scale-90 origin-top">
                        <HighFidelityIOS design={props.design} type={type} />
                    </div>
                )}

                {/* Web Dashboard Stage - Scaled Down for "Professional Preview" look */}
                {activeView === 'web' && (
                    <div className="relative w-full h-[500px] bg-gray-100 rounded-3xl overflow-hidden flex items-center justify-center border border-gray-200 shadow-inner group">
                        {/* Background Decor */}
                        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>

                        <div className="transform scale-[0.6] group-hover:scale-[0.62] transition-transform duration-500 ease-out shadow-2xl rounded-xl">
                            <HighFidelityDashboard design={props.design} type={type} />
                        </div>
                    </div>
                )}
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
