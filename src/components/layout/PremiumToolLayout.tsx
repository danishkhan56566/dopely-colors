import { ReactNode } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface PremiumToolLayoutProps {
    title: ReactNode;
    description: string;
    icon: LucideIcon;
    badgeText: string;
    children: ReactNode;
    actions?: ReactNode;
    guide?: ReactNode;
    hideHeader?: boolean;
}

export const PremiumToolLayout = ({
    title,
    description,
    icon: Icon,
    badgeText,
    children,
    actions,
    guide,
    hideHeader
}: PremiumToolLayoutProps) => {
    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 flex flex-col items-center relative overflow-hidden">
                {/* Immersive Background */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-indigo-200/40 rounded-full blur-[120px] mix-blend-multiply opacity-60 animate-blob" />
                    <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-pink-200/40 rounded-full blur-[120px] mix-blend-multiply opacity-60 animate-blob animation-delay-4000" />
                    <div className="absolute top-[40%] left-[-10%] w-[400px] h-[400px] bg-purple-200/40 rounded-full blur-[100px] mix-blend-multiply opacity-60 animate-blob animation-delay-2000" />
                </div>

                <div className="w-full max-w-7xl px-4 py-12 sm:px-6 relative z-10 space-y-12">
                    {/* Premium Header - Enclosed in Glassmorphism for Contrast Guarantee */}
                    <div className={clsx(
                        "relative text-center space-y-6 bg-white/40 dark:bg-black/40 p-8 rounded-[2.5rem] backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-xl overflow-hidden",
                        hideHeader ? "hidden" : "block"
                    )}>

                        {/* Internal ambient glow for the header plate */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 dark:from-white/5 dark:to-transparent pointer-events-none" />

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 dark:bg-black/60 w-fit mx-auto md:mx-0 backdrop-blur-md border border-gray-200/50 dark:border-white/10 shadow-sm rounded-full ring-1 ring-black/5 animate-in fade-in slide-in-from-bottom-2 duration-700">
                                <Icon size={14} className="text-indigo-600 dark:text-indigo-400" />
                                <span className="text-xs font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                                    {badgeText}
                                </span>
                            </div>

                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-2 pt-6">
                                <div className="text-center md:text-left">
                                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight mb-3">
                                        {title}
                                    </h1>
                                    <p className="text-lg text-gray-700 dark:text-gray-300 font-medium max-w-2xl">
                                        {description}
                                    </p>
                                </div>

                                {actions && (
                                    <div className="flex bg-white/70 dark:bg-black/50 backdrop-blur-sm p-1.5 rounded-2xl shadow-sm border border-gray-200/50 dark:border-white/10 ring-1 ring-black/5">
                                        {actions}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tool Content */}
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {children}
                    </div>
                </div>

                {guide}
            </div>
        </DashboardLayout>
    );
};
