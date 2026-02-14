import { createClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { PaletteDetail } from '@/components/explore/PaletteDetail';
import { cache } from 'react';

// Generate Metadata for SEO
export const revalidate = 86400; // Cache for 24 hours (Critical for Cost Savings)

const getPalette = cache(async (id: string) => {
    const supabase = await createClient();
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

    return (
        <PaletteDetail colors={palette.colors} />
    );
}
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { PaletteDetail } from '@/components/explore/PaletteDetail';

// Generate Metadata for SEO
export const revalidate = 86400; // Cache for 24 hours (Critical for Cost Savings)
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const supabase = await createClient();

    const { data: palette } = await supabase
        .from('palettes')
        .select('*')
        .eq('id', id)
        .eq('is_public', true)
        .single();

    if (!palette) {
        return {
            title: 'Palette Not Found - Dopely Colors',
        };
    }

    return {
        title: `${palette.name || 'Shared Palette'} - Dopely Colors`,
        description: `Check out this color palette: ${palette.colors.join(', ')}`,
        openGraph: {
            images: [`/api/og?colors=${palette.colors.join(',')}`], // Future optimization
        }
    };
}

export default async function PublicPalettePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch Palette
    const { data: palette } = await supabase
        .from('palettes')
        .select('*')
        .eq('id', id)
        .single();

    // Strict Privacy Check
    // We allow fetching even if private IF it belongs to the user (handled by RLS usually), 
    // but for this public route, we strictly enforce 'is_public' unless we implement user check here.
    // For simplicity: If not public, 404.
    if (!palette || !palette.is_public) {
        return notFound();
    }

    return (
        <PaletteDetail colors={palette.colors} />
    );
}
