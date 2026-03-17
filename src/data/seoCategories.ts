export interface SeoCategory {
    slug: string;
    title: string;
    description: string;
    seoContent: string;
}

export const seoCategoriesDb: SeoCategory[] = [
    {
        slug: 'vintage',
        title: 'Vintage Color Palettes',
        description: 'Discover the best retro and vintage color combinations for nostalgic UI design and branding.',
        seoContent: `
            <h3>The Power of Vintage Color Schemes in Modern Design</h3>
            <p>Vintage color palettes instantly evoke feelings of nostalgia, warmth, and authenticity. In modern web design and branding, utilizing retro color combinations—such as faded mustard yellows, muted teal greens, dusty rose, and aged sepia tones—can help your project stand out by grounding it in a sense of history. The best vintage palettes often rely on low-saturation colors to mimic the look of aged paper or faded photographs.</p>
            <h3>How to Use Retro Colors Effectively</h3>
            <p>When applying a vintage or retro color scheme to UI design, balance is critical. Pair highly saturated 70s orange or avocado green with neutral creams and off-whites rather than stark, pure white (#FFFFFF), which can break the illusion of age. Designers frequently employ vintage palettes for boutique e-commerce stores, artisanal coffee brands, and portfolio websites looking for a timeless aesthetic.</p>
            <p>Our curated collection of vintage color palettes provides thousands of hex codes ready to copy and paste. Whether you are aiming for a roaring 20s Art Deco vibe with gold and obsidian, a 1950s pastel diner aesthetic, or a gritty 90s grunge look, you'll find the perfect, accessible color combination here. All palettes are automatically tested for WCAG contrast compliance ensuring your retro typography remains perfectly readable.</p>
        `
    },
    {
        slug: 'neon',
        title: 'Neon Color Palettes',
        description: 'Browse vibrant, high-contrast neon color schemes perfect for cyberpunk aesthetics, gaming, and dark mode UI.',
        seoContent: `
            <h3>Energizing UI with Neon Color Palettes</h3>
            <p>Neon color palettes represent the ultimate in high-energy, futuristic design. Characterized by extreme saturation and high brightness values, colors like hot magenta, electric cyan, toxic green, and brilliant volt yellow simulate the glow of noble gases in glass tubes. In digital product design, neon colors are the absolute best choice for dark mode interfaces, gaming dashboards, and Web3 applications where you need to draw maximum user attention to specific interactive elements.</p>
            <h3>Best Practices for Cyberpunk and Dark Mode Themes</h3>
            <p>The golden rule of using a neon color scheme is to secure a pitch-black or very dark charcoal background. If you attempt to use neon yellow on a white background, your accessibility ratios will fail instantly, and the design will be unreadable. Instead, use a foundation of deep navy or true black, and apply your neon hex codes sparingly as accent colors on buttons, hover states, and active navigation borders to create a striking "glow" effect without causing eye strain.</p>
            <p>Explore our massive library of curated cyberpunk and neon color combinations. From 80s synthwave gradients to modern esports branding kits, these high-voltage palettes will give your next UI project a massive visual punch. Copy the CSS, Tailwind utility classes, or hex codes directly into your workflow.</p>
        `
    },
    {
        slug: 'pastel',
        title: 'Pastel Color Palettes',
        description: 'Soft, soothing, and elegant pastel color combinations for modern, minimalist web design and feminine branding.',
        seoContent: `
            <h3>Designing with Soft Pastel Color Palettes</h3>
            <p>Pastel color palettes are renowned for their soothing, calming, and highly approachable aesthetic. Created by adding significant amounts of white (high luminance) to pure hues, pastels like mint green, baby blue, lavender, and peach offer a visually gentle experience. This makes them increasingly popular in modern SaaS platforms, maternal healthcare apps, cosmetic branding, and minimalist portfolio websites where the goal is to reduce cognitive load and create a serene user journey.</p>
            <h3>Accessibility Challenges with Pastel Schemes</h3>
            <p>While aesthetically beautiful, pastel color combinations present unique challenges for UI strict accessibility (WCAG). Because they lack deep contrast, using pastel text on a white background is almost always an accessibility failure. The most effective way to utilize pastels in web design is as background colors for large sections or cards, paired with deep, highly contrasting text (like #1A1A1A or a dark navy). Alternatively, pastels make excellent secondary accent colors in illustrations and data visualizations where strict textual contrast is less critical.</p>
            <p>Dive into our hand-picked collection of pastel palettes. These low-saturation, high-value colors are guaranteed to bring a fresh, spring-like feel to your designs. Export them instantly to SCSS, JSON, or Tailwind CSS formats.</p>
        `
    },
    {
        slug: 'dark',
        title: 'Dark Mode Color Palettes',
        description: 'Deep, rich, and accessible dark color schemes optimized for dark mode UI and night-vision interfaces.',
        seoContent: `
            <h3>Mastering Dark Mode Color Palettes</h3>
            <p>A true dark mode color palette is more than just inverting black and white. It requires a sophisticated understanding of depth, elevation, and eye fatigue. The best dark themes avoid pure black (#000000) for backgrounds, opting instead for deep grays, rich navies, or dark slates (like #121212 or #0F172A). This subtle shift reduces eye strain in low-light environments and allows designers to use pure black to create "sunken" elements and lighter grays to show "elevated" modal windows.</p>
            <h3>Choosing the Right Accents for Dark UI</h3>
            <p>Once your dark geometric foundation is set, selecting the right accent colors is crucial. Highly saturated colors can visually "vibrate" against dark backgrounds. To fix this, successful dark mode color schemes typically desaturate their primary brand colors slightly, creating pastel-like or muted neon variations that pop beautifully without causing visual artifacting. This ensures your primary call-to-action buttons are both highly visible and comfortable to view.</p>
            <p>Browse our extensive database of dark UI color combinations. Whether you are building a developer tool, a high-end fashion portfolio, or a media streaming application, these structured dark palettes will ensure your interface looks incredibly premium while passing all WCAG contrast audits.</p>
        `
    },
    {
        slug: 'red',
        title: 'Best Red Color Palettes & 100+ Shades of Red',
        description: 'Explore the definitive collection of red color palettes, including deep burgundy, bright crimson, and scarlet shades.',
        seoContent: `
            <h3>The Power of Red Color Palettes in Branding</h3>
            <p>Red is the most powerful and visible color in the human spectrum, often associated with passion, urgency, and energy. In UI design, red color palettes are primarily used for critical call-to-action buttons and error states where you need to draw immediate user focus. However, when used as a primary branding color, red can evoke feelings of excitement and strength, as seen in iconic brands like Coca-Cola and Netflix.</p>
            <h3>Exploring 100+ Shades of Red</h3>
            <p>Our database features over 100 distinct shades of red, from the soft tones of coral and pink-red to the authoritative deep hues of maroon and brick. To use red effectively, balance it with neutral tones like soft grays or off-whites. If you are building a dark mode UI, vibrant reds like #FF0000 should be avoided for large surfaces to prevent eye strain; instead, use muted or deeper variations of the hue.</p>
            <p>Browse our curated lists of red palettes below. Whether you need a high-contrast scheme for a sports app or a sophisticated luxury palette for a jewelry store, these hex codes are ready for your next project.</p>
        `
    },
    {
        slug: 'yellow-green',
        title: 'Yellow Green Color Palettes & Chartreuse Schemes',
        description: 'Vibrant yellow-green color combinations for fresh, energetic, and natural design aesthetics.',
        seoContent: `
            <p>Yellow-Green, also known as Chartreuse, is the perfect balance between the warmth of yellow and the refreshing nature of green. In web design, yellow-green palettes are often used to signify growth, health, and modernity. They provide high visibility and are excellent for call-to-action elements that need to pop against darker backgrounds. Explore our curated selection of yellow-green schemes for your next organic or tech-focused project.</p>
            <h3>When to use Yellow-Green in UI</h3>
            <p>Because yellow-green is extremely bright, it has high "vibrancy" and can be difficult to pair. It works best as an accent color against dark navies or charcoal grays, where it creates a modern, high-tech glow. In natural branding, pairing yellow-green with deep forest greens and earth tones creates a "biophilic" feel that connects users to the environment. Our collection includes everything from muted olives to neon lime-greens, perfect for any fresh branding project.</p>
        `
    },
    {
        slug: 'retro',
        title: 'Retro Color Palettes',
        description: 'Explore curated retro color schemes inspired by the 70s, 80s, and 90s. Perfect for nostalgic branding and UI.',
        seoContent: `
            <h3>Creating with Retro Color Schemes</h3>
            <p>Retro color palettes are a staple in modern graphic design, offering a unique blend of nostalgia and style. From the earthy tones of the 1970s—think mustard yellow, avocado green, and burnt orange—to the vibrant, neon-soaked aesthetics of the 80s, retro colors help brands establish a distinct personality. Our collection features thousands of retro hex codes that are perfect for creating vintage-inspired websites and analog-feeling digital products.</p>
            <h3>Why Retro is Trending in 2026</h3>
            <p>The "New Retro" movement combines classic mid-century modern colors with sleek, high-contrast digital layouts. This creates a "premium-vintage" feel that appeals to audiences looking for authenticity in a high-tech world. Use these palettes to create high-conversion landing pages that feel both familiar and cutting-edge.</p>
        `
    },
    {
        slug: 'nature',
        title: 'Nature Color Palettes & Earth Tones',
        description: 'Soothing nature-inspired color schemes, featuring forest greens, ocean blues, and organic earth tones.',
        seoContent: `
            <h3>Bringing the Outdoors In with Nature Palettes</h3>
            <p>Nature color palettes are designed to evoke the tranquility and balance of the natural world. Utilizing biophilic design principles, these schemes prioritize colors found in landscapes—deep forest greens, sky blues, sandy beiges, and clay reds. These palettes are ideal for wellness apps, organic food branding, and sustainable architectural design projects.</p>
            <h3>Using Earth Tones for Accessible UI</h3>
            <p>Earth tones provide a naturally high level of readability when paired correctly. For example, deep sage green text on a light cream background offers excellent visual comfort for long-form reading. Our nature-inspired collections are pre-vetted for digital accessibility, ensuring your organic design is inclusive for all users.</p>
        `
    },
    {
        slug: 'summer',
        title: 'Summer Color Palettes & Tropical Schemes',
        description: 'Bright, vibrant, and energetic summer color palettes for seasonal branding and marketing.',
        seoContent: `
            <p>Summer color palettes are all about energy, warmth, and sunshine. Featuring bright yellows, turquoise blues, and coral pinks, these schemes are perfect for seasonal marketing campaigns, travel websites, and lifestyle brands. Discover the best tropical and beach-inspired color combinations for your next summer project.</p>
        `
    },
    {
        slug: 'wedding',
        title: 'Wedding Color Palettes & Elegant Schemes',
        description: 'Discover beautiful wedding color combinations, from classic white and gold to modern bohemian palettes.',
        seoContent: `
            <p>Choosing the perfect wedding color palette is a critical step in event planning and branding. Our collection features sophisticated schemes including champagne gold, blush pink, sage green, and midnight blue. These elegant color combinations are curated to provide a cohesive, premium feel across invitations, decor, and digital guestbooks.</p>
        `
    },
    {
        slug: 'gold',
        title: 'Gold Color Palettes & Metallic Schemes',
        description: 'Explore the best gold color combinations for luxury branding and high-end graphic design.',
        seoContent: `
            <p>Gold color palettes represent the pinnacle of luxury, wealth, and prestige. When used in digital design, gold is often paired with deep blacks, navies, or creams to create a high-contrast, premium aesthetic. Our database includes technical hex codes for various types of gold—from bright yellow gold to muted champagne and metallic bronze.</p>
        `
    },
    {
        slug: 'red-orange',
        title: 'Red Orange Color Palettes',
        description: 'Explore 100+ Red Orange color palettes. Discover hex codes, meanings, and combinations for this vibrant and energetic hue.',
        seoContent: `
            <p>Red-Orange is a high-energy, high-impact color that sits at the intersection of passion (red) and excitement (orange). This vibrant hue, often called Cinnabar or Vermilion, is used in branding to convey power, warmth, and urgency. In this collection, you will find palettes ranging from sunset-inspired gradients to bold, high-contrast combinations. Our red-orange palettes are scientifically balanced to ensure they remain accessible and visually striking in any digital environment.</p>
        `
    }
];

