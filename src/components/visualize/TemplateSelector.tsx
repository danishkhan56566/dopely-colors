'use client';

import { Layout, Smartphone, MonitorSmartphone, BarChart3, ShoppingBag, Moon } from 'lucide-react';
import clsx from 'clsx';

interface TemplateSelectorProps {
    activeTemplate: string;
    onSelectTemplate: (template: string) => void;
}

export const TemplateSelector = ({ activeTemplate, onSelectTemplate }: TemplateSelectorProps) => {
    const templates = [
        { id: 'website', name: 'Website', icon: Layout },
        { id: 'saas', name: 'SaaS Dashboard', icon: BarChart3 },
        { id: 'ecommerce', name: 'E-commerce', icon: ShoppingBag },
        { id: 'islamic', name: 'Islamic App', icon: Moon },
        { id: 'mobile', name: 'Mobile App', icon: Smartphone },
        { id: 'all', name: 'All Devices', icon: MonitorSmartphone },
    ];

    return (
        <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-2 flex flex-col gap-2">
            {templates.map((t) => {
                const Icon = t.icon;
                const isActive = activeTemplate === t.id;
                return (
                    <button
                        key={t.id}
                        onClick={() => onSelectTemplate(t.id)}
                        className={clsx(
                            "p-3 rounded-xl transition-all relative group flex items-center justify-center",
                            isActive ? "bg-black text-white shadow-md" : "hover:bg-gray-100 text-gray-500"
                        )}
                        title={t.name}
                    >
                        <Icon size={20} />

                        {/* Tooltip */}
                        <span className="absolute left-full ml-3 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                            {t.name}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};
