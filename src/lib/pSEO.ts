export type ColorCombo = {
    slug: string;
    title: string;
    description: string;
    colors: { name: string; hex: string }[];
    theme: string;
};

export const popularColorCombos: ColorCombo[] = [
    {
        slug: 'navy-blue-and-gold',
        title: 'Navy Blue and Gold Color Palette',
        description: 'A luxurious and elegant combination. Navy blue provides a deep, professional base while gold adds a touch of prestige and warmth, perfect for high-end branding.',
        theme: 'Luxury',
        colors: [
            { name: 'Navy Blue', hex: '#000080' },
            { name: 'Gold', hex: '#FFD700' },
            { name: 'Midnight', hex: '#191970' },
            { name: 'Champagne', hex: '#F7E7CE' },
        ]
    },
    {
        slug: 'teal-and-coral',
        title: 'Teal and Coral Color Palette',
        description: 'A vibrant, energetic pairing. The cool tones of teal perfectly balance the warm, inviting energy of coral. Ideal for modern, playful brand identities.',
        theme: 'Vibrant',
        colors: [
            { name: 'Teal', hex: '#008080' },
            { name: 'Coral', hex: '#FF7F50' },
            { name: 'Aqua', hex: '#00FFFF' },
            { name: 'Peach', hex: '#FFE5B4' },
        ]
    },
    {
        slug: 'black-and-white-minimalist',
        title: 'Black and White Minimalist Palette',
        description: 'The ultimate timeless pair. High contrast ensures maximum accessibility while offering a sleek, contemporary canvas for typography-heavy designs.',
        theme: 'Minimalist',
        colors: [
            { name: 'True Black', hex: '#000000' },
            { name: 'Pure White', hex: '#FFFFFF' },
            { name: 'Graphite', hex: '#333333' },
            { name: 'Smoke', hex: '#F5F5F5' },
        ]
    },
    {
        slug: 'sage-green-and-blush-pink',
        title: 'Sage Green and Blush Pink Palette',
        description: 'An earthy, calming aesthetic. Sage provides a grounding, natural feel while blush pink softens the overall look. Often used in wellness and lifestyle branding.',
        theme: 'Earthy',
        colors: [
            { name: 'Sage Green', hex: '#9DC183' },
            { name: 'Blush Pink', hex: '#FE828C' },
            { name: 'Olive', hex: '#808000' },
            { name: 'Rose Water', hex: '#F6C1C1' },
        ]
    }
];
