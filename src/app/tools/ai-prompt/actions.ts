'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";
import chroma from 'chroma-js';

export async function generatePaletteFromPrompt(prompt: string) {
    const apiKey = process.env.GOOGLE_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

    if (!apiKey) {
        return {
            success: false,
            error: "API Key Not Found",
            data: mockFallback(prompt)
        };
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const finalPrompt = `
            You are an expert Color Theorist and UI Designer.
            Generate a color palette based on this user prompt: "${prompt}".

            Respond with ONLY valid JSON (no markdown blocks).
            JSON Structure:
            {
                "palette_name": "string (Creative Name)",
                "description": "string (Why these colors fit the mood, 1-2 sentences)",
                "colors": [
                    { "hex": "#RRGGBB", "name": "string" } (Exactly 5 colors)
                ],
                "usage_tips": {
                    "background": "Choice from colors",
                    "surface": "Choice from colors",
                    "primary": "Choice from colors",
                    "secondary": "Choice from colors",
                    "accent": "Choice from colors"
                }
            }
        `;

        const result = await model.generateContent(finalPrompt);
        const response = await result.response;
        const text = response.text();
        const cleanText = text.replace(/```json|```/g, "").trim();
        const data = JSON.parse(cleanText);

        return { success: true, data };

    } catch (error: any) {
        console.error("AI Generation Failed:", error);
        return {
            success: false,
            error: error.message,
            data: mockFallback(prompt) // Fallback so user sees something
        };
    }
}

// Fallback if AI fails (Keyword-based)
function mockFallback(prompt: string) {
    const p = prompt.toLowerCase();
    let colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#1e293b']; // Default
    let name = "Standard Palette";

    if (p.includes('sunset')) {
        colors = ['#f59e0b', '#ef4444', '#7c3aed', '#1e1b4b', '#fff7ed'];
        name = "Sunset Vibes";
    } else if (p.includes('cyber') || p.includes('neon')) {
        colors = ['#0ef', '#f0f', '#fa0', '#111', '#222'];
        name = "Cyberpunk Neo";
    } else if (p.includes('forest') || p.includes('nature')) {
        colors = ['#064e3b', '#10b981', '#a7f3d0', '#f0fdf4', '#3f2c22'];
        name = "Deep Forest";
    }

    return {
        palette_name: name,
        description: "Generated based on keyword matching (AI Service unavailable).",
        colors: colors.map(hex => ({ hex, name: chroma(hex).name() })),
        usage_tips: {
            background: colors[4],
            surface: colors[3],
            primary: colors[0],
            secondary: colors[1],
            accent: colors[2]
        }
    };
}
