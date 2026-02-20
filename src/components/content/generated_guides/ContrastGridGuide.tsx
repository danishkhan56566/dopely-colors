import React from 'react';
import { DocumentationHub } from '../DocumentationHub';

export const ContrastGridGuide = () => {
    return (
        <DocumentationHub
            title="Advanced Contrast Grid"
            description="Test WCAG 2.1 compliance across a matrix of foregrounds and backgrounds in a single glance."
            benefits={[
                "Catch accessibility violations before they hit production",
                "Visualize all possible text/background combinations instantly",
                "Ensure AAA compliance for critical UI elements",
                "Automatically filter out failing combinations"
            ]}
            howToSteps={[
                { title: "Add Colors", desc: "Input your core brand palette." },
                { title: "Scan Grid", desc: "Review the matrix for AAA, AA, or failing contrast ratios." },
                { title: "Export Audit", desc: "Download a spreadsheet of all accessible pairs." }
            ]}
            faqs={[
                { question: "Does this test for APCA?", answer: "Yes, you can toggle between standard WCAG 2.1 and the newer APCA perceptual contrast algorithm." }
            ]}
        />
    );
};
