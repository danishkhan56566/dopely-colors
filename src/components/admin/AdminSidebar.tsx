'use client';

import {
    LayoutDashboard,
    Users,
    FileText,
    Settings,
    LogOut,
    ExternalLink,
    PlusSquare,
    Folder,
    Heart,
    Eye,
    Star,
    Palette,
    Shield,
    Globe,
    UploadCloud,
    Mail,
    Layers
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const ADMIN_LINKS = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Palettes', href: '/admin/palettes', icon: Palette },
    { label: 'Bulk Upload', href: '/admin/palettes/bulk', icon: UploadCloud },
    { label: 'Gradients', href: '/admin/gradients', icon: Layers }, // New Link
    { label: 'Colors', href: '/admin/colors', icon: Palette }, // New Link
    { label: 'Inbox', href: '/admin/messages', icon: Mail },
    { label: 'Daily Generator', href: '/admin/daily', icon: FileText }, // New Link
    { label: 'Add Palette', href: '/admin/palettes/create', icon: PlusSquare },
    { label: 'Categories', href: '/admin/categories', icon: Folder },
    { label: 'Favorites Analytics', href: '/admin/favorites', icon: Heart },
    { label: 'Views Analytics', href: '/admin/analytics', icon: Eye },
    { label: 'Featured Palettes', href: '/admin/featured', icon: Star },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Blog Manager', href: '/admin/blog', icon: FileText },
    { label: 'Site Settings', href: '/admin/settings', icon: Globe },
    { label: 'Admin Settings', href: '/admin/settings/admin', icon: Shield },
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
                    onClick={async () => {
                        const { supabase } = await import('@/lib/supabase');
                        await supabase.auth.signOut();
                        window.location.href = '/login';
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium text-left"
                >
                    <LogOut size={18} />
                    Admin Logout
                </button>
            </div>
        </aside>
    );
};
