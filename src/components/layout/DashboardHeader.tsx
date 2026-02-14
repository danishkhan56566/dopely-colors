'use client';

import { Search, Bell, Plus, User, LogOut, CreditCard, Settings, ChevronDown, Wand2, Layers, Image } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { UserButton } from '@/components/auth/UserButton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import clsx from 'clsx';

export const DashboardHeader = () => {
    return (
        <header className="h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between sticky top-0 z-30">
            {/* Search */}
            <div className="relative w-96 hidden md:block">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search palettes, tools, gradients..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 rounded-xl text-sm outline-none transition-all"
                />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">

                {/* Create Button Dropdown */}
                <Popover>
                    <PopoverTrigger asChild>
                        <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all active:scale-95 shadow-sm hover:shadow-md">
                            <Plus size={18} />
                            <span>Create</span>
                            <ChevronDown size={14} className="opacity-50" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-2 bg-white rounded-xl shadow-xl border border-gray-100 mr-4 mt-2" align="end">
                        <div className="flex flex-col gap-1">
                            <span className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quick Actions</span>
                            <Link href="/generate" className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg text-sm text-gray-700 transition-colors">
                                <Wand2 size={16} className="text-purple-500" />
                                Generate Palette
                            </Link>
                            <Link href="/tools/fluid" className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg text-sm text-gray-700 transition-colors">
                                <Layers size={16} className="text-blue-500" />
                                Create Gradient
                            </Link>
                            <Link href="/tools/art-extractor" className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg text-sm text-gray-700 transition-colors">
                                <Image size={16} className="text-pink-500" />
                                Extract from Image
                            </Link>
                        </div>
                    </PopoverContent>
                </Popover>

                {/* Notifications */}
                <button className="p-2.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>

                <div className="h-8 w-px bg-gray-200 mx-1"></div>

                {/* Profile Menu (reusing UserButton or custom) */}
                <UserButton />
            </div>
        </header>
    );
};
