import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Color Information | Dopely Colors',
    description: 'Detailed analysis of your selected color, including conversions, harmonies, and accessibility data.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
