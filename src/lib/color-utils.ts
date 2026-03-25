import chroma from 'chroma-js';

// --- Datasets ---

export const COLOR_NAMES: Record<string, string> = {
    '#AB274F': 'Cherry Rose',
    '#F2F0E6': 'Alabaster',
    '#F0F8FF': 'Alice Blue',
    '#E32636': 'Alizarin Crimson',
    '#EFDECD': 'Almond',
    '#E52B50': 'Amaranth',
    '#FFBF00': 'Amber',
    '#9966cc': 'Amethyst',
    '#FB607F': 'Bubblegum Pink',
    '#800020': 'Burgundy',
    '#C51E3A': 'Intense Cherry',
    '#0047AB': 'Cobalt',
    '#50C878': 'Emerald',
    '#B31B1B': 'Mahogany Red',
    '#960018': 'Deep Crimson',
    '#FFFFFF': 'White',
    '#000000': 'Black',
    '#704214': 'Sepia',
    '#841B2D': 'Antique Ruby',
    '#007FFF': 'Azure',
    '#F5F5DC': 'Beige',
    '#FFE4C4': 'Bisque',
    '#DEB887': 'Burlywood',
    '#5F9EA0': 'Cadet Blue',
    '#7FFF00': 'Chartreuse',
    '#D2691E': 'Chocolate',
    '#FF7F50': 'Coral',
    '#6495ED': 'Cornflower Blue',
    '#FFF8DC': 'Cornsilk',
    '#DC143C': 'Crimson',
    '#00FFFF': 'Cyan',
    '#00008B': 'Dark Blue',
    '#008B8B': 'Dark Cyan',
    '#B8860B': 'Dark Goldenrod',
    '#A9A9A9': 'Dark Gray',
    '#006400': 'Dark Green',
    '#BDB76B': 'Dark Khaki',
    '#8B008B': 'Dark Magenta',
    '#556B2F': 'Dark Olive Green',
    '#FF8C00': 'Dark Orange',
    '#9932CC': 'Dark Orchid',
    '#8B0000': 'Dark Red',
    '#E9967A': 'Dark Salmon',
    '#8FBC8B': 'Dark Sea Green',
    '#483D8B': 'Dark Slate Blue',
    '#2F4F4F': 'Dark Slate Gray',
    '#00CED1': 'Dark Turquoise',
    '#9400D3': 'Dark Violet',
    '#FF1493': 'Deep Pink',
    '#00BFFF': 'Deep Sky Blue',
    '#696969': 'Dim Gray',
    '#1E90FF': 'Dodger Blue',
    '#B22222': 'Firebrick',
    '#FFFAF0': 'Floral White',
    '#228B22': 'Forest Green',
    '#FF00FF': 'Fuchsia',
    '#DCDCDC': 'Gainsboro',
    '#F8F8FF': 'Ghost White',
    '#FFD700': 'Gold',
    '#DAA520': 'Goldenrod',
    '#808080': 'Gray',
    '#008000': 'Green',
    '#ADFF2F': 'Green Yellow',
    '#F0FFF0': 'Honeydew',
    '#FF69B4': 'Hot Pink',
    '#CD5C5C': 'Indian Red',
    '#4B0082': 'Indigo',
    '#FFFFF0': 'Ivory',
    '#F0E68C': 'Khaki',
    '#E6E6FA': 'Lavender',
    '#FFF0F5': 'Lavender Blush',
    '#7CFC00': 'Lawn Green',
    '#FFFACD': 'Lemon Chiffon',
    '#ADD8E6': 'Light Blue',
    '#F08080': 'Light Coral',
    '#E0FFFF': 'Light Cyan',
    '#FAFAD2': 'Light Goldenrod Yellow',
    '#D3D3D3': 'Light Gray',
    '#90EE90': 'Light Green',
    '#FFB6C1': 'Light Pink',
    '#FFA07A': 'Light Salmon',
    '#20B2AA': 'Light Sea Green',
    '#87CEFA': 'Light Sky Blue',
    '#778899': 'Light Slate Gray',
    '#B0C4DE': 'Light Steel Blue',
    '#FFFFE0': 'Light Yellow',
    '#00FF00': 'Lime',
    '#32CD32': 'Lime Green',
    '#FAF0E6': 'Linen',
    '#800000': 'Maroon',
    '#66CDAA': 'Medium Aquamarine',
    '#0000CD': 'Medium Blue',
    '#BA55D3': 'Medium Orchid',
    '#9370DB': 'Medium Purple',
    '#3CB371': 'Medium Sea Green',
    '#7B68EE': 'Medium Slate Blue',
    '#00FA9A': 'Medium Spring Green',
    '#48D1CC': 'Medium Turquoise',
    '#C71585': 'Medium Violet Red',
    '#191970': 'Midnight Blue',
    '#F5FFFA': 'Mint Cream',
    '#FFE4E1': 'Misty Rose',
    '#FFE4B5': 'Moccasin',
    '#FFDEAD': 'Navajo White',
    '#000080': 'Navy',
    '#FDF5E6': 'Old Lace',
    '#808000': 'Olive',
    '#6B8E23': 'Olive Drab',
    '#FFA500': 'Orange',
    '#FF4500': 'Orange Red',
    '#DA70D6': 'Orchid',
    '#EEE8AA': 'Pale Goldenrod',
    '#98FB98': 'Pale Green',
    '#AFEEEE': 'Pale Turquoise',
    '#DB7093': 'Pale Violet Red',
    '#FFEFD5': 'Papaya Whip',
    '#FFDAB9': 'Peach Puff',
    '#CD853F': 'Peru',
    '#FFC0CB': 'Pink',
    '#DDA0DD': 'Plum',
    '#B0E0E6': 'Powder Blue',
    '#800080': 'Purple',
    '#663399': 'Rebecca Purple',
    '#FF0000': 'Red',
    '#BC8F8F': 'Rosy Brown',
    '#4169E1': 'Royal Blue',
    '#8B4513': 'Saddle Brown',
    '#FA8072': 'Salmon',
    '#F4A460': 'Sandy Brown',
    '#2E8B57': 'Sea Green',
    '#FFF5EE': 'Seashell',
    '#A0522D': 'Sienna',
    '#C0C0C0': 'Silver',
    '#87CEEB': 'Sky Blue',
    '#6A5ACD': 'Slate Blue',
    '#708090': 'Slate Gray',
    '#FFFAFA': 'Snow',
    '#00FF7F': 'Spring Green',
    '#4682B4': 'Steel Blue',
    '#D2B48C': 'Tan',
    '#008080': 'Teal',
    '#D8BFD8': 'Thistle',
    '#FF6347': 'Tomato',
    '#40E0D0': 'Turquoise',
    '#EE82EE': 'Violet',
    '#F5DEB3': 'Wheat',
    '#F5F5F5': 'White Smoke',
    '#FFFF00': 'Yellow',
    '#9ACD32': 'Yellow Green',
};

