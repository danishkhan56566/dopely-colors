import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Color Blindness Simulator | Dopely Colors',
    description: 'Ensure your designs are accessible to everyone. Simulate various types of color vision deficiency including Protanopia, Deuteranopia, and Tritanopia.',
    alternates: {
        canonical: 'https://dopelycolors.com/color-blindness-simulator',
    }
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
