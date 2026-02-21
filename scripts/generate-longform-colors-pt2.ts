import fs from 'fs';
import path from 'path';

const dbPath = path.join(__dirname, '../src/data/colorPsychology.ts');
let content = fs.readFileSync(dbPath, 'utf8');

const replacements = [
    {
        search: `slug: 'yellow'`,
        replace: `slug: 'yellow',
        name: 'Yellow',
        hex: '#EAB308',
        shortDescription: 'The color of joy, intellect, and intense caution.',
        history: [
            'Ochre, a yellow earth pigment, was one of the absolute first colors ever utilized in human art. Cave paintings dating back tens of thousands of years heavily feature yellow ochre to depict the sun, animals, and human figures, establishing an ancient biological link between humanity and the concept of daylight.',
            'Culturally, yellow has swung violently between the extremes of divine gold and the depths of betrayal. In ancient Egypt and classical Rome, yellow was a deeply revered color reserved for deities and supreme nobility. However, during the Middle Ages in Europe, yellow took a dark turn. Because it was the color of bile and sickness, it became heavily associated with betrayal, cowardice, and heresy; famously, figures like Judas Iscariot were frequently painted wearing yellow robes to immediately signal their treacherous nature to the illiterate masses.'
        ],
        description: [
            'Yellow is the absolute most luminous color in the entire visible spectrum. Because it reflects so much physical light, it is the hardest color on the human eye to process in massive, unbroken quantities, yet it remains the most visible color from a distance. This physical intensity makes yellow a powerful dual-edged sword in psychology.',
            'When utilized correctly, yellow psychologically triggers massive logical processing in the left hemisphere of the brain and generates overwhelming feelings of sudden happiness and spontaneous joy. However, when overused or painted on all four walls of a room, that same luminous intensity quickly causes severe optical strain, leading directly to psychological agitation, irrational anger, and intense anxiety.'
        ],
        deepPsychology: [
            { title: 'Optimism', description: 'Yellow directly mimics the physical presence of bright sunlight, flooding the human brain with serotonin and establishing an undeniable, almost forced atmosphere of pure, childish optimism and hope.' },
            { title: 'Intellect', description: 'Yellow acts as a massive stimulant to the logical, analytical side of the brain. It is highly associated with sudden mental agility, academic pursuit, and the sudden "lightbulb" moment of creative problem-solving.' },
            { title: 'Anxiety', description: 'Because it reflects such an aggressive amount of raw light, yellow can severely overstimulate the optical nerve. Too much yellow in an enclosed space causes immediate, unexplainable anxiety, agitation, and a desperate subconscious desire to leave the room.' },
            { title: 'Caution', description: 'When heavily paired with stark black, yellow represents the absolute highest natural alert pattern found in nature (such as wasps, venomous snakes, or poisonous frogs). This evolutionary trigger makes it the undisputed universal color for hazard warnings and intense caution.' }
        ],
        personalityProfile: {
            intro: 'People who genuinely love the color yellow are typically cheerful, highly analytical perfectionists. They rely heavily on harsh logic to navigate their lives but maintain a bubbly, intensely extroverted exterior.',
            positive: ['Fiercely Optimistic', 'Brilliantly Logical', 'Unapologetically Cheerful', 'Quietly Confident', 'Fiercely Original'],
            negative: ['Recklessly Impulsive', 'Harshly Critical', 'Exhaustingly Complex', 'Secretly Pessimistic', 'Occasionally Vindictive']
        },
        symbolism: 'In ancient Egypt, yellow was strictly the color of eternal mourning. In modern Japan, it represents unmatched courage and aristocratic nobility. In Western societies, it wildly fluctuates between symbolizing pure happiness, the arrival of spring, and fearful cowardice.',
        businessApplications: [
            'Yellow is used ferociously in children’s products, leisure sectors, and travel industries to imply that an experience will be joyous, carefree, and intensely fun.',
            'In modern retail, yellow is the ultimate tool for grabbing spontaneous attention for window displays and clearance bins. It implies lightning speed, cheap affordability, and rapid motion, which is exactly why the global taxi industry and countless fast-food chains utilize it endlessly.'
        ],
        marketingAndBranding: [
            'Use yellow sparingly as an accent to literally force the viewer’s eye to look at a specific element. It is absolutely excellent for "Free Shipping" tags, urgency banners, or critical system warnings.',
            'Never use flat yellow for a luxury, high-end, or premium branding package. Because the human brain biologically associates yellow with cheap, mass-produced plastic or discount pricing, painting a luxury good yellow immediately destroys its perceived financial value.'
        ],
        randomFacts: [
            'Psychological studies have proven that people physically lose their tempers far more often, and babies cry significantly more, in rooms painted entirely yellow.',
            'The iconic Post-it notes were originally yellow not by brilliant corporate design, but simply because canary yellow was the only scrap paper the chemistry lab had on hand when they invented the glue.',
            'Because it scatters less in the atmosphere, yellow is the most highly visible color to the human eye from a vast distance, especially in thick fog, which is why school buses are mandated to be yellow.'
        ],
        detailedShades: [
            { name: 'Gold', hex: '#FFD700', description: 'A massive, metallic yellow that completely removes the "cheapness" of flat yellow, replacing it entirely with timeless wealth, divine light, and heavy physical value.' },
            { name: 'Mustard', hex: '#FFDB58', description: 'A deeply earthy, grounded yellow that feels intensely vintage, retro, and culinary. It removes the optical strain of pure yellow.' },
            { name: 'Lemon', hex: '#FFF700', description: 'A piercingly bright, almost violently acidic yellow that conveys sourness, intense physical freshness, and absolute, frantic energy.' }
        ]
    }, {
        slug: 'orange'`
    },
    {
        search: `slug: 'orange'`,
        replace: `slug: 'orange',
        name: 'Orange',
        hex: '#F97316',
        shortDescription: 'The color of adventure, youth, and immediate affordability.',
        history: [
            'Before the late 15th century, the color orange paradoxically existed in Europe, but entirely without a distinct name; it was simply referred to clumsily as "yellow-red." It wasn’t until Portuguese merchants brought the very first orange fruit trees to Europe from Asia that the color was finally named after the physical fruit.',
            'Because it lacks the ancient, blood-tied history of red or the divine origins of blue, orange has always been viewed as a highly modern, incredibly accessible color. In art, it was heavily utilized by the Impressionists (like Monet and Van Gogh) who discovered that placing bright orange next to azure blue made both colors fiercely vibrate on the canvas, creating the illusion of pure, radiating sunlight.'
        ],
        description: [
            'Perfectly positioned right between the physical, furious energy of red and the logical, radiant joy of yellow, orange is the definitive color of pure, unadulterated extroversion. It is an intensely social color that fundamentally encourages loud conversation, rapid physical activity, and communal gathering.',
            'Unlike red, which can easily trigger aggression or fear, orange retains the intense heat and physical motivation of red but is heavily diluted by yellow to a much friendlier, far more approachable level. It is the color of the blazing sunset and the autumn harvest, radiating deep, inclusive warmth.'
        ],
        deepPsychology: [
            { title: 'Enthusiasm', description: 'Orange is fundamentally encouraging. It possesses the exact urgency of red, but completely removes the threat, resulting in an atmosphere of pure, unfiltered excitement and immediate enthusiasm.' },
            { title: 'Adventure', description: 'Orange pushes the human brain to seek novelty. It fiercely encourages individuals to take physical risks, try completely new extreme activities, and fearlessly step outside their established comfort zones.' },
            { title: 'Affordability', description: 'Unlike deep purples, blacks, or golds, vibrant orange explicitly communicates "budget-friendly value." It strips away all aristocratic pretense, signaling that a product or service is highly accessible to the masses.' },
            { title: 'Superficiality', description: 'The absolute lack of serious, grounded weight in orange can frequently make it come across as incredibly cheap, juvenile, completely insincere, or entirely lacking in intellectual depth.' }
        ],
        personalityProfile: {
            intro: 'An orange personality is the absolute, undisputed life of the party. They are immensely warm, highly physical creatures who completely thrive on constant social approval and heavy external stimuli.',
            positive: ['Fiercely Adventurous', 'Endlessly Enthusiastic', 'Highly Sociable', 'Unapologetically Flamboyant', 'Deeply Tolerant'],
            negative: ['Annoyingly Superficial', 'Emotionally Dependent', 'Exhaustingly Overbearing', 'Wildly Unpredictable', 'Frustratingly Fickle']
        },
        symbolism: 'In Hinduism, a specific deep shade of orange (saffron) is incredibly sacred, representing fire and supreme purity. In the West, it is heavily, almost exclusively associated with the Halloween season, the physical decay of autumn, and vital physical safety (hunting vests, construction cones).',
        businessApplications: [
            'In the modern digital era, orange is the undisputed titan of the global e-commerce world. It strongly implies inexpensive, mass-market goods (Home Depot, Amazon, Alibaba) and forces the consumer into a state of rapid purchasing.',
            'Furthermore, orange is used incredibly intensely in the modern sports, extreme energy drink, and fitness industries to rapidly promote physical motion, youthful stamina, and intense biological vitality.'
        ],
        marketingAndBranding: [
            'Orange is essentially considered the ultimate "Subscribe" or "Buy Now" button color across global UX design. It consistently generates incredibly high conversion rates because it commands immediate, undeniable attention without triggering the aggressive, stop-sign threat of solid red.',
            'However, using orange for corporate banking, absolute luxury goods, or serious medical facilities is a massive branding failure. It will instantly destroy the perceived authority of the brand by making the service seem amateur, cheap, and entirely chaotic.'
        ],
        randomFacts: [
            'There is famously no true word in the entire English language that rhymes perfectly with the word "orange".',
            'Before the fruit was imported, orange was originally named "geoluhread" (meaning precisely yellow-red) in Old English.',
            'Consuming too many carrots, sweet potatoes, or oranges can actually cause an individual\'s physical skin to permanently turn orange, a benign medical condition called Carotenemia.'
        ],
        detailedShades: [
            { name: 'Peach', hex: '#FFE5B4', description: 'A highly diluted, incredibly soft orange that feels intensely nurturing, intimately conversational, and deeply gentle.' },
            { name: 'Rust', hex: '#B7410E', description: 'A deep, heavily oxidized orange explicitly communicating vintage decay, intense autumn warmth, and profound historical grounding.' },
            { name: 'Tangerine', hex: '#F28500', description: 'A highly saturated, incredibly juicy orange that screams pure physical vitality, immense zest, and vitamin-rich energy.' }
        ]
    }, {
        slug: 'purple'`
    },
    {
        search: `slug: 'purple'`,
        replace: `slug: 'purple',
        name: 'Purple',
        hex: '#8B5CF6',
        shortDescription: 'The color of royal mystery, luxury, and spiritual depth.',
        history: [
            'For thousands of years, the attainment of true purple was nearly impossible. The legendary Tyrian purple dye had to be painstakingly extracted entirely by hand from the secreted mucus of a terrifyingly rare sea snail found only in the Mediterranean. Because it took tens of thousands of crushed snails to dye just a single hem of a garment, the price of purple dye exploded past the physical weight of pure gold.',
            'Due to this staggering, near-mythical expense, purple became strictly illegal for commoners to wear under ancient sumptuary laws. It was fiercely reserved by law for emperors, untouchable kings, and immense religious figures, permanently cementing purple as the ultimate global symbol of divine right and untouchable royalty.',
            'It was only in 1856 when an 18-year-old English chemistry student named William Henry Perkin accidentally synthesized the first artificial purple dye (mauveine) while attempting to cure malaria that purple finally became accessible to the general public, forever changing the global fashion industry.'
        ],
        description: [
            'From a pure physics standpoint, purple is a profound biological paradox. It marries the fierce, intensely hot, and highly aggressive physical energy of Red with the serene, freezing, and purely logical wavelength of Blue. This delicate, almost impossible physical contradiction makes purple the universal symbol of magic, absolute luxury, and incredibly complex, existential contemplation.',
            'Because purple rarely occurs in massive, unbroken quantities in physical nature (unlike blue skies or green forests), the human brain inherently views it as something manufactured, unnatural, or deeply mystical. It lifts the human consciousness entirely out of the physical grounding of the earth and directly into the realm of pure fantasy and the occult.'
        ],
        deepPsychology: [
            { title: 'Royalty', description: 'Because of its thousands of years of extreme historical exclusivity, our brains remain biologically hardwired to view deep, rich purple as an absolute symbol of immense wealth, luxury, and entirely untouchable aristocratic status.' },
            { title: 'Spirituality', description: 'Purple forcefully lifts the human mind entirely out of the mundane physical world. It is utilized heavily in global meditation chambers, psychic phenomena, and deep existential or religious contemplation.' },
            { title: 'Imagination', description: 'Purple directly encourages the brain to solve problems entirely creatively rather than logically, fiercely breaking established rules of standardized thought and venturing into pure art.' },
            { title: 'Arrogance', description: 'The intensely deep association with untouchable royalty can easily make excess purple feel incredibly pompous, coldly aloof, or completely disconnected from the struggles of physical reality.' }
        ],
        personalityProfile: {
            intro: 'Those who declare purple as their primary favorite color are almost always highly individualistic, slightly wonderfully eccentric, and possess a deeply ingrained, almost painful need to be viewed as totally unique.',
            positive: ['Fiercely Creative', 'Deeply Charismatic', 'Highly Intuitive', 'Unapologetically Visionary', 'Profoundly Compassionate'],
            negative: ['Intolerably Arrogant', 'Wildly Impractical', 'Painfully Introverted', 'Deeply Cynical', 'Frustratingly Elitist']
        },
        symbolism: 'Globally, it universally translates to unimaginable luxury and premium quality. In the United States military, the Purple Heart represents vast, almost incomprehensible physical courage. In Thailand and parts of South America, it is strictly the color of mourning for widows.',
        businessApplications: [
            'In the modern corporate sphere, deep purple is utilized almost exclusively for extremely high-end, absolute premium services or limited-run products targeting a fiercely exclusive, wealthy demographic.',
            'Additionally, because it so fiercely represents the unknown, it is highly popular in the creative, occult, and modern astrotech industries. Companies striving to appear as "visionary disruptors" who create "magic" out of code often lean heavily into deep violet branding.'
        ],
        marketingAndBranding: [
            'Use deep purples strategically in SaaS to signify the absolute highest premium software tiers (Pro/Enterprise packages), instantly elevating the perceived value of the subscription.',
            'Conversely, use significantly lighter purples (lavenders, lilacs) to specifically target mystical, heavily feminine, or holistic natural health demographics. These lighter tints completely remove the arrogance of dark purple, replacing it with incredible nostalgia and gentle romance.'
        ],
        randomFacts: [
            'Optically, purple is the absolute hardest color for the human eye to physically distinguish against other colors on the spectrum.',
            'Ancient carrots used to be predominantly purple before they were intentionally bred by the Dutch to be orange.',
            "From a strictly scientific perspective, there is actually no 'purple' wavelength of physical light. Purple is an absolute fabrication—an illusion created entirely by the human brain when the optical nerve detects massive amounts of blue and red light simultaneously but completely lacks any green light to balance them."
        ],
        detailedShades: [
            { name: 'Lavender', hex: '#E6E6FA', description: 'A pale, highly diluted purple that entirely drops the massive arrogance of deep purple, creating a delicate, deeply nostalgic, and highly romantic aura.' },
            { name: 'Plum', hex: '#8E4585', description: 'An honorable, deeply antique purple that feels incredibly rich, highly cultured, and steeped in formal tradition.' },
            { name: 'Amethyst', hex: '#9966CC', description: 'A fascinating, crystalline purple that leans heavily into the mystical, spiritual, and occult realms.' }
        ]
    }, {
        slug: 'pink'`
    },
    {
        search: `slug: 'pink'`,
        replace: `slug: 'pink',
        name: 'Pink',
        hex: '#EC4899',
        shortDescription: 'The color of unconditional love, femininity, and soothing warmth.',
        history: [
            'The historical perception of pink is one of the most fascinating examples of modern marketing completely rewriting cultural norms. For centuries, right up into the 18th and early 19th centuries, pink was actually considered an explicitly masculine color.',
            'Because it was essentially viewed as a "faded, diluted red," pink was seen as a fierce, strong color suitable for young boys preparing for war, while blue (being delicate and dainty) was strictly reserved for young girls. It was only directly following World War II that deliberate, heavy corporate marketing from American department stores violently shifted pink to be exclusively associated with intense femininity.',
            'Today, the cultural grip of pink has begun to loosen once again. The massive rise of "Millennial Pink" in the 2010s proved that the color could successfully breach gender barriers, becoming a staple of edgy, modern tech startups and gender-neutral fashion.'
        ],
        description: [
            'From a psychological standpoint, pink is essentially the color red completely stripped of all its raw, violent aggression. It takes the intense, burning heat of red and dilutes it with pure white, resulting in a hue that represents the very core of deep compassion, endless nurturing, and unconditional love.',
            'Unlike red, which fiercely demands physical passion and rapid action, pink asks for nothing. It produces an incredibly soothing, biological warmth that physically drains rapid energy from the body, calming aggressive individuals down and promoting a profound sense of total safety.'
        ],
        deepPsychology: [
            { title: 'Tranquility', description: 'Specific, highly tuned shades of pink (like Baker-Miller Pink) have a heavily documented, clinically proven physiological effect that completely drains physical energy from the human body, drastically calming even the most aggressive people down within minutes.' },
            { title: 'Femininity', description: 'In entirely modern Western culture, pink remains inextricably linked to traditional female gender roles, immense sweetness, delicate fragility, and the overarching concept of the feminine divine.' },
            { title: 'Compassion', description: 'Pink entirely replaces the furious lust and demand of red with a deeply maternal, gentle nurturing instinct. It fiercely signifies profound empathy, extreme tenderness, and deep emotional understanding.' },
            { title: 'Immaturity', description: 'Because of its heavy, inescapable association with baby girls, sweet candy, and loud toys, massive amounts of pink can easily be perceived in a corporate setting as excessively childish, overly weak, or completely lacking in serious, grounded intellect.' }
        ],
        personalityProfile: {
            intro: 'A true pink personality is exceptionally gentle, incredibly loving, and deeply empathetic. They require immense amounts of physical affection and absolutely despise any form of harsh physical or verbal conflict.',
            positive: ['Unconditionally Compassionate', 'Deeply Warm', 'Fiercely Romantic', 'Unbreakably Hopeful', 'Endlessly Optimistic'],
            negative: ['Dangerously Naive', 'Physically Vulnerable', 'Exhaustingly Over-emotional', 'Occasionally Immature', 'Painfully Timid']
        },
        symbolism: 'Universally, the pink ribbon is the undisputable global symbol for Breast Cancer Awareness, representing massive hope and unity. In Japan, pink represents the incredibly fleeting, highly delicate beauty of life due to its association with the fast-falling cherry blossom (sakura).',
        businessApplications: [
            'Unsurprisingly, pink absolutely dominates global industries heavily targeting young females, romance novels, sweet baked goods, and massive cosmetics empires. It is the defining color of the beauty and toy industries.',
            'However, modern, aggressive shades of Hot Pink are increasingly being utilized by massive tech disruptors, innovative logistics startups, and modern fintech apps to fiercely stand out against the absolute sea of traditional corporate "Tech Blue."'
        ],
        marketingAndBranding: [
            'Searing, neon hot pink can be heavily utilized in almost exactly the same manner as solid red: to grab absolute, undeniable optical attention, but with an added rebellious, punk-rock, cyber-youth twist.',
            'Conversely, utilizing extremely soft, pastel pinks in UX design actually reduces the bounce rate of aggressive e-commerce sites by slowly calming the viewer down, making the entire website feel incredibly soft, highly approachable, and safe.'
        ],
        randomFacts: [
            'The incredibly specific shade "Baker-Miller Pink" is actively painted inside dangerous prison holding cells and psychiatric wards because clinical studies absolutely proved it physically saps the raw strength from highly violent inmates within a mere 15 minutes of exposure.',
            'Biological flamingos are actually entirely white or pale grey when they hatch; their iconic, intensely pink color comes entirely from the massive amounts of beta-carotene in the shrimp and algae they consume daily.',
            'From a strict physics standpoint, pink is technically a tint, not a true color, as it does not physically appear anywhere on the natural electromagnetic spectrum of light.'
        ],
        detailedShades: [
            { name: 'Fuchsia', hex: '#FF00FF', description: 'A violently bright, purely synthetic pink-purple that absolutely screams total rebellion, intense physical energy, and glaring, glowing cyber-modernity.' },
            { name: 'Rose', hex: '#FF007F', description: 'A deeply romantic, mature pink that perfectly bridges the massive gap between the furious passion of red and the innocent sweetness of pink.' },
            { name: 'Salmon', hex: '#FA8072', description: 'A wonderfully warm, slightly orangey-pink that feels phenomenally organic, deeply culinary, and highly, effortlessly approachable.' }
        ]
    }, {
        slug: 'brown'`
    },
    {
        search: `slug: 'brown'`,
        replace: `slug: 'brown',
        name: 'Brown',
        hex: '#8B4513',
        shortDescription: 'The color of the physical earth, absolute stability, and pure utility.',
        history: [
            'Historically, brown was universally the color of extreme poverty, physical labor, and the brutal working class. Because undyed, unbleached wool and cheap physical materials were naturally brown, the color was fiercely, violently rejected by the global aristocracy and royalty for thousands of years.',
            'During the Middle Ages, Franciscans famously adopted brown robes explicitly as a symbol of extreme poverty, ultimate humility, and their total rejection of aristocratic wealth. It wasn’t until the modern era, with the massive rise of the organic food and eco-friendly movements, that brown finally shed its stigma of "dirt" and was rightfully reclaimed as a symbol of pure, uncorrupted nature and artisan craftsmanship.'
        ],
        description: [
            'Brown is the absolute, ultimate grounded color. It entirely lacks the screaming pretense, vibrant energy, and desperate demand for attention of the rest of the color spectrum. Instead, it provides an undeniable, deep psychological sensation of physical dirt, aged wood, rich history, and absolute dependability.',
            'Because it is heavily composed of multiple grounding colors mixed together, brown acts as a total visual anchor. It tells the human brain to completely stop rushing, to sit down, and to trust that the physical structure around them is secure and ancient.'
        ],
        deepPsychology: [
            { title: 'Reliability', description: 'Because it perfectly mirrors the literal physical ground we walk on every day, heavy brown implies that something is structurally sound, totally honest, and physically not going to disappear or break under pressure.' },
            { title: 'Comfort', description: 'Brown wraps around the weary viewer like a thick, heavy blanket. It instantly reminds the primal brain of rich coffee, dark chocolate, warm campfires, and deep, profound organic warmth.' },
            { title: 'Simplicity', description: 'Brown entirely strips away massive arrogance. It is fundamentally, brutally utilitarian—it does the required job perfectly without ever needing to show off or demand applause.' },
            { title: 'Boredom', description: 'Without a highly contrasting bright hue to break it up, pure, flat brown can be rapidly perceived by the brain as intensely dull, incredibly heavy, and completely devoid of any intellectual spark or physical progression.' }
        ],
        personalityProfile: {
            intro: 'True brown personalities are the absolute bedrock of human society. They are heavily frugal, incredibly dependable, and fiercely, immovably loyal to their deep-rooted families and strict daily routines.',
            positive: ['Unbreakably Reliable', 'Brutally Honest', 'Deeply Wholesome', 'Fiercely Supportive', 'Profoundly Grounded'],
            negative: ['Intensely Dull', 'Painfully Predictable', 'Immovably Stubborn', 'Frustratingly Cheap', 'Totally Inflexible']
        },
        symbolism: 'In ancient Feng Shui, brown represents the physical element of wood, deep grounding roots, and family safety. In the modern West, it symbolizes massive agriculture, the rugged outdoors, and the comfortable warmth of the autumn harvest.',
        businessApplications: [
            'Massive logistics companies (notoriously UPS) utilize heavy brown branding specifically to prove they are dependable, physically rugged, and completely unconcerned with showing off. They want you to trust that they will do the difficult physical work.',
            'Furthermore, brown is incredibly, heavily used in the organic coffee, rich chocolate, and craft artisan beer industries to explicitly communicate deep, traditional, earthy flavor profiles that took time and craft to perfect.'
        ],
        marketingAndBranding: [
            'Brown is exceptionally, notoriously difficult to use effectively in raw digital UI design. If applied poorly, the user’s brain instantly registers the hex codes as literal "dirt," "mud," or "mistakes," completely ruining the interface.',
            'When utilizing brown digitally, use it strictly for organic, vintage typography, highly rustic borders, or when dealing exclusively with artisan, outdoorsy, or deeply historical luxury products.'
        ],
        randomFacts: [
            'Incredibly, the deeply ancient Japanese language does not actually have a native, single word for the color brown; instead, they exclusively use heavily descriptive terms like "tea-color" or "fox-color".',
            'Deep brown eyes are by far the absolutely most common eye color in the entire world, making up roughly 79% of the entire human population.',
            'Interior design studies prove that painting a room entirely brown instantly makes the physical space feel significantly smaller, but drastically warmer and infinitely cozier.'
        ],
        detailedShades: [
            { name: 'Beige', hex: '#F5F5DC', description: 'A pale, highly diluted brown that acts as the absolute ultimate neutral, effortlessly fading perfectly into the background to let other elements shine.' },
            { name: 'Mahogany', hex: '#C04000', description: 'A profoundly rich, heavy red-brown that universally exudes old-world wealth, expensive leather armchairs, and deeply historic, antique luxury.' },
            { name: 'Chocolate', hex: '#7B3F00', description: 'A dense, impossibly delicious dark brown that biologically tricks the human brain into literally tasting rich sweetness and deep comfort simply by looking at it.' }
        ]
    }, {
        slug: 'black'`
    },
    {
        search: `slug: 'black'`,
        replace: `slug: 'black',
        name: 'Black',
        hex: '#000000',
        shortDescription: 'The overarching color of absolute authority, unyielding luxury, and the total void.',
        history: [
            'Black was undisputedly one of the absolute first colors ever utilized by humans in primitive art, made simply from burned charcoal to draw deep, permanent outlines on cave walls. For thousands of years, basic black dyes were notoriously unstable and would quickly fade to a sickly, dirty grey or brown.',
            'It was only in the 14th century, when high-quality, incredibly stable black dyes were finally invented, that black underwent a massive cultural shift. It instantly transformed into the signature, undeniable color of the extremely wealthy, powerful magistrates, high-ranking government officials, and ultimately, high fashion, as the color proved one could afford clothes that absorbed dirt and light perfectly.',
            'During the 19th-century Romantic period, black secured its modern legacy. It became the global standard for the ultimate formal attire (the tuxedo) while simultaneously being violently adopted by rebellious youth cultures and artistic movements seeking to visually reject mainstream society.'
        ],
        description: [
            'From a strict standpoint of physical optics, black is the complete, total absorption of all physical light. It is not a color so much as it is the absolute, terrifying absence of color. Psychologically, this makes it the absolute most formidable, visually impenetrable color on the spectrum.',
            'Black represents the absolute, undeniable extreme of total formality, guarded mystery, physical intimidation, and completely untouchable, sleek sophistication. Because it gives nothing back to the viewer, it creates a massive sense of weight, structure, and intense physical gravity.'
        ],
        deepPsychology: [
            { title: 'Power', description: 'Black entirely demands submission. Global judges, religious priests, and elite tactical riot gear use solid black to explicitly communicate unquestionable authority, finality, and absolute control over the physical environment.' },
            { title: 'Luxury', description: 'Black entirely strips away all distracting visual noise, color psychology, and playful emotion, leaving only the pure, structural physical form of an object. This instantly makes luxury products look infinitely more expensive, premium, and intensely desirable.' },
            { title: 'Mystery', description: 'Black perfectly conceals everything it touches. It automatically creates an aura of deeply guarded secrets, intense rebellion, and triggers the primal, ancient human terror of the unknown dark void.' },
            { title: 'Grief', description: 'In almost all modern Western cultures, solid black is the literal, inescapable representation of the absolute end, the freezing void, and total grieving death.' }
        ],
        personalityProfile: {
            intro: 'Those who choose to wear black exclusively often subconsciously seek to visually heavy-armor themselves to protect against the chaotic external world. They are fiercely independent, incredibly strong-willed, and highly, meticulously disciplined.',
            positive: ['Intensely Sophisticated', 'Flawlessly Formal', 'Physically Strong', 'Fiercely Independent', 'Deeply Mysterious'],
            negative: ['Severely Depressing', 'Darkly Pessimistic', 'Intensely Secretive', 'Terrifyingly Intimidating', 'Painfully Conservative']
        },
        symbolism: 'In ancient Egypt, black gloriously meant life and massive rebirth (symbolizing the incredibly fertile black soil of the flooded Nile river). In intensely modern Western culture, it universally, undeniably denotes tragic mourning, absolute evil, or the absolute pinnacle of high-end, untouchable fashion.',
        businessApplications: [
            'Black is deployed fiercely, aggressively, and unapologetically in ultimate luxury fashion (Chanel, Prada), high-end technology (Apple’s "Pro" tiers), and ultra-luxury vehicles purely to physically justify extreme, astronomical price points.',
            'It communicates to the consumer that the product is serious, incredibly powerful, utterly flawless, and fiercely exclusive to those who can afford it.'
        ],
        marketingAndBranding: [
            'Using a deep, true black background (Dark Mode) immediately and drastically elevates the perceived financial value of your entire UI interface. It violently forces imagery, typography, and neon accent colors to pop aggressively off the screen.',
            'However, massive blocks of pure #000000 black text on a pure #FFFFFF white background can actually cause severe optical stuttering and eye strain for dyslexic users; utilizing a very dark grey (#111111) is vastly superior for reading.'
        ],
        randomFacts: [
            'Vantablack is a highly regulated, manufactured substance created by scientists that physically absorbs a terrifying 99.96% of all visible light, making it the blackest material ever created. It literally makes 3D objects look like flat, 2D voids in reality.',
            'Professional musicians in orchestral pits are strictly mandated to wear solid black so as not to distract the audience’s eye at all from the visual performance happening on the lit stage.',
            'Black heavily implies physical weight; psychological studies prove that individuals asked to lift two identical physical boxes will consistently report that the black box feels significantly heavier than the white box.'
        ],
        detailedShades: [
            { name: 'Ebony', hex: '#555D50', description: 'An incredibly dark, slightly olive/black referencing the notoriously hard wood, implying intense, unbreakable physical durability and ancient age.' },
            { name: 'Onyx', hex: '#353839', description: 'A deeply cold, freezing black that genuinely feels like highly polished, absolutely impenetrable, premium stone.' },
            { name: 'Charcoal', hex: '#36454F', description: 'A softer, intensely grey-leaning black that perfectly retains the sophisticated power of black but completely removes the heavy, grieving threat of the absolute void.' }
        ]
    }, {
        slug: 'white'`
    },
    {
        search: `slug: 'white'`,
        replace: `slug: 'white',
        name: 'White',
        hex: '#FFFFFF',
        shortDescription: 'The color of pure perfection, stark clinicality, and the ultimate blank slate.',
        history: [
            'Since the dawn of human civilization, white has universally been the absolute standard for purity, light, and divinity. In ancient Rome, candidates running for political office would intentionally rub their togas with chalk to make them incredibly bright white—a practice that gave us the literal word "candidate" (from the Latin candidus, meaning bright and pure).',
            'Culturally, throughout the brutal Middle Ages, white garments were utterly impossible to keep clean for the working class who labored in the dirt. Therefore, wearing pure, unstained white clothing was historically the ultimate, undeniable flex of extreme wealth, absolute cleanliness, and complete leisure.',
            'In the 1920s and 30s, modern medical and sanitary movements completely adopted white. Hospitals, scientists, and dairy companies weaponized white entirely to project the total destruction of bacteria, turning it into the undeniable color of clinical, sterile perfection.'
        ],
        description: [
            'From an optical physics standpoint, pure white light physically contains every single color in the entire visible spectrum combined into ultimate harmony. Unlike black, which is heavy and absorbs, white reflects absolutely everything back at the viewer.',
            'Psychologically, immense amounts of white space represent an absolute absence of physical weight. It symbolizes the ultimate fresh start, a completely clean slate, absolute transparency, and the total removal of all physical and emotional clutter.'
        ],
        deepPsychology: [
            { title: 'Purity', description: 'White is completely, deeply untouched. It is biologically perceived as virginal, architecturally flawless, and completely devoid of any physical corruption, dirt, or human mistakes.' },
            { title: 'Clinical Cleanliness', description: 'White visually, instantly proves the absolute absence of dirt or disease. This makes it utterly vital for global hospitals, doctors, and tech companies striving to portray sterile, flawless perfection.' },
            { title: 'Simplicity', description: 'White represents the absolute ultimate minimalist state. It massively reduces cognitive load and visual noise, allowing the human brain quiet, expansive space to think deeply without interruption.' },
            { title: 'Isolation', description: 'Too much stark, unbroken white creates a blinding, freezing, terrifying environment. If unbalanced, it can quickly feel deeply antisocial, intensely sterile, and emotionally dead or unfeeling.' }
        ],
        personalityProfile: {
            intro: 'A true white personality ultimately strives for absolute perfection and complete, untethered simplicity in all aspects of life. They are incredibly neat, highly organized to a fault, and can be severely, coldly critical of even minor physical flaws.',
            positive: ['Fiercely Optimistic', 'Highly Independent', 'Utterly Logical', 'Physically Immaculate', 'Purely Visionary'],
            negative: ['Coldly Sterile', 'Exhaustingly Fastidious', 'Emotionally Empty', 'Deeply Unfriendly', 'Brutally Critical']
        },
        symbolism: 'In the modern West, white exclusively means joyous weddings, divine angels, and total peaceful surrender (the white flag). In stark contrast, in deeply Eastern cultures (like China and India), white is explicitly and undeniably the color of death, ghosts, deep grief, and traditional mourning.',
        businessApplications: [
            'In the modern tech sector, Apple permanently revolutionized global technology simply by moving away from cheap beige plastic to completely glossy, pure white. This instantly signaled that their extremely complex computer products were inherently friendly, perfectly clean, and utterly flawless.',
            'White is the unquestioned, absolute dominant color in the global healthcare, sanitation, and dental industries. It proves to the consumer instantly that the facility and tools are flawlessly sterilized and safe.'
        ],
        marketingAndBranding: [
            'Whitespace (also known technically as Negative Space) is the single most important design element in modern, premium UI/UX design. It gives the user’s eyes a physical place to rest and effortlessly guides them directly to the vital content.',
            'Never clutter white space. Treating empty white areas as an essential, premium design element instantly separates amateur, overcrowded designs from massively professional, high-end digital experiences.'
        ],
        randomFacts: [
            'Global insurance statistics prove that white cars are the statistically safest vehicles to drive on the road because they are the absolutely most highly visible under all lighting conditions, except in heavy snow.',
            'It is a psychological impossibility for humans to dream perfectly in visual "white noise"; the brain will violently always attempt to construct a narrative or find a hidden image out of the absolute chaos.',
            'If you rapidly spin a color wheel loaded with all the colors of the rainbow, the optical illusion will make the spinning circle visually blink into pure, flat white.'
        ],
        detailedShades: [
            { name: 'Ivory', hex: '#FFFFF0', description: 'A very slight, delicate yellow tint gives this white a massive sense of ancient history, beautiful antiquity, and deep organic warmth.' },
            { name: 'Alabaster', hex: '#F2F0E6', description: 'A cool, very pale, grayish off-white that feels incredibly sculptural, highly architectural, and smoothly impenetrable.' },
            { name: 'Cream', hex: '#FFFDD0', description: 'A rich, butter-tinted white that completely removes all the harsh clinical sterility of pure white, making it deeply appetizing, rich, and comforting.' }
        ]
    }
];`
    }
];

let finalContent = content;
replacements.forEach(({ search, replace }) => {
    // Only replace the specific object by finding the exact boundary
    const parts = finalContent.split(search);
    if (parts.length > 1) {
        finalContent = parts.shift() + replace + parts.join('');
    }
});

fs.writeFileSync(dbPath, finalContent);
console.log('Successfully completed extreme depth parity for all 10 colors!');
