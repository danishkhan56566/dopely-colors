'use server';

import { createClient } from '@supabase/supabase-js';

// Mock AI Logic for Blog Generation
// In a real app, this would call OpenAI/Anthropic APIs

const TEMPLATES = [
    {
        keywords: ['trend', '2024', '2025', 'future'],
        title: "Top Color Trends for {Year}: What's Next in Design",
        excerpt: "Discover the emerging color palettes defining the visual landscape of {Year}. From digital neon to organic earth tones.",
        content: `
# The Future of Color: {Year} Trends Report

As we move further into {Year}, the design world is shifting towards more emotive and human-centric color palettes. Here are the key trends defining this era.

## 1. Digital Lavender & Soft Cyber
The intersection of digital wellness and escapism. Soft purples and digital pastels are taking over UI design, offering a calming yet futuristic vibe.

## 2. Earthy Brutalism
Raw, unpolished textures mixed with deep moss greens, clay browns, and stone greys. This trend rejects the "clean corporate" look for something more grounded and authentic.

## 3. Acid Pop Accents
In a sea of minimalism, designers are using sharp, high-contrast "acid" colors (lime green, electric blue) to draw attention to CTAs and interactive elements.

## How to Apply These
- **UI Design:** Use Digital Lavender for backgrounds.
- **Branding:** Incorporate Earthy tones for lifestyle brands.
- **Marketing:** Use Acid Pop for conversion buttons.

Running a project in {Year}? Don't play it safe. Experiment with these palettes to stand out.
        `
    },
    {
        keywords: ['psychology', 'meaning', 'emotion'],
        title: "The Psychology of {Topic}: What It Says About Your Brand",
        excerpt: "Unlock the hidden meaning behind {Topic} and how it influences user behavior and brand perception.",
        content: `
# Mastering Color Psychology: {Topic}

Color is not just visual; it's emotional. When we talk about **{Topic}**, we are tapping into deep-seated psychological triggers.

## The Emotional Spectrum of {Topic}
{Topic} is often associated with... well, it depends on the context.
- **Trust & Stability:** Often seen in financial and tech sectors.
- **Urgency & Passion:** Common in food and clearance sales.
- **Creativity:** A favorite of design agencies.

## Strategic Usage in UI
1. **Backgrounds:** Use lighter shades of {Topic} to reduce eye strain via low contrast.
2. **CTAs:** High saturation {Topic} can increase click-through rates by up to 20%.
3. **Typography:** Darker variants of {Topic} provide excellent readability while maintaining brand identity.

## Conclusion
Don't just pick {Topic} because it "looks nice". Use it to drive the specific emotional response you want from your users.
        `
    },
    {
        keywords: ['ui', 'ux', 'web', 'design', 'tutorial'],
        title: "Mastering {Topic} in Modern Web Design",
        excerpt: "A comprehensive guide to effectively using {Topic} in your next web project without overwhelming users.",
        content: `
# Designing with {Topic}: A Practical Guide

Using **{Topic}** effectively in web design is a balancing act. Too much, and it's overwhelming. Too little, and it's boring. Here is how to get it right.

## The 60-30-10 Rule
- **60% Primary:** A neutral background.
- **30% Secondary:** Your brand color or a supportive shade.
- **10% {Topic}:** Use {Topic} strictly for accents, buttons, and key highlights.

## Accessibility First
Ensure your usage of {Topic} meets WCAG AA standards.
> **Pro Tip:** Never use pure {Topic} on a pure white background if it lacks contrast. Always check contrast ratios!

## Implementation Code
\`\`\`css
.btn-primary {
  background-color: var(--color-{Topic}-500);
  color: white;
  transition: all 0.2s ease;
}
\`\`\`

Start small. Inject {Topic} into micro-interactions and hover states first.
        `
    }
];

export async function generateBlogPost(topic: string) {
    // Simulate AI Delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const topicLower = topic.toLowerCase();

    // Find best matching template
    let template = TEMPLATES.find(t => t.keywords.some(k => topicLower.includes(k)));

    // Fallback to generic "Creative" template if no match
    if (!template) {
        template = {
            keywords: [],
            title: `Why ${topic} Matters in Design`,
            excerpt: `An exploration of ${topic} and its impact on modern aesthetics.`,
            content: `
# Exploring ${topic}

**${topic}** is rapidly becoming a cornerstone of modern aesthetic conversations. But why now?

## The Rise of ${topic}
In a world saturated with noise, ${topic} offers a unique perspective. It allows designers to communicate complex ideas with simplicity.

## Key Takeaways
- **Versatility:** Works across print and digital.
- **Adaptability:** Pairs well with both dark and light modes.

## Final Thoughts
Whether you love it or hate it, ignoring ${topic} is no longer an option for serious creatives.
            `
        };
    }

    // Replace Placeholders
    const year = new Date().getFullYear();
    const title = template.title.replace('{Year}', year.toString()).replace('{Topic}', topic);
    const excerpt = template.excerpt.replace('{Year}', year.toString()).replace('{Topic}', topic);
    const content = template.content.replace(/{Year}/g, year.toString()).replace(/{Topic}/g, topic);

    return {
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        excerpt,
        content: content.trim(),
        seo_title: title,
        seo_description: excerpt,
        author: 'AI Assistant',
        generated: true
    };
}

// ... existing AI code ...

const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        }
    }
);

export async function savePost(payload: any) {
    try {
        if (!process.env.SUPABASE_SERVICE_KEY) {
            throw new Error('Missing SUPABASE_SERVICE_KEY');
        }

        // Check if we are updating or inserting
        let result;
        if (payload.id) {
            // Update
            result = await adminClient
                .from('posts')
                .update(payload)
                .eq('id', payload.id)
                .select()
                .single();
        } else {
            // Insert
            result = await adminClient
                .from('posts')
                .insert(payload)
                .select()
                .single();
        }

        if (result.error) {
            throw new Error(result.error.message);
        }

        return { success: true, data: result.data };
    } catch (error: any) {
        console.error('Save Post Error:', error);
        return { success: false, error: error.message };
    }
}
