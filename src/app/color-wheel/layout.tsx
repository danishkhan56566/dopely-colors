import { Metadata } from 'next';
import { colorWheelSEOData } from '@/content/seo/colorWheel';

export const metadata: Metadata = {
    title: 'Interactive Color Wheel | Dopely Colors',
    description: 'Professional color wheel tool for designers. Create perfectly balanced color harmonies using Monochromatic, Analogous, Complementary, and Triadic rules.',
    alternates: {
        canonical: 'https://dopelycolors.com/color-wheel',
    }
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const webAppSchema = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Dopely Colors - Interactive Color Wheel",
        "applicationCategory": "DesignApplication",
        "operatingSystem": "WebBrowser",
        "description": metadata.description,
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "featureList": [
            "Mathematical Color Harmonies",
            "Analogous Palettes",
            "Complementary Colors",
            "Triadic Palettes"
        ]
    };

    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to create a color harmony using the Color Wheel",
        "description": "Learn how to use geometric principles to construct perfect color palettes.",
        "step": colorWheelSEOData.howToSteps.map((step, index) => ({
            "@type": "HowToStep",
            "position": index + 1,
            "name": step.title,
            "text": step.description
        }))
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
            />
            {children}
        </>
    );
}