// Fallback generator for generic categories not in the DB
export function generateGenericSeoContent(category: string): SeoCategory {
    const formatted = category.charAt(0).toUpperCase() + category.slice(1);
    return {
        slug: category.toLowerCase(),
        title: `Best ${formatted} Color Palettes`,
        description: `Browse thousands of curated, beautiful ${category} color palettes for UI design, branding, and illustration.`,
        seoContent: `
            <h3>Exploring ${formatted} Color Palettes for Design</h3>
            <p>When incorporating a ${category} color scheme into your next project, you unlock a specific psychological response and aesthetic tone. The right color combination can drastically alter how users perceive a brand, interact with a user interface, or feel about an illustration. Designers globally rely on structured ${category} palettes to establish visual hierarchy, maintain consistency across design systems, and ensure accessibility.</p>
            <h3>Applying ${formatted} Shades in UI/UX</h3>
            <p>To effectively utilize these ${category} color variations, always establish a dominant base color first. Then, select complementary accent colors for your call-to-action buttons, active navigation states, and error messages. Remember to utilize the 60-30-10 rule: 60% of the UI should be your primary (often neutral) color, 30% your secondary color, and 10% reserved for striking accents. This methodology ensures your ${category} palettes remain balanced and visually appealing.</p>
            <p>Scroll through our dynamically generated list of ${category} palettes below. Every hex code has been mathmatically extracted to ensure maximum harmony. Click on any color to copy the code instantly, or export the entire palette to Tailwind, CSS, SCSS, or even directly embed it as an HTML/Markdown backlink for your project documentation.</p>
        `
    };
}
