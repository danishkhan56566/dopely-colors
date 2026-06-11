import { notFound } from 'next/navigation';
import { popularColorCombos } from '@/lib/pSEO';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import { ChevronRight, ExternalLink, Sparkles } from 'lucide-react';
import { Metadata } from 'next';
import { RelatedLinks } from '@/components/seo/RelatedLinks';

interface PageProps {
    params: Promise<{ combo: string }>;
}

export async function generateStaticParams() {
    return popularColorCombos.map((combo) => ({
        combo: combo.slug,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { combo } = await params;
    const data = popularColorCombos.find(c => c.slug === combo);

    if (!data) return { title: 'Not Found' };

    return {
        title: `${data.title} - Hex Codes & Design Ideas | Dopely Colors`,
        description: data.description,
        alternates: {
            canonical: `https://dopelycolors.com/color-combos/${data.slug}`,
        },
        openGraph: {
            title: data.title,
            description: data.description,
            type: 'article',
        }
    };
}

export default async function ColorComboPage({ params }: PageProps) {
    const { combo } = await params;
    const data = popularColorCombos.find(c => c.slug === combo);

    if (!data) {
        notFound();
    }

    const primaryColor = data.colors[0].hex;
    const secondaryColor = data.colors[1].hex;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "name": data.title,
        "description": data.description,
        "url": `https://dopelycolors.com/color-combos/${data.slug}`,
        "creator": {
            "@type": "Organization",
            "name": "Dopely Colors"
        }
    };

    return (
        <DashboardLayout>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="min-h-screen bg-gray-50 flex flex-col items-center relative overflow-hidden">
                {/* Immersive Background */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] mix-blend-multiply opacity-30 animate-blob" style={{ backgroundColor: primaryColor }} />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] mix-blend-multiply opacity-30 animate-blob animation-delay-4000" style={{ backgroundColor: secondaryColor }} />
                </div>

                <div className="w-full max-w-7xl px-4 py-16 sm:px-6 relative z-10 space-y-16">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center space-x-2 text-sm font-medium text-gray-500">
                        <Link href="/explore" className="hover:text-gray-900 transition-colors">Explore</Link>
                        <ChevronRight size={16} />
                        <Link href="/color-combos" className="hover:text-gray-900 transition-colors">Color Combinations</Link>
                        <ChevronRight size={16} />
                        <span className="text-gray-900">{data.title}</span>
                    </nav>

                    {/* Premium Header */}
                    <div className="text-center space-y-6 max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/60 backdrop-blur-md border border-white/40 shadow-sm rounded-full ring-1 ring-black/5">
                            <Sparkles size={14} style={{ color: primaryColor }} />
                            <span className="text-xs font-bold uppercase tracking-widest text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}>
                                {data.theme} Combination
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-tight">
                            {data.title}
                        </h1>

                        <p className="text-xl text-gray-600 leading-relaxed font-medium">
                            {data.description}
                        </p>
                    </div>

                    {/* Color Display */}
                    <div className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[3rem] shadow-xl shadow-gray-200/50 border border-white/50 ring-1 ring-black/5">
                        <div className="flex flex-col md:flex-row h-64 md:h-96 rounded-3xl overflow-hidden shadow-inner mb-12">
                            {data.colors.map((color) => (
                                <div 
                                    key={color.hex} 
                                    className="flex-1 flex flex-col justify-end p-6 group transition-all duration-500 hover:flex-[1.5]"
                                    style={{ backgroundColor: color.hex }}
                                >
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg transform translate-y-4 group-hover:translate-y-0">
                                        <div className="font-bold text-gray-900 truncate">{color.name}</div>
                                        <div className="font-mono text-sm text-gray-500 uppercase">{color.hex}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Palette Data */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {data.colors.map(color => (
                                <div key={color.hex} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex items-center justify-between">
                                    <div>
                                        <div className="w-8 h-8 rounded-full shadow-sm mb-3 border border-black/5" style={{ backgroundColor: color.hex }} />
                                        <div className="font-bold text-gray-900 text-lg">{color.name}</div>
                                        <div className="font-mono text-sm text-gray-500">{color.hex}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Action Links */}
                    <div className="flex justify-center gap-4">
                        <Link href={`/generate?colors=${data.colors.map(c => c.hex.replace('#', '')).join('-')}`} className="px-8 py-4 bg-gray-900 text-white rounded-full font-bold shadow-lg shadow-gray-900/20 hover:scale-105 transition-all flex items-center gap-2">
                           Open in Generator <ExternalLink size={18} />
                        </Link>
                        <Link href="/contrast" className="px-8 py-4 bg-white text-gray-900 rounded-full font-bold shadow-sm border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all">
                           Check Contrast
                        </Link>
                    </div>

                    <RelatedLinks />
                </div>
            </div>
        </DashboardLayout>
    );
}
