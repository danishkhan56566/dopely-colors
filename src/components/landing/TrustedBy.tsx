
export const TrustedBy = () => {
    return (
        <section className="py-12 border-y border-gray-100 bg-white">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-8">
                    Essential tool for modern product teams
                </p>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Placeholder Text Logos for now, using fonts to simulate logos */}
                    <span className="text-xl font-bold font-serif">Figma</span>
                    <span className="text-xl font-bold font-sans">TailwindCSS</span>
                    <span className="text-xl font-bold font-mono">Next.js</span>
                    <span className="text-xl font-black italic">Stripes</span>
                    <span className="text-xl font-semibold">Webflow</span>
                </div>
            </div>
        </section>
    );
}
