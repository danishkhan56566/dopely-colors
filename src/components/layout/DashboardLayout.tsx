'use client';

import { Search, Menu, X, Plus, TrendingUp, Clock, Shuffle, Heart, Wand2, Image, Contrast, Pipette, Smartphone, FileCode, Sparkles, Layers, Layout, Palette, PanelLeftClose, PanelLeftOpen, LayoutGrid } from 'lucide-react';
import { useState, ReactNode, Suspense } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import clsx from 'clsx';
import { useSearchParams } from 'next/navigation';
import { UserButton } from '@/components/auth/UserButton';
import { Footer } from '@/components/layout/Footer';
import { ToolsNavbarItem } from '@/components/layout/ToolsNavbarItem';

const SIDEBAR_LINKS = [
    { icon: Clock, label: 'New', href: '/explore?sort=new' },
    { icon: Shuffle, label: 'Random', href: '/explore?sort=random' },
    { icon: Heart, label: 'Favorites', href: '/favorites' },
];

const TOOL_LINKS = [
    { icon: LayoutGrid, label: 'All Tools', href: '/tools' },
    { icon: Wand2, label: 'Generate Palettes', href: '/' },
    { icon: TrendingUp, label: 'Explore Popular', href: '/explore?sort=popular' },
    { icon: Image, label: 'Extract from Image', href: '/image' },
    { icon: Sparkles, label: 'AI Palette Generator', href: '/ai' },
    { icon: Contrast, label: 'Contrast Checker', href: '/contrast' },
    { icon: Smartphone, label: 'Preview on Designs', href: '/generate?view=visualize' },
    { icon: Pipette, label: 'Color Picker', href: '/picker' },
    { icon: Layers, label: 'Gradient Generator', href: '/gradients' },
    { icon: FileCode, label: 'Tailwind Colors', href: '/tailwind' },
    { icon: Layout, label: 'Design System Builder', href: '/design-system' },
];

const TAGS = ['Pastel', 'Neon', 'Vintage', 'Retro', 'Dark', 'Light', 'Warm', 'Cold', 'Summer', 'Winter'];

// Sidebar Content Component
const SidebarContent = () => {
    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Main Nav */}
            <nav className="space-y-1">
                {SIDEBAR_LINKS.map((link) => (
                    <Link
                        key={link.label}
                        href={link.href}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-gray-600 hover:bg-purple-50/50 group"
                    >
                        <div className="transition-all duration-300 group-hover:scale-125 group-hover:rotate-12 group-hover:text-purple-600">
                            <link.icon size={20} />
                        </div>
                        <span className="transition-all group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-pink-600 group-hover:font-bold">
                            {link.label}
                        </span>
                    </Link>
                ))}
            </nav>

            {/* Tools Section */}
            <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-4">Tools</h3>
                <nav className="space-y-1">
                    {TOOL_LINKS.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-gray-600 transition-all text-sm group hover:bg-purple-50/50"
                        >
                            <div className="transition-all duration-300 group-hover:scale-125 group-hover:rotate-12 group-hover:text-purple-600">
                                <link.icon size={18} />
                            </div>
                            <span className="transition-all group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-pink-600 group-hover:font-bold">
                                {link.label}
                            </span>
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Tags */}
            <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-4">Styles</h3>
                <div className="flex flex-wrap gap-2 px-2">
                    {TAGS.map(tag => (
                        <Link
                            key={tag}
                            href={`/explore?tag=${tag.toLowerCase()}`}
                            className="px-3 py-1.5 rounded-lg text-sm border transition-colors bg-gray-50 hover:bg-gray-100 text-gray-600 border-transparent hover:border-gray-200"
                        >
                            {tag}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const DashboardLayout = ({ children, showUserInfo = true }: { children: ReactNode; showUserInfo?: boolean }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-[#FBFBFB] flex text-slate-800">
            {/* Sidebar (Desktop) */}
            <aside
                className={clsx(
                    "hidden md:flex w-64 flex-col fixed inset-y-0 left-0 border-r border-gray-100 bg-white z-40 transition-transform duration-300 ease-in-out",
                    !isSidebarOpen && "-translate-x-full"
                )}
            >
                <div className="h-20 flex items-center px-6 border-b border-gray-50 justify-between">
                    <Link href="/" className="flex items-center">
                        <NextImage src="/dopely-logo.png" alt="Dopely Colors" width={168} height={56} className="h-14 w-auto object-contain" priority />
                    </Link>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                        title="Close Sidebar"
                    >
                        <PanelLeftClose size={18} />
                    </button>
                </div>

                <Suspense fallback={<div className="p-6">Loading nav...</div>}>
                    <SidebarContent />
                </Suspense>

                {/* Create Button in Sidebar */}
                <div className="p-6 border-t border-gray-50 flex flex-col gap-4">
                    <Link
                        href="/generate"
                        className="flex items-center justify-center gap-2 w-full py-4 bg-rainbow text-white rounded-xl font-bold hover:brightness-110 hover:shadow-lg hover:shadow-purple-500/20 transition-all active:scale-95"
                    >
                        <Plus size={20} />
                        Create Palette
                    </Link>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b z-50 flex items-center justify-between px-4">
                <Link href="/" className="flex items-center">
                    <NextImage src="/dopely-logo.png" alt="Dopely Colors" width={120} height={40} className="h-10 w-auto object-contain" priority />
                </Link>
                <div className="flex items-center gap-3">
                    <UserButton />
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </header>

            {/* Main Content Wrapper */}
            <main
                className={clsx(
                    "flex-1 pt-16 md:pt-0 animate-fade-in relative transition-all duration-300 ease-in-out w-full min-w-0 overflow-x-hidden",
                    isSidebarOpen ? "md:ml-64" : "md:ml-0"
                )}
            >
                {/* Desktop Toggle Button (Visible when sidebar is closed) */}
                {!isSidebarOpen && (
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="hidden md:flex fixed top-6 left-6 z-50 p-2 bg-white border border-gray-200 shadow-sm rounded-lg text-gray-500 hover:text-gray-900 transition-all hover:scale-105"
                        title="Open Sidebar"
                    >
                        <PanelLeftOpen size={20} />
                    </button>
                )}

                {/* Top Right Login Button (Desktop only, typically for landing page) */}
                {showUserInfo && (
                    <div className="hidden md:flex absolute top-6 right-8 z-50 items-center gap-4 bg-white/80 backdrop-blur-sm p-1.5 pl-3 rounded-full border border-gray-100 shadow-sm">
                        <ToolsNavbarItem />
                        <div className="w-px h-4 bg-gray-200" />
                        <UserButton />
                    </div>
                )}

                {children}

                {/* Global Footer */}
                <Footer />
            </main>
        </div>
    );
};
