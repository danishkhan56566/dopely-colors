import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'CSS Gradient Generator | PalettePro',
    description: 'Create advanced linear, radial, and conic gradients. Export to CSS and Tailwind class names instantly.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
