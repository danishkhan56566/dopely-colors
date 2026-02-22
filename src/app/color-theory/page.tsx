import Link from 'next/link';
import { colorTheoryDb } from '@/data/colorTheory';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Color Theory & Science Guide | Dopely Colors',
    description: 'Learn the fundamentals of color theory, from Isaac Newton\'s color wheel to primary, secondary, and tertiary color mixing.',
    alternates: {
        canonical: 'https://dopelycolors.com/color-theory'
    }
};

export default function ColorTheoryLanding() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
                    The Science and Theory of <span className="text-blue-600 dark:text-blue-400">Color</span>
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed">
                    Color is more than just decoration—it is physics, psychology, and logic. Explore our deep dives into the historical and scientific foundations of how we perceive and use color in design.
                </p>

                <div className="grid gap-8">
                    {colorTheoryDb.map((topic) => (
                        <Link
                            key={topic.slug}
                            href={`/color-theory/${topic.slug}`}
                            className="group block p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-500 transition-all shadow-sm hover:shadow-md"
                        >
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors mb-4">
                                {topic.title}
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                                {topic.description}
                            </p>
                            <span className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-2">
                                Read full guide →
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
