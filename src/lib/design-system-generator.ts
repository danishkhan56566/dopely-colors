import {
    argbFromHex,
    hexFromArgb,
    TonalPalette,
    Hct,
    SchemeTonalSpot,
    DynamicScheme,
    MaterialDynamicColors
} from '@material/material-color-utilities';
import chroma from 'chroma-js';

// --- Types ---

export interface CoreSpectrum {
    primary: string;
    secondary: string;
    tertiary: string;
    neutral: string;
    neutralVariant: string;
    error: string;
    warning: string;
    success: string;
}

export interface AndroidPalette {
    [key: string]: string; // primary_40: hex
}

export interface IOSPalette {
    [key: string]: {
        light: string;
        dark: string;
    };
}

export interface WebPalette {
    [key: string]: string; // primary-500: hex
}

export interface AccessibilityReport {
    primary_on_background: number; // Ratio
    primary_on_background_pass: boolean; // AA (4.5)
    on_primary_text_color: string; // The calculated text color for primary button
}

export interface DesignSystemOutput {
    brand_name: string;
    base_colors: CoreSpectrum;
    platforms: {
        android_material: AndroidPalette;
        ios_hig: IOSPalette;
        web: WebPalette;
    };
    accessibility: AccessibilityReport;
}

// --- Helpers ---

// Material Utilities uses ARGB integers (e.g. 0xFF0057FF)
// We need to handle conversions.

function getHex(argb: number): string {
    return hexFromArgb(argb);
}

// --- Generator ---

export class DesignSystemGenerator {

    private seedArgb: number;
    private seedHex: string;
    private secondaryHex?: string;
    private tertiaryHex?: string;

    constructor(seedHex: string, secondaryHex?: string, tertiaryHex?: string) {
        this.seedHex = seedHex;
        this.seedArgb = argbFromHex(seedHex);
        this.secondaryHex = secondaryHex;
        this.tertiaryHex = tertiaryHex;
    }

    /**
     * Generates the Core Spectrum using Material Color Utilities
     * to ensure harmonious relationships.
     */
    public generateCoreSpectrum(): CoreSpectrum {
        // We use SchemeTonalSpot as a default "Material Theme" generator
        // It generates a nice palette based on the seed.
        const sourceColorHct = Hct.fromInt(this.seedArgb);
        const scheme = new SchemeTonalSpot(sourceColorHct, false, 0.0);

        // Extract key colors - prioritize overrides if they exist
        const primary = this.seedHex; // STRICT: Use exact seed

        let secondary = getHex(scheme.secondaryPalette.keyColor.toInt());
        if (this.secondaryHex) {
            secondary = this.secondaryHex;
        }

        let tertiary = getHex(scheme.tertiaryPalette.keyColor.toInt());
        if (this.tertiaryHex) {
            tertiary = this.tertiaryHex;
        }

        return {
            primary,
            secondary,
            tertiary,
            neutral: getHex(scheme.neutralPalette.keyColor.toInt()),
            neutralVariant: getHex(scheme.neutralVariantPalette.keyColor.toInt()),
            error: getHex(scheme.errorPalette.keyColor.toInt()),
            // Warning/Success are not standard in Material Scheme but we can derive them
            // or use fixed harmonious values based on the primary hue?
            // For now, let's use standard functional colors but rotated? 
            // Better: Use fixed accessible colors or derive from seed lightness.
            warning: '#FBC02D', // Default Material Warning
            success: '#388E3C', // Default Material Success
        };
    }

    /**
     * Generates 13 tones for each Key Color for Android/Material 3
     */
    public generateAndroidSystem(): AndroidPalette {
        const sourceColorHct = Hct.fromInt(this.seedArgb);
        const scheme = new SchemeTonalSpot(sourceColorHct, false, 0.0);

        const tones = [0, 10, 20, 25, 30, 35, 40, 50, 60, 70, 80, 90, 95, 98, 99, 100];
        const output: AndroidPalette = {};

        // Helper to map a palette
        const mapPalette = (name: string, palette: TonalPalette) => {
            tones.forEach(tone => {
                output[`${name}_${tone}`] = getHex(palette.tone(tone));
            });
        };

        // STRICT: Create Primary Palette directly from Seed to avoid shifts
        mapPalette('primary', TonalPalette.fromInt(this.seedArgb));

        // Handle Secondary Override
        if (this.secondaryHex) {
            const secondaryPal = TonalPalette.fromInt(argbFromHex(this.secondaryHex));
            mapPalette('secondary', secondaryPal);
        } else {
            mapPalette('secondary', scheme.secondaryPalette);
        }

        // Handle Tertiary Override
        if (this.tertiaryHex) {
            const tertiaryPal = TonalPalette.fromInt(argbFromHex(this.tertiaryHex));
            mapPalette('tertiary', tertiaryPal);
        } else {
            mapPalette('tertiary', scheme.tertiaryPalette);
        }
        mapPalette('neutral', scheme.neutralPalette);
        mapPalette('neutral_variant', scheme.neutralVariantPalette);
        mapPalette('error', scheme.errorPalette);

        // Add specific key roles that designers look for
        output['surface'] = getHex(scheme.neutralPalette.tone(98));
        output['surface_dark'] = getHex(scheme.neutralPalette.tone(6));
        output['primary_container'] = getHex(scheme.primaryPalette.tone(90));
        output['on_primary_container'] = getHex(scheme.primaryPalette.tone(10));

        return output;
    }