const LIBRARY_COLORS = {
    'RAL': [
        { name: 'Red Violet', hex: '#B42041', code: '3027' },
        { name: 'Traffic Red', hex: '#C63D31', code: '3020' },
        { name: 'Signal Red', hex: '#A3262D', code: '3001' },
    ],
    'HKS': [
        { name: 'HKS 18 N', hex: '#AE1D49', code: '18 N' },
    ],
    'Pantone': [
        { name: 'Rubine Red', hex: '#CE0058', code: 'Rubine Red C' },
    ]
};

// --- Helpers ---

export function getNearestColorName(hex: string): string {
    if (COLOR_NAMES[hex.toUpperCase()]) return COLOR_NAMES[hex.toUpperCase()];

    let minDist = Infinity;
    let name = 'Unknown';

    // Simple nearest neighbor
    Object.entries(COLOR_NAMES).forEach(([cHex, cName]) => {
        const dist = chroma.deltaE(hex, cHex);
        if (dist < minDist) {
            minDist = dist;
            name = cName;
        }
    });

    return name;
}

export function getSimilarColors(hex: string) {
    const base = chroma(hex);
    // Algorithmically generate "similar" looking colors that are distinct
    return [
        { name: getNearestColorName(base.set('hsl.h', '+5').hex()), hex: base.set('hsl.h', '+5').hex() },
        { name: getNearestColorName(base.set('hsl.l', '+0.1').hex()), hex: base.set('hsl.l', '+0.1').hex() },
        { name: getNearestColorName(base.set('hsl.s', '+0.2').hex()), hex: base.set('hsl.s', '+0.2').hex() },
        { name: getNearestColorName(base.set('hsl.h', '-10').hex()), hex: base.set('hsl.h', '-10').hex() },
        { name: getNearestColorName(base.set('lab.l', '-5').hex()), hex: base.set('lab.l', '-5').hex() },
    ];
}

export function getLibraryMatches(hex: string) {
    // Find closest match in each library
    const results: { library: string; name: string; code: string; hex: string; matchPercent: string }[] = [];

    Object.entries(LIBRARY_COLORS).forEach(([libName, colors]) => {
        let minDist = Infinity;
        let bestMatch = colors[0];

        colors.forEach(c => {
            const dist = chroma.deltaE(hex, c.hex);
            if (dist < minDist) {
                minDist = dist;
                bestMatch = c;
            }
        });

        results.push({
            library: libName,
            name: bestMatch.name,
            code: bestMatch.code,
            hex: bestMatch.hex,
            matchPercent: Math.max(0, 100 - minDist * 2).toFixed(0) // Rough match %
        });
    });

    return results;
}

// --- Types ---

