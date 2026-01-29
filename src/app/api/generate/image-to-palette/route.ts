import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ status: 'error', message: 'No file uploaded' }, { status: 400 });
        }

        console.log(`[ImageToPalette] Processing file...`);

        // Mock response
        const mockResponse = {
            status: 'success',
            seed: '#6366f1', // Always return indigo for mock
            system: {
                palettes: {
                    primary: { '40': '#4f46e5', '90': '#e0e7ff' },
                    secondary: { '40': '#9333ea' },
                    tertiary: { '40': '#ec4899' }
                }
            },
            message: "Processed via Mock Engine (Server Route)"
        };

        return NextResponse.json(mockResponse);

    } catch (error) {
        console.error("Image-to-palette error:", error);
        return NextResponse.json(
            { status: 'error', message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
