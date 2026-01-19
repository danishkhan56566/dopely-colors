import clsx from 'clsx';
import { LayoutDashboard, Smartphone, ShoppingCart, Activity, Laptop } from 'lucide-react';

const INDUSTRIES = [
    { label: 'SaaS & Dashboards', icon: LayoutDashboard, color: 'bg-blue-100 text-blue-600' },
    { label: 'Fintech', icon: Activity, color: 'bg-green-100 text-green-600' },
    { label: 'E-commerce', icon: ShoppingCart, color: 'bg-orange-100 text-orange-600' },
    { label: 'Islamic Apps', icon: Smartphone, color: 'bg-emerald-100 text-emerald-600' },
    { label: 'AI Products', icon: Laptop, color: 'bg-purple-100 text-purple-600' },
];

export const IndustryGrid = () => {
    return (
        <section className="py-24 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Curated for your industry</h2>
                    <p className="text-xl text-gray-500">Don&apos;t start from scratch. Use algorithms tuned for specific sectors.</p>
                </div>

                <div className="flex flex-wrap justify-center gap-6">
                    {INDUSTRIES.map((ind) => (
                        <div key={ind.label} className="flex flex-col items-center gap-4 p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all cursor-pointer bg-white group hover:-translate-y-1 w-48">
                            <div className={clsx("w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", ind.color)}>
                                <ind.icon size={32} />
                            </div>
                            <span className="font-bold text-center text-gray-700">{ind.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
