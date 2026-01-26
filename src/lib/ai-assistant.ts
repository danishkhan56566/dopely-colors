import chroma from 'chroma-js';

// --- 1. CORE TYPES (The Brain) ---

import { DesignSystemGenerator, DesignSystemOutput } from './design-system-generator';

export type DesignMode = 'light' | 'dark';
export type DesignVibe = 'modern' | 'playful' | 'tranquil' | 'luxury' | 'antique' | 'geometric';

export interface DesignState {
    // UI Compatibility Layer
    brand_colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
    };
    // The Full System (Source of Truth)
    system: DesignSystemOutput;

    mode: DesignMode;
    vibe: DesignVibe | string;

    // Semantic levels (0-2 scale usually)
    brightness_level: number;
    saturation_level: number;
    // History for Undo/Versions
    history: DesignState[];
    // For UI display
    version_id: string;
    explanation: string;
}

export interface UserIntent {
    type: 'ADJUST' | 'MODE' | 'PREVIEW' | 'FEEDBACK' | 'RESET' | 'UNKNOWN';
    target?: 'brightness' | 'contrast' | 'saturation' | 'hue' | 'palette';
    value?: string | number; // "+10%", "dark", "blue"
    specific_color?: string; // "primary", "background"
    raw_text: string;
}

export type Step =
    | 'ENTRY'
    | 'DISCOVERY'
    | 'LOGO_DECISION'
    | 'LOGO_UPLOAD'
    | 'LOGO_GEN'
    | 'PALETTE_GEN' // Renamed from V1
    | 'REFINEMENT'
    | 'APP_PREVIEW'
    | 'PLATFORM_SELECT'
    | 'EXPORT';

export type Sender = 'user' | 'ai';

export interface AssistantState {
    step: Step;
    history: Message[];
    design: DesignState | null; // The active design
    context: {
        appType?: string;
        logoVibe?: string;
        logoColors?: string[];
        appDescription?: string;
        palette?: string[]; // Legacy support or just simple array ref
    };
}

export interface Message {
    id: string;
    sender: Sender;
    text: string;
    type?: 'text' | 'palette' | 'logo-options' | 'image' | 'code' | 'design-system' | 'loading' | 'export-ui';
    data?: any;
    actions?: ActionBtn[]; // Suggested actions buttons
}

export interface ActionBtn {
    label: string;
    action: string; // Action ID
    variant?: 'primary' | 'secondary' | 'outline';
}

export interface LogoOption {
    id: string;
    svg: string; // SVG string
    vibe: string;
    name: string;
}

// --- 2. INTENT PARSER (The Ears) ---

export const parseUserIntent = (text: string): UserIntent => {
    const t = text.toLowerCase();

    // MODE
    if (t.includes('dark mode') || t.includes('darker theme')) return { type: 'MODE', value: 'dark', raw_text: text };
    if (t.includes('light mode') || t.includes('lighter theme')) return { type: 'MODE', value: 'light', raw_text: text };

    // PREVIEW
    if (t.includes('preview') || t.includes('show') || t.includes('dummy')) return { type: 'PREVIEW', raw_text: text };

    // ADJUSTMENTS
    if (t.includes('bright') || t.includes('lighter color')) return { type: 'ADJUST', target: 'brightness', value: 'up', raw_text: text };
    if (t.includes('darker') || t.includes('dim')) return { type: 'ADJUST', target: 'brightness', value: 'down', raw_text: text };
    if (t.includes('vibrant') || t.includes('saturation') || t.includes('punchy')) return { type: 'ADJUST', target: 'saturation', value: 'up', raw_text: text };
    if (t.includes('muted') || t.includes('pastel') || t.includes('soft')) return { type: 'ADJUST', target: 'saturation', value: 'down', raw_text: text };
    if (t.includes('contrast')) return { type: 'ADJUST', target: 'contrast', value: 'up', raw_text: text };

    // SPECIFIC COLOR REPLACEMENT
    if (t.includes('replace') || t.includes('change') || t.includes('make it')) {
        // Simple extraction: "Make it Blue" -> value: blue
        const colors = ['blue', 'red', 'green', 'yellow', 'purple', 'orange', 'pink', 'teal', 'gold', 'black', 'white', 'gray', 'emerald', 'indigo', 'cyan', 'magenta'];
        const found = colors.find(c => t.includes(c));
        if (found) return { type: 'ADJUST', target: 'hue', value: found, raw_text: text };
    }

    // FEEDBACK (Negative)
    if (t.includes('don\'t like') || t.includes('ugly') || t.includes('bad') || t.includes('boring') || t.includes('no')) {
        return { type: 'FEEDBACK', value: 'negative', raw_text: text };
    }

    // RESET
    if (t.includes('start over') || t.includes('restart') || t.includes('reset')) {
        return { type: 'RESET', raw_text: text };
    }

    return { type: 'UNKNOWN', raw_text: text };
};


