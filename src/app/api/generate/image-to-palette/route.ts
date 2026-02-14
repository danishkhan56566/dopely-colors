import { NextResponse } from 'next/server';
import { extractSeedFromImage, generateCorePalette } from '@/lib/color-engine';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ status: 'error', message: 'No file uploaded' }, { status: 400 });
        }

        console.log(`[ImageToPalette] Processing file: ${file.name} (${file.size} bytes)`);

        // Convert File to Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Extract Seed
        const seedHex = await extractSeedFromImage(buffer);
        console.log(`[ImageToPalette] Extracted seed: ${seedHex}`);

        // Generate System using our TS engine
        const paletteSystem = generateCorePalette(seedHex);

        return NextResponse.json({
            status: 'success',
            seed: seedHex,
            system: paletteSystem,
            message: "Processed via Local Node Engine"
        });

    } catch (error) {
        console.error("Image-to-palette error:", error);
        return NextResponse.json(
            { status: 'error', message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
