'use server';

import chroma from 'chroma-js';

// Regex to find colors
const HEX_REGEX = /#(?:[0-9a-fA-F]{3}){1,2}\b/g;
const RGB_REGEX = /rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/g;
const RGBA_REGEX = /rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([0-1]?(?:\.\d+)?)\s*\)/g;

export async function scrapeColors(url: string) {
    if (!url) return { success: false, error: 'URL required' };

    // Ensure protocol
    if (!url.startsWith('http')) url = 'https://' + url;

    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; DopleyColorsBot/1.0)'
            },
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

        const text = await res.text();
        const colorCounts = new Map<string, number>();

        // Helper to count colors
        const addColor = (hex: string) => {
            try {
                // Normalize to 6-digit hex
                const normalized = chroma(hex).hex();
                // Filter out boring colors if needed? allow all for now
                colorCounts.set(normalized, (colorCounts.get(normalized) || 0) + 1);
            } catch (e) {
                // Ignore invalid colors
            }
        };

        // Find Hex
        const hexMatches = text.match(HEX_REGEX) || [];
        hexMatches.forEach(addColor);

        // Find RGB
        const rgbMatches = text.matchAll(RGB_REGEX);
        for (const match of rgbMatches) {
            addColor(`rgb(${match[1]},${match[2]},${match[3]})`);
        }

        // Sort by frequency
        const sorted = Array.from(colorCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 20) // Top 20
            .map(([hex, count]) => ({
                hex,
                count,
                name: chroma(hex).name(),
                lum: chroma(hex).luminance()
            }));

        return { success: true, colors: sorted, url };

    } catch (error: any) {
        console.error("Scraping Error:", error);
        return { success: false, error: "Could not access website. It might block bots or CORS." };
    }
}
