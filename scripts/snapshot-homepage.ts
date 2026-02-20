import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Desktop
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight - 1800));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: '/Users/danishk/.gemini/antigravity/brain/67d9601d-1672-4983-8722-d9fc63ae2557/homepage_blog_desktop.webp' });

  // Mobile
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight - 2500));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: '/Users/danishk/.gemini/antigravity/brain/67d9601d-1672-4983-8722-d9fc63ae2557/homepage_blog_mobile.webp' });

  await browser.close();
}
run();
