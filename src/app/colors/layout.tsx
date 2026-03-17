import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Named Color Library | Dopely Colors',
    description: 'Explore our comprehensive library of named colors. Get hex codes, RGB, HSL, and CMYK values for thousands of professional design colors.',
    alternates: {
        canonical: 'https://dopelycolors.com/colors',
    }
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
