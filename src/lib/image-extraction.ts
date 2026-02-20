import chroma from 'chroma-js';

// --- Types ---

export type SemanticRole = 'Background' | 'Surface' | 'Primary' | 'Secondary' | 'Accent';

export interface ExtractedColor {
    hex: string;
    area: number; // Dominance (0-1)
    hue: number;
    saturation: number;
    lightness: number;
    intensity: number;
    role?: SemanticRole;
}

export interface ExtractionResult {
    palette: ExtractedColor[];
    semanticGroups: Record<SemanticRole, ExtractedColor[]>;
    stats: {
        temperature: 'Warm' | 'Cool';
        vibrancy: number;
        contrast: number;
        harmony: string;
    };
}

// --- Configuration ---
const MAX_DIMENSION = 600;
const SAMPLING_RATE = 1;

// --- Helper Functions ---

function getHarmony(hues: number[]): string {
    if (hues.length < 2) return 'Monochromatic';

    // Check for Complementary (approx 180 deg apart)
    const hasComplementary = hues.some(h1 =>
        hues.some(h2 => Math.abs(Math.abs(h1 - h2) - 180) < 25)
    );
    if (hasComplementary && hues.length <= 4) return 'Complementary';

    // Check for Analogous (all within 60 degrees)
    const sortedHues = [...hues].sort((a, b) => a - b);
    let maxGap = 0;
    for (let i = 0; i < sortedHues.length; i++) {
        const next = (i + 1) % sortedHues.length;
        let gap = Math.abs(sortedHues[i] - sortedHues[next]);
        if (gap > 180) gap = 360 - gap;
        if (gap > maxGap) maxGap = gap;
    }
    // If the largest gap is > 300, it means all colors are within a 60 deg arc
    if (maxGap >= 300) return 'Analogous';

    // Triadic (approx 120 apart)
    const hasTriadic = hues.some(h1 =>
        hues.some(h2 => Math.abs(Math.abs(h1 - h2) - 120) < 25) &&
        hues.some(h3 => Math.abs(Math.abs(h1 - h3) - 240) < 25)
    );
    if (hasTriadic) return 'Triadic';

    return 'Complex / Freeform';
}

function assignSemanticRoles(colors: ExtractedColor[]): Record<SemanticRole, ExtractedColor[]> {
    const groups: Record<SemanticRole, ExtractedColor[]> = {
        Background: [],
        Surface: [],
        Primary: [],
        Secondary: [],
        Accent: []
    };

    if (colors.length === 0) return groups;

    // Sort by dominance area
    const sortedByArea = [...colors].sort((a, b) => b.area - a.area);
    const backgroundCandidates = sortedByArea.slice(0, 2);

    // Choose Background: Usually high area, and often lower saturation or extreme lightness (very light/dark)
    // To keep it simple, the most dominant color that isn't extremely vibrant is Background.
    let bgIndex = 0;
    if (backgroundCandidates.length > 1 && backgroundCandidates[0].saturation > 0.8 && backgroundCandidates[1].saturation < 0.5) {
        bgIndex = 1;
    }
    const bgColor = backgroundCandidates[bgIndex];
    bgColor.role = 'Background';
    groups.Background.push(bgColor);

    const remaining = colors.filter(c => c.hex !== bgColor.hex);

    // Surface: Usually the next most dominant, low contrast from background
    if (remaining.length > 0) {
        remaining.sort((a, b) => chroma.deltaE(bgColor.hex, a.hex) - chroma.deltaE(bgColor.hex, b.hex));
        const surfaceColor = remaining[0];
        if (surfaceColor.area > 0.05 && surfaceColor.saturation < 0.6) {
            surfaceColor.role = 'Surface';
            groups.Surface.push(surfaceColor);
            remaining.splice(0, 1);
        }
    }

    // Accents: High saturation, lower area
    remaining.sort((a, b) => b.saturation - a.saturation);
    if (remaining.length > 0) {
        const accentCandidate = remaining[0];
        if (accentCandidate.saturation > 0.6 && accentCandidate.area < 0.2) {
            accentCandidate.role = 'Accent';
            groups.Accent.push(accentCandidate);
            remaining.splice(0, 1);
        }
    }

    // Primary/Secondary: Distribute the rest
    remaining.sort((a, b) => b.area - a.area);
    if (remaining.length > 0) {
        remaining[0].role = 'Primary';
        groups.Primary.push(remaining[0]);
        remaining.splice(0, 1);
    }

    remaining.forEach(c => {
        c.role = 'Secondary';
        groups.Secondary.push(c);
    });

    return groups;
}


// --- Core Extraction Function ---