export interface ColorConversions {
    hex: string;
    rgb: string;
    cmyk: string;
    hsb: string;
    hsl: string;
    lab: string;
    xyz: string;
    lch: string;
    luv: string;
    hwb: string;
}

export interface ColorHarmony {
    name: string;
    colors: string[]; // Hex codes
}

export interface ColorPsychology {
    description: string;
    psychology: {
        main: string;
        traits: { name: string; desc: string }[];
    };
    meaning: {
        main: string;
        associations: { name: string; desc: string }[];
    };
    usage: {
        main: string;
        reasons: { name: string; desc: string }[];
    };
    applications: {
        main: string;
        areas: { name: string; desc: string }[];
    };
    history: string;
    accessibility: string;
}

// --- Conversions ---

/**
 * Converts a hex color to various formats.
 */
export function getColorConversions(hex: string): ColorConversions {
    const color = chroma(hex);

    // CMYK: chroma doesn't output string "C, M, Y, K" directly, and cmyk() returns floats 0-1 or 0-100?
    // checking chroma docs behavior: chroma('red').cmyk() -> [0, 1, 1, 0]
    // We need to format these as percentages usually. User example: "0, 77, 54, 33"
    const cmyk = color.cmyk().map(v => Math.round(v * 100));

    // HSB/HSV: [H, S, V] -> "342, 77, 67" (Degrees, %, %)
    const hsv = color.hsv();
    const hsbArr = [
        Math.round(hsv[0] || 0),
        Math.round(hsv[1] * 100),
        Math.round(hsv[2] * 100)
    ];

    // HSL: [H, S, L] -> "342, 63, 41"
    const hsl = color.hsl();
    const hslArr = [
        Math.round(hsl[0] || 0),
        Math.round(hsl[1] * 100),
        Math.round(hsl[2] * 100)
    ];

    // LAB: [L, a, b] -> "39, 55, 10" (User example format)
    const lab = color.lab().map(v => Math.round(v));

    // LCH: [L, c, h] -> "39, 56, 10"
    const lch = color.lch().map(v => Math.round(v));

    // XYZ: chroma doesn't have direct .xyz()? It might have .css('xyz')?
    // Actually chroma has limited spaces unless extensions are loaded. 
    // We can approximate or use a simple conversion if chroma fails, but chroma usually supports most via color.get()
    // Wait, I recall chroma-js not supporting XYZ formatting directly comfortably. 
    // Let's rely on valid chroma calls or custom if needed.
    // Actually, chroma does not support XYZ or LUV or HWB out of the box in the standard build without plugins?
    // Let's try to access them if possible, or implement simple fallback.
    // HWB is common. XYZ is common.
    // For now I'll create a best-effort.

    // Mock implementations for unsupported by standard chroma minimal build if needed:
    // Assuming standard RGB-based conversion if chroma fails.
    // BUT, let's assume chroma-js full is installed.

    // Simple placeholders for complex ones if library support missing:
    const rgb = color.rgb();

    // XYZ approximation (sRGB to XYZ)
    // Using chroma if possible: chroma(hex).css('xyz') ??

    // Let's stick to what we know chroma does well (RGB, HSL, LAB, CMYK, HSV/HSB, LCH)
    // For XYZ, LUV, HWB, we might need manual calculation.

    return {
        hex: hex.toUpperCase(),
        rgb: `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`,
        cmyk: `${cmyk[0]}, ${cmyk[1]}, ${cmyk[2]}, ${cmyk[3]}`,
        hsb: `${hsbArr[0]}, ${hsbArr[1]}, ${hsbArr[2]}`,
        hsl: `${hslArr[0]}, ${hslArr[1]}, ${hslArr[2]}`,
        lab: `${lab[0]}, ${lab[1]}, ${lab[2]}`, // L, a, b
        lch: `${lch[0]}, ${lch[1]}, ${lch[2]}`, // L, C, H

        // TODO: Implement proper math for these if chroma fails
        xyz: "19, 11, 8", // Placeholder/Calc needed
        luv: "39, 88, 1", // Placeholder/Calc needed
        hwb: "342, 15, 33", // Placeholder/Calc needed
    };
}

// Helper to manually calculate simple HWB and XYZ if needed to match user request EXACTLY
// For now, I will update getXYZ, getLUV, getHWB later or use a robust library if I can add one. 
// Since I can't add libraries easily (no internet for npm install unless I assume it's there), I'll write the math.

function rgbToXyz(r: number, g: number, b: number): [number, number, number] {
    // Normalised to 0-1
    let rn = r / 255;
    let gn = g / 255;
    let bn = b / 255;

    // Gamma correction
    rn = rn > 0.04045 ? Math.pow((rn + 0.055) / 1.055, 2.4) : rn / 12.92;
    gn = gn > 0.04045 ? Math.pow((gn + 0.055) / 1.055, 2.4) : gn / 12.92;
    bn = bn > 0.04045 ? Math.pow((bn + 0.055) / 1.055, 2.4) : bn / 12.92;

    // Ref white D65
    // X, Y, Z output 0-100 reference
    const x = (rn * 0.4124 + gn * 0.3576 + bn * 0.1805) * 100;
    const y = (rn * 0.2126 + gn * 0.7152 + bn * 0.0722) * 100;
    const z = (rn * 0.0193 + gn * 0.1192 + bn * 0.9505) * 100;

    return [Math.round(x), Math.round(y), Math.round(z)];
}

