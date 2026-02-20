import React from 'react';
import { DocumentationHub } from '../DocumentationHub';

export const MixerGuide = () => {
    return (
        <DocumentationHub
            title="Pro Color Studio Mixer"
            description="Simulate real-world pigment mixing (Subtractive) vs screen light (Additive) to find accurate mid-point blends."
            benefits={[
                "Bridge the gap between print and digital color mixing",
                "Extract perfect mathematically intermediate shades",
                "Simulate physical paint mixing using Kubelka-Munk theory",
                "Build harmonious stepping gradients"
            ]}
            howToSteps={[
                { title: "Load Colors", desc: "Input your two anchor colors." },
                { title: "Choose Physics", desc: "Toggle between RGB light mixing or realistic RYB pigment." },
                { title: "Extract Midpoints", desc: "Pull the exact blended hex codes from the resulting mix." }
            ]}
            faqs={[
                { question: "Why does yellow and blue make gray on screens?", answer: "Screens use Additive (RGB) light. Mixing them physically requires Subtractive modes which simulate pigment absorption." }
            ]}
        />
    );
};
