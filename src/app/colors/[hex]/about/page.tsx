import { ColorDetailView } from '@/components/colors/ColorDetailView';
import { supabase } from '@/lib/supabase';
import { getNearestColorName, getFullConversions } from '@/lib/color-utils';
import { Metadata, ResolvingMetadata } from 'next';

// Stop ISR Writes (Vercel Limit Fix)
export const dynamic = 'force-dynamic';

type Props = {
    params: Promise<{ hex: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function getColorData(hexParam: string) {
    const hex = hexParam.startsWith('%23')
        ? `#${hexParam.replace('%23', '')}`
        : hexParam.startsWith('#')
            ? hexParam
            : `#${hexParam}`;

    const normalized = hex.replace('#', '').toUpperCase();

    // Attempt to fetch from DB
    const { data } = await supabase
        .from('colors')
        .select('name, hex, description, psychology, meaning, usage_info')
        .ilike('hex', `%${normalized}%`)
        .maybeSingle();

    return { hex, data };
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { hex } = await params;
    const { hex: formattedHex, data } = await getColorData(hex);

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
    const { hex: formattedHex, data } = await getColorData(hex);

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
