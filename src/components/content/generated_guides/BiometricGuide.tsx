import React from 'react';
import { DocumentationHub } from '../DocumentationHub';

export const BiometricGuide = () => {
    return (
        <DocumentationHub
            title="Biometric Color Engine"
            description="Simulate and measure emotional and physiological responses to complete color systems using AI pattern matching."
            benefits={[
                "Optimize conversions by targeting psychological triggers",
                "Test color combinations against demographic visual data",
                "Reduce A/B testing cycles with AI-predicted emotional resonance",
                "Design universally appealing palettes grounded in human psychology"
            ]}
            howToSteps={[
                { title: "Input Palette", desc: "Paste your brand colors or import a design token file." },
                { title: "Select Target", desc: "Choose the target emotion, demographic, or conversion goal." },
                { title: "Analyze", desc: "Review the simulated physiological response metrics and adjust accordingly." }
            ]}
            faqs={[
                { question: "How accurate is the biometric simulation?", answer: "Our engine uses models trained on thousands of eye-tracking and heart-rate studies related to color psychology." },
                { question: "Can I export the metrics?", answer: "Yes, you can export the full psychological profile as a PDF report." }
            ]}
        />
    );
};
