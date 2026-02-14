'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";
import chroma from 'chroma-js';

export async function generatePaletteFromPrompt(prompt: string, context: 'ui' | 'illustration' | 'print' = 'ui', lockedColors: { [key: number]: string } = {}) {
    const apiKey = process.env.GOOGLE_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

    if (!apiKey) {
        return {
            success: false,
            error: "API Key Not Found",
            data: mockFallback(prompt, context, lockedColors)
        };
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const contextRules = {
            ui: "Prioritize high contrast, semantic utility (success/error/warning states), and accessible foreground/background pairs. Focus on readability.",
            illustration: "Prioritize artistic harmony, mood, and aesthetic appeal. Contrast is less critical than emotional resonance.",
            print: "Restrict output to CMYK-safe colors. Avoid neon or super-bright RGB values that cannot be printed."
        };

        const lockedConstraints = Object.keys(lockedColors).length > 0
            ? `CONSTRAINTS: The following colors are LOCKED by the user and MUST appear in the final palette at these exact indices (0-4):
               ${Object.entries(lockedColors).map(([i, hex]) => `- Index ${i}: ${hex}`).join('\n')}`
            : "";

        const finalPrompt = `
            You are an expert Color Psychologist and UI Designer.
            
            GOAL: Generate a color palette based on this user prompt: "${prompt}".
            CONTEXT: ${contextRules[context]}
            ${lockedConstraints}
            
            EMOTION MAPPING:
            - Analyze the abstract emotions in the prompt (e.g., "trust", "energy", "calm").
            - Map these emotions to color psychology principles (e.g., Trust = Blue, Energy = Orange/Red).
            - Ensure the final palette reflects these psychological associations.

            Respond with ONLY valid JSON (no markdown blocks).
            JSON Structure:
            {
                "palette_name": "string (Creative Name)",
                "description": "string (Explain the emotional mapping and why these colors fit the mood/context)",
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
            data: mockFallback(prompt, context) // Fallback so user sees something
        };
    }
}

// Fallback if AI fails (Keyword-based)
// Fallback if AI fails (Keyword-based + Procedural)
function mockFallback(prompt: string, context: 'ui' | 'illustration' | 'print' = 'ui', lockedColors: { [key: number]: string } = {}) {
    const p = prompt.toLowerCase();
    let colors: string[] = [];
    let name = "Generated Palette";
    let desc = "A unique palette generated based on your prompt's energy.";

    // 1. Keyword Overrides
    if (p.includes('sunset')) {
        colors = ['#f59e0b', '#ef4444', '#7c3aed', '#1e1b4b', '#fff7ed'];
        name = "Sunset Vibes";
    } else if (p.includes('cyber') || p.includes('neon')) {
        colors = ['#00ffea', '#ff00ff', '#facc15', '#111827', '#2d3748'];
        name = "Cyberpunk Neo";
    } else if (p.includes('forest') || p.includes('nature')) {
        colors = ['#064e3b', '#10b981', '#a7f3d0', '#f0fdf4', '#3f2c22'];
        name = "Deep Forest";
    } else if (p.includes('ocean') || p.includes('sea') || p.includes('water')) {
        colors = ['#0c4a6e', '#0284c7', '#38bdf8', '#bae6fd', '#f0f9ff'];
        name = "Oceanic Depth";
    } else {
        // 2. Procedural Generation based on prompt hash
        let hash = 0;
        for (let i = 0; i < p.length; i++) {
            hash = ((hash << 5) - hash) + p.charCodeAt(i);
            hash |= 0;
        }

        const seededRandom = () => {
            const x = Math.sin(hash++) * 10000;
            return x - Math.floor(x);
        };

        const baseHue = Math.floor(seededRandom() * 360);

        // Adjust saturation/lightness based on context
        let s_mod = 0;
        let l_mod = 0;

        if (context === 'illustration') {
            s_mod = 0.2; // Boost saturation for art
            desc += " Optimized for artistic harmony.";
        } else if (context === 'print') {
            s_mod = -0.2; // Reduce saturation for print
            l_mod = 0.1; // Lighten slightly
            desc += " Optimized for CMYK safety.";
        } else {
            desc += " Optimized for UI accessibility.";
        }

        // Helper to clamp values
        const clamp = (v: number) => Math.max(0, Math.min(1, v));

        colors = [
            chroma.hsl(baseHue, clamp(0.7 + s_mod), clamp(0.2 + l_mod)).hex(), // Dark Bg
            chroma.hsl(baseHue, clamp(0.6 + s_mod), clamp(0.95 + l_mod)).hex(), // Light Surface
            chroma.hsl(baseHue, clamp(0.8 + s_mod), clamp(0.5 + l_mod)).hex(), // Primary
            chroma.hsl((baseHue + 150) % 360, clamp(0.7 + s_mod), clamp(0.6 + l_mod)).hex(), // Secondary
            chroma.hsl((baseHue + 210) % 360, clamp(0.8 + s_mod), clamp(0.6 + l_mod)).hex()  // Accent
        ];

        name = `${prompt.split(' ').slice(0, 2).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Theme`;
    }

    // Apply Locked Colors Overrides (Generic catch-all for keywords too)
    Object.entries(lockedColors).forEach(([index, hex]) => {
        const i = parseInt(index);
        if (i >= 0 && i < colors.length) {
            colors[i] = hex;
        }
    });

    return {
        palette_name: name,
        description: desc,
        colors: colors.map(hex => ({ hex, name: chroma(hex).name() })),
        usage_tips: {
            background: colors[0],
            surface: colors[1],
            primary: colors[2],
            secondary: colors[3],
            accent: colors[4]
        }
    };
}
