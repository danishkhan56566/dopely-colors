---
title: How We Built a Sub-100ms Color Generation Engine in Next.js
published: true
description: A deep dive into the math, color spaces, and Next.js server actions behind Dopely Colors.
tags: nextjs, react, webdev, design
---

# How We Built a Sub-100ms Color Generation Engine in Next.js

When designing [Dopely Colors](https://dopelycolors.com), a modern [color palette generator and encyclopedia](https://dopelycolors.com/explore), our primary goal was speed. The internet doesn't need another color tool—it needs a *faster, smarter* one that understands the deep [psychology of colors](https://dopelycolors.com/color-psychology).

In this article, we’ll explore the architecture, math, and specific Next.js 15 features that power our engine, allowing us to generate harmonious, accessible color palettes in under 100ms.

## The Problem with Traditional Color Generators

Most color generators rely on simple RGB manipulation. They randomly pick a Hex code, mathematically invert it, and call it a palette. This results in muddy, unusable colors. 

We wanted palettes that designers would actually use. This required manipulating colors in the **HSL (Hue, Saturation, Lightness)** and **LAB** color spaces to ensure perceptual uniformity.

## 1. The Math Behind Harmony

To build the [Palette Generator](https://dopelycolors.com/generate), we don't just guess colors. We use established color theory models:

*   **Complementary:** `(Hue + 180) % 360`
*   **Analogous:** `(Hue + 30) % 360` & `(Hue - 30) % 360`
*   **Triadic:** `(Hue + 120) % 360` & `(Hue + 240) % 360`

Here is a simplified version of our core harmony engine in TypeScript:

```typescript
import chroma from "chroma-js";

export function generateAnalogous(baseColor: string) {
    const hsl = chroma(baseColor).hsl();
    return [
        chroma.hsl((hsl[0] - 30 + 360) % 360, hsl[1], hsl[2]).hex(),
        baseColor,
        chroma.hsl((hsl[0] + 30) % 360, hsl[1], hsl[2]).hex(),
    ];
}
```

By leveraging `chroma-js`, we ensure that lightness and saturation remain consistent while only shifting the hue.

## 2. Leveraging Next.js Server Components for Speed

To hit our 100ms target, we aggressively moved heavy computation to the server using **Next.js Server Components**.

Instead of downloading a massive JS bundle containing all our color psychology data (we have an encyclopedia of [45 different colors](https://dopelycolors.com/color-psychology/red) and their meanings), we render the UI entirely on the server.

### The Impact of Code Splitting
For complex interactive elements like the [AI Prompt Lab](https://dopelycolors.com/tools/ai-prompt), we utilized `next/dynamic` to lazy-load components. 

```tsx
import dynamic from 'next/dynamic';

const CommandPaletteLazy = dynamic(
    () => import('./CommandPalette').then(mod => mod.CommandPalette),
    { ssr: false }
);
```
This single optimization dropped our Total Blocking Time (TBT) to near zero, resulting in a **100/100 Lighthouse Performance score**.

## 3. Real-Time WCAG Accessibility Checks

Generating a beautiful palette is useless if no one can read the text on it. Our engine includes a real-time [Dynamic Contrast checker](https://dopelycolors.com/tools/dynamic-contrast) that calculates the relative luminance of two colors based on the WCAG 2.1 formula.

```typescript
function getContrastRatio(l1: number, l2: number) {
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}
```

If a color pair fails the `4.5:1` ratio, the generator automatically flags it.

## Conclusion

Building [Dopely Colors](https://dopelycolors.com) taught us that high-performance web apps require a deep understanding of both your domain (color math) and your framework (Next.js rendering strategies).

If you are a frontend developer or UI designer, try running your site’s primary colors through our [Color Contrast Engine](https://dopelycolors.com/contrast) or explore the deep meanings behind your branding in our [Color Psychology Encyclopedia](https://dopelycolors.com/color-psychology). 

*Have you built a tool in Next.js recently? Let me know in the comments how you handled performance optimizations!*