function rgbToHwb(r: number, g: number, b: number): [number, number, number] {
    const hsv = chroma.rgb(r, g, b).hsv();
    const h = hsv[0] || 0; // Hue
    const w = Math.min(r, g, b) / 255; // White
    const v = Math.max(r, g, b) / 255; // Value
    const bl = 1 - v; // Black

    return [Math.round(h), Math.round(w * 100), Math.round(bl * 100)];
}


// --- Harmonies ---

export function getHarmonies(hex: string) {
    const color = chroma(hex);

    return {
        analogous: [
            color.set('hsl.h', '-30').hex(),
            hex,
            color.set('hsl.h', '+30').hex()
        ],
        complementary: [hex, color.set('hsl.h', '+180').hex()],
        splitComplementary: [
            hex,
            color.set('hsl.h', '+150').hex(),
            color.set('hsl.h', '+210').hex()
        ],
        triadic: [
            hex,
            color.set('hsl.h', '+120').hex(),
            color.set('hsl.h', '+240').hex()
        ],
        tetradic: [
            hex,
            color.set('hsl.h', '+90').hex(),
            color.set('hsl.h', '+180').hex(),
            color.set('hsl.h', '+270').hex()
        ],
        square: [
            hex,
            color.set('hsl.h', '+90').hex(), // Approximate separation
            color.set('hsl.h', '+180').hex(),
            color.set('hsl.h', '+270').hex()
        ]
    };
}

// --- Blindness Simulation (Approximate) ---
// Using matrix multiplication for simulation
// Matrices from some source (e.g., Color Blindness Simulation research)
const SIM_MATRICES = {
    protanopia: [
        0.567, 0.433, 0,
        0.558, 0.442, 0,
        0, 0.242, 0.758
    ],
    deuteranopia: [
        0.625, 0.375, 0,
        0.7, 0.3, 0,
        0, 0.3, 0.7
    ],
    tritanopia: [
        0.95, 0.05, 0,
        0, 0.433, 0.567,
        0, 0.475, 0.525
    ],
    achromatopsia: [
        0.299, 0.587, 0.114,
        0.299, 0.587, 0.114,
        0.299, 0.587, 0.114
    ]
};

function applyMatrix(rgb: number[], matrix: number[]): string {
    const r = rgb[0];
    const g = rgb[1];
    const b = rgb[2];

    const R = r * matrix[0] + g * matrix[1] + b * matrix[2];
    const G = r * matrix[3] + g * matrix[4] + b * matrix[5];
    const B = r * matrix[6] + g * matrix[7] + b * matrix[8];

    return chroma.rgb(R, G, B).hex();
}

export function getBlindnessSims(hex: string) {
    const color = chroma(hex);
    const rgb = color.rgb();

    return {
        protanopia: applyMatrix(rgb, SIM_MATRICES.protanopia),
        deuteranopia: applyMatrix(rgb, SIM_MATRICES.deuteranopia),
        tritanopia: applyMatrix(rgb, SIM_MATRICES.tritanopia),
        achromatopsia: applyMatrix(rgb, SIM_MATRICES.achromatopsia)
    };
}

// --- Psychology Generator ---

// --- Content Generators ---

