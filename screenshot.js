const { chromium } = require('playwright');
const fs = require('fs');

// FIX fetch en Node
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

(async () => {

  const fecha = new Date().toISOString().split('T')[0];
  const dir = 'screenshots';

  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });

  // PORTADA
  await page.goto('https://TUSITIO.COM', { waitUntil: 'networkidle' });
  await page.screenshot({
    path: `${dir}/portada-${fecha}.jpg`,
    fullPage: true,
    type: 'jpeg',
    quality: 90
  });

  // ÚLTIMA NOTA
  const res = await fetch('https://TUSITIO.COM/wp-json/wp/v2/posts?per_page=1');
  const data = await res.json();
  const url = data[0].link;

  await page.goto(url, { waitUntil: 'networkidle' });
  await page.screenshot({
    path: `${dir}/nota-${fecha}.jpg`,
    fullPage: true,
    type: 'jpeg',
    quality: 90
  });

  await browser.close();
})();
