export interface TheoryPage {
    slug: string;
    title: string;
    description: string;
    content: string;
}

export const colorTheoryDb: TheoryPage[] = [
    {
        slug: 'isaac-newton-color-wheel',
        title: "Isaac Newton's Color Wheel & The Science of Light",
        description: 'Learn how Sir Isaac Newton discovered the color spectrum and created the first color wheel in 1666.',
        content: `
            <section>
                <h3>The 1666 Revolution: How Newton Discovered the Spectrum</h3>
                <p>Before 1666, it was commonly believed that color was a mixture of light and darkness, and that prisms actually "colored" the light. Sir Isaac Newton proved this wrong by performing his famous "crucial experiment." By passing a beam of sunlight through a glass prism, he observed the light splintering into a rainbow—a phenomenon known as dispersion. He identified seven distinct colors: red, orange, yellow, green, blue, indigo, and violet (ROYGBIV).</p>
                <p>Newton's most profound discovery was that white light is not entity of its own, but rather a combination of all visible colors. He further proved this by using a second prism to recombine the spectrum back into single beam of white light.</p>
            </section>
            <section>
                <h3>The First Color Wheel</h3>
                <p>To visualize the relationship between these spectrum colors, Newton bent the linear gradient of the spectrum into a circle. This created the world's first color wheel. By arranging the colors in a circle, he identified that certain colors were opposites (complementary) and laid the scientific groundwork for modern color harmony. His wheel wasn't just an artistic tool; it was a physical representation of how the primary colors of light interact.</p>
            </section>
            <section>
                <h3>Impact on Modern Design</h3>
                <p>Today, every designer utilizes a variation of Newton's original wheel. Whether you are choosing a triadic palette for a SaaS landing page or an analogous scheme for a minimalist interior, you are relying on the physics Newton mapped out in his laboratory over 350 years ago.</p>
            </section>
        `
    },
    {
        slug: 'primary-secondary-tertiary-colors',
        title: 'Primary, Secondary, and Tertiary Colors Explained',
        description: 'Understand the building blocks of color theory: how to mix primary hues to create secondary and tertiary colors.',
        content: `
            <section>
                <h3>What are Primary Colors?</h3>
                <p>Primary colors are the foundational building blocks of all other colors. In the traditional RYB (Red, Yellow, Blue) model used by artists, primary colors cannot be created by mixing any other colors. They are the "parents" of the color wheel. In digital design, we often refer to RGB (Red, Green, Blue) as the primary colors of light, while CMYK (Cyan, Magenta, Yellow, Key/Black) are the primary colors of print.</p>
            </section>
            <section>
                <h3>Creating Secondary Colors</h3>
                <p>When you mix two primary colors in equal amounts, you create a Secondary color. 
                    <ul>
                        <li><strong>Red + Yellow = Orange</strong></li>
                        <li><strong>Yellow + Blue = Green</strong></li>
                        <li><strong>Blue + Red = Purple (Violet)</strong></li>
                    </ul>
                </p>
            </section>
            <section>
                <h3>The Nuance of Tertiary Colors</h3>
                <p>Tertiary colors (also called intermediate colors) are created by mixing a primary color with its neighboring secondary color. This creates more complex and sophisticated vibrant hues like Red-Orange, Yellow-Green (Chartreuse), and Blue-Violet. These colors are essential for creating depth and realistic shading in illustrations and UI design.</p>
            </section>
        `
    },
    {
        slug: 'tertiary-colors-explained',
        title: 'Tertiary Colors: Definition, Examples & Master List',
        description: 'Explore the fascinating world of tertiary colors, created by mixing primary and secondary hues. Learn how to use them in design.',
        content: `
            <section>
                <h3>What Exactly Are Tertiary Colors?</h3>
                <p>Tertiary colors (sometimes called intermediate colors) are the third level of the color hierarchy. They are created by mixing a <strong>Primary color</strong> with a neighboring <strong>Secondary color</strong> in equal parts. This process creates a set of six sophisticated and nuanced hues that sit between the primary and secondary colors on the traditional color wheel.</p>
            </section>
            <section>
                <h3>The Six Traditional Tertiary Colors</h3>
                <ul>
                    <li><strong>Red-Orange (Cinnabar):</strong> A vibrant, fiery hue that bridges the intensity of red and the warmth of orange.</li>
                    <li><strong>Yellow-Orange (Amber):</strong> A rich, golden color often associated with sunset and luxury.</li>
                    <li><strong>Yellow-Green (Chartreuse):</strong> A high-visibility, energetic color that symbolizes growth and vitality.</li>
                    <li><strong>Blue-Green (Teal/Aquamarine):</strong> A calming, sophisticated cooling color that sits between the sky and the sea.</li>
                    <li><strong>Blue-Violet (Indigo/Violet):</strong> A deep, mysterious shade that combines the depth of blue with the energy of purple.</li>
                    <li><strong>Red-Violet (Magenta/Periwinkle):</strong> A playful yet powerful transition between the two spectrum ends.</li>
                </ul>
            </section>
            <section>
                <h3>Why Tertiary Colors Matter in UI Design</h3>
                <p>While primary and secondary colors are great for bold branding, tertiary colors are the secret to sophisticated UI. They provide the "in-between" shades necessary for subtle gradients, harmonious secondary buttons, and complex illustrations. Using tertiary colors makes a design feel expertly crafted rather than strictly basic.</p>
            </section>
        `
    },
    {
        slug: 'primary-colors-ryb-rgb-cmyk',
        title: 'Which Colors Are Primary? The RYB vs RGB vs CMYK Debate',
        description: 'Understand the three primary color models: why artists use RYB, digital designers use RGB, and printers use CMYK.',
        content: `
            <section>
                <h3>The "Primary" Conflict: Light vs Pigment</h3>
                <p>One of the most common questions in color theory is "What are the three primary colors?". The answer depends entirely on what you are creating. If you are painting on a canvas, the answer is different than if you are designing a website or printing a brochure.</p>
            </section>
            <section>
                <h3>1. The RYB Model (Artistic/Traditional)</h3>
                <p><strong>Primary Colors: Red, Yellow, Blue.</strong> This is the model taught in elementary schools and used by traditional painters. It is based on the behavior of physical pigments. By mixing these three, artists can create a wide range of colors, though it has scientific limitations in brightness compared to light-based models.</p>
            </section>
            <section>
                <h3>2. The RGB Model (Digital/Additive)</h3>
                <p><strong>Primary Colors: Red, Green, Blue.</strong> This is the "Additive" model used for computer screens, televisions, and smartphones. Since screens emit light, they blend colors by adding wavelengths together. When you mix 100% of Red, Green, and Blue light, you get White light.</p>
            </section>
            <section>
                <h3>3. The CMYK Model (Print/Subtractive)</h3>
                <p><strong>Primary Colors: Cyan, Magenta, Yellow, Black.</strong> Used in professional printing, this model is "Subtractive." Layers of ink absorb (subtract) light from the white paper. This is why your home printer uses these specific cartridges to produce a full spectrum of photographic color.</p>
            </section>
        `
    },
    {
        slug: 'science-of-light-prism',
        title: "The Science of Color: Newton's Prism Experiment Explained",
        description: "Learn how Sir Isaac Newton split white light into a rainbow in 1666 and changed our understanding of physics forever.",
        content: `
            <section>
                <h3>Splitting the Spectrum: The 1666 Revolution</h3>
                <p>In 1666, a young Isaac Newton darkened his room in Cambridge and allowed a single, thin beam of sunlight to pass through a glass prism. Expecting to see white light on the other side, he instead watched as the beam shattered into <strong>ROYGBIV</strong>: Red, Orange, Yellow, Green, Blue, Indigo, and Violet.</p>
            </section>
            <section>
                <h3>Refutation of the "Darkness" Theory</h3>
                <p>Before Newton, scientists believed that color was a property of the prism itself—that the glass "stained" the white light. Newton proved this was wrong by using a second prism to Recombine the colors back into a single beam of pure white light. This proved that white light is not a single entity, but a composite of all visible colors.</p>
            </section>
            <section>
                <h3>Why Do Rainbows Happen?</h3>
                <p>The same physics Newton observed in his prism happens in the sky. When sunlight hits a spherical raindrop, it refracts (bends) inside the drop, reflects off the back, and refracts again as it exits. Because different wavelengths of light bend at slightly different angles, the white light splits into the circular arc of color we call a rainbow.</p>
            </section>
        `
    }
];
