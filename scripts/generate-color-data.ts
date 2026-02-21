import fs from 'fs';
import path from 'path';

const data = `export interface ColorPsychologyData {
    slug: string;
    name: string;
    hex: string;
    shortDescription: string;
    history: string;
    description: string;
    deepPsychology: {
        title: string;
        description: string;
    }[];
    personalityProfile: {
        intro: string;
        positive: string[];
        negative: string[];
    };
    symbolism: string;
    businessApplications: string;
    marketingAndBranding: string;
    randomFacts: string[];
    detailedShades: {
        name: string;
        hex: string;
        description: string;
    }[];
}

export const colorPsychologyDb: ColorPsychologyData[] = [
    {
        slug: 'red',
        name: 'Red',
        hex: '#EF4444',
        shortDescription: 'The color of passion, power, and urgency.',
        history: 'Red is the first color that humans mastered, fabricated, reproduced, and broke down into different shades. Throughout the Middle Ages, red had religious significance, representing the blood of Christ. In the Renaissance, red drew attention to influential figures. By the 19th century, red became the symbol of new political and social movements.',
        description: 'Red is known to have both physiological and psychological impacts on people. Studies show that its warm and vibrant hue gives us more energy to take action. It elevates heart rates and commands absolute attention.',
        deepPsychology: [
            { title: 'Love', description: 'Red is the universal color of romance, passion, and sexuality. It communicates strong feelings of attraction that energize and elevate the heart rate.' },
            { title: 'Power', description: 'Red provokes potent emotions, giving people a sense of dominance and boosted self-esteem. Famous people walk the red carpet, and red cars imply high status.' },
            { title: 'Confidence', description: 'Wearing red conveys a state of believing in your abilities. Red lipstick or a red tie shows that you are ready to command the room.' },
            { title: 'Aggression', description: 'Red heightens tendencies toward confrontational impulses. It has a deeply evolved psychological relationship with anger, rage, and heated reactions.' },
            { title: 'Appetite', description: 'Red overwhelmingly stimulates hunger. Fast food chains leverage this impact to encourage rapid consumption and turnover.' },
            { title: 'Impulse Control', description: 'The stimulating nature of red is tied to impulsiveness. It motivates rapid, reactive behavior rather than cautious consideration.' }
        ],
        personalityProfile: {
            intro: 'People who favor red are generally observed to be extroverts, outgoing, and enjoy living life to the fullest. However, they can also be highly competitive.',
            positive: ['Courageous', 'Passionate', 'Energetic', 'Driven', 'Confident'],
            negative: ['Aggressive', 'Impulsive', 'Dominating', 'Quick-tempered', 'Demanding']
        },
        symbolism: 'In Western cultures, red means danger, passion, or action. In Eastern cultures (especially China), red represents luck, joy, and prosperity. In South Africa, it is the color of mourning.',
        businessApplications: 'Red is used to create urgency (clearance sales) and stimulate appetite (restaurants). It signals dynamic, high-energy brands.',
        marketingAndBranding: 'Use red to draw immediate attention to calls-to-action (CTAs). Avoid overusing it, as it can cause visual strain and imply danger or errors if applied to incorrect elements.',
        randomFacts: [
            'Red is the first color babies can see, typically around 2 weeks old.',
            'Seeing the color red can actually make your heart beat faster.',
            'Bulls are actually colorblind; the movement of the cape angers them, not the red color.'
        ],
        detailedShades: [
            { name: 'Crimson', hex: '#DC143C', description: 'A strong, red color inclining to purple. It represents determination.' },
            { name: 'Maroon', hex: '#800000', description: 'A dark brownish-red. It symbolizes controlled power and autumnal warmth.' },
            { name: 'Scarlet', hex: '#FF2400', description: 'A brilliant red with a tinge of orange. Highly aggressive and dynamic.' },
            { name: 'Ruby', hex: '#E0115F', description: 'A deep, vibrant red honoring the gemstone. Associated with wealth and majesty.' }
        ]
    },
    {
        slug: 'blue',
        name: 'Blue',
        hex: '#3B82F6',
        shortDescription: 'The color of trust, peace, and corporate logic.',
        history: 'Historically, blue pigment was derived from the semi-precious lapis lazuli stone, making it incredibly expensive and reserved only for depicting royalty or the Virgin Mary during the Renaissance.',
        description: 'Blue is the most universally favored color in the world. It fundamentally calms the mind, lowers the heart rate, and inspires feelings of serene security and structured logic.',
        deepPsychology: [
            { title: 'Trust', description: 'Blue represents reliability and loyalty. This is why financial institutions heavily rely on blue branding to assure customers their money is safe.' },
            { title: 'Productivity', description: 'Unlike red, blue does not distract. It enhances concentration and is often used in corporate offices to boost logical reasoning and output.' },
            { title: 'Sadness', description: 'The term "feeling blue" stems from its cold wavelength. Excessive blue can evoke feelings of melancholy, isolation, and detachment.' },
            { title: 'Peace', description: 'Reminiscent of the ocean and the sky, blue triggers the parasympathetic nervous system, achieving a tranquil state.' },
            { title: 'Appetite Suppressant', description: 'Blue rarely occurs naturally in food. Therefore, it acts as a very effective appetite suppressant, as our brains associate it with spoilage.' }
        ],
        personalityProfile: {
            intro: 'Those who prefer blue are often introspective, analytical, and reliable. They value stability and deep, meaningful relationships over fleeting interactions.',
            positive: ['Loyal', 'Serene', 'Intelligent', 'Trustworthy', 'Rational'],
            negative: ['Cold', 'Unforgiving', 'Predictable', 'Detached', 'Stubborn']
        },
        symbolism: 'In the West, blue means corporate trust and sadness. In Eastern cultures, it symbolizes immortality and spiritual elevation. In the Middle East, blue is protective and wards off evil.',
        businessApplications: 'Blue is overwhelmingly preferred for corporate identities, tech firms, and healthcare to project security, cleanliness, and non-threatening innovation.',
        marketingAndBranding: 'Ideal for social media networks (Facebook, LinkedIn, Twitter) as it encourages prolonged, calm interaction. Use to establish trust but avoid if you are a food brand.',
        randomFacts: [
            'Mosquitoes are drawn to the color blue twice as much as any other color.',
            'Weightlifters can lift heavier weights in blue environments.',
            'Blue is the most common favorite color globally, regardless of age or gender.'
        ],
        detailedShades: [
            { name: 'Navy', hex: '#000080', description: 'A deeply dark shade of blue conveying authority, marine logic, and strict order.' },
            { name: 'Cyan', hex: '#00FFFF', description: 'A bright, lively blue-green mixed with light. It feels futuristic and electrical.' },
            { name: 'Cerulean', hex: '#007BA7', description: 'A mid-blue that perfectly mirrors a clear daytime sky, promoting immense calm.' },
            { name: 'Azure', hex: '#007FFF', description: 'The classic web blue. Bright, responsive, and deeply digital.' }
        ]
    },
    {
        slug: 'green',
        name: 'Green',
        hex: '#10B981',
        shortDescription: 'The color of nature, growth, and equilibrium.',
        history: 'Green pigments were historically very toxic, often formulated using arsenic. It has always represented fertility and the natural world, but modern synthetic greens finally allowed its safe use in fashion.',
        description: 'Green is the easiest color on the human eye to process. It sits precisely in the middle of the visual spectrum, representing a psychological state of absolute balance, restoration, and life.',
        deepPsychology: [
            { title: 'Growth', description: 'Green visually mimics the spring season, tricking our brains into feeling a sense of renewal, prosperity, and biological progression.' },
            { title: 'Wealth', description: 'Tied heavily to the American dollar, dark green is a universal symbol for finance, banking, and physical abundance.' },
            { title: 'Harmony', description: 'Because it takes no physiological effort to perceive green, it creates an environment of calm deliberation and zero stress.' },
            { title: 'Envy', description: 'The term "green with envy" is deeply rooted in Shakespearean lore, linking the color to jealousy, sickness, and decay.' }
        ],
        personalityProfile: {
            intro: 'Green lovers are typically peacemakers. They possess a deep need to belong and thrive when surrounded by nature or tight-knit communities.',
            positive: ['Diplomatic', 'Nurturing', 'Balanced', 'Adaptable', 'Prosperous'],
            negative: ['Envious', 'Over-cautious', 'Materialistic', 'Unambitious', 'Possessive']
        },
        symbolism: 'In Islam, green is a sacred color. In Ireland, it represents luck. Globally, it universally symbolizes eco-friendliness and "GO" in traffic systems.',
        businessApplications: 'Green is the absolute staple for organic, eco-friendly, and agricultural brands. It is also used in financial contexts for wealth management.',
        marketingAndBranding: 'Use green to portray an ethical, sustainable, and calming brand. It is an excellent color for positive confirmations (success messages, save buttons).',
        randomFacts: [
            'Night vision goggles use green phosphor because the human eye can differentiate more shades of green than any other color.',
            'Actors wait in the "green room" before going on stage because the color relaxes their nerves.',
            'Suicides dropped by 34% when a London bridge was painted green.'
        ],
        detailedShades: [
            { name: 'Olive', hex: '#808000', description: 'A muted, earthy green associated with peace (olive branch) and military camouflage.' },
            { name: 'Emerald', hex: '#50C878', description: 'A brilliant, shimmering green symbolizing extravagant wealth and crystalline clarity.' },
            { name: 'Mint', hex: '#98FF98', description: 'A light, cooling green that implies freshness, youth, and hygienic cleanliness.' },
            { name: 'Forest', hex: '#228B22', description: 'A deep, heavy green that grounds the viewer in stability and dense natural environments.' }
        ]
    },
    {
        slug: 'yellow',
        name: 'Yellow',
        hex: '#EAB308',
        shortDescription: 'The color of joy, intellect, and intense caution.',
        history: 'Ochre, a yellow earth pigment, was one of the first colors used in human art. Culturally, it has swung from representing divine gold and the sun to betrayals (Judas was often painted in yellow).',
        description: 'Yellow is the most luminous color in the spectrum. It psychologically triggers logical processing and generates overwhelming feelings of happiness, but can cause intense visual strain if overused.',
        deepPsychology: [
            { title: 'Optimism', description: 'Yellow directly mimics sunlight, flooding the brain with serotonin and establishing an undeniable atmosphere of pure optimism.' },
            { title: 'Intellect', description: 'Yellow stimulates the left, logical side of the brain. It is highly associated with mental agility and academic pursuit.' },
            { title: 'Anxiety', description: 'Because it reflects so much light, yellow can overstimulate the optical nerve. Too much yellow causes immediate anxiety and agitation.' },
            { title: 'Caution', description: 'When paired with black, yellow represents the highest natural alert (like wasps or poisonous frogs), making it the universal color for warnings.' }
        ],
        personalityProfile: {
            intro: 'People who love yellow are typically cheerful, highly analytical perfectionists. They rely heavily on logic but maintain a bubbly exterior.',
            positive: ['Optimistic', 'Logical', 'Cheerful', 'Confident', 'Original'],
            negative: ['Impulsive', 'Critical', 'Complex', 'Pessimistic', 'Vindictive']
        },
        symbolism: 'In Egypt, yellow was the color of mourning. In Japan, it represents courage and nobility. In Western societies, it symbolises happiness and cowardice.',
        businessApplications: 'Used heavily in children’s products, leisure sectors, and to grab attention for window displays. It implies speed and affordability.',
        marketingAndBranding: 'Use yellow to force the viewer to look. It is excellent for "Free Shipping" tags or warnings. Do not use yellow for luxury or high-end branding, as it looks cheap.',
        randomFacts: [
            'Yellow makes people lose their tempers more often, and babies cry more in yellow rooms.',
            'Post-it notes were originally yellow simply because that was the scrap paper the lab had on hand.',
            'It is the most highly visible color to the human eye from a distance.'
        ],
        detailedShades: [
            { name: 'Gold', hex: '#FFD700', description: 'A metallic yellow that wholly removes the "cheapness" of yellow, replacing it with timeless wealth.' },
            { name: 'Mustard', hex: '#FFDB58', description: 'An earthy, grounded yellow that feels vintage, retro, and culinary.' },
            { name: 'Lemon', hex: '#FFF700', description: 'A piercingly bright yellow that conveys sourness, intense freshness, and absolute energy.' }
        ]
    },
    {
        slug: 'orange',
        name: 'Orange',
        hex: '#F97316',
        shortDescription: 'The color of adventure, youth, and immediate affordability.',
        history: 'Before the late 15th century, the color orange existed in Europe, but without the name; it was simply called yellow-red. Portuguese merchants brought the first orange trees to Europe from Asia, and the color was named after the fruit.',
        description: 'Positioned right between the physical energy of red and the logical joy of yellow, orange is the color of pure, unadulterated extroversion. It is highly social, encouraging conversation and physical activity.',
        deepPsychology: [
            { title: 'Enthusiasm', description: 'Orange is fundamentally encouraging. It possesses the urgency of red but diluted to a friendlier, highly approachable level.' },
            { title: 'Adventure', description: 'Orange encourages individuals to take risks, try new physical activities, and step outside their comfort zones.' },
            { title: 'Affordability', description: 'Unlike deep purples or blacks, orange explicitly communicates "budget-friendly." It strips away pretense.' },
            { title: 'Superficiality', description: 'The absolute lack of seriousness in orange can make it come across as cheap, insincere, or entirely lacking intellectual depth.' }
        ],
        personalityProfile: {
            intro: 'An orange personality is the life of the party. They are warm, highly physical, and thrive entirely on social approval and external stimuli.',
            positive: ['Adventurous', 'Enthusiastic', 'Sociable', 'Flamboyant', 'Tolerant'],
            negative: ['Superficial', 'Dependent', 'Overbearing', 'Unpredictable', 'Fickle']
        },
        symbolism: 'In Hinduism, orange (saffron) is highly sacred. In the West, it is heavily associated with Halloween, autumn, and physical safety (construction cones).',
        businessApplications: 'Orange is the titan of the e-commerce world. It implies inexpensive goods (Home Depot, Amazon) and is used intensely in the sports and fitness industry to promote physical motion.',
        marketingAndBranding: 'Orange is the ultimate "Subscribe" or "Buy Now" button color. It generates high conversion rates because it commands attention without the aggressive threat of red.',
        randomFacts: [
            'There is no word in the English language that rhymes perfectly with orange.',
            'Orange was originally named geoluhread (yellow-red) in Old English.',
            'Eating too many carrots or oranges can actually turn your skin orange, a condition called Carotenemia.'
        ],
        detailedShades: [
            { name: 'Peach', hex: '#FFE5B4', description: 'A highly diluted orange that is soft, nurturing, and intimately conversational.' },
            { name: 'Rust', hex: '#B7410E', description: 'A deep, oxidized orange communicating vintage decay, autumn warmth, and historical grounding.' },
            { name: 'Tangerine', hex: '#F28500', description: 'A highly saturated, juicy orange that screams physical vitality and vitamin-rich energy.' }
        ]
    },
    {
        slug: 'purple',
        name: 'Purple',
        hex: '#8B5CF6',
        shortDescription: 'The color of royal mystery, luxury, and spiritual depth.',
        history: 'Tyrian purple dye was extracted from a rare sea snail secreted mucus in antiquity. It took thousands of snails to dye a single garment, making purple explicitly illegal for anyone but emperors and kings to wear.',
        description: 'Purple marries the fierce energy of Red with the serene logic of Blue. This delicate physical impossibility makes purple the universal symbol of magic, luxury, and complex contemplation.',
        deepPsychology: [
            { title: 'Royalty', description: 'Because of its historical exclusivity, our brains are biologically hardwired to view deep purple as a symbol of immense wealth and untouchable status.' },
            { title: 'Spirituality', description: 'Purple lifts the mind out of the physical world. It is heavily used in meditation, psychic phenomena, and existential contemplation.' },
            { title: 'Imagination', description: 'Purple encourages the brain to solve problems creatively rather than logically, breaking established rules of thought.' },
            { title: 'Arrogance', description: 'The intense association with royalty can make excess purple feel incredibly pompous, aloof, or completely disconnected from reality.' }
        ],
        personalityProfile: {
            intro: 'Those who favor purple are often highly individualistic, slightly eccentric, and possess a deeply ingrained need to be unique.',
            positive: ['Creative', 'Charismatic', 'Intuitive', 'Visionary', 'Compassionate'],
            negative: ['Arrogant', 'Impractical', 'Introverted', 'Cynical', 'Elitist']
        },
        symbolism: 'Globally, it universally translates to luxury. In the military, the Purple Heart represents vast courage. In Thailand, it is the color of mourning for widows.',
        businessApplications: 'Used for extremely high-end, premium services or products targeting an exclusive demographic. Also highly popular in the creative and occult industries.',
        marketingAndBranding: 'Use deep purples to signify premium software tiers (Pro/Enterprise). Use lighter lavenders to target mystical, feminine, or holistic health demographics.',
        randomFacts: [
            'Purple is the hardest color for the human eye to distinguish.',
            'Carrots used to be purple before they were selectively bred by the Dutch to be orange.',
            "There is no 'purple' wavelength of light; purple is entirely manufactured by the human brain when it sees blue and red simultaneously."
        ],
        detailedShades: [
            { name: 'Lavender', hex: '#E6E6FA', description: 'A pale purple that drops the arrogance of deep purple, creating a delicate, nostalgic, and romantic aura.' },
            { name: 'Plum', hex: '#8E4585', description: 'An honorable, antique purple that feels deeply rich, cultured, and traditional.' },
            { name: 'Amethyst', hex: '#9966CC', description: 'A crystalline purple that leans heavily into the mystical and spiritual realms.' }
        ]
    },
    {
        slug: 'pink',
        name: 'Pink',
        hex: '#EC4899',
        shortDescription: 'The color of unconditional love, femininity, and soothing warmth.',
        history: 'During the 18th century, pink was actually considered a masculine color, essentially a "faded red" for boys. It was only post-WWII marketing that violently shifted pink to be exclusively associated with femininity.',
        description: 'Pink is essentially red stripped of all its aggression. It represents the very core of compassion, nurturing, and unconditional love without the demand for physical passion.',
        deepPsychology: [
            { title: 'Femininity', description: 'In modern Western culture, pink is inextricably linked to traditional female gender roles, sweetness, and the feminine divine.' },
            { title: 'Tranquility', description: 'Specific shades of pink have a proven physiological effect that drains physical energy from the body, calming aggressive people down.' },
            { title: 'Compassion', description: 'Pink replaces the lust of red with a maternal, gentle nurturing instinct. It signifies empathy and deep understanding.' },
            { title: 'Immaturity', description: 'Because of its heavy association with baby girls and toys, pink can be perceived as childish, weak, or lacking in serious intellect.' }
        ],
        personalityProfile: {
            intro: 'A pink personality is gentle, loving, and deeply empathetic. They require immense affection and despise physical conflict.',
            positive: ['Compassionate', 'Warm', 'Romantic', 'Hopeful', 'Optimistic'],
            negative: ['Naive', 'Vulnerable', 'Over-emotional', 'Immature', 'Timid']
        },
        symbolism: 'Universally represents Breast Cancer Awareness. In Japan, pink represents the fleeting beauty of life due to the cherry blossom.',
        businessApplications: 'Pink dominates industries targeting young females, romance, baked goods, and cosmetics. However, "Millennial Pink" recently breached gender barriers, being used in edgy modern tech startups.',
        marketingAndBranding: 'Hot pink can be used exactly like red to grab attention with a rebellious, punk-rock twist. Soft pinks reduce the bounce rate of aggressive sites by calming the viewer.',
        randomFacts: [
            '"Baker-Miller Pink" is painted in prison holding cells because studies showed it physically saps the strength from violent inmates within 15 minutes.',
            'Flamingos are entirely white when born; their pink color comes entirely from the shrimp they eat.',
            'Pink is technically a tint, not a true color, as it does not appear on the electromagnetic spectrum.'
        ],
        detailedShades: [
            { name: 'Fuchsia', hex: '#FF00FF', description: 'A violently bright pink-purple that screams rebellion, intense energy, and synthetic modernity.' },
            { name: 'Rose', hex: '#FF007F', description: 'A deep, romantic pink that bridges the gap between the maturity of red and the sweetness of pink.' },
            { name: 'Salmon', hex: '#FA8072', description: 'A warm, orangey-pink that feels organic, culinary, and highly approachable.' }
        ]
    },
    {
        slug: 'brown',
        name: 'Brown',
        hex: '#8B4513',
        shortDescription: 'The color of the earth, absolute stability, and utility.',
        history: 'Historically, brown was the color of extreme poverty and the working class, as undyed, unbleached wool was brown. It was fiercely rejected by the aristocracy.',
        description: 'Brown is the ultimate grounded color. It entirely lacks the pretense of the rest of the spectrum, providing an undeniable psychological sensation of dirt, wood, history, and absolute dependability.',
        deepPsychology: [
            { title: 'Reliability', description: 'Because it mirrors the literal ground we walk on, brown implies that something is structurally sound, honest, and not going to disappear.' },
            { title: 'Comfort', description: 'Brown wraps around the viewer like a blanket. It reminds us of coffee, chocolate, campfires, and deep organic warmth.' },
            { title: 'Simplicity', description: 'Brown strips away arrogance. It is fundamentally utilitarian—it does the job without needing to show off.' },
            { title: 'Boredom', description: 'Without a contrasting hue, pure brown can be perceived as intensely dull, heavy, and devoid of any intellectual or physical progression.' }
        ],
        personalityProfile: {
            intro: 'Brown personalities are the bedrock of society. They are frugal, incredibly dependable, and fiercely loyal to their families and routines.',
            positive: ['Reliable', 'Honest', 'Wholesome', 'Supportive', 'Grounded'],
            negative: ['Dull', 'Predictable', 'Stubborn', 'Cheap', 'Inflexible']
        },
        symbolism: 'In feng shui, brown represents wood and deep grounding roots. In the West, it symbolizes agriculture, the outdoors, and the autumn harvest.',
        businessApplications: 'UPS notoriously uses brown to prove they are dependable, rugged, and unconcerned with showing off. Also heavily used in the organic coffee, chocolate, and craft beer industries.',
        marketingAndBranding: 'Brown is exceptionally difficult to use in digital UI as it easily looks like dirt or mistakes. Use only for organic typography or when dealing with highly rustic, artisan products.',
        randomFacts: [
            'Japanese does not have a native word for brown; they use descriptive terms like "tea-color" or "fox-color".',
            'Brown eyes are the most common eye color in the world, making up about 79% of the human population.',
            'Adding brown to a room instantly makes it feel smaller but significantly warmer.'
        ],
        detailedShades: [
            { name: 'Beige', hex: '#F5F5DC', description: 'A pale brown that acts as the ultimate neutral, fading perfectly into the background.' },
            { name: 'Mahogany', hex: '#C04000', description: 'A profoundly rich red-brown that exudes old-world wealth, leather armchairs, and historic luxury.' },
            { name: 'Chocolate', hex: '#7B3F00', description: 'A dense, delicious brown that tricks the brain into tasting sweetness and deep comfort.' }
        ]
    },
    {
        slug: 'black',
        name: 'Black',
        hex: '#000000',
        shortDescription: 'The color of absolute authority, luxury, and the void.',
        history: 'Black was one of the first colors used in art (charcoal). In the 14th century, high-quality black dyes were invented, turning it into the signature color of the wealthy, magistrates, and ultimately, fashion.',
        description: 'Physics defines black as the total absorption of all light. Psychologically, it is the most formidable color, representing the absolute extreme of formality, mystery, intimidation, and untouchable sophistication.',
        deepPsychology: [
            { title: 'Power', description: 'Black demands submission. Judges, priests, and heavy riot gear use black to communicate unquestionable authority and finality.' },
            { title: 'Luxury', description: 'Black strips away all visual noise, leaving only the structural form of an object. This makes products look infinitely more expensive and premium.' },
            { title: 'Mystery', description: 'Black conceals everything. It creates an aura of deeply guarded secrets, rebellion, and the terrifying fear of the unknown dark.' },
            { title: 'Grief', description: 'In almost all Western cultures, black is the literal representation of the end, the void, and death.' }
        ],
        personalityProfile: {
            intro: 'Those who wear black exclusively often seek to protect themselves from the external world. They are independent, strong-willed, and highly disciplined.',
            positive: ['Sophisticated', 'Formal', 'Strong', 'Independent', 'Mysterious'],
            negative: ['Depressing', 'Pessimistic', 'Secretive', 'Intimidating', 'Conservative']
        },
        symbolism: 'In ancient Egypt, black meant life and rebirth (the black soil of the Nile). In modern Western culture, it universally denotes mourning, evil, or high-end fashion.',
        businessApplications: 'Black is deployed fiercely in luxury fashion (Chanel, Prada), high-end technology (Apple Pro tier), and luxury vehicles to justify extreme price points.',
        marketingAndBranding: 'Using a black background (Dark Mode) immediately elevates the perceived value of your UI. It forces imagery and neon colors to pop aggressively.',
        randomFacts: [
            'Vantablack is a manufactured substance that absorbs 99.96% of light, making it the blackest material ever created. It makes 3D objects look like 2D voids.',
            'Musicians in orchestral pits wear black so as not to distract the audience from the performance.',
            'Black implies weight; people asked to lift identical boxes will report the black box feels much heavier than the white box.'
        ],
        detailedShades: [
            { name: 'Ebony', hex: '#555D50', description: 'An incredibly dark olive/black referencing the hardwood, implying intense durability.' },
            { name: 'Onyx', hex: '#353839', description: 'A deeply cold black that feels like highly polished, impenetrable stone.' },
            { name: 'Charcoal', hex: '#36454F', description: 'A softer, grey-leaning black that retains the sophistication of black but removes the heavy, grieving void.' }
        ]
    },
    {
        slug: 'white',
        name: 'White',
        hex: '#FFFFFF',
        shortDescription: 'The color of pure perfection, stark clinicality, and a blank slate.',
        history: 'White has universally been the standard for purity. Culturally, white garments were impossible to keep clean for the working class, so wearing pure white was historically the ultimate flex of extreme wealth and leisure.',
        description: 'White contains every color in the visible spectrum. It is the absolute absence of weight, symbolizing a fresh start, extreme cleanliness, and total transparency.',
        deepPsychology: [
            { title: 'Purity', description: 'White is completely untouched. It is virginal, flawless, and completely devoid of any corruption or mistakes.' },
            { title: 'Clinical Cleanliness', description: 'White visually proves the absence of dirt. This makes it vital for hospitals, doctors, and tech companies portraying sterile perfection.' },
            { title: 'Simplicity', description: 'White represents the ultimate minimalist state. It reduces cognitive load, allowing the brain quiet space to think deeply.' },
            { title: 'Isolation', description: 'Too much stark white creates a blinding, freezing environment. It can feel deeply antisocial, sterile, and emotionally dead.' }
        ],
        personalityProfile: {
            intro: 'A white personality strives for absolute perfection and simplicity. They are incredibly neat, highly organized, and can be severely critical of flaws.',
            positive: ['Optimistic', 'Independent', 'Logical', 'Immaculate', 'Visionary'],
            negative: ['Sterile', 'Fastidious', 'Empty', 'Unfriendly', 'Critical']
        },
        symbolism: 'In the West, white means weddings, angels, and peace (the white flag). In Eastern cultures (like China and India), white is explicitly the color of death, ghosts, and mourning.',
        businessApplications: 'Apple revolutionized tech by moving away from beige to pure white, signaling that their products were friendly, clean, and flawless. Also dominant in healthcare.',
        marketingAndBranding: 'Whitespace (Negative Space) is the single most important element in modern UI design. It gives the user’s eyes a place to rest and guides them to the vital content.',
        randomFacts: [
            'White cars are the statistically safest cars to drive because they are the most visible under all lighting conditions, except snow.',
            'It is impossible to dream in "white noise"; the brain will always try to construct a narrative or image out of it.',
            'White light actually contains all the colors of the rainbow combined together.'
        ],
        detailedShades: [
            { name: 'Ivory', hex: '#FFFFF0', description: 'A slight yellow tint gives white a massive sense of history, antiquity, and organic warmth.' },
            { name: 'Alabaster', hex: '#F2F0E6', description: 'A cool, very pale off-white that feels sculptural, smooth, and highly architectural.' },
            { name: 'Cream', hex: '#FFFDD0', description: 'A butter-tinted white that removes all the clinical sterility of white, making it appetizing and comforting.' }
        ]
    }
];
`;

fs.writeFileSync(path.join(__dirname, '../src/data/colorPsychology.ts'), data);
console.log('Successfully expanded Color Psychology database to 10x Parity!');
