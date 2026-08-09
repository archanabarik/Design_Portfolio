const puppeteer = require('puppeteer');
const path = require('path');

const SECTIONS = [
  { name: '00-full-page', scrollTo: 0 },
  { name: '01-hero-h1', scrollTo: 0 },
  { name: '02-my-role', selector: '#role' },
  { name: '03-context-opportunity', selector: '#context' },
  { name: '04-bet-we-made', selector: '#bets' },
  { name: '05-design-approach', selector: '#design-approach' },
  { name: '06-impact', selector: '#impact' },
  { name: '07-evolution', selector: '#evolution' },
];

async function captureScreenshots() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await page.setCacheEnabled(false);
  await page.setViewport({ width: 1280, height: 900 });

  await page.goto('http://localhost:8090/Works/rsa.html', {
    waitUntil: 'networkidle0',
    timeout: 15000,
  });

  const outputDir = path.join(__dirname, 'screenshots');
  const fs = require('fs');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  for (const section of SECTIONS) {
    try {
      if (section.selector) {
        await page.evaluate((sel) => {
          const el = document.querySelector(sel);
          if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
        }, section.selector);
      } else {
        await page.evaluate(() => window.scrollTo(0, 0));
      }
      await new Promise((r) => setTimeout(r, 400));

      const filename = `${section.name}.png`;
      await page.screenshot({ path: path.join(outputDir, filename) });
      console.log(`Saved: ${filename}`);
    } catch (e) {
      console.warn(`Skipped ${section.name}:`, e.message);
    }
  }

  // Full page screenshot
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: path.join(outputDir, 'full-page.png'),
    fullPage: true,
  });
  console.log('Saved: full-page.png');

  await browser.close();
  console.log(`\nScreenshots saved to ${outputDir}/`);
}

captureScreenshots().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
