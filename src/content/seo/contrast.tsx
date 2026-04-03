export const contrastSEOData = {
    title: "WCAG Contrast Checker",
    introduction: (
        <>
            <p>
                Our <strong>Advanced WCAG Contrast Checker</strong> is a necessary tool for product designers, web developers, and QA engineers who need to ensure their digital products are accessible to all users. Accessibility isn't just a nice-to-have; in many jurisdictions, meeting WCAG 2.1 AA standards is a legal requirement.
            </p>
            <p className="mt-4">
                This tool calculates the exact luminance ratio between your foreground (text) and background colors, instantly telling you if your design passes or fails the strict guidelines set by the Web Content Accessibility Guidelines. Stop guessing if your light-gray text on a white background is readable—know for sure.
            </p>
        </>
    ),
    howToSteps: [
        {
            title: "Input Your Colors",
            description: "Enter your foreground (text) and background colors using the HEX inputs, or use the interactive color pickers. You can also click the swap icon to instantly reverse the colors."
        },
        {
            title: "Check the Live Preview",
            description: "The large 'Aa' preview pane updates in real-time. This isn't just for show; it helps you feel the contrast visually before you even look at the math."
        },
        {
            title: "Review the WCAG Score",
            description: "Look at the compliance card on the right. It breaks down your score into four categories: AA Normal Text (requires 4.5:1), AA Large Text (requires 3.0:1), AAA Normal Text (requires 7.0:1), and AAA Large Text (requires 4.5:1)."
        },
        {
            title: "Adjust as Needed",
            description: "If your score is failing, use the color picker to slightly darken your text or lighten your background until you see the green 'PASS' badges appear."
        }
    ],
    benefits: [
        {
            title: "Legal Compliance",
            description: "Protect your client or organization by ensuring your web properties meet mandatory ADA and WCAG 2.1 accessibility standards."
        },
        {
            title: "Better User Experience",
            description: "High contrast isn't just for visually impaired users. It helps everyone read your content outside in bright sunlight or on low-quality monitors."
        },
        {
            title: "SEO Benefits",
            description: "Google and other search engines increasingly factor user experience and accessibility metrics into their ranking algorithms. Accessible sites rank better."
        },
        {
            title: "Instant Feedback",
            description: "No need to run massive Lighthouse audits just to check a button color. Our real-time calculator gives you instant pass/fail metrics."
        }
    ],
    proTips: [
        "Large text is defined by WCAG as 14pt (usually 18.66px) and bold, or 18pt (usually 24px) or larger. If your text is heavy, you have more leeway with contrast.",
        "Pure black (#000000) on pure white (#FFFFFF) has a contrast ratio of 21:1, the highest possible. However, this can cause eye strain. Aiming for an off-black like #1A1A1A on an off-white like #F8F9FA is often better for sustained reading.",
        "Don't forget to check the contrast of your UI components! Buttons, form borders, and icons need to meet a 3:1 contrast ratio against their backgrounds."
    ],
    faqs: [
        {
            q: "What is a good contrast ratio?",
            a: "A 'good' contrast ratio depends on the context, but the absolute minimum for standard body text is 4.5:1 (WCAG AA). However, aiming for 7:1 (WCAG AAA) is considered the gold standard for ultimate readability."
        },
        {
            q: "Does this tool work for color blindness?",
            a: "This specific tool calculates mathematical luminance contrast. While high contrast helps people with color blindness, you should also use our Visualizer tool to simulate how your colors look under specific conditions like Deuteranopia or Protanopia."
        },
        {
            q: "Why did my colors pass AA but fail AAA?",
            a: "AAA is a much stricter standard. While AA (4.5:1) is sufficient for most commercial websites and legal requirements, AAA (7:1) is often required for specialized government, medical, or educational software where maximum legibility is non-negotiable."
        },
        {
            q: "What does 'Luminance' mean in contrast?",
            a: "Relative luminance is the relative brightness of any point in a color space, normalized to 0 for darkest black and 1 for lightest white. The contrast ratio compares the luminance of the lighter color to the darker color."
        }
    ]
};
