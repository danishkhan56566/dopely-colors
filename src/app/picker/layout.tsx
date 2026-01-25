import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Advanced Color Picker | Dopely Colors',
    description: 'Convert between HEX, RGB, HSL, and CMYK. Generate color harmonies and check contrast ratios.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
