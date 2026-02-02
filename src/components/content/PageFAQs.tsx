import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check, X, Info, AlertTriangle, DollarSign, Lock, Cpu, Users, HelpCircle } from 'lucide-react';

// ... (existing helper function remain unchanged) ...

// --- 1. Homepage FAQ (Premium Redesign) ---
export const HomeFAQ = () => (
    <section className="max-w-7xl mx-auto py-32 px-6 relative overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-50/50 rounded-full blur-3xl -z-10" />

        <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-6">
                <HelpCircle size={12} className="fill-indigo-600" />
                Support & Details
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                Common <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Questions.</span>
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
                Everything you need to know about our philosophy, pricing, and algorithms.
            </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
                {
                    icon: <Cpu size={24} />,
                    q: "Why did we build Dopely?",
                    a: "Most tools ignore production reality. We built a playground that handles contrast, accessibility, and developer handoff (Tailwind) natively.",
                    color: "text-indigo-600 bg-indigo-50 border-indigo-100"
                },
                {
                    icon: <DollarSign size={24} />,
                    q: "Is it really free?",
                    a: "Yes. The core toolkit (Generator, Picker, Extractor) is free. We support the project via optional Pro memberships for cloud sync.",
                    color: "text-emerald-600 bg-emerald-50 border-emerald-100"
                },
                {
                    icon: <Lock size={24} />,
                    q: "Commercial Rights?",
                    a: "Absolutely independent. Any palette you generate is 100% yours. No attribution needed. Ship faster, don't worry about royalties.",
                    color: "text-blue-600 bg-blue-50 border-blue-100"
                },
                {
                    icon: <Cpu size={24} />, // Reusing CPU icon for algo
                    q: "Smart Algorithm?",
                    a: "We act on HCL (Human Perception) space, not random RGB math. Your palettes won't just look scientific—they'll feel balanced.",
                    color: "text-purple-600 bg-purple-50 border-purple-100"
                },
                {
                    icon: <Users size={24} />,
                    q: "Ideal User?",
                    a: "Designers who care about systems, and Developers tired of guessing hex codes. If you value scalability over singular style, this is for you.",
                    color: "text-pink-600 bg-pink-50 border-pink-100"
                },
                {
                    icon: <HelpCircle size={24} />,
                    q: "Need more help?",
                    a: "We are active on Twitter and Discord. If you have a specific edge-case or feature request, drop us a line anywhere.",
                    color: "text-orange-600 bg-orange-50 border-orange-100"
                }
            ].map((item, i) => (
                <div key={i} className="group p-8 rounded-[2rem] bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start">
                    <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-current/10`}>
                        {item.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{item.q}</h3>
                    <p className="text-gray-500 leading-relaxed font-medium text-sm md:text-base">
                        {item.a}
                    </p>
                </div>
            ))}
        </div>
    </section>
);
import { SafeSchema } from '@/components/seo/SafeSchema';

// --- Shared Components ---
const FAQSection = ({ title, items }: { title: string, items: { q: string, a: React.ReactNode }[] }) => {
    // Generate Schema
    const schemaData = {
        "mainEntity": items.map(item => ({
            "@type": "Question",
            "name": item.q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": typeof item.a === 'string' ? item.a : "Detailed answer provided below."
            }
        }))
    };

    return (
        <section className="max-w-4xl mx-auto py-16 px-6 text-gray-700 border-t border-gray-100 bg-white">
            <SafeSchema type="FAQPage" data={schemaData} />

            <h2 className="text-3xl font-black text-gray-900 mb-10 text-center tracking-tight">{title}</h2>



            <div className="grid gap-6">
                {items.map((item, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-start gap-3">
                            <span className="text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded text-sm mt-0.5">Q.</span>
                            {item.q}
                        </h3>
                        <div className="pl-11 text-gray-600 leading-relaxed text-sm md:text-base">
                            {item.a}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

// --- 1. Homepage FAQ ---


// --- 2. Favorites FAQ ---
export const FavoritesFAQ = () => (
    <FAQSection
        title="Favorites & Collections FAQ"
        items={[
            {
                q: "Do I need an account to save palettes?",
                a: "Currently, we use local storage to save your favorites directly to your browser, so no login is required! However, creating an account ensures your data is synced across devices and never lost."
            },
            {
                q: "Can I export my favorite palettes?",
                a: "Yes. You can export your entire collection or individual palettes to various formats including PDF, CSS, JSON, and Tailwind config."
            },
            {
                q: "Is there a limit to how many palettes I can save?",
                a: "For guest users, we store up to 50 palettes in your browser's local storage. Pro members get unlimited cloud storage."
            },
            {
                q: "How do I organize my saved colors?",
                a: "You can create 'Projects' to group palettes together. This is perfect for freelancers managing multiple clients or designers separating inspiration from production assets."
            }
        ]}
    />
);

// --- 3. Image Extractor FAQ ---
export const ImageFAQ = () => (
    <FAQSection
        title="Image Extraction FAQ"
        items={[
            {
                q: "How does the Image to Palette tool work?",
                a: (
                    <>
                        We use a K-Means clustering algorithm to analyze pixels. It groups similar colors and calculates the dominant hues. Once extracted, you can further refine your palette in our <Link href="/generate" className="text-indigo-600 font-medium hover:underline">Main Generator</Link>.
                    </>
                )
            },
            {
                q: "What image formats are supported?",
                a: "We support all major web formats: JPG, PNG, WEBP, and SVG. The file size limit is 10MB per upload."
            },
            {
                q: "Do you store my uploaded images?",
                a: "No. All image processing happens client-side in your browser for maximum privacy. Your photos are never uploaded to our servers."
            },
            {
                q: "Can I detect colors from a URL?",
                a: "Yes, you can paste a direct link to an image. However, due to browser security policies (CORS), some external URLs might not load directly unless the hosting server allows it."
            },
            {
                q: "What is 'Vibrant' vs 'Muted' extraction?",
                a: "Vibrant extraction prioritizes high-saturation pixels to find accent colors. Muted extraction looks for the dominant background tones. You can toggle between these modes to get the exact palette mood you need."
            }
        ]}
    />
);

// --- 4. AI Generator FAQ ---
export const AIFaq = () => (
    <FAQSection
        title="AI Generation FAQ"
        items={[
            {
                q: "How does the AI Palette Generator work?",
                a: (
                    <>
                        Our model understands semantic associations. When you type 'Cyberpunk City', it translates concepts into specific hex codes. You can then test these colors for accessibility using our <Link href="/contrast" className="text-indigo-600 font-medium hover:underline">Contrast Checker</Link>.
                    </>
                )
            },
            {
                q: "What kind of prompts yield the best results?",
                a: "Specific prompts work best. Include a subject, a mood, and lighting. For example: 'Organic skincare brand, soft pastels, morning sunlight, minimalist' will give better results than just 'skincare'."
            },
            {
                q: "Is the AI integrated with ChatGPT or Midjourney?",
                a: "We use a specialized internal logic trained specifically on color taxonomies, optimised for UI design usage rather than general text generation."
            },
            {
                q: "Can I edit the AI-generated results?",
                a: (
                    <>
                        Yes! After generating, you can lock colors and re-roll the rest, or head to the <Link href="/design-system" className="text-indigo-600 font-medium hover:underline">Design System Builder</Link> to see them in action.
                    </>
                )
            }
        ]}
    />
);

// --- 5. Contrast Checker FAQ ---
export const ContrastFAQ = () => (
    <FAQSection
        title="Accessibility & Contrast FAQ"
        items={[
            {
                q: "What is WCAG 2.1?",
                a: "WCAG (Web Content Accessibility Guidelines) is the international standard for web accessibility. It defines three levels of conformance: A (lowest), AA (mid-range), and AAA (highest). Most modern websites aim for AA compliance."
            },
            {
                q: "What is a good contrast ratio?",
                a: "For normal text, WCAG AA requires a ratio of at least 4.5:1. For large text (18pt+), the requirement is 3:1. We recommend aiming for 7:1 (AAA) for critical reading content."
            },
            {
                q: "Why does my blue button fail on white?",
                a: (
                    <>
                        Pure blue on white often has a lower ratio than expected. Try using our <Link href="/picker" className="text-indigo-600 font-medium hover:underline">Color Picker</Link> to find a slightly darker shade that passes the test.
                    </>
                )
            },
            {
                q: "Does this check color blindness?",
                a: (
                    <>
                        This tool checks contrast. To see how your colors look to color-blind users, use the 'Simulate' feature in our <Link href="/generate?view=visualize" className="text-indigo-600 font-medium hover:underline">Visualizer Mode</Link>.
                    </>
                )
            }
        ]}
    />
);

// --- 6. Palette Detail FAQ ---
export const PaletteDetailsFAQ = () => (
    <FAQSection
        title="Palette Usage FAQ"
        items={[
            {
                q: "How do I use this palette in CSS?",
                a: "You can copy the CSS variables snippet provided in the export menu. Paste it into your :root selector to instantly access these colors throughout your stylesheet."
            },
            {
                q: "Can I convert these colors to CMYK for print?",
                a: "Yes! Click the 'Export' button and select 'Print (CMYK)'. Note that some vibrant screen colors (RGB) may look duller in print."
            },
            {
                q: "What is the 'Blindness Simulation' feature?",
                a: (
                    <>
                        This feature simulates how your palette looks to people with vision impairments. It is also available in our <Link href="/contrast" className="text-indigo-600 font-medium hover:underline">Contrast Checker</Link> for accessibility audits.
                    </>
                )
            },
            {
                q: "How can I share this palette with my team?",
                a: "Simply copy the URL! All palette data is encoded directly in the link, meaning anyone who clicks it sees your exact work."
            }
        ]}
    />
);

// --- 7. Color Picker FAQ ---
export const PickerFAQ = () => (
    <FAQSection
        title="Color Picker & Converter FAQ"
        items={[
            {
                q: "What is the difference between HEX and RGB?",
                a: "HEX is a 6-digit alphanumeric code used primarily in web design (e.g., #FF0000). RGB defines color by Red, Green, and Blue light values (0-255). They represent the exact same color, just written differently."
            },
            {
                q: "When should I use HSL?",
                a: "HSL (Hue, Saturation, Lightness) is best for design work. It allows you to modify a color's brightness or intensity without changing its fundamental hue."
            },
            {
                q: "Does this picker support transparency (Alpha)?",
                a: "Yes, you can input RGBA or HSL values. HEX codes with 8 digits (e.g., #FF000080) are also supported for 50% opacity."
            },
            {
                q: "What are 'Harmonies'?",
                a: (
                    <>
                        Harmonies are formulas for choosing colors that look good together. You can see these in action by clicking the 'Harmony' dropdown in our <Link href="/generate" className="text-indigo-600 font-medium hover:underline">Main Palette Generator</Link>.
                    </>
                )
            }
        ]}
    />
);

// --- 8. Tailwind FAQ ---
export const TailwindFAQ = () => (
    <FAQSection
        title="Tailwind CSS Generator FAQ"
        items={[
            {
                q: "How do I install these colors in Tailwind?",
                a: "Copy the generated 'theme.extend.colors' object and paste it into your 'tailwind.config.js' file."
            },
            {
                q: "Why are there 11 shades (50-950)?",
                a: (
                    <>
                        Tailwind's scale offers a predictable range of lightness. You can preview how these shades look on real UI components in our <Link href="/design-system" className="text-indigo-600 font-medium hover:underline">Design System Builder</Link>.
                    </>
                )
            },
            {
                q: "Is this compatible with Tailwind v3 and v4?",
                a: "Yes, the generated config object is standard JavaScript and works with all modern versions of Tailwind CSS."
            },
            {
                q: "My colors look different in dark mode?",
                a: "When designing for dark mode, you usually invert the scale. Our generator ensures the step perceptiveness is balanced so this inversion feels natural."
            }
        ]}
    />
);

// --- 9. Design System FAQ ---
export const DesignSystemFAQ = () => (
    <FAQSection
        title="Design System Builder FAQ"
        items={[
            {
                q: "What is a Design Token?",
                a: (
                    <>
                        A design token is a semantic name for a visual value. Instead of using '#3B82F6', you use 'Primary-Color'. This principle is key to our <Link href="/tailwind" className="text-indigo-600 font-medium hover:underline">Tailwind Generator</Link> as well.
                    </>
                )
            },
            {
                q: "Will this work with Figma?",
                a: "Yes. You can export these values as a JSON file which can be imported into Figma using plugins like 'Tokens Studio'."
            },
            {
                q: "Should I use 'inter' or 'system-ui' font?",
                a: (
                    <>
                        System-ui offers the best performance. Inter is a great choice for a consistent look. Both can be previewed in our <Link href="/generate?view=visualize" className="text-indigo-600 font-medium hover:underline">Visualize Mode</Link>.
                    </>
                )
            },
            {
                q: "How do semantic colors work?",
                a: "These are standard utility colors used for feedback states like Success or Error. Defining them ensures every alert in your app uses the exact same shade."
            }
        ]}
    />
);

export const ToolsHubFAQ = () => (
    <FAQSection
        title="Dopely Colors Suite FAQ"
        items={[
            {
                q: "Is Dopely Colors free to use?",
                a: "Yes! The core tools including the Palette Generator, Contrast Checker, and Image Extractor are completely free to use. We offer a Pro plan for users who need cloud sync and advanced project management."
            },
            {
                q: "Can I use these tools for commercial projects?",
                a: "Absolutely. Any color palette, gradient, or design system you generate is yours to use in any personal or commercial project with no attribution required."
            },
            {
                q: "Do I need to install anything?",
                a: "No, Dopely Colors runs entirely in your browser. However, we do offer extensions for Chrome and Figma if you want to integrate our tools directly into your workflow."
            },
            {
                q: "How does the AI feature work?",
                a: (
                    <>
                        Our <Link href="/ai" className="text-indigo-600 font-medium hover:underline">AI Generator</Link> uses advanced natural language processing to convert text descriptions (like 'Serene Ocean Sunset') into scientifically balanced color palettes.
                    </>
                )
            },
            {
                q: "What makes this different from other color tools?",
                a: "We built Dopely because we were tired of tools that generate pretty but useless colors. A palette might look great in a moodboard, but if it fails WCAG contrast tests or doesn't have a semantic dark mode equivalent, it's useless for software development. We prioritize 'shippability' over pure aesthetics."
            }
        ]}
    />
);

export const AIHowTo = () => (
    <SafeSchema
        type="HowTo"
        data={{
            "name": "How to Generate an AI Color Palette",
            "description": "Learn how to generate professional color palettes using AI.",
            "step": [
                {
                    "@type": "HowToStep",
                    "name": "Enter your prompt",
                    "text": "Describe your design style, brand, or mood in the input field. For example: 'Cyberpunk city at night'."
                },
                {
                    "@type": "HowToStep",
                    "name": "Generate palette",
                    "text": "Click the generate button. The AI uses semantic analysis to create a 5-color palette matching your description."
                },
                {
                    "@type": "HowToStep",
                    "name": "Refine and Export",
                    "text": "Click any color to lock it or drag to reorder. When satisfied, export your palette to CSS, Tailwind, or Figma."
                }
            ]
        }}
    />
);

export const ImageHowTo = () => (
    <SafeSchema
        type="HowTo"
        data={{
            "name": "How to Extract Colors from an Image",
            "description": "Extract a beautiful color palette from any photo or screenshot.",
            "step": [
                {
                    "@type": "HowToStep",
                    "name": "Upload Image",
                    "text": "Drag and drop your image (JPG, PNG, WEBP) into the upload zone."
                },
                {
                    "@type": "HowToStep",
                    "name": "Analyze Colors",
                    "text": "Our algorithm automatically processes the image using K-Means clustering to find dominant and accent colors."
                },
                {
                    "@type": "HowToStep",
                    "name": "Select Palette",
                    "text": "Choose up to 5 colors from the extracted list to build your final palette."
                }
            ]
        }}
    />
);

export const TailwindHowTo = () => (
    <SafeSchema
        type="HowTo"
        data={{
            "name": "How to Generate Tailwind Color Scales",
            "description": "Create a full 50-950 color scale for Tailwind CSS from a single base color.",
            "step": [
                {
                    "@type": "HowToStep",
                    "name": "Pick Base Color",
                    "text": "Select your primary brand color using the picker or enter a hex code."
                },
                {
                    "@type": "HowToStep",
                    "name": "Preview Scale",
                    "text": "The tool automatically generates 11 shades (50-950) blended with white and black for perfect perceptual balance."
                },
                {
                    "@type": "HowToStep",
                    "name": "Export Config",
                    "text": "Copy the generated code snippet and paste it into your tailwind.config.js file under theme.extend.colors."
                }
            ]
        }}
    />
);

export const DesignSystemHowTo = () => (
    <SafeSchema
        type="HowTo"
        data={{
            "name": "How to Build a Color Design System",
            "description": "Define your semantic color tokens for a scalable design system.",
            "step": [
                {
                    "@type": "HowToStep",
                    "name": "Define Brand Colors",
                    "text": "Set your Primary and Secondary brand colors."
                },
                {
                    "@type": "HowToStep",
                    "name": "Set Semantic Roles",
                    "text": "Choose colors for Success, Warning, Error, and Info states to ensure consistent feedback."
                },
                {
                    "@type": "HowToStep",
                    "name": "Export Tokens",
                    "text": "Export your system as CSS Variables or JSON tokens for use in development or Figma."
                }
            ]
        }}
    />
);
