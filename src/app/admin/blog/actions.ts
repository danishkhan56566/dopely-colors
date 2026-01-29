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
    },
    {
        keywords: ['vs', 'compare', 'difference', 'best'],
        title: "{Topic}: When to Use and When to Avoid",
        excerpt: "A deep dive comparison of {Topic} and its alternatives in various design scenarios.",
        content: `
# {Topic} Comparison Guide

Choosing between **{Topic}** and other color strategies can be difficult. This guide breaks down the performance, emotional impact, and accessibility of each.

## Feature Comparison Matrix

| Feature | {Topic} Strategy | Conventional Approach |
| :--- | :--- | :--- |
| **Trust Score** | High (85%) | Medium (60%) |
| **User Delight** | Exceptional | Standard |
| **Setup Speed** | Instant with AI | Manual |
| **Accessibility** | Built-in | Variable |

## Key Advantages
1. **Consistency:** {Topic} ensures your brand looks the same across all touchpoints.
2. **Speed:** Accelerate your workflow by 300%.
3. **Accuracy:** Never miss a shade or tint again.

## Recommendation
Use **{Topic}** for high-conversion landing pages and premium dashboard interfaces where professional polish is non-negotiable.
        `
    }
];

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini (In production, use Vercel Env Vars)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateBlogPost(topic: string) {
    const apiKey = process.env.GOOGLE_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

    if (apiKey) {
        try {
            const prompt = `
                You are a professional Design Blogger. Generate a high-quality blog post about: "${topic}".
                
                REQUIREMENTS:
                1. Use professional Markdown formatting (H1 for title, H2/H3 for sections).
                2. Include a bulleted list of 3-5 key points.
                3. Include a comparison table (3 columns: Feature, Benefit, Score) related to the topic.
                4. Include a catchy title and a short excerpt.
                5. Output MUST be valid JSON with keys: "title", "excerpt", "content".
                6. Length: Approx 500 words for content.
                7. Tone: Professional, modern, and helpful.
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Clean JSON string (remove markdown code blocks if any)
            const jsonStr = text.replace(/```json|```/g, "").trim();
            const data = JSON.parse(jsonStr);

            return {
                title: data.title,
                slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
                excerpt: data.excerpt,
                content: data.content.trim(),
                seo_title: data.title,
                seo_description: data.excerpt,
                author: 'AI Designer',
                generated: true
            };
        } catch (err) {
            console.error("Gemini Generation Failed, falling back to templates:", err);
        }
    }

    // Fallback to Template Logic
    // ... existing template logic ...
    const topicLower = topic.toLowerCase();
    let template = TEMPLATES.find(t => t.keywords.some(k => topicLower.includes(k)));
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

import { createAdminClient } from '@/lib/supabase-server';
import { checkPermission } from '@/lib/permissions';

export async function savePost(payload: any) {
    try {
        const supabase = createAdminClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('Unauthorized');
        }

        // Check for EDIT permission
        const canEdit = await checkPermission(user.id, 'Blog Section', 'edit');
        if (!canEdit) {
            return { success: false, error: 'DENIED: You do not have "Edit" permissions for the Blog Section.' };
        }

        // If the user is trying to PUBLISH, check for PUBLISH permission
        if (payload.status === 'published') {
            const canPublish = await checkPermission(user.id, 'Blog Section', 'publish');
            if (!canPublish) {
                // If they can't publish, we can either block the whole save or just force it to draft
                return { success: false, error: 'DENIED: You do not have "Publish" permissions. Please save as Draft instead.' };
            }
        }

        // Check if we are updating or inserting
        let result;
        if (payload.id) {
            result = await adminClient
                .from('posts')
                .update(payload)
                .eq('id', payload.id)
                .select()
                .single();
        } else {
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
