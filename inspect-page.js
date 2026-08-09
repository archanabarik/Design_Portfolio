const puppeteer = require('puppeteer');
const path = require('path');

async function inspectPage() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // Track network requests
  const requests = [];
  page.on('request', (req) => requests.push({ url: req.url(), resourceType: req.resourceType() }));
  page.on('requestfailed', (req) => requests.push({ url: req.url(), failed: true }));

  await page.setCacheEnabled(false);
  await page.setViewport({ width: 1280, height: 900 });

  await page.goto('http://localhost:8090/Works/rsa.html?v=2', {
    waitUntil: 'networkidle0',
    timeout: 15000,
  });

  const outputDir = path.join(__dirname, 'screenshots');
  const fs = require('fs');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  // Check if project-style.css loaded
  const cssCheck = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    const projectStyle = links.find((l) => l.href.includes('project-style.css'));
    const stylesLoaded = links.map((l) => ({ href: l.href, loaded: l.sheet !== null }));
    return {
      projectStyleLink: projectStyle ? projectStyle.href : null,
      projectStyleLoaded: projectStyle ? projectStyle.sheet !== null : false,
      allStyles: stylesLoaded,
    };
  });
  console.log('CSS Load Check:', JSON.stringify(cssCheck, null, 2));

  // Check computed styles on card elements
  const styleCheck = await page.evaluate(() => {
    const infoCard = document.querySelector('.cs-info-card');
    const impactCard = document.querySelector('.cs-impact-card');
    const challengeBox = document.querySelector('.cs-challenge-box.red');
    const getStyles = (el) => {
      if (!el) return null;
      const s = window.getComputedStyle(el);
      return {
        backgroundColor: s.backgroundColor,
        border: s.border,
        borderRadius: s.borderRadius,
        padding: s.padding,
      };
    };
    return {
      csInfoCard: getStyles(infoCard),
      csImpactCard: getStyles(impactCard),
      csChallengeBoxRed: getStyles(challengeBox),
    };
  });
  console.log('Computed Styles Check:', JSON.stringify(styleCheck, null, 2));

  // Screenshots
  const sections = [
    { name: '01-hero-section', scrollTo: 0 },
    { name: '02-my-role-info-grid', selector: '#role' },
    { name: '03-context-problem-challenge', selector: '#context' },
    { name: '04-impact-grid', selector: '#impact' },
  ];

  for (const s of sections) {
    if (s.selector) {
      await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      }, s.selector);
    } else {
      await page.evaluate(() => window.scrollTo(0, 0));
    }
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({ path: path.join(outputDir, `${s.name}.png`) });
    console.log(`Saved: ${s.name}.png`);
  }

  await browser.close();

  // Report network
  const cssRequests = requests.filter((r) => r.url.includes('.css'));
  console.log('\nCSS requests:', cssRequests.map((r) => ({ url: r.url, failed: r.failed })));
}

inspectPage().catch((e) => {
  console.error(e);
  process.exit(1);
});
