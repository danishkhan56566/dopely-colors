import ContrastGridWrapper from './contrast-grid-content';

export const metadata = {
    title: 'Contrast Grid - Check WCAG & APCA Contrast Matrices | Dopely Colors',
    description: 'Visualize accessibility compliance across your entire color palette. Check WCAG 2.1 (AA/AAA) and APCA contrast scores in a grid format.',
    alternates: {
        canonical: '/tools/contrast-grid',
    },
};

export default function ContrastGridPage() {
    return <ContrastGridWrapper />;
}
