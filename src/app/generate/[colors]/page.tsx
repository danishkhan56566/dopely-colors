import Generator from '@/components/Generator';
import { Suspense } from 'react';
import { Metadata } from 'next';

type Props = {
    params: Promise<{ colors: string }>
}

export function generateStaticParams() {
    return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { colors } = await params;
    return {
        title: `Color Palette Generator - ${colors.split('-').map(c => '#' + c).join(', ')}`,
        description: `Generate, visualize and export your color palette. Hex codes: ${colors.split('-').map(c => '#' + c.toUpperCase()).join(', ')}`,
        alternates: {
            canonical: `https://dopelycolors.com/generate/${colors}`,
        },
        robots: {
            index: false,
            follow: true,
        },
    };
}

export default function Page() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <Generator />
        </Suspense>
    );
}
