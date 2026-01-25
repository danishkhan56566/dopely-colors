'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import {
    Search, Palette, Zap, Image as ImageIcon,
    Droplet, Layout, Type, FileText, Home,
    Hash
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CommandPalette() {
    const [open, setOpen] = React.useState(false);
    const router = useRouter();

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const runCommand = React.useCallback((command: () => void) => {
        setOpen(false);
        command();
    }, []);

    // Handle Hex Input
    const [search, setSearch] = React.useState('');
    const isHex = /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i.test(search);

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpen(false)}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="w-full max-w-2xl relative z-50 overflow-hidden rounded-2xl border border-neutral-200 bg-white/80 backdrop-blur-xl shadow-2xl shadow-neutral-200/50"
                    >
                        <Command
                            loop
                            shouldFilter={!isHex}
                            className="w-full bg-transparent"
                        >
                            <div className="flex items-center border-b border-neutral-100 px-4">
                                <Search className="h-5 w-5 text-neutral-400" />
                                <Command.Input
                                    value={search}
                                    onValueChange={setSearch}
                                    className="flex h-16 w-full rounded-md bg-transparent px-4 text-lg outline-none placeholder:text-neutral-400 text-neutral-900"
                                    placeholder="Search tools, pages, or type a hex code..."
                                />
                                <div className="hidden sm:flex items-center gap-1 text-xs font-medium text-neutral-400 bg-neutral-100/50 px-2 py-1 rounded-md">
                                    <span className="text-sm">⌘</span>K
                                </div>
                            </div>

                            <Command.List className="max-h-[60vh] overflow-y-auto overflow-x-hidden p-2 scroll-py-2 custom-scrollbar">
                                <Command.Empty className="py-12 text-center text-sm text-neutral-500">
                                    {isHex ? (
                                        <button
                                            onClick={() => runCommand(() => router.push(`/colors/${search.replace('#', '')}/about`))}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 text-white hover:scale-105 transition-transform"
                                        >
                                            <div
                                                className="w-4 h-4 rounded-full border border-white/20"
                                                style={{ backgroundColor: search.startsWith('#') ? search : `#${search}` }}
                                            />
                                            Go to Color {search}
                                        </button>
                                    ) : (
                                        "No results found."
                                    )}
                                </Command.Empty>

                                {isHex && (
                                    <Command.Group heading="Direct Navigation">
                                        <Command.Item
                                            onSelect={() => runCommand(() => router.push(`/colors/${search.replace('#', '')}/about`))}
                                            className="relative flex cursor-pointer select-none items-center gap-3 rounded-xl px-4 py-3 text-sm text-neutral-600 aria-selected:bg-neutral-100 aria-selected:text-neutral-900 transition-colors"
                                        >
                                            <div
                                                className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 shadow-sm"
                                                style={{ backgroundColor: search.startsWith('#') ? search : `#${search}` }}
                                            >
                                                <Hash className="h-5 w-5 text-white mix-blend-difference" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-neutral-900">Go to {search}</span>
                                                <span className="text-xs text-neutral-400">View details and analysis</span>
                                            </div>
                                        </Command.Item>
                                    </Command.Group>
                                )}

                                {!isHex && (
                                    <>
                                        <Command.Group heading="Tools">
                                            <Command.Item
                                                onSelect={() => runCommand(() => router.push('/generate'))}
                                                className="relative flex cursor-pointer select-none items-center gap-3 rounded-xl px-4 py-3 text-sm text-neutral-600 aria-selected:bg-neutral-100 aria-selected:text-neutral-900 transition-colors"
                                            >
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600">
                                                    <Palette className="h-5 w-5" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-neutral-900">Palette Generator</span>
                                                    <span className="text-xs text-neutral-400">Create beautiful color schemes</span>
                                                </div>
                                            </Command.Item>
                                            <Command.Item
                                                onSelect={() => runCommand(() => router.push('/contrast'))}
                                                className="relative flex cursor-pointer select-none items-center gap-3 rounded-xl px-4 py-3 text-sm text-neutral-600 aria-selected:bg-neutral-100 aria-selected:text-neutral-900 transition-colors"
                                            >
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600">
                                                    <EyeIcon className="h-5 w-5" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-neutral-900">Contrast Checker</span>
                                                    <span className="text-xs text-neutral-400">Ensure WCAG accessibility</span>
                                                </div>
                                            </Command.Item>
                                            <Command.Item
                                                onSelect={() => runCommand(() => router.push('/image'))}
                                                className="relative flex cursor-pointer select-none items-center gap-3 rounded-xl px-4 py-3 text-sm text-neutral-600 aria-selected:bg-neutral-100 aria-selected:text-neutral-900 transition-colors"
                                            >
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 border border-amber-100 text-amber-600">
                                                    <ImageIcon className="h-5 w-5" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-neutral-900">Image to Colors</span>
                                                    <span className="text-xs text-neutral-400">Extract palettes from photos</span>
                                                </div>
                                            </Command.Item>
                                            <Command.Item
                                                onSelect={() => runCommand(() => router.push('/gradients'))}
                                                className="relative flex cursor-pointer select-none items-center gap-3 rounded-xl px-4 py-3 text-sm text-neutral-600 aria-selected:bg-neutral-100 aria-selected:text-neutral-900 transition-colors"
                                            >
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 border border-rose-100 text-rose-600">
                                                    <Layout className="h-5 w-5" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-neutral-900">Gradient Maker</span>
                                                    <span className="text-xs text-neutral-400">Design smooth gradients</span>
                                                </div>
                                            </Command.Item>
                                        </Command.Group>

                                        <Command.Group heading="Navigation">
                                            <Command.Item
                                                onSelect={() => runCommand(() => router.push('/'))}
                                                className="relative flex cursor-pointer select-none items-center gap-3 rounded-xl px-4 py-3 text-sm text-neutral-600 aria-selected:bg-neutral-100 aria-selected:text-neutral-900 transition-colors"
                                            >
                                                <Home className="h-4 w-4" />
                                                <span>Home</span>
                                            </Command.Item>
                                            <Command.Item
                                                onSelect={() => runCommand(() => router.push('/explore'))}
                                                className="relative flex cursor-pointer select-none items-center gap-3 rounded-xl px-4 py-3 text-sm text-neutral-600 aria-selected:bg-neutral-100 aria-selected:text-neutral-900 transition-colors"
                                            >
                                                <Zap className="h-4 w-4" />
                                                <span>Explore</span>
                                            </Command.Item>
                                            <Command.Item
                                                onSelect={() => runCommand(() => router.push('/blog'))}
                                                className="relative flex cursor-pointer select-none items-center gap-3 rounded-xl px-4 py-3 text-sm text-neutral-600 aria-selected:bg-neutral-100 aria-selected:text-neutral-900 transition-colors"
                                            >
                                                <FileText className="h-4 w-4" />
                                                <span>Blog</span>
                                            </Command.Item>
                                        </Command.Group>
                                    </>
                                )}
                            </Command.List>
                        </Command>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

// Helper icon since Eye isn't directly exported sometimes or collision
function EyeIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    )
}
