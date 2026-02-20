import fs from 'fs';
import path from 'path';

function fixWandImportsRegexStrict(dirPath: string) {
    const files = fs.readdirSync(dirPath);
    let patched = 0;

    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            const pagePath = path.join(fullPath, 'page.tsx');
            if (fs.existsSync(pagePath)) {
                let content = fs.readFileSync(pagePath, 'utf8');

                // If it uses Wand2 but doesn't have the exact word "Wand2" in an import
                if (content.includes('icon={Wand2}')) {
                    const hasWandImport = /import\s+{([^}]*Wand2[^}]*)}\s+from\s+['"]lucide-react['"]/.test(content);

                    if (!hasWandImport) {
                        // Find any existing lucide import
                        const lucideMatch = content.match(/import\s+{([^}]+)}\s+from\s+['"]lucide-react['"]/);
                        if (lucideMatch) {
                            // Inject Wand2 into the existing import block
                            content = content.replace(lucideMatch[0], `import { ${lucideMatch[1].trim()}, Wand2 } from 'lucide-react'`);
                        } else {
                            // No lucide import exists at all, add a fresh one at the top
                            content = `import { Wand2 } from 'lucide-react';\n` + content;
                        }
                        fs.writeFileSync(pagePath, content);
                        patched++;
                        console.log(`Patched Wand2 import in: ${pagePath}`);
                    }
                }
            }
        }
    });
    console.log(`\nFinished checking Wand2 imports. Patched: ${patched} files.`);
}

const TOOLS_DIR = path.join(process.cwd(), 'src/app/tools');
fixWandImportsRegexStrict(TOOLS_DIR);