const TEXT_ASSETS = {
    red: {
        adjectives: ['passionate', 'intense', 'commanding', 'dynamic', 'powerful', 'courageous', 'visceral', 'assertive', 'vital'],
        traits: [
            { name: 'Passion', desc: 'Instantly signals intense emotion, desire, and romantic fervor.' },
            { name: 'Urgency', desc: 'Creates a visceral reaction that demands immediate attention and action.' },
            { name: 'Dominance', desc: 'Exerts visual authority and leadership in any composition.' },
            { name: 'Courage', desc: 'Historically linked to bravery, strength, and the warrior spirit.' }
        ],
        meanings: [
            { name: 'Vitality', desc: 'Represents the life force, blood, and primal physical energy.' },
            { name: 'Excitement', desc: 'Elevates heart rate and stimulates appetite and conversation.' },
            { name: 'Revolution', desc: 'A symbol of change, movement, and breaking the status quo.' }
        ],
        usage: [
            { name: 'Calls to Action', desc: 'The most effective color for "Buy Now" or "Subscribe" buttons.' },
            { name: 'Culinary', desc: 'Stimulates appetite, making it a staple for restaurant branding.' },
            { name: 'Automotive', desc: 'Used for sports cars to imply speed, aggression, and power.' }
        ],
        history: "Red was the first color commanded by man, used in prehistoric cave paintings with ochre clay as early as 40,000 years ago. Throughout antiquity, it symbolized the divine right of kings and the blood of Christ. In the Renaissance, bright reds were status symbols due to the expense of cochineal dye. Today, it remains the universal signal for 'stop' and 'danger', deeply hardwired into human evolutionary instincts."
    },
    orange: {
        adjectives: ['energetic', 'gregarious', 'invigorating', 'enthusiastic', 'warm', 'spontaneous', 'radiant', 'playful'],
        traits: [
            { name: 'Sociability', desc: 'Encourages conversation, openness, and social interaction.' },
            { name: 'Creativity', desc: 'Stimulates the mind to explore new ideas and break conventions.' },
            { name: 'Warmth', desc: 'Radiates a physical sensation of heat and comfort without aggression.' },
            { name: 'Adventure', desc: 'Suggests risk-taking, spontaneity, and a zest for life.' }
        ],
        meanings: [
            { name: 'Optimism', desc: 'An undeniably uplifting hue that combats gloom and negativity.' },
            { name: 'Youth', desc: 'Often associated with childhood, modernism, and high energy.' },
            { name: 'Affordability', desc: 'In marketing, often signals value, deals, and accessibility.' }
        ],
        usage: [
            { name: 'Entertainment', desc: 'Common in branding for media, kids\' products, and leisure.' },
            { name: 'Food & Drink', desc: 'Suggests citrus freshness and hearty flavors.' },
            { name: 'Safety', desc: 'High visibility makes it perfect for equipment and warning signs.' }
        ],
        history: "For centuries, Europe had no name for this color, simply calling it 'yellow-red'. The word 'orange' only entered English in the 1500s when the fruit was imported. Saffron-colored robes have represented purity and renunciation in Eastern traditions for millennia. In Western art, it was the color of amusement and unconvention, favored by the Pre-Raphaelites."
    },
    yellow: {
        adjectives: ['illuminating', 'optimistic', 'cautionary', 'intellectual', 'cheerful', 'visionary', 'energetic', 'lucid'],
        traits: [
            { name: 'Happiness', desc: 'The color of sunshine, evoking unbridled joy and positivity.' },
            { name: 'Cognition', desc: 'Stimulates the left side of the brain, aiding clear thought and memory.' },
            { name: 'Visibility', desc: 'The most visible color to the human eye, impossible to ignore.' },
            { name: 'Enlightenment', desc: 'Symbolizes wisdom, new ideas, and mental clarity.' }
        ],
        meanings: [
            { name: 'Hope', desc: 'A universal symbol of fresh starts, dawn, and the promise of a new day.' },
            { name: 'Caution', desc: 'Nature uses yellow to signal toxicity; humans use it for warning signs.' },
            { name: 'Confidence', desc: 'Radiates a non-threatening, cheerful self-assurance.' }
        ],
        usage: [
            { name: 'Learning', desc: 'Used in educational materials to keep minds alert and focused.' },
            { name: 'Retail', desc: 'Grabs attention in window displays without the aggression of red.' },
            { name: 'Tech', desc: 'Signals innovation and lightbulb moments (e.g., Snapchat, Bumble).' }
        ],
        history: "In Ancient Egypt, yellow was the color of gold, which was considered the flesh of the gods—imperishable and eternal. However, in medieval Europe, dull yellow became associated with betrayal (Judas Iscariot was often painted in yellow) and heresy. Van Gogh reinvented it in the 19th century as a symbol of emotional intensity and brilliance."
    },
    green: {
        adjectives: ['restorative', 'natural', 'harmonious', 'balanced', 'prosperous', 'vital', 'safe', 'refreshing'],
        traits: [
            { name: 'Restoration', desc: 'Physically relaxing to the eye, reducing fatigue and stress.' },
            { name: 'Growth', desc: 'The essence of spring, renewal, and biological life.' },
            { name: 'Stability', desc: 'Sits in the center of the spectrum, representing emotional balance.' },
            { name: 'Permission', desc: 'Universally understood signal for "Go" and safety.' }
        ],
        meanings: [
            { name: 'Health', desc: 'Synonymous with wellness, freshness, and organic living.' },
            { name: 'Prosperity', desc: 'In many cultures, linked to money, luck, and abundance.' },
            { name: 'Harmony', desc: 'Bridges the gap between warm excitement and cool calm.' }
        ],
        usage: [
            { name: 'Finance', desc: 'Banks use green to project stability and growth.' },
            { name: 'Eco-Branding', desc: 'The only logical choice for sustainable and natural products.' },
            { name: 'Real Estate', desc: 'Suggests homeliness, landscapes, and new beginnings.' }
        ],
        history: "Historically, green was difficult to stabilize. Early pigments like verdigris would blacken over time. In the 19th century, 'Scheele’s Green' was vibrant but deadly arsenic, reportedly contributing to Napoleon's death. Today, it is the emblematic color of the environmental movement."
    },
    blue: {
        adjectives: ['trustworthy', 'serene', 'intellectual', 'resolute', 'calm', 'professional', 'infinite', 'reliable'],
        traits: [
            { name: 'Trust', desc: 'The world\'s favorite color, signaling dependability and integrity.' },
            { name: 'Tranquility', desc: 'Lowers pulse rate and induces a meditative state of mind.' },
            { name: 'Logic', desc: 'Associated with clear communication, intelligence, and efficiency.' },
            { name: 'Depth', desc: 'Reminds us of the deep ocean and the infinite sky.' }
        ],
        meanings: [
            { name: 'Responsibility', desc: 'Implies a conservative, safe, and deliberate approach.' },
            { name: 'Spirituality', desc: 'Often connected to contemplation and connection with the divine.' },
            { name: 'Cleanliness', desc: 'Suggests hygiene, water, and air without contamination.' }
        ],
        usage: [
            { name: 'Corporate', desc: 'The standard for tech and finance (IBM, Facebook, PayPal) to build trust.' },
            { name: 'Medical', desc: 'Projects hygiene and competence in hospitals and scrub designs.' },
            { name: 'Aviation', desc: 'Connects technology with the sky and openness.' }
        ],
        history: "Blue was a late arrival in human culture; ancient Greeks (like Homer) described the sea as 'wine-dark' because they lacked a word for blue. The Egyptians were the first to manufacture 'Egyptian Blue'. In the Middle Ages, Ultramarine (from Lapis Lazuli) was more precious than gold, reserved exclusively for the Virgin Mary's robes."
    },
    purple: {
        adjectives: ['majestic', 'visionary', 'luxurious', 'spiritual', 'mysterious', 'imaginative', 'regal', 'introspective'],
        traits: [
            { name: 'Luxury', desc: 'Combines the stability of blue with the energy of red for a premium feel.' },
            { name: 'Mystery', desc: 'Often associated with magic, the supernatural, and the unknown.' },
            { name: 'Creativity', desc: 'The preferred color of eccentric artists, poets, and dreamers.' },
            { name: 'Wisdom', desc: 'Suggests enlightenment and higher consciousness.' }
        ],
        meanings: [
            { name: 'Royalty', desc: 'Historically restricted to emperors and kings due to dye costs.' },
            { name: 'Imagination', desc: 'Stimulates the part of the brain responsible for problem-solving.' },
            { name: 'Quality', desc: 'Implies a premium, top-tier product or experience.' }
        ],
        usage: [
            { name: 'Luxury Goods', desc: 'Chocolate, perfume, and anti-aging products often use purple.' },
            { name: 'Spiritual', desc: 'Common in yoga, meditation, and religious branding.' },
            { name: 'Technology', desc: 'Used (like by Twitch or Yahoo) to signal quirky innovation.' }
        ],
        history: "Tyrian Purple was extracted from the secretions of thousands of sea snails in ancient Phoenicia. It was so exorbitantly expensive that Roman Emperors forbade citizens from wearing it on pain of death. It remained a symbol of imperial power until synthetic mauveine was accidentally discovered in 1856 by an 18-year-old chemist."
    },
    pink: {
        adjectives: ['compassionate', 'playful', 'romantic', 'nurturing', 'sophisticated', 'sweet', 'tender', 'nostalgic'],
        traits: [
            { name: 'Compassion', desc: 'Evokes empathy, care, and unconditional love.' },
            { name: 'Playfulness', desc: 'Often linked to youthful energy and sweet indulgences.' },
            { name: 'Calm', desc: 'Known to have a physical tranquilizing effect (e.g., Baker-Miller Pink).' },
            { name: 'Romance', desc: 'Moving from deep passion to tender affection and intimacy.' }
        ],
        meanings: [
            { name: 'Hope', desc: 'Often signifies good health and the expectation of positive outcomes.' },
            { name: 'Sweetness', desc: 'The visual equivalent of sugar, often triggering cravings.' },
            { name: 'Modernity', desc: 'Millennial Pink re-branded this hue as gender-neutral and cool.' }
        ],
        usage: [
            { name: 'Confectionery', desc: 'Bakeries and candy shops use pink to suggest sweetness.' },
            { name: 'Beauty', desc: 'Dominates the skincare and cosmetics industry.' },
            { name: 'Charity', desc: 'Widely recognized for breast cancer awareness and women\'s health.' }
        ],
        history: "Pink was not a masculine or feminine signifier for much of history. In the 18th century, it was a fashionable pastel for both male and female aristocrats. It was only in the mid-20th century marketing boom, specifically the 1940s, that pink was rigidly assigned to girls and blue to boys."
    },
    neutral: {
        adjectives: ['timeless', 'balanced', 'minimalist', 'architectural', 'sophisticated', 'versatile', 'grounded'],
        traits: [
            { name: 'Neutrality', desc: 'Provides a non-judgmental, open space for other elements to shine.' },
            { name: 'Balance', desc: 'Acts as the essential stabilizer in any vibrant color palette.' },
            { name: 'Sophistication', desc: 'Implies elegance, maturity, and a refined aesthetic.' },
            { name: 'Reliability', desc: 'Suggests structure, stone, earth, and permanence.' }
        ],
        meanings: [
            { name: 'Focus', desc: 'Reduces visual noise, allowing content to take center stage.' },
            { name: 'Practicality', desc: 'Associated with tools, technology, and utilitarian design.' },
            { name: 'Comfort', desc: 'Warm neutrals (beige, taupe) create a cozy, organic atmosphere.' }
        ],
        usage: [
            { name: 'Architecture', desc: 'Concrete, wood, and stone tones define modern living spaces.' },
            { name: 'Tech UI', desc: 'Grays and off-whites are the backbone of digital interface design.' },
            { name: 'Luxury Fashion', desc: 'Monochromatic neutral palettes signal understated wealth.' }
        ],
        history: "Neutral tones—ochres, charcoals, and chalks—were the very first pigments used by humans. While often dismissed as 'boring' in the synthetic color revolution of the 20th century, they have returned as the hallmarks of minimalism and sustainable design."
    }
};

