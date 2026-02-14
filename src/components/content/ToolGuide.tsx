import React from 'react';

type ToolGuideProps = {
    title: string;
    description: string;
    children: React.ReactNode;
};

export const ToolGuide = ({ title, description, children }: ToolGuideProps) => {
    return (
        <section className="max-w-5xl mx-auto py-20 px-6 text-gray-700">
            <div className="prose prose-lg prose-indigo max-w-none">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">{title}</h2>
                    <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
                        {description}
                    </p>
                </div>
                {children}
            </div>
        </section>
    );
};
