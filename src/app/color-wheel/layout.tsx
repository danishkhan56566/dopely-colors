import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Interactive Color Wheel | Dopely Colors',
    description: 'Professional color wheel tool for designers. Create perfectly balanced color harmonies using Monochromatic, Analogous, Complementary, and Triadic rules.',
    alternates: {
        canonical: 'https://dopelycolors.com/color-wheel',
    }
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
