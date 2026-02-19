import DynamicContrastContent from './dynamic-contrast-content';

export const metadata = {
    title: 'Dynamic Contrast Checker - Advanced Legibility Testing | Dopely Colors',
    description: 'Test text legibility against different backgrounds, font weights, and environmental conditions (glare, texture). Beyond standard WCAG checking.',
    alternates: {
        canonical: '/tools/dynamic-contrast',
    },
};

export default function DynamicContrastPage() {
    return <DynamicContrastContent />;
}
