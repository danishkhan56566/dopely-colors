import fs from 'fs';
import path from 'path';

function hideHeadersForLegacyTools(dirPath: string) {
    const files = fs.readdirSync(dirPath);
    let patchedCount = 0;

    // The tools we MANUALLY migrated and carefully removed their internal headers,
    // so we WANT PremiumToolLayout to render its header for them.
    const manuallyMigratedTools = ['brand', 'ai-prompt', 'art-extractor'];

    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (manuallyMigratedTools.includes(file)) {
                console.log(`Skipping handmade premium tool: ${file}`);
                return; // Continue to next
            }

            const pagePath = path.join(fullPath, 'page.tsx');
            if (fs.existsSync(pagePath)) {
                let content = fs.readFileSync(pagePath, 'utf8');

                // If it uses PremiumToolLayout but doesn't have hideHeader={true}
                if (content.includes('<PremiumToolLayout') && !content.includes('hideHeader')) {

                    // Inject hideHeader={true} after <PremiumToolLayout
                    content = content.replace(/<PremiumToolLayout/, '<PremiumToolLayout\n            hideHeader={true}');

                    fs.writeFileSync(pagePath, content);
                    patchedCount++;
                    console.log(`Patched hideHeader for legacy tool: ${file}`);
                }
            }
        }
    });

    console.log(`\nFinished. Patched ${patchedCount} tools to hide double-headers.`);
}

const TOOLS_DIR = path.join(process.cwd(), 'src/app/tools');
hideHeadersForLegacyTools(TOOLS_DIR);
