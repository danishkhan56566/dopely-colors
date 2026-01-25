import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'WCAG Contrast Checker | Dopely Colors',
    description: 'Ensure meaningful accessibility with our real-time contrast checker. Validates WCAG 2.1 AA & AAA standards.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
