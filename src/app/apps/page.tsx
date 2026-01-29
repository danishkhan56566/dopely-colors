import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Smartphone, Monitor, Globe, Code, Figma, Chrome, ArrowRight, Apple, Play } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'Apps & Integrations - Dopely Colors',
    description: 'Download Dopely Colors for iOS, Android, Figma, and Chrome. Integrate color tools into your workflow.',
};

const APPS = [
    {
        id: 'ios',
        name: 'iOS App',
        description: 'Create palettes on the go. Sync with your iCloud.',
        icon: Apple,
        color: 'bg-black text-white',
        status: 'Coming Soon',
        buttonText: 'Join Waitlist',
        href: '#'
    },
    {
        id: 'android',
        name: 'Android App',
        description: 'Material Design color tools in your pocket.',
        icon: Smartphone, // Using Smartphone as generic android proxy if Play icon isn't preferred
        color: 'bg-green-500 text-white',
        status: 'Coming Soon',
        buttonText: 'Join Waitlist',
        href: '#'
    },
    {
        id: 'figma',
        name: 'Figma Plugin',
        description: 'Import palettes directly into your design files.',
        icon: Figma,
        color: 'bg-purple-600 text-white',
        status: 'Available',
        buttonText: 'Install Plugin',
        href: '#'
    },
    {
        id: 'chrome',
        name: 'Chrome Extension',
        description: 'Pick colors from any website instantly.',
        icon: Chrome,
        color: 'bg-blue-600 text-white',
        status: 'Beta',
        buttonText: 'Add to Chrome',
        href: '#'
    },
    {
        id: 'web',
        name: 'Web App',
        description: 'The full suite of color tools in your browser.',
        icon: Globe,
        color: 'bg-rainbow text-white',
        status: 'Live',
        buttonText: 'Launch App',
        href: '/'
    },
    {
        id: 'api',
        name: 'Dopely API',
        description: 'Programmatic access to color intelligence.',
        icon: Code,
        color: 'bg-gray-800 text-white',
        status: 'Pro',
        buttonText: 'Read Docs',
        href: '/pricing'
    }
];

export default function AppsPage() {
    return (
        <DashboardLayout>
            <div className="min-h-screen bg-white flex flex-col">
                <div className="flex-1 max-w-7xl mx-auto px-6 py-24 w-full">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h1 className="text-5xl font-bold mb-6">
                            Take <span className="text-rainbow">Dopely</span> Everywhere
                        </h1>
                        <p className="text-xl text-gray-500">
                            Seamlessly integrate color intelligence into your workflow. Whether you're designing in Figma, browsing the web, or on the go.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {APPS.map((app) => (
                            <div
                                key={app.id}
                                id={app.id}
                                className="p-8 rounded-3xl border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 group bg-gray-50 hover:bg-white"
                            >
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg ${app.color} group-hover:scale-110 transition-transform duration-300`}>
                                    <app.icon size={32} />
                                </div>

                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-2xl font-bold">{app.name}</h3>
                                    {app.status && (
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${app.status === 'Live' ? 'bg-green-100 text-green-700' :
                                            app.status === 'Coming Soon' ? 'bg-gray-200 text-gray-600' :
                                                app.status === 'Beta' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-purple-100 text-purple-700'
                                            }`}>
                                            {app.status}
                                        </span>
                                    )}
                                </div>

                                <p className="text-gray-500 mb-8 h-12">
                                    {app.description}
                                </p>

                                <Link
                                    href={app.href}
                                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${app.status === 'Coming Soon'
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                        : 'bg-black text-white hover:bg-gray-800'
                                        }`}
                                >
                                    {app.buttonText}
                                    {app.status !== 'Coming Soon' && <ArrowRight size={18} />}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
