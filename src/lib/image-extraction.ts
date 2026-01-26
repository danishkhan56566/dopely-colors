import chroma from 'chroma-js';

// --- Types ---

export interface ExtractedColor {
    hex: string;
    area: number; // Dominance (0-1)
    hue: number;
    saturation: number;
    lightness: number;
    intensity: number;
}

// --- Configuration ---
const MAX_DIMENSION = 256; // Resize large images to this max dimension
const SAMPLING_RATE = 10;   // Process 1 out of every N pixels to speed it up significantly

// --- Core Extraction Function ---

export async function extractPalette(imageSrc: string): Promise<ExtractedColor[]> {
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

                // Calculate scaled dimensions keeping aspect ratio
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

                // Draw image resized
                ctx.drawImage(img, 0, 0, width, height);

                // 2. Pixel Data Extraction
                const imageData = ctx.getImageData(0, 0, width, height).data;
                const pixelCount = width * height;

                const colorMap = new Map<string, number>();
                let totalSampled = 0;

                // 3. Quantization / Clustering (Simplified Frequency Binning)
                // We map pixels to a lower bit depth (grouping similar colors) to find peaks efficiently
                for (let i = 0; i < pixelCount; i += SAMPLING_RATE) {
                    const offset = i * 4;
                    const r = imageData[offset];
                    const g = imageData[offset + 1];
                    const b = imageData[offset + 2];
                    const a = imageData[offset + 3];

                    // Skip transparent pixels
                    if (a < 128) continue;

                    // Round colors to nearest 5 to group noise (5 * 51 = 255)
                    // Or significantly reduce bit depth (e.g. valid web safe or similar)
                    // Let's quantize to 5-bit per channel (0-31) -> 32 levels
                    // Actually, simple rounding to nearest 10 is fast and effective for grouping
                    const R = Math.round(r / 10) * 10;
                    const G = Math.round(g / 10) * 10;
                    const B = Math.round(b / 10) * 10;

                    const key = `${R},${G},${B}`;
                    colorMap.set(key, (colorMap.get(key) || 0) + 1);
                    totalSampled++;
                }

                // 4. Convert Map to Array and Sort
                // Filter out noise (very rare colors)
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

                // 5. Intelligent Sorting & Filtering
                // We want a diverse palette, not just 5 shades of the background.
                const finalPalette: ExtractedColor[] = [];
                const diversityThreshold = 10; // DeltaE threshold for distinctness

                // Sort by dominance first
                distinctColors.sort((a, b) => b.count - a.count);

                for (const color of distinctColors) {
                    // Check if this color is too similar to any we already accepted
                    const isSimilar = finalPalette.some(existing => {
                        return chroma.deltaE(existing.hex, color.hex) < diversityThreshold;
                    });

                    if (!isSimilar) {
                        finalPalette.push(color);
                    }

                    if (finalPalette.length >= 10) break;
                }

                resolve(finalPalette);

            } catch (e) {
                reject(e);
            }
        };
        img.onerror = (e) => reject(new Error('Failed to load image'));
        img.src = imageSrc;
    });
}