export async function extractPalette(imageSrc: string): Promise<ExtractionResult> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
            try {
                // 1. Efficient Downsampling via Canvas
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Could not get canvas context'));
                    return;
                }

                let width = img.width;
                let height = img.height;

                if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
                    if (width > height) {
                        height = Math.round((height * MAX_DIMENSION) / width);
                        width = MAX_DIMENSION;
                    } else {
                        width = Math.round((width * MAX_DIMENSION) / height);
                        height = MAX_DIMENSION;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                const imageData = ctx.getImageData(0, 0, width, height).data;
                const pixelCount = width * height;
                const colorMap = new Map<string, number>();
                let totalSampled = 0;

                // Simple Quantization
                for (let i = 0; i < pixelCount; i += SAMPLING_RATE) {
                    const offset = i * 4;
                    const r = imageData[offset];
                    const g = imageData[offset + 1];
                    const b = imageData[offset + 2];
                    const a = imageData[offset + 3];

                    if (a < 128) continue;

                    const R = Math.round(r / 15) * 15;
                    const G = Math.round(g / 15) * 15;
                    const B = Math.round(b / 15) * 15;

                    const key = `${R},${G},${B}`;
                    colorMap.set(key, (colorMap.get(key) || 0) + 1);
                    totalSampled++;
                }

                const minThreshold = totalSampled * 0.005; // Ignore < 0.5% dominance

                const distinctColors = Array.from(colorMap.entries())
                    .filter(([, count]) => count > minThreshold)
                    .map(([key, count]) => {
                        const [r, g, b] = key.split(',').map(Number);
                        const hex = chroma.rgb(r, g, b).hex();
                        const hue = chroma(hex).get('hsl.h');
                        const sat = chroma(hex).get('hsl.s');
                        const lum = chroma(hex).get('hsl.l');

                        return {
                            hex,
                            area: count / totalSampled,
                            hue: isNaN(hue) ? 0 : hue,
                            saturation: isNaN(sat) ? 0 : sat,
                            lightness: lum,
                            intensity: (r + g + b) / 3,
                            count
                        };
                    });

                // Intelligent Filtering (Delta E)
                let finalPalette: ExtractedColor[] = [];
                const diversityThreshold = 12; // Prevent muddy identical colors

                distinctColors.sort((a, b) => b.count - a.count);

                for (const color of distinctColors) {
                    const isSimilar = finalPalette.some(existing => chroma.deltaE(existing.hex, color.hex) < diversityThreshold);
                    if (!isSimilar) finalPalette.push(color);
                    if (finalPalette.length >= 8) break; // Limit to 8 core colors for clean UI
                }

                // If image has very few distinct colors
                if (finalPalette.length < 3) {
                    finalPalette = distinctColors.slice(0, Math.max(finalPalette.length, 3)).map(c => {
                        const isSimilar = finalPalette.some(existing => chroma.deltaE(existing.hex, c.hex) < 5);
                        return isSimilar && finalPalette.length > 0 ? null : c;
                    }).filter(Boolean) as any;
                    if (finalPalette.length === 0) finalPalette = distinctColors.slice(0, 3);
                }

                // Sorting for semantic logic (by area desc)
                finalPalette.sort((a, b) => b.area - a.area);

                // Semantic Role Assignment
                const semanticGroups = assignSemanticRoles(finalPalette);

                // Re-flatten the palette based on roles so it matches UI order
                const orderedPalette = [
                    ...semanticGroups.Background,
                    ...semanticGroups.Surface,
                    ...semanticGroups.Primary,
                    ...semanticGroups.Secondary,
                    ...semanticGroups.Accent
                ];

                // Mood & Harmony Calculations
                const hues = orderedPalette.filter(c => c.saturation > 0.1).map(c => c.hue);
                const harmony = getHarmony(hues);

                const avgTemp = orderedPalette.reduce((acc, c) => acc + (c.hue < 60 || c.hue > 300 ? 1 : 0), 0) / orderedPalette.length; // Warm = Red/Yellow
                const avgVib = orderedPalette.reduce((acc, c) => acc + c.saturation, 0) / orderedPalette.length;

                const contrastScores = orderedPalette.flatMap((c1, i) => orderedPalette.slice(i + 1).map(c2 => chroma.contrast(c1.hex, c2.hex)));
                const avgContrast = contrastScores.length ? contrastScores.reduce((a, b) => a + b, 0) / contrastScores.length : 1;

                const stats = {
                    temperature: avgTemp > 0.5 ? 'Warm' : 'Cool' as 'Warm' | 'Cool',
                    vibrancy: Math.round(avgVib * 100),
                    contrast: Math.round(Math.min(avgContrast * 10, 100)), // Scale contrast ratio approx 1-21 to 0-100
                    harmony
                };

                resolve({ palette: orderedPalette, semanticGroups, stats });

            } catch (e) {
                reject(e);
            }
        };
        img.onerror = (e) => reject(new Error('Failed to load image'));
        img.src = imageSrc;
    });
}
