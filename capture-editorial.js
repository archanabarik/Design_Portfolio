const puppeteer = require('puppeteer');
const path = require('path');

const SECTIONS = [
  { name: '01-hero', selector: null },
  { name: '02-summary', selector: '#summary' },
  { name: '03-context', selector: '#context' },
  { name: '04-strategy-bets', selector: '#bets' },
  { name: '05-design-approach', selector: '#design-approach' },
  { name: '06-final-designs', selector: '#screens' },
  { name: '07-impact', selector: '#impact' },
  { name: '08-evolution', selector: '#evolution' },
];

async function capture() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setCacheEnabled(false);
  await page.setViewport({ width: 1280, height: 900 });

  await page.goto('http://localhost:8090/Works/rsa.html?v=10', {
    waitUntil: 'networkidle0',
    timeout: 15000,
  });

  const outputDir = path.join(__dirname, 'screenshots');
  const fs = require('fs');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const styles = await page.evaluate(() => {
    const get = (sel, props) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const s = window.getComputedStyle(el);
      return props.reduce((o, p) => ({ ...o, [p]: s[p] }), {});
    };
    return {
      impactNumber: get('.cs-impact-number', ['fontSize', 'fontWeight']),
      numberedItem: get('.cs-numbered-item', ['borderBottom', 'boxShadow']),
      bodyListLi: get('.cs-body-list li', ['borderBottom', 'borderTop']),
    };
  });
  console.log('Computed styles:', JSON.stringify(styles, null, 2));

  for (const s of SECTIONS) {
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

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: path.join(outputDir, '00-full-page.png'), fullPage: true });
  console.log('Saved: 00-full-page.png');

  await browser.close();
  console.log('\nDone.');
}

capture().catch((e) => { console.error(e); process.exit(1); });
