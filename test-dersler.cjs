const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER_CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER_ERROR:', error.message));

  console.log('Navigating to http://localhost:4173/dersler...');
  await page.goto('http://localhost:4173/dersler', { waitUntil: 'networkidle2' }).catch(e => console.log('Goto error:', e.message));
  
  await page.screenshot({ path: 'dersler_crash.png' });
  console.log('Screenshot saved.');
  
  await browser.close();
})();
