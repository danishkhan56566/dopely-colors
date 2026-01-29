import { PaletteDetail } from '@/components/explore/PaletteDetail';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

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

    const validHexCodes = hexCodes.map(c => '#' + c);

    return <PaletteDetail colors={validHexCodes} />;
}