// --- 3. MUTATION ENGINE (The Hands) ---

// Initial Generator (Entry Point)
export const createInitialDesign = (type: string, vibe: string, logoColors?: string[]): DesignState => {

    let seedColor = '#3B82F6'; // Default Blue

    // 1. If Logo exists, STRICTLY use it
    if (logoColors && logoColors.length > 0) {
        seedColor = logoColors[0];
    }
    // 2. Else use Vibe Preset to pick a SEED
    else {
        switch (type) {
            case 'food': seedColor = '#FF4D4D'; break;
            case 'finance': seedColor = '#0057FF'; break;
            case 'islamic': seedColor = '#047857'; break;
            case 'tech': seedColor = '#6366f1'; break;
            case 'health': seedColor = '#00CEC9'; break;
            case 'gaming': seedColor = '#E84393'; break;
            case 'fashion': seedColor = '#2D3436'; break;
            default: seedColor = '#3B82F6'; break;
        }
    }

    // GENERATE SYSTEM
    const generator = new DesignSystemGenerator(seedColor);
    const system = generator.generateAll(type);

    // Map to Legacy UI Props
    // Determine initial mode (Light default usually, but let's check seed)
    const mode: DesignMode = 'light';

    // We use the generated Android/Material Palette for the UI map
    // Primary 40 is standard Key. Surface is 98 (light) or 6 (dark).
    // OnSurface is 10 (light) or 90 (dark).

    const colors = {
        primary: system.base_colors.primary,
        secondary: system.base_colors.secondary,
        accent: system.base_colors.tertiary, // Tertiary acts as accent
        background: system.platforms.android_material.surface, // Surface Tone 98
        text: system.platforms.android_material.on_primary_container.replace('10', '0') // Dark text approximation or use neutral 10
    };
    // Better text color mapping
    // Material 'on_surface' isn't explicitly in my basic export, but I have neutral_10 etc.
    // Let's grab neutral 10 for text
    colors.text = system.platforms.android_material.neutral_10 || '#111827';


    return {
        brand_colors: colors,
        system,
        mode,
        vibe,
        brightness_level: 1,
        saturation_level: 1,
        history: [],
        version_id: 'v1.0-' + Date.now(),
        explanation: `I've generated a requested ${vibe} design system. Based on the seed ${seedColor}, I calculated the mathematically correct tonal palettes for Android (Material 3), Semantic colors for iOS, and Utility classes for Web.`
    };
};

// The Mutator
export const evolveDesignSystem = (current: DesignState, intent: UserIntent): DesignState => {
    // Clone state to avoid mutations
    const next: DesignState = {
        ...current,
        brand_colors: { ...current.brand_colors },
        history: [...current.history],
        version_id: 'v' + (current.history.length + 2) + '.0'
    };
    next.history.push(JSON.parse(JSON.stringify(current))); // Deep clone safe

    let seed = current.brand_colors.primary;

    // 1. ADJUST SEED COLOR
    if (intent.target === 'hue' && intent.value) {
        seed = chroma(intent.value as string).hex();
        next.explanation = `I've regenerated the entire system using ${intent.value} as the new seed.`;
    }
    else if (intent.target === 'brightness' || intent.target === 'saturation') {
        const factor = intent.value === 'up' ? (intent.target === 'brightness' ? 0.2 : 0.5) : (intent.target === 'brightness' ? -0.2 : -0.5);
        if (intent.target === 'brightness') seed = chroma(seed).brighten(factor).hex();
        else seed = chroma(seed).saturate(factor).hex();

        next.explanation = `I've adjusted the ${intent.target} of the core spectrum.`;
    }

    // RE-GENERATE from new seed
    const generator = new DesignSystemGenerator(seed);
    const system = generator.generateAll();
    next.system = system;

    // Remap standard colors from new system
    next.brand_colors.primary = system.base_colors.primary;
    next.brand_colors.secondary = system.base_colors.secondary;
    next.brand_colors.accent = system.base_colors.tertiary;

    // 4. SWITCH MODE (Dark/Light) logic needs to use the System Tones
    // Material 3 makes this easy. Light = Tone 98 Surface, Dark = Tone 6 Surface.
    if (intent.type === 'MODE') {
        if (intent.value === 'dark') {
            next.mode = 'dark';
            next.brand_colors.background = system.platforms.android_material.surface_dark; // Tone 6
            next.brand_colors.text = system.platforms.android_material.neutral_90 || '#e2e8f0'; // Light text
            next.explanation = "I've switched to Dark Mode using the mathematically correct dark surface tones (Neutral Tone 6).";
        } else {
            next.mode = 'light';
            next.brand_colors.background = system.platforms.android_material.surface; // Tone 98
            next.brand_colors.text = system.platforms.android_material.neutral_10 || '#111827';
            next.explanation = "I've switched back to Light Mode.";
        }
    } else {
        // Maintain current mode contrast
        if (next.mode === 'dark') {
            next.brand_colors.background = system.platforms.android_material.surface_dark;
            next.brand_colors.text = system.platforms.android_material.neutral_90 || '#e2e8f0';
        } else {
            next.brand_colors.background = system.platforms.android_material.surface;
            next.brand_colors.text = system.platforms.android_material.neutral_10 || '#111827';
        }
    }

    return next;
};


