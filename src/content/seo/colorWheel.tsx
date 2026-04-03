export const colorWheelSEOData = {
    title: "Interactive Color Wheel & Harmony Generator",
    introduction: (
        <>
            <p>
                Our <strong>Interactive Color Wheel</strong> is a powerful visual tool for understanding color relationships and generating mathematically precise color harmonies. While a standard color picker helps you find a single color, a color wheel helps you find the <em>context</em> of that color within the broader spectrum.
            </p>
            <p className="mt-4">
                Whether you are establishing a brand identity or designing a complex user interface, utilizing established color harmonies—like Complementary, Triadic, or Analogous—ensures your designs are balanced, aesthetically pleasing, and rooted in classical color theory.
            </p>
        </>
    ),
    howToSteps: [
        {
            title: "Select a Base Hue",
            description: "Drag the primary marker around the outer ring of the color wheel to select your foundational hue. This is the starting point from which all other colors in your harmony will be calculated."
        },
        {
            title: "Choose a Harmony Rule",
            description: "Use the dropdown menu to select a geometric rule for your palette. Choose 'Complementary' for high contrast, 'Analogous' for low contrast serenity, or 'Triadic' for vibrant balance."
        },
        {
            title: "Adjust Saturation and Lightness",
            description: "Color isn't just about hue. Use the inner sliders or the center triangle (depending on the wheel mode) to refine the intensity (saturation) and brightness (lightness) of your selected harmony."
        },
        {
            title: "Export to Palette",
            description: "Once you have found the perfect foundational harmony, click 'Open in Generator' to transfer these colors to our main workspace, where you can convert them into Tailwind tokens or check WCAG accessibility."
        }
    ],
    benefits: [
        {
            title: "Mathematical Precision",
            description: "Say goodbye to guessing. Our wheel uses precise geometric angles (e.g., exactly 180 degrees for complementary colors) to calculate flawless mathematical harmonies."
        },
        {
            title: "HCL Space Integration",
            description: "Unlike basic RGB wheels that often miscalculate the visual weight of yellows and blues, our advanced modes support human-perceptual color spaces for perfect visual balance."
        },
        {
            title: "Educational Value",
            description: "Perfect for students and junior designers looking to intuitively grasp the 'Why' behind color choices rather than just relying on random generation."
        },
        {
            title: "Instant UI Translation",
            description: "Instantly see how your selected classical harmony translates into digital UI roles (Background, Text, Primary/Accent)."
        }
    ],
    proTips: [
        "Analogous palettes (colors sitting next to each other on the wheel) are incredibly common in nature. Use them for backgrounds and overarching themes where you want the user to feel relaxed.",
        "Complementary palettes are aggressive and command attention. Use them sparingly, typically pairing a dominant background color with a highly contrasting call-to-action (CTA) button.",
        "For complex dashboards, consider a 'Split Complementary' palette, which offers the high contrast of a standard complementary scheme but introduces a third color to reduce the visual tension.",
        "Remember the 60-30-10 rule: Use your dominant color for 60% of the UI, your secondary color for 30%, and your high-contrast accent color for only 10%."
    ],
    faqs: [
        {
            q: "Who invented the color wheel?",
            a: "Sir Isaac Newton is credited with inventing the first color wheel in 1666 when he mapped the color spectrum onto a circle, laying the foundation for modern color theory."
        },
        {
            q: "What is an Analogous color scheme?",
            a: "An analogous color scheme uses three or more colors that are adjacent to each other on the color wheel. Because they share a common hue base, they naturally harmonize and create serene, comfortable designs."
        },
        {
            q: "What is a Triadic color scheme?",
            a: "A triadic color scheme uses three colors that are evenly spaced around the color wheel (forming an equilateral triangle). It offers high contrast while retaining visual harmony, but requires careful balancing of dominance."
        },
        {
            q: "Why do my complementary colors look bad on screen?",
            a: "If two complementary colors are highly saturated and placed directly next to each other, they can cause 'chromatic aberration' or visual vibration. Try reducing the saturation of one color, or inserting a neutral space between them."
        }
    ]
};