function getContentForHue(h: number, s: number, l: number) {
    if (s < 0.1 || l < 0.1 || l > 0.95) return TEXT_ASSETS.neutral;
    if (h < 10 || h >= 345) return TEXT_ASSETS.red;
    if (h >= 10 && h < 45) return TEXT_ASSETS.orange;
    if (h >= 45 && h < 85) return TEXT_ASSETS.yellow;
    if (h >= 85 && h < 165) return TEXT_ASSETS.green;
    if (h >= 165 && h < 260) return TEXT_ASSETS.blue;
    if (h >= 260 && h < 300) return TEXT_ASSETS.purple;
    if (h >= 300 && h < 345) return TEXT_ASSETS.pink;
    return TEXT_ASSETS.neutral;
}

export function getColorPsychology(hex: string): ColorPsychology {
    const color = chroma(hex);
    const h = color.get('hsl.h');
    const s = color.get('hsl.s');
    const l = color.get('hsl.l');

    const content = getContentForHue(h, s, l);
    const mood = l > 0.8 ? 'ethereal' : l < 0.2 ? 'mysterious' : s > 0.7 ? 'energetic' : 'subdued';
    const temp = h > 0 && h < 180 ? 'warm' : 'cool';

    // New: Granular Saturation Adjectives
    const saturationAdjective = s > 0.8 ? 'vibrant' : s > 0.5 ? 'balanced' : s > 0.2 ? 'muted' : 'desaturated';
    const lightnessAdjective = l > 0.8 ? 'brilliant' : l > 0.5 ? 'clear' : l > 0.2 ? 'deep' : 'somber';

    // Accessibility Logic
    const onWhite = chroma.contrast(hex, 'white');
    const onBlack = chroma.contrast(hex, 'black');
    let a11yText = `For readable text, this ${lightnessAdjective} and ${mood} color works best with high-contrast pairings. `;
    if (onWhite > 4.5 && onBlack > 4.5) {
        a11yText += "It is versatile and readable on both light and dark backgrounds.";
    } else if (onWhite > 4.5) {
        a11yText += "It performs excellently as a foreground color on white or light backgrounds.";
    } else if (onBlack > 4.5) {
        a11yText += "It functions best as an accent on dark backgrounds due to its luminance.";
    } else {
        a11yText += "Ideally used for large decorative text or graphical elements, rather than body copy.";
    }

    // Enhanced Dynamic Description: Mixing Hue content with Saturation/Lightness context
    const description = `This ${saturationAdjective} ${content.adjectives[0]} shade exudes ${content.adjectives[1]} and ${lightnessAdjective} qualities. Its ${temp} tone is both ${content.adjectives[2]} and ${content.adjectives[3]}, perfect for making a ${mood} visual impact. The ${s > 0.5 ? 'intensity' : 'subtlety'} of this hue lends a ${content.adjectives[4]} feel, often seen as both ${content.adjectives[5]} and refined in modern design systems.`;

    return {
        description,
        psychology: {
            main: `This ${lightnessAdjective} color evokes ${content.adjectives[0]} energy and ${content.adjectives[1]} feelings, balanced by a ${saturationAdjective} chromatic profile.`,
            traits: content.traits
        },
        meaning: {
            main: `In visual communication, this ${mood} hue typically suggests ${content.meanings[0].name.toLowerCase()} and ${content.meanings[1].name.toLowerCase()}.`,
            associations: content.meanings
        },
        usage: {
            main: `Architects and designers choose this ${temp} ${saturationAdjective} shade to create emotional resonance and highlight important structural elements.`,
            reasons: [
                { name: 'Branding', desc: `Stand out with a distinct, ${saturationAdjective} ${content.adjectives[0]} shade that conveys reliability.` },
                { name: 'Attention', desc: `The ${lightnessAdjective} properties of this color help draw the eye to focal points effectively.` },
                ...content.usage
            ]
        },
        applications: {
            main: `Leverage this ${lightnessAdjective} tone in high-end design where ${content.adjectives[0]} energy and ${mood} atmosphere are required.`,
            areas: [
                { name: 'Modern UI', desc: `Ideal for ${s > 0.6 ? 'hero elements' : 'unobtrusive backgrounds'} and interactive ${mood} states.` },
                { name: 'Interiors', desc: `Creates a ${lightnessAdjective} environment when used on accent walls or statement furniture.` },
                { name: 'Digital Branding', desc: `Conveys ${content.adjectives[1]} through ${saturationAdjective} visual cues.` }
            ]
        },
        history: content.history,
        accessibility: a11yText
    };
}

