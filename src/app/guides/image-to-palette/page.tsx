import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'How to Extract Color Palettes from Images | Dopely Colors',
    description: 'Extracting colors from images is a powerful technique for designers who want to recreate visual styles, branding themes, or UI inspiration.',
};

export default function ImageToPaletteGuide() {
    return (
        <article className="prose prose-blue prose-lg max-w-none">
            <Link href="/guides" className="no-underline text-sm font-bold text-gray-500 hover:text-blue-600 flex items-center gap-2 mb-8 not-prose">
                <ArrowLeft size={16} /> Back to Guides
            </Link>

            <h1>How to Extract Color Palettes from Images</h1>

            <p className="lead text-xl text-gray-600">
                Extracting colors from images is a powerful technique for designers who want to recreate visual styles, branding themes, or UI inspiration from photos and screenshots.
            </p>

            <p>
                Image-to-palette tools analyze pixel data to identify dominant and accent colors. These extracted palettes can then be reused in websites, mobile apps, and marketing designs.
            </p>
            <p>
                This approach is commonly used in branding, mood boards, and redesign projects where visual consistency matters. Designers can quickly transform inspiration into structured color systems without manual sampling.
            </p>

            <hr className="my-10 border-gray-100" />

            <h2>Why This Matters</h2>
            <p>
                Visual inspiration is everywhere. A sunset photo, a vintage poster, or a competitor's app screenshot can all serve as the basis for a new color scheme. Manual extraction with an eyedropper tool is tedious and often inaccurate. Automated tools cluster pixels to find the <em>mathematically dominant</em> colors, ensuring a representative palette.
            </p>

            <h2>Try the Tool</h2>
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 not-prose my-8">
                <h3 className="font-bold text-blue-900 text-lg mb-2">Extract Colors Instantly</h3>
                <p className="text-blue-800 mb-4">
                    Upload any image to find its dominant colors and generate a complete palette.
                </p>
                <Link href="/image" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                    Open Image Extractor
                </Link>
            </div>

            <h2>Frequently Asked Questions</h2>

            <h3>Can I extract colors from a screenshot?</h3>
            <p>
                Yes. Screenshots are treated just like any other image file (PNG, JPG). This is excellent for analyzing the color schemes of apps or websites you admire.
            </p>

            <h3>How many colors should I extract?</h3>
            <p>
                Most tools extract a primary "Palette" of 5-8 colors. However, for a complex image, you might find up to 10-12 distinct dominant shades. It's best to start with 5 core colors to keep your design focused.
            </p>
        </article>
    );
}
