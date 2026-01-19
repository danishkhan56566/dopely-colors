import { Check } from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';

const FRAMEWORKS = [
    { id: 'tailwind', label: 'Tailwind CSS', code: `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    colors: {\n      primary: '#3B82F6',\n      secondary: '#10B981',\n      accent: '#F59E0B',\n    }\n  }\n}` },
    { id: 'css', label: 'CSS Variables', code: `:root {\n  --primary: #3B82F6;\n  --secondary: #10B981;\n  --accent: #F59E0B;\n}` },
    { id: 'scss', label: 'SCSS', code: `$primary: #3B82F6;\n$secondary: #10B981;\n$accent: #F59E0B;` },
    { id: 'json', label: 'JSON', code: `{\n  "primary": "#3B82F6",\n  "secondary": "#10B981",\n  "accent": "#F59E0B"\n}` },
];

export const FrameworkSection = () => {
    const [activeFramework, setActiveFramework] = useState(FRAMEWORKS[0]);

    return (
        <section className="py-24 px-6 bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">

                {/* Left Content */}
                <div className="flex-1">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">One-click export for any workflow</h2>
                    <p className="text-xl text-gray-400 mb-8">
                        Stop manual copying. Get production-ready code snippets generated instantly for your favorite setups.
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        {['Tailwind CSS', 'Bootstrap', 'Material UI', 'Flutter', 'React Native', 'Chakra UI'].map(fw => (
                            <div key={fw} className="flex items-center gap-3 text-gray-300">
                                <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
                                    <Check size={12} />
                                </div>
                                {fw}
                            </div>
                        ))}
                    </div>

                    <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-colors">
                        Start Exporting
                    </button>
                </div>

                {/* Right Code Preview */}
                <div className="flex-1 w-full max-w-xl">
                    <div className="rounded-2xl bg-[#0F1117] border border-gray-800 overflow-hidden shadow-2xl">
                        <div className="flex items-center border-b border-gray-800 overflow-x-auto">
                            {FRAMEWORKS.map(fw => (
                                <button
                                    key={fw.id}
                                    onClick={() => setActiveFramework(fw)}
                                    className={clsx(
                                        "px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                                        activeFramework.id === fw.id
                                            ? "border-blue-500 text-white bg-gray-800/50"
                                            : "border-transparent text-gray-500 hover:text-gray-300 hover:bg-gray-800/30"
                                    )}
                                >
                                    {fw.label}
                                </button>
                            ))}
                        </div>
                        <div className="p-6 overflow-x-auto">
                            <pre className="font-mono text-sm leading-relaxed text-blue-300">
                                {activeFramework.code}
                            </pre>
                        </div>
                        <div className="px-6 py-3 bg-gray-800/50 text-xs text-gray-500 flex justify-between items-center">
                            <span>Generated in 0.02s</span>
                            <span className="text-green-400">Ready to copy</span>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};
