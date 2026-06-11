import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Design System Builder | Dopely Colors',
    description: 'Build a scalable design system foundation. Define colors, typography, and spacing tokens, and export to CSS/JSON.',
    alternates: {
        canonical: 'https://dopelycolors.com/design-system',
    }
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const webAppSchema = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Dopely Colors - Design System Builder",
        "applicationCategory": "DesignApplication",
        "operatingSystem": "WebBrowser",
        "description": metadata.description,
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "featureList": [
            "Tailwind Design Tokens",
            "CSS Variable Generation",
            "Scalable Typography Systems",
            "Spacing Scales"
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
            />
            {children}
        </>
    );
}