function xyzToLuv(x: number, y: number, z: number): [number, number, number] {
    // Reference white (D65)
    const Xn = 95.047;
    const Yn = 100.000;
    const Zn = 108.883;

    const un = (4 * Xn) / (Xn + 15 * Yn + 3 * Zn);
    const vn = (9 * Yn) / (Xn + 15 * Yn + 3 * Zn);

    const u = (4 * x) / (x + 15 * y + 3 * z) || 0; // Avoid div by zero
    const v = (9 * y) / (x + 15 * y + 3 * z) || 0;

    const l = (y / Yn) > 0.008856 ? 116 * Math.pow(y / Yn, 1 / 3) - 16 : 903.3 * (y / Yn);

    const uStar = 13 * l * (u - un);
    const vStar = 13 * l * (v - vn);

    return [Math.round(l), Math.round(uStar), Math.round(vStar)];
}

// Updating conversions with our manual functions
export function getFullConversions(hex: string): ColorConversions {
    const basic = getColorConversions(hex);
    const rgb = chroma(hex).rgb();

    // XYZ
    const xyzVals = rgbToXyz(rgb[0], rgb[1], rgb[2]);
    const xyz = `${xyzVals[0]}, ${xyzVals[1]}, ${xyzVals[2]}`;

    // HWB
    const hwbVals = rgbToHwb(rgb[0], rgb[1], rgb[2]);
    const hwb = `${hwbVals[0]}°, ${hwbVals[1]}%, ${hwbVals[2]}%`;

    // LUV
    const luvVals = xyzToLuv(xyzVals[0], xyzVals[1], xyzVals[2]);
    const luv = `${luvVals[0]}, ${luvVals[1]}, ${luvVals[2]}`;

    return {
        ...basic,
        xyz,
        hwb,
        luv
    };
}

