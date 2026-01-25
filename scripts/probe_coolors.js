
// const fetch = require('node-fetch');

async function probeWithSession() {
    console.log('--- Probing with Session ---');
    const endpoint = 'https://coolors.co/ajax/get_palettes';
    const referer = 'https://coolors.co/palettes/trending';

    try {
        // 1. Get Cookie
        const initialRes = await fetch(referer, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            }
        });

        const cookies = initialRes.headers.get('set-cookie');
        console.log('Cookies Raw:', cookies);

        // 2. POST with Cookie
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Origin': 'https://coolors.co',
            'Referer': referer,
            'Cookie': cookies || ''
        };

        const res = await fetch(endpoint, {
            method: 'POST',
            headers: headers,
            body: 'sort=LATEST&type=PALETTE'
        });

        const text = await res.text();
        console.log(`Response: ${res.status}`);
        if (text.startsWith('{')) {
            console.log('JSON Body:', text.substring(0, 300));
        }

    } catch (e) {
        console.error(e);
    }
}

probeWithSession();
