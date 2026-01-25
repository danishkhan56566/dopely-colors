import { ColorDetailView } from '@/components/colors/ColorDetailView';
import { supabase } from '@/lib/supabase';
import { getNearestColorName, getFullConversions } from '@/lib/color-utils';
import { Metadata, ResolvingMetadata } from 'next';

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

    return {
        title: `${colorName} (${formattedHex}) Color Code - Meaning, Palettes & Paint`,
        description: description.substring(0, 160), // SEO optimal length
        openGraph: {
            title: `${colorName} (${formattedHex})`,
            description: description,
            type: 'website',
            images: [
                // In a real app we'd have a dynamic OG image generator route
                // `/api/og/color?hex=${formattedHex.replace('#', '')}`
                {
                    url: `https://dopelycolors.com/api/og/color?hex=${formattedHex.replace('#', '')}`,
                    width: 1200,
                    height: 630,
                    alt: `${colorName} Color Preview`,
                }
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${colorName} (${formattedHex})`,
            description: description,
        },
        alternates: {
            canonical: `https://dopelycolors.com/colors/${formattedHex.replace('#', '')}/about`,
        }
    };
}

export default async function Page({ params }: Props) {
    const { hex } = await params;
    const { hex: formattedHex, data } = await getColorData(hex);

    return <ColorDetailView hex={formattedHex} initialDbColor={data} />;
}
