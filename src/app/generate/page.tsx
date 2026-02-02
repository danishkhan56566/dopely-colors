import Generator from '@/components/Generator';
import { Suspense } from 'react';

export const metadata = {
    title: 'AI Color Palette Generator - Create & Visualize Perfect Schemes',
    description: 'Generate beautiful color palettes instantly with AI. Visualize on real designs, check contrast, and export to CSS, Tailwind, or Figma.',
    alternates: {
        canonical: 'https://dopelycolors.com/generate',
    },
};

export default function Page() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <Generator />
        </Suspense>
    );
}
