import fs from 'fs';
import path from 'path';

function fixWandImports(dirPath: string) {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            const pagePath = path.join(fullPath, 'page.tsx');
            if (fs.existsSync(pagePath)) {
                let content = fs.readFileSync(pagePath, 'utf8');

                // If it uses Wand2 but doesn't import it
                if (content.includes('icon={Wand2}') && !content.includes('Wand2') && !content.includes('import { Wand2 }')) {
                    // Find existing lucide import
                    const lucideMatch = content.match(/import\s+{([^}]+)}\s+from\s+['"]lucide-react['"]/);
                    if (lucideMatch && !lucideMatch[0].includes('Wand2')) {
                        content = content.replace(lucideMatch[0], `import { ${lucideMatch[1].trim()}, Wand2 } from 'lucide-react'`);
                    } else if (!lucideMatch) {
                        content = `import { Wand2 } from 'lucide-react';\n` + content;
                    }
                    fs.writeFileSync(pagePath, content);
                    console.log(`Fixed Wand2 import in: ${pagePath}`);
                }
            }
        }
    });
}

const TOOLS_DIR = path.join(process.cwd(), 'src/app/tools');
fixWandImports(TOOLS_DIR);