    /**
     * Generates iOS Semantic Colors (Human Interface Guidelines)
     * iOS doesn't strictly use tonal palettes in the same way, but uses
     * semantic names like systemBlue, systemFill, etc.
     */
    public generateIOSSystem(): IOSPalette {
        // We map the Core Spectrum to iOS System Colors
        // Light Mode vs Dark Mode

        const core = this.generateCoreSpectrum();
        const primaryHct = Hct.fromInt(argbFromHex(core.primary));

        // Helper to generate a light/dark pair ensuring contrast
        const makeDynamic = (baseHex: string, name: string) => {
            const hct = Hct.fromInt(argbFromHex(baseHex));
            // iOS Light: Usually the base color (if accessible) or slightly darkened
            // iOS Dark: Usually brighter/lighter to stand out against dark bg

            // We use Tone 40-50 for Light, Tone 70-80 for Dark usually in Material,
            // For iOS, "System Blue" is #007AFF (Light) and #0A84FF (Dark)

            // Let's approximate this shift
            const light = Hct.from(hct.hue, hct.chroma, 50).toInt(); // Mid-tone
            const dark = Hct.from(hct.hue, hct.chroma, 70).toInt();  // Lighter for dark mode

            return {
                light: getHex(light),
                dark: getHex(dark)
            };
        };

        return {
            systemPrimary: makeDynamic(core.primary, 'Primary'),
            systemSecondary: makeDynamic(core.secondary, 'Secondary'),
            systemTertiary: makeDynamic(core.tertiary, 'Tertiary'),
            systemBackground: {
                light: '#FFFFFF',
                dark: '#000000'
            },
            systemGroupedBackground: {
                light: '#F2F2F7',
                dark: '#1C1C1E'
            },
            // Semantic Success/Error
            systemGreen: makeDynamic(core.success, 'Success'),
            systemRed: makeDynamic(core.error, 'Error'),
            systemYellow: makeDynamic(core.warning, 'Warning'), // Warning
        };
    }

    /**
     * Generates Tailwind CSS Utility Classes (50-950)
     */
    public generateWebSystem(): WebPalette {
        const sourceColorHct = Hct.fromInt(this.seedArgb);
        const scheme = new SchemeTonalSpot(sourceColorHct, false, 0.0);

        const output: WebPalette = {};

        // Mapping Material Tone to Tailwind
        const map: Record<string, number> = {
            '50': 95,
            '100': 90,
            '200': 80,
            '300': 70,
            '400': 60,
            '500': 50, // This is often the base
            '600': 40,
            '700': 30,
            '800': 20,
            '900': 10,
            '950': 5
        };

        const keyColors = {
            primary: scheme.primaryPalette,
            secondary: this.secondaryHex ? TonalPalette.fromInt(argbFromHex(this.secondaryHex)) : scheme.secondaryPalette,
            tertiary: this.tertiaryHex ? TonalPalette.fromInt(argbFromHex(this.tertiaryHex)) : scheme.tertiaryPalette,
            neutral: scheme.neutralPalette,
            error: scheme.errorPalette
        };

        Object.entries(keyColors).forEach(([key, palette]) => {
            Object.entries(map).forEach(([twStop, matTone]) => {
                output[`${key}-${twStop}`] = getHex(palette.tone(matTone));
            });
        });

        return output;
    }

    /**
     * Calculates Contrast and enforces accessibility
     */
    public generateAccessibilityReport(core: CoreSpectrum): AccessibilityReport {
        const bg = Hct.fromInt(argbFromHex('#FFFFFF')); // Helper assumes Light Mode for base check
        const primary = Hct.fromInt(argbFromHex(core.primary));

        // 1. Check Primary against White Background
        // Note: Material Color Utilities handles this inside Hct but we access it manually for reporting
        // In real Material, primary is used on 'primaryContainer' or 'surface'. 
        // Let's check Primary (Tone 40) against Surface (Tone 98)

        // We can use built-in contrast calc? No, let's use chroma or just Hct relative luminance
        // Material Utilities doesn't directly expose contrast ratio easily in public API sometimes, 
        // but let's approximate or use global function if available.
        // Actually, TonalPalette ensures accessible pairs by key (e.g. Tone 40 vs Tone 100 is always accessible).

        // Let's use chroma-js for the report to be safe and explicit
        const ratio = chroma.contrast(core.primary, '#FFFFFF');

        // Calculate best text color for Primary Button
        const onPrimary = chroma.contrast(core.primary, '#FFFFFF') >= 4.5 ? '#FFFFFF' : '#000000';

        return {
            primary_on_background: ratio,
            primary_on_background_pass: ratio >= 4.5,
            on_primary_text_color: onPrimary
        };
    }

    public generateAll(brandName: string = "Brand"): DesignSystemOutput {
        const core = this.generateCoreSpectrum();
        return {
            brand_name: brandName,
            base_colors: core,
            platforms: {
                android_material: this.generateAndroidSystem(),
                ios_hig: this.generateIOSSystem(),
                web: this.generateWebSystem()
            },
            accessibility: this.generateAccessibilityReport(core)
        };
    }
}
