import React from 'react';

// TRUSTED WHITELIST (Rule #2 & #3)
// Only these schema types are allowed on Tool pages to prevent AdSense policy violations.
const ALLOWED_SCHEMAS = [
    'WebPage',
    'FAQPage',
    'HowTo',
    'BreadcrumbList',
    'Organization',
    'Article', // Allowed for blog posts if we have them
    'Website'
];

// EXPLICT BLOCKLIST (Rule #3)
// These mimic paid products and confuse Google on tool pages.
const BLOCKED_SCHEMAS = [
    'Product',
    'Offer',
    'Review',
    'AggregateRating',
    'SoftwareApplication'
];

type SafeSchemaProps = {
    type: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: Record<string, any>; // The schema object WITHOUT context/type (we add those)
};

/**
 * SEO Firewall Component
 * Enforces auto-injection rules to protect AdSense and SEO reputation.
 */
export const SafeSchema = ({ type, data }: SafeSchemaProps) => {
    // 1. Whitelist Check
    if (!ALLOWED_SCHEMAS.includes(type)) {
        if (process.env.NODE_ENV === 'development') {
            console.warn(`[SEO Firewall] 🛡️ Blocked unauthorized schema type: "${type}". Allowed: ${ALLOWED_SCHEMAS.join(', ')}`);
        }
        return null;
    }

    // 2. Explicit Blocklist Check (Double Safety)
    if (BLOCKED_SCHEMAS.includes(type)) {
        return null;
    }

    // 3. Content Integrity Rules (Rule #4 & #5)
    // Rule #4: HowTo schema ONLY if steps exist
    if (type === 'HowTo') {
        const steps = data.step || data.steps;
        if (!Array.isArray(steps) || steps.length === 0) {
            console.warn(`[SEO Firewall] 🛡️ Blocked HowTo schema: No steps detected.`);
            return null;
        }
    }

    // Rule #5: FAQ schema ONLY if questions exist
    if (type === 'FAQPage') {
        const entities = data.mainEntity;
        if (!Array.isArray(entities) || entities.length === 0) {
            console.warn(`[SEO Firewall] 🛡️ Blocked FAQPage schema: No questions detected.`);
            return null;
        }
    }

    // Construct final schema
    const finalSchema = {
        "@context": "https://schema.org",
        "@type": type,
        ...data
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(finalSchema) }}
        />
    );
};
