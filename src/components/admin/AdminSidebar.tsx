'use client';

import {
    LayoutDashboard,
    Users,
    FileText,
    Settings,
    LogOut,
    ExternalLink,
    Palette
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const ADMIN_LINKS = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Palettes', href: '/admin/palettes/generate', icon: Palette },
    { label: 'Content', href: '/admin/content', icon: FileText },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export const AdminSidebar = () => {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900 text-white border-r border-slate-800 flex flex-col z-50">
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-rainbow flex items-center justify-center font-bold text-white shadow-lg">
                    D
                </div>
                <div>
                    <div className="font-bold text-lg leading-none">Dopely</div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">ADMIN CONSOLE</div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {ADMIN_LINKS.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                                isActive
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <link.icon size={18} />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 space-y-2">
                <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-all text-sm"
                >
                    <ExternalLink size={18} />
                    Open Live Site
                </Link>
                <button
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium"
                >
                    <LogOut size={18} />
                    Admin Logout
                </button>
            </div>
        </aside>
    );
};
