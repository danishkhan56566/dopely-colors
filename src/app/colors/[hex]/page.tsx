import { ColorDetailView } from '@/components/colors/ColorDetailView';
import { supabase } from '@/lib/supabase';
import { getNearestColorName, getFullConversions, isCanonicalColor, getSystematicColors } from '@/lib/color-utils';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { cache } from 'react';
import chroma from 'chroma-js';

// 1. Configuration: ISR and Static Generation
export const revalidate = 86400; // Cache valid colors for 24h

type Props = {
    params: Promise<{ hex: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// 2. Data Fetching with Cache (Spider Trap Prevention)
const getColorData = cache(async (hexParam: string) => {
    // Normalize hex format
    const hex = hexParam.startsWith('%23')
        ? `#${hexParam.replace('%23', '')}`
        : hexParam.startsWith('#')
            ? hexParam
            : `#${hexParam}`;

    const normalized = hex.replace('#', '').toUpperCase();

    // Strict Validation: Must be a valid chroma color AND either canonical OR in DB
    if (!chroma.valid(hex)) {
        return { hex, data: null, isValid: false };
    }

    const { data } = await supabase
        .from('colors')
        .select('name, hex, description, psychology, meaning, usage_info')
        .ilike('hex', `%${normalized}%`)
        .maybeSingle();

    if (!data && !isCanonicalColor(normalized)) {
        return { hex, data: null, isValid: false };
    }

    return { hex, data, isValid: true };
});

// 3. Static Params for Standard Colors (Performance)
export async function generateStaticParams() {
    const colors = getSystematicColors();
    return colors.map((c) => ({
        hex: c.hex.replace('#', '').toUpperCase()
    }));
}

// 4. Dynamic Metadata for SEO
export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const { hex: hexParam } = await params;
    const { hex, data, isValid } = await getColorData(hexParam);

    if (!isValid) return { title: 'Color Not Found | Dopely Colors' };

    const normalizedHex = hex.replace('#', '').toUpperCase();
    const colorName = data?.name || getNearestColorName(hex);
    const conversions = getFullConversions(hex);

    const description = data?.description ||
        `${colorName} (${hex}) hex color code details. Explore RGB, HSL, CMYK conversions, color psychology, and matching palettes for ${colorName}.`;

    return {
        title: `${colorName} (${hex}) Color Code - Meaning, Palettes & Psychology | Dopely Colors`,
        description: description.substring(0, 160),
        openGraph: {
            title: `${colorName} (${hex})`,
            description: description,
            images: [`/api/og/color?hex=${normalizedHex}`],
            type: 'website',
        },
        alternates: {
            canonical: `https://dopelycolors.com/colors/${normalizedHex}`,
        }
    };
}

// 5. Main Page Component
export default async function Page({ params }: Props) {
    const { hex: hexParam } = await params;
    const { hex, data, isValid } = await getColorData(hexParam);

    if (!isValid) {
        notFound();
    }

    const normalizedHex = hex.replace('#', '').toUpperCase();
    const colorName = data?.name || getNearestColorName(hex);
    const conversions = getFullConversions(hex);

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://dopelycolors.com"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Color Library",
                "item": "https://dopelycolors.com/colors"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": colorName,
                "item": `https://dopelycolors.com/colors/${normalizedHex}`
            }
        ]
    };

    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": `What is the RGB value of ${colorName} (${hex})?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `The RGB color code for ${colorName} (${hex}) is ${conversions.rgb}.`
                }
            },
            {
                "@type": "Question",
                "name": `What is the CMYK for the color ${hex}?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `The CMYK values for ${hex} are ${conversions.cmyk}.`
                }
            },
            {
                "@type": "Question",
                "name": `What does the color ${colorName} symbolize?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": data?.description || `${colorName} is a versatile color often used to convey specific emotions in design. Explore its psychology and matching palettes on Dopely Colors.`
                }
            }
        ]
    };

    const productJsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": `${colorName} Color`,
        "color": hex,
        "description": data?.description || `${colorName} is a ${hex} hex color code details and conversions.`,
        "brand": {
            "@type": "Brand",
            "name": "Dopely Colors"
        },
        "additionalProperty": [
            { "@type": "PropertyValue", "name": "HEX", "value": hex },
            { "@type": "PropertyValue", "name": "RGB", "value": conversions.rgb },
            { "@type": "PropertyValue", "name": "CMYK", "value": conversions.cmyk },
            { "@type": "PropertyValue", "name": "HSL", "value": conversions.hsl }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
            />
            
            {/* Color Detail View (Main UI) */}
            <ColorDetailView hex={hex} initialDbColor={data} />

            {/* --- DEEP SEO: SERVER-SIDE INSIGHTS & CIRCULAR LINKING --- */}
            <aside className="w-full bg-white border-t border-gray-50 py-24">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="bg-white rounded-[3rem] p-10 md:p-16 border border-gray-100 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 opacity-10 rounded-full blur-3xl -mr-20 -mt-20" style={{ backgroundColor: hex }} />
                        
                        <div className="relative z-10">
                            <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">Technical Datasheet</h2>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                                {[
                                    { label: 'HEX', value: normalizedHex },
                                    { label: 'RGB', value: conversions.rgb },
                                    { label: 'HSL', value: conversions.hsl },
                                    { label: 'CMYK', value: conversions.cmyk }
                                ].map(item => (
                                    <div key={item.label} className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{item.label}</div>
                                        <div className="text-sm font-mono font-bold text-gray-800">{item.value}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="prose prose-slate prose-lg max-w-none">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <div className="w-2 h-6 rounded-full" style={{ backgroundColor: hex }} />
                                    The Psychology of {colorName}
                                </h3>
                                <p className="text-gray-500 font-medium leading-relaxed mb-10">
                                    {data?.psychology || `The color ${colorName} (${hex}) is statistically associated with specific psychological and emotional responses. In digital design, it is frequently used to evoke ${chroma(hex).get('hsl.h') < 180 ? 'warmth and excitement' : 'calmness and trust'}.`}
                                    Proper application of {colorName} in UI/UX can improve conversion rates by optimizing visual hierarchy 
                                    and establishing a clear brand voice.
                                </p>
                                
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Circular Linkage: Featured Palettes</h3>
                                <p className="text-gray-500 font-medium mb-6">Discover how {colorName} works in professional contexts with these curated color schemes:</p>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { name: 'Contrast Peak', colors: [hex, chroma(hex).brighten(2).hex(), chroma(hex).darken(2).hex(), '#ffffff', '#000000'] },
                                        { name: 'Atmospheric Shift', colors: [hex, chroma(hex).set('hsl.h', '+40').hex(), chroma(hex).set('hsl.h', '-40').hex(), '#f8fafc', '#1e293b'] },
                                        { name: 'Analogous Flow', colors: [hex, chroma(hex).set('hsl.h', '+20').hex(), chroma(hex).set('hsl.h', '+40').hex(), '#f1f5f9', '#0f172a'] },
                                        { name: 'Complementary Force', colors: [hex, chroma(hex).set('hsl.h', '+180').hex(), '#ffffff', '#e2e8f0', '#020617'] }
                                    ].map(pal => (
                                        <Link 
                                            key={pal.name}
                                            href={`/palette/${pal.colors.map(c => c.replace('#', '')).join('-')}`}
                                            className="group flex flex-col p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all hover:bg-white hover:shadow-lg"
                                        >
                                            <div className="flex rounded-lg overflow-hidden h-10 mb-3 shadow-sm ring-1 ring-black/5">
                                                {pal.colors.map(c => <div key={c} className="flex-1" style={{ backgroundColor: c }} />)}
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-gray-700">{pal.name}</span>
                                                <span className="text-[10px] text-gray-400 group-hover:text-blue-600 transition-colors uppercase font-black font-mono">View Palette →</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
