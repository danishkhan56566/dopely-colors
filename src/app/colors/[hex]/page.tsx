import { ColorDetailView } from '@/components/colors/ColorDetailView';
import { supabase } from '@/lib/supabase';
import { getNearestColorName, getFullConversions, isCanonicalColor, getSystematicColors } from '@/lib/color-utils';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import chroma from 'chroma-js';

// 1. Configuration: ISR and Static Generation
export const revalidate = 86400; // Cache valid colors for 24h

type Props = {
    params: Promise<{ hex: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// 2. Data Fetching with Cache (Spider Trap Prevention)
const getColorData = cache(async (hexParam: string) => {
    // Normalize hex format
    const hex = hexParam.startsWith('%23')
        ? `#${hexParam.replace('%23', '')}`
        : hexParam.startsWith('#')
            ? hexParam
            : `#${hexParam}`;

    const normalized = hex.replace('#', '').toUpperCase();

    // Strict Validation: Must be a valid chroma color AND either canonical OR in DB
    if (!chroma.valid(hex)) {
        return { hex, data: null, isValid: false };
    }

    const { data } = await supabase
        .from('colors')
        .select('name, hex, description, psychology, meaning, usage_info')
        .ilike('hex', `%${normalized}%`)
        .maybeSingle();

    if (!data && !isCanonicalColor(normalized)) {
        return { hex, data: null, isValid: false };
    }

    return { hex, data, isValid: true };
});

// 3. Static Params for Standard Colors (Performance)
export async function generateStaticParams() {
    const colors = getSystematicColors();
    return colors.map((c) => ({
        hex: c.hex.replace('#', '').toUpperCase()
    }));
}

// 4. Dynamic Metadata for SEO
export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const { hex: hexParam } = await params;
    const { hex, data, isValid } = await getColorData(hexParam);

    if (!isValid) return { title: 'Color Not Found | Dopely Colors' };

    const normalizedHex = hex.replace('#', '').toUpperCase();
    const colorName = data?.name || getNearestColorName(hex);
    const conversions = getFullConversions(hex);

    const description = data?.description ||
        `${colorName} (${hex}) hex color code details. Explore RGB, HSL, CMYK conversions, color psychology, and matching palettes for ${colorName}.`;

    return {
        title: `${colorName} (${hex}) Color Code - Meaning, Palettes & Psychology | Dopely Colors`,
        description: description.substring(0, 160),
        openGraph: {
            title: `${colorName} (${hex})`,
            description: description,
            images: [`/api/og/color?hex=${normalizedHex}`],
            type: 'website',
        },
        alternates: {
            canonical: `https://dopelycolors.com/colors/${normalizedHex}`,
        }
    };
}

// 5. Main Page Component
export default async function Page({ params }: Props) {
    const { hex: hexParam } = await params;
    const { hex, data, isValid } = await getColorData(hexParam);

    if (!isValid) {
        notFound();
    }

    const normalizedHex = hex.replace('#', '').toUpperCase();
    const colorName = data?.name || getNearestColorName(hex);
    const conversions = getFullConversions(hex);

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://dopelycolors.com"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Color Library",
                "item": "https://dopelycolors.com/colors"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": colorName,
                "item": `https://dopelycolors.com/colors/${normalizedHex}`
            }
        ]
    };

    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": `What is the RGB value of ${colorName} (${hex})?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `The RGB color code for ${colorName} (${hex}) is ${conversions.rgb}.`
                }
            },
            {
                "@type": "Question",
                "name": `What is the CMYK for the color ${hex}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `The CMYK values for ${hex} are ${conversions.cmyk}.`
                }
            },
            {
                "@type": "Question",
                "name": `What does the color ${colorName} symbolize?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": data?.description || `${colorName} is a versatile color often used to convey specific emotions in design. Explore its psychology and matching palettes on Dopely Colors.`
                }
            }
        ]
    };

    const productJsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": `${colorName} Color`,
        "color": hex,
        "description": data?.description || `${colorName} is a ${hex} hex color code details and conversions.`,
        "brand": {
            "@type": "Brand",
            "name": "Dopely Colors"
        },
        "additionalProperty": [
            { "@type": "PropertyValue", "name": "HEX", "value": hex },
            { "@type": "PropertyValue", "name": "RGB", "value": conversions.rgb },
            { "@type": "PropertyValue", "name": "CMYK", "value": conversions.cmyk },
            { "@type": "PropertyValue", "name": "HSL", "value": conversions.hsl }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
            />
            <ColorDetailView hex={hex} initialDbColor={data} />
        </>
    );
}
