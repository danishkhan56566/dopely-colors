import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { generateCorePalette } from '@/lib/color-engine';

// Initialize OpenAI
// OpenAI initialization moved inside handler to prevent build-time errors if key is missing

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { prompt } = body;

        console.log(`[TextToPalette] Generating for prompt: ${prompt}`);

        if (!process.env.OPENAI_API_KEY) {
            console.warn("No OPENAI_API_KEY found. Returning mock data.");
            return NextResponse.json({
                status: 'mock',
                seed: '#6366f1',
                system: generateCorePalette('#6366f1'),
                message: "Generated via Mock Engine (No API Key)"
            });
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                {
                    role: "system",
                    content: "You are a specialized Design AI. Analyze the user's request for INDUSTRY CONTEXT (e.g., Food, Weather, Finance). Return a JSON object with keys: 'primary', 'secondary', 'tertiary'. Values must be hex codes. Example: {'primary': '#FF0000', 'secondary': '#00FF00', 'tertiary': '#0000FF'}"
                },
                { role: "user", content: `Create a palette for: ${prompt}` }
            ],
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0].message.content;
        const colors = JSON.parse(content || '{}');
        const seedHex = colors.primary || '#6366f1';

        // Generate System using our new TS engine
        const paletteSystem = generateCorePalette(seedHex);

        return NextResponse.json({
            status: 'success',
            seed: seedHex,
            ai_suggestions: colors,
            system: paletteSystem
        });

    } catch (error) {
        console.error("Text-to-palette error:", error);
        return NextResponse.json(
            { status: 'error', message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
