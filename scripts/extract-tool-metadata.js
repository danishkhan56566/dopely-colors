const fs = require('fs');
const path = require('path');

const missingTools = [
  'biometric', 'collab-lab', 'contrast-grid', 'duotone', 'dynamic-contrast',
  'eco-impact', 'fluid', 'gesture-mix', 'glass', 'linter', 'mesh',
  'micro-interactions', 'mixer', 'scraper', 'tokens', 'voice-color'
];

const toolsDir = path.join(process.cwd(), 'src/app/tools');
const metadata = {};

for (const tool of missingTools) {
  const pagePath = path.join(toolsDir, tool, 'page.tsx');
  if (fs.existsSync(pagePath)) {
    const content = fs.readFileSync(pagePath, 'utf8');
    const titleMatch = content.match(/title=\{"([^"]+)"\}|title="([^"]+)"|title=\{`([^`]+)`\}/);
    const descMatch = content.match(/description=\{"([^"]+)"\}|description="([^"]+)"|description=\{`([^`]+)`\}/);

    let title = 'Unknown';
    if (titleMatch) title = titleMatch[1] || titleMatch[2] || titleMatch[3] || 'Unknown';

    let description = 'Unknown';
    if (descMatch) description = descMatch[1] || descMatch[2] || descMatch[3] || 'Unknown';

    metadata[tool] = { title, description };
  }
}

console.log(JSON.stringify(metadata, null, 2));
