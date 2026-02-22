import { colorTheoryDb } from '@/data/colorTheory';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const topic = colorTheoryDb.find(t => t.slug === slug);
    if (!topic) return {};

    return {
        title: `${topic.title} | Dopely Colors`,
        description: topic.description,
        alternates: {
            canonical: `https://dopelycolors.com/color-theory/${slug}`
        }
    };
}

export default async function TheoryTopicPage({ params }: Props) {
    const { slug } = await params;
    const topic = colorTheoryDb.find(t => t.slug === slug);

    if (!topic) {
        notFound();
    }

    return (
        <article className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-20 px-6">
            <div className="max-w-3xl mx-auto">
                <Link
                    href="/color-theory"
                    className="text-blue-600 dark:text-blue-400 font-semibold mb-8 block hover:underline"
                >
                    ← Back to Color Theory
                </Link>

                <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white mb-8 leading-tight">
                    {topic.title}
                </h1>

                <div
                    className="prose prose-slate dark:prose-invert max-w-none 
                        prose-headings:text-slate-900 dark:prose-headings:text-white 
                        prose-p:text-slate-600 dark:prose-p:text-slate-400 
                        prose-p:leading-relaxed prose-strong:text-slate-900 dark:prose-strong:text-white"
                    dangerouslySetInnerHTML={{ __html: topic.content }}
                />

                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Article",
                            "headline": topic.title,
                            "description": topic.description,
                            "author": {
                                "@type": "Organization",
                                "name": "Dopely Colors"
                            },
                            "publisher": {
                                "@type": "Organization",
                                "name": "Dopely Colors",
                                "logo": {
                                    "@type": "ImageObject",
                                    "url": "https://dopelycolors.com/icon.png"
                                }
                            },
                            "datePublished": "2024-01-01", // Placeholder, since we don't have dates in DB yet
                            "image": "https://dopelycolors.com/og-image.png"
                        })
                    }}
                />
            </div>
        </article>
    );
}
