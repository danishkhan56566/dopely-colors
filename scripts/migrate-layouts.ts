import fs from 'fs';
import path from 'path';

// Helper to extract properties from the DashboardLayout
function extractProps(content: string) {
    const titleMatch = content.match(/title="([^"]+)"/);
    const descMatch = content.match(/description="([^"]+)"/);
    const iconMatch = content.match(/icon=\{([^}]+)\}/);

    // Some tools might use alternative prop patterns or hardcoded values
    return {
        title: titleMatch ? titleMatch[1] : (content.match(/title=\{`([^`]+)`\}/)?.[1] || "Tool"),
        description: descMatch ? descMatch[1] : (content.match(/description=\{`([^`]+)`\}/)?.[1] || "Tool Description"),
        icon: iconMatch ? iconMatch[1] : "Wand2",
    };
}

// Find the guide block, e.g., <GlassGuide /> or something similar
function extractGuide(content: string) {
    // Look for common guide patterns at the bottom of the component just before closing DashboardLayout
    const guideMatch = content.match(/(<[A-Za-z]+Guide[^>]*\/>)/);
    return guideMatch ? guideMatch[1] : null;
}

function processFile(filePath: string) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Skip if already has PremiumToolLayout
    if (content.includes('PremiumToolLayout')) {
        console.log(`Skipping (already migrated): ${filePath}`);
        return false;
    }

    // Must be using DashboardLayout
    if (!content.includes('DashboardLayout')) {
        console.log(`Skipping (no DashboardLayout): ${filePath}`);
        return false;
    }

    // 1. Extract props and guide
    const props = extractProps(content);
    const guide = extractGuide(content);

    // 2. Add Imports for Layouts and Icon
    content = content.replace(
        /import\s+{[^}]*?(?:DashboardLayout)[^}]*?}\s+from\s+['"]@\/components\/layout\/DashboardLayout['"];?/,
        `import { DashboardLayout } from '@/components/layout/DashboardLayout';\nimport { PremiumToolLayout } from '@/components/layout/PremiumToolLayout';`
    );

    // If using the fallback Wand2, ensure it's imported
    if (props.icon === "Wand2" && !content.includes("import { Wand2 }") && !content.includes("import {Wand2}") && !content.includes("Wand2,")) {
        // Find existing lucide-react import
        const lucideMatch = content.match(/import\s+{([^}]+)}\s+from\s+['"]lucide-react['"]/);
        if (lucideMatch) {
            content = content.replace(lucideMatch[0], `import { ${lucideMatch[1].trim()}, Wand2 } from 'lucide-react'`);
        } else {
            // Add new import at the top
            content = `import { Wand2 } from 'lucide-react';\n` + content;
        }
    }

    // Fallback if import was structured differently
    if (!content.includes('PremiumToolLayout')) {
        const importSpot = content.indexOf('import ') > -1 ? content.indexOf('import ') : 0;
        content = content.slice(0, importSpot) + `import { PremiumToolLayout } from '@/components/layout/PremiumToolLayout';\n` + content.slice(importSpot);
    }

    // Extract Inner Content (Everything inside <DashboardLayout>...</DashboardLayout>)
    // Because JSX can be nested, regex is dangerous for pure extraction. 
    // We'll replace the opening and closing tags instead, and inject props.

    let replacementStart = `<PremiumToolLayout\n            title="${props.title}"\n            description="${props.description}"\n            icon={${props.icon}}\n            badgeText="${props.title}"`;

    if (guide) {
        replacementStart += `\n            guide={${guide}}`;
        // Remove the guide from its original place in the children since it's now a prop
        content = content.replace(guide, '');
    }

    replacementStart += `\n        >`;

    // Replace <DashboardLayout ...>
    content = content.replace(/<DashboardLayout[^>]*>/, replacementStart);

    // Replace </DashboardLayout>
    content = content.replace(/<\/DashboardLayout>/, '</PremiumToolLayout>');

    // Optional: Add some glassmorphism classes to the main tool container if it's explicitly a `bg-white` 
    // to match the premium feel, though this is risky to automate globally without breaking custom layouts.
    // For now, wrapping in PremiumToolLayout handles the majority of the lifting cleanly.

    fs.writeFileSync(filePath, content);
    console.log(`Migrated: ${filePath}`);
    return true;
}

function runMigration(dirPath: string) {
    const files = fs.readdirSync(dirPath);
    let migratedCount = 0;

    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // Check for page.tsx in the tool directory
            const pagePath = path.join(fullPath, 'page.tsx');
            if (fs.existsSync(pagePath)) {
                try {
                    const migrated = processFile(pagePath);
                    if (migrated) migratedCount++;
                } catch (e) {
                    console.error(`Failed to process ${pagePath}:`, e);
                }
            }
        }
    });

    console.log(`\nMigration Complete: ${migratedCount} tools updated to PremiumToolLayout.`);
}

const TOOLS_DIR = path.join(process.cwd(), 'src/app/tools');
runMigration(TOOLS_DIR);
