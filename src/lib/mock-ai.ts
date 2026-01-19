import chroma from 'chroma-js';
import { extractColors } from 'extract-colors';

export type AIResult = {
    colors: string[]; // Hex codes
    semantic: {
        success: string;
        warning: string;
        error: string;
        info: string;
    };
    description: string;
}

// Simulate AI delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Prompt keywords to color mappings (Heuristic "AI")
const KEYWORD_MAP: Record<string, string[]> = {
    'ocean': ['#006994', '#009DC4', '#7EC8E3', '#003366', '#005F6B'],
    'forest': ['#2E8B57', '#228B22', '#556B2F', '#8FBC8F', '#006400'],
    'fire': ['#FF4500', '#FF8C00', '#FFD700', '#B22222', '#8B0000'],
    'sunset': ['#FF4500', '#FF6347', '#FFD700', '#DA70D6', '#8B4513'],
    'tech': ['#007BFF', '#6610F2', '#6F42C1', '#17A2B8', '#343A40'],
    'luxury': ['#FFD700', '#DAA520', '#B8860B', '#000000', '#2C3E50'],
    'pastel': ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF'],
    'neon': ['#FF00FF', '#00FFFF', '#00FF00', '#FFFF00', '#FF0000'],
};

export const generateFromText = async (prompt: string): Promise<AIResult> => {
    await delay(1500); // Fake thinking time

    const lowerPrompt = prompt.toLowerCase();
    let basePalette: string[] = [];

    // Simple keyword matching
    for (const [key, colors] of Object.entries(KEYWORD_MAP)) {
        if (lowerPrompt.includes(key)) {
            basePalette = colors;
            break;
        }
    }

    // If no match, hash the string to get a "consistent" random seed
    if (basePalette.length === 0) {
        let hash = 0;
        for (let i = 0; i < prompt.length; i++) {
            hash = prompt.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = Math.abs(hash) % 360;
        basePalette = chroma.scale([chroma.hsl(hue, 0.5, 0.5), chroma.hsl((hue + 60) % 360, 0.5, 0.8)])
            .mode('lch').colors(5);
    }

    return buildResult(basePalette, `Generated based on "${prompt}"`);
};

export const generateFromBase = async (baseColor: string): Promise<AIResult> => {
    await delay(1000);
    if (!chroma.valid(baseColor)) throw new Error("Invalid color");

    // Generate a split complementary palette
    const base = chroma(baseColor);
    const palette = [
        base.hex(),
        base.set('hsl.h', '+30').hex(),
        base.set('hsl.h', '-30').hex(),
        base.set('hsl.l', '+0.2').hex(),
        base.set('hsl.l', '-0.2').hex()
    ];

    return buildResult(palette, `Harmonized around ${baseColor}`);
};

export const generateFromImage = async (imageUrl: string): Promise<AIResult> => {
    // Note: extract-colors usually works with Image elements or URLs
    // In a real app we might handle this client-side directly or pass base64
    // wrapping this to simulate the async nature
    try {
        const extracted = await extractColors(imageUrl);
        // Take top 5 colors, sort by area or intensity
        const sorted = extracted.sort((a, b) => b.area - a.area).slice(0, 5).map(c => c.hex);

        // Fill if < 5
        while (sorted.length < 5) {
            sorted.push(chroma(sorted[0]).brighten().hex());
        }

        return buildResult(sorted, "Extracted from image");
    } catch (e) {
        console.error(e);
        // Fallback
        return generateFromText("image");
    }
};

const buildResult = (colors: string[], description: string): AIResult => {
    // Ensure we have 5 colors
    while (colors.length < 5) colors.push(chroma.random().hex());
    colors = colors.slice(0, 5);

    // Heuristic for semantic colors based on the palette
    // Try to find closest matches or generate standard ones that contrast well
    return {
        colors,
        semantic: {
            success: '#10B981', // Default emerald-500
            warning: '#F59E0B', // Default amber-500
            error: '#EF4444',   // Default red-500
            info: '#3B82F6',    // Default blue-500
        },
        description
    };
};

export const generateVariationsFromText = async (prompt: string, count = 4): Promise<AIResult[]> => {
    await delay(1800); // Slightly longer wait for "variety"

    // Base result
    const baseResult = await generateFromText(prompt);
    const variations: AIResult[] = [baseResult];

    // Seed color from the first result
    const primary = baseResult.colors[0];

    // Generate variations using different logic

    // 1. Analogous Variation
    const analogous = chroma.scale([primary, chroma(primary).set('hsl.h', '+45')]).mode('lch').colors(5);
    variations.push(buildResult(analogous, 'Analogous Harmony'));

    // 2. High Contrast / Complementary
    const comp = [
        primary,
        chroma(primary).set('hsl.l', '+0.4').hex(),
        chroma(primary).set('hsl.l', '-0.3').hex(),
        chroma(primary).set('hsl.h', '180').hex(),
        chroma(primary).set('hsl.h', '180').set('hsl.l', '+0.3').hex()
    ];
    variations.push(buildResult(comp, 'High Contrast'));

    // 3. Pastel / Softer Version
    const pastel = baseResult.colors.map(c => chroma(c).desaturate(0.5).brighten(0.5).hex());
    variations.push(buildResult(pastel, 'Soft & Pastel'));

    return variations.slice(0, count);
};
