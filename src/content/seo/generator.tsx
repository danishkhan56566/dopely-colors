export const generatorSEOData = {
    title: "Free Color Palette Generator",
    introduction: (
        <>
            <p>
                Our <strong>Free Color Palette Generator</strong> is an advanced tool designed to help UI/UX designers, developers, and creatives build beautiful, scalable, and accessible color systems in seconds. Unlike standard generators that output random RGB values, our engine operates in the HCL (Hue, Chroma, Luminance) color space, ensuring that the palettes you create are mathematically balanced and perceptually smooth.
            </p>
            <p className="mt-4">
                Whether you are designing a SaaS dashboard, a mobile application, or a branding package, choosing the right digital colors is crucial. This generator not only helps you find the perfect aesthetic but also ensures your choices translate perfectly to production environments like Tailwind CSS and Figma.
            </p>
        </>
    ),
    howToSteps: [
        {
            title: "Hit Spacebar to Generate",
            description: "Press the spacebar on your keyboard (or tap the generate button) to instantly create a new, randomized color palette. Our algorithm ensures the generated colors form a cohesive harmony."
        },
        {
            title: "Refine and Lock",
            description: "When you see a color you love, click the 'Lock' icon. That color will remain fixed while you continue generating, allowing the algorithm to seamlessly build the rest of the palette around your core choice."
        },
        {
            title: "Check Contrast in Real-Time",
            description: "Notice the badges between each color column? They display the WCAG contrast ratio instantly. If you see a warning icon, the contrast between those two adjacent colors is too low for readable text."
        },
        {
            title: "Export to Code",
            description: "Once your palette is perfect, hit 'E' or click 'Export'. You can grab the raw hex codes, a CSS Variables snippet, or even a full Tailwind CSS configuration ready to paste into your project."
        }
    ],
    benefits: [
        {
            title: "Built for Production (Tailwind Ready)",
            description: "Stop manually creating color scales. Your generated palette can be instantly converted into a 50-950 Tailwind CSS color scale with mathematically balanced interpolation."
        },
        {
            title: "Deep Accessibility Focus",
            description: "WCAG contrast checking is built directly into the UI, not hidden in a submenu. Know immediately if your text will be legible against your background colors."
        },
        {
            title: "Developer First",
            description: "Switch to 'Developer Mode' to view you palette directly as code variables (CSS, SCSS, JSON) rather than just aesthetic swatches."
        },
        {
            title: "Semantic Role Assignment",
            description: "Colors aren't just colors; they have jobs. Our columns assign default roles (Text, Background, Primary, Secondary, Accent) to help you visualize how they will be used in a real interface."
        }
    ],
    proTips: [
        "Start by locking your Background and Text colors first (usually column 1 and 2). Then generate the remaining colors to find the perfect Primary and Accent shades.",
        "Hover over any color and press 'C' to open the Context Preview, viewing your palette mapped onto a realistic UI component.",
        "Use the 'System Builder' at the top to expand your 5-color aesthetic palette into a massive 50+ color semantic design system with warning, error, and success states.",
        "Need to match a specific brand hex? Click the hex code on any column to open the advanced color picker and manually input your client's exact shade."
    ],
    faqs: [
        {
            q: "What is a color palette generator?",
            a: "A color palette generator is a tool that procedurally creates combinations of colors that work well together. Dopely Colors uses advanced color theory algorithms to ensure these combinations are not only aesthetically pleasing but also optimized for digital screens and accessibility standards."
        },
        {
            q: "Are the generated palettes free for commercial use?",
            a: "Yes! Every color combo you generate is 100% royalty-free and available for commercial use. You own the palettes you create, whether for open-source projects or enterprise SaaS applications."
        },
        {
            q: "How does the generator calculate contrast?",
            a: "We calculate contrast ratios strictly according to WCAG 2.1 guidelines, comparing the relative luminance of two colors. A ratio of 4.5:1 is required for normal text (AA level)."
        },
        {
            q: "Can I save my color palettes?",
            a: "Absolutely. Click the 'Heart' icon next to any palette to save it to your local Favorites collection. Your saved palettes persist across sessions, so you'll never lose a great color combo."
        }
    ]
};
