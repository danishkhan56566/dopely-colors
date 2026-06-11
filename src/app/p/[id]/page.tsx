import { createPublicClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { PaletteDetail } from '@/components/explore/PaletteDetail';
import { cache } from 'react';

// Generate Metadata for SEO
export const revalidate = 86400; // Cache for 24 hours (Critical for Cost Savings)

const getPalette = cache(async (id: string) => {
    const supabase = createPublicClient();
    const { data: palette } = await supabase
        .from('palettes')
        .select('*')
        .eq('id', id)
        .eq('is_public', true) // Ensure public only here
        .single();

    return palette;
});

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const palette = await getPalette(id);

    if (!palette) {
        return {
            title: 'Palette Not Found - Dopely Colors',
        };
    }

    return {
        title: `${palette.name || 'Shared Palette'} - Dopely Colors`,
        description: `Check out this color palette: ${palette.colors.join(', ')}`,
        alternates: {
            canonical: `https://dopelycolors.com/p/${id}`,
        },
        openGraph: {
            images: [`/api/og?colors=${palette.colors.join(',')}`], // Future optimization
        }
    };
}

export default async function PublicPalettePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const palette = await getPalette(id);

    if (!palette) {
        return notFound();
    }

    const schema = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "name": palette.name || `Color Palette ${id}`,
        "description": `A beautiful color palette consisting of: ${palette.colors.join(', ')}`,
        "url": `https://dopelycolors.com/p/${id}`,
        "creator": {
            "@type": "Organization",
            "name": "Dopely Colors"
        },
        "keywords": `color palette, ${palette.colors.join(', ')}`
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
            <PaletteDetail colors={palette.colors} />
        </>
    );
}

