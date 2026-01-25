import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Footer } from '@/components/layout/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Design Guides | Dopely Colors',
    description: 'Master color theory, accessibility, and modern UI design with our comprehensive guides.',
};

export default function GuidesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <DashboardLayout>
            <div className="min-h-screen bg-white">
                <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
                    {children}
                </div>
            </div>
            <Footer />
        </DashboardLayout>
    );
}
