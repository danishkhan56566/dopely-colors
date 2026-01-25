'use server';

import { detectPalette } from '@/lib/smart-palette';
import sharp from 'sharp';

const COLORHUNT_API = 'https://colorhunt.co/php/feed.php';

export async function processBulkImage(imageUrl: string) {
    try {
        const response = await fetch(imageUrl, {
            method: 'HEAD',
            // @ts-ignore
            next: { revalidate: 3600 }
        });
        if (!response.ok) throw new Error('Failed to fetch image');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false };
    }
}

export async function scrapePalettesFromUrl(url: string, limit: number = 50) {
    try {
        if (!url.startsWith('http')) {
            return { error: 'Invalid URL. Please include http:// or https://' };
        }

        // Specialized Handler for ColorHunt
        if (url.includes('colorhunt.co')) {
            return await handleColorHuntImport(url, limit);
        }

        // Coolors is SPA/Protected
        if (url.includes('coolors.co')) {
            return {
                error: "Coolors.co uses advanced protection that blocks our server. Please screenshot the page and use the 'Upload Images' tab (you can paste Ctrl+V!)."
            };
        }

        // Generic Scraper (HTML Fetch + Regex)
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            // @ts-ignore
            next: { revalidate: 0 }
        });

        if (!response.ok) {
            return { error: `Failed to fetch URL: ${response.statusText}` };
        }

        const html = await response.text();

        // 1. Look for standard #123456
        const standardHexRegex = /#([0-9a-fA-F]{6})\b/g;
        let matches: string[] | null = html.match(standardHexRegex);

        // 2. Fallback: Generic 6-char hex in JSON
        if (!matches || matches.length === 0) {
            const jsonHexRegex = /["']([0-9a-fA-F]{6})["']/g;
            const jsonMatches = html.match(jsonHexRegex);
            if (jsonMatches) {
                matches = jsonMatches.map(m => '#' + m.replace(/["']/g, ''));
            }
        }

        // 3. Fallback: Aggressive 6-char word scan
        if (!matches || matches.length === 0) {
            const aggressiveRegex = /\b([0-9a-fA-F]{6})\b/g;
            const potentialMatches = html.match(aggressiveRegex);
            if (potentialMatches) {
                matches = potentialMatches.map(m => '#' + m);
            }
        }

        if (!matches || matches.length === 0) {
            return { error: 'No color codes found on this page codes.' };
        }

        const uniqueColors = Array.from(new Set(matches));
        return chunkColors(uniqueColors, 4);

    } catch (error: any) {
        console.error('Scrape error:', error);
        return { error: error.message };
    }
}

async function handleColorHuntImport(url: string, limit: number) {
    let sort = 'popular';
    let tags = '';

    if (url.includes('/popular')) sort = 'popular';
    else if (url.includes('/new')) sort = 'new';
    else if (url.includes('/random')) sort = 'random';
    else {
        // Try to find tag
        const parts = url.split('/');
        const lastPart = parts[parts.length - 1];
        if (lastPart && !['popular', 'new', 'random', 'palettes'].includes(lastPart)) {
            tags = lastPart;
        }
    }

    try {
        let allPalettes: any[] = [];
        const seenCodes = new Set<string>();
        let step = 0;
        let keepFetching = true;
        // Safety cap: even if limit is high, don't ping more than ~20 times (20 * 30 = 600 palettes)
        const maxSteps = Math.ceil(limit / 30) + 5;

        while (keepFetching && allPalettes.length < limit && step < maxSteps) {
            const body = new URLSearchParams({
                step: step.toString(),
                sort: sort,
                tags: tags,
                timeframe: '30'
            });

            const res = await fetch(COLORHUNT_API, {
                method: 'POST',
                body: body,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Origin': 'https://colorhunt.co',
                    'Referer': url
                },
                // @ts-ignore
                next: { revalidate: 0 }
            });

            if (!res.ok) {
                allPalettes.push({ isDebug: true, msg: `Step ${step} failed with status ${res.status}` });
                keepFetching = false;
                break;
            }

            const rawText = await res.text();
            let data;
            try {
                data = JSON.parse(rawText);
            } catch (e) {
                console.error('Failed to parse ColorHunt JSON at step ' + step);
                keepFetching = false;
                break;
            }

            if (!Array.isArray(data) || data.length === 0) {
                keepFetching = false;
                break;
            }

            let newFound = 0;
            for (const item of data) {
                if (allPalettes.length >= limit) {
                    keepFetching = false;
                    break;
                }

                const code = item.code;
                if (!code || code.length !== 24 || seenCodes.has(code)) continue;

                seenCodes.add(code);

                const colors = [
                    '#' + code.substring(0, 6),
                    '#' + code.substring(6, 12),
                    '#' + code.substring(12, 18),
                    '#' + code.substring(18, 24)
                ];

                allPalettes.push({
                    colors,
                    name: `ColorHunt ${item.date || ''} - ${item.likes} Likes`,
                });
                newFound++;
            }

            if (newFound === 0) {
                keepFetching = false;
            }
            step++;
            await new Promise(r => setTimeout(r, 100));
        }

        return {
            palettes: allPalettes,
            debug: `Fetched ${allPalettes.length} palettes in ${step} steps. Limit: ${limit}.`
        };

    } catch (err: any) {
        return { error: 'ColorHunt API Error: ' + err.message };
    }
}

export async function sliceImagePalettes(formData: FormData) {
    try {
        const file = formData.get('file') as File;
        if (!file) {
            return { error: 'No file uploaded' };
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const image = sharp(buffer);
        const metadata = await image.metadata();
        const width = metadata.width || 0;
        const height = metadata.height || 0;

        if (width === 0 || height === 0) return { error: 'Invalid image dimensions' };

        // 1. Resize for fast scanning (Scan at 500px width)
        const scanWidth = 500;
        const { data: rawData, info } = await image
            .clone()
            .resize({ width: scanWidth })
            .raw()
            .toBuffer({ resolveWithObject: true });

        const rWidth = info.width;
        const rHeight = info.height;
        const channels = info.channels;

        console.log(`[Slice] Processing image: ${width}x${height} -> scanned at ${rWidth}x${rHeight}`);

        // Relaxed threshold for "white/background" (230 is safer for screenshots with slight gray/shadows)
        const isWhite = (r: number, g: number, b: number) => r > 230 && g > 230 && b > 230;

        // 2. Identify Content Rows
        // A row is "content" if it has significant non-white pixels
        const rowIsContent = new Array(rHeight).fill(false);
        for (let y = 0; y < rHeight; y++) {
            let nonWhiteCount = 0;
            for (let x = 0; x < rWidth; x++) {
                const idx = (y * rWidth + x) * channels;
                // Check if NOT white
                if (!isWhite(rawData[idx], rawData[idx + 1], rawData[idx + 2])) {
                    nonWhiteCount++;
                }
            }
            // Threshold: > 5% of width is non-white
            if (nonWhiteCount > rWidth * 0.05) {
                rowIsContent[y] = true;
            }
        }

        const rowSegments: { y1: number, y2: number }[] = [];
        let inSegment = false;
        let startY = 0;

        for (let y = 0; y < rHeight; y++) {
            if (rowIsContent[y] && !inSegment) {
                inSegment = true;
                startY = y;
            } else if (!rowIsContent[y] && inSegment) {
                inSegment = false;
                // Minimum height check
                if ((y - startY) > 10) {
                    rowSegments.push({ y1: startY, y2: y });
                }
            }
        }
        if (inSegment && (rHeight - startY) > 10) {
            rowSegments.push({ y1: startY, y2: rHeight });
        }

        console.log(`[Slice] Found ${rowSegments.length} rows`);

        // 3. Identify Cols within Rows
        const foundRegions: { x: number, y: number, w: number, h: number }[] = [];

        for (const row of rowSegments) {
            const rowHeight = row.y2 - row.y1;
            const colIsContent = new Array(rWidth).fill(false);

            for (let x = 0; x < rWidth; x++) {
                let nonWhiteCount = 0;
                for (let y = row.y1; y < row.y2; y++) {
                    const idx = (y * rWidth + x) * channels;
                    if (!isWhite(rawData[idx], rawData[idx + 1], rawData[idx + 2])) {
                        nonWhiteCount++;
                    }
                }
                // Threshold: > 5% of height is non-white
                if (nonWhiteCount > rowHeight * 0.05) {
                    colIsContent[x] = true;
                }
            }

            let inCol = false;
            let startX = 0;
            for (let x = 0; x < rWidth; x++) {
                if (colIsContent[x] && !inCol) {
                    inCol = true;
                    startX = x;
                } else if (!colIsContent[x] && inCol) {
                    inCol = false;
                    // Min width check
                    if ((x - startX) > 10) {
                        foundRegions.push({
                            x: startX,
                            y: row.y1,
                            w: x - startX,
                            h: rowHeight
                        });
                    }
                }
            }
            if (inCol && (rWidth - startX) > 10) {
                foundRegions.push({
                    x: startX,
                    y: row.y1,
                    w: rWidth - startX,
                    h: rowHeight
                });
            }
        }

        console.log(`[Slice] Found ${foundRegions.length} regions total`);

        // 4. Extract Regions
        const scaleX = width / rWidth;
        const scaleY = height / rHeight;
        const results = [];

        for (const region of foundRegions) {
            const extractRegion = {
                left: Math.floor(region.x * scaleX),
                top: Math.floor(region.y * scaleY),
                width: Math.floor(region.w * scaleX),
                height: Math.floor(region.h * scaleY)
            };

            // Boundary checks
            if (extractRegion.left < 0) extractRegion.left = 0;
            if (extractRegion.top < 0) extractRegion.top = 0;
            if (extractRegion.left + extractRegion.width > width) extractRegion.width = width - extractRegion.left;
            if (extractRegion.top + extractRegion.height > height) extractRegion.height = height - extractRegion.top;

            // Skip invalid
            if (extractRegion.width <= 10 || extractRegion.height <= 10) continue;

            const regionBuffer = await image
                .clone()
                .extract(extractRegion)
                .toBuffer();

            const base64 = `data:image/png;base64,${regionBuffer.toString('base64')}`;
            results.push(base64);
        }

        return {
            images: results,
            debug: `Found ${results.length} palettes.`
        };

    } catch (error: any) {
        console.error('Slice error:', error);
        return { error: 'Failed to slice image: ' + error.message };
    }
}

function chunkColors(colors: string[], size: number) {
    const chunks = [];
    for (let i = 0; i < colors.length; i += size) {
        const chunk = colors.slice(i, i + size);
        if (chunk.length >= 2) {
            chunks.push({
                colors: chunk,
                name: 'scraped',
            });
        }
    }

    // ...
    return { palettes: chunks };
}

import { createClient } from '@supabase/supabase-js';

export async function publishPalettesAdmin(palettes: any[]) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const serviceKey = process.env.SUPABASE_SERVICE_KEY!;

        if (!serviceKey) return { error: 'Server config missing Service Key' };

        // Create Admin Client (Bypasses RLS)
        const adminClient = createClient(supabaseUrl, serviceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });

        const { error } = await adminClient.from('palettes').insert(palettes);
        if (error) throw error;

        return { success: true };

    } catch (err: any) {
        console.error('Admin Publish Error:', err);
        return { error: err.message };
    }
}
