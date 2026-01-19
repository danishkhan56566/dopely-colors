import { Download, Accessibility, Layers, Palette, Share2, Smartphone } from 'lucide-react';

const features = [
    {
        icon: <Download className="text-blue-600" size={24} />,
        title: "Export to Code",
        description: "Copy HEX, RGB, Tailwind classes, or CSS variables instantly. Production-ready snippets for React, Flutter, and more."
    },
    {
        icon: <Accessibility className="text-green-600" size={24} />,
        title: "Accessibility Built-In",
        description: "Automatic WCAG AA/AAA contrast checks. Ensure your design system is inclusive from day one."
    },
    {
        icon: <Layers className="text-purple-600" size={24} />,
        title: "Auto-Generated Scales",
        description: "Don't just get 5 colors. Get complete 50-950 weight scales for every hue in your palette."
    },
    {
        icon: <Smartphone className="text-pink-600" size={24} />,
        title: "Real-World Previews",
        description: "See your colors on live website, mobile app, and dashboard mockups. No more guessing."
    },
    {
        icon: <Palette className="text-orange-600" size={24} />,
        title: "Mood Intelligence",
        description: "Generate palettes by context: Fintech, Islamic, Luxury, Tech, and more specialized algorithms."
    },
    {
        icon: <Share2 className="text-indigo-600" size={24} />,
        title: "Save & Share",
        description: "Create a library of favorites. Share persistent links with your team or clients."
    }
];

export const FeatureGrid = () => {
    return (
        <section className="py-24 px-6 bg-gray-50/50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Everything you need to ship</h2>
                    <p className="text-xl text-gray-500">From prompt to production in seconds.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, i) => (
                        <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow group">
                            <div className="mb-6 p-3 bg-gray-50 rounded-xl w-fit group-hover:bg-blue-50 transition-colors">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                            <p className="text-gray-500 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
