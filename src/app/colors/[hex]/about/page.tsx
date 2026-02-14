import { ColorDetailView } from '@/components/colors/ColorDetailView';
import { supabase } from '@/lib/supabase';
import { getNearestColorName, getFullConversions, isCanonicalColor, getSystematicColors } from '@/lib/color-utils';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';

// Allow On-Demand ISR, but strict validation prevents infinite generation
export const revalidate = 86400; // Cache valid colors for 24h

type Props = {
    params: Promise<{ hex: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// 1. Generate Static Params for Canonical Colors (SEO + Performance)
export async function generateStaticParams() {
    const colors = getSystematicColors();
    return colors.map((c) => ({
        hex: c.hex.replace('#', '')
    }));
}

import { cache } from 'react';

const getColorData = cache(async (hexParam: string) => {
    const hex = hexParam.startsWith('%23')
        ? `#${hexParam.replace('%23', '')}`
        : hexParam.startsWith('#')
            ? hexParam
            : `#${hexParam}`;

    const normalized = hex.replace('#', '').toUpperCase();

    // 1. Check validity (Security Check)
    // If it's not a canonical color (mathematically standard) AND not likely in DB...
    // We check DB first to be safe, or check canonical first?
    // Canonical check is cheaper (CPU) than DB (Network).
    // But DB contains user colors that might NOT be canonical.
    // So if it's NOT canonical, we MUST check DB.
    // If it IS canonical, it's valid, but we still check DB for overrides (description etc).

    // Attempt to fetch from DB
    const { data } = await supabase
        .from('colors')
        .select('name, hex, description, psychology, meaning, usage_info')
        .ilike('hex', `%${normalized}%`)
        .maybeSingle();

    // 2. Strict Validation to prevent "Spider Trap"
    // If not in DB AND not a canonical systematic color -> 404
    if (!data && !isCanonicalColor(normalized)) {
        return { hex, data: null, isValid: false };
    }

    return { hex, data, isValid: true };
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { hex } = await params;
    const { hex: formattedHex, data, isValid } = await getColorData(hex);

    if (!isValid) return { title: 'Color Not Found' };

    const colorName = data?.name || getNearestColorName(formattedHex);
    const conversions = getFullConversions(formattedHex);

    // Create a rich description
    const description = data?.description ||
        `${colorName} (${formattedHex}) is a ${formattedHex} hex color code. usage, psychology, and similar colors for your next design project. RGB: ${conversions.rgb}, CMYK: ${conversions.cmyk}.`;

    const normalizedHex = formattedHex.replace('#', '').toUpperCase();

    return {
        title: `${colorName} (${formattedHex}) Color Code - Meaning, Palettes & Paint`,
        description: description.substring(0, 160), // SEO optimal length
        openGraph: {
            title: `${colorName} (${formattedHex})`,
            description: description,
            type: 'website',
            // images: handled automatically by opengraph-image.tsx
        },
        twitter: {
            card: 'summary_large_image',
            title: `${colorName} (${formattedHex})`,
            description: description,
        },
        alternates: {
            canonical: `/colors/${normalizedHex}/about`,
        }
    };
}

export default async function Page({ params }: Props) {
    const { hex } = await params;
    const { hex: formattedHex, data, isValid } = await getColorData(hex);

    if (!isValid) {
        notFound();
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": `${data?.name || getNearestColorName(formattedHex)} Color`,
        "color": formattedHex,
        "description": data?.description || `${data?.name || getNearestColorName(formattedHex)} is a ${formattedHex} hex color code.`,
        "brand": {
            "@type": "Brand",
            "name": "Dopely Colors"
        },
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
        },
        "additionalProperty": [
            { "@type": "PropertyValue", "name": "HEX", "value": formattedHex },
            { "@type": "PropertyValue", "name": "RGB", "value": getFullConversions(formattedHex).rgb },
            { "@type": "PropertyValue", "name": "CMYK", "value": getFullConversions(formattedHex).cmyk }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ColorDetailView hex={formattedHex} initialDbColor={data} />
        </>
    );
}
