import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Design System Builder | PalettePro',
    description: 'Build a scalable design system foundation. Define colors, typography, and spacing tokens, and export to CSS/JSON.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
