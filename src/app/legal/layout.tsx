import { DashboardLayout } from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import { Scale, Shield, Calculator, FileText } from 'lucide-react';

const SidebarItem = ({ href, label, icon: Icon }: { href: string; label: string; icon: any }) => (
    <Link
        href={href}
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
    >
        <Icon size={18} />
        <span className="font-medium text-sm">{label}</span>
    </Link>
);

export default function LegalLayout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold tracking-tight mb-4">Legal & Privacy</h1>
                    <p className="text-xl text-gray-500 max-w-2xl">
                        Transparency is core to our values. Here's how we handle your data and your rights.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Sidebar */}
                    <div className="space-y-2 lg:sticky lg:top-24 h-fit">
                        <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                            Documents
                        </div>
                        <SidebarItem href="/legal/terms" label="Terms of Service" icon={FileText} />
                        <SidebarItem href="/legal/privacy" label="Privacy Policy" icon={Shield} />
                        <SidebarItem href="/legal/cookie-policy" label="Cookie Policy" icon={Calculator} />
                        <SidebarItem href="/legal/license" label="License" icon={Scale} />
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3 prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-600 hover:prose-a:text-blue-500">
                        <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-100 shadow-sm">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
