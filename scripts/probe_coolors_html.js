
// const fetch = require('node-fetch'); // Using global fetch


async function probeHtml() {
    console.log('--- Probing Coolors HTML ---');
    const url = 'https://coolors.co/palettes/trending';
    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        console.log(`Status: ${res.status}`);
        const html = await res.text();

        // Check for palette links
        const linkMatch = html.match(/\/palette\/[0-9a-fA-F]{6}-[0-9a-fA-F]{6}/g);
        if (linkMatch) {
            console.log(`FOUND ${linkMatch.length} palette links!`);
            console.log('Sample:', linkMatch[0]);
        } else {
            console.log('No /palette/ links found in static HMTL.');
        }

        // Check for JSON embedded data (Next.js props often stored in <script id="__NEXT_DATA__">)
        if (html.includes('__NEXT_DATA__')) {
            console.log('Found __NEXT_DATA__ script tag!');
        }

    } catch (e) {
        console.error(e);
    }
}

// Handle fetch polyfill if needed
if (!globalThis.fetch) {
    globalThis.fetch = require('node-fetch');
}

probeHtml();
