import React from 'react';
import { DocumentationHub } from '../DocumentationHub';

export const ScraperGuide = () => {
    return (
        <DocumentationHub
            title="Website Color Scraper"
            description="Enter any URL to extract the complete brand color palette, typograhy usage, and DOM color distribution metrics."
            benefits={[
                "Reverse engineer competitor palettes instantly",
                "Audit your own live website for stray hex codes",
                "Visualize actual frontend color distribution",
                "Automatically group raw hexes into semantic palettes"
            ]}
            howToSteps={[
                { title: "Enter URL", desc: "Paste the target website address." },
                { title: "Scrape Engine", desc: "Our headless crawler parses computed CSS from the live DOM." },
                { title: "Analyze Report", desc: "Review the sorted list of primary, secondary, and tertiary colors." }
            ]}
            faqs={[
                { question: "Will this find colors hidden in images?", answer: "No, this tool specifically extracts computed CSS styles (backgrounds, text, borders) from the DOM." }
            ]}
        />
    );
};
