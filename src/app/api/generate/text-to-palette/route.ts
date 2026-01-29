import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { prompt } = body;

        // Mock logic - in production this would call OpenAI or a Python backend
        console.log(`[TextToPalette] Generating for prompt: ${prompt}`);

        // Simple deterministic hash from prompt to get a "random" color
        let hash = 0;
        for (let i = 0; i < prompt.length; i++) {
            hash = prompt.charCodeAt(i) + ((hash << 5) - hash);
        }
        const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
        const seed = '#' + '00000'.substring(0, 6 - c.length) + c;

        // Mock suggestions
        const mockResponse = {
            status: 'mock',
            seed: seed,
            ai_suggestions: {
                primary: seed,
                secondary: '#ffffff', // Basic fallback
                tertiary: '#000000'
            },
            message: "Generated via Mock Engine (Server Route)"
        };

        return NextResponse.json(mockResponse);

    } catch (error) {
        console.error("Text-to-palette error:", error);
        return NextResponse.json(
            { status: 'error', message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
