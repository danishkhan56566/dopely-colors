import { Metadata } from 'next';
import Script from 'next/script';
import { aiSEOData } from '@/content/seo/ai';

export const metadata: Metadata = {
    title: 'AI Color Palette Generator | Dopely Colors',
    description: 'Generate stunning color palettes from text prompts, images, or base colors using artificial intelligence.',
    alternates: {
        canonical: 'https://dopelycolors.com/ai',
    }
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const webAppSchema = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Dopely Colors - AI Color Palette Generator",
        "applicationCategory": "DesignApplication",
        "operatingSystem": "WebBrowser",
        "description": metadata.description,
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "featureList": [
            "Text to Palette AI",
            "Prompt-based Color Generation",
            "Semantic Color Matching"
        ]
    };

    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to generate a color palette using AI",
        "description": "Learn how to convert semantics and prompts into beautiful palettes.",
        "step": aiSEOData.howToSteps.map((step, index) => ({
            "@type": "HowToStep",
            "position": index + 1,
            "name": step.title,
            "text": step.description
        }))
    };

    return (
        <>
            <Script
                id="ai-schema-webapp"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
            />
            <Script
                id="ai-schema-howto"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
            />
            {children}
        </>
    );
}
