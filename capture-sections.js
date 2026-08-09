const puppeteer = require('puppeteer');
const path = require('path');

const SECTIONS = [
  { name: '00-full-page', scrollTo: 0 },
  { name: '01-hero', scrollTo: 0 },
  { name: '02-my-role', selector: '#role' },
  { name: '03-context', selector: '#context' },
  { name: '04-strategy', selector: '#bets' },
  { name: '05-design-approach', selector: '#design-approach' },
  { name: '06-impact', selector: '#impact' },
  { name: '07-evolution', selector: '#evolution' },
];

async function capture() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setCacheEnabled(false);
  await page.setViewport({ width: 1280, height: 900 });

  await page.goto('http://localhost:8090/Works/rsa.html?v=3', {
    waitUntil: 'networkidle0',
    timeout: 15000,
  });

  const outputDir = path.join(__dirname, 'screenshots');
  const fs = require('fs');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  // Full page
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: path.join(outputDir, '00-full-page.png'), fullPage: true });
  console.log('Saved: 00-full-page.png');

  for (const s of SECTIONS.slice(1)) {
    if (s.selector) {
      await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      }, s.selector);
    } else {
      await page.evaluate(() => window.scrollTo(0, 0));
    }
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: path.join(outputDir, `${s.name}.png`) });
    console.log(`Saved: ${s.name}.png`);
  }

  await browser.close();
  console.log('\nDone.');
}

capture().catch((e) => { console.error(e); process.exit(1); });
