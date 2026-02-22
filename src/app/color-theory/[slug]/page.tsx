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

                <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 italic">
                        Want to see these theories in action?
                    </h3>
                    <Link
                        href="/explore"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-blue-500/20"
                    >
                        Explore 10,000+ Palettes
                    </Link>
                </div>
            </div>
        </article>
    );
}
