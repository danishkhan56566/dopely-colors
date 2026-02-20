import React from 'react';
import { DocumentationHub } from '../DocumentationHub';

export const EcoImpactGuide = () => {
    return (
        <DocumentationHub
            title="Eco-Friendly Color Calculator"
            description="Measure the estimated OLED screen energy consumption based on the lumens and pixel brightness of your color palette."
            benefits={[
                "Design sustainable, low-energy digital products",
                "Calculate carbon footprint reductions for dark mode",
                "Build ESG-compliant design systems",
                "Optimize UI for mobile battery life"
            ]}
            howToSteps={[
                { title: "Input Palette", desc: "Add the colors used in your application." },
                { title: "Set Usage Areas", desc: "Define what percentage of the screen each color occupies." },
                { title: "Calculate Energy", desc: "View the milli-watt (mW) usage and carbon output estimates." }
            ]}
            faqs={[
                { question: "How does color impact battery life?", answer: "On modern OLED screens, darker colors physically turn off pixels, saving massive amounts of battery and reducing energy draw." }
            ]}
        />
    );
};
