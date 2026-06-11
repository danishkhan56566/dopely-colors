import { Metadata } from 'next';
import Script from 'next/script';
import { contrastSEOData } from '@/content/seo/contrast';

export const metadata: Metadata = {
    title: 'WCAG Contrast Checker | Dopely Colors',
    description: 'Ensure meaningful accessibility with our real-time contrast checker. Validates WCAG 2.1 AA & AAA standards.',
    alternates: {
        canonical: 'https://dopelycolors.com/contrast',
    }
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const webAppSchema = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Dopely Colors - WCAG Contrast Checker",
        "applicationCategory": "DesignApplication",
        "operatingSystem": "WebBrowser",
        "description": metadata.description,
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "featureList": [
            "WCAG 2.1 AA validation",
            "WCAG 2.1 AAA validation",
            "Real-time contrast ratio calculator",
            "Typography legibility check"
        ]
    };

    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to check color contrast for WCAG accessibility",
        "description": "Ensure your color combinations are accessible for all users.",
        "step": contrastSEOData.howToSteps.map((step, index) => ({
            "@type": "HowToStep",
            "position": index + 1,
            "name": step.title,
            "text": step.description
        }))
    };

    return (
        <>
            <Script
                id="contrast-schema-webapp"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
            />
            <Script
                id="contrast-schema-howto"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
            />
            {children}
        </>
    );
}