// --- 4. DATA TRANSFORMATION HELPERS ---

export interface AIPalette {
    colors: string[];
    roles: DesignState['brand_colors'];
    explanation: string;
    vibe: string;
}

// Adapter to convert DesignState -> UI Friendly Palette Array
export const designStateToPalette = (state: DesignState): AIPalette => {
    return {
        colors: [
            state.brand_colors.primary,
            state.brand_colors.secondary,
            state.brand_colors.accent,
            state.brand_colors.background,
            state.brand_colors.text
        ],
        roles: state.brand_colors,
        explanation: state.explanation,
        vibe: state.vibe
    };
};

export const analyzeText = (text: string): { type: string; vibe: string } => {
    const t = text.toLowerCase();
    if (t.includes('food') || t.includes('cook')) return { type: 'food', vibe: 'warm' };
    if (t.includes('finance') || t.includes('bank')) return { type: 'finance', vibe: 'trust' };
    if (t.includes('islamic') || t.includes('muslim')) return { type: 'islamic', vibe: 'peaceful' };
    if (t.includes('tech') || t.includes('app')) return { type: 'tech', vibe: 'modern' };
    return { type: 'general', vibe: 'modern' };
};

// Legacy support for logo generator
export const generateLogoConcepts = (type: string, colors: string[]) => {
    // Re-implement or keep the previous SVG logic
    const primary = colors[0];
    const secondary = colors[1];

    // Default SVGs
    let svg1 = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="${primary}"/><path d="M50 25 L75 75 L25 75 Z" fill="white"/></svg>`;
    let svg2 = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="10" width="80" height="80" rx="20" fill="${secondary}"/><circle cx="50" cy="50" r="25" fill="${primary}"/></svg>`;
    let svg3 = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M20 20 Q50 80 80 20 T80 80" stroke="${primary}" stroke-width="10" fill="none"/></svg>`;

    if (type === 'islamic') {
        svg1 = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M55 15C45 15 30 25 30 50C30 75 45 85 55 85C40 85 20 70 20 50C20 30 40 15 55 15Z" fill="${primary}"/><polygon points="65,30 67,36 73,36 68,40 70,46 65,42 60,46 62,40 57,36 63,36" fill="${secondary}"/></svg>`;
    }

    return [
        { id: '1', svg: svg1, vibe: 'Minimal', name: 'Geometric Icon' },
    ];
};

// Generate tokens from the System object if available, else fallback
export const generateDesignTokens = (colors: string[], design?: DesignState): DesignSystemPackage => {

    // If we have the advanced system, use it
    if (design?.system) {
        return {
            web: {
                CSS: `:root {
  /* Core */
  --primary: ${design.system.base_colors.primary};
  --secondary: ${design.system.base_colors.secondary};
  --tertiary: ${design.system.base_colors.tertiary};
  --error: ${design.system.base_colors.error};
  
  /* Material Tones */
  --primary-40: ${design.system.platforms.android_material.primary_40};
  --primary-90: ${design.system.platforms.android_material.primary_90};
  --surface: ${design.system.platforms.android_material.surface};
}`,
                Tailwind: `
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: ${JSON.stringify(design.system.platforms.web, null, 2)}
    }
  }
}`
            },
            android: `
<!-- colors.xml -->
<resources>
    <color name="primary_40">${design.system.platforms.android_material.primary_40}</color>
    <color name="primary_90">${design.system.platforms.android_material.primary_90}</color>
    <color name="secondary_40">${design.system.platforms.android_material.secondary_40}</color>
    <color name="surface">${design.system.platforms.android_material.surface}</color>
</resources>
            `,
            ios: `
// Colors.swift
import SwiftUI

extension Color {
    static let systemPrimary = Color(hex: "${design.system.platforms.ios_hig.systemPrimary.light}")
    static let systemSecondary = Color(hex: "${design.system.platforms.ios_hig.systemSecondary.light}")
    // ...
}
            `
        };
    }

    // Fallback for Legacy
    const [primary, secondary, accent, bg, text] = colors;
    return {
        web: { CSS: `:root { --primary: ${primary}; --bg: ${bg}; }`, Tailwind: `colors: { primary: '${primary}' }` },
        android: `<color name="primary">${primary}</color>`,
        ios: `static let primary = Color(hex: "${primary}")`
    };
};

export interface DesignSystemPackage {
    web: { CSS: string; Tailwind: string };
    android: string;
    ios: string;
}
