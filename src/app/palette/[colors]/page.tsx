import { PaletteDetail } from '@/components/explore/PaletteDetail';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ colors: string }> }) {
    // Validate and parse colors from URL params
    const { colors: colorString } = await params;
    const hexCodes = colorString.split('-');

    if (hexCodes.length < 2) {
        return notFound();
    }

    const validHexCodes = hexCodes.map(c => '#' + c);

    return <PaletteDetail colors={validHexCodes} />;
}
