import * as fs from 'fs';
import * as path from 'path';

const toolsDir = path.join(process.cwd(), 'src/app/tools');

function fixUseClient(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            fixUseClient(fullPath);
        } else if (entry.isFile() && fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');

            // Check if file contains 'use client' or "use client"
            if (content.includes("'use client'") || content.includes('"use client"')) {
                const lines = content.split('\n');
                let useClientIndex = -1;

                for (let i = 0; i < lines.length; i++) {
                    if (lines[i].includes("'use client'") || lines[i].includes('"use client"')) {
                        useClientIndex = i;
                        break;
                    }
                }

                // If 'use client' is found but it's not the very first line (index 0)
                if (useClientIndex > 0) {
                    console.log(`Fixing ${fullPath}`);
                    const useClientLine = lines[useClientIndex];
                    // Remove it from its current position
                    lines.splice(useClientIndex, 1);
                    // Add it to the top
                    lines.unshift(useClientLine);

                    fs.writeFileSync(fullPath, lines.join('\n'));
                }
            }
        }
    }
}

fixUseClient(toolsDir);
console.log("Done fixing use client directives!");
