import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Gradient Palette Generator | Dopely Colors',
    description: 'Generate beautiful stepped color transitions between any two colors. Perceptually uniform gradients for your design system.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
