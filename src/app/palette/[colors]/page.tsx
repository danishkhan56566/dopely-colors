import { PaletteDetail } from '@/components/explore/PaletteDetail';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

// Stop ISR Writes (Vercel Limit Fix)
export const dynamic = 'force-dynamic';

type Props = {
    params: Promise<{ colors: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { colors: colorString } = await params;
    const hexCodes = colorString.split('-').map(c => '#' + c.toUpperCase());

    return {
        title: `Color Palette ${hexCodes.join(' - ')} - Dopely Colors`,
        description: `View and edit this color palette: ${hexCodes.join(', ')}. Create variations, check contrast, and export for your projects.`,
        openGraph: {
            title: `Color Palette ${hexCodes.join(' ')}`,
            description: `Beautiful color palette containing ${hexCodes.join(', ')}`,
        },
        alternates: {
            canonical: `/palette/${colorString}`,
        }
    };
}

export default async function Page({ params }: Props) {
    // Validate and parse colors from URL params
    const { colors: colorString } = await params;
    const hexCodes = colorString.split('-');

    if (hexCodes.length < 2) {
        return notFound();
    }

    // Validate hex codes (must be 3 or 6 hex digits)
    const validHexCodes = hexCodes
        .filter(c => /^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(c))
        .map(c => '#' + c);

    if (validHexCodes.length === 0) {
        return notFound();
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "name": `Color Palette ${validHexCodes.join('-')}`,
        "description": `A curated color palette containing ${validHexCodes.join(', ')}.`,
        "creator": {
            "@type": "Organization",
            "name": "Dopely Colors"
        },
        "keywords": `color palette, ${validHexCodes.join(', ')}`,
        "additionalProperty": validHexCodes.map(hex => ({
            "@type": "PropertyValue",
            "name": "Color",
            "value": hex
        }))
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <PaletteDetail colors={validHexCodes} />
        </>
    );
}
