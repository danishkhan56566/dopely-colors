import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ShieldCheck, Code, ArrowRight, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Embed Badges | Dopely Colors',
    description: 'Embed Dopely Colors on your website or portfolio to show off your color systems and accessbility standards.',
};

export default function BadgesPage() {
    const badges = [
        {
            title: 'Made with Dopely Colors (Light)',
            description: 'A clean, minimal badge for light-themed portfolios and documentation.',
            html: `<a href="https://dopelycolors.com" style="display:inline-flex;align-items:center;gap:8px;padding:8px 12px;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;text-decoration:none;color:#111827;font-family:sans-serif;font-size:12px;font-weight:600;box-shadow:0 1px 2px rgba(0,0,0,0.05);"><span style="display:flex;width:16px;height:16px;border-radius:4px;background:linear-gradient(45deg,#f43f5e,#8b5cf6,#0ea5e9);"></span>Colors by Dopely</a>`,
            type: 'light'
        },
        {
            title: 'Powered by Dopely Colors (Dark)',
            description: 'A sleek, premium badge optimized for dark mode websites.',
            html: `<a href="https://dopelycolors.com" style="display:inline-flex;align-items:center;gap:8px;padding:8px 12px;background:#111827;border:1px solid #374151;border-radius:8px;text-decoration:none;color:#ffffff;font-family:sans-serif;font-size:12px;font-weight:600;box-shadow:0 1px 2px rgba(0,0,0,0.2);"><span style="display:flex;width:16px;height:16px;border-radius:4px;background:linear-gradient(45deg,#f43f5e,#8b5cf6,#0ea5e9);"></span>Powered by Dopely</a>`,
            type: 'dark'
        },
        {
            title: 'Accessibility Verified',
            description: 'Show your users that your UI passes WCAG AAA contrast standards.',
            html: `<a href="https://dopelycolors.com/contrast" style="display:inline-flex;align-items:center;gap:8px;padding:8px 12px;background:#ecfdf5;border:1px solid #a7f3d0;border-radius:8px;text-decoration:none;color:#065f46;font-family:sans-serif;font-size:12px;font-weight:600;"><span style="display:flex;align-items:center;justify-content:center;width:16px;height:16px;border-radius:16px;background:#10b981;color:white;font-size:10px;">✓</span>WCAG AAA Verified</a>`,
            type: 'success'
        }
    ];

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-50 pb-32">
                {/* Hero Section */}
                <header className="pt-24 pb-16 px-6 bg-white border-b border-gray-200">
                    <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-widest mb-6">
                            <ShieldCheck size={16} /> Showcase your colors
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">
                            Embed Dopely Badges
                        </h1>
                        <p className="text-xl text-gray-500 font-medium max-w-2xl">
                            Used our AI or Contrast Checker to build your UI? Grab an embed badge to show your users that your design is mathematically harmonious and accessible.
                        </p>
                    </div>
                </header>

                {/* Badges Grid */}
                <main className="max-w-4xl mx-auto px-6 mt-16 space-y-12">
                    {badges.map((badge, idx) => (
                        <div key={idx} className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm flex flex-col md:flex-row items-center">

                            {/* Preview Area */}
                            <div className="w-full md:w-1/3 min-h-[200px] flex flex-col items-center justify-center p-8 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 block">Live Preview</span>
                                <div dangerouslySetInnerHTML={{ __html: badge.html }} />
                            </div>

                            {/* Code Area */}
                            <div className="w-full md:w-2/3 p-8 flex flex-col justify-center">
                                <h2 className="text-xl font-bold text-gray-900 mb-2">{badge.title}</h2>
                                <p className="text-gray-500 font-medium mb-6">{badge.description}</p>

                                <div className="relative group">
                                    <pre className="bg-gray-900 text-gray-300 p-4 rounded-xl text-xs font-mono overflow-x-auto">
                                        <code>{badge.html}</code>
                                    </pre>
                                </div>
                            </div>

                        </div>
                    ))}

                    {/* How to use */}
                    <div className="bg-blue-50 border border-blue-100 rounded-3xl p-8 mt-16">
                        <h3 className="text-xl font-bold text-blue-900 flex items-center gap-2 mb-4">
                            <Code size={20} /> How to add this to your site
                        </h3>
                        <p className="text-blue-800 font-medium leading-relaxed mb-6">
                            Simply copy the HTML code above and paste it anywhere in your website's codebase. It works perfectly in React (using <code className="bg-white/50 px-1 rounded text-sm">dangerouslySetInnerHTML</code>), pure HTML, Vue, or any CMS like WordPress and Webflow.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-blue-800 font-medium">
                                <ArrowRight size={18} className="mt-0.5 text-blue-500" />
                                Paste into your global Footer to show sitewide support.
                            </li>
                            <li className="flex items-start gap-3 text-blue-800 font-medium">
                                <ArrowRight size={18} className="mt-0.5 text-blue-500" />
                                Add to your GitHub Repository README.md file.
                            </li>
                        </ul>
                    </div>
                </main>
            </div>
        </DashboardLayout>
    );
}
