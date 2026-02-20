const fs = require('fs');
const path = require('path');

const toolsDir = path.join(process.cwd(), 'src/app/tools');
const tools = fs.readdirSync(toolsDir);
let missing = 0;
let total = 0;

for (const tool of tools) {
    const pagePath = path.join(toolsDir, tool, 'page.tsx');
    if (fs.existsSync(pagePath)) {
        total++;
        const content = fs.readFileSync(pagePath, 'utf8');
        if (!content.includes('guide={') && !content.includes('<Guide') && !content.includes('Guide />')) {
            console.log(`Tool missing guide: ${tool}`);
            missing++;
        }
    }
}

console.log(`\nTotal tools: ${total}`);
console.log(`Tools missing guides: ${missing}`);
