'use server';

import chroma from 'chroma-js';

// Regex to find colors
const HEX_REGEX = /#(?:[0-9a-fA-F]{3}){1,2}\b/g;
const RGB_REGEX = /rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/g;
const RGBA_REGEX = /rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([0-1]?(?:\.\d+)?)\s*\)/g;

const CSS_VAR_REGEX = /var\((--[^)]+)\)/g;

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

        // Framework Detection Logic
        const frameworks = [];
        if (text.includes('text-blue-') || text.includes('bg-red-')) frameworks.push('Tailwind CSS');
        if (text.includes('MuiButton') || text.includes('MuiBox')) frameworks.push('Material UI');
        if (text.includes('chakra-')) frameworks.push('Chakra UI');
        if (text.includes('bootstrap')) frameworks.push('Bootstrap');

        // Helper to count colors
        const addColor = (hex: string) => {
            try {
                // Normalize to 6-digit hex
                const normalized = chroma(hex).hex();
                colorCounts.set(normalized, (colorCounts.get(normalized) || 0) + 1);
            } catch (e) {
                // Ignore invalid colors
            }
        };

        // 1. Find standard Hex Codes
        const hexMatches = text.match(HEX_REGEX) || [];
        hexMatches.forEach(addColor);

        // 2. Find RGB/RGBA
        const rgbMatches = text.matchAll(RGB_REGEX);
        for (const match of rgbMatches) {
            addColor(`rgb(${match[1]},${match[2]},${match[3]})`);
        }

        // 3. Find Colors in SVG attributes (fill="#...", stroke="#...")
        const svgFillMatches = text.match(/fill=["'](#[0-9a-fA-F]{3,6})["']/g);
        const svgStrokeMatches = text.match(/stroke=["'](#[0-9a-fA-F]{3,6})["']/g);

        svgFillMatches?.forEach(m => {
            const hex = m.match(/#[0-9a-fA-F]{3,6}/)?.[0];
            if (hex) addColor(hex);
        });

        svgStrokeMatches?.forEach(m => {
            const hex = m.match(/#[0-9a-fA-F]{3,6}/)?.[0];
            if (hex) addColor(hex);
        });

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

        return {
            success: true,
            colors: sorted,
            url,
            frameworks: [...new Set(frameworks)] // Dedupe
        };

    } catch (error: any) {
        console.error("Scraping Error:", error);
        return { success: false, error: "Could not access website. It might block bots or CORS." };
    }
}
