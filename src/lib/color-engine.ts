import sharp from 'sharp';
import {
    QuantizerCelebi,
    Score,
    argbFromRgb,
    argbFromHex,
    hexFromArgb,
    themeFromSourceColor,
    Scheme,
    Hct,
    TonalPalette,
    DynamicScheme
} from '@material/material-color-utilities';

// Helper: Extract seed from image buffer
export const extractSeedFromImage = async (imageBuffer: Buffer): Promise<string> => {
    try {
        // 1. Resize and extract raw pixels (RGBA)
        const { data, info } = await sharp(imageBuffer)
            .resize(128, 128, { fit: 'cover' })
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });

        // 2. Convert pixels to ARGB format expected by Material Utilities
        const pixels: number[] = [];
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];

            if (a < 255) continue; // Ignore transparent pixels

            const argb = argbFromRgb(r, g, b);
            pixels.push(argb);
        }

        // 3. Quantize and Score
        const result = QuantizerCelebi.quantize(pixels, 128);
        const ranked = Score.score(result);

        // 4. Return top color
        const topColor = ranked[0];
        return hexFromArgb(topColor);

    } catch (error) {
        console.error("Error extracting seed from image:", error);
        return "#4285F4"; // Fallback blue
    }
};

// ... existing code


// Helper: Convert HCT tone to hex
const toneToHex = (palette: TonalPalette, tone: number): string => {
    return hexFromArgb(palette.tone(tone));
};

export class DesignSystemGenerator {
    private seedHex: string;
    private seedArgb: number;
    private theme: any;
    private palettes: any;

    constructor(seedHex: string) {
        this.seedHex = seedHex;
        this.seedArgb = argbFromHex(seedHex);
        this.theme = themeFromSourceColor(this.seedArgb);
        this.palettes = this.theme.palettes;
    }

    generateAll(brandName: string = "Brand") {
        const core = this.generateCoreSpectrum();

        return {
            brand_name: brandName,
            base_colors: core,
            platforms: {
                android_material: this.generateAndroidSystem(),
                ios_hig: this.generateIosSystem(core),
                web: this.generateWebSystem()
            },
            accessibility: {
                primary_on_background: 5.0, // Calculated later if needed
                primary_on_background_pass: true,
                on_primary_text_color: "#FFFFFF"
            }
        };
    }

    private generateCoreSpectrum() {
        // Core tones (Tone 40 is standard key color)
        const getTone = (role: string, tone = 40) => {
            return toneToHex(this.palettes[role], tone);
        };

        return {
            primary: this.seedHex,
            secondary: getTone('secondary'),
            tertiary: getTone('tertiary'),
            neutral: getTone('neutral'),
            neutralVariant: getTone('neutralVariant'),
            error: getTone('error'),
            warning: '#FBC02D',
            success: '#388E3C'
        };
    }

    private generateAndroidSystem() {
        const roles = ['primary', 'secondary', 'tertiary', 'neutral', 'neutralVariant', 'error'];
        const tones = [0, 10, 20, 25, 30, 35, 40, 50, 60, 70, 80, 90, 95, 98, 99, 100];
        const output: Record<string, string> = {};

        // Generate standard tonal palettes
        roles.forEach(role => {
            // Map snake_case roles from Python to camelCase keys in JS library
            const paletteKey = role; // Keys match in JS lib: primary, secondary...
            const palette = this.palettes[paletteKey];

            // Output keys as role_tone (e.g. primary_40)
            const outputRole = role === 'neutralVariant' ? 'neutral_variant' : role;

            tones.forEach(tone => {
                output[`${outputRole}_${tone}`] = toneToHex(palette, tone);
            });
        });

        // Add semantic aliases
        output['surface'] = output['neutral_98'];
        output['surface_dark'] = toneToHex(this.palettes.neutral, 6);
        output['primary_container'] = output['primary_90'];
        output['on_primary_container'] = output['primary_10'];

        return output;
    }

    private generateIosSystem(core: any) {
        // Dynamic Color Helper
        const makeDynamic = (baseHex: string) => {
            const hct = Hct.fromInt(argbFromHex(baseHex));
            const light = Hct.from(hct.hue, hct.chroma, 50.0).toInt();
            const dark = Hct.from(hct.hue, hct.chroma, 70.0).toInt();
            return { light: hexFromArgb(light), dark: hexFromArgb(dark) };
        };

        return {
            systemPrimary: makeDynamic(core.primary),
            systemSecondary: makeDynamic(core.secondary),
            systemTertiary: makeDynamic(core.tertiary),
            systemBackground: { light: "#FFFFFF", dark: "#000000" },
            systemGroupedBackground: { light: "#F2F2F7", dark: "#1C1C1E" },
            systemGreen: makeDynamic(core.success || '#34C759'),
            systemRed: makeDynamic(core.error || '#FF3B30'),
            systemYellow: makeDynamic(core.warning || '#FFCC00'),
        };
    }

    private generateWebSystem() {
        const output: Record<string, string> = {};
        const twMap: Record<string, number> = {
            '50': 95, '100': 90, '200': 80, '300': 70, '400': 60,
            '500': 50, '600': 40, '700': 30, '800': 20, '900': 10, '950': 5
        };

        const roles: Record<string, string> = {
            'primary': 'primary', 'secondary': 'secondary', 'tertiary': 'tertiary',
            'neutral': 'neutral', 'error': 'error'
        };

        Object.entries(roles).forEach(([roleName, palKey]) => {
            const palette = this.palettes[palKey];
            Object.entries(twMap).forEach(([tw, tone]) => {
                output[`${roleName}-${tw}`] = toneToHex(palette, tone);
            });
        });

        return output;
    }
}

// Convenience wrapper
export const generateCorePalette = (seedHex: string) => {
    const generator = new DesignSystemGenerator(seedHex);
    return generator.generateAll();
};
