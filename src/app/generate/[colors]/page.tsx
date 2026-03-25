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
    const hexList = colors.split('-').map(c => '#' + c.toUpperCase());
    const title = `Color Palette: ${hexList.join(' , ')} | Dopely Colors`;
    const description = `Explore this beautiful ${hexList.length}-color palette featuring ${hexList.join(', ')}. Get hex codes, conversion data, and accessible design tokens for your next creative project.`;

    return {
        title,
        description,
        alternates: {
            canonical: `https://dopelycolors.com/generate/${colors}`,
        },
        robots: {
            index: true,
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
