export const aiSEOData = {
    title: "AI-Powered Color Palette Generator",
    introduction: (
        <>
            <p>
                Welcome to the intersection of language and design. Our <strong>AI Color Palette Generator</strong> uses advanced Natural Language Processing (NLP) to translate abstract concepts, emotions, and descriptions into usable, accessible hex codes.
            </p>
            <p className="mt-4">
                Instead of endlessly tweaking sliders to find "trustworthy corporate blue" or "cyberpunk neon lights", you can simply type those exact words. The AI understands semantic color associations and generates an aesthetic, cohesive 5-color palette instantly. This bridges the communication gap between non-technical stakeholders and designers.
            </p>
        </>
    ),
    howToSteps: [
        {
            title: "Write a Descriptive Prompt",
            description: "In the input box, type a description of the vibe, brand, or environment you want to evoke. Examples: 'Organic vegan skincare brand', '80s retrowave arcade', or 'Minimalist Scandinavian furniture'."
        },
        {
            title: "Generate Concepts",
            description: "Hit Enter. The AI engine processes the semantic meaning of your words and queries its vast dataset of design associations to produce a highly curated color scheme."
        },
        {
            title: "Refine and Iterate",
            description: "Not quite right? You can lock specific colors you like by clicking them, and then hit generate again to let the AI build new combinations around your locked choices."
        },
        {
            title: "Proceed to Production",
            description: "Once satisfied, click 'Open in Studio' to bring your AI-generated palette into our primary suite where you can check WCAG contrast, export to Tailwind CSS, or simulate color blindness."
        }
    ],
    benefits: [
        {
            title: "Rapid Concepting",
            description: "Slash your mood-boarding time in half. Generate 10 entirely different brand concepts in 10 seconds just by tweaking a few adjectives."
        },
        {
            title: "Overcome Creative Block",
            description: "Stuck in a rut using the same colors for every project? The AI will suggest out-of-the-box combinations you might never have considered manually."
        },
        {
            title: "Client Communication",
            description: "When a client asks for something 'more energetic' or 'premium', you can type those exact adjectives into the generator to find objective color mappings for subjective goals."
        },
        {
            title: "Semantic Understanding",
            description: "Unlike random generators, the AI understands context. If you ask for 'Deep Ocean', it knows to prioritize high-saturation blues rather than just returning random hues."
        }
    ],
    proTips: [
        "Include lighting conditions in your prompt. 'Cyberpunk city' will give different results than 'Cyberpunk city at noon'.",
        "Add adjectives relating to UI density, such as 'minimalist', 'clean', 'heavy', or 'complex' to influence the contrast ratios of the generated palette.",
        "You can prompt for specific color theories! Ask the AI to generate a 'Triadic palette for a bakery' and it will apply geometric math to the prompt.",
        "Use the AI generator as a starting point, not the finish line. Always run the results through the Contrast Checker before deploying."
    ],
    faqs: [
        {
            q: "How does the AI know what 'cyberpunk' looks like?",
            a: "The underlying Large Language Model has been trained on millions of images, design systems, and text descriptions across the internet. It maps the word 'cyberpunk' to the hex codes most frequently associated with that aesthetic in professional design."
        },
        {
            q: "Is it using ChatGPT?",
            a: "The logic utilizes advanced LLM technology optimized specifically for color extraction and JSON formatting, ensuring the output is always a valid set of usable hex codes rather than conversational text."
        },
        {
            q: "Are AI-generated palettes copyright free?",
            a: "Yes. Colors and color combinations cannot be copyrighted. Any palette you generate with this tool is entirely free for commercial and personal use."
        },
        {
            q: "Why are the colors sometimes low contrast?",
            a: "The AI prioritizes fulfilling the *semantic* request of your prompt over strict accessibility math. If you ask for 'pastel fog', the AI will generate low-contrast pastels because that accurately represents fog. It is up to you to refine these in the main Generator."
        }
    ]
};
