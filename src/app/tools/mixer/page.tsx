import { MixerGuide } from '@/components/content/generated_guides/MixerGuide';
import ColorMixerWrapper from './mixer-content';

export const metadata = {
    title: 'Color Mixer - Blend & Interpolate Colors Online | Dopely Colors',
    description: 'Digitally mix two colors to find the perfect midpoint or generate a smooth gradient scale. Supports RGB, LCH, LAB, and HSL interpolation.',
    alternates: {
        canonical: '/tools/mixer',
    },
};

export default function ColorMixerPage() {
    return <ColorMixerWrapper />;
}
