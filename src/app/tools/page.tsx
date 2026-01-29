import { ToolsHubFAQ } from '@/components/content/PageFAQs';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Wand2, Image, Contrast, Pipette, Layers, FileCode, Smartphone, Layout, TrendingUp, Sparkles, ArrowRight, Zap, Palette } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'Design Tools Suite - Dopely Colors',
    description: 'A complete suite of color tools for designers and developers. Generate palettes, check contrast, extract colors from images, and more.',
};

const TOOLS = [
    {
        icon: Sparkles,
        name: 'AI Generator',
        description: 'Turn text descriptions into production-ready color systems.',
        href: '/ai',
        color: 'from-violet-500 to-fuchsia-500',
        badge: 'New',
        bg: 'bg-fuchsia-50'
    },
    {
        icon: Wand2,
        name: 'Palette Generator',
        description: 'Create infinite color combinations with deep learning algorithms.',
        href: '/generate',
        color: 'from-blue-500 to-indigo-500',
        badge: 'Popular',
        bg: 'bg-indigo-50'
    },
    {
        icon: Contrast,
        name: 'Contrast Checker',
        description: 'Ensure your designs meet WCAG AA & AAA accessibility standards.',
        href: '/contrast',
        color: 'from-emerald-500 to-teal-500',
        badge: 'Essential',
        bg: 'bg-emerald-50'
    },
    {
        icon: Image,
        name: 'Image to Colors',
        description: 'Extract dominant colors and gradients from any photo.',
        href: '/image',
        color: 'from-orange-500 to-amber-500',
        badge: null,
        bg: 'bg-orange-50'
    },
    {
        icon: Pipette,
        name: 'Color Picker',
        description: 'Advanced HSL, RGB, and CMYK converter and picker.',
        href: '/picker',
        color: 'from-pink-500 to-rose-500',
        badge: null,
        bg: 'bg-pink-50'
    },
    {
        icon: Layers,
        name: 'Gradient Maker',
        description: 'Design beautiful CSS gradients and mesh backgrounds.',
        href: '/gradients',
        color: 'from-cyan-500 to-sky-500',
        badge: null,
        bg: 'bg-cyan-50'
    },
    {
        icon: Smartphone,
        name: 'UI Visualizer',
        description: 'Preview your colors on real mobile and web mockups.',
        href: '/generate?view=visualize',
        color: 'from-slate-800 to-black',
        badge: 'Pro',
        bg: 'bg-gray-100'
    },
    {
        icon: FileCode,
        name: 'Tailwind Generator',
        description: 'Generate complete 50-950 color scales for Tailwind CSS.',
        href: '/tailwind',
        color: 'from-sky-400 to-blue-600',
        badge: 'Dev',
        bg: 'bg-sky-50'
    },
    {
        icon: Layout,
        name: 'System Builder',
        description: 'Organize your colors into a semantic design system.',
        href: '/design-system',
        color: 'from-purple-600 to-indigo-600',
        badge: 'Beta',
        bg: 'bg-purple-50'
    }
];

export default function ToolsPage() {
    return (
        <DashboardLayout>
            <div className="min-h-screen bg-[#FBFBFB]">
                {/* Hero Section */}
                <div className="pt-24 pb-16 px-6 text-center max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-bold tracking-wide uppercase mb-8 border border-indigo-100">
                        <Zap size={14} className="fill-indigo-600" />
                        The Creative Suite
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
                        Everything you need to <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">Master Color.</span>
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        A complete ecosystem of tools designed to help you generate, test, and export professional color palettes for any project.
                    </p>
                </div>

                {/* Tools Grid */}
                <div className="max-w-7xl mx-auto px-6 pb-32">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {TOOLS.map((tool) => (
                            <Link href={tool.href} key={tool.name} className="group">
                                <div className="h-full bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
                                    <div className={`w-14 h-14 rounded-2xl ${tool.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                        <tool.icon size={28} className={`text-transparent bg-clip-text bg-gradient-to-br ${tool.color}`} />
                                    </div>

                                    {tool.badge && (
                                        <span className={`absolute top-8 right-8 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-900 text-white`}>
                                            {tool.badge}
                                        </span>
                                    )}

                                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                                        {tool.name}
                                    </h3>
                                    <p className="text-slate-500 leading-relaxed mb-6">
                                        {tool.description}
                                    </p>

                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-300 group-hover:text-slate-900 transition-colors">
                                        Launch Tool <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </div>

                                    {/* Decorative Gradient Blob */}
                                    <div className={`absolute -bottom-24 -right-24 w-48 h-48 bg-gradient-to-br ${tool.color} rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Integration Banner */}
                <section className="bg-slate-900 text-white py-24 px-6 overflow-hidden relative">
                    <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="max-w-xl">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready for your workflow?</h2>
                            <p className="text-slate-400 text-lg leading-relaxed mb-8">
                                Install our plugins for Figma, Chrome, and VS Code to access your palettes directly where you work.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <button className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-colors">
                                    View Integrations
                                </button>
                                <button className="px-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-colors">
                                    Read API Docs
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                            {/* Add logos or icons here later */}
                            <TrendingUp size={120} strokeWidth={1} />
                            <Palette size={120} strokeWidth={1} />
                        </div>
                    </div>

                    {/* Background Gradients */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
                </section>

                <ToolsHubFAQ />
            </div>
        </DashboardLayout>
    );
}
