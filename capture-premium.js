const puppeteer = require('puppeteer');
const path = require('path');

const SECTIONS = [
  { name: '01-hero-metrics', selector: null },
  { name: '02-context', selector: '#context' },
  { name: '03-strategy-bets', selector: '#bets' },
  { name: '04-design-approach', selector: '#design-approach' },
  { name: '05-impact', selector: '#impact' },
  { name: '06-key-learning-takeaway', selector: '#evolution' },
];

async function capture() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setCacheEnabled(false);
  await page.setViewport({ width: 1280, height: 900 });

  await page.goto('http://localhost:8090/Works/rsa.html?v=5', {
    waitUntil: 'networkidle0',
    timeout: 15000,
  });

  const outputDir = path.join(__dirname, 'screenshots');
  const fs = require('fs');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  // Get computed styles for key elements
  const styles = await page.evaluate(() => {
    const get = (sel, props) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const s = window.getComputedStyle(el);
      return props.reduce((o, p) => ({ ...o, [p]: s[p] }), {});
    };
    const section = document.querySelector('.section.pt-0');
    return {
      pageBg: section ? window.getComputedStyle(section).backgroundColor : null,
      metricValue: get('.cs-metric-value', ['fontSize', 'fontWeight']),
      betNumber: get('.cs-bet-number', ['fontSize', 'fontWeight']),
      impactValue: get('.cs-impact-value', ['fontSize', 'fontWeight']),
      frameworkTitle: get('.cs-framework-title', ['fontSize', 'fontWeight']),
      keyLearning: get('.cs-key-learning', ['boxShadow', 'background']),
      infoCard: get('.cs-info-card', ['boxShadow', 'backgroundColor']),
      impactCard: get('.cs-impact-card', ['boxShadow', 'backgroundColor']),
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

  await browser.close();
  console.log('\nDone.');
}

capture().catch((e) => { console.error(e); process.exit(1); });