// --- Systematic Color Generation (Canonical Colors) ---

export function getSystematicColors() {
    const colors: { name: string; hex: string }[] = [];
    const seenHexes = new Set<string>();

    // 1. Add Named Colors (Highest Priority)
    Object.entries(COLOR_NAMES).forEach(([hex, name]) => {
        const normalized = hex.toUpperCase();
        if (!seenHexes.has(normalized)) {
            colors.push({ name, hex: normalized });
            seenHexes.add(normalized);
        }
    });

    // 2. Generate Systematic Gradient Coverage
    // 36 Hues * 5 Saturations * 9 Lightnesses = ~1620 colors
    for (let h = 0; h < 360; h += 10) {
        for (let s = 0.2; s <= 1.0; s += 0.2) {
            for (let l = 0.1; l <= 0.9; l += 0.1) {
                const hex = chroma.hsl(h, s, l).hex().toUpperCase();
                if (!seenHexes.has(hex)) {
                    colors.push({
                        name: getNearestColorName(hex),
                        hex: hex
                    });
                    seenHexes.add(hex);
                }
            }
        }
    }

    return colors;
}

export function isCanonicalColor(hex: string): boolean {
    if (!hex) return false;
    const normalized = hex.startsWith('#') ? hex.toUpperCase() : `#${hex.toUpperCase()}`;

    // Check named colors
    if (COLOR_NAMES[normalized]) return true;

    // Check systematic generation
    // We could re-generate to check membership, or approximate.
    // Since the set is small (~2000), regenerating is fine for now, 
    // but ideally we'd use a mathematical check if the steps were cleaner.
    // Given the slight floating point variance in chroma-js, 
    // exact match might be tricky without regenerating the exact same way.
    // Let's regenerate for correctness.

    // Optimization: memoize this if impactful, but for distinct page builds it's negligible.
    const systemColors = getSystematicColors();
    return systemColors.some(c => c.hex === normalized);
}
