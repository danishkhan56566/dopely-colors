import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Preview Color Palettes on Real UI Designs | Dopely Colors',
    description: 'Previewing color palettes on real design layouts allows designers to see how colors behave in actual interfaces.',
};

export default function PreviewOnDesignsGuide() {
    return (
        <article className="prose prose-orange prose-lg max-w-none">
            <Link href="/guides" className="no-underline text-sm font-bold text-gray-500 hover:text-orange-600 flex items-center gap-2 mb-8 not-prose">
                <ArrowLeft size={16} /> Back to Guides
            </Link>

            <h1>Preview Color Palettes on Real UI Designs</h1>

            <p className="lead text-xl text-gray-600">
                Previewing color palettes on real design layouts allows designers to see how colors behave in actual interfaces. Instead of abstract swatches, previews show buttons, cards, text, and backgrounds together.
            </p>

            <p>
                This step helps identify contrast issues, visual imbalance, and usability problems early. Designers can test multiple palettes before finalizing a design system.
            </p>
            <p>
                Preview tools are especially useful for landing pages, dashboards, and mobile apps where color context matters.
            </p>

            <hr className="my-10 border-gray-100" />

            <h2>Why This Matters</h2>
            <p>
                A five-color swatch might look beautiful in isolation but fail terrible when applied to a UI. Perhaps the "Accent" color is too bright for a primary button, or the "Neutral" background makes the text illegible. Contextual previewing eliminates these surprises before you write a single line of CSS.
            </p>

            <h2>Try the Tool</h2>
            <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 not-prose my-8">
                <h3 className="font-bold text-orange-900 text-lg mb-2">Visualize Your Colors</h3>
                <p className="text-orange-800 mb-4">
                    See your palette applied to Landing Pages, SaaS Dashboards, and Mobile Apps instantly.
                </p>
                <Link href="/generate?view=visualize" className="inline-block bg-orange-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-700 transition-colors">
                    Start Visualizing
                </Link>
            </div>

            <h2>Frequently Asked Questions</h2>

            <h3>Can I upload my own design to preview?</h3>
            <p>
                Currently, Dopely Colors offers a suite of high-quality templates (Dashboards, E-commerce, etc.) that cover 90% of use cases. Custom design uploading is on our roadmap.
            </p>

            <h3>How does the tool know where to apply each color?</h3>
            <p>
                We use Semantic Color Roles. You define which color is "Primary", "Background", "Surface", or "Text", and our templates intelligently map those choices to the correct UI elements.
            </p>
        </article>
    );
}
