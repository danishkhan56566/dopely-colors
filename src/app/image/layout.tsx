import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Image to Palette Generator | Dopely Colors',
    description: 'Upload an image and extract leading colors instantly. Create harmonious palettes from photos or logos.',
    alternates: {
        canonical: 'https://dopelycolors.com/image',
    }
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const webAppSchema = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Dopely Colors - Image to Palette Extractor",
        "applicationCategory": "DesignApplication",
        "operatingSystem": "WebBrowser",
        "description": metadata.description,
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "featureList": [
            "Image Color Extraction",
            "Dominant Color Clustering",
            "Photo to Palette Converter"
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
