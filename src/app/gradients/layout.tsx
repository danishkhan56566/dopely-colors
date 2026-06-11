import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'CSS Gradient Generator | Dopely Colors',
    description: 'Create advanced linear, radial, and conic gradients. Export to CSS and Tailwind class names instantly.',
    alternates: {
        canonical: 'https://dopelycolors.com/gradients',
    }
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const webAppSchema = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Dopely Colors - CSS Gradient Generator",
        "applicationCategory": "DesignApplication",
        "operatingSystem": "WebBrowser",
        "description": metadata.description,
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "featureList": [
            "CSS Linear Gradients",
            "CSS Radial Gradients",
            "Tailwind Class Generation",
            "Color Interpolation"
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
