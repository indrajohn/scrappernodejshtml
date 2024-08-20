const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

module.exports = async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).send('URL is required');
  }

  let browser = null;

  try {
    console.log(`Fetching URL: ${url}`);
    console.time('Total time');

    console.time('Browser launch');
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      defaultViewport: chromium.defaultViewport,
    });
    console.timeEnd('Browser launch');

    console.time('Page load');
    const page = await browser.newPage();

    // Block unnecessary resources to speed up load time
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto(url, {
      waitUntil: 'networkidle0', 
      timeout: 60000, 
    });

    console.timeEnd('Page load');

    console.time('Content retrieval');
    const html = await page.content();
    console.timeEnd('Content retrieval');
    console.timeEnd('Total time');

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    console.error('Error fetching page:', error);
    res.status(500).send('Error fetching page content');
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};
